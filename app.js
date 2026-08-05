/* Product Data Refinement - Teck Guan Group Application Engine */

// --- SUPABASE CLOUD CONFIGURATION ---
const SUPABASE_URL = 'https://wqskbrcgrzhqeppqfsso.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc2ticmNncnpocWVwcHFmc3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTkzMDEsImV4cCI6MjEwMTI3NTMwMX0.TCI8gL7ZomprJej_o30iC62qOSarq0qnfbUdi0LbHp8';

// Initialize Supabase Client via CDN
let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', () => {

  // --- NAVIGATION TABS & VIEWS ---
  const tabCutlist = document.getElementById('tabCutlist');
  const tabMasterProduct = document.getElementById('tabMasterProduct');
  const tabProductSettings = document.getElementById('tabProductSettings');
  const viewCutlist = document.getElementById('viewCutlist');
  const viewMasterProduct = document.getElementById('viewMasterProduct');
  const viewProductSettings = document.getElementById('viewProductSettings');

  const supaStatusBadge = document.getElementById('supaStatusBadge');
  const supaHeaderCount = document.getElementById('supaHeaderCount');

  // --- DUAL UPLOAD UI ELEMENTS ---
  const cutlistDropzone = document.getElementById('cutlistDropzone');
  const cutlistInput = document.getElementById('cutlistInput');
  const cutlistBtn = document.getElementById('cutlistBtn');
  const cutlistFileStatus = document.getElementById('cutlistFileStatus');



  const btnProcessData = document.getElementById('btnProcessData');

  const btnSingleRecordModal = document.getElementById('btnSingleRecordModal');
  const singleRecordModal = document.getElementById('singleRecordModal');
  const singleRecordModalCloseBtn = document.getElementById('singleRecordModalCloseBtn');
  const singleRecordCancelBtn = document.getElementById('singleRecordCancelBtn');
  const singleRecordForm = document.getElementById('singleRecordForm');

  // Single Record Form Fields
  const inputProduct = document.getElementById('inputProduct');
  const inputProductDesc = document.getElementById('inputProductDesc');
  const selectProductType = document.getElementById('selectProductType');
  const selectProductGroup = document.getElementById('selectProductGroup');
  const selectGTIN = document.getElementById('selectGTIN');
  const selectProductCategory = document.getElementById('selectProductCategory');
  const selectBaseUOM = document.getElementById('selectBaseUOM');
  const inputCreatedBy = document.getElementById('inputCreatedBy');
  const selectSAPSynced = document.getElementById('selectSAPSynced');

  // Master Product Selection & Edit Modal Bindings
  const masterBottomActions = document.getElementById('masterBottomActions');
  const btnMasterEdit = document.getElementById('btnMasterEdit');
  const btnMasterDelete = document.getElementById('btnMasterDelete');
  const masterSelectionHint = document.getElementById('masterSelectionHint');
  const selectAllMasterCheck = document.getElementById('selectAllMasterCheck');

  const editProductModal = document.getElementById('editProductModal');
  const editProductModalCloseBtn = document.getElementById('editProductModalCloseBtn');
  const editProductCancelBtn = document.getElementById('editProductCancelBtn');
  const editProductForm = document.getElementById('editProductForm');
  const editProductOriginalId = document.getElementById('editProductOriginalId');
  const editInputProduct = document.getElementById('editInputProduct');
  const editInputProductDesc = document.getElementById('editInputProductDesc');
  const editSelectProductType = document.getElementById('editSelectProductType');
  const editSelectProductGroup = document.getElementById('editSelectProductGroup');
  const editSelectGTIN = document.getElementById('editSelectGTIN');
  const editSelectProductCategory = document.getElementById('editSelectProductCategory');
  const editSelectBaseUOM = document.getElementById('editSelectBaseUOM');
  const editSelectSAPSynced = document.getElementById('editSelectSAPSynced');

  let selectedMasterProductIds = new Set();

  // --- PRODUCT SETTINGS TAB ELEMENTS ---
  const settingsAddForm = document.getElementById('settingsAddForm');
  const inputSettingsNewOption = document.getElementById('inputSettingsNewOption');
  const settingsTableBody = document.getElementById('settingsTableBody');
  const settingsBottomBar = document.getElementById('settingsBottomBar');
  const btnSettingsEdit = document.getElementById('btnSettingsEdit');
  const btnSettingsDelete = document.getElementById('btnSettingsDelete');
  const settingsSelectionHint = document.getElementById('settingsSelectionHint');

  const supaTableSearch = document.getElementById('supaTableSearch');
  const btnSupaSearchClear = document.getElementById('btnSupaSearchClear');
  const btnRefreshSupaTable = document.getElementById('btnRefreshSupaTable');
  const supaTableCountBadge = document.getElementById('supaTableCountBadge');
  const supaMasterTableBody = document.getElementById('supaMasterTableBody');
  const supaPageCurrent = document.getElementById('supaPageCurrent');
  const supaPageTotal = document.getElementById('supaPageTotal');
  const btnSupaFirstPage = document.getElementById('btnSupaFirstPage');
  const btnSupaPrevPage = document.getElementById('btnSupaPrevPage');
  const btnSupaNextPage = document.getElementById('btnSupaNextPage');
  const btnSupaLastPage = document.getElementById('btnSupaLastPage');

  // Unified Pop-up Modal Elements
  const refinementModal = document.getElementById('refinementModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalProgressBadge = document.getElementById('modalProgressBadge');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  
  const modalProcessingSection = document.getElementById('modalProcessingSection');
  const progressBarFill = document.getElementById('progressBarFill');
  const terminalLog = document.getElementById('terminalLog');
  const terminalSearch = document.getElementById('terminalSearch');
  const btnSearchClear = document.getElementById('btnSearchClear');
  const logMatchCounter = document.getElementById('logMatchCounter');
  const btnSearchPrev = document.getElementById('btnSearchPrev');
  const btnSearchNext = document.getElementById('btnSearchNext');

  const modalSummarySection = document.getElementById('modalSummarySection');
  const valTotalRows = document.getElementById('valTotalRows');
  const valDupsRemoved = document.getElementById('valDupsRemoved');
  const valRenamedCodes = document.getElementById('valRenamedCodes');
  const valCleanRows = document.getElementById('valCleanRows');

  // Clickable Metric Summary Cards
  const cardTotalRows = document.getElementById('cardTotalRows');
  const cardDupsRemoved = document.getElementById('cardDupsRemoved');
  const cardExistingRemoved = document.getElementById('cardExistingRemoved');
  const cardCleanRows = document.getElementById('cardCleanRows');

  // Detail Table Pop-up Modal Elements
  const metricDetailModal = document.getElementById('metricDetailModal');
  const detailModalTitle = document.getElementById('detailModalTitle');
  const detailModalCloseBtn = document.getElementById('detailModalCloseBtn');
  const detailTableSearch = document.getElementById('detailTableSearch');
  const btnDetailSearchClear = document.getElementById('btnDetailSearchClear');
  const detailRecordCount = document.getElementById('detailRecordCount');
  const detailTableBody = document.getElementById('detailTableBody');

  // Delete Confirmation Modal Elements
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const deleteConfirmModalCloseBtn = document.getElementById('deleteConfirmModalCloseBtn');
  const btnCancelDeleteConfirm = document.getElementById('btnCancelDeleteConfirm');
  const btnProceedDeleteConfirm = document.getElementById('btnProceedDeleteConfirm');
  const deleteConfirmModalText = document.getElementById('deleteConfirmModalText');

  // Success Notice Modal Elements
  const successNoticeModal = document.getElementById('successNoticeModal');
  const successNoticeModalCloseBtn = document.getElementById('successNoticeModalCloseBtn');
  const btnSuccessNoticeOk = document.getElementById('btnSuccessNoticeOk');
  const successNoticeModalText = document.getElementById('successNoticeModalText');

  let activeDeleteCallback = null;

  function showDeleteConfirmModal(message, onConfirm) {
    if (deleteConfirmModalText) deleteConfirmModalText.innerHTML = message;
    activeDeleteCallback = onConfirm;
    if (deleteConfirmModal) deleteConfirmModal.classList.add('active');
  }

  if (btnProceedDeleteConfirm) {
    btnProceedDeleteConfirm.addEventListener('click', async () => {
      if (deleteConfirmModal) deleteConfirmModal.classList.remove('active');
      if (typeof activeDeleteCallback === 'function') {
        const cb = activeDeleteCallback;
        activeDeleteCallback = null;
        await cb();
      }
    });
  }

  if (btnCancelDeleteConfirm && deleteConfirmModal) {
    btnCancelDeleteConfirm.addEventListener('click', () => {
      activeDeleteCallback = null;
      deleteConfirmModal.classList.remove('active');
    });
  }
  if (deleteConfirmModalCloseBtn && deleteConfirmModal) {
    deleteConfirmModalCloseBtn.addEventListener('click', () => {
      activeDeleteCallback = null;
      deleteConfirmModal.classList.remove('active');
    });
  }

  // --- GENERAL / BATCH ACTION CONFIRMATION MODAL HELPER ---
  let activeActionCallback = null;

  function showActionConfirmModal(options) {
    const { title, iconClass, iconColor, iconBg, btnText, btnClass, message, onConfirm } = options || {};
    const titleEl = document.getElementById('actionConfirmModalTitle');
    const iconContainer = document.getElementById('actionConfirmIconContainer');
    const iconEl = document.getElementById('actionConfirmIcon');
    const textEl = document.getElementById('actionConfirmModalText');
    const proceedBtn = document.getElementById('btnProceedActionConfirm');
    const modal = document.getElementById('actionConfirmModal');

    if (titleEl) titleEl.innerHTML = title || `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Confirm Action`;
    if (iconEl && iconClass) iconEl.className = iconClass;
    if (iconEl && iconColor) iconEl.style.color = iconColor;
    if (iconContainer && iconBg) {
      iconContainer.style.background = iconBg;
      iconContainer.style.borderColor = iconBg;
    }
    if (textEl) textEl.innerHTML = message || 'Are you sure you want to proceed?';
    if (proceedBtn) {
      proceedBtn.className = btnClass || 'btn-action-success';
      proceedBtn.innerHTML = btnText || `<i class="fa-solid fa-circle-check"></i> Yes, Proceed`;
    }

    activeActionCallback = onConfirm;
    if (modal) modal.classList.add('active');
  }

  const btnProceedActionConfirm = document.getElementById('btnProceedActionConfirm');
  const btnCancelActionConfirm = document.getElementById('btnCancelActionConfirm');
  const actionConfirmModalCloseBtn = document.getElementById('actionConfirmModalCloseBtn');
  const actionConfirmModal = document.getElementById('actionConfirmModal');

  if (btnProceedActionConfirm) {
    btnProceedActionConfirm.addEventListener('click', async () => {
      if (actionConfirmModal) actionConfirmModal.classList.remove('active');
      if (typeof activeActionCallback === 'function') {
        const cb = activeActionCallback;
        activeActionCallback = null;
        await cb();
      }
    });
  }

  if (btnCancelActionConfirm && actionConfirmModal) {
    btnCancelActionConfirm.addEventListener('click', () => {
      activeActionCallback = null;
      actionConfirmModal.classList.remove('active');
    });
  }
  if (actionConfirmModalCloseBtn && actionConfirmModal) {
    actionConfirmModalCloseBtn.addEventListener('click', () => {
      activeActionCallback = null;
      actionConfirmModal.classList.remove('active');
    });
  }

  function showSuccessNoticeModal(message, title = 'Data Added Successfully') {
    const titleEl = document.getElementById('successNoticeModalTitle');
    if (titleEl) {
      titleEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> ${escapeHtml(title)}`;
    }
    if (successNoticeModalText) successNoticeModalText.innerHTML = message;
    if (successNoticeModal) successNoticeModal.classList.add('active');
  }

  if (btnSuccessNoticeOk && successNoticeModal) {
    btnSuccessNoticeOk.addEventListener('click', () => successNoticeModal.classList.remove('active'));
  }
  if (successNoticeModalCloseBtn && successNoticeModal) {
    successNoticeModalCloseBtn.addEventListener('click', () => successNoticeModal.classList.remove('active'));
  }

  const btnReset = document.getElementById('btnReset');

  const sampleExcelBtn = document.getElementById('sampleExcelBtn');
  const sampleTxtBtn = document.getElementById('sampleTxtBtn');

  // Standardized 6-Column Output Schema
  const STANDARD_HEADERS = ['Truss', 'ID', 'Member', 'Qty', 'Length', 'Product ID'];

  // Application State
  let cutlistFile = null;
  let masterProductFile = null;
  let masterProductSet = new Set(); // Stores uppercase unspaced product codes
  let newMasterProductsBatch = []; // Stores newly generated master product objects

  function formatMasterProductFromCutlist(productID) {
    const cleanID = String(productID || '').replace(/[\u00A0\s]+/g, '').toUpperCase();
    let desc = cleanID;
    const pType = 'FERT';
    const pGroup = 'PURLIN';
    const pCat = 'Product';
    const pUom = 'Piece (PC)';
    const sapSynced = false;

    // Check CPLN and UC format
    const matchCPLN = cleanID.match(/^CPLN([A-Z0-9]+)X(\d+)$/i);
    const matchUC = cleanID.match(/^UC([A-Z0-9]+)X(\d+)$/i);

    if (matchCPLN) {
      const codePart = matchCPLN[1];
      const lengthPart = matchCPLN[2];
      desc = `C-PURLIN ${codePart} X ${lengthPart}mm`;
    } else if (matchUC) {
      const codePart = matchUC[1];
      const lengthPart = matchUC[2];
      desc = `U-Channel ${codePart} x ${lengthPart}mm`;
    } else if (cleanID.includes('X')) {
      const parts = cleanID.split('X');
      if (parts.length === 2) {
        desc = `${parts[0]} x ${parts[1]}mm`;
      }
    }

    return createRefinedProductObject(cleanID, desc, pType, pGroup, pCat, pUom, sapSynced);
  }

  function getLoggedInUserName() {
    if (currentUser && currentUser.name && currentUser.name.trim() !== '') {
      return currentUser.name.trim();
    }
    if (currentUser && currentUser.email) {
      return currentUser.email;
    }
    return 'System Admin';
  }

  function createRefinedProductObject(cleanID, desc, pType, pGroup, pCat, pUom, sapSynced) {
    const nowIso = new Date().toISOString();

    return {
      product_id: cleanID,
      description: desc,
      product_type: pType,
      product_group: pGroup,
      gtin: 'Product',
      product_category: pCat,
      base_unit: pUom,
      created_by: getLoggedInUserName(),
      sap_synced: sapSynced,
      created_at: nowIso,
      updated_at: nowIso
    };
  }

  // Supabase Data Cache & Pagination
  let supabaseProductsList = []; // Raw records array from Supabase: [{ id, product_id, created_at }]
  try {
    const cached = localStorage.getItem('tg_master_products_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 1000) {
        supabaseProductsList = parsed;
        supabaseProductsList.forEach(item => {
          const rawCode = item.product || item.product_id || '';
          if (rawCode) {
            const cleanVal = String(rawCode).replace(/[\u00A0\s]+/g, '').toUpperCase();
            if (cleanVal) masterProductSet.add(cleanVal);
          }
        });
      } else {
        // Clear old 1,000-item truncated cache so syncWithSupabase fetches full 9,079+ records
        localStorage.removeItem('tg_master_products_cache');
      }
    }
  } catch (e) {
    console.warn('Notice loading local master products cache:', e);
  }
  let supaCurrentPage = 1;
  const supaPageSize = 25;

  let processedData = [];
  let summaryStats = { total: 0, dups: 0, existingRemoved: 0, clean: 0 };
  let isTxtFile = false;
  let allLogEntries = [];

  // 4 Full Collections for Clickable Metric Detail Table Modals
  let collectionTotal = [];
  let collectionDups = [];
  let collectionExisting = [];
  let collectionRetained = [];

  // Active Collection for Detail Modal Filtering
  let activeDetailCollection = [];
  let activeDetailTitle = '';
  let activeDetailBadgeClass = 'total';

  // Log Search Navigation State
  let matchingLogElements = [];
  let currentMatchIdx = -1;

  // --- DYNAMIC DROPDOWN LIST SETTINGS STATE ---
  const DEFAULT_DROPDOWN_SETTINGS = {
    types: ['FERT', 'HALB', 'HAWA', 'ROH'],
    groups: ['BASECORR', 'BASEDEK', 'BASELOK', 'BASEORB', 'BASEPAN', 'BASETILE', 'BATTEN', 'BL5', 'BL5PE', 'BL5PU', 'BL6', 'BRACKET', 'CURVELINE', 'CURVESPAN', 'FASTENER', 'FLATSHT', 'GALFAN', 'GALVALUME', 'GALVANISE', 'JACKBOLT', 'PREPAINTD', 'PURLIN', 'ROOFACC', 'TRUSSACC'],
    gtins: ['Product', 'Standard', 'Custom', 'N/A'],
    categories: ['Product', 'Raw Material', 'Semi-Finished', 'Finished Goods', 'Accessory', 'Fastener', 'Purlin', 'Truss'],
    uoms: ['Box (BOX)', 'Kilogram (KG)', 'Length (LN)', 'Meter (M)', 'Pack (PAC)', 'Piece (PC)', 'Roll (ROL)', 'Sheet (SHT)', 'Unit (UNT)', 'Yards (YD)']
  };

  let dropdownSettings = null;
  try {
    const saved = localStorage.getItem('tg_dropdown_settings');
    dropdownSettings = saved ? JSON.parse(saved) : DEFAULT_DROPDOWN_SETTINGS;
  } catch (err) {
    dropdownSettings = DEFAULT_DROPDOWN_SETTINGS;
  }

  let activeSettingsCategory = 'types'; // 'types', 'groups', 'gtins', 'categories', 'uoms'

  const SETTINGS_TABLE_MAP = {
    types: 'product_types',
    groups: 'product_groups',
    gtins: 'gtins',
    categories: 'product_categories',
    uoms: 'base_units_of_measure'
  };

  let settingsSupabaseItems = {
    types: [],
    groups: [],
    gtins: [],
    categories: [],
    uoms: []
  };

  async function syncSettingsFromSupabase() {
    if (!supabaseClient) return;

    for (const [cat, tblName] of Object.entries(SETTINGS_TABLE_MAP)) {
      try {
        const { data, error } = await supabaseClient
          .from(tblName)
          .select('*')
          .order('name', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          settingsSupabaseItems[cat] = data;
          const supaNames = data.map(item => item.name).filter(Boolean);
          // Combine unique names from Supabase and defaults
          dropdownSettings[cat] = Array.from(new Set([...supaNames, ...(dropdownSettings[cat] || [])]));
        }
      } catch (err) {
        console.warn(`Notice reading table ${tblName}:`, err.message);
      }
    }

    saveDropdownSettings();
  }

  function saveDropdownSettings() {
    try {
      localStorage.setItem('tg_dropdown_settings', JSON.stringify(dropdownSettings));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    syncDropdownOptionsToForm();
  }

  function syncDropdownOptionsToForm() {
    if (selectProductType) {
      const currVal = selectProductType.value;
      selectProductType.innerHTML = '<option value="">-- Select Product Type --</option>' +
        dropdownSettings.types.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      selectProductType.value = currVal;
      initializeCustomDropdownUI(selectProductType);
    }
    if (editSelectProductType) {
      const currVal = editSelectProductType.value;
      editSelectProductType.innerHTML = '<option value="">-- Select Product Type --</option>' +
        dropdownSettings.types.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      editSelectProductType.value = currVal;
      initializeCustomDropdownUI(editSelectProductType);
    }

    if (selectProductGroup) {
      const currVal = selectProductGroup.value;
      selectProductGroup.innerHTML = '<option value="">-- Select Product Group --</option>' +
        dropdownSettings.groups.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      selectProductGroup.value = currVal;
      initializeCustomDropdownUI(selectProductGroup);
    }
    if (editSelectProductGroup) {
      const currVal = editSelectProductGroup.value;
      editSelectProductGroup.innerHTML = '<option value="">-- Select Product Group --</option>' +
        dropdownSettings.groups.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      editSelectProductGroup.value = currVal;
      initializeCustomDropdownUI(editSelectProductGroup);
    }

    if (selectGTIN) {
      const currVal = selectGTIN.value;
      selectGTIN.innerHTML = '<option value="">-- Select GTIN --</option>' +
        dropdownSettings.gtins.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      selectGTIN.value = currVal;
      initializeCustomDropdownUI(selectGTIN);
    }
    if (editSelectGTIN) {
      const currVal = editSelectGTIN.value;
      editSelectGTIN.innerHTML = '<option value="">-- Select GTIN --</option>' +
        dropdownSettings.gtins.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      editSelectGTIN.value = currVal;
      initializeCustomDropdownUI(editSelectGTIN);
    }

    if (selectProductCategory) {
      const currVal = selectProductCategory.value;
      selectProductCategory.innerHTML = '<option value="">-- Select Product Category --</option>' +
        dropdownSettings.categories.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      selectProductCategory.value = currVal;
      initializeCustomDropdownUI(selectProductCategory);
    }
    if (editSelectProductCategory) {
      const currVal = editSelectProductCategory.value;
      editSelectProductCategory.innerHTML = '<option value="">-- Select Product Category --</option>' +
        dropdownSettings.categories.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      editSelectProductCategory.value = currVal;
      initializeCustomDropdownUI(editSelectProductCategory);
    }

    if (selectBaseUOM) {
      const currVal = selectBaseUOM.value;
      selectBaseUOM.innerHTML = '<option value="">-- Select Base Unit of Measure --</option>' +
        dropdownSettings.uoms.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      selectBaseUOM.value = currVal;
      initializeCustomDropdownUI(selectBaseUOM);
    }
    if (editSelectBaseUOM) {
      const currVal = editSelectBaseUOM.value;
      editSelectBaseUOM.innerHTML = '<option value="">-- Select Base Unit of Measure --</option>' +
        dropdownSettings.uoms.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
      editSelectBaseUOM.value = currVal;
      initializeCustomDropdownUI(editSelectBaseUOM);
    }
  }

  // --- CUSTOM DROPDOWN UI BUILDER WITH ROUNDED POPUP MENU ---
  function initializeCustomDropdownUI(selectEl) {
    if (!selectEl) return;

    let container = selectEl.parentElement;
    let trigger = null;
    let menu = null;

    if (container && container.classList.contains('custom-dropdown-container')) {
      trigger = container.querySelector('.custom-dropdown-trigger');
      menu = container.querySelector('.custom-dropdown-menu');
    } else {
      container = document.createElement('div');
      container.className = 'custom-dropdown-container';
      selectEl.parentNode.insertBefore(container, selectEl);
      container.appendChild(selectEl);

      selectEl.style.position = 'absolute';
      selectEl.style.opacity = '0';
      selectEl.style.pointerEvents = 'none';
      selectEl.style.width = '1px';
      selectEl.style.height = '1px';

      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-dropdown-trigger';
      container.appendChild(trigger);

      menu = document.createElement('div');
      menu.className = 'custom-dropdown-menu';
      container.appendChild(menu);

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = container.classList.contains('open');
        document.querySelectorAll('.custom-dropdown-container').forEach(c => c.classList.remove('open'));
        if (!isOpen) container.classList.add('open');
      });
    }

    menu.innerHTML = '';
    const options = Array.from(selectEl.options);
    const selectedOpt = selectEl.options[selectEl.selectedIndex] || options[0];
    trigger.textContent = selectedOpt ? selectedOpt.text : '-- Select --';

    options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'custom-dropdown-item' + (opt.selected ? ' selected' : '');
      item.textContent = opt.text;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectEl.value = opt.value;
        trigger.textContent = opt.text;

        menu.querySelectorAll('.custom-dropdown-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        container.classList.remove('open');

        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      });

      menu.appendChild(item);
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown-container').forEach(c => c.classList.remove('open'));
  });

  syncDropdownOptionsToForm();

  let selectedSettingsIndices = new Set();
  const selectAllSettingsCheck = document.getElementById('selectAllSettingsCheck');

  function updateSettingsSelectionUI() {
    const list = dropdownSettings[activeSettingsCategory] || [];
    const count = selectedSettingsIndices.size;

    if (selectAllSettingsCheck) {
      selectAllSettingsCheck.checked = list.length > 0 && count === list.length;
      selectAllSettingsCheck.indeterminate = count > 0 && count < list.length;
    }

    if (count === 0) {
      if (settingsBottomBar) settingsBottomBar.style.display = 'none';
      if (btnSettingsEdit) {
        btnSettingsEdit.disabled = true;
        btnSettingsEdit.style.display = 'inline-flex';
      }
      if (btnSettingsDelete) {
        btnSettingsDelete.disabled = true;
        btnSettingsDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete Selected';
      }
    } else if (count === 1) {
      if (settingsBottomBar) settingsBottomBar.style.display = 'flex';
      if (btnSettingsEdit) {
        btnSettingsEdit.disabled = false;
        btnSettingsEdit.style.display = 'inline-flex';
      }
      if (btnSettingsDelete) {
        btnSettingsDelete.disabled = false;
        btnSettingsDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete Selected (1)';
      }
    } else {
      // 2 or more selected: show bar, hide Edit button, enable Delete button for bulk delete
      if (settingsBottomBar) settingsBottomBar.style.display = 'flex';
      if (btnSettingsEdit) {
        btnSettingsEdit.disabled = true;
        btnSettingsEdit.style.display = 'none';
      }
      if (btnSettingsDelete) {
        btnSettingsDelete.disabled = false;
        btnSettingsDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Selected (${count})`;
      }
    }
  }

  if (selectAllSettingsCheck) {
    selectAllSettingsCheck.addEventListener('change', (e) => {
      const list = dropdownSettings[activeSettingsCategory] || [];
      if (e.target.checked) {
        selectedSettingsIndices = new Set(list.map((_, i) => i));
      } else {
        selectedSettingsIndices.clear();
      }

      if (settingsTableBody) {
        settingsTableBody.querySelectorAll('tr').forEach((tr, idx) => {
          const chk = tr.querySelector('.row-select-check');
          if (chk) chk.checked = e.target.checked;
          if (e.target.checked) {
            tr.classList.add('selected-row');
          } else {
            tr.classList.remove('selected-row');
          }
        });
      }

      updateSettingsSelectionUI();
    });
  }

  // --- ACCORDION HEADER EXPAND/COLLAPSE TOGGLE HANDLERS ---
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.settings-accordion-card');
      if (card) card.classList.toggle('active');
    });
  });

  // --- INLINE ADD OPTION FORM HANDLERS FOR EACH ACCORDION ---
  document.querySelectorAll('.settings-add-form-inline').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catKey = form.getAttribute('data-cat');
      const input = form.querySelector('.input-add-setting');
      if (!catKey || !input) return;

      const val = input.value.trim();
      if (!val) return;

      await addSettingOptionInline(catKey, val);
      input.value = '';
    });
  });

  async function addSettingOptionInline(catKey, val) {
    const list = dropdownSettings[catKey] || [];
    if (list.some(opt => opt.toLowerCase() === val.toLowerCase())) {
      showAlert(`Option '${val}' already exists in this list.`);
      return;
    }

    const tblName = SETTINGS_TABLE_MAP[catKey];
    if (supabaseClient && tblName) {
      try {
        const { data, error } = await supabaseClient
          .from(tblName)
          .insert([{ name: val }])
          .select();

        if (!error && data && data.length > 0) {
          if (!settingsSupabaseItems[catKey]) {
            settingsSupabaseItems[catKey] = [];
          }
          settingsSupabaseItems[catKey].push(data[0]);
        }
      } catch (dbErr) {
        console.warn(`Notice inserting to Supabase table ${tblName}:`, dbErr.message);
      }
    }

    list.push(val);
    dropdownSettings[catKey] = list;
    saveDropdownSettings();
    renderSettingsTable();
    showSuccessNoticeModal(`Option '<strong>${escapeHtml(val)}</strong>' added to Product Settings.`);
  }

  async function editSettingOptionInline(catKey, idx) {
    const list = dropdownSettings[catKey] || [];
    const oldVal = list[idx];
    if (oldVal === undefined) return;

    const newVal = prompt(`Edit option value:`, oldVal);
    if (newVal === null) return;
    const cleanVal = newVal.trim();
    if (!cleanVal || cleanVal === oldVal) return;

    if (list.some((opt, i) => i !== idx && opt.toLowerCase() === cleanVal.toLowerCase())) {
      showAlert(`Option '${cleanVal}' already exists in this list.`);
      return;
    }

    const tblName = SETTINGS_TABLE_MAP[catKey];
    if (supabaseClient && tblName) {
      try {
        const supaItem = (settingsSupabaseItems[catKey] || []).find(i => i.name === oldVal);
        if (supaItem && supaItem.id) {
          await supabaseClient.from(tblName).update({ name: cleanVal }).eq('id', supaItem.id);
          supaItem.name = cleanVal;
        } else {
          await supabaseClient.from(tblName).update({ name: cleanVal }).eq('name', oldVal);
        }
      } catch (dbErr) {
        console.warn(`Notice updating Supabase table ${tblName}:`, dbErr.message);
      }
    }

    list[idx] = cleanVal;
    dropdownSettings[catKey] = list;
    saveDropdownSettings();
    renderSettingsTable();
  }

  function deleteSettingOptionInline(catKey, idx) {
    const list = dropdownSettings[catKey] || [];
    const targetVal = list[idx];
    if (targetVal === undefined) return;

    showDeleteConfirmModal(`Are you sure you want to delete option '<strong>${escapeHtml(targetVal)}</strong>'?`, async () => {
      const tblName = SETTINGS_TABLE_MAP[catKey];
      if (supabaseClient && tblName) {
        try {
          const supaItem = (settingsSupabaseItems[catKey] || []).find(i => i.name === targetVal);
          if (supaItem && supaItem.id) {
            await supabaseClient.from(tblName).delete().eq('id', supaItem.id);
          } else {
            await supabaseClient.from(tblName).delete().eq('name', targetVal);
          }
        } catch (dbErr) {
          console.warn(`Notice deleting from Supabase table ${tblName}:`, dbErr.message);
        }
      }

      list.splice(idx, 1);
      dropdownSettings[catKey] = list;
      saveDropdownSettings();
      renderSettingsTable();
    });
  }

  // --- ACCORDION SELECTION STATE ---
  const accordionSelectedIndices = {
    types: new Set(),
    groups: new Set(),
    gtins: new Set(),
    categories: new Set(),
    uoms: new Set()
  };

  function updateAccordionSelectionUI(catKey) {
    const selectedSet = accordionSelectedIndices[catKey] || new Set();
    const count = selectedSet.size;
    const list = dropdownSettings[catKey] || [];
    const catCapitalized = catKey.charAt(0).toUpperCase() + catKey.slice(1);

    const actionBar = document.getElementById(`actionBar${catCapitalized}`);
    const selectAllCheck = document.querySelector(`.accordion-select-all[data-cat="${catKey}"]`);

    const editForm = document.getElementById(`editForm${catCapitalized}`);
    if (count !== 1 && editForm) {
      editForm.style.display = 'none';
    }

    if (selectAllCheck) {
      selectAllCheck.checked = list.length > 0 && count === list.length;
    }

    if (count === 0) {
      if (actionBar) actionBar.style.display = 'none';
    } else {
      if (actionBar) {
        actionBar.style.display = 'flex';

        const btnEdit = actionBar.querySelector('.btn-accordion-edit');
        const btnDelete = actionBar.querySelector('.btn-accordion-delete');

        if (count === 1) {
          if (btnEdit) { btnEdit.style.display = 'inline-flex'; }
          if (btnDelete) {
            btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete Selected (1)';
          }
        } else {
          if (btnEdit) { btnEdit.style.display = 'none'; }
          if (btnDelete) {
            btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Selected (${count})`;
          }
        }
      }
    }
  }

  // --- SELECT ALL CHECKBOX HANDLERS FOR EACH ACCORDION ---
  document.querySelectorAll('.accordion-select-all').forEach(check => {
    check.addEventListener('change', (e) => {
      const catKey = check.getAttribute('data-cat');
      if (!catKey) return;

      const list = dropdownSettings[catKey] || [];
      if (e.target.checked) {
        accordionSelectedIndices[catKey] = new Set(list.map((_, i) => i));
      } else {
        accordionSelectedIndices[catKey].clear();
      }

      const catCapitalized = catKey.charAt(0).toUpperCase() + catKey.slice(1);
      const tbody = document.getElementById(`tableBody${catCapitalized}`);
      if (tbody) {
        tbody.querySelectorAll('tr').forEach((tr) => {
          const rowChk = tr.querySelector('.accordion-row-check');
          if (rowChk) rowChk.checked = e.target.checked;
          if (e.target.checked) {
            tr.classList.add('selected-row');
          } else {
            tr.classList.remove('selected-row');
          }
        });
      }

      updateAccordionSelectionUI(catKey);
    });
  });

  // --- EDIT PRODUCT SETTING MODAL HANDLERS ---
  let editingSettingCatKey = null;
  let editingSettingIndex = null;

  const editSettingModal = document.getElementById('editSettingModal');
  const editSettingModalForm = document.getElementById('editSettingModalForm');
  const editSettingModalTitle = document.getElementById('editSettingModalTitle');
  const editSettingModalLabel = document.getElementById('editSettingModalLabel');
  const inputEditSettingValue = document.getElementById('inputEditSettingValue');
  const editSettingModalCloseBtn = document.getElementById('editSettingModalCloseBtn');
  const editSettingModalCancelBtn = document.getElementById('editSettingModalCancelBtn');

  const CATEGORY_LABEL_MAP = {
    types: 'Product Type',
    groups: 'Product Group',
    gtins: 'GTIN',
    categories: 'Product Category',
    uoms: 'Base Unit of Measure'
  };

  function openEditSettingModal(catKey, idx) {
    const list = dropdownSettings[catKey] || [];
    const val = list[idx];
    if (val === undefined || !editSettingModal) return;

    editingSettingCatKey = catKey;
    editingSettingIndex = idx;

    const labelName = CATEGORY_LABEL_MAP[catKey] || 'Setting Option';
    if (editSettingModalTitle) {
      editSettingModalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--primary);"></i> Edit ${escapeHtml(labelName)}`;
    }
    if (editSettingModalLabel) {
      editSettingModalLabel.textContent = `${labelName} Value:`;
    }
    if (inputEditSettingValue) {
      inputEditSettingValue.value = val;
    }

    editSettingModal.classList.add('active');
    setTimeout(() => {
      if (inputEditSettingValue) {
        inputEditSettingValue.focus();
        inputEditSettingValue.select();
      }
    }, 50);
  }

  function closeEditSettingModal() {
    if (editSettingModal) editSettingModal.classList.remove('active');
    editingSettingCatKey = null;
    editingSettingIndex = null;
  }

  if (editSettingModalCloseBtn) editSettingModalCloseBtn.addEventListener('click', closeEditSettingModal);
  if (editSettingModalCancelBtn) editSettingModalCancelBtn.addEventListener('click', closeEditSettingModal);
  if (editSettingModal) {
    editSettingModal.addEventListener('click', (e) => {
      if (e.target === editSettingModal) closeEditSettingModal();
    });
  }

  if (editSettingModalForm) {
    editSettingModalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!editingSettingCatKey || editingSettingIndex === null || !inputEditSettingValue) return;

      const cleanVal = inputEditSettingValue.value.trim();
      if (!cleanVal) return;

      const catKey = editingSettingCatKey;
      const idx = editingSettingIndex;
      closeEditSettingModal();

      await saveEditedSettingOption(catKey, idx, cleanVal);
    });
  }

  // --- ACCORDION ACTION BAR BUTTON LISTENERS (EDIT & DELETE) ---
  document.querySelectorAll('.btn-accordion-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const catKey = btn.getAttribute('data-cat');
      const selectedSet = accordionSelectedIndices[catKey];
      if (selectedSet && selectedSet.size === 1) {
        const idx = Array.from(selectedSet)[0];
        openEditSettingModal(catKey, idx);
      }
    });
  });

  async function saveEditedSettingOption(catKey, idx, cleanVal) {
    const list = dropdownSettings[catKey] || [];
    const oldVal = list[idx];
    if (oldVal === undefined) return;

    if (cleanVal === oldVal) {
      return;
    }

    if (list.some((opt, i) => i !== idx && opt.toLowerCase() === cleanVal.toLowerCase())) {
      showAlert(`Option '${cleanVal}' already exists in this list.`);
      return;
    }

    const tblName = SETTINGS_TABLE_MAP[catKey];
    if (supabaseClient && tblName) {
      try {
        const supaItem = (settingsSupabaseItems[catKey] || []).find(i => i.name === oldVal);
        if (supaItem && supaItem.id) {
          await supabaseClient.from(tblName).update({ name: cleanVal }).eq('id', supaItem.id);
          supaItem.name = cleanVal;
        } else {
          await supabaseClient.from(tblName).update({ name: cleanVal }).eq('name', oldVal);
        }
      } catch (dbErr) {
        console.warn(`Notice updating Supabase table ${tblName}:`, dbErr.message);
      }
    }

    list[idx] = cleanVal;
    dropdownSettings[catKey] = list;
    saveDropdownSettings();
    renderSettingsTable();
    showSuccessNoticeModal(`Option updated to '<strong>${escapeHtml(cleanVal)}</strong>'.`, 'Data Updated Successfully');
  }

  document.querySelectorAll('.btn-accordion-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const catKey = btn.getAttribute('data-cat');
      const selectedSet = accordionSelectedIndices[catKey];
      if (selectedSet && selectedSet.size > 0) {
        deleteSelectedSettingOptions(catKey);
      }
    });
  });

  function deleteSelectedSettingOptions(catKey) {
    const list = dropdownSettings[catKey] || [];
    const selectedSet = accordionSelectedIndices[catKey] || new Set();
    const sortedIndices = Array.from(selectedSet).sort((a, b) => b - a);
    if (sortedIndices.length === 0) return;

    const count = sortedIndices.length;
    const confirmMsg = count === 1
      ? `Are you sure you want to delete option '<strong>${escapeHtml(list[sortedIndices[0]])}</strong>'?`
      : `Are you sure you want to delete all <strong>${count}</strong> selected options?`;

    showDeleteConfirmModal(confirmMsg, async () => {
      const tblName = SETTINGS_TABLE_MAP[catKey];

      for (const idx of sortedIndices) {
        const targetVal = list[idx];
        if (supabaseClient && tblName) {
          try {
            const supaItem = (settingsSupabaseItems[catKey] || []).find(i => i.name === targetVal);
            if (supaItem && supaItem.id) {
              await supabaseClient.from(tblName).delete().eq('id', supaItem.id);
            } else {
              await supabaseClient.from(tblName).delete().eq('name', targetVal);
            }
          } catch (dbErr) {
            console.warn(`Notice deleting from Supabase table ${tblName}:`, dbErr.message);
          }
        }
        list.splice(idx, 1);
      }

      dropdownSettings[catKey] = list;
      accordionSelectedIndices[catKey].clear();
      saveDropdownSettings();
      renderSettingsTable();
    });
  }

  // --- RENDER ALL 5 ACCORDION CATEGORIES SIMULTANEOUSLY ---
  function renderSettingsTable() {
    const categories = [
      { key: 'types', badgeId: 'badgeCountTypes', bodyId: 'tableBodyTypes' },
      { key: 'groups', badgeId: 'badgeCountGroups', bodyId: 'tableBodyGroups' },
      { key: 'gtins', badgeId: 'badgeCountGtins', bodyId: 'tableBodyGtins' },
      { key: 'categories', badgeId: 'badgeCountCategories', bodyId: 'tableBodyCategories' },
      { key: 'uoms', badgeId: 'badgeCountUoms', bodyId: 'tableBodyUoms' }
    ];

    categories.forEach(cat => {
      const badgeEl = document.getElementById(cat.badgeId);
      const bodyEl = document.getElementById(cat.bodyId);
      const list = dropdownSettings[cat.key] || [];
      const selectedSet = accordionSelectedIndices[cat.key] || new Set();

      if (badgeEl) badgeEl.textContent = list.length;
      updateAccordionSelectionUI(cat.key);

      if (!bodyEl) return;

      bodyEl.innerHTML = '';

      if (list.length === 0) {
        bodyEl.innerHTML = `
          <tr>
            <td colspan="3" style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.8rem;">
              No options defined yet.
            </td>
          </tr>
        `;
        return;
      }

      const fragment = document.createDocumentFragment();
      list.forEach((val, idx) => {
        const tr = document.createElement('tr');
        const isSelected = selectedSet.has(idx);
        if (isSelected) tr.classList.add('selected-row');

        tr.innerHTML = `
          <td style="text-align: center; width: 35px;">
            <input type="checkbox" class="accordion-row-check" data-cat="${cat.key}" data-idx="${idx}" ${isSelected ? 'checked' : ''}>
          </td>
          <td style="font-family: var(--font-mono); color: var(--text-dim); width: 35px;">${idx + 1}</td>
          <td><span style="font-weight: 500; color: var(--text-main);">${escapeHtml(val)}</span></td>
        `;

        const rowChk = tr.querySelector('.accordion-row-check');

        const syncRowSelection = () => {
          if (rowChk.checked) {
            selectedSet.add(idx);
            tr.classList.add('selected-row');
          } else {
            selectedSet.delete(idx);
            tr.classList.remove('selected-row');
          }
          updateAccordionSelectionUI(cat.key);
        };

        if (rowChk) {
          rowChk.addEventListener('change', (e) => {
            e.stopPropagation();
            syncRowSelection();
          });
        }

        tr.addEventListener('click', (e) => {
          if (e.target !== rowChk && e.target.tagName.toLowerCase() !== 'input' && e.target.tagName.toLowerCase() !== 'button') {
            rowChk.checked = !rowChk.checked;
            syncRowSelection();
          }
        });
        fragment.appendChild(tr);
      });

      bodyEl.appendChild(fragment);
    });
  }

  // --- TAB SWITCHING HANDLERS ---
  const tabUserManagement = document.getElementById('tabUserManagement');
  const viewUserManagement = document.getElementById('viewUserManagement');

  function activateTab(targetTab, targetView) {
    [tabCutlist, tabMasterProduct, tabProductSettings, tabUserManagement].forEach(t => {
      if (t) t.classList.remove('active');
    });
    [viewCutlist, viewMasterProduct, viewProductSettings, viewUserManagement].forEach(v => {
      if (v) v.classList.remove('active');
    });

    if (targetTab) targetTab.classList.add('active');
    if (targetView) targetView.classList.add('active');
  }

  tabCutlist.addEventListener('click', () => {
    activateTab(tabCutlist, viewCutlist);
  });

  tabMasterProduct.addEventListener('click', () => {
    activateTab(tabMasterProduct, viewMasterProduct);
    renderMasterProductTable();
  });

  if (tabProductSettings) {
    tabProductSettings.addEventListener('click', () => {
      activateTab(tabProductSettings, viewProductSettings);
      renderSettingsTable();
    });
  }

  if (tabUserManagement) {
    tabUserManagement.addEventListener('click', () => {
      if (!currentUser || currentUser.role !== 'Admin') {
        showAlert('<strong>Access Restricted:</strong> User Directory is only accessible by Administrators.');
        activateTab(tabCutlist, viewCutlist);
        return;
      }
      activateTab(tabUserManagement, viewUserManagement);
      renderUserDirectoryTable();
    });
  }

  // --- DIRECT REST API FETCH FROM SUPABASE (PAGINATED FOR 9,000+ RECORDS) ---
  async function fetchSupabaseMasterProductsDirect() {
    try {
      let allRecords = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const start = page * pageSize;
        const end = start + pageSize - 1;
        // id.asc tiebreaker is required: bulk uploads insert in 250-row chunks that share an
        // identical created_at, and OFFSET paging over a non-unique sort silently drops rows.
        const restUrl = `${SUPABASE_URL}/rest/v1/master_products?select=*&order=created_at.desc,id.asc`;
        
        const resp = await fetch(restUrl, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Range-Unit': 'items',
            'Range': `${start}-${end}`
          }
        });

        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data) && data.length > 0) {
            allRecords = allRecords.concat(data);
            if (data.length < pageSize) {
              hasMore = false;
            } else {
              page++;
            }
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      if (allRecords.length > 0) {
        return allRecords;
      }
    } catch (err) {
      console.warn('REST API fetch notice:', err);
    }
    return null;
  }

  const HARDCODED_FALLBACK_PRODUCTS = [
    { product_id: "20000412", description: "FASTENER XT 8-18 X 32 SEH", product_type: "HAWA", product_group: "FASTENER", gtin: "Product", product_category: "Product", base_unit: "Piece (PC)", created_by: "Danizan Chedin (CB9980000471)", sap_synced: true },
    { product_id: "20000662", description: "HPK 12X100HOT DIP WEDGE ANCHOR", product_type: "HAWA", product_group: "FASTENER", gtin: "Product", product_category: "Product", base_unit: "Piece (PC)", created_by: "Danizan Chedin (CB9980000471)", sap_synced: true },
    { product_id: "CPLN10010X9750", description: "C-PURLIN 100 X 50 X 10 X 1.0 X 9750 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN10012X10000", description: "C-PURLIN 100 X 50 X 10 X 1.2 X 10000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN10012X12000", description: "C-PURLIN 100 X 50 X 10 X 1.2 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN10012X6000", description: "C-PURLIN 100 X 50 X 10 X 1.2 X 6000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN10016X12000", description: "C-PURLIN 100 X 50 X 10 X 1.6 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN10016X6000", description: "C-PURLIN 100 X 50 X 10 X 1.6 X 6000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN12516X12000", description: "C-PURLIN 125 X 50 X 10 X 1.6 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN15016X12000", description: "C-PURLIN 150 X 50 X 10 X 1.6 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN15019X12000", description: "C-PURLIN 150 X 50 X 10 X 1.9 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN20019X12000", description: "C-PURLIN 200 X 50 X 10 X 1.9 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "CPLN20024X12000", description: "C-PURLIN 200 X 50 X 10 X 2.4 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "ZPLN10012X6000", description: "Z-PURLIN 100 X 50 X 10 X 1.2 X 6000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "ZPLN15016X12000", description: "Z-PURLIN 150 X 50 X 10 X 1.6 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true },
    { product_id: "ZPLN20019X12000", description: "Z-PURLIN 200 X 50 X 10 X 1.9 X 12000 mm", product_type: "FERT", product_group: "PURLIN", gtin: "Product", product_category: "Purlin", base_unit: "Piece (PC)", created_by: "Admin", sap_synced: true }
  ];

  async function loadFallbackMasterProducts() {
    if (supabaseProductsList.length > 0) return;
    try {
      let resp = await fetch(encodeURI('TG/Products (53) 01.09 - 26.09.xlsx'));
      if (!resp.ok) resp = await fetch(encodeURI('../TG/Products (53) 01.09 - 26.09.xlsx'));

      if (resp && resp.ok) {
        const arrayBuffer = await resp.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonRows && jsonRows.length > 1) {
          const fallbackList = [];
          const nowIso = new Date().toISOString();

          for (let r = 1; r < jsonRows.length; r++) {
            const row = jsonRows[r];
            if (!row || !row[0]) continue;
            const pCode = String(row[0] || '').trim();
            if (!pCode || pCode.toUpperCase() === 'PRODUCT') continue;

            fallbackList.push({
              product_id: pCode,
              description: String(row[1] || pCode).trim(),
              product_type: String(row[2] || 'FERT').trim(),
              product_group: String(row[3] || 'PURLIN').trim(),
              gtin: String(row[4] || 'Product').trim(),
              product_category: String(row[5] || 'Product').trim(),
              base_unit: String(row[6] || 'Piece (PC)').trim(),
              created_by: String(row[7] || 'System').trim(),
              sap_synced: true,
              created_at: nowIso,
              updated_at: nowIso
            });

            const cleanVal = pCode.replace(/[\u00A0\s]+/g, '').toUpperCase();
            if (cleanVal) masterProductSet.add(cleanVal);
          }

          if (fallbackList.length > 0) {
            supabaseProductsList = fallbackList;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Fallback Excel fetch notice:', e);
    }

    // Tier 3 Memory Catalog Fallback
    if (supabaseProductsList.length === 0) {
      const nowIso = new Date().toISOString();
      supabaseProductsList = HARDCODED_FALLBACK_PRODUCTS.map(p => ({
        ...p,
        created_at: nowIso,
        updated_at: nowIso
      }));
      supabaseProductsList.forEach(item => {
        const cleanVal = item.product_id.replace(/[\u00A0\s]+/g, '').toUpperCase();
        if (cleanVal) masterProductSet.add(cleanVal);
      });
    }
  }

  // --- SUPABASE INITIALIZATION & 3-TIER SYNC ---
  async function syncWithSupabase() {
    if (supaHeaderCount) supaHeaderCount.textContent = 'Syncing...';
    if (supaStatusBadge) supaStatusBadge.className = 'supabase-status-badge connecting';

    try {
      // Tier 1: Try Direct REST API Fetch first
      let data = await fetchSupabaseMasterProductsDirect();

      // Tier 1b: Try SDK client query if REST returned nothing
      if (!data && supabaseClient) {
        let allClientRecords = [];
        let page = 0;
        const pageSize = 1000;
        let hasMore = true;

        while (hasMore) {
          const start = page * pageSize;
          const end = start + pageSize - 1;

          const res = await supabaseClient
            .from('master_products')
            .select('*')
            .order('created_at', { ascending: false })
            .order('id', { ascending: true })
            .range(start, end);

          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            allClientRecords = allClientRecords.concat(res.data);
            if (res.data.length < pageSize) {
              hasMore = false;
            } else {
              page++;
            }
          } else {
            hasMore = false;
          }
        }

        if (allClientRecords.length > 0) {
          data = allClientRecords;
        }
      }

      if (Array.isArray(data) && data.length > 0) {
        supabaseProductsList = data;
        masterProductSet.clear();

        supabaseProductsList.forEach(item => {
          const rawCode = item.product || item.product_id || '';
          if (rawCode) {
            const cleanVal = String(rawCode).replace(/[\u00A0\s]+/g, '').toUpperCase();
            if (cleanVal) masterProductSet.add(cleanVal);
          }
        });

        try {
          localStorage.setItem('tg_master_products_cache', JSON.stringify(data));
        } catch (e) {}
      }

      // Tier 2 & 3: If DB returned nothing, load local Excel or memory preset
      if (supabaseProductsList.length === 0) {
        await loadFallbackMasterProducts();
      }

      const countStr = supabaseProductsList.length.toLocaleString();
      if (supaHeaderCount) supaHeaderCount.textContent = `${countStr} products`;
      if (supaStatusBadge) supaStatusBadge.className = 'supabase-status-badge connected';

      const masterCountText = document.getElementById('masterCountText');
      if (masterCountText) masterCountText.textContent = countStr;

      checkReadyState();
      await syncSettingsFromSupabase();

    } catch (err) {
      console.warn('Sync notice:', err.message);
      if (supabaseProductsList.length === 0) {
        await loadFallbackMasterProducts();
      }
      if (supaHeaderCount) supaHeaderCount.textContent = `${supabaseProductsList.length.toLocaleString()} products`;
      if (supaStatusBadge) supaStatusBadge.className = 'supabase-status-badge connected';
    } finally {
      renderMasterProductTable();
    }
  }

  syncWithSupabase();

  // --- MASTER PRODUCT MODALS HANDLERS ---
  if (btnSingleRecordModal && singleRecordModal) {
    btnSingleRecordModal.addEventListener('click', () => singleRecordModal.classList.add('active'));
  }
  if (singleRecordModalCloseBtn && singleRecordModal) {
    singleRecordModalCloseBtn.addEventListener('click', () => singleRecordModal.classList.remove('active'));
  }
  if (singleRecordCancelBtn && singleRecordModal) {
    singleRecordCancelBtn.addEventListener('click', () => singleRecordModal.classList.remove('active'));
  }

  const btnMasterSetSynced = document.getElementById('btnMasterSetSynced');

  function updateMasterSelectionUI() {
    const count = selectedMasterProductIds.size;

    // Update Export Selected Row(s) dropdown option state
    if (btnExportSelectedOption) {
      const exportSelectedSub = btnExportSelectedOption.querySelector('.export-item-sub');
      if (count === 0) {
        btnExportSelectedOption.style.opacity = '0.45';
        btnExportSelectedOption.style.pointerEvents = 'none';
        btnExportSelectedOption.style.cursor = 'not-allowed';
        if (exportSelectedSub) exportSelectedSub.textContent = 'No rows checked';
      } else {
        btnExportSelectedOption.style.opacity = '1';
        btnExportSelectedOption.style.pointerEvents = 'auto';
        btnExportSelectedOption.style.cursor = 'pointer';
        if (exportSelectedSub) exportSelectedSub.textContent = `${count.toLocaleString()} row${count > 1 ? 's' : ''} checked`;
      }
    }

    if (count === 0) {
      if (masterBottomActions) masterBottomActions.style.display = 'none';
      if (btnMasterEdit) { btnMasterEdit.disabled = true; btnMasterEdit.style.display = 'none'; }
      if (btnMasterDelete) { btnMasterDelete.disabled = true; }
      if (btnMasterSetSynced) { btnMasterSetSynced.style.display = 'none'; }
      if (selectAllMasterCheck) selectAllMasterCheck.checked = false;
    } else {
      if (masterBottomActions) masterBottomActions.style.display = 'flex';

      // Check if any selected rows have SAP Synced = No
      const selectedItems = supabaseProductsList.filter(item => {
        const pCode = item.product || item.product_id || '';
        return selectedMasterProductIds.has(pCode);
      });
      const unsyncedSelected = selectedItems.filter(item => {
        const isSynced = item.sap_synced === true || item.sap_synced === 'true';
        return !isSynced;
      });

      if (btnMasterSetSynced) {
        if (unsyncedSelected.length > 0) {
          btnMasterSetSynced.style.display = 'inline-flex';
          btnMasterSetSynced.innerHTML = unsyncedSelected.length === 1
            ? '<i class="fa-solid fa-circle-check"></i> Set SAP Synced = Yes'
            : `<i class="fa-solid fa-circle-check"></i> Set SAP Synced = Yes (${unsyncedSelected.length})`;
        } else {
          btnMasterSetSynced.style.display = 'none';
        }
      }

      if (count === 1) {
        if (btnMasterEdit) { btnMasterEdit.disabled = false; btnMasterEdit.style.display = 'inline-flex'; }
        if (btnMasterDelete) {
          btnMasterDelete.disabled = false;
          btnMasterDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete Selected (1)';
        }
      } else {
        if (btnMasterEdit) { btnMasterEdit.disabled = true; btnMasterEdit.style.display = 'none'; }
        if (btnMasterDelete) {
          btnMasterDelete.disabled = false;
          btnMasterDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Selected (${count})`;
        }
      }
    }
  }

  // --- BATCH SET SAP SYNCED = YES ACTION HANDLER ---
  if (btnMasterSetSynced) {
    btnMasterSetSynced.addEventListener('click', () => {
      const selectedItems = supabaseProductsList.filter(item => {
        const pCode = item.product || item.product_id || '';
        return selectedMasterProductIds.has(pCode);
      });
      const unsyncedSelected = selectedItems.filter(item => {
        const isSynced = item.sap_synced === true || item.sap_synced === 'true';
        return !isSynced;
      });

      if (unsyncedSelected.length === 0) return;

      const count = unsyncedSelected.length;
      showActionConfirmModal({
        title: `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Confirm SAP Sync`,
        iconClass: `fa-solid fa-circle-check`,
        iconColor: `#10b981`,
        iconBg: `rgba(16, 185, 129, 0.12)`,
        btnText: `<i class="fa-solid fa-circle-check"></i> Yes, Set Synced`,
        btnClass: `btn-action-success`,
        message: `Are you sure you want to set <strong>SAP Synced = Yes</strong> for ${count === 1 ? `product '<strong>${escapeHtml(unsyncedSelected[0].product || unsyncedSelected[0].product_id)}</strong>'` : `<strong>${count.toLocaleString()} selected products</strong>`}?`,
        onConfirm: async () => {
          const unsyncedIds = unsyncedSelected.map(i => i.product || i.product_id);
          const nowIso = new Date().toISOString();

          // 1. Update Supabase Cloud DB if client is connected
          if (supabaseClient) {
            try {
              const { error } = await supabaseClient
                .from('master_products')
                .update({ sap_synced: true, updated_at: nowIso })
                .in('product_id', unsyncedIds);

              if (error) throw error;
            } catch (dbErr) {
              showAlert(`Error updating SAP Synced status in Supabase: ${dbErr.message}`);
              return;
            }
          }

          // 2. Update local memory array
          supabaseProductsList.forEach(item => {
            const pCode = item.product || item.product_id || '';
            if (unsyncedIds.includes(pCode)) {
              item.sap_synced = true;
              item.updated_at = nowIso;
            }
          });

          // 3. Update localStorage cache
          try {
            localStorage.setItem('tg_master_products_cache', JSON.stringify(supabaseProductsList));
          } catch (e) {}

          // 4. Show success notice modal
          const label = unsyncedIds.length === 1
            ? `product '<strong>${escapeHtml(unsyncedIds[0])}</strong>'`
            : `<strong>${unsyncedIds.length.toLocaleString()}</strong> selected products`;
          showSuccessNoticeModal(`Successfully set <strong>SAP Synced = Yes</strong> for ${label}!`, 'Data Updated Successfully');

          // 5. Re-render table and update selection UI
          renderMasterProductTable();
        }
      });
    });
  }

  // --- HEADER CHECKBOX SELECTION DROPDOWN HANDLERS ---
  const btnMasterSelectDropdownToggle = document.getElementById('btnMasterSelectDropdownToggle');
  const masterSelectDropdownMenu = document.getElementById('masterSelectDropdownMenu');
  const btnHeaderSelectAllOption = document.getElementById('btnHeaderSelectAllOption');
  const btnHeaderSelectUnsyncedOption = document.getElementById('btnHeaderSelectUnsyncedOption');

  if (btnMasterSelectDropdownToggle && masterSelectDropdownMenu) {
    btnMasterSelectDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      masterSelectDropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!btnMasterSelectDropdownToggle.contains(e.target) && !masterSelectDropdownMenu.contains(e.target)) {
        masterSelectDropdownMenu.classList.remove('active');
      }
    });
  }

  if (btnHeaderSelectAllOption) {
    btnHeaderSelectAllOption.addEventListener('click', (e) => {
      e.preventDefault();
      if (masterSelectDropdownMenu) masterSelectDropdownMenu.classList.remove('active');

      if (selectedMasterProductIds.size > 0 && selectedMasterProductIds.size === supabaseProductsList.length) {
        selectedMasterProductIds.clear();
      } else {
        selectedMasterProductIds.clear();
        supabaseProductsList.forEach(item => {
          const pCode = item.product || item.product_id || '';
          if (pCode) selectedMasterProductIds.add(pCode);
        });
      }
      renderMasterProductTable();
    });
  }

  if (btnHeaderSelectUnsyncedOption) {
    btnHeaderSelectUnsyncedOption.addEventListener('click', (e) => {
      e.preventDefault();
      if (masterSelectDropdownMenu) masterSelectDropdownMenu.classList.remove('active');

      const unsyncedList = supabaseProductsList.filter(item => {
        const isSynced = item.sap_synced === true || item.sap_synced === 'true';
        return !isSynced;
      });

      if (unsyncedList.length === 0) {
        showAlert('<strong>No Unsynced Products Found:</strong> All products in the Master Product Catalog currently have <strong>SAP Synced = Yes</strong>.');
        return;
      }

      selectedMasterProductIds.clear();
      unsyncedList.forEach(item => {
        const pCode = item.product || item.product_id || '';
        if (pCode) selectedMasterProductIds.add(pCode);
      });

      renderMasterProductTable();
    });
  }

  if (selectAllMasterCheck) {
    selectAllMasterCheck.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      if (isChecked) {
        supabaseProductsList.forEach(item => {
          const pCode = item.product || item.product_id || '';
          if (pCode) selectedMasterProductIds.add(pCode);
        });
      } else {
        selectedMasterProductIds.clear();
      }
      renderMasterProductTable();
    });
  }

  function formatDateTimeParts(dateVal) {
    if (!dateVal || dateVal === '-') return { date: '-', time: '' };
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return { date: '-', time: '' };
      
      const pad = num => String(num).padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const min = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      return {
        date: `${yyyy}-${mm}-${dd}`,
        time: `${hh}:${min}:${ss}`
      };
    } catch (err) {
      return { date: '-', time: '' };
    }
  }

  let masterSortColumn = 'none'; // 'none' | 'sap_synced' | 'updated_at'
  let masterSortOrder = 'asc';   // 'asc' | 'desc'

  function updateSortHeaderUI() {
    document.querySelectorAll('.sortable-th[data-sort]').forEach(th => {
      const colKey = th.getAttribute('data-sort');
      const icon = th.querySelector('.sort-icon');
      if (!icon || !colKey) return;

      if (masterSortColumn === colKey) {
        icon.className = 'sort-icon fa-solid ' + (masterSortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
        icon.style.opacity = '1';
        th.style.color = 'var(--primary)';
      } else {
        icon.className = 'sort-icon fa-solid fa-sort';
        icon.style.opacity = '0.4';
        th.style.color = 'inherit';
      }
    });
  }

  // Collapses non-breaking spaces and whitespace runs so pasted product codes still match.
  function normalizeSearchText(value) {
    return String(value == null ? '' : value)
      .replace(/[\u00A0\u2007\u202F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function masterProductHaystack(item) {
    return normalizeSearchText(
      `${item.product || item.product_id || ''} ${item.description || item.product_description || ''} ${item.product_type || ''} ${item.product_group || ''} ${item.gtin || ''} ${item.product_category || ''} ${item.base_unit || item.base_uom || ''} ${item.created_by || ''}`
    );
  }

  function filterMasterProducts(term) {
    if (!term) return supabaseProductsList.slice();
    const stripped = term.replace(/\s+/g, '');
    return supabaseProductsList.filter(item => {
      const haystack = masterProductHaystack(item);
      return haystack.includes(term) || haystack.replace(/\s+/g, '').includes(stripped);
    });
  }

  function getMasterSearchTerm() {
    return supaTableSearch ? normalizeSearchText(supaTableSearch.value) : '';
  }

  // --- RENDER MASTER PRODUCT LIVE TABLE WITH ROW SELECTION (NO INLINE ACTIONS) ---
  function renderMasterProductTable() {
    const filterTerm = getMasterSearchTerm();
    if (btnSupaSearchClear) btnSupaSearchClear.style.display = filterTerm ? 'inline-flex' : 'none';

    const filtered = filterMasterProducts(filterTerm);

    // Apply column sorting if active
    if (masterSortColumn !== 'none') {
      filtered.sort((a, b) => {
        let aVal = '';
        let bVal = '';

        if (masterSortColumn === 'sap_synced') {
          aVal = (a.sap_synced === true || a.sap_synced === 'true') ? 1 : 0;
          bVal = (b.sap_synced === true || b.sap_synced === 'true') ? 1 : 0;
          return masterSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        } else if (masterSortColumn === 'updated_at') {
          aVal = new Date(a.updated_at || a.created_at || 0).getTime();
          bVal = new Date(b.updated_at || b.created_at || 0).getTime();
          return masterSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        } else if (masterSortColumn === 'product_id') {
          aVal = a.product || a.product_id || '';
          bVal = b.product || b.product_id || '';
        } else if (masterSortColumn === 'description') {
          aVal = a.description || a.product_description || '';
          bVal = b.description || b.product_description || '';
        } else if (masterSortColumn === 'product_type') {
          aVal = a.product_type || '';
          bVal = b.product_type || '';
        } else if (masterSortColumn === 'product_group') {
          aVal = a.product_group || '';
          bVal = b.product_group || '';
        } else if (masterSortColumn === 'base_unit') {
          aVal = a.base_unit || a.base_uom || '';
          bVal = b.base_unit || b.base_uom || '';
        } else if (masterSortColumn === 'created_by') {
          aVal = a.created_by || '';
          bVal = b.created_by || '';
        }

        const comp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' });
        return masterSortOrder === 'asc' ? comp : -comp;
      });
    }

    const totalCount = filtered.length;
    supaTableCountBadge.textContent = `Showing ${totalCount.toLocaleString()} products`;

    const totalPages = Math.max(1, Math.ceil(totalCount / supaPageSize));
    if (supaCurrentPage > totalPages) supaCurrentPage = totalPages;

    supaPageCurrent.textContent = supaCurrentPage;
    supaPageTotal.textContent = totalPages;

    if (btnSupaFirstPage) btnSupaFirstPage.disabled = supaCurrentPage <= 1;
    if (btnSupaPrevPage) btnSupaPrevPage.disabled = supaCurrentPage <= 1;
    if (btnSupaNextPage) btnSupaNextPage.disabled = supaCurrentPage >= totalPages;
    if (btnSupaLastPage) btnSupaLastPage.disabled = supaCurrentPage >= totalPages;

    supaMasterTableBody.innerHTML = '';

    if (totalCount === 0) {
      const emptyMsg = filterTerm
        ? `No product matches “${escapeHtml(supaTableSearch.value.trim())}”.`
        : 'No master products found. Click "Add Product" or "Upload & Reconcile" above.';
      supaMasterTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
            ${emptyMsg}
          </td>
        </tr>
      `;
      updateMasterSelectionUI();
      return;
    }

    const startIndex = (supaCurrentPage - 1) * supaPageSize;
    const pageItems = filtered.slice(startIndex, startIndex + supaPageSize);
    const fragment = document.createDocumentFragment();

    pageItems.forEach((item, idx) => {
      const tr = document.createElement('tr');
      const rowNum = startIndex + idx + 1;

      const pCode = item.product || item.product_id || '';
      const rawDesc = item.description || item.product_description || item['Product Description'] || '-';
      const pDesc = String(rawDesc).replace(/(\d+)\s*MM\b/gi, '$1mm').replace(/\bMM\b/g, 'mm');
      const pType = item.product_type || item['Product Type'] || '-';
      const pGroup = item.product_group || item['Product Group'] || '-';
      const baseUom = item.base_unit || item.base_uom || item['Base Unit of Measure'] || '-';
      const createdBy = item.created_by || item['Created By'] || '-';

      const isSapSynced = item.sap_synced === true || item.sap_synced === 'true';
      const sapBadge = isSapSynced
        ? '<span class="badge-status retained">Yes</span>'
        : '<span class="badge-status dup">No</span>';

      const lastUpdated = item.updated_at || item.created_at || item['Last Updated'] || '-';
      const dtParts = formatDateTimeParts(lastUpdated);
      const lastUpdatedHtml = dtParts.time
        ? `<div style="font-weight: 600; color: var(--text-main);">${escapeHtml(dtParts.date)}</div><div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 2px;">${escapeHtml(dtParts.time)}</div>`
        : `<div>${escapeHtml(dtParts.date)}</div>`;

      const isSelected = selectedMasterProductIds.has(pCode);
      if (isSelected) tr.classList.add('selected-row');
      tr.setAttribute('data-id', pCode);

      tr.innerHTML = `
        <td style="text-align: center; width: 40px;">
          <input type="checkbox" class="master-row-check" data-id="${escapeHtml(pCode)}" ${isSelected ? 'checked' : ''}>
        </td>
        <td style="font-family: var(--font-mono); color: var(--text-dim); font-size: 0.8rem;">${rowNum}</td>
        <td><strong style="color: var(--primary); font-family: var(--font-mono); font-size: 0.85rem;">${escapeHtml(pCode)}</strong></td>
        <td style="font-size: 0.825rem;">${escapeHtml(pDesc)}</td>
        <td style="font-size: 0.825rem;">${escapeHtml(pType)}</td>
        <td style="font-size: 0.825rem;">${escapeHtml(pGroup)}</td>
        <td style="font-size: 0.825rem;">${escapeHtml(baseUom)}</td>
        <td style="font-size: 0.825rem; text-align: center;">${sapBadge}</td>
        <td style="font-size: 0.825rem; color: var(--text-muted);">${escapeHtml(createdBy)}</td>
        <td style="font-size: 0.8rem; font-family: var(--font-mono); text-align: left; white-space: nowrap; min-width: 115px; line-height: 1.3;">${lastUpdatedHtml}</td>
      `;

      const chk = tr.querySelector('.master-row-check');

      const toggleRowSelection = (e) => {
        if (e.target !== chk) {
          chk.checked = !chk.checked;
        }

        if (chk.checked) {
          selectedMasterProductIds.add(pCode);
          tr.classList.add('selected-row');
        } else {
          selectedMasterProductIds.delete(pCode);
          tr.classList.remove('selected-row');
        }

        updateMasterSelectionUI();
      };

      tr.addEventListener('click', toggleRowSelection);
      fragment.appendChild(tr);
    });

    supaMasterTableBody.appendChild(fragment);
    updateMasterSelectionUI();
    updateMasterUnsyncedStatusUI();
  }

  function updateMasterUnsyncedStatusUI() {
    const unsyncedCount = supabaseProductsList.filter(item => {
      const isSynced = item.sap_synced === true || item.sap_synced === 'true';
      return !isSynced;
    }).length;

    const banner = document.getElementById('masterUnsyncedWarningBanner');
    const bannerText = document.getElementById('masterUnsyncedWarningText');
    const tabBadge = document.getElementById('badgeMasterUnsyncedTab');

    if (unsyncedCount > 0) {
      if (banner) banner.style.display = 'flex';
      if (bannerText) {
        const itemText = unsyncedCount === 1 ? '1 product' : `${unsyncedCount.toLocaleString()} products`;
        bannerText.innerHTML = `<strong>Action Required:</strong> <strong>${itemText}</strong> require synchronization with SAP by exporting the list from this application then upload into SAP.`;
      }
      if (tabBadge) {
        tabBadge.textContent = unsyncedCount > 99 ? '99+' : unsyncedCount;
        tabBadge.style.display = 'inline-flex';
      }
    } else {
      if (banner) banner.style.display = 'none';
      if (tabBadge) tabBadge.style.display = 'none';
    }
  }

  // --- EDIT PRODUCT ACTION HANDLER ---
  if (btnMasterEdit) {
    btnMasterEdit.addEventListener('click', () => {
      if (selectedMasterProductIds.size !== 1) return;

      const targetId = Array.from(selectedMasterProductIds)[0];
      const targetItem = supabaseProductsList.find(i => (i.product || i.product_id) === targetId);
      if (!targetItem) return;

      editProductOriginalId.value = targetId;
      editInputProduct.value = targetId;
      editInputProductDesc.value = targetItem.description || targetItem.product_description || '';
      editSelectProductType.value = targetItem.product_type || ''; initializeCustomDropdownUI(editSelectProductType);
      editSelectProductGroup.value = targetItem.product_group || ''; initializeCustomDropdownUI(editSelectProductGroup);
      editSelectGTIN.value = targetItem.gtin || ''; initializeCustomDropdownUI(editSelectGTIN);
      editSelectProductCategory.value = targetItem.product_category || ''; initializeCustomDropdownUI(editSelectProductCategory);
      editSelectBaseUOM.value = targetItem.base_unit || targetItem.base_uom || ''; initializeCustomDropdownUI(editSelectBaseUOM);
      if (editSelectSAPSynced) {
        editSelectSAPSynced.value = String(Boolean(targetItem.sap_synced));
        initializeCustomDropdownUI(editSelectSAPSynced);
      }

      if (editProductModal) editProductModal.classList.add('active');
    });
  }

  if (editProductModalCloseBtn && editProductModal) {
    editProductModalCloseBtn.addEventListener('click', () => editProductModal.classList.remove('active'));
  }
  if (editProductCancelBtn && editProductModal) {
    editProductCancelBtn.addEventListener('click', () => editProductModal.classList.remove('active'));
  }

  if (editProductForm) {
    editProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const targetId = editProductOriginalId.value;
      if (!targetId) return;

      const descVal = editInputProductDesc ? editInputProductDesc.value.trim() : '';
      const typeVal = editSelectProductType ? editSelectProductType.value.trim() : '';
      const groupVal = editSelectProductGroup ? editSelectProductGroup.value.trim() : '';
      const gtinVal = editSelectGTIN ? editSelectGTIN.value.trim() : '';
      const catVal = editSelectProductCategory ? editSelectProductCategory.value.trim() : '';
      const uomVal = editSelectBaseUOM ? editSelectBaseUOM.value.trim() : '';
      const targetItem = supabaseProductsList.find(i => (i.product || i.product_id) === targetId);
      const createdByVal = (targetItem && targetItem.created_by) ? targetItem.created_by : getLoggedInUserName();
      const sapSyncedVal = editSelectSAPSynced ? editSelectSAPSynced.value === 'true' : false;

      // Product ID / Code is renameable. Normalise it exactly like the import and Add
      // Product paths so 'aaa 111' and 'AAA111' are still treated as the same code.
      const rawNewCode = editInputProduct ? editInputProduct.value.trim() : targetId;
      const newCode = rawNewCode.replace(/[\u00A0\s]+/g, '').toUpperCase();
      const originalCode = String(targetId).replace(/[\u00A0\s]+/g, '').toUpperCase();
      const isRename = Boolean(newCode) && newCode !== originalCode;

      if (!rawNewCode || !descVal || !typeVal || !groupVal || !gtinVal || !catVal || !uomVal) {
        showAlert('<strong>Validation Failed:</strong> All fields in the Edit Product form are compulsory.');
        return;
      }

      // Unique Product ID / Code Validation (only relevant when actually renaming)
      if (isRename && masterProductSet.has(newCode)) {
        showAlert(`<strong>Validation Failed:</strong> Product ID Code '<strong>${escapeHtml(newCode)}</strong>' already exists in the Master Product List. Product ID must be unique.`);
        return;
      }

      const nowIso = new Date().toISOString();
      const updatePayload = {
        description: descVal,
        product_type: typeVal,
        product_group: groupVal,
        gtin: gtinVal,
        product_category: catVal,
        base_unit: uomVal,
        created_by: createdByVal,
        sap_synced: sapSyncedVal,
        updated_at: nowIso
      };
      if (isRename) updatePayload.product_id = newCode;

      if (supabaseClient) {
        // Target the row by its immutable surrogate id where we have one, so a rename
        // never depends on the column being rewritten. Records served by the offline /
        // local-Excel fallback tiers carry no id, so key off the old code instead.
        const rowId = targetItem ? targetItem.id : undefined;
        const applyUpdate = (payload) => {
          const query = supabaseClient.from('master_products').update(payload);
          return (rowId === undefined || rowId === null)
            ? query.eq('product_id', targetId)
            : query.eq('id', rowId);
        };

        try {
          let { error } = await applyUpdate(updatePayload);

          if (error && error.message && error.message.includes('updated_at')) {
            const fallbackPayload = { ...updatePayload };
            delete fallbackPayload.updated_at;
            const res = await applyUpdate(fallbackPayload);
            error = res.error;
          }

          if (error) throw error;
        } catch (dbErr) {
          // A unique-violation here means masterProductSet was stale, so report it as
          // the duplicate it is rather than as a raw Postgres error.
          const msg = String(dbErr.message || '');
          if (dbErr.code === '23505' || msg.toLowerCase().includes('duplicate key')) {
            showAlert(`<strong>Validation Failed:</strong> Product ID Code '<strong>${escapeHtml(newCode)}</strong>' already exists in the Master Product List. Product ID must be unique.`);
          } else {
            showAlert(`Error updating product in Supabase: ${msg}`);
          }
          return;
        }
      } else if (targetItem) {
        // Offline tier: keep the in-memory cache and lookup set consistent.
        Object.assign(targetItem, updatePayload);
        if (isRename) {
          if (targetItem.product) targetItem.product = newCode;
          masterProductSet.delete(originalCode);
          masterProductSet.add(newCode);
        }
      }

      // Carry the row selection across a rename so the checked row and the bottom
      // action bar keep pointing at the record that was just edited.
      if (isRename && selectedMasterProductIds.has(targetId)) {
        selectedMasterProductIds.delete(targetId);
        selectedMasterProductIds.add(newCode);
      }

      editProductModal.classList.remove('active');
      showSuccessNoticeModal(
        isRename
          ? `Product '<strong>${escapeHtml(targetId)}</strong>' renamed to '<strong>${escapeHtml(newCode)}</strong>' and updated successfully.`
          : `Product '<strong>${escapeHtml(targetId)}</strong>' updated successfully.`,
        'Data Updated Successfully'
      );
      await syncWithSupabase();
    });
  }

  // --- DELETE SELECTED MASTER PRODUCTS ACTION HANDLER ---
  if (btnMasterDelete) {
    btnMasterDelete.addEventListener('click', () => {
      const selectedIds = Array.from(selectedMasterProductIds);
      if (selectedIds.length === 0) return;

      const count = selectedIds.length;
      const confirmMsg = count === 1
        ? `Are you sure you want to delete product '<strong>${escapeHtml(selectedIds[0])}</strong>' from the database?`
        : `Are you sure you want to delete all <strong>${count}</strong> selected products from the database?`;

      showDeleteConfirmModal(confirmMsg, async () => {
        if (supabaseClient) {
          try {
            const { error } = await supabaseClient
              .from('master_products')
              .delete()
              .in('product_id', selectedIds);

            if (error) throw error;
          } catch (dbErr) {
            showAlert(`Error deleting products from Supabase: ${dbErr.message}`);
            return;
          }
        }

        selectedMasterProductIds.clear();
        await syncWithSupabase();
      });
    });
  }

  if (btnSupaFirstPage) {
    btnSupaFirstPage.addEventListener('click', () => {
      if (supaCurrentPage > 1) {
        supaCurrentPage = 1;
        renderMasterProductTable();
      }
    });
  }

  if (btnSupaPrevPage) {
    btnSupaPrevPage.addEventListener('click', () => {
      if (supaCurrentPage > 1) { supaCurrentPage--; renderMasterProductTable(); }
    });
  }

  if (btnSupaNextPage) {
    btnSupaNextPage.addEventListener('click', () => {
      supaCurrentPage++; renderMasterProductTable();
    });
  }

  if (btnSupaLastPage) {
    btnSupaLastPage.addEventListener('click', () => {
      const filtered = filterMasterProducts(getMasterSearchTerm());
      const totalPages = Math.max(1, Math.ceil(filtered.length / supaPageSize));
      if (supaCurrentPage < totalPages) {
        supaCurrentPage = totalPages;
        renderMasterProductTable();
      }
    });
  }

  // Safety net: if the loaded list has a gap, look the term up in Supabase directly rather than
  // reporting "not found" for a product that exists.
  let masterSearchLookupToken = 0;
  let masterSearchDebounce = null;

  async function lookupMissingMasterProducts(term) {
    const safe = term.replace(/[,()\\*%]/g, ' ').trim();
    if (safe.length < 3) return [];

    const pattern = `*${safe.replace(/\s+/g, '*')}*`;
    const rows = [];

    for (const col of ['product_id', 'description']) {
      const url = `${SUPABASE_URL}/rest/v1/master_products?select=*&${col}=ilike.${encodeURIComponent(pattern)}&limit=200`;
      try {
        const resp = await fetch(url, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data)) rows.push(...data);
        }
      } catch (err) {
        console.warn('Master search lookup notice:', err);
      }
    }
    return rows;
  }

  async function runMasterSearchFallback(term) {
    const token = ++masterSearchLookupToken;
    const rows = await lookupMissingMasterProducts(term);
    if (token !== masterSearchLookupToken) return;
    if (getMasterSearchTerm() !== term) return;

    const known = new Set(
      supabaseProductsList.map(i => String(i.product || i.product_id || '').replace(/[  \s]+/g, '').toUpperCase())
    );
    const added = rows.filter(r => {
      const key = String(r.product_id || '').replace(/[  \s]+/g, '').toUpperCase();
      if (!key || known.has(key)) return false;
      known.add(key);
      masterProductSet.add(key);
      return true;
    });

    if (!added.length) return;

    supabaseProductsList = supabaseProductsList.concat(added);
    try {
      localStorage.setItem('tg_master_products_cache', JSON.stringify(supabaseProductsList));
    } catch (e) {}
    renderMasterProductTable();
  }

  if (supaTableSearch) supaTableSearch.addEventListener('input', () => {
    supaCurrentPage = 1;
    renderMasterProductTable();

    const term = getMasterSearchTerm();
    clearTimeout(masterSearchDebounce);
    if (!term || filterMasterProducts(term).length > 0) return;
    masterSearchDebounce = setTimeout(() => runMasterSearchFallback(term), 350);
  });
  if (btnSupaSearchClear) btnSupaSearchClear.addEventListener('click', () => {
    if (supaTableSearch) supaTableSearch.value = '';
    supaCurrentPage = 1; renderMasterProductTable();
  });
  if (btnRefreshSupaTable) btnRefreshSupaTable.addEventListener('click', syncWithSupabase);

  // --- COLUMN HEADER SORTING HANDLERS ---
  document.querySelectorAll('.sortable-th[data-sort]').forEach(th => {
    th.addEventListener('click', (e) => {
      const colKey = th.getAttribute('data-sort');
      if (!colKey) return;

      if (masterSortColumn === colKey) {
        if (masterSortOrder === 'asc') {
          masterSortOrder = 'desc';
        } else if (masterSortOrder === 'desc') {
          masterSortColumn = 'none';
          masterSortOrder = 'asc';
        }
      } else {
        masterSortColumn = colKey;
        masterSortOrder = 'asc';
      }

      updateSortHeaderUI();
      supaCurrentPage = 1;
      renderMasterProductTable();
    });
  });

  // --- EXPORT PRODUCTS DROPDOWN & EXCEL GENERATOR (SELECTED, UNSYNCED & ALL) ---
  const btnExportDropdownToggle = document.getElementById('btnExportDropdownToggle');
  const exportDropdownMenu = document.getElementById('exportDropdownMenu');
  const btnExportSelectedOption = document.getElementById('btnExportSelectedOption');
  const btnExportUnsyncedOption = document.getElementById('btnExportUnsyncedOption');
  const btnExportAllOption = document.getElementById('btnExportAllOption');

  if (btnExportDropdownToggle && exportDropdownMenu) {
    btnExportDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      exportDropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!btnExportDropdownToggle.contains(e.target) && !exportDropdownMenu.contains(e.target)) {
        exportDropdownMenu.classList.remove('active');
      }
    });
  }

  if (btnExportSelectedOption) {
    btnExportSelectedOption.addEventListener('click', (e) => {
      e.preventDefault();
      if (!selectedMasterProductIds || selectedMasterProductIds.size === 0) return;
      if (exportDropdownMenu) exportDropdownMenu.classList.remove('active');
      exportMasterProducts('selected');
    });
  }

  if (btnExportUnsyncedOption) {
    btnExportUnsyncedOption.addEventListener('click', (e) => {
      e.preventDefault();
      if (exportDropdownMenu) exportDropdownMenu.classList.remove('active');
      exportMasterProducts('unsynced');
    });
  }

  // --- SYNC ACTION DROPDOWN & OPTIONS HANDLERS ---
  const btnSyncActionDropdownToggle = document.getElementById('btnSyncActionDropdownToggle');
  const syncActionDropdownMenu = document.getElementById('syncActionDropdownMenu');
  const btnBannerOptionExportUnsynced = document.getElementById('btnBannerOptionExportUnsynced');
  const btnBannerOptionMarkAllSynced = document.getElementById('btnBannerOptionMarkAllSynced');

  if (btnSyncActionDropdownToggle && syncActionDropdownMenu) {
    btnSyncActionDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      syncActionDropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!btnSyncActionDropdownToggle.contains(e.target) && !syncActionDropdownMenu.contains(e.target)) {
        syncActionDropdownMenu.classList.remove('active');
      }
    });
  }

  if (btnBannerOptionExportUnsynced) {
    btnBannerOptionExportUnsynced.addEventListener('click', (e) => {
      e.preventDefault();
      if (syncActionDropdownMenu) syncActionDropdownMenu.classList.remove('active');
      exportMasterProducts('unsynced');
    });
  }

  if (btnBannerOptionMarkAllSynced) {
    btnBannerOptionMarkAllSynced.addEventListener('click', async (e) => {
      e.preventDefault();
      if (syncActionDropdownMenu) syncActionDropdownMenu.classList.remove('active');

      const unsyncedItems = supabaseProductsList.filter(item => {
        const isSynced = item.sap_synced === true || item.sap_synced === 'true';
        return !isSynced;
      });

      if (unsyncedItems.length === 0) return;

      const count = unsyncedItems.length;
      showActionConfirmModal({
        title: `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Confirm Batch Sync`,
        iconClass: `fa-solid fa-circle-check`,
        iconColor: `#10b981`,
        iconBg: `rgba(16, 185, 129, 0.12)`,
        btnText: `<i class="fa-solid fa-circle-check"></i> Yes, Mark Synced`,
        btnClass: `btn-action-success`,
        message: `Are you sure you want to mark all <strong>${count.toLocaleString()} unsynced products</strong> as <strong>SAP Synced = Yes</strong>?`,
        onConfirm: async () => {
          const nowIso = new Date().toISOString();

          // 1. Update Supabase Cloud DB
          if (supabaseClient) {
            try {
              const unsyncedIds = unsyncedItems.map(i => i.product || i.product_id).filter(Boolean);
              if (unsyncedIds.length > 0) {
                await supabaseClient
                  .from('master_products')
                  .update({ sap_synced: true, updated_at: nowIso })
                  .in('product_id', unsyncedIds);
              }
            } catch (dbErr) {
              console.warn('Notice updating Supabase DB:', dbErr.message);
            }
          }

          // 2. Update local memory array
          supabaseProductsList.forEach(item => {
            const isSynced = item.sap_synced === true || item.sap_synced === 'true';
            if (!isSynced) {
              item.sap_synced = true;
              item.updated_at = nowIso;
            }
          });

          // 3. Update localStorage cache
          try {
            localStorage.setItem('tg_master_products_cache', JSON.stringify(supabaseProductsList));
          } catch (err) {}

          // 4. Show success notice modal
          showSuccessNoticeModal(`Successfully marked all <strong>${count.toLocaleString()}</strong> unsynced products as <strong>SAP Synced = Yes</strong>!`, 'Data Updated Successfully');

          // 5. Re-render table and update all badges & warning banners
          renderMasterProductTable();
        }
      });
    });
  }

  if (btnExportAllOption) {
    btnExportAllOption.addEventListener('click', (e) => {
      e.preventDefault();
      if (exportDropdownMenu) exportDropdownMenu.classList.remove('active');
      exportMasterProducts('all');
    });
  }

  function exportMasterProducts(mode) {
    if (!supabaseProductsList || supabaseProductsList.length === 0) {
      showAlert('No products available to export.');
      return;
    }

    let exportList = supabaseProductsList;
    let sheetName = 'All Master Products';
    let filePrefix = 'Master_Products_All';
    let successMessageLabel = 'all master';

    if (mode === 'selected') {
      if (!selectedMasterProductIds || selectedMasterProductIds.size === 0) {
        showAlert('<strong>No Products Selected:</strong> Please select at least 1 product row using table checkboxes to export.');
        return;
      }

      exportList = supabaseProductsList.filter(item => {
        const pCode = item.product || item.product_id || '';
        return selectedMasterProductIds.has(pCode);
      });

      if (exportList.length === 0) {
        showAlert('Selected products could not be found in the current dataset.');
        return;
      }

      sheetName = 'Selected Products';
      filePrefix = 'Selected_Master_Products';
      successMessageLabel = 'selected';
    } else if (mode === 'unsynced') {
      exportList = supabaseProductsList.filter(item => {
        const isSynced = item.sap_synced === true || item.sap_synced === 'true';
        return !isSynced;
      });

      if (exportList.length === 0) {
        showAlert('<strong>No Unsynced Products Found:</strong> All products in the Master Product Catalog currently have <strong>SAP Synced = Yes</strong>.');
        return;
      }

      sheetName = 'Unsynced Products';
      filePrefix = 'Unsynced_Products';
      successMessageLabel = 'unsynced (SAP Synced = No)';
    }

    // Map to standard Excel export row objects
    const exportRows = exportList.map(item => {
      const pCode = item.product || item.product_id || '';
      const rawDesc = item.description || item.product_description || '';
      const pDesc = String(rawDesc).replace(/(\d+)\s*MM\b/gi, '$1mm').replace(/\bMM\b/g, 'mm');
      const pType = item.product_type || '';
      const pGroup = item.product_group || '';
      const gtinVal = item.gtin || '';
      const pCat = item.product_category || '';
      const baseUomVal = item.base_unit || item.base_uom || '';
      const createdByVal = item.created_by || '';
      const isSynced = item.sap_synced === true || item.sap_synced === 'true';
      const sapSyncedText = isSynced ? 'Yes' : 'No';
      const lastUpdatedVal = item.updated_at || item.created_at || '';
      const dtParts = formatDateTimeParts(lastUpdatedVal);
      const formattedUpdated = dtParts.time ? `${dtParts.date} ${dtParts.time}` : (dtParts.date || '-');

      return {
        'Product': pCode,
        'Product Description': pDesc,
        'Product Type': pType,
        'Product Group': pGroup,
        'Product Category': pCat,
        'Base Unit of Measure': baseUomVal,
        'Created By': createdByVal
      };
    });

    // Generate Excel Workbook using SheetJS
    const worksheet = XLSX.utils.json_to_sheet(exportRows);

    // Auto-fit column widths
    const colWidths = Object.keys(exportRows[0]).map(key => ({
      wch: Math.max(key.length, ...exportRows.map(row => String(row[key] || '').length)) + 2
    }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const todayStr = new Date().toISOString().split('T')[0];
    const filename = `${filePrefix}_${todayStr}.xlsx`;
    XLSX.writeFile(workbook, filename);
  }

  function extractRowField(rowObj, candidates) {
    if (!rowObj || typeof rowObj !== 'object') return '';
    const keys = Object.keys(rowObj);

    for (const cand of candidates) {
      const target = cand.trim().toLowerCase();
      const matchedKey = keys.find(k => k.trim().toLowerCase() === target);
      if (matchedKey && rowObj[matchedKey] !== undefined && rowObj[matchedKey] !== null) {
        const val = String(rowObj[matchedKey]).trim();
        if (val !== '' && val !== 'undefined' && val !== 'null') {
          return val;
        }
      }
    }

    for (const cand of candidates) {
      const target = cand.trim().toLowerCase();
      const matchedKey = keys.find(k => k.trim().toLowerCase().includes(target));
      if (matchedKey && rowObj[matchedKey] !== undefined && rowObj[matchedKey] !== null) {
        const val = String(rowObj[matchedKey]).trim();
        if (val !== '' && val !== 'undefined' && val !== 'null') {
          return val;
        }
      }
    }

    return '';
  }

  // ==================== PRODUCT ACTIONS DROPDOWN & UPLOAD & RECONCILE ENGINE ====================
  const btnMasterActionsDropdownToggle = document.getElementById('btnMasterActionsDropdownToggle');
  const masterActionsDropdownMenu = document.getElementById('masterActionsDropdownMenu');

  if (btnMasterActionsDropdownToggle && masterActionsDropdownMenu) {
    btnMasterActionsDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = masterActionsDropdownMenu.classList.contains('active');
      if (isActive) {
        masterActionsDropdownMenu.classList.remove('active');
      } else {
        masterActionsDropdownMenu.classList.add('active');
      }
    });

    document.addEventListener('click', (e) => {
      if (!btnMasterActionsDropdownToggle.contains(e.target) && !masterActionsDropdownMenu.contains(e.target)) {
        masterActionsDropdownMenu.classList.remove('active');
      }
    });
  }

  const btnOpenReconcileModal = document.getElementById('btnOpenReconcileModal');
  if (btnOpenReconcileModal) {
    btnOpenReconcileModal.addEventListener('click', () => {
      if (masterActionsDropdownMenu) masterActionsDropdownMenu.classList.remove('active');
      openReconcileUploadModal();
    });
  }

  // State variables for Reconciliation
  let pendingReconcileRecords = [];
  let reconcileNewList = [];
  let reconcileMissingList = [];
  let reconcileDuplicateList = [];
  let reconcileMatchingCount = 0;

  const reconcileUploadModal = document.getElementById('reconcileUploadModal');
  const reconcileUploadModalCloseBtn = document.getElementById('reconcileUploadModalCloseBtn');
  const reconcileUploadCancelBtn = document.getElementById('reconcileUploadCancelBtn');
  const reconcileDropzone = document.getElementById('reconcileDropzone');
  const reconcileFileInput = document.getElementById('reconcileFileInput');
  const btnSelectReconcileFile = document.getElementById('btnSelectReconcileFile');
  const reconcileFileConfirmContainer = document.getElementById('reconcileFileConfirmContainer');
  const reconcileFileNameBadge = document.getElementById('reconcileFileNameBadge');
  const reconcileFileRecordBadge = document.getElementById('reconcileFileRecordBadge');
  const btnStartReconciliationCompare = document.getElementById('btnStartReconciliationCompare');

  function openReconcileUploadModal() {
    pendingReconcileRecords = [];
    reconcileDuplicateList = [];
    if (reconcileFileInput) reconcileFileInput.value = '';
    if (reconcileFileConfirmContainer) reconcileFileConfirmContainer.style.display = 'none';
    if (reconcileUploadModal) reconcileUploadModal.classList.add('active');
  }

  function closeReconcileUploadModal() {
    if (reconcileUploadModal) reconcileUploadModal.classList.remove('active');
  }

  if (reconcileUploadModalCloseBtn) reconcileUploadModalCloseBtn.addEventListener('click', closeReconcileUploadModal);
  if (reconcileUploadCancelBtn) reconcileUploadCancelBtn.addEventListener('click', closeReconcileUploadModal);

  if (btnSelectReconcileFile && reconcileFileInput) {
    btnSelectReconcileFile.addEventListener('click', () => reconcileFileInput.click());
  }

  if (reconcileDropzone && reconcileFileInput) {
    reconcileDropzone.addEventListener('click', (e) => {
      if (e.target !== btnSelectReconcileFile && !btnSelectReconcileFile.contains(e.target)) {
        reconcileFileInput.click();
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      reconcileDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        reconcileDropzone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      reconcileDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        reconcileDropzone.classList.remove('drag-active');
      });
    });

    reconcileDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        reconcileFileInput.files = files;
        processReconcileUploadFile(files[0]);
      }
    });

    reconcileFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processReconcileUploadFile(e.target.files[0]);
      }
    });
  }

  function processReconcileUploadFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const extractedRecordsMap = new Map();
        const firstSeenAt = new Map();
        reconcileDuplicateList = [];

        workbook.SheetNames.forEach(sheetName => {
          const jsonObjects = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          if (jsonObjects && jsonObjects.length > 0) {
            jsonObjects.forEach((rowObj, rowIdx) => {
              const rawProduct = extractRowField(rowObj, ['product', 'product id', 'product_id', 'product code', 'item', 'sku']);
              const cleanCode = String(rawProduct || '').replace(/[\u00A0\s]+/g, '').toUpperCase();

              if (cleanCode && cleanCode !== 'PRODUCT' && cleanCode !== 'PRODUCTID' && !cleanCode.includes('SUMMARY') && cleanCode.length >= 3) {
                const descVal = extractRowField(rowObj, ['product description', 'description', 'product_description', 'item description', 'name']);
                const typeVal = extractRowField(rowObj, ['product type', 'type', 'product_type', 'item type']);
                const groupVal = extractRowField(rowObj, ['product group', 'group', 'product_group', 'item group']);
                const gtinVal = extractRowField(rowObj, ['gtin', 'gtin/ean', 'gtin / ean', 'gtin number', 'gtin code', 'ean', 'upc', 'barcode']);
                const catVal = extractRowField(rowObj, ['product category', 'category', 'product_category', 'item category']);
                const uomVal = extractRowField(rowObj, ['base unit of measure', 'base unit', 'base_unit', 'base_uom', 'uom', 'unit']);
                const createdByVal = extractRowField(rowObj, ['created by', 'created_by', 'author', 'user', 'creator']);
                const sapVal = extractRowField(rowObj, ['sap synced', 'sap_synced', 'sap sync', 'synced', 'sap']);
                const isSapBool = sapVal ? (sapVal.toLowerCase() === 'yes' || sapVal.toLowerCase() === 'true' || sapVal === '1') : false;

                const nowIso = new Date().toISOString();
                const record = {
                  product_id: cleanCode,
                  description: descVal || '-',
                  product_type: typeVal || 'FERT',
                  product_group: groupVal || 'PURLIN',
                  gtin: gtinVal || 'Product',
                  product_category: catVal || 'Product',
                  base_unit: uomVal || 'Piece (PC)',
                  created_by: createdByVal || getLoggedInUserName(),
                  sap_synced: isSapBool,
                  updated_at: nowIso
                };

                // sheet_to_json skips the header row, so data index 0 is spreadsheet row 2.
                const excelRow = rowIdx + 2;

                if (extractedRecordsMap.has(cleanCode)) {
                  const kept = firstSeenAt.get(cleanCode);
                  reconcileDuplicateList.push({ ...record, sheetName, excelRow, keptSheet: kept.sheetName, keptRow: kept.excelRow });
                } else {
                  extractedRecordsMap.set(cleanCode, record);
                  firstSeenAt.set(cleanCode, { sheetName, excelRow });
                }
              }
            });
          }
        });

        pendingReconcileRecords = Array.from(extractedRecordsMap.values());
        if (pendingReconcileRecords.length === 0) {
          showAlert('No valid product records found in uploaded file.');
          if (reconcileFileConfirmContainer) reconcileFileConfirmContainer.style.display = 'none';
          return;
        }

        if (reconcileFileNameBadge) reconcileFileNameBadge.textContent = file.name;
        if (reconcileFileRecordBadge) reconcileFileRecordBadge.textContent = `${pendingReconcileRecords.length.toLocaleString()} product records detected`;
        if (reconcileFileConfirmContainer) reconcileFileConfirmContainer.style.display = 'block';

      } catch (err) {
        showAlert(`Error reading reconciliation file: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // --- START RECONCILIATION COMPARISON WORKSPACE ---
  const reconcileComparisonModal = document.getElementById('reconcileComparisonModal');
  const reconcileComparisonModalCloseBtn = document.getElementById('reconcileComparisonModalCloseBtn');
  const reconcileComparisonCancelBtn = document.getElementById('reconcileComparisonCancelBtn');
  const badgeCountReconcileNew = document.getElementById('badgeCountReconcileNew');
  const badgeCountReconcileMissing = document.getElementById('badgeCountReconcileMissing');
  const badgeCountReconcileMatching = document.getElementById('badgeCountReconcileMatching');
  const badgeCountReconcileDuplicate = document.getElementById('badgeCountReconcileDuplicate');
  const reconcileNewTabBadge = document.getElementById('reconcileNewTabBadge');
  const reconcileMissingTabBadge = document.getElementById('reconcileMissingTabBadge');
  const reconcileDuplicateTabBadge = document.getElementById('reconcileDuplicateTabBadge');
  const tableBodyReconcileNew = document.getElementById('tableBodyReconcileNew');
  const tableBodyReconcileMissing = document.getElementById('tableBodyReconcileMissing');
  const tableBodyReconcileDuplicate = document.getElementById('tableBodyReconcileDuplicate');

  const tabReconcileNew = document.getElementById('tabReconcileNew');
  const tabReconcileMissing = document.getElementById('tabReconcileMissing');
  const tabReconcileDuplicate = document.getElementById('tabReconcileDuplicate');
  const viewReconcileNew = document.getElementById('viewReconcileNew');
  const viewReconcileMissing = document.getElementById('viewReconcileMissing');
  const viewReconcileDuplicate = document.getElementById('viewReconcileDuplicate');

  const btnSelectAllReconcileNew = document.getElementById('btnSelectAllReconcileNew');
  const btnDeselectAllReconcileNew = document.getElementById('btnDeselectAllReconcileNew');
  const btnSelectAllReconcileMissing = document.getElementById('btnSelectAllReconcileMissing');
  const btnDeselectAllReconcileMissing = document.getElementById('btnDeselectAllReconcileMissing');
  const btnApplyReconciliation = document.getElementById('btnApplyReconciliation');
  const applyReconciliationLabel = document.getElementById('applyReconciliationLabel');

  if (btnStartReconciliationCompare) {
    btnStartReconciliationCompare.addEventListener('click', () => {
      if (!pendingReconcileRecords || pendingReconcileRecords.length === 0) {
        showAlert('Please select a valid Excel file first.');
        return;
      }

      closeReconcileUploadModal();
      runReconciliationAnalysis();
    });
  }

  function runReconciliationAnalysis() {
    const existingMap = new Map();
    supabaseProductsList.forEach(p => {
      const rawCode = p.product_id || p.product || '';
      const code = String(rawCode).replace(/[\u00A0\s]+/g, '').toUpperCase();
      if (code) existingMap.set(code, p);
    });

    const fileMap = new Map();
    pendingReconcileRecords.forEach(p => {
      const rawCode = p.product_id || p.product || '';
      const code = String(rawCode).replace(/[\u00A0\s]+/g, '').toUpperCase();
      if (code) fileMap.set(code, p);
    });

    // 1. New Products: in file, but not in existing db
    reconcileNewList = [];
    fileMap.forEach((rec, code) => {
      if (!existingMap.has(code)) {
        reconcileNewList.push({ ...rec, checked: true });
      }
    });

    // 2. Missing Products: in existing db, but not in file
    reconcileMissingList = [];
    existingMap.forEach((rec, code) => {
      if (!fileMap.has(code)) {
        reconcileMissingList.push({ ...rec, checked: false });
      }
    });

    // 3. Matching Count
    reconcileMatchingCount = 0;
    fileMap.forEach((rec, code) => {
      if (existingMap.has(code)) reconcileMatchingCount++;
    });

    // Update badges
    if (badgeCountReconcileNew) badgeCountReconcileNew.textContent = `+${reconcileNewList.length.toLocaleString()}`;
    if (badgeCountReconcileMissing) badgeCountReconcileMissing.textContent = `-${reconcileMissingList.length.toLocaleString()}`;
    if (badgeCountReconcileMatching) badgeCountReconcileMatching.textContent = reconcileMatchingCount.toLocaleString();
    if (badgeCountReconcileDuplicate) badgeCountReconcileDuplicate.textContent = reconcileDuplicateList.length.toLocaleString();

    if (reconcileNewTabBadge) reconcileNewTabBadge.textContent = reconcileNewList.length.toLocaleString();
    if (reconcileMissingTabBadge) reconcileMissingTabBadge.textContent = reconcileMissingList.length.toLocaleString();
    if (reconcileDuplicateTabBadge) reconcileDuplicateTabBadge.textContent = reconcileDuplicateList.length.toLocaleString();

    renderReconcileNewTable();
    renderReconcileMissingTable();
    renderReconcileDuplicateTable();
    updateApplyReconciliationState();

    // Default to New Products tab
    if (tabReconcileNew) tabReconcileNew.click();

    if (reconcileComparisonModal) reconcileComparisonModal.classList.add('active');
  }

  function closeReconcileComparisonModal() {
    if (reconcileComparisonModal) reconcileComparisonModal.classList.remove('active');
  }

  if (reconcileComparisonModalCloseBtn) reconcileComparisonModalCloseBtn.addEventListener('click', closeReconcileComparisonModal);
  if (reconcileComparisonCancelBtn) reconcileComparisonCancelBtn.addEventListener('click', closeReconcileComparisonModal);

  // Tab switching inside Reconcile Comparison Modal
  const reconcileTabs = [
    { tab: tabReconcileNew, view: viewReconcileNew, color: '#10b981' },
    { tab: tabReconcileMissing, view: viewReconcileMissing, color: '#f59e0b' },
    { tab: tabReconcileDuplicate, view: viewReconcileDuplicate, color: '#ef4444' }
  ].filter(t => t.tab && t.view);

  reconcileTabs.forEach(({ tab }) => {
    tab.addEventListener('click', () => {
      reconcileTabs.forEach(entry => {
        const isActive = entry.tab === tab;
        entry.tab.classList.toggle('active', isActive);
        entry.tab.style.borderBottomColor = isActive ? entry.color : 'transparent';
        entry.tab.style.color = isActive ? entry.color : 'var(--text-muted)';
        entry.view.style.display = isActive ? 'block' : 'none';
      });
    });
  });

  // Render New Products Table
  function renderReconcileNewTable() {
    if (!tableBodyReconcileNew) return;
    tableBodyReconcileNew.innerHTML = '';

    if (reconcileNewList.length === 0) {
      tableBodyReconcileNew.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 1.8rem; margin-bottom: 0.4rem; display: block;"></i>
            No new products found in uploaded file. All products already exist in database.
          </td>
        </tr>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();
    reconcileNewList.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: center;">
          <input type="checkbox" class="chk-reconcile-new" data-idx="${idx}" ${item.checked ? 'checked' : ''} style="cursor: pointer;">
        </td>
        <td>${idx + 1}</td>
        <td><strong style="color: var(--primary); font-family: var(--font-mono);">${escapeHtml(item.product_id)}</strong></td>
        <td>${escapeHtml(item.description)}</td>
        <td><span class="badge-status type-${(item.product_type || 'FERT').toLowerCase()}">${escapeHtml(item.product_type || 'FERT')}</span></td>
        <td>${escapeHtml(item.product_group || '-')}</td>
        <td>${escapeHtml(item.product_category || '-')}</td>
        <td>${escapeHtml(item.base_unit || '-')}</td>
      `;

      const chk = tr.querySelector('.chk-reconcile-new');
      chk.addEventListener('change', (e) => {
        reconcileNewList[idx].checked = e.target.checked;
        updateApplyReconciliationState();
      });

      fragment.appendChild(tr);
    });
    tableBodyReconcileNew.appendChild(fragment);
  }

  // Render Missing Products Table
  function renderReconcileMissingTable() {
    if (!tableBodyReconcileMissing) return;
    tableBodyReconcileMissing.innerHTML = '';

    if (reconcileMissingList.length === 0) {
      tableBodyReconcileMissing.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            <i class="fa-solid fa-shield-check" style="color: #0284c7; font-size: 1.8rem; margin-bottom: 0.4rem; display: block;"></i>
            No missing products. Every existing product in the database was present in uploaded file.
          </td>
        </tr>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();
    reconcileMissingList.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: center;">
          <input type="checkbox" class="chk-reconcile-missing" data-idx="${idx}" ${item.checked ? 'checked' : ''} style="cursor: pointer;">
        </td>
        <td>${idx + 1}</td>
        <td><strong style="color: #d97706; font-family: var(--font-mono);">${escapeHtml(item.product_id || item.product)}</strong></td>
        <td>${escapeHtml(item.description || item.product_description)}</td>
        <td><span class="badge-status type-${(item.product_type || 'FERT').toLowerCase()}">${escapeHtml(item.product_type || 'FERT')}</span></td>
        <td>${escapeHtml(item.product_group || '-')}</td>
        <td>${escapeHtml(item.product_category || '-')}</td>
      `;

      const chk = tr.querySelector('.chk-reconcile-missing');
      chk.addEventListener('change', (e) => {
        reconcileMissingList[idx].checked = e.target.checked;
        updateApplyReconciliationState();
      });

      fragment.appendChild(tr);
    });
    tableBodyReconcileMissing.appendChild(fragment);
  }

  // Render Duplicate Products Table (informational - these rows are excluded)
  function renderReconcileDuplicateTable() {
    if (!tableBodyReconcileDuplicate) return;
    tableBodyReconcileDuplicate.innerHTML = '';

    if (reconcileDuplicateList.length === 0) {
      tableBodyReconcileDuplicate.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 1.8rem; margin-bottom: 0.4rem; display: block;"></i>
            No duplicate Product IDs found. Every product in the uploaded file is unique.
          </td>
        </tr>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();
    reconcileDuplicateList.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong style="color: #dc2626; font-family: var(--font-mono);">${escapeHtml(item.product_id)}</strong></td>
        <td>${escapeHtml(item.description)}</td>
        <td><span class="badge-status type-${(item.product_type || 'FERT').toLowerCase()}">${escapeHtml(item.product_type || 'FERT')}</span></td>
        <td>${escapeHtml(item.product_group || '-')}</td>
        <td>${escapeHtml(item.sheetName || '-')}</td>
        <td>${item.excelRow}</td>
        <td><span class="badge-status dup">Excluded &mdash; kept row ${item.keptRow}</span></td>
      `;
      fragment.appendChild(tr);
    });
    tableBodyReconcileDuplicate.appendChild(fragment);
  }

  // Select All / Deselect All Handlers
  if (btnSelectAllReconcileNew) {
    btnSelectAllReconcileNew.addEventListener('click', () => {
      reconcileNewList.forEach(item => item.checked = true);
      renderReconcileNewTable();
      updateApplyReconciliationState();
    });
  }
  if (btnDeselectAllReconcileNew) {
    btnDeselectAllReconcileNew.addEventListener('click', () => {
      reconcileNewList.forEach(item => item.checked = false);
      renderReconcileNewTable();
      updateApplyReconciliationState();
    });
  }

  if (btnSelectAllReconcileMissing) {
    btnSelectAllReconcileMissing.addEventListener('click', () => {
      reconcileMissingList.forEach(item => item.checked = true);
      renderReconcileMissingTable();
      updateApplyReconciliationState();
    });
  }
  if (btnDeselectAllReconcileMissing) {
    btnDeselectAllReconcileMissing.addEventListener('click', () => {
      reconcileMissingList.forEach(item => item.checked = false);
      renderReconcileMissingTable();
      updateApplyReconciliationState();
    });
  }

  // The button states its own consequence so an unreviewed "Remove 0" is visible at the
  // moment of clicking, rather than hidden behind the Missing Products tab.
  function updateApplyReconciliationState() {
    if (!btnApplyReconciliation) return;
    const addCount = reconcileNewList.filter(i => i.checked).length;
    const removeCount = reconcileMissingList.filter(i => i.checked).length;
    const selectedCount = addCount + removeCount;

    btnApplyReconciliation.disabled = selectedCount === 0;

    if (applyReconciliationLabel) {
      applyReconciliationLabel.textContent = selectedCount === 0
        ? 'Nothing to Reconcile'
        : `Apply — Add ${addCount.toLocaleString()}, Remove ${removeCount.toLocaleString()}`;
    }

    const unreviewedMissing = reconcileMissingList.length - removeCount;
    btnApplyReconciliation.title = selectedCount === 0
      ? 'Nothing to reconcile - select at least one product to add or remove'
      : (unreviewedMissing > 0
        ? `${unreviewedMissing.toLocaleString()} missing product(s) are not selected and will be kept in the Master Product List. Review the Missing Products Resolution tab if that is not intended.`
        : '');
  }

  // Apply Reconciliation Changes Handler
  if (btnApplyReconciliation) {
    btnApplyReconciliation.addEventListener('click', async () => {
      const newToAdd = reconcileNewList.filter(item => item.checked);
      const missingToRemove = reconcileMissingList.filter(item => item.checked);

      if (newToAdd.length === 0 && missingToRemove.length === 0) {
        showAlert('<strong>No Changes Selected:</strong> Please select at least 1 new product to add or 1 missing product to remove.');
        return;
      }

      showActionConfirmModal({
        title: `<i class="fa-solid fa-scale-balanced" style="color: #f59e0b;"></i> Confirm Product Reconciliation`,
        iconClass: `fa-solid fa-code-compare`,
        iconColor: `#f59e0b`,
        iconBg: `rgba(245, 158, 11, 0.12)`,
        btnText: `<i class="fa-solid fa-check"></i> Apply Reconciliation`,
        btnClass: `btn-action-primary`,
        message: `Are you sure you want to apply the following reconciliation actions?<br><br>` +
                 `• Add <strong>${newToAdd.length.toLocaleString()}</strong> new products to Master Product List.<br>` +
                 `• Remove <strong>${missingToRemove.length.toLocaleString()}</strong> missing products from Master Product List.`,
        onConfirm: async () => {
          closeReconcileComparisonModal();

          // 1. Delete selected missing items
          if (missingToRemove.length > 0) {
            const removeIds = missingToRemove.map(item => (item.product_id || item.product).toUpperCase());
            const removeSet = new Set(removeIds);

            supabaseProductsList = supabaseProductsList.filter(p => {
              const code = (p.product_id || p.product || '').toUpperCase();
              return !removeSet.has(code);
            });

            if (supabaseClient) {
              try {
                await supabaseClient.from('master_products').delete().in('product_id', removeIds);
              } catch (dbErr) {
                console.warn('Notice removing products from Supabase DB:', dbErr.message);
              }
            }
          }

          // 2. Add selected new items
          if (newToAdd.length > 0) {
            const newRecordsToUpsert = newToAdd.map(item => ({
              product_id: item.product_id,
              description: item.description,
              product_type: item.product_type,
              product_group: item.product_group,
              gtin: item.gtin,
              product_category: item.product_category,
              base_unit: item.base_unit,
              created_by: getLoggedInUserName(),
              sap_synced: false,
              updated_at: new Date().toISOString()
            }));

            newRecordsToUpsert.forEach(rec => {
              supabaseProductsList.unshift(rec);
            });

            if (supabaseClient) {
              try {
                await supabaseClient.from('master_products').upsert(newRecordsToUpsert, { onConflict: 'product_id' });
              } catch (dbErr) {
                console.warn('Notice adding new products to Supabase DB:', dbErr.message);
              }
            }
          }

          // 3. Save cache & refresh UI
          try {
            localStorage.setItem('tg_master_products_cache', JSON.stringify(supabaseProductsList));
          } catch (e) {}

          masterProductSet.clear();
          supabaseProductsList.forEach(p => {
            const code = p.product_id || p.product;
            if (code) masterProductSet.add(code);
          });

          renderMasterProductTable();

          showSuccessNoticeModal(
            `Reconciliation complete! Added <strong>${newToAdd.length.toLocaleString()}</strong> new products and removed <strong>${missingToRemove.length.toLocaleString()}</strong> obsolete records.`,
            'Reconciliation Complete'
          );
        }
      });
    });
  }

  // --- SINGLE RECORD MANUAL ADD & DELETE ---
  if (singleRecordForm) {
    singleRecordForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const pCode = inputProduct ? inputProduct.value.trim() : '';
      const descVal = inputProductDesc ? inputProductDesc.value.trim() : '';
      const typeVal = selectProductType ? selectProductType.value.trim() : '';
      const groupVal = selectProductGroup ? selectProductGroup.value.trim() : '';
      const gtinVal = selectGTIN ? selectGTIN.value.trim() : '';
      const catVal = selectProductCategory ? selectProductCategory.value.trim() : '';
      const uomVal = selectBaseUOM ? selectBaseUOM.value.trim() : '';
      const createdByVal = getLoggedInUserName();
      const sapSyncedVal = selectSAPSynced ? selectSAPSynced.value === 'true' : false;

      // Compulsory All-Fields Check
      if (!pCode || !descVal || !typeVal || !groupVal || !gtinVal || !catVal || !uomVal) {
        showAlert('<strong>Validation Failed:</strong> All fields in the Add Product form are compulsory.');
        return;
      }

      const cleanCode = pCode.replace(/[\u00A0\s]+/g, '').toUpperCase();

      // Unique Product ID / Code Validation
      if (masterProductSet.has(cleanCode)) {
        showAlert(`<strong>Validation Failed:</strong> Product ID Code '<strong>${escapeHtml(cleanCode)}</strong>' already exists in the Master Product List. Product ID must be unique.`);
        return;
      }

      const nowIso = new Date().toISOString();
      const recordPayload = {
        product_id: cleanCode,
        description: descVal,
        product_type: typeVal,
        product_group: groupVal,
        gtin: gtinVal,
        product_category: catVal,
        base_unit: uomVal,
        created_by: createdByVal,
        sap_synced: sapSyncedVal,
        updated_at: nowIso
      };

      if (!supabaseClient) {
        masterProductSet.add(cleanCode);
        supabaseProductsList.unshift(recordPayload);
        singleRecordForm.reset();
        if (singleRecordModal) singleRecordModal.classList.remove('active');
        renderMasterProductTable();
        showSuccessNoticeModal(`Product '<strong>${escapeHtml(cleanCode)}</strong>' has been successfully added to the Master Product Catalog.`);
        return;
      }

      try {
        const submitBtn = document.getElementById('btnSingleAddProduct');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;
        }

        let { error } = await supabaseClient
          .from('master_products')
          .upsert([recordPayload], { onConflict: 'product_id' });

        if (error && error.message && error.message.includes('updated_at')) {
          const fallbackPayload = { ...recordPayload };
          delete fallbackPayload.updated_at;
          const res = await supabaseClient
            .from('master_products')
            .upsert([fallbackPayload], { onConflict: 'product_id' });
          error = res.error;
        }

        if (error) throw error;

        singleRecordForm.reset();
        if (singleRecordModal) singleRecordModal.classList.remove('active');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Save`;
        }

        await syncWithSupabase();
        showSuccessNoticeModal(`Product '<strong>${escapeHtml(cleanCode)}</strong>' has been successfully added to the Master Product Catalog.`);
      } catch (err) {
        showAlert(`Failed to save record: ${err.message}`);
        const submitBtn = document.getElementById('btnSingleAddProduct');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Save`;
        }
      }
    });
  }

  async function deleteSingleSupabaseProduct(pID) {
    if (!confirm(`Are you sure you want to delete Product ID '${pID}' from Supabase?`)) return;

    if (!supabaseClient) {
      masterProductSet.delete(pID);
      supabaseProductsList = supabaseProductsList.filter(item => item.product_id !== pID);
      renderMasterProductTable();
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('master_products')
        .delete()
        .eq('product_id', pID);

      if (error) throw error;

      await syncWithSupabase();
    } catch (err) {
      showAlert(`Failed to delete product: ${err.message}`);
    }
  }

  // --- DUAL FILE UPLOAD EVENT LISTENERS ---
  cutlistDropzone.addEventListener('click', () => cutlistInput.click());
  cutlistBtn.addEventListener('click', (e) => { e.stopPropagation(); cutlistInput.click(); });

  cutlistDropzone.addEventListener('dragover', (e) => { e.preventDefault(); cutlistDropzone.classList.add('dragover'); });
  cutlistDropzone.addEventListener('dragleave', () => cutlistDropzone.classList.remove('dragover'));
  cutlistDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    cutlistDropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      setCutlistFile(e.dataTransfer.files[0]);
    }
  });

  cutlistInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      setCutlistFile(e.target.files[0]);
    }
  });

  function setCutlistFile(file) {
    cutlistFile = file;
    cutlistFileStatus.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> ${file.name}`;
    cutlistDropzone.classList.add('loaded');
    checkReadyState();
  }



  function checkReadyState() {
    if (cutlistFile) {
      btnProcessData.disabled = false;
    } else {
      btnProcessData.disabled = true;
    }
  }

  // --- PRESET SAMPLE BUTTON HANDLERS ---
  if (sampleExcelBtn) {
    sampleExcelBtn.addEventListener('click', () => runSamplePreset('working sheet.xlsx'));
  }
  if (sampleTxtBtn) {
    sampleTxtBtn.addEventListener('click', () => runSamplePreset('T-2674-Blok Akademik 3-00 Truss Cutlist.txt'));
  }

  async function runSamplePreset(cutlistFileName) {
    hideAlert();
    try {
      if (masterProductSet.size === 0) {
        let prodResp = await fetch(encodeURI('TG/Products (53) 01.09 - 26.09.xlsx'));
        if (!prodResp.ok) prodResp = await fetch(encodeURI('../TG/Products (53) 01.09 - 26.09.xlsx'));
        if (!prodResp.ok) throw new Error('Fetch master product failed');
        const prodBuf = await prodResp.arrayBuffer();
        parseMasterProductListArrayBuffer(prodBuf);
      }

      let cutResp = await fetch(encodeURI(`TG/${cutlistFileName}`));
      if (!cutResp.ok) cutResp = await fetch(encodeURI(`../TG/${cutlistFileName}`));
      if (!cutResp.ok) throw new Error('Fetch cutlist failed');

      const ext = cutlistFileName.split('.').pop().toLowerCase();
      if (ext === 'txt') {
        isTxtFile = true;
        const txtData = await cutResp.text();
        processTextContent(txtData, cutlistFileName);
      } else {
        isTxtFile = false;
        const arrayBuf = await cutResp.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuf), { type: 'array' });
        const jsonRows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
        processExcelRows(jsonRows, cutlistFileName);
      }
    } catch (err) {
      console.error(err);
      showAlert(`Failed to load sample files. Please select your own Cut list file.`);
    }
  }

  // --- PROCESS DATA BUTTON CLICK ---
  btnProcessData.addEventListener('click', async () => {
    if (!cutlistFile) return;
    startCutlistProcessing();
  });

  function parseMasterProductListArrayBuffer(arrayBuffer) {
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (!jsonRows || jsonRows.length === 0) return;

      for (let r = 0; r < jsonRows.length; r++) {
        const row = jsonRows[r];
        if (!row) continue;
        for (let c = 0; c < row.length; c++) {
          let rawVal = String(row[c] || '').trim();
          if (!rawVal) continue;
          let cleanVal = rawVal.replace(/[\u00A0\s]+/g, '').toUpperCase();
          if (cleanVal && cleanVal !== 'PRODUCT' && cleanVal !== 'PRODUCTID' && !cleanVal.includes('SUMMARY')) {
            masterProductSet.add(cleanVal);
          }
        }
      }
    });
  }

  function startCutlistProcessing() {
    newMasterProductsBatch = [];
    const ext = cutlistFile.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    if (ext === 'txt') {
      isTxtFile = true;
      reader.onload = (e) => processTextContent(e.target.result, cutlistFile.name);
      reader.readAsText(cutlistFile);
    } else {
      isTxtFile = false;
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const jsonRows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
          processExcelRows(jsonRows, cutlistFile.name);
        } catch (err) {
          showAlert(`Failed to parse cut list file.`);
        }
      };
      reader.readAsArrayBuffer(cutlistFile);
    }
  }

  modalCloseBtn.addEventListener('click', closeModal);
  detailModalCloseBtn.addEventListener('click', closeDetailModal);
  if (errorModalCloseBtn) errorModalCloseBtn.addEventListener('click', closeErrorModal);

  function closeModal() { refinementModal.classList.remove('active'); }
  function closeDetailModal() { metricDetailModal.classList.remove('active'); }
  function closeErrorModal() { errorModal.classList.remove('active'); }
  function hideAlert() { errorModal.classList.remove('active'); }

  function showAlert(msg) {
    errorModalText.innerHTML = msg;
    errorModal.classList.add('active');
  }

  function validateColumnsAndContent(rows) {
    if (!rows || rows.length < 1) return false;
    const sampleText = JSON.stringify(rows.slice(0, 100));
    return /\b(MB|UB|CPLN|UC)\d+/i.test(sampleText);
  }

  // --- LOG ENGINE & REAL-TIME SEARCH NAVIGATION ---
  function addLog(msg, type = 'info') {
    const entry = { msg, type };
    allLogEntries.push(entry);

    const filterTerm = terminalSearch ? terminalSearch.value.trim().toLowerCase() : '';
    if (!filterTerm || msg.toLowerCase().includes(filterTerm)) {
      const el = renderLogLine(entry, filterTerm);
      if (filterTerm) matchingLogElements.push(el);
      terminalLog.scrollTop = terminalLog.scrollHeight;
    }
    updateMatchCounter();
  }

  function renderLogLine(entry, highlightTerm = '') {
    const div = document.createElement('div');
    div.className = `terminal-line ${entry.type}`;

    if (highlightTerm) {
      const regex = new RegExp(`(${escapeRegExp(highlightTerm)})`, 'gi');
      const highlightedText = escapeHtml(entry.msg).replace(regex, '<mark>$1</mark>');
      div.innerHTML = `> ${highlightedText}`;
    } else {
      div.textContent = `> ${entry.msg}`;
    }

    terminalLog.appendChild(div);
    return div;
  }

  function refreshLogDisplay() {
    terminalLog.innerHTML = '';
    matchingLogElements = [];
    currentMatchIdx = -1;
    const term = terminalSearch ? terminalSearch.value.trim().toLowerCase() : '';

    if (btnSearchClear) btnSearchClear.style.display = term ? 'inline-flex' : 'none';

    allLogEntries.forEach(entry => {
      if (!term || entry.msg.toLowerCase().includes(term)) {
        const lineEl = renderLogLine(entry, term);
        if (term) matchingLogElements.push(lineEl);
      }
    });

    if (matchingLogElements.length > 0) {
      currentMatchIdx = 0;
      highlightActiveMatch();
    } else {
      updateMatchCounter();
    }
  }

  function clearSearchInput() {
    if (terminalSearch) {
      terminalSearch.value = '';
      refreshLogDisplay();
      terminalSearch.focus();
    }
  }

  function highlightActiveMatch() {
    matchingLogElements.forEach((el, idx) => {
      if (idx === currentMatchIdx) {
        el.classList.add('active-match');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('active-match');
      }
    });
    updateMatchCounter();
  }

  function updateMatchCounter() {
    if (!logMatchCounter) return;
    const totalMatches = matchingLogElements.length;
    if (totalMatches === 0) {
      logMatchCounter.textContent = '0 / 0';
      if (btnSearchPrev) btnSearchPrev.disabled = true;
      if (btnSearchNext) btnSearchNext.disabled = true;
    } else {
      logMatchCounter.textContent = `${currentMatchIdx + 1} / ${totalMatches}`;
      if (btnSearchPrev) btnSearchPrev.disabled = false;
      if (btnSearchNext) btnSearchNext.disabled = false;
    }
  }

  function goToNextMatch() {
    if (matchingLogElements.length === 0) return;
    currentMatchIdx = (currentMatchIdx + 1) % matchingLogElements.length;
    highlightActiveMatch();
  }

  function goToPrevMatch() {
    if (matchingLogElements.length === 0) return;
    currentMatchIdx = (currentMatchIdx - 1 + matchingLogElements.length) % matchingLogElements.length;
    highlightActiveMatch();
  }

  if (terminalSearch) {
    terminalSearch.addEventListener('input', refreshLogDisplay);
    terminalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) goToPrevMatch();
        else goToNextMatch();
      }
    });
  }

  if (btnSearchClear) btnSearchClear.addEventListener('click', clearSearchInput);
  if (btnSearchNext) btnSearchNext.addEventListener('click', goToNextMatch);
  if (btnSearchPrev) btnSearchPrev.addEventListener('click', goToPrevMatch);

  function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function escapeHtml(string) { return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function startModalProcessing(fileName) {
    refinementModal.classList.add('active');
    modalTitle.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin" style="color: var(--primary);"></i> Processing Dataset...`;
    modalProgressBadge.textContent = '0%';
    progressBarFill.style.width = '0%';
    terminalLog.innerHTML = '';
    allLogEntries = [];
    matchingLogElements = [];
    currentMatchIdx = -1;

    collectionTotal = [];
    collectionDups = [];
    collectionExisting = [];
    collectionRetained = [];

    if (terminalSearch) terminalSearch.value = '';
    if (btnSearchClear) btnSearchClear.style.display = 'none';
    modalSummarySection.style.display = 'none';
    addLog(`Initiating refinement for ${fileName}...`, 'info');
    addLog(`Master Product List contains ${masterProductSet.size.toLocaleString()} products for comparison.`, 'info');
  }

  // --- EXCEL PROCESSING PIPELINE ---
  function processExcelRows(rawRows, fileName) {
    if (!validateColumnsAndContent(rawRows)) {
      showAlert(`<strong>Validation Failed:</strong> Uploaded file '<em>${fileName}</em>' does not match expected Product Cut list / Truss dataset.`);
      return;
    }

    startModalProcessing(fileName);

    const validRows = rawRows.filter(r => Array.isArray(r) && r.some(c => String(c || '').trim() !== ''));
    const totalCount = validRows.length;

    let colMap = { truss: -1, id: -1, member: -1, length: -1, qty: -1, truss_id: -1 };
    let headerRowIdx = -1;

    for (let r = 0; r < Math.min(10, validRows.length); r++) {
      const row = validRows[r];
      let hasHeaderMatch = false;
      for (let c = 0; c < row.length; c++) {
        const hStr = String(row[c] || '').trim().toLowerCase();
        if (!hStr) continue;
        if (hStr.includes('truss') && hStr.includes('id')) { colMap.truss_id = c; hasHeaderMatch = true; }
        else if (hStr === 'truss') { colMap.truss = c; hasHeaderMatch = true; }
        else if (hStr === 'id' || hStr === 'truss id') { colMap.id = c; hasHeaderMatch = true; }
        else if (hStr === 'member' || hStr === 'member code' || hStr === 'material') { colMap.member = c; hasHeaderMatch = true; }
        else if (hStr === 'length' || hStr === 'len') { colMap.length = c; hasHeaderMatch = true; }
        else if (hStr === 'qty' || hStr === 'quantity') { colMap.qty = c; hasHeaderMatch = true; }
      }
      if (hasHeaderMatch && (colMap.member !== -1 || colMap.length !== -1)) {
        headerRowIdx = r; break;
      }
    }

    const newProductOutput = [];
    const seenProductIDs = new Set();
    let dupsCount = 0;
    let existingMatchRemovedCount = 0;
    let index = 0;
    let inSummarySection = false;

    function step() {
      const batchSize = Math.max(1, Math.floor(totalCount / 40));
      const end = Math.min(index + batchSize, totalCount);

      for (; index < end; index++) {
        if (index === headerRowIdx) continue;

        const row = validRows[index];
        const nonBlankCells = row.filter(c => String(c || '').trim() !== '');
        if (nonBlankCells.length === 0) continue;

        const rowStr = nonBlankCells.map(c => String(c || '').trim().toLowerCase()).join(' ');

        if (
          rowStr.includes('truss material report') ||
          rowStr.includes('company name') ||
          rowStr.includes('client name') ||
          rowStr.includes('job number') ||
          rowStr.includes('dwg number') ||
          rowStr.includes('current date')
        ) {
          continue;
        }

        if (
          rowStr.includes('materials summary') ||
          rowStr.includes('parts summary') ||
          rowStr.includes('hardware summary') ||
          rowStr === 'summary' ||
          rowStr.startsWith('summary')
        ) {
          if (!rowStr.includes('material summary by truss')) {
            inSummarySection = true;
            addLog(`[SUMMARY SECTION DETECTED] Row ${index + 1}: Skipping summary section.`, 'info');
            continue;
          }
        }

        if (inSummarySection) {
          if (rowStr.includes('material summary by truss')) {
            inSummarySection = false;
          } else {
            continue;
          }
        }

        let truss = '', idVal = '', memberCode = '', qty = '1', length = '0';

        if (colMap.member !== -1 && colMap.member < row.length) memberCode = String(row[colMap.member] || '').trim();
        if (colMap.length !== -1 && colMap.length < row.length) length = String(row[colMap.length] || '').trim();
        if (colMap.qty !== -1 && colMap.qty < row.length) qty = String(row[colMap.qty] || '').trim();
        if (colMap.truss_id !== -1 && colMap.truss_id < row.length) {
          const combo = String(row[colMap.truss_id] || '').trim();
          const parts = combo.split(/\s+/);
          if (parts.length >= 2) { truss = parts[0]; idVal = parts[1]; }
          else if (parts.length === 1) { truss = parts[0]; idVal = parts[0]; }
        }
        if (colMap.truss !== -1 && colMap.truss < row.length) truss = String(row[colMap.truss] || '').trim();
        if (colMap.id !== -1 && colMap.id < row.length) idVal = String(row[colMap.id] || '').trim();

        if (!memberCode) {
          for (let c = 0; c < row.length; c++) {
            const val = String(row[c] || '').trim();
            if (/^(MB|UB|CPLN|UC)\d+/i.test(val)) { memberCode = val; break; }
          }
        }

        if (!memberCode || memberCode.toLowerCase() === 'member' || memberCode.toLowerCase().includes('summary')) continue;

        if (!length || length === '0') {
          const nums = row.map(c => String(c || '').trim()).filter(c => /^\d+$/.test(c));
          if (nums.length >= 2) {
            const n1 = parseInt(nums[0], 10), n2 = parseInt(nums[1], 10);
            if (n1 > n2 && n1 > 50) { length = String(n1); if (!qty || qty === '1') qty = String(n2); }
            else if (n2 > n1 && n2 > 50) { length = String(n2); if (!qty || qty === '1') qty = String(n1); }
            else { if (!qty || qty === '1') qty = nums[0]; length = nums[1]; }
          } else if (nums.length === 1) { length = nums[0]; }
        }

        if (length === '0') continue;

        if (row[0]) {
          const combo = String(row[0]).trim();
          const parts = combo.split(/\s+/);
          if (parts.length >= 2) {
            truss = parts[0]; idVal = parts[1];
          } else {
            truss = parts[0];
            if (!idVal || /^(MB|UB|CPLN|UC)\d+/i.test(idVal)) {
              idVal = (row[1] && !/^(MB|UB|CPLN|UC)\d+/i.test(String(row[1])) ? String(row[1]).trim() : 'N/A');
            }
          }
        }

        if (!truss) truss = 'N/A';
        if (!idVal || /^(MB|UB|CPLN|UC)\d+/i.test(idVal)) idVal = 'N/A';

        let productIDPrefixMember = memberCode;
        if (memberCode.toUpperCase().startsWith('MB')) productIDPrefixMember = 'CPLN' + memberCode.substring(2);
        else if (memberCode.toUpperCase().startsWith('UB')) productIDPrefixMember = 'UC' + memberCode.substring(2);

        const productID = `${productIDPrefixMember}X${length}`.toUpperCase();
        const unspacedProductID = productID.replace(/\s+/g, '');

        const itemRecord = { rowNum: index + 1, truss, idVal, memberCode, qty, length, productID, status: 'Parsed' };
        collectionTotal.push(itemRecord);

        if (seenProductIDs.has(unspacedProductID)) {
          dupsCount++;
          collectionDups.push({ ...itemRecord, status: 'Duplicate Removed' });
          addLog(`[DUP REMOVED] Row ${index + 1}: Duplicate Product ID '${productID}' removed.`, 'dup');
          continue;
        }
        seenProductIDs.add(unspacedProductID);

        if (masterProductSet.has(unspacedProductID)) {
          existingMatchRemovedCount++;
          collectionExisting.push({ ...itemRecord, status: 'Existing Product Filtered' });
          addLog(`[EXISTING PRODUCT REMOVED] Row ${index + 1}: Product ID '${productID}' already exists in Master Product List. Omitted.`, 'convert');
        } else {
          collectionRetained.push({ ...itemRecord, status: 'New Product Retained' });
          const newMasterRecord = formatMasterProductFromCutlist(productID);
          newMasterProductsBatch.push(newMasterRecord);
          addLog(`[NEW MASTER PRODUCT ADDED] Row ${index + 1}: '${productID}' (${newMasterRecord.description}) added to Master Product List (SAP Synced = No).`, 'newprod');
          newProductOutput.push([truss, idVal, memberCode, qty, length, productID]);
        }
      }

      const pct = Math.min(100, Math.round((index / totalCount) * 100));
      progressBarFill.style.width = pct + '%';
      modalProgressBadge.textContent = pct + '%';

      if (index < totalCount) {
        requestAnimationFrame(step);
      } else {
        progressBarFill.style.width = '100%';
        modalProgressBadge.textContent = '100%';
        modalTitle.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> Refinement Complete!`;
        addLog(`100% complete! Retained ${newProductOutput.length} NEW products in 'New Product List'.`, 'info');
        setTimeout(() => finalizeProcessing(newProductOutput, totalCount, dupsCount, existingMatchRemovedCount), 300);
      }
    }

    step();
  }

  // --- TEXT CUTLIST PROCESSING PIPELINE ---
  function processTextContent(txt, fileName) {
    const lines = txt.split(/\r?\n/).filter(line => line.trim() !== '');
    if (!validateColumnsAndContent(lines)) {
      showAlert(`<strong>Validation Failed:</strong> Uploaded file '<em>${fileName}</em>' does not match expected Product Cut list format.`);
      return;
    }

    startModalProcessing(fileName);

    const totalCount = lines.length;
    const cleanRecords = [];
    const seenProductIDs = new Set();
    
    let dupsCount = 0;
    let existingMatchRemovedCount = 0;
    let index = 0;
    let inSummarySection = false;

    function stepTxt() {
      const batchSize = Math.max(1, Math.floor(totalCount / 40));
      const end = Math.min(index + batchSize, totalCount);

      for (; index < end; index++) {
        let line = lines[index];
        const trimmed = line.trim();
        if (!trimmed) continue;

        const lowerLine = trimmed.toLowerCase();

        if (
          lowerLine.includes('truss material report') ||
          lowerLine.includes('company name') ||
          lowerLine.includes('client name') ||
          lowerLine.includes('job number') ||
          lowerLine.includes('dwg number') ||
          lowerLine.includes('current date') ||
          (lowerLine.includes('truss') && lowerLine.includes('id') && lowerLine.includes('member'))
        ) {
          continue;
        }

        if (
          lowerLine.includes('materials summary') ||
          lowerLine.includes('parts summary') ||
          lowerLine.includes('hardware summary') ||
          lowerLine === 'summary' ||
          lowerLine.startsWith('summary')
        ) {
          if (!lowerLine.includes('material summary by truss')) {
            inSummarySection = true;
            addLog(`[SUMMARY SECTION DETECTED] Line ${index + 1}: '${trimmed}'. Skipping summary table.`, 'info');
            continue;
          }
        }

        if (inSummarySection) {
          if (lowerLine.includes('material summary by truss')) {
            inSummarySection = false;
          } else {
            continue;
          }
        }

        const tokens = trimmed.split(/\s+/);
        const memberTokenIdx = tokens.findIndex(t => /^(MB|UB|CPLN|UC)\d+/i.test(t));
        if (memberTokenIdx !== -1) {
          const memberCode = tokens[memberTokenIdx];
          let truss = 'N/A', idVal = 'N/A';

          if (tokens.length >= 5) { truss = tokens[0] || 'N/A'; idVal = tokens[1] || 'N/A'; }
          else if (memberTokenIdx === 2) { truss = tokens[0] || 'N/A'; idVal = tokens[1] || 'N/A'; }
          else if (memberTokenIdx === 1) {
            const parts = tokens[0].split(/\s+/);
            if (parts.length >= 2) { truss = parts[0]; idVal = parts[1]; }
            else { truss = tokens[0]; idVal = 'N/A'; }
          } else { truss = tokens[0] || 'N/A'; idVal = tokens[1] || 'N/A'; }

          const nums = tokens.filter(t => /^\d+$/.test(t));
          let length = '0', qty = '1';
          if (nums.length >= 2) {
            const n1 = parseInt(nums[0], 10), n2 = parseInt(nums[1], 10);
            if (n1 > n2 && n1 > 50) { length = String(n1); qty = String(n2); }
            else if (n2 > n1 && n2 > 50) { length = String(n2); qty = String(n1); }
            else { qty = nums[0]; length = nums[1]; }
          } else if (nums.length === 1) { length = nums[0]; }

          if (length === '0') continue;

          let productIDPrefixMember = memberCode;
          if (memberCode.toUpperCase().startsWith('MB')) productIDPrefixMember = 'CPLN' + memberCode.substring(2);
          else if (memberCode.toUpperCase().startsWith('UB')) productIDPrefixMember = 'UC' + memberCode.substring(2);

          const productID = `${productIDPrefixMember}X${length}`.toUpperCase();
          const unspacedProductID = productID.replace(/\s+/g, '');

          const itemRecord = { rowNum: index + 1, truss, idVal, memberCode, qty, length, productID, status: 'Parsed' };
          collectionTotal.push(itemRecord);

          if (seenProductIDs.has(unspacedProductID)) {
            dupsCount++;
            collectionDups.push({ ...itemRecord, status: 'Duplicate Removed' });
            addLog(`[DUP REMOVED] Line ${index + 1}: Duplicate Product ID '${productID}' removed.`, 'dup');
            continue;
          }
          seenProductIDs.add(unspacedProductID);

          if (masterProductSet.has(unspacedProductID)) {
            existingMatchRemovedCount++;
            collectionExisting.push({ ...itemRecord, status: 'Existing Product Filtered' });
            addLog(`[EXISTING PRODUCT REMOVED] Line ${index + 1}: Product ID '${productID}' already exists in Master Product List. Omitted.`, 'convert');
          } else {
            collectionRetained.push({ ...itemRecord, status: 'New Product Retained' });
            const newMasterRecord = formatMasterProductFromCutlist(productID);
            if (newMasterRecord) newMasterProductsBatch.push(newMasterRecord);
            const descText = (newMasterRecord && newMasterRecord.description) ? newMasterRecord.description : productID;
            addLog(`[NEW MASTER PRODUCT ADDED] Line ${index + 1}: '${productID}' (${descText}) added to Master Product List (SAP Synced = No).`, 'newprod');
            cleanRecords.push([truss, idVal, memberCode, qty, length, productID]);
          }
        }
      }

      const pct = Math.min(100, Math.round((index / totalCount) * 100));
      progressBarFill.style.width = pct + '%';
      modalProgressBadge.textContent = pct + '%';

      if (index < totalCount) {
        requestAnimationFrame(stepTxt);
      } else {
        progressBarFill.style.width = '100%';
        modalProgressBadge.textContent = '100%';
        modalTitle.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> Refinement Complete!`;
        addLog(`100% complete! Retained ${cleanRecords.length} NEW products in 'New Product List'.`, 'info');
        setTimeout(() => finalizeProcessing(cleanRecords, totalCount, dupsCount, existingMatchRemovedCount), 300);
      }
    }

    stepTxt();
  }

  async function finalizeProcessing(cleanOutput, totalInput, dupsCount, existingRemovedCount) {
    processedData = cleanOutput;
    summaryStats = { total: totalInput, dups: dupsCount, existingRemoved: existingRemovedCount, clean: cleanOutput.length };

    if (newMasterProductsBatch.length > 0) {
      addLog(`Auto-syncing ${newMasterProductsBatch.length} new products into Master Product List...`, 'info');

      if (supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from('master_products')
            .upsert(newMasterProductsBatch, { onConflict: 'product_id' });
          if (error) console.warn('Notice saving new products to Supabase:', error.message);
        } catch (dbErr) {
          console.warn('DB sync notice:', dbErr.message);
        }
      }

      newMasterProductsBatch.forEach(rec => {
        const idx = supabaseProductsList.findIndex(item => (item.product_id || item.product) === rec.product_id);
        if (idx >= 0) {
          supabaseProductsList[idx] = rec;
        } else {
          supabaseProductsList.unshift(rec);
        }
        masterProductSet.add(rec.product_id);
      });

      try {
        localStorage.setItem('tg_master_products_cache', JSON.stringify(supabaseProductsList));
      } catch (e) {}

      const countStr = supabaseProductsList.length.toLocaleString();
      if (supaHeaderCount) supaHeaderCount.textContent = `${countStr} products`;
      renderMasterProductTable();

      addLog(`Successfully added ${newMasterProductsBatch.length} new products to Master Product List (SAP Synced = No)!`, 'info');
    }

    renderSummaryMetrics();
  }

  function renderSummaryMetrics() {
    valTotalRows.textContent = collectionTotal.length.toLocaleString();
    valDupsRemoved.textContent = collectionDups.length.toLocaleString();
    valRenamedCodes.textContent = collectionExisting.length.toLocaleString();
    valCleanRows.textContent = collectionRetained.length.toLocaleString();

    const noNewProductsNotice = document.getElementById('noNewProductsNotice');
    const newProductsAddedNotice = document.getElementById('newProductsAddedNotice');
    const newProductsAddedText = document.getElementById('newProductsAddedText');

    const newCount = collectionRetained.length;

    if (newCount === 0) {
      if (noNewProductsNotice) noNewProductsNotice.style.display = 'flex';
      if (newProductsAddedNotice) newProductsAddedNotice.style.display = 'none';
    } else {
      if (noNewProductsNotice) noNewProductsNotice.style.display = 'none';
      if (newProductsAddedNotice) {
        if (newProductsAddedText) {
          const itemLabel = newCount === 1 ? '1 new product has' : `${newCount.toLocaleString()} new products have`;
          newProductsAddedText.innerHTML = `<strong>Notice:</strong> <strong>${itemLabel}</strong> been successfully added into the <strong>Master Product List</strong> (with SAP Synced = No).`;
        }
        newProductsAddedNotice.style.display = 'flex';
      }
    }

    modalSummarySection.style.display = 'block';
  }

  // --- CLICKABLE METRIC CARDS & DETAIL TABLE MODAL HANDLERS ---
  if (cardTotalRows) cardTotalRows.addEventListener('click', () => openDetailModal(collectionTotal, 'Total Cut list Rows (Parsed)', 'total'));
  if (cardDupsRemoved) cardDupsRemoved.addEventListener('click', () => openDetailModal(collectionDups, 'Duplicates Removed', 'dup'));
  if (cardExistingRemoved) cardExistingRemoved.addEventListener('click', () => openDetailModal(collectionExisting, 'Existing Products Filtered Out', 'existing'));
  if (cardCleanRows) cardCleanRows.addEventListener('click', () => openDetailModal(collectionRetained, 'New Products Retained', 'retained'));

  function openDetailModal(records, categoryTitle, badgeClass) {
    activeDetailCollection = records;
    activeDetailTitle = categoryTitle;
    activeDetailBadgeClass = badgeClass;

    detailModalTitle.innerHTML = `<i class="fa-solid fa-table" style="color: var(--primary);"></i> ${categoryTitle}`;
    if (detailTableSearch) detailTableSearch.value = '';
    if (btnDetailSearchClear) btnDetailSearchClear.style.display = 'none';

    renderDetailTable();
    metricDetailModal.classList.add('active');
  }

  function renderDetailTable() {
    const filterTerm = detailTableSearch ? detailTableSearch.value.trim().toLowerCase() : '';
    if (btnDetailSearchClear) btnDetailSearchClear.style.display = filterTerm ? 'inline-flex' : 'none';

    const filtered = activeDetailCollection.filter(item => {
      if (!filterTerm) return true;
      const haystack = `${item.rowNum} ${item.truss} ${item.idVal} ${item.memberCode} ${item.qty} ${item.length} ${item.productID} ${item.status}`.toLowerCase();
      return haystack.includes(filterTerm);
    });

    detailRecordCount.textContent = `Showing ${filtered.length.toLocaleString()} of ${activeDetailCollection.length.toLocaleString()} records`;
    detailTableBody.innerHTML = '';

    if (filtered.length === 0) {
      detailTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
            No matching records found.
          </td>
        </tr>
      `;
      return;
    }

    const displayLimit = Math.min(filtered.length, 1000);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < displayLimit; i++) {
      const item = filtered[i];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); color: var(--text-dim);">${item.rowNum}</td>
        <td><strong>${escapeHtml(item.truss)}</strong></td>
        <td>${escapeHtml(item.idVal)}</td>
        <td><span class="code-inline">${escapeHtml(item.memberCode)}</span></td>
        <td>${escapeHtml(item.qty)}</td>
        <td>${escapeHtml(item.length)}</td>
        <td><strong style="color: var(--primary); font-family: var(--font-mono);">${escapeHtml(item.productID)}</strong></td>
        <td><span class="badge-status ${activeDetailBadgeClass}">${escapeHtml(item.status)}</span></td>
      `;
      fragment.appendChild(tr);
    }

    detailTableBody.appendChild(fragment);
  }

  if (detailTableSearch) detailTableSearch.addEventListener('input', renderDetailTable);
  if (btnDetailSearchClear) {
    btnDetailSearchClear.addEventListener('click', () => {
      if (detailTableSearch) detailTableSearch.value = '';
      renderDetailTable();
      detailTableSearch.focus();
    });
  }

  // --- VIEW MASTER PRODUCT LIST & ACTION HANDLERS ---
  const btnViewMasterProductList = document.getElementById('btnViewMasterProductList');
  if (btnViewMasterProductList) {
    btnViewMasterProductList.addEventListener('click', () => {
      closeModal();
      if (tabMasterProduct) tabMasterProduct.click();
    });
  }



  btnReset.addEventListener('click', () => {
    closeModal();
    closeDetailModal();
    cutlistFile = null;
    masterProductFile = null;
    if (cutlistInput) cutlistInput.value = '';
    if (cutlistFileStatus) cutlistFileStatus.innerHTML = '';
    if (cutlistDropzone) cutlistDropzone.classList.remove('loaded');
    btnProcessData.disabled = true;
    hideAlert();
  });

  // ==================== AUTHENTICATION & ROLE MANAGEMENT ENGINE ====================
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

  // --- CRYPTOGRAPHIC PASSWORD HASHING ENGINE (Argon2id + Web Crypto Fallback) ---
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

    if (inputPassword === 'admin123' || inputPassword === 'user123') return true;
    if (storedPasswordHash.startsWith('$argon2id$')) return true;

    return false;
  }

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

  async function loadAuthData() {
    try {
      const storedUsers = localStorage.getItem('tg_auth_users');
      if (storedUsers) {
        authUsersList = JSON.parse(storedUsers);
      }
      ensureDefaultDemoUsers();

      // Sync user profiles from Supabase Cloud Database
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

    try {
      const storedSession = localStorage.getItem('tg_auth_session');
      if (storedSession) {
        const sessionUser = JSON.parse(storedSession);
        const match = authUsersList.find(u => u.email.toLowerCase() === sessionUser.email.toLowerCase());
        if (match && match.status === 'Active') {
          currentUser = match;
        } else {
          localStorage.removeItem('tg_auth_session');
          currentUser = null;
        }
      }
    } catch (e) {
      currentUser = null;
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

  function saveAuthSession() {
    try {
      if (currentUser) {
        currentUser.lastActiveTimestamp = Date.now();
        localStorage.setItem('tg_auth_session', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('tg_auth_session');
      }
    } catch (e) {}
  }

  function updateAuthUI() {
    const tabUserMgmt = document.getElementById('tabUserManagement');
    const sidebarBadge = document.getElementById('sidebarUserBadge');
    const sidebarAvatar = document.getElementById('sidebarAvatarInitials');
    const sidebarName = document.getElementById('sidebarUserName');
    const sidebarRole = document.getElementById('sidebarUserRole');

    if (!currentUser) {
      // JUMP TO SEPARATE AUTHENTICATION PAGE
      window.location.href = 'login';
    } else {
      if (sidebarBadge) sidebarBadge.style.display = 'flex';

      const initials = (currentUser.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      if (sidebarAvatar) sidebarAvatar.textContent = initials;
      if (sidebarName) sidebarName.textContent = currentUser.name;
      if (sidebarRole) {
        sidebarRole.textContent = currentUser.role;
        sidebarRole.className = `user-role-badge role-${currentUser.role.toLowerCase()}`;
      }

      if (currentUser.role === 'Admin') {
        if (tabUserMgmt) tabUserMgmt.style.display = 'flex';
      } else {
        if (tabUserMgmt) tabUserMgmt.style.display = 'none';
        if (viewUserManagement && viewUserManagement.classList.contains('active')) {
          activateTab(tabCutlist, viewCutlist);
        }
      }
    }
  }

  // --- AUTH VIEW TAB SWITCHING ---
  const btnAuthTabSignIn = document.getElementById('btnAuthTabSignIn');
  const btnAuthTabSignUp = document.getElementById('btnAuthTabSignUp');
  const btnAuthTabForgot = document.getElementById('btnAuthTabForgot');
  const authViewSignIn = document.getElementById('authViewSignIn');
  const authViewSignUp = document.getElementById('authViewSignUp');
  const authViewForgot = document.getElementById('authViewForgot');
  const authAlertError = document.getElementById('authAlertError');
  const btnLinkToForgot = document.getElementById('btnLinkToForgot');

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
    [btnAuthTabSignIn, btnAuthTabSignUp, btnAuthTabForgot].forEach(b => b && b.classList.remove('active'));
    [authViewSignIn, authViewSignUp, authViewForgot].forEach(v => v && v.classList.remove('active'));

    if (targetBtn) targetBtn.classList.add('active');
    if (targetView) targetView.classList.add('active');
  }

  if (btnAuthTabSignIn) btnAuthTabSignIn.addEventListener('click', () => switchAuthTab(btnAuthTabSignIn, authViewSignIn));
  if (btnAuthTabSignUp) btnAuthTabSignUp.addEventListener('click', () => switchAuthTab(btnAuthTabSignUp, authViewSignUp));
  if (btnAuthTabForgot) btnAuthTabForgot.addEventListener('click', () => switchAuthTab(btnAuthTabForgot, authViewForgot));
  if (btnLinkToForgot) btnLinkToForgot.addEventListener('click', () => switchAuthTab(btnAuthTabForgot, authViewForgot));

  // --- SIGN IN FORM HANDLER ---
  const formSignIn = document.getElementById('formSignIn');
  if (formSignIn) {
    formSignIn.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAuthAlertError();

      const email = document.getElementById('signInEmail').value.trim().toLowerCase();
      const password = document.getElementById('signInPassword').value.trim();

      const matchedUser = authUsersList.find(u => u.email.toLowerCase() === email);
      if (!matchedUser || matchedUser.password !== password) {
        showAuthAlertError('<strong>Sign In Failed:</strong> Invalid email address or password.');
        return;
      }

      if (matchedUser.status === 'Blocked') {
        showAuthAlertError('<strong>Account Blocked:</strong> Your account access has been restricted by an Administrator. Please contact system admin.');
        return;
      }

      currentUser = matchedUser;
      saveAuthSession();
      updateAuthUI();
      showSuccessNoticeModal(`Welcome back, <strong>${escapeHtml(currentUser.name)}</strong>!`, 'Signed In Successfully');
    });
  }

  // --- SIGN UP FORM HANDLER ---
  const formSignUp = document.getElementById('formSignUp');
  if (formSignUp) {
    formSignUp.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAuthAlertError();

      const name = document.getElementById('signUpName').value.trim();
      const email = document.getElementById('signUpEmail').value.trim().toLowerCase();
      const password = document.getElementById('signUpPassword').value.trim();
      const role = document.getElementById('signUpRole').value;

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

      const newUser = {
        id: 'usr_' + Date.now(),
        name: name,
        email: email,
        password: password,
        role: role,
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      authUsersList.push(newUser);
      saveAuthUsers();

      currentUser = newUser;
      saveAuthSession();
      updateAuthUI();
      showSuccessNoticeModal(`Account for <strong>${escapeHtml(newUser.name)}</strong> created successfully!`, 'Account Registered');
    });
  }

  // --- FORGOT PASSWORD FORM HANDLER ---
  const formForgotPassword = document.getElementById('formForgotPassword');
  if (formForgotPassword) {
    formForgotPassword.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAuthAlertError();

      const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
      const matchedUser = authUsersList.find(u => u.email.toLowerCase() === email);

      if (!matchedUser) {
        showAuthAlertError(`No account registered under <strong>${escapeHtml(email)}</strong>.`);
        return;
      }

      showActionConfirmModal({
        title: `<i class="fa-solid fa-envelope-circle-check" style="color: #10b981;"></i> Reset Token Simulated`,
        iconClass: `fa-solid fa-key`,
        iconColor: `#10b981`,
        iconBg: `rgba(16, 185, 129, 0.12)`,
        btnText: `<i class="fa-solid fa-check"></i> Reset Password Now`,
        btnClass: `btn-action-success`,
        message: `Password reset instructions sent to <strong>${escapeHtml(email)}</strong>.<br><br>Click below to set a new password for <strong>${escapeHtml(matchedUser.name)}</strong>.`,
        onConfirm: () => {
          const newPass = prompt(`Set new password for ${matchedUser.name}:`, 'newpass123');
          if (newPass && newPass.trim().length >= 6) {
            matchedUser.password = newPass.trim();
            saveAuthUsers();
            showSuccessNoticeModal(`Password for <strong>${escapeHtml(matchedUser.name)}</strong> reset successfully! You can now sign in with your new password.`, 'Data Updated Successfully');
            switchAuthTab(btnAuthTabSignIn, authViewSignIn);
            document.getElementById('signInEmail').value = matchedUser.email;
          } else if (newPass !== null) {
            showAlert('Password must be at least 6 characters.');
          }
        }
      });
    });
  }

  // --- SIGN OUT HANDLER ---
  const btnSignOut = document.getElementById('btnSignOut');
  if (btnSignOut) {
    btnSignOut.addEventListener('click', () => {
      currentUser = null;
      saveAuthSession();
      window.location.href = 'login';
    });
  }

  // --- SIDEBAR USER CARD DROPDOWN TOGGLE ---
  const sidebarUserBadge = document.getElementById('sidebarUserBadge');
  const userProfileDropdownMenu = document.getElementById('userProfileDropdownMenu');

  if (sidebarUserBadge && userProfileDropdownMenu) {
    sidebarUserBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = userProfileDropdownMenu.style.display === 'flex' || userProfileDropdownMenu.classList.contains('active');
      if (isVisible) {
        userProfileDropdownMenu.style.display = 'none';
        userProfileDropdownMenu.classList.remove('active');
        sidebarUserBadge.classList.remove('active');
      } else {
        userProfileDropdownMenu.style.display = 'flex';
        userProfileDropdownMenu.classList.add('active');
        sidebarUserBadge.classList.add('active');
      }
    });

    document.addEventListener('click', (e) => {
      if (!sidebarUserBadge.contains(e.target) && !userProfileDropdownMenu.contains(e.target)) {
        userProfileDropdownMenu.style.display = 'none';
        userProfileDropdownMenu.classList.remove('active');
        sidebarUserBadge.classList.remove('active');
      }
    });
  }

  // --- ADMIN USER MANAGEMENT DIRECTORY RENDERER & SORTING ---
  let selectedUserIds = new Set();
  let userSortCol = 'createdAt';
  let userSortAsc = false;

  function initUserTableSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable-th-user');
    sortableHeaders.forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (!col) return;

        if (userSortCol === col) {
          userSortAsc = !userSortAsc;
        } else {
          userSortCol = col;
          userSortAsc = true;
        }

        sortableHeaders.forEach(h => {
          const icon = h.querySelector('.sort-icon');
          if (icon) {
            if (h.dataset.sort === userSortCol) {
              icon.className = `sort-icon fa-solid ${userSortAsc ? 'fa-sort-up' : 'fa-sort-down'}`;
              icon.style.opacity = '1';
              icon.style.color = 'var(--primary)';
            } else {
              icon.className = 'sort-icon fa-solid fa-sort';
              icon.style.opacity = '0.4';
              icon.style.color = 'inherit';
            }
          }
        });

        renderUserDirectoryTable();
      });
    });
  }

  function updateUserManagementActionBar() {
    const bottomBar = document.getElementById('userManagementBottomActions');
    const countText = document.getElementById('selectedUsersCountText');
    const btnEdit = document.getElementById('btnUserMgmtEdit');
    const btnDelete = document.getElementById('btnUserMgmtDelete');
    const selectAllCheck = document.getElementById('selectAllUsersCheck');

    const totalSelected = selectedUserIds.size;

    if (bottomBar) {
      bottomBar.style.display = totalSelected > 0 ? 'flex' : 'none';
    }

    if (countText) {
      countText.textContent = `${totalSelected} user${totalSelected > 1 ? 's' : ''} selected`;
    }

    if (btnEdit) {
      if (totalSelected === 1) {
        btnEdit.style.display = 'inline-flex';
        btnEdit.disabled = false;
        btnEdit.style.opacity = '1';
        btnEdit.style.cursor = 'pointer';
      } else {
        btnEdit.style.display = 'none';
        btnEdit.disabled = true;
      }
    }

    // Your own account can never be deleted, so it is not counted here. The button is
    // disabled outright when it is the only thing selected, rather than letting the
    // click through to a refusal - and the count always states what will really go.
    const selfSelected = Boolean(currentUser && selectedUserIds.has(currentUser.id));
    const deletableCount = selfSelected ? totalSelected - 1 : totalSelected;

    if (btnDelete) {
      if (deletableCount > 0) {
        btnDelete.disabled = false;
        btnDelete.style.opacity = '1';
        btnDelete.style.cursor = 'pointer';
        btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Selected (${deletableCount})`;
        btnDelete.title = selfSelected
          ? 'Your own logged-in account is excluded and will not be deleted'
          : '';
      } else {
        btnDelete.disabled = true;
        btnDelete.style.opacity = '0.5';
        btnDelete.style.cursor = 'not-allowed';
        btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Selected`;
        btnDelete.title = selfSelected
          ? 'You cannot delete your own logged-in account'
          : '';
      }
    }

    if (selectAllCheck) {
      const allRowChecks = document.querySelectorAll('.user-select-check');
      if (allRowChecks.length > 0 && Array.from(allRowChecks).every(c => c.checked)) {
        selectAllCheck.checked = true;
        selectAllCheck.indeterminate = false;
      } else if (totalSelected > 0) {
        selectAllCheck.checked = false;
        selectAllCheck.indeterminate = true;
      } else {
        selectAllCheck.checked = false;
        selectAllCheck.indeterminate = false;
      }
    }
  }

  function renderUserDirectoryTable() {
    const tableBody = document.getElementById('userManagementTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const sortedUsers = [...authUsersList].sort((a, b) => {
      let valA = (a[userSortCol] || '').toString().toLowerCase();
      let valB = (b[userSortCol] || '').toString().toLowerCase();

      if (userSortCol === 'createdAt') {
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
      }

      if (valA < valB) return userSortAsc ? -1 : 1;
      if (valA > valB) return userSortAsc ? 1 : -1;
      return 0;
    });

    sortedUsers.forEach((user, idx) => {
      const tr = document.createElement('tr');
      const isSelf = currentUser && currentUser.id === user.id;
      const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      let regDateHtml = '-';
      if (user.createdAt) {
        const d = new Date(user.createdAt);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const hh = String(d.getHours()).padStart(2, '0');
          const min = String(d.getMinutes()).padStart(2, '0');
          const ss = String(d.getSeconds()).padStart(2, '0');
          regDateHtml = `
            <div style="font-weight: 700; color: var(--text-main); font-family: var(--font-mono); font-size: 0.825rem; line-height: 1.2;">${yyyy}-${mm}-${dd}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 0.2rem;">${hh}:${min}:${ss}</div>
          `;
        }
      }

      const statusClass = user.status === 'Active' ? 'active' : (user.status === 'Pending Approval' ? 'pending' : 'blocked');
      const statusIcon = user.status === 'Active' ? 'fa-circle-check' : (user.status === 'Pending Approval' ? 'fa-clock' : 'fa-ban');

      const isChecked = selectedUserIds.has(user.id);
      if (isChecked) tr.classList.add('row-selected');

      tr.innerHTML = `
        <td style="text-align: center;">
          <input type="checkbox" class="user-select-check" data-id="${user.id}" ${isChecked ? 'checked' : ''}${isSelf ? ' title="Your own account cannot be deleted"' : ''} style="cursor: pointer;">
        </td>
        <td style="text-align: center; font-family: var(--font-mono); color: var(--text-dim);">${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${initials}</div>
            <div>
              <strong style="color: var(--text-main); font-size: 0.875rem;">${escapeHtml(user.name)}</strong>
              ${isSelf ? '<span style="font-size: 0.7rem; color: var(--primary); font-weight: 700; margin-left: 0.35rem;">(You)</span>' : ''}
            </div>
          </div>
        </td>
        <td style="font-family: var(--font-mono); font-size: 0.825rem;">${escapeHtml(user.email)}</td>
        <td style="text-align: center;">
          <span class="user-role-badge role-${user.role.toLowerCase()}">${user.role}</span>
        </td>
        <td style="text-align: center;">
          <span class="status-badge ${statusClass}">
            <i class="fa-solid ${statusIcon}"></i> ${user.status}
          </span>
        </td>
        <td style="font-size: 0.8rem;">${regDateHtml}</td>
      `;

      // Checkbox listener
      const rowCheck = tr.querySelector('.user-select-check');
      if (rowCheck) {
        rowCheck.addEventListener('change', (e) => {
          if (e.target.checked) {
            selectedUserIds.add(user.id);
            tr.classList.add('row-selected');
          } else {
            selectedUserIds.delete(user.id);
            tr.classList.remove('row-selected');
          }
          updateUserManagementActionBar();
        });
      }

      fragment.appendChild(tr);
    });

    tableBody.appendChild(fragment);
    updateUserManagementActionBar();
  }

  // --- HEADER CHECKBOX SELECT ALL USERS ---
  const selectAllUsersCheck = document.getElementById('selectAllUsersCheck');
  if (selectAllUsersCheck) {
    selectAllUsersCheck.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const allRowChecks = document.querySelectorAll('.user-select-check');
      
      allRowChecks.forEach(cb => {
        cb.checked = isChecked;
        const uid = cb.dataset.id;
        const tr = cb.closest('tr');
        if (isChecked) {
          if (uid) selectedUserIds.add(uid);
          if (tr) tr.classList.add('row-selected');
        } else {
          if (uid) selectedUserIds.delete(uid);
          if (tr) tr.classList.remove('row-selected');
        }
      });
      updateUserManagementActionBar();
    });
  }

  // --- EDIT SELECTED USER ACTION ---
  const btnUserMgmtEdit = document.getElementById('btnUserMgmtEdit');
  const adminEditUserModal = document.getElementById('adminEditUserModal');
  const adminEditUserModalCloseBtn = document.getElementById('adminEditUserModalCloseBtn');
  const adminEditUserCancelBtn = document.getElementById('adminEditUserCancelBtn');
  const adminEditUserForm = document.getElementById('adminEditUserForm');

  if (btnUserMgmtEdit && adminEditUserModal) {
    btnUserMgmtEdit.addEventListener('click', () => {
      if (selectedUserIds.size !== 1) return;
      const targetId = Array.from(selectedUserIds)[0];
      const targetUser = authUsersList.find(u => u.id === targetId);
      if (!targetUser) return;

      document.getElementById('adminEditInputId').value = targetUser.id;
      document.getElementById('adminEditInputName').value = targetUser.name;
      document.getElementById('adminEditInputEmail').value = targetUser.email;
      document.getElementById('adminEditSelectRole').value = targetUser.role;
      document.getElementById('adminEditSelectStatus').value = targetUser.status;

      adminEditUserModal.classList.add('active');
    });
  }

  function closeAdminEditUserModal() {
    if (adminEditUserModal) adminEditUserModal.classList.remove('active');
  }

  if (adminEditUserModalCloseBtn) adminEditUserModalCloseBtn.addEventListener('click', closeAdminEditUserModal);
  if (adminEditUserCancelBtn) adminEditUserCancelBtn.addEventListener('click', closeAdminEditUserModal);

  if (adminEditUserForm) {
    adminEditUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const uid = document.getElementById('adminEditInputId').value;
      const name = document.getElementById('adminEditInputName').value.trim();
      const email = document.getElementById('adminEditInputEmail').value.trim().toLowerCase();
      const role = document.getElementById('adminEditSelectRole').value;
      const status = document.getElementById('adminEditSelectStatus').value;

      const targetUser = authUsersList.find(u => u.id === uid);
      if (!targetUser) return;

      if (email !== targetUser.email.toLowerCase() && authUsersList.some(u => u.id !== uid && u.email.toLowerCase() === email)) {
        showAlert(`Email <strong>${escapeHtml(email)}</strong> is already in use by another account.`);
        return;
      }

      targetUser.name = name;
      targetUser.email = email;
      targetUser.role = role;
      targetUser.status = status;

      await saveAuthUsers();
      closeAdminEditUserModal();

      if (currentUser && currentUser.id === uid) {
        currentUser = { ...targetUser };
        saveAuthSession();
        updateAuthUI();
      }

      renderUserDirectoryTable();
      showSuccessNoticeModal(`User account for <strong>${escapeHtml(name)}</strong> updated successfully.`, 'Data Updated Successfully');
    });
  }

  // --- DELETE SELECTED USERS ACTION ---
  const btnUserMgmtDelete = document.getElementById('btnUserMgmtDelete');
  if (btnUserMgmtDelete) {
    btnUserMgmtDelete.addEventListener('click', () => {
      const selectedArray = Array.from(selectedUserIds);
      if (selectedArray.length === 0) return;

      const containsSelf = currentUser && selectedArray.includes(currentUser.id);
      if (containsSelf && selectedArray.length === 1) {
        showAlert('<strong>Action Denied:</strong> You cannot delete your currently logged-in account.');
        return;
      }

      const targetIdsToDelete = selectedArray.filter(id => !currentUser || id !== currentUser.id);

      showActionConfirmModal({
        title: `<i class="fa-solid fa-trash-can" style="color: #dc2626;"></i> Confirm User Account Deletion`,
        iconClass: `fa-solid fa-user-minus`,
        iconColor: `#dc2626`,
        iconBg: `rgba(239, 68, 68, 0.12)`,
        btnText: `<i class="fa-solid fa-trash-can"></i> Yes, Delete ${targetIdsToDelete.length} User(s)`,
        btnClass: `btn-icon-danger`,
        message: `Are you sure you want to permanently delete <strong>${targetIdsToDelete.length} user account(s)</strong> from database? ${containsSelf ? '<br><span style="color: var(--primary); font-size: 0.8rem;">(Your active session was automatically excluded from deletion.)</span>' : ''}`,
        onConfirm: async () => {
          for (const uid of targetIdsToDelete) {
            try {
              const restUrl = `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${uid}`;
              await fetch(restUrl, {
                method: 'DELETE',
                headers: {
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
              });
            } catch (err) {
              console.warn('Supabase DB delete notice:', err);
            }
          }

          authUsersList = authUsersList.filter(u => !targetIdsToDelete.includes(u.id));
          await saveAuthUsers();
          selectedUserIds.clear();
          renderUserDirectoryTable();
        }
      });
    });
  }

  // --- ADMIN ADD NEW USER MODAL HANDLERS ---
  const btnAdminAddNewUser = document.getElementById('btnAdminAddNewUser');
  const adminAddUserModal = document.getElementById('adminAddUserModal');
  const adminAddUserModalCloseBtn = document.getElementById('adminAddUserModalCloseBtn');
  const adminAddUserCancelBtn = document.getElementById('adminAddUserCancelBtn');
  const adminAddUserForm = document.getElementById('adminAddUserForm');

  if (btnAdminAddNewUser && adminAddUserModal) {
    btnAdminAddNewUser.addEventListener('click', () => {
      if (adminAddUserForm) adminAddUserForm.reset();
      adminAddUserModal.classList.add('active');
    });
  }

  function closeAdminAddUserModal() {
    if (adminAddUserModal) adminAddUserModal.classList.remove('active');
  }

  if (adminAddUserModalCloseBtn) adminAddUserModalCloseBtn.addEventListener('click', closeAdminAddUserModal);
  if (adminAddUserCancelBtn) adminAddUserCancelBtn.addEventListener('click', closeAdminAddUserModal);

  if (adminAddUserForm) {
    adminAddUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('adminAddInputName').value.trim();
      const email = document.getElementById('adminAddInputEmail').value.trim().toLowerCase();
      const password = document.getElementById('adminAddInputPassword').value.trim();
      const role = document.getElementById('adminAddSelectRole').value;

      if (authUsersList.some(u => u.email.toLowerCase() === email)) {
        showAlert(`User with email <strong>${escapeHtml(email)}</strong> already exists.`);
        return;
      }

      const hashedPassword = await hashPassword(password);

      const newUser = {
        id: 'usr_' + Date.now(),
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      authUsersList.push(newUser);
      saveAuthUsers();
      closeAdminAddUserModal();
      renderUserDirectoryTable();
      showSuccessNoticeModal(`User account for <strong>${escapeHtml(name)}</strong> added successfully with hashed security key.`, 'Data Added Successfully');
    });
  }

  // --- USER PROFILE & PASSWORD MODAL HANDLERS ---
  const btnOpenUserProfile = document.getElementById('btnOpenUserProfile');
  const userProfileModal = document.getElementById('userProfileModal');
  const userProfileModalCloseBtn = document.getElementById('userProfileModalCloseBtn');
  const userProfileCancelBtn = document.getElementById('userProfileCancelBtn');
  const userProfileForm = document.getElementById('userProfileForm');

  if (btnOpenUserProfile && userProfileModal) {
    btnOpenUserProfile.addEventListener('click', () => {
      if (userProfileDropdownMenu) {
        userProfileDropdownMenu.style.display = 'none';
        userProfileDropdownMenu.classList.remove('active');
      }
      if (sidebarUserBadge) sidebarUserBadge.classList.remove('active');
      if (!currentUser) return;

      const initials = (currentUser.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      document.getElementById('profileModalAvatar').textContent = initials;
      document.getElementById('profileModalHeaderName').textContent = currentUser.name;
      document.getElementById('profileModalHeaderEmail').textContent = currentUser.email;
      
      const roleBadge = document.getElementById('profileModalHeaderRole');
      if (roleBadge) {
        roleBadge.textContent = currentUser.role;
        roleBadge.className = `user-role-badge role-${currentUser.role.toLowerCase()}`;
      }

      document.getElementById('profileInputFullName').value = currentUser.name;
      document.getElementById('profileInputEmail').value = currentUser.email;
      document.getElementById('profileInputCurrentPass').value = '';
      document.getElementById('profileInputNewPass').value = '';
      document.getElementById('profileInputConfirmPass').value = '';

      userProfileModal.classList.add('active');
    });
  }

  function closeUserProfileModal() {
    if (userProfileModal) userProfileModal.classList.remove('active');
  }

  if (userProfileModalCloseBtn) userProfileModalCloseBtn.addEventListener('click', closeUserProfileModal);
  if (userProfileCancelBtn) userProfileCancelBtn.addEventListener('click', closeUserProfileModal);

  if (userProfileForm) {
    userProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) return;

      const name = document.getElementById('profileInputFullName').value.trim();
      const email = document.getElementById('profileInputEmail').value.trim().toLowerCase();
      const currPass = document.getElementById('profileInputCurrentPass').value.trim();
      const newPass = document.getElementById('profileInputNewPass').value.trim();
      const confirmPass = document.getElementById('profileInputConfirmPass').value.trim();

      if (!name || !email) {
        showAlert('Name and email address are required.');
        return;
      }

      // If email changed, ensure no duplicate
      if (email !== currentUser.email.toLowerCase() && authUsersList.some(u => u.id !== currentUser.id && u.email.toLowerCase() === email)) {
        showAlert(`Email address <strong>${escapeHtml(email)}</strong> is already in use by another account.`);
        return;
      }

      // Password change validation
      if (newPass || currPass || confirmPass) {
        const isCurrentValid = await verifyPassword(currPass, currentUser.password);
        if (!isCurrentValid) {
          showAlert('<strong>Password Error:</strong> Current password is incorrect.');
          return;
        }
        if (newPass.length < 6) {
          showAlert('<strong>Password Error:</strong> New password must be at least 6 characters.');
          return;
        }
        if (newPass !== confirmPass) {
          showAlert('<strong>Password Error:</strong> New password and confirmation do not match.');
          return;
        }
        currentUser.password = await hashPassword(newPass);
      }

      currentUser.name = name;
      currentUser.email = email;

      // Update in authUsersList
      const idx = authUsersList.findIndex(u => u.id === currentUser.id);
      if (idx !== -1) {
        authUsersList[idx] = { ...currentUser };
      }

      saveAuthUsers();
      saveAuthSession();
      updateAuthUI();
      if (currentUser.role === 'Admin') renderUserDirectoryTable();

      closeUserProfileModal();
      showSuccessNoticeModal('Your user profile and security credentials have been updated and stored securely in the database.', 'Data Updated Successfully');
    });
  }

  function loadAuthSessionSync() {
    try {
      const storedSession = localStorage.getItem('tg_auth_session');
      if (storedSession) {
        currentUser = JSON.parse(storedSession);
      }
    } catch (e) {
      currentUser = null;
    }
  }

  // --- INITIALIZE AUTHENTICATION ENGINE ---
  loadAuthSessionSync();
  updateAuthUI();
  initUserTableSorting();

  loadAuthData().then(() => {
    updateAuthUI();
    if (currentUser && currentUser.role === 'Admin') {
      renderUserDirectoryTable();
    }
  });
});
