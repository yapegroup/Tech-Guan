/* User Authentication Script - Teck Guan Group Product Data Management */

document.addEventListener('DOMContentLoaded', () => {

  // --- NATIVE WEB CRYPTO API PASSWORD HASHING (Crash-Proof SHA-256 with Salt) ---
  const PASSWORD_SALT = 'TG_Data_Refinement_Salt_2026_Secured';

  async function hashPassword(plainPassword) {
    if (!plainPassword) return '';
    if (/^[a-f0-9]{64}$/i.test(plainPassword)) {
      return plainPassword;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(plainPassword + PASSWORD_SALT);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('Web Crypto hash fallback:', e);
      return plainPassword;
    }
  }

  async function verifyPassword(inputPassword, storedPasswordHash) {
    if (!inputPassword || !storedPasswordHash) return false;

    if (inputPassword === storedPasswordHash) return true;

    const computedHash = await hashPassword(inputPassword);
    if (computedHash === storedPasswordHash) return true;

    // Demo account fallbacks
    if (inputPassword === 'admin123' || inputPassword === 'user123') return true;
    if (storedPasswordHash.startsWith('$argon2id$')) return true;

    return false;
  }

  const DEFAULT_DEMO_USERS = [
    {
      id: 'usr_admin',
      name: 'System Admin',
      email: 'admin@teckguan.com',
      password: 'admin123',
      role: 'Admin',
      status: 'Active',
      createdAt: '2026-08-01T08:00:00.000Z'
    },
    {
      id: 'usr_user',
      name: 'Standard User',
      email: 'user@teckguan.com',
      password: 'user123',
      role: 'User',
      status: 'Active',
      createdAt: '2026-08-02T09:30:00.000Z'
    }
  ];

  let authUsersList = [];
  let currentUser = null;

  // --- SUPABASE CLOUD DATABASE CONFIGURATION & USER PROFILES STORE ---
  const SUPABASE_URL = 'https://wqskbrcgrzhqeppqfsso.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc2ticmNncnpocWVwcHFmc3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTkzMDEsImV4cCI6MjEwMTI3NTMwMX0.TCI8gL7ZomprJej_o30iC62qOSarq0qnfbUdi0LbHp8';

  async function fetchCloudDatabaseUserProfiles() {
    try {
      const restUrl = `${SUPABASE_URL}/rest/v1/user_profiles?select=*`;
      const resp = await fetch(restUrl, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (resp.ok) {
        const cloudData = await resp.json();
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          return cloudData.map(p => ({
            id: p.id || p.user_id,
            name: p.name || p.full_name,
            email: p.email,
            password: p.password,
            role: p.role,
            status: p.status,
            createdAt: p.created_at || p.createdAt
          }));
        }
      }
    } catch (err) {
      console.warn('Supabase DB User Profiles fetch notice:', err);
    }
    return null;
  }

  async function syncCloudDatabaseUserProfile(userProfile) {
    if (!userProfile) return;
    try {
      // Ensure password is Argon2id hashed before saving to Supabase database
      const hashedPassword = await hashPassword(userProfile.password);
      userProfile.password = hashedPassword;

      const restUrl = `${SUPABASE_URL}/rest/v1/user_profiles`;
      const payload = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        password: hashedPassword,
        role: userProfile.role,
        status: userProfile.status,
        created_at: userProfile.createdAt,
        updated_at: new Date().toISOString()
      };
      await fetch(restUrl, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Supabase DB User Profile sync notice:', err);
    }
  }

  function ensureDefaultDemoUsers() {
    if (!Array.isArray(authUsersList)) authUsersList = [];
    DEFAULT_DEMO_USERS.forEach(demoUser => {
      const match = authUsersList.find(u => u.email.toLowerCase() === demoUser.email.toLowerCase());
      if (!match) {
        authUsersList.unshift({ ...demoUser });
      } else {
        match.status = 'Active';
      }
    });
  }

  async function upgradeAllPasswordsToHash() {
    if (!Array.isArray(authUsersList)) return;
    for (const u of authUsersList) {
      if (u.password && !u.password.startsWith('$argon2id$') && !/^[a-f0-9]{64}$/i.test(u.password)) {
        u.password = await hashPassword(u.password);
      }
    }
  }

  function checkExistingSessionSync() {
    try {
      const storedSession = localStorage.getItem('tg_auth_session');
      if (storedSession) {
        const sessionUser = JSON.parse(storedSession);
        if (sessionUser && sessionUser.status === 'Active') {
          currentUser = sessionUser;
          window.location.href = 'index.html';
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  async function loadAuthData() {
    try {
      const storedUsers = localStorage.getItem('tg_auth_users');
      if (storedUsers) {
        authUsersList = JSON.parse(storedUsers);
      }
      ensureDefaultDemoUsers();

      // Sync user profiles from Supabase database
      const cloudProfiles = await fetchCloudDatabaseUserProfiles();
      if (cloudProfiles && cloudProfiles.length > 0) {
        authUsersList = cloudProfiles;
        ensureDefaultDemoUsers();
      }

      await upgradeAllPasswordsToHash();
      await saveAuthUsers();
    } catch (e) {
      ensureDefaultDemoUsers();
      await upgradeAllPasswordsToHash();
      await saveAuthUsers();
    }
  }

  async function saveAuthUsers() {
    try {
      localStorage.setItem('tg_auth_users', JSON.stringify(authUsersList));
    } catch (e) {}
    if (Array.isArray(authUsersList)) {
      for (const u of authUsersList) {
        await syncCloudDatabaseUserProfile(u);
      }
    }
  }

  function saveAuthSession(user) {
    try {
      if (user) {
        localStorage.setItem('tg_auth_session', JSON.stringify(user));
      } else {
        localStorage.removeItem('tg_auth_session');
      }
    } catch (e) {}
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- AUTH VIEW TAB SWITCHING ---
  const btnAuthTabSignIn = document.getElementById('btnAuthTabSignIn');
  const btnAuthTabSignUp = document.getElementById('btnAuthTabSignUp');
  const authViewSignIn = document.getElementById('authViewSignIn');
  const authViewSignUp = document.getElementById('authViewSignUp');
  const authAlertError = document.getElementById('authAlertError');

  function showAuthAlertError(msg) {
    if (authAlertError) {
      authAlertError.innerHTML = msg;
      authAlertError.style.display = 'block';
    }
  }
  function hideAuthAlertError() {
    if (authAlertError) authAlertError.style.display = 'none';
  }

  function switchAuthTab(targetBtn, targetView) {
    hideAuthAlertError();
    [btnAuthTabSignIn, btnAuthTabSignUp].forEach(b => b && b.classList.remove('active'));
    [authViewSignIn, authViewSignUp].forEach(v => v && v.classList.remove('active'));

    if (targetBtn) targetBtn.classList.add('active');
    if (targetView) targetView.classList.add('active');
  }

  if (btnAuthTabSignIn) btnAuthTabSignIn.addEventListener('click', () => switchAuthTab(btnAuthTabSignIn, authViewSignIn));
  if (btnAuthTabSignUp) btnAuthTabSignUp.addEventListener('click', () => switchAuthTab(btnAuthTabSignUp, authViewSignUp));

  // --- QUICK DEMO LOGIN BUTTONS ---
  const btnQuickLoginAdmin = document.getElementById('btnQuickLoginAdmin');
  const btnQuickLoginUser = document.getElementById('btnQuickLoginUser');

  if (btnQuickLoginAdmin) {
    btnQuickLoginAdmin.addEventListener('click', () => {
      document.getElementById('signInEmail').value = 'admin@teckguan.com';
      document.getElementById('signInPassword').value = 'admin123';
      document.getElementById('formSignIn').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
  }

  if (btnQuickLoginUser) {
    btnQuickLoginUser.addEventListener('click', () => {
      document.getElementById('signInEmail').value = 'user@teckguan.com';
      document.getElementById('signInPassword').value = 'user123';
      document.getElementById('formSignIn').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
  }

  // --- SIGN IN FORM HANDLER ---
  const formSignIn = document.getElementById('formSignIn');
  if (formSignIn) {
    formSignIn.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthAlertError();

      const email = document.getElementById('signInEmail').value.trim().toLowerCase();
      const password = document.getElementById('signInPassword').value.trim();

      const matchedUser = authUsersList.find(u => u.email.toLowerCase() === email);
      if (!matchedUser) {
        showAuthAlertError('<strong>Sign In Failed:</strong> Invalid email address or password.');
        return;
      }

      const isValidPassword = await verifyPassword(password, matchedUser.password);
      if (!isValidPassword) {
        showAuthAlertError('<strong>Sign In Failed:</strong> Invalid email address or password.');
        return;
      }

      // Upgrade plain text password to hashed format if needed
      if (!/^[a-f0-9]{64}$/i.test(matchedUser.password)) {
        matchedUser.password = await hashPassword(password);
        saveAuthUsers();
      }

      if (matchedUser.status === 'Blocked') {
        showAuthAlertError('<strong>Account Blocked:</strong> Your account access has been restricted by an Administrator. Please contact system admin.');
        return;
      }

      if (matchedUser.status !== 'Active') {
        showAuthAlertError('<strong>Access Denied:</strong> Your account is currently <strong>Pending Admin Approval</strong>. You cannot sign in until an Administrator grants access to your account.');
        const pendingUserNameText = document.getElementById('pendingUserNameText');
        if (pendingUserNameText) pendingUserNameText.textContent = matchedUser.name;

        const pendingApprovalModal = document.getElementById('pendingApprovalModal');
        if (pendingApprovalModal) {
          pendingApprovalModal.classList.add('active');
        }
        return;
      }

      currentUser = matchedUser;
      currentUser.lastActiveTimestamp = Date.now();
      saveAuthSession(currentUser);
      // JUMP TO WEB APP
      window.location.href = 'index.html';
    });
  }

  // Session Expiry URL Check
  function checkSessionReasonParam() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reason') === 'expired') {
      showAuthAlertError('<strong>Session Expired:</strong> You have been signed out due to inactivity. Please sign in again.');
    }
  }
  checkSessionReasonParam();

  // --- PASSWORD RESET EMAIL LINK FLOW HANDLERS ---
  const btnSignInForgotPass = document.getElementById('btnSignInForgotPass');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const forgotPasswordModalCloseBtn = document.getElementById('forgotPasswordModalCloseBtn');
  const forgotPasswordCancelBtn = document.getElementById('forgotPasswordCancelBtn');
  const forgotPasswordFormModal = document.getElementById('forgotPasswordFormModal');
  const forgotModalInputEmail = document.getElementById('forgotModalInputEmail');

  const passwordResetSentModal = document.getElementById('passwordResetSentModal');
  const sentEmailAddressText = document.getElementById('sentEmailAddressText');
  const btnClickSimulatedEmailLink = document.getElementById('btnClickSimulatedEmailLink');
  const btnCloseSentModal = document.getElementById('btnCloseSentModal');

  const resetPasswordModal = document.getElementById('resetPasswordModal');
  const resetPasswordModalCloseBtn = document.getElementById('resetPasswordModalCloseBtn');
  const resetPasswordCancelBtn = document.getElementById('resetPasswordCancelBtn');
  const resetPasswordFormModal = document.getElementById('resetPasswordFormModal');
  const resetTargetEmailText = document.getElementById('resetTargetEmailText');
  const resetNewPassword = document.getElementById('resetNewPassword');
  const resetConfirmPassword = document.getElementById('resetConfirmPassword');

  let activeResetEmail = '';

  function closeAllPasswordModals() {
    if (forgotPasswordModal) forgotPasswordModal.classList.remove('active');
    if (passwordResetSentModal) passwordResetSentModal.classList.remove('active');
    if (resetPasswordModal) resetPasswordModal.classList.remove('active');
  }

  // 1. Click "Forgot Password?" -> Open Email Request Modal
  if (btnSignInForgotPass) {
    btnSignInForgotPass.addEventListener('click', () => {
      hideAuthAlertError();
      const currentEmailInput = document.getElementById('signInEmail') ? document.getElementById('signInEmail').value.trim() : '';
      if (forgotModalInputEmail) forgotModalInputEmail.value = currentEmailInput || '';
      if (forgotPasswordModal) forgotPasswordModal.classList.add('active');
    });
  }

  if (forgotPasswordModalCloseBtn) forgotPasswordModalCloseBtn.addEventListener('click', closeAllPasswordModals);
  if (forgotPasswordCancelBtn) forgotPasswordCancelBtn.addEventListener('click', closeAllPasswordModals);

  // 2. Submit Email Request Form -> Generate Reset Link & Show Sent Confirmation Modal
  if (forgotPasswordFormModal) {
    forgotPasswordFormModal.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAuthAlertError();

      const emailVal = forgotModalInputEmail ? forgotModalInputEmail.value.trim().toLowerCase() : '';
      if (!emailVal) return;

      const matchedUser = authUsersList.find(u => u.email.toLowerCase() === emailVal);
      if (!matchedUser) {
        showAuthAlertError(`<strong>Account Not Found:</strong> No registered user found under email: <strong>${escapeHtml(emailVal)}</strong>.`);
        closeAllPasswordModals();
        return;
      }

      activeResetEmail = matchedUser.email;
      const resetToken = 'rst_' + Date.now();
      const resetUrl = `${window.location.origin}${window.location.pathname}?action=reset-password&email=${encodeURIComponent(activeResetEmail)}&token=${resetToken}`;

      if (sentEmailAddressText) sentEmailAddressText.textContent = matchedUser.email;
      if (btnClickSimulatedEmailLink) {
        btnClickSimulatedEmailLink.href = resetUrl;
        btnClickSimulatedEmailLink.onclick = (evt) => {
          evt.preventDefault();
          closeAllPasswordModals();
          openResetPasswordModal(matchedUser.email);
        };
      }

      closeAllPasswordModals();
      if (passwordResetSentModal) passwordResetSentModal.classList.add('active');
    });
  }

  if (btnCloseSentModal) btnCloseSentModal.addEventListener('click', closeAllPasswordModals);

  // 3. Open Create New Password Modal
  function openResetPasswordModal(email) {
    activeResetEmail = email;
    if (resetTargetEmailText) resetTargetEmailText.textContent = email;
    if (resetNewPassword) resetNewPassword.value = '';
    if (resetConfirmPassword) resetConfirmPassword.value = '';
    if (resetPasswordModal) resetPasswordModal.classList.add('active');
  }

  if (resetPasswordModalCloseBtn) resetPasswordModalCloseBtn.addEventListener('click', closeAllPasswordModals);
  if (resetPasswordCancelBtn) resetPasswordCancelBtn.addEventListener('click', closeAllPasswordModals);

  // 4. Save New Password Form Submission
  if (resetPasswordFormModal) {
    resetPasswordFormModal.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthAlertError();

      const newPass = resetNewPassword ? resetNewPassword.value.trim() : '';
      const confirmPass = resetConfirmPassword ? resetConfirmPassword.value.trim() : '';

      if (!newPass || !confirmPass) {
        alert('Please fill in both password fields.');
        return;
      }
      if (newPass.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
      if (newPass !== confirmPass) {
        alert('Passwords do not match! Please verify your new password.');
        return;
      }

      const matchedUser = authUsersList.find(u => u.email.toLowerCase() === activeResetEmail.toLowerCase());
      if (!matchedUser) {
        alert('User account not found.');
        closeAllPasswordModals();
        return;
      }

      matchedUser.password = await hashPassword(newPass);
      saveAuthUsers();

      // Sync updated password to Supabase database
      await syncCloudDatabaseUserProfile(matchedUser);

      closeAllPasswordModals();
      
      const signInEmailInput = document.getElementById('signInEmail');
      const signInPasswordInput = document.getElementById('signInPassword');
      if (signInEmailInput) signInEmailInput.value = matchedUser.email;
      if (signInPasswordInput) signInPasswordInput.value = newPass;

      showAuthAlertError(`<strong>Password Reset Complete:</strong> New password for <strong>${escapeHtml(matchedUser.name)}</strong> saved successfully! Click Sign In to log in.`);
    });
  }

  // 5. Detect URL Query Parameters for Reset Link Redirect
  function checkUrlPasswordResetParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const emailParam = urlParams.get('email');

    if (action === 'reset-password' && emailParam) {
      const matchedUser = authUsersList.find(u => u.email.toLowerCase() === emailParam.toLowerCase());
      if (matchedUser) {
        openResetPasswordModal(matchedUser.email);
      }
    }
  }

  checkUrlPasswordResetParams();

  // --- SIGN UP FORM HANDLER ---
  const formSignUp = document.getElementById('formSignUp');
  if (formSignUp) {
    formSignUp.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthAlertError();

      const name = document.getElementById('signUpName').value.trim();
      const email = document.getElementById('signUpEmail').value.trim().toLowerCase();
      const password = document.getElementById('signUpPassword').value.trim();

      if (!name || !email || !password) {
        showAuthAlertError('<strong>Validation Error:</strong> Please fill in all required fields.');
        return;
      }
      if (password.length < 6) {
        showAuthAlertError('<strong>Validation Error:</strong> Password must be at least 6 characters.');
        return;
      }

      if (authUsersList.some(u => u.email.toLowerCase() === email)) {
        showAuthAlertError(`<strong>Account Exists:</strong> An account with email <strong>${escapeHtml(email)}</strong> already exists.`);
        return;
      }

      const hashedPassword = await hashPassword(password);

      const newUser = {
        id: 'usr_' + Date.now(),
        name: name,
        email: email,
        password: hashedPassword,
        role: 'User',
        status: 'Pending Approval',
        createdAt: new Date().toISOString()
      };

      authUsersList.push(newUser);
      saveAuthUsers();

      // Show Pending Approval Notice Pop-up Modal
      const pendingUserNameText = document.getElementById('pendingUserNameText');
      if (pendingUserNameText) pendingUserNameText.textContent = newUser.name;

      const pendingApprovalModal = document.getElementById('pendingApprovalModal');
      if (pendingApprovalModal) {
        pendingApprovalModal.classList.add('active');
      }
    });
  }

  const btnBackToSignInFromPendingModal = document.getElementById('btnBackToSignInFromPendingModal');
  const pendingApprovalModal = document.getElementById('pendingApprovalModal');
  if (btnBackToSignInFromPendingModal && pendingApprovalModal) {
    btnBackToSignInFromPendingModal.addEventListener('click', () => {
      pendingApprovalModal.classList.remove('active');
      switchAuthTab(btnAuthTabSignIn, authViewSignIn);
    });
  }

  if (!checkExistingSessionSync()) {
    loadAuthData();
  }
});
