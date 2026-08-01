/* Product Data Refinement - Teck Guan Group Application Engine */

document.addEventListener('DOMContentLoaded', () => {

  // --- DUAL UPLOAD UI ELEMENTS ---
  const cutlistDropzone = document.getElementById('cutlistDropzone');
  const cutlistInput = document.getElementById('cutlistInput');
  const cutlistBtn = document.getElementById('cutlistBtn');
  const cutlistFileStatus = document.getElementById('cutlistFileStatus');

  const productDropzone = document.getElementById('productDropzone');
  const productInput = document.getElementById('productInput');
  const productBtn = document.getElementById('productBtn');
  const productFileStatus = document.getElementById('productFileStatus');

  const btnProcessData = document.getElementById('btnProcessData');

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

  // Standardized 6-Column Output Schema: [Truss, ID, Member, Qty, Length, Product ID]
  const STANDARD_HEADERS = ['Truss', 'ID', 'Member', 'Qty', 'Length', 'Product ID'];

  // Application State
  let cutlistFile = null;
  let masterProductFile = null;
  let masterProductSet = new Set(); // Stores uppercase product codes from Existing Product List

  let processedData = []; // New Product List records: [Truss, ID, Member, Qty, Length, Product ID]
  let summaryStats = { total: 0, dups: 0, existingRemoved: 0, clean: 0 };
  let isTxtFile = false;
  let allLogEntries = [];

  // Log Search Navigation State
  let matchingLogElements = [];
  let currentMatchIdx = -1;

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

  // Strictly require BOTH cutlistFile AND masterProductFile to be selected
  function checkReadyState() {
    if (cutlistFile && masterProductFile) {
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
      // 1. Fetch Existing Product List sample
      let prodResp = await fetch(encodeURI('TG/Products (53) 01.09 - 26.09.xlsx'));
      if (!prodResp.ok) prodResp = await fetch(encodeURI('../TG/Products (53) 01.09 - 26.09.xlsx'));
      if (!prodResp.ok) throw new Error('Fetch master product failed');
      const prodBuf = await prodResp.arrayBuffer();
      parseMasterProductListArrayBuffer(prodBuf);

      // 2. Fetch Cutlist File
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
    if (!cutlistFile || !masterProductFile) return;

    // Parse user-selected Existing Product List file
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
  });

  function parseMasterProductListArrayBuffer(arrayBuffer) {
    masterProductSet.clear();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (!jsonRows || jsonRows.length === 0) return;

    for (let r = 0; r < jsonRows.length; r++) {
      const row = jsonRows[r];
      if (!row) continue;

      for (let c = 0; c < row.length; c++) {
        let val = String(row[c] || '').replace(/[\u00A0\s]+/g, ' ').trim().toUpperCase();
        if (val && val !== 'PRODUCT' && val !== 'PRODUCT ID' && !val.includes('SUMMARY')) {
          masterProductSet.add(val);
        }
      }
    }
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
  errorModalCloseBtn.addEventListener('click', closeErrorModal);
  errorModalOkBtn.addEventListener('click', closeErrorModal);

  function closeModal() { refinementModal.classList.remove('active'); }
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
    if (terminalSearch) terminalSearch.value = '';
    if (btnSearchClear) btnSearchClear.style.display = 'none';
    modalSummarySection.style.display = 'none';
    addLog(`Initiating refinement for ${fileName}...`, 'info');
    addLog(`Existing Product List contains ${masterProductSet.size.toLocaleString()} existing products for comparison.`, 'info');
  }

  // --- EXCEL PROCESSING PIPELINE WITH SMART HEADER & COMBINED CELL PARSER ---
  function processExcelRows(rawRows, fileName) {
    if (!validateColumnsAndContent(rawRows)) {
      showAlert(`<strong>Validation Failed:</strong> Uploaded file '<em>${fileName}</em>' does not match expected Product Cutlist / Truss dataset.`);
      return;
    }

    startModalProcessing(fileName);

    const validRows = rawRows.filter(r => Array.isArray(r) && r.some(c => String(c || '').trim() !== ''));
    const totalCount = validRows.length;

    // Detect Header Row and Column Index Mapping
    let colMap = { truss: -1, id: -1, member: -1, length: -1, qty: -1, truss_id: -1 };
    let headerRowIdx = -1;

    for (let r = 0; r < Math.min(10, validRows.length); r++) {
      const row = validRows[r];
      let hasHeaderMatch = false;

      for (let c = 0; c < row.length; c++) {
        const hStr = String(row[c] || '').trim().toLowerCase();
        if (!hStr) continue;

        if (hStr.includes('truss') && hStr.includes('id')) {
          colMap.truss_id = c; hasHeaderMatch = true;
        } else if (hStr === 'truss') {
          colMap.truss = c; hasHeaderMatch = true;
        } else if (hStr === 'id' || hStr === 'truss id') {
          colMap.id = c; hasHeaderMatch = true;
        } else if (hStr === 'member' || hStr === 'member code' || hStr === 'material') {
          colMap.member = c; hasHeaderMatch = true;
        } else if (hStr === 'length' || hStr === 'len') {
          colMap.length = c; hasHeaderMatch = true;
        } else if (hStr === 'qty' || hStr === 'quantity') {
          colMap.qty = c; hasHeaderMatch = true;
        }
      }

      if (hasHeaderMatch && (colMap.member !== -1 || colMap.length !== -1)) {
        headerRowIdx = r;
        break;
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
        if (index === headerRowIdx) continue; // Skip header row

        const row = validRows[index];
        const nonBlankCells = row.filter(c => String(c || '').trim() !== '');
        if (nonBlankCells.length === 0) continue;

        const rowStr = nonBlankCells.map(c => String(c || '').trim().toLowerCase()).join(' ');

        // Ignore Document Metadata Header Info Rows
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

        // Detect Summary Sections (Materials Summary, Parts Summary, etc.) and skip them
        if (
          rowStr.includes('materials summary') ||
          rowStr.includes('parts summary') ||
          rowStr.includes('material summary') ||
          rowStr.includes('hardware summary') ||
          rowStr.startsWith('summary')
        ) {
          inSummarySection = true;
          addLog(`[SUMMARY SECTION DETECTED] Row ${index + 1}: Skipping summary table.`, 'info');
          continue;
        }

        if (inSummarySection) {
          if (rowStr.includes('material summary by truss') || rowStr.includes('truss')) {
            inSummarySection = false;
          } else {
            continue;
          }
        }

        // Individual Cutlist items must have at least 4 non-blank cells (Truss, ID, Member, Qty/Length)
        if (nonBlankCells.length < 4) continue;

        let truss = '', idVal = '', memberCode = '', qty = '1', length = '0';

        // Extraction via Header Column Mapping
        if (colMap.member !== -1 && colMap.member < row.length) {
          memberCode = String(row[colMap.member] || '').trim();
        }
        if (colMap.length !== -1 && colMap.length < row.length) {
          length = String(row[colMap.length] || '').trim();
        }
        if (colMap.qty !== -1 && colMap.qty < row.length) {
          qty = String(row[colMap.qty] || '').trim();
        }
        if (colMap.truss_id !== -1 && colMap.truss_id < row.length) {
          const combo = String(row[colMap.truss_id] || '').trim();
          const parts = combo.split(/\s+/);
          if (parts.length >= 2) { truss = parts[0]; idVal = parts[1]; }
          else if (parts.length === 1) { truss = parts[0]; idVal = parts[0]; }
        }
        if (colMap.truss !== -1 && colMap.truss < row.length) {
          truss = String(row[colMap.truss] || '').trim();
        }
        if (colMap.id !== -1 && colMap.id < row.length) {
          idVal = String(row[colMap.id] || '').trim();
        }

        // Fallback search if header mapping missed memberCode
        if (!memberCode) {
          for (let c = 0; c < row.length; c++) {
            const val = String(row[c] || '').trim();
            if (/^(MB|UB|CPLN|UC)\d+/i.test(val)) {
              memberCode = val; break;
            }
          }
        }

        // Skip row if member code is invalid or header text
        if (!memberCode || memberCode.toLowerCase() === 'member' || memberCode.toLowerCase().includes('summary')) {
          continue;
        }

        // Fallback length and qty extraction
        if (!length || length === '0') {
          const nums = row.map(c => String(c || '').trim()).filter(c => /^\d+$/.test(c));
          if (nums.length >= 2) {
            const n1 = parseInt(nums[0], 10), n2 = parseInt(nums[1], 10);
            if (n1 > n2 && n1 > 50) { length = String(n1); if (!qty || qty === '1') qty = String(n2); }
            else if (n2 > n1 && n2 > 50) { length = String(n2); if (!qty || qty === '1') qty = String(n1); }
            else { if (!qty || qty === '1') qty = nums[0]; length = nums[1]; }
          } else if (nums.length === 1) {
            length = nums[0];
          }
        }

        if (length === '0') continue;

        if (!truss) truss = (row[0] !== undefined && row[0] !== null ? String(row[0]).trim() : 'N/A');
        if (!idVal) idVal = (row[1] !== undefined && row[1] !== null ? String(row[1]).trim() : 'N/A');

        // STEP 1: Rename Member Prefix ONLY for Product ID creation
        let productIDPrefixMember = memberCode;
        if (memberCode.toUpperCase().startsWith('MB')) {
          productIDPrefixMember = 'CPLN' + memberCode.substring(2);
        } else if (memberCode.toUpperCase().startsWith('UB')) {
          productIDPrefixMember = 'UC' + memberCode.substring(2);
        }

        // STEP 2: Create Product ID = Renamed Prefix + 'X' + Length
        const productID = `${productIDPrefixMember}X${length}`.toUpperCase();

        // STEP 3: Deduplicate Product IDs
        if (seenProductIDs.has(productID)) {
          dupsCount++;
          addLog(`[DUP REMOVED] Row ${index + 1}: Duplicate Product ID '${productID}' removed.`, 'dup');
          continue;
        }
        seenProductIDs.add(productID);

        // STEP 4: Compare Product ID against Existing Product List
        if (masterProductSet.has(productID)) {
          existingMatchRemovedCount++;
          addLog(`[EXISTING PRODUCT REMOVED] Row ${index + 1}: Product ID '${productID}' already exists in Existing Product List. Omitted.`, 'convert');
        } else {
          addLog(`[NEW PRODUCT RETAINED] Row ${index + 1}: Product ID '${productID}' added to New Product List.`, 'newprod');
          const record = [truss, idVal, memberCode, qty, length, productID];
          newProductOutput.push(record);
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

  // --- TEXT CUTLIST PROCESSING PIPELINE WITH SUMMARY SECTION & HEADER FILTERING ---
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

        // Ignore Document Metadata Header Info Rows (Truss Material Report, Company Name, Job Number, etc.)
        if (
          lowerLine.includes('truss material report') ||
          lowerLine.includes('company name') ||
          lowerLine.includes('client name') ||
          lowerLine.includes('job number') ||
          lowerLine.includes('dwg number') ||
          lowerLine.includes('current date') ||
          lowerLine.includes('material summary by truss') ||
          (lowerLine.includes('truss') && lowerLine.includes('id') && lowerLine.includes('member'))
        ) {
          continue;
        }

        // Detect Summary Sections (Materials Summary, Parts Summary, etc.) and skip them completely
        if (
          lowerLine.includes('materials summary') ||
          lowerLine.includes('parts summary') ||
          lowerLine.includes('material summary') ||
          lowerLine.includes('hardware summary') ||
          lowerLine.startsWith('summary')
        ) {
          inSummarySection = true;
          addLog(`[SUMMARY SECTION DETECTED] Line ${index + 1}: '${trimmed}'. Skipping summary table.`, 'info');
          continue;
        }

        if (inSummarySection) {
          if (lowerLine.includes('material summary by truss') || (lowerLine.includes('truss') && lowerLine.includes('id'))) {
            inSummarySection = false;
          } else {
            continue;
          }
        }

        const tokens = trimmed.split(/\s+/);
        
        // Individual Cutlist items must have at least 4 tokens (Truss, ID, Member, Qty, Length)
        if (tokens.length < 4) continue;

        const memberTokenIdx = tokens.findIndex(t => /^(MB|UB|CPLN|UC)\d+/i.test(t));
        if (memberTokenIdx !== -1) {
          const memberCode = tokens[memberTokenIdx];
          let truss = 'N/A';
          let idVal = 'N/A';

          if (tokens.length >= 5) {
            truss = tokens[0] || 'N/A';
            idVal = tokens[1] || 'N/A';
          } else if (memberTokenIdx === 2) {
            truss = tokens[0] || 'N/A';
            idVal = tokens[1] || 'N/A';
          } else if (memberTokenIdx === 1) {
            const parts = tokens[0].split(/\s+/);
            if (parts.length >= 2) {
              truss = parts[0];
              idVal = parts[1];
            } else {
              truss = tokens[0];
              idVal = 'N/A';
            }
          } else if (memberTokenIdx > 2) {
            truss = tokens[0] || 'N/A';
            idVal = tokens[1] || 'N/A';
          } else {
            truss = tokens[0] || 'N/A';
            idVal = tokens[1] || 'N/A';
          }

          const nums = tokens.filter(t => /^\d+$/.test(t));
          let length = '0', qty = '1';
          if (nums.length >= 2) {
            const n1 = parseInt(nums[0], 10), n2 = parseInt(nums[1], 10);
            if (n1 > n2 && n1 > 50) { length = String(n1); qty = String(n2); }
            else if (n2 > n1 && n2 > 50) { length = String(n2); qty = String(n1); }
            else { qty = nums[0]; length = nums[1]; }
          } else if (nums.length === 1) {
            length = nums[0];
          }

          if (length === '0') continue;

          let productIDPrefixMember = memberCode;
          if (memberCode.toUpperCase().startsWith('MB')) {
            productIDPrefixMember = 'CPLN' + memberCode.substring(2);
          } else if (memberCode.toUpperCase().startsWith('UB')) {
            productIDPrefixMember = 'UC' + memberCode.substring(2);
          }

          const productID = `${productIDPrefixMember}X${length}`.toUpperCase();

          if (seenProductIDs.has(productID)) {
            dupsCount++;
            addLog(`[DUP REMOVED] Line ${index + 1}: Duplicate Product ID '${productID}' removed.`, 'dup');
            continue;
          }
          seenProductIDs.add(productID);

          if (masterProductSet.has(productID)) {
            existingMatchRemovedCount++;
            addLog(`[EXISTING PRODUCT REMOVED] Line ${index + 1}: Product ID '${productID}' already exists in Existing Product List. Omitted.`, 'convert');
          } else {
            addLog(`[NEW PRODUCT RETAINED] Line ${index + 1}: Product ID '${productID}' added to New Product List.`, 'newprod');
            const record = [truss, idVal, memberCode, qty, length, productID];
            cleanRecords.push(record);
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
    summaryStats = {
      total: totalInput,
      dups: dupsCount,
      existingRemoved: existingRemovedCount,
      clean: cleanOutput.length
    };
    renderSummaryMetrics();
  }

  function renderSummaryMetrics() {
    valTotalRows.textContent = summaryStats.total.toLocaleString();
    valDupsRemoved.textContent = summaryStats.dups.toLocaleString();
    valRenamedCodes.textContent = summaryStats.existingRemoved.toLocaleString();
    valCleanRows.textContent = summaryStats.clean.toLocaleString();

    btnDownloadXlsx.style.display = 'inline-flex';
    btnDownloadCsv.style.display = 'inline-flex';
    btnDownloadTxt.style.display = 'inline-flex';

    modalSummarySection.style.display = 'block';
  }

  // --- DOWNLOAD GENERATORS (Exported as 'New Product List') ---
  btnDownloadXlsx.addEventListener('click', () => {
    const exportData = [STANDARD_HEADERS, ...processedData];
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    ws['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 8 }, { wch: 10 }, { wch: 22 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'New Product List');
    XLSX.writeFile(wb, 'New Product List.xlsx');
  });

  btnDownloadCsv.addEventListener('click', () => {
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

  // Dynamic 100% Inline Column Alignment for Text (.txt) Exports
  btnDownloadTxt.addEventListener('click', () => {
    const exportData = [STANDARD_HEADERS, ...processedData];
    
    // Calculate max width for each column dynamically across headers + data
    const colWidths = STANDARD_HEADERS.map((h, i) => {
      return Math.max(h.length, ...processedData.map(r => String(r[i] || '').length));
    });

    const txtLines = exportData.map(row => {
      return row.map((cell, idx) => String(cell || '').padEnd(colWidths[idx] + 3)).join('').trimEnd();
    });

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
    cutlistFile = null;
    masterProductFile = null;
    cutlistInput.value = '';
    productInput.value = '';
    cutlistFileStatus.innerHTML = '';
    productFileStatus.innerHTML = '';
    cutlistDropzone.classList.remove('loaded');
    productDropzone.classList.remove('loaded');
    btnProcessData.disabled = true;
    hideAlert();
  });
});
