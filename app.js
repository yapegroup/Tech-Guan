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
  const viewCutlist = document.getElementById('viewCutlist');
  const viewMasterProduct = document.getElementById('viewMasterProduct');

  const supaStatusBadge = document.getElementById('supaStatusBadge');
  const supaHeaderCount = document.getElementById('supaHeaderCount');

  // --- DUAL UPLOAD UI ELEMENTS ---
  const cutlistDropzone = document.getElementById('cutlistDropzone');
  const cutlistInput = document.getElementById('cutlistInput');
  const cutlistBtn = document.getElementById('cutlistBtn');
  const cutlistFileStatus = document.getElementById('cutlistFileStatus');

  const productDropzone = document.getElementById('productDropzone');
  const productInput = document.getElementById('productInput');
  const productBtn = document.getElementById('productBtn');
  const productFileStatus = document.getElementById('productFileStatus');
  const productUploadSub = document.getElementById('productUploadSub');

  const btnProcessData = document.getElementById('btnProcessData');

  // --- MASTER PRODUCT TAB ELEMENTS ---
  const supaBulkDropzone = document.getElementById('supaBulkDropzone');
  const supaBulkInput = document.getElementById('supaBulkInput');
  const supaBulkBtn = document.getElementById('supaBulkBtn');
  const supaUploadProgressContainer = document.getElementById('supaUploadProgressContainer');
  const supaUploadProgressBar = document.getElementById('supaUploadProgressBar');
  const supaUploadStatusText = document.getElementById('supaUploadStatusText');

  const inputSingleProductID = document.getElementById('inputSingleProductID');
  const btnSingleAddProduct = document.getElementById('btnSingleAddProduct');

  const supaTableSearch = document.getElementById('supaTableSearch');
  const btnSupaSearchClear = document.getElementById('btnSupaSearchClear');
  const btnRefreshSupaTable = document.getElementById('btnRefreshSupaTable');
  const supaTableCountBadge = document.getElementById('supaTableCountBadge');
  const supaMasterTableBody = document.getElementById('supaMasterTableBody');
  const supaPageCurrent = document.getElementById('supaPageCurrent');
  const supaPageTotal = document.getElementById('supaPageTotal');
  const btnSupaPrevPage = document.getElementById('btnSupaPrevPage');
  const btnSupaNextPage = document.getElementById('btnSupaNextPage');

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

  // Error Pop-up Modal Elements
  const errorModal = document.getElementById('errorModal');
  const errorModalText = document.getElementById('errorModalText');
  const errorModalCloseBtn = document.getElementById('errorModalCloseBtn');
  const errorModalOkBtn = document.getElementById('errorModalOkBtn');

  const btnDownloadXlsx = document.getElementById('btnDownloadXlsx');
  const btnDownloadCsv = document.getElementById('btnDownloadCsv');
  const btnDownloadTxt = document.getElementById('btnDownloadTxt');
  const btnReset = document.getElementById('btnReset');

  const sampleExcelBtn = document.getElementById('sampleExcelBtn');
  const sampleTxtBtn = document.getElementById('sampleTxtBtn');

  // Standardized 6-Column Output Schema
  const STANDARD_HEADERS = ['Truss', 'ID', 'Member', 'Qty', 'Length', 'Product ID'];

  // Application State
  let cutlistFile = null;
  let masterProductFile = null;
  let masterProductSet = new Set(); // Stores uppercase unspaced product codes

  // Supabase Data Cache & Pagination
  let supabaseProductsList = []; // Raw records array from Supabase: [{ id, product_id, created_at }]
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

  // --- TAB SWITCHING HANDLERS ---
  tabCutlist.addEventListener('click', () => {
    tabCutlist.classList.add('active');
    tabMasterProduct.classList.remove('active');
    viewCutlist.classList.add('active');
    viewMasterProduct.classList.remove('active');
  });

  tabMasterProduct.addEventListener('click', () => {
    tabMasterProduct.classList.add('active');
    tabCutlist.classList.remove('active');
    viewMasterProduct.classList.add('active');
    viewCutlist.classList.remove('active');
  });

  // --- SUPABASE INITIALIZATION & SYNC ---
  async function syncWithSupabase() {
    if (!supabaseClient) {
      supaStatusBadge.className = 'supabase-status-badge';
      supaHeaderCount.textContent = 'Offline';
      return;
    }

    try {
      supaHeaderCount.textContent = 'Syncing...';
      supaStatusBadge.className = 'supabase-status-badge connecting';

      // Fetch all products from Supabase table master_products
      const { data, error } = await supabaseClient
        .from('master_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      supabaseProductsList = data || [];
      masterProductSet.clear();

      supabaseProductsList.forEach(item => {
        if (item.product_id) {
          const cleanVal = String(item.product_id).replace(/[\u00A0\s]+/g, '').toUpperCase();
          if (cleanVal) masterProductSet.add(cleanVal);
        }
      });

      const countStr = masterProductSet.size.toLocaleString();
      supaHeaderCount.textContent = `${countStr} products`;
      supaStatusBadge.className = 'supabase-status-badge connected';

      // Auto-populate Cutlist Tab Upload Box 2 if products exist in Supabase
      if (masterProductSet.size > 0 && !masterProductFile) {
        productFileStatus.innerHTML = `<i class="fa-solid fa-cloud-check" style="color: var(--success);"></i> Auto-loaded ${countStr} products from Supabase`;
        productDropzone.classList.add('loaded');
        checkReadyState();
      }

      renderMasterProductTable();
    } catch (err) {
      console.warn('Supabase fetch notice:', err.message);
      supaHeaderCount.textContent = 'Ready';
      supaStatusBadge.className = 'supabase-status-badge connected';
    }
  }

  syncWithSupabase();

  // --- RENDER MASTER PRODUCT LIVE TABLE WITH SEARCH & PAGINATION ---
  function renderMasterProductTable() {
    const filterTerm = supaTableSearch ? supaTableSearch.value.trim().toLowerCase() : '';
    if (btnSupaSearchClear) btnSupaSearchClear.style.display = filterTerm ? 'inline-flex' : 'none';

    const filtered = supabaseProductsList.filter(item => {
      if (!filterTerm) return true;
      const haystack = `${item.product_id} ${item.created_at || ''}`.toLowerCase();
      return haystack.includes(filterTerm);
    });

    const totalCount = filtered.length;
    supaTableCountBadge.textContent = `Showing ${totalCount.toLocaleString()} products`;

    const totalPages = Math.max(1, Math.ceil(totalCount / supaPageSize));
    if (supaCurrentPage > totalPages) supaCurrentPage = totalPages;

    supaPageCurrent.textContent = supaCurrentPage;
    supaPageTotal.textContent = totalPages;

    btnSupaPrevPage.disabled = supaCurrentPage <= 1;
    btnSupaNextPage.disabled = supaCurrentPage >= totalPages;

    supaMasterTableBody.innerHTML = '';

    if (totalCount === 0) {
      supaMasterTableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
            No master products found in Supabase. Upload an Excel file or add a product code above.
          </td>
        </tr>
      `;
      return;
    }

    const startIndex = (supaCurrentPage - 1) * supaPageSize;
    const pageItems = filtered.slice(startIndex, startIndex + supaPageSize);
    const fragment = document.createDocumentFragment();

    pageItems.forEach((item, idx) => {
      const tr = document.createElement('tr');
      const rowNum = startIndex + idx + 1;
      const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A';

      tr.innerHTML = `
        <td style="font-family: var(--font-mono); color: var(--text-dim);">${rowNum}</td>
        <td><strong style="color: var(--primary); font-family: var(--font-mono); font-size: 0.9rem;">${escapeHtml(item.product_id)}</strong></td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${dateStr}</td>
        <td style="text-align: center;">
          <button class="btn-icon-danger" data-id="${item.product_id}" title="Delete Product from Supabase">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>
      `;
      fragment.appendChild(tr);
    });

    supaMasterTableBody.appendChild(fragment);

    // Attach Delete Action Listeners
    supaMasterTableBody.querySelectorAll('.btn-icon-danger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pID = e.currentTarget.getAttribute('data-id');
        deleteSingleSupabaseProduct(pID);
      });
    });
  }

  btnSupaPrevPage.addEventListener('click', () => {
    if (supaCurrentPage > 1) { supaCurrentPage--; renderMasterProductTable(); }
  });

  btnSupaNextPage.addEventListener('click', () => {
    supaCurrentPage++; renderMasterProductTable();
  });

  if (supaTableSearch) supaTableSearch.addEventListener('input', () => { supaCurrentPage = 1; renderMasterProductTable(); });
  if (btnSupaSearchClear) btnSupaSearchClear.addEventListener('click', () => {
    if (supaTableSearch) supaTableSearch.value = '';
    supaCurrentPage = 1; renderMasterProductTable();
  });
  if (btnRefreshSupaTable) btnRefreshSupaTable.addEventListener('click', syncWithSupabase);

  // --- BULK UPLOAD EXCEL FILE TO SUPABASE ---
  supaBulkDropzone.addEventListener('click', () => supaBulkInput.click());
  supaBulkBtn.addEventListener('click', (e) => { e.stopPropagation(); supaBulkInput.click(); });

  supaBulkInput.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      await processBulkSupabaseUpload(e.target.files[0]);
    }
  });

  async function processBulkSupabaseUpload(file) {
    if (!supabaseClient) {
      showAlert('Supabase client is not connected.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        supaUploadProgressContainer.style.display = 'block';
        supaUploadProgressBar.style.width = '10%';
        supaUploadStatusText.textContent = 'Parsing Excel file...';

        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const extractedCodes = new Set();
        workbook.SheetNames.forEach(sheetName => {
          const jsonRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
          if (jsonRows) {
            jsonRows.forEach(row => {
              if (Array.isArray(row)) {
                row.forEach(cell => {
                  let rawVal = String(cell || '').trim();
                  if (!rawVal) return;
                  let cleanVal = rawVal.replace(/[\u00A0\s]+/g, '').toUpperCase();
                  if (cleanVal && cleanVal !== 'PRODUCT' && cleanVal !== 'PRODUCTID' && !cleanVal.includes('SUMMARY') && cleanVal.length >= 4) {
                    extractedCodes.add(cleanVal);
                  }
                });
              }
            });
          }
        });

        const codesArray = Array.from(extractedCodes);
        if (codesArray.length === 0) {
          showAlert('No valid Product IDs found in the uploaded file.');
          supaUploadProgressContainer.style.display = 'none';
          return;
        }

        supaUploadStatusText.textContent = `Found ${codesArray.length.toLocaleString()} unique Product IDs. Uploading to Supabase...`;
        
        // Batch Upsert in Chunks of 500
        const chunkSize = 500;
        const totalChunks = Math.ceil(codesArray.length / chunkSize);

        for (let i = 0; i < totalChunks; i++) {
          const chunk = codesArray.slice(i * chunkSize, (i + 1) * chunkSize).map(pID => ({
            product_id: pID
          }));

          const { error } = await supabaseClient
            .from('master_products')
            .upsert(chunk, { onConflict: 'product_id' });

          if (error) console.warn('Chunk upload notice:', error.message);

          const pct = Math.round(((i + 1) / totalChunks) * 100);
          supaUploadProgressBar.style.width = pct + '%';
          supaUploadStatusText.textContent = `Uploading chunk ${i + 1} of ${totalChunks} (${pct}%)...`;
        }

        supaUploadStatusText.textContent = `Successfully imported ${codesArray.length.toLocaleString()} products to Supabase!`;
        setTimeout(() => { supaUploadProgressContainer.style.display = 'none'; }, 2000);

        await syncWithSupabase();
      } catch (err) {
        showAlert(`Bulk upload error: ${err.message}`);
        supaUploadProgressContainer.style.display = 'none';
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // --- SINGLE PRODUCT ADD & DELETE ---
  if (btnSingleAddProduct) {
    btnSingleAddProduct.addEventListener('click', async () => {
      const rawVal = inputSingleProductID.value.trim();
      if (!rawVal) return;

      const cleanVal = rawVal.replace(/[\u00A0\s]+/g, '').toUpperCase();
      if (!cleanVal) return;

      if (!supabaseClient) {
        masterProductSet.add(cleanVal);
        supabaseProductsList.unshift({ id: Date.now(), product_id: cleanVal, created_at: new Date().toISOString() });
        inputSingleProductID.value = '';
        renderMasterProductTable();
        return;
      }

      try {
        btnSingleAddProduct.disabled = true;
        btnSingleAddProduct.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Adding...`;

        const { error } = await supabaseClient
          .from('master_products')
          .upsert([{ product_id: cleanVal }], { onConflict: 'product_id' });

        if (error) throw error;

        inputSingleProductID.value = '';
        btnSingleAddProduct.disabled = false;
        btnSingleAddProduct.innerHTML = `<i class="fa-solid fa-plus"></i> Add Product ID to Database`;

        await syncWithSupabase();
      } catch (err) {
        showAlert(`Failed to add product: ${err.message}`);
        btnSingleAddProduct.disabled = false;
        btnSingleAddProduct.innerHTML = `<i class="fa-solid fa-plus"></i> Add Product ID to Database`;
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

  productDropzone.addEventListener('click', () => productInput.click());
  productBtn.addEventListener('click', (e) => { e.stopPropagation(); productInput.click(); });

  productDropzone.addEventListener('dragover', (e) => { e.preventDefault(); productDropzone.classList.add('dragover'); });
  productDropzone.addEventListener('dragleave', () => productDropzone.classList.remove('dragover'));
  productDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    productDropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      setMasterProductFile(e.dataTransfer.files[0]);
    }
  });

  productInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      setMasterProductFile(e.target.files[0]);
    }
  });

  function setMasterProductFile(file) {
    masterProductFile = file;
    productFileStatus.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> ${file.name}`;
    productDropzone.classList.add('loaded');
    checkReadyState();
  }

  function checkReadyState() {
    // Require Cutlist File and EITHER Supabase loaded products OR uploaded product file
    if (cutlistFile && (masterProductFile || masterProductSet.size > 0)) {
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
      showAlert(`Failed to load sample files. Please select your own Cutlist and Existing Product List files.`);
    }
  }

  // --- PROCESS DATA BUTTON CLICK ---
  btnProcessData.addEventListener('click', async () => {
    if (!cutlistFile) return;

    if (masterProductFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          parseMasterProductListArrayBuffer(data);
          startCutlistProcessing();
        } catch (err) {
          showAlert(`Failed to parse Existing Product List file.`);
        }
      };
      reader.readAsArrayBuffer(masterProductFile);
    } else {
      startCutlistProcessing();
    }
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
          showAlert(`Failed to parse cutlist file.`);
        }
      };
      reader.readAsArrayBuffer(cutlistFile);
    }
  }

  modalCloseBtn.addEventListener('click', closeModal);
  detailModalCloseBtn.addEventListener('click', closeDetailModal);
  errorModalCloseBtn.addEventListener('click', closeErrorModal);
  errorModalOkBtn.addEventListener('click', closeErrorModal);

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
    addLog(`Existing Product List contains ${masterProductSet.size.toLocaleString()} existing products for comparison.`, 'info');
  }

  // --- EXCEL PROCESSING PIPELINE ---
  function processExcelRows(rawRows, fileName) {
    if (!validateColumnsAndContent(rawRows)) {
      showAlert(`<strong>Validation Failed:</strong> Uploaded file '<em>${fileName}</em>' does not match expected Product Cutlist / Truss dataset.`);
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
          addLog(`[EXISTING PRODUCT REMOVED] Row ${index + 1}: Product ID '${productID}' already exists in Existing Product List. Omitted.`, 'convert');
        } else {
          collectionRetained.push({ ...itemRecord, status: 'New Product Retained' });
          addLog(`[NEW PRODUCT RETAINED] Row ${index + 1}: Product ID '${productID}' added to New Product List.`, 'newprod');
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
      showAlert(`<strong>Validation Failed:</strong> Uploaded file '<em>${fileName}</em>' does not match expected Product Cutlist format.`);
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
            addLog(`[EXISTING PRODUCT REMOVED] Line ${index + 1}: Product ID '${productID}' already exists in Existing Product List. Omitted.`, 'convert');
          } else {
            collectionRetained.push({ ...itemRecord, status: 'New Product Retained' });
            addLog(`[NEW PRODUCT RETAINED] Line ${index + 1}: Product ID '${productID}' added to New Product List.`, 'newprod');
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

  function finalizeProcessing(cleanOutput, totalInput, dupsCount, existingRemovedCount) {
    processedData = cleanOutput;
    summaryStats = { total: totalInput, dups: dupsCount, existingRemoved: existingRemovedCount, clean: cleanOutput.length };
    renderSummaryMetrics();
  }

  function renderSummaryMetrics() {
    valTotalRows.textContent = collectionTotal.length.toLocaleString();
    valDupsRemoved.textContent = collectionDups.length.toLocaleString();
    valRenamedCodes.textContent = collectionExisting.length.toLocaleString();
    valCleanRows.textContent = collectionRetained.length.toLocaleString();

    const noNewProductsNotice = document.getElementById('noNewProductsNotice');

    if (collectionRetained.length === 0) {
      btnDownloadXlsx.disabled = true;
      btnDownloadCsv.disabled = true;
      btnDownloadTxt.disabled = true;

      btnDownloadXlsx.style.opacity = '0.45';
      btnDownloadCsv.style.opacity = '0.45';
      btnDownloadTxt.style.opacity = '0.45';

      btnDownloadXlsx.style.cursor = 'not-allowed';
      btnDownloadCsv.style.cursor = 'not-allowed';
      btnDownloadTxt.style.cursor = 'not-allowed';

      if (noNewProductsNotice) noNewProductsNotice.style.display = 'flex';
    } else {
      btnDownloadXlsx.disabled = false;
      btnDownloadCsv.disabled = false;
      btnDownloadTxt.disabled = false;

      btnDownloadXlsx.style.opacity = '1';
      btnDownloadCsv.style.opacity = '1';
      btnDownloadTxt.style.opacity = '1';

      btnDownloadXlsx.style.cursor = 'pointer';
      btnDownloadCsv.style.cursor = 'pointer';
      btnDownloadTxt.style.cursor = 'pointer';

      if (noNewProductsNotice) noNewProductsNotice.style.display = 'none';
    }

    btnDownloadXlsx.style.display = 'inline-flex';
    btnDownloadCsv.style.display = 'inline-flex';
    btnDownloadTxt.style.display = 'inline-flex';

    modalSummarySection.style.display = 'block';
  }

  // --- CLICKABLE METRIC CARDS & DETAIL TABLE MODAL HANDLERS ---
  if (cardTotalRows) cardTotalRows.addEventListener('click', () => openDetailModal(collectionTotal, 'Total Cutlist Rows (Parsed)', 'total'));
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

  // --- DOWNLOAD GENERATORS ---
  btnDownloadXlsx.addEventListener('click', () => {
    if (processedData.length === 0 || btnDownloadXlsx.disabled) return;
    const exportData = [STANDARD_HEADERS, ...processedData];
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    ws['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 8 }, { wch: 10 }, { wch: 22 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'New Product List');
    XLSX.writeFile(wb, 'New Product List.xlsx');
  });

  btnDownloadCsv.addEventListener('click', () => {
    if (processedData.length === 0 || btnDownloadCsv.disabled) return;
    const exportData = [STANDARD_HEADERS, ...processedData];
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'New Product List.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  btnDownloadTxt.addEventListener('click', () => {
    if (processedData.length === 0 || btnDownloadTxt.disabled) return;
    const exportData = [STANDARD_HEADERS, ...processedData];
    const colWidths = STANDARD_HEADERS.map((h, i) => Math.max(h.length, ...processedData.map(r => String(r[i] || '').length)));
    const txtLines = exportData.map(row => row.map((cell, idx) => String(cell || '').padEnd(colWidths[idx] + 3)).join('').trimEnd());
    const txtContent = txtLines.join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'New Product List.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  btnReset.addEventListener('click', () => {
    closeModal();
    closeDetailModal();
    cutlistFile = null;
    masterProductFile = null;
    cutlistInput.value = '';
    productInput.value = '';
    cutlistFileStatus.innerHTML = '';
    if (masterProductSet.size > 0) {
      productFileStatus.innerHTML = `<i class="fa-solid fa-cloud-check" style="color: var(--success);"></i> Auto-loaded ${masterProductSet.size.toLocaleString()} products from Supabase`;
    } else {
      productFileStatus.innerHTML = '';
    }
    cutlistDropzone.classList.remove('loaded');
    btnProcessData.disabled = true;
    hideAlert();
  });
});
