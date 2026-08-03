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

  const productDropzone = document.getElementById('productDropzone');
  const productInput = document.getElementById('productInput');
  const productBtn = document.getElementById('productBtn');
  const productFileStatus = document.getElementById('productFileStatus');
  const productUploadSub = document.getElementById('productUploadSub');

  const btnProcessData = document.getElementById('btnProcessData');

  // --- MASTER PRODUCT TAB ELEMENTS & MODALS ---
  const btnOpenSingleAddModal = document.getElementById('btnOpenSingleAddModal');
  const singleRecordModal = document.getElementById('singleRecordModal');
  const singleRecordModalCloseBtn = document.getElementById('singleRecordModalCloseBtn');
  const singleRecordCancelBtn = document.getElementById('singleRecordCancelBtn');
  const singleRecordForm = document.getElementById('singleRecordForm');

  const btnOpenBulkUploadModal = document.getElementById('btnOpenBulkUploadModal');
  const bulkUploadModal = document.getElementById('bulkUploadModal');
  const bulkUploadModalCloseBtn = document.getElementById('bulkUploadModalCloseBtn');
  const bulkUploadCancelBtn = document.getElementById('bulkUploadCancelBtn');

  const supaBulkDropzone = document.getElementById('supaBulkDropzone');
  const supaBulkInput = document.getElementById('supaBulkInput');
  const supaBulkBtn = document.getElementById('supaBulkBtn');
  const supaUploadProgressContainer = document.getElementById('supaUploadProgressContainer');
  const supaUploadProgressBar = document.getElementById('supaUploadProgressBar');
  const supaUploadStatusText = document.getElementById('supaUploadStatusText');

  const supaFileConfirmContainer = document.getElementById('supaFileConfirmContainer');
  const supaFileNameBadge = document.getElementById('supaFileNameBadge');
  const supaFileRecordBadge = document.getElementById('supaFileRecordBadge');
  const btnConfirmBulkReplace = document.getElementById('btnConfirmBulkReplace');

  let pendingBulkUploadRecords = [];
  let pendingBulkUploadWorkbook = null;

  // Single Record Form Fields
  const inputProduct = document.getElementById('inputProduct');
  const inputProductDesc = document.getElementById('inputProductDesc');
  const selectProductType = document.getElementById('selectProductType');
  const selectProductGroup = document.getElementById('selectProductGroup');
  const selectGTIN = document.getElementById('selectGTIN');
  const selectProductCategory = document.getElementById('selectProductCategory');
  const selectBaseUOM = document.getElementById('selectBaseUOM');
  const inputCreatedBy = document.getElementById('inputCreatedBy');

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
  const editInputCreatedBy = document.getElementById('editInputCreatedBy');

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

  function showSuccessNoticeModal(message) {
    if (successNoticeModalText) successNoticeModalText.innerHTML = message;
    if (successNoticeModal) successNoticeModal.classList.add('active');
  }

  if (btnSuccessNoticeOk && successNoticeModal) {
    btnSuccessNoticeOk.addEventListener('click', () => successNoticeModal.classList.remove('active'));
  }
  if (successNoticeModalCloseBtn && successNoticeModal) {
    successNoticeModalCloseBtn.addEventListener('click', () => successNoticeModal.classList.remove('active'));
  }

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

  // --- RENDER SETTINGS TABLE ---
  function renderSettingsTable() {
    if (!settingsTableBody) return;
    settingsTableBody.innerHTML = '';
    selectedSettingsIndices.clear();
    updateSettingsSelectionUI();

    const list = dropdownSettings[activeSettingsCategory] || [];
    if (list.length === 0) {
      settingsTableBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No options available in this list. Use the form above to add a new option.
          </td>
        </tr>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();
    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-idx', idx);
      tr.innerHTML = `
        <td style="text-align: center; width: 40px;">
          <input type="checkbox" class="row-select-check" data-idx="${idx}">
        </td>
        <td style="font-family: var(--font-mono); color: var(--text-dim); font-size: 0.8rem; width: 50px;">${idx + 1}</td>
        <td><span style="font-size: 0.875rem; color: var(--text-main); font-weight: 400;">${escapeHtml(item)}</span></td>
      `;

      const chk = tr.querySelector('.row-select-check');

      const toggleRowSelection = (e) => {
        if (e.target !== chk) {
          chk.checked = !chk.checked;
        }

        if (chk.checked) {
          selectedSettingsIndices.add(idx);
          tr.classList.add('selected-row');
        } else {
          selectedSettingsIndices.delete(idx);
          tr.classList.remove('selected-row');
        }

        updateSettingsSelectionUI();
      };

      tr.addEventListener('click', toggleRowSelection);
      fragment.appendChild(tr);
    });

    settingsTableBody.appendChild(fragment);
  }

  // --- SETTINGS CRUD HANDLERS ---
  if (btnSettingsEdit) {
    btnSettingsEdit.addEventListener('click', () => {
      if (selectedSettingsIndices.size === 1) {
        const idx = Array.from(selectedSettingsIndices)[0];
        editSettingsOption(idx);
      }
    });
  }

  if (btnSettingsDelete) {
    btnSettingsDelete.addEventListener('click', () => {
      if (selectedSettingsIndices.size > 0) {
        deleteSettingsOptions();
      }
    });
  }

  if (settingsAddForm) {
    settingsAddForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = inputSettingsNewOption.value.trim();
      if (!val) return;

      const list = dropdownSettings[activeSettingsCategory] || [];
      if (list.some(opt => opt.toLowerCase() === val.toLowerCase())) {
        showAlert(`Option '${val}' already exists in this dropdown list.`);
        return;
      }

      // 1. Sync to Supabase if connected
      const tblName = SETTINGS_TABLE_MAP[activeSettingsCategory];
      if (supabaseClient && tblName) {
        try {
          const { data, error } = await supabaseClient
            .from(tblName)
            .insert([{ name: val }])
            .select();

          if (!error && data && data.length > 0) {
            if (!settingsSupabaseItems[activeSettingsCategory]) {
              settingsSupabaseItems[activeSettingsCategory] = [];
            }
            settingsSupabaseItems[activeSettingsCategory].push(data[0]);
          }
        } catch (dbErr) {
          console.warn(`Notice inserting to Supabase table ${tblName}:`, dbErr.message);
        }
      }

      list.push(val);
      dropdownSettings[activeSettingsCategory] = list;
      saveDropdownSettings();
      inputSettingsNewOption.value = '';
      renderSettingsTable();
      showSuccessNoticeModal(`Option '<strong>${escapeHtml(val)}</strong>' has been successfully added to Product Settings.`);
    });
  }

  async function editSettingsOption(idx) {
    const list = dropdownSettings[activeSettingsCategory] || [];
    const oldVal = list[idx];
    if (oldVal === undefined) return;

    const newVal = prompt(`Edit option value:`, oldVal);
    if (newVal === null) return;
    const cleanVal = newVal.trim();
    if (!cleanVal || cleanVal === oldVal) return;

    if (list.some((opt, i) => i !== idx && opt.toLowerCase() === cleanVal.toLowerCase())) {
      showAlert(`Option '${cleanVal}' already exists in this dropdown list.`);
      return;
    }

    // 1. Sync update to Supabase
    const tblName = SETTINGS_TABLE_MAP[activeSettingsCategory];
    if (supabaseClient && tblName) {
      try {
        const supaItem = (settingsSupabaseItems[activeSettingsCategory] || []).find(i => i.name === oldVal);
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
    dropdownSettings[activeSettingsCategory] = list;
    saveDropdownSettings();
    renderSettingsTable();
  }

  function deleteSettingsOptions() {
    const list = dropdownSettings[activeSettingsCategory] || [];
    const sortedIndices = Array.from(selectedSettingsIndices).sort((a, b) => b - a);
    if (sortedIndices.length === 0) return;

    const count = sortedIndices.length;
    const confirmMsg = count === 1
      ? `Are you sure you want to delete option '<strong>${escapeHtml(list[sortedIndices[0]])}</strong>' from Product Settings?`
      : `Are you sure you want to delete all <strong>${count}</strong> selected options from Product Settings?`;

    showDeleteConfirmModal(confirmMsg, async () => {
      const tblName = SETTINGS_TABLE_MAP[activeSettingsCategory];

      for (const idx of sortedIndices) {
        const targetVal = list[idx];

        // 1. Sync delete to Supabase
        if (supabaseClient && tblName) {
          try {
            const supaItem = (settingsSupabaseItems[activeSettingsCategory] || []).find(i => i.name === targetVal);
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

      dropdownSettings[activeSettingsCategory] = list;
      selectedSettingsIndices.clear();
      saveDropdownSettings();
      renderSettingsTable();
    });
  }

  // Settings Sub-Tab Category Switching
  document.querySelectorAll('.settings-sub-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.settings-sub-tab').forEach(b => b.classList.remove('active'));
      const targetBtn = e.currentTarget;
      targetBtn.classList.add('active');
      activeSettingsCategory = targetBtn.getAttribute('data-cat');
      renderSettingsTable();
    });
  });

  // --- TAB SWITCHING HANDLERS ---
  tabCutlist.addEventListener('click', () => {
    tabCutlist.classList.add('active');
    tabMasterProduct.classList.remove('active');
    if (tabProductSettings) tabProductSettings.classList.remove('active');

    viewCutlist.classList.add('active');
    viewMasterProduct.classList.remove('active');
    if (viewProductSettings) viewProductSettings.classList.remove('active');
  });

  tabMasterProduct.addEventListener('click', () => {
    tabMasterProduct.classList.add('active');
    tabCutlist.classList.remove('active');
    if (tabProductSettings) tabProductSettings.classList.remove('active');

    viewMasterProduct.classList.add('active');
    viewCutlist.classList.remove('active');
    if (viewProductSettings) viewProductSettings.classList.remove('active');
  });

  if (tabProductSettings) {
    tabProductSettings.addEventListener('click', () => {
      tabProductSettings.classList.add('active');
      tabCutlist.classList.remove('active');
      tabMasterProduct.classList.remove('active');

      if (viewProductSettings) viewProductSettings.classList.add('active');
      viewCutlist.classList.remove('active');
      viewMasterProduct.classList.remove('active');

      renderSettingsTable();
    });
  }

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
        const rawCode = item.product || item.product_id || '';
        if (rawCode) {
          const cleanVal = String(rawCode).replace(/[\u00A0\s]+/g, '').toUpperCase();
          if (cleanVal) masterProductSet.add(cleanVal);
        }
      });

      const countStr = masterProductSet.size.toLocaleString();
      supaHeaderCount.textContent = `${countStr} products`;
      supaStatusBadge.className = 'supabase-status-badge connected';

      // Auto-populate Cut list Tab Upload Box 2 if products exist in Supabase
      if (masterProductSet.size > 0 && !masterProductFile) {
        productFileStatus.innerHTML = `<i class="fa-solid fa-cloud-check" style="color: var(--success);"></i> Auto-loaded ${countStr} products from Supabase`;
        productDropzone.classList.add('loaded');
        checkReadyState();
      }

      // Sync Product Settings from Supabase tables (product_types, product_groups, etc.)
      await syncSettingsFromSupabase();

      renderMasterProductTable();
    } catch (err) {
      console.warn('Supabase fetch notice:', err.message);
      supaHeaderCount.textContent = 'Ready';
      supaStatusBadge.className = 'supabase-status-badge connected';
    }
  }

  syncWithSupabase();

  // --- MASTER PRODUCT MODALS HANDLERS ---
  if (btnOpenSingleAddModal && singleRecordModal) {
    btnOpenSingleAddModal.addEventListener('click', () => singleRecordModal.classList.add('active'));
  }
  if (singleRecordModalCloseBtn && singleRecordModal) {
    singleRecordModalCloseBtn.addEventListener('click', () => singleRecordModal.classList.remove('active'));
  }
  if (singleRecordCancelBtn && singleRecordModal) {
    singleRecordCancelBtn.addEventListener('click', () => singleRecordModal.classList.remove('active'));
  }

  if (btnOpenBulkUploadModal && bulkUploadModal) {
    btnOpenBulkUploadModal.addEventListener('click', () => bulkUploadModal.classList.add('active'));
  }
  if (bulkUploadModalCloseBtn && bulkUploadModal) {
    bulkUploadModalCloseBtn.addEventListener('click', () => bulkUploadModal.classList.remove('active'));
  }
  if (bulkUploadCancelBtn && bulkUploadModal) {
    bulkUploadCancelBtn.addEventListener('click', () => bulkUploadModal.classList.remove('active'));
  }

  function updateMasterSelectionUI() {
    const count = selectedMasterProductIds.size;
    if (count === 0) {
      if (masterBottomActions) masterBottomActions.style.display = 'none';
      if (btnMasterEdit) { btnMasterEdit.disabled = true; btnMasterEdit.style.display = 'none'; }
      if (btnMasterDelete) { btnMasterDelete.disabled = true; }
      if (selectAllMasterCheck) selectAllMasterCheck.checked = false;
    } else if (count === 1) {
      if (masterBottomActions) masterBottomActions.style.display = 'flex';
      if (btnMasterEdit) { btnMasterEdit.disabled = false; btnMasterEdit.style.display = 'inline-flex'; }
      if (btnMasterDelete) {
        btnMasterDelete.disabled = false;
        btnMasterDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete Selected (1)';
      }
    } else {
      if (masterBottomActions) masterBottomActions.style.display = 'flex';
      if (btnMasterEdit) { btnMasterEdit.disabled = true; btnMasterEdit.style.display = 'none'; }
      if (btnMasterDelete) {
        btnMasterDelete.disabled = false;
        btnMasterDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Selected (${count})`;
      }
    }
  }

  if (selectAllMasterCheck) {
    selectAllMasterCheck.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const rows = supaMasterTableBody.querySelectorAll('tr[data-id]');
      rows.forEach(tr => {
        const pID = tr.getAttribute('data-id');
        const chk = tr.querySelector('.master-row-check');
        if (!pID || !chk) return;

        chk.checked = isChecked;
        if (isChecked) {
          selectedMasterProductIds.add(pID);
          tr.classList.add('selected-row');
        } else {
          selectedMasterProductIds.delete(pID);
          tr.classList.remove('selected-row');
        }
      });
      updateMasterSelectionUI();
    });
  }

  // --- RENDER MASTER PRODUCT LIVE TABLE WITH ROW SELECTION (NO INLINE ACTIONS) ---
  function renderMasterProductTable() {
    const filterTerm = supaTableSearch ? supaTableSearch.value.trim().toLowerCase() : '';
    if (btnSupaSearchClear) btnSupaSearchClear.style.display = filterTerm ? 'inline-flex' : 'none';

    const filtered = supabaseProductsList.filter(item => {
      if (!filterTerm) return true;
      const haystack = `${item.product || item.product_id || ''} ${item.description || item.product_description || ''} ${item.product_type || ''} ${item.product_group || ''} ${item.gtin || ''} ${item.product_category || ''} ${item.base_unit || item.base_uom || ''} ${item.created_by || ''}`.toLowerCase();
      return haystack.includes(filterTerm);
    });

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
      supaMasterTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
            No master products found. Click "Add Product" or "Upload & Overwrite Product List" above.
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
      const pDesc = item.description || item.product_description || item['Product Description'] || '-';
      const pType = item.product_type || item['Product Type'] || '-';
      const pGroup = item.product_group || item['Product Group'] || '-';
      const gtin = item.gtin || item['GTIN'] || '-';
      const pCat = item.product_category || item['Product Category'] || '-';
      const baseUom = item.base_unit || item.base_uom || item['Base Unit of Measure'] || '-';
      const createdBy = item.created_by || item['Created By'] || '-';

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
        <td style="font-size: 0.825rem;">${escapeHtml(gtin)}</td>
        <td style="font-size: 0.825rem;">${escapeHtml(pCat)}</td>
        <td style="font-size: 0.825rem;">${escapeHtml(baseUom)}</td>
        <td style="font-size: 0.825rem; color: var(--text-muted);">${escapeHtml(createdBy)}</td>
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
      editInputCreatedBy.value = targetItem.created_by || '';

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
      const createdByVal = editInputCreatedBy ? editInputCreatedBy.value.trim() : '';

      if (!descVal || !typeVal || !groupVal || !gtinVal || !catVal || !uomVal || !createdByVal) {
        showAlert('<strong>Validation Failed:</strong> All fields in the Edit Product form are compulsory.');
        return;
      }

      const updatePayload = {
        description: descVal,
        product_description: descVal,
        product_type: typeVal,
        product_group: groupVal,
        gtin: gtinVal,
        product_category: catVal,
        base_unit: uomVal,
        base_uom: uomVal,
        created_by: createdByVal
      };

      if (supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from('master_products')
            .update(updatePayload)
            .eq('product_id', targetId);

          if (error) throw error;
        } catch (dbErr) {
          showAlert(`Error updating product in Supabase: ${dbErr.message}`);
          return;
        }
      }

      editProductModal.classList.remove('active');
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
      const filterTerm = supaTableSearch ? supaTableSearch.value.trim().toLowerCase() : '';
      const filtered = supabaseProductsList.filter(item => {
        if (!filterTerm) return true;
        const haystack = `${item.product || item.product_id || ''} ${item.description || item.product_description || ''} ${item.product_type || ''} ${item.product_group || ''} ${item.gtin || ''} ${item.product_category || ''} ${item.base_unit || item.base_uom || ''} ${item.created_by || ''}`.toLowerCase();
        return haystack.includes(filterTerm);
      });
      const totalPages = Math.max(1, Math.ceil(filtered.length / supaPageSize));
      if (supaCurrentPage < totalPages) {
        supaCurrentPage = totalPages;
        renderMasterProductTable();
      }
    });
  }

  if (supaTableSearch) supaTableSearch.addEventListener('input', () => { supaCurrentPage = 1; renderMasterProductTable(); });
  if (btnSupaSearchClear) btnSupaSearchClear.addEventListener('click', () => {
    if (supaTableSearch) supaTableSearch.value = '';
    supaCurrentPage = 1; renderMasterProductTable();
  });
  if (btnRefreshSupaTable) btnRefreshSupaTable.addEventListener('click', syncWithSupabase);

  // --- BULK UPLOAD EXCEL FILE TO SUPABASE WITH REPLACEMENT CONFIRMATION ---
  if (supaBulkDropzone) supaBulkDropzone.addEventListener('click', () => supaBulkInput.click());
  if (supaBulkBtn) supaBulkBtn.addEventListener('click', (e) => { e.stopPropagation(); supaBulkInput.click(); });

  if (btnOpenBulkUploadModal && bulkUploadModal) {
    btnOpenBulkUploadModal.addEventListener('click', () => {
      if (supaFileConfirmContainer) supaFileConfirmContainer.style.display = 'none';
      if (supaUploadProgressContainer) supaUploadProgressContainer.style.display = 'none';
      if (supaBulkInput) supaBulkInput.value = '';
      pendingBulkUploadRecords = [];
      bulkUploadModal.classList.add('active');
    });
  }

  if (supaBulkInput) {
    supaBulkInput.addEventListener('change', async (e) => {
      if (e.target.files.length > 0) {
        await processBulkSupabaseUpload(e.target.files[0]);
      }
    });
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

  async function processBulkSupabaseUpload(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        pendingBulkUploadWorkbook = workbook;

        const extractedRecordsMap = new Map();
        workbook.SheetNames.forEach(sheetName => {
          const jsonObjects = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          if (jsonObjects && jsonObjects.length > 0) {
            jsonObjects.forEach(rowObj => {
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

                extractedRecordsMap.set(cleanCode, {
                  product_id: cleanCode,
                  description: descVal || '-',
                  product_type: typeVal || 'FERT',
                  product_group: groupVal || 'PURLIN',
                  gtin: gtinVal || 'Product',
                  product_category: catVal || 'Product',
                  base_unit: uomVal || 'Piece (PC)',
                  created_by: createdByVal || 'Admin'
                });
              }
            });
          }
        });

        pendingBulkUploadRecords = Array.from(extractedRecordsMap.values());
        if (pendingBulkUploadRecords.length === 0) {
          showAlert('No valid Product records found in the uploaded file.');
          if (supaFileConfirmContainer) supaFileConfirmContainer.style.display = 'none';
          return;
        }

        // Show File Confirmation Box with detected record count
        if (supaFileNameBadge) supaFileNameBadge.textContent = file.name;
        if (supaFileRecordBadge) supaFileRecordBadge.textContent = `${pendingBulkUploadRecords.length.toLocaleString()} product records detected`;
        if (supaFileConfirmContainer) supaFileConfirmContainer.style.display = 'block';
        if (supaUploadProgressContainer) supaUploadProgressContainer.style.display = 'none';

      } catch (err) {
        showAlert(`Error reading file: ${err.message}`);
        if (supaFileConfirmContainer) supaFileConfirmContainer.style.display = 'none';
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // --- CONFIRM IMPORT & OVERWRITE PRODUCT LIST WITH DIRECT COLUMN FORMAT CHECK ---
  if (btnConfirmBulkReplace) {
    btnConfirmBulkReplace.addEventListener('click', async () => {
      if (!pendingBulkUploadRecords || pendingBulkUploadRecords.length === 0 || !pendingBulkUploadWorkbook) {
        showAlert('No product records ready to import.');
        return;
      }

      const origBtnHTML = btnConfirmBulkReplace.innerHTML;
      btnConfirmBulkReplace.disabled = true;
      btnConfirmBulkReplace.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Checking Column Format...`;

      // 1. DIRECTLY CHECK COLUMN FORMAT BEFORE OVERWRITING
      const REQUIRED_COLUMNS = [
        { name: 'Product / Product ID', keys: ['product', 'product id', 'product_id', 'product code', 'sku'] },
        { name: 'Product Description', keys: ['product description', 'description', 'product_description'] },
        { name: 'Product Type', keys: ['product type', 'type', 'product_type'] },
        { name: 'Product Group', keys: ['product group', 'group', 'product_group'] },
        { name: 'GTIN', keys: ['gtin', 'gtin/ean', 'gtin / ean', 'gtin number', 'gtin code', 'ean', 'upc', 'barcode'] },
        { name: 'Product Category', keys: ['product category', 'category', 'product_category'] },
        { name: 'Base Unit of Measure', keys: ['base unit of measure', 'base unit', 'base_unit', 'base_uom', 'uom', 'unit'] },
        { name: 'Created By', keys: ['created by', 'created_by'] }
      ];

      const foundHeaders = new Set();
      pendingBulkUploadWorkbook.SheetNames.forEach(sName => {
        const rows = XLSX.utils.sheet_to_json(pendingBulkUploadWorkbook.Sheets[sName], { header: 1 });
        if (rows && rows.length > 0 && Array.isArray(rows[0])) {
          rows[0].forEach(h => {
            if (h) foundHeaders.add(String(h).trim().toLowerCase());
          });
        }
      });

      const missingCols = [];
      REQUIRED_COLUMNS.forEach(col => {
        const match = col.keys.some(k => foundHeaders.has(k));
        if (!match) {
          missingCols.push(col.name);
        }
      });

      if (missingCols.length > 0) {
        btnConfirmBulkReplace.disabled = false;
        btnConfirmBulkReplace.innerHTML = origBtnHTML;

        const errorModal = document.getElementById('errorModal');
        const errorModalText = document.getElementById('errorModalText');
        if (errorModalText && errorModal) {
          errorModalText.innerHTML = `
            <strong>Column Format Validation Failed:</strong><br>
            The uploaded product file is missing the following required columns:<br>
            <strong style="color: #ef4444; font-size: 0.95rem; display: block; margin: 0.6rem 0;">
              ${missingCols.join(', ')}
            </strong>
            Please upload the right data format containing all 8 compulsory product columns before overwriting the database.
          `;
          errorModal.classList.add('active');
        }
        return;
      }

      // 2. If format valid, prompt confirmation and overwrite
      const countStr = pendingBulkUploadRecords.length.toLocaleString();
      const fileName = supaFileNameBadge ? supaFileNameBadge.textContent : 'selected file';

      btnConfirmBulkReplace.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Overwriting Database...`;

      try {
        if (supaUploadProgressContainer) supaUploadProgressContainer.style.display = 'block';
        if (supaUploadProgressBar) supaUploadProgressBar.style.width = '10%';
        if (supaUploadStatusText) supaUploadStatusText.textContent = 'Clearing existing database records...';

        if (supabaseClient) {
          // Clear existing products in Supabase
          try {
            await supabaseClient.from('master_products').delete().neq('product_id', '_FORCE_CLEAR_ALL_');
          } catch (delErr) {
            console.warn('Notice clearing existing products:', delErr.message);
          }

          // Batch Insert / Upsert new records in Chunks of 250
          const chunkSize = 250;
          const totalChunks = Math.ceil(pendingBulkUploadRecords.length / chunkSize);

          for (let i = 0; i < totalChunks; i++) {
            const chunk = pendingBulkUploadRecords.slice(i * chunkSize, (i + 1) * chunkSize);

            const { error } = await supabaseClient
              .from('master_products')
              .upsert(chunk, { onConflict: 'product_id' });

            if (error) {
              console.error('Chunk upload error:', error.message);
              throw error;
            }

            const pct = Math.round(((i + 1) / totalChunks) * 100);
            if (supaUploadProgressBar) supaUploadProgressBar.style.width = pct + '%';
            if (supaUploadStatusText) supaUploadStatusText.textContent = `Importing chunk ${i + 1} of ${totalChunks} (${pct}%)...`;
          }
        } else {
          masterProductSet.clear();
          supabaseProductsList = [...pendingBulkUploadRecords];
          pendingBulkUploadRecords.forEach(rec => masterProductSet.add(rec.product_id));
        }

        if (supaUploadStatusText) supaUploadStatusText.textContent = `Successfully overwritten master list with ${countStr} products!`;

        setTimeout(() => {
          btnConfirmBulkReplace.disabled = false;
          btnConfirmBulkReplace.innerHTML = origBtnHTML;
          if (supaUploadProgressContainer) supaUploadProgressContainer.style.display = 'none';
          if (supaFileConfirmContainer) supaFileConfirmContainer.style.display = 'none';
          if (bulkUploadModal) bulkUploadModal.classList.remove('active');
        }, 1400);

        await syncWithSupabase();
      } catch (err) {
        btnConfirmBulkReplace.disabled = false;
        btnConfirmBulkReplace.innerHTML = origBtnHTML;
        showAlert(`Bulk replacement error: ${err.message}`);
        if (supaUploadProgressContainer) supaUploadProgressContainer.style.display = 'none';
      }
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
      const createdByVal = inputCreatedBy ? inputCreatedBy.value.trim() : '';

      // Compulsory All-Fields Check
      if (!pCode || !descVal || !typeVal || !groupVal || !gtinVal || !catVal || !uomVal || !createdByVal) {
        showAlert('<strong>Validation Failed:</strong> All fields in the Add Product form are compulsory. Please fill out all 8 fields.');
        return;
      }

      const cleanCode = pCode.replace(/[\u00A0\s]+/g, '').toUpperCase();

      // Unique Product ID / Code Validation
      if (masterProductSet.has(cleanCode)) {
        showAlert(`<strong>Validation Failed:</strong> Product ID Code '<strong>${escapeHtml(cleanCode)}</strong>' already exists in the Master Product List. Product ID must be unique.`);
        return;
      }

      const recordPayload = {
        product_id: cleanCode,
        product: cleanCode,
        description: descVal,
        product_description: descVal,
        product_type: typeVal,
        product_group: groupVal,
        gtin: gtinVal,
        product_category: catVal,
        base_unit: uomVal,
        base_uom: uomVal,
        created_by: createdByVal
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

        const { error } = await supabaseClient
          .from('master_products')
          .upsert([recordPayload], { onConflict: 'product_id' });

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
      console.error(err);
      showAlert(`Failed to load sample files. Please select your own Cut list and Existing Product List files.`);
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
          showAlert(`Failed to parse cut list file.`);
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
