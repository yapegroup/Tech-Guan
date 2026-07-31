/* Product Data Refinement - Teck Guan Group Application Engine */

document.addEventListener('DOMContentLoaded', () => {
  // Custom Pill Theme Dropdown Elements
  const themeDropdownBtn = document.getElementById('themeDropdownBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeCurrentLabel = document.getElementById('themeCurrentLabel');
  const themeOptions = document.querySelectorAll('.custom-theme-option');

  // Load Saved Theme Preference
  const savedTheme = localStorage.getItem('tg_theme_preference') || 'dark';
  applyTheme(savedTheme);

  // Toggle Custom Dropdown Menu
  if (themeDropdownBtn && themeMenu) {
    themeDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = themeMenu.classList.toggle('show');
      themeDropdownBtn.classList.toggle('open', isOpen);
      themeDropdownBtn.setAttribute('aria-expanded', isOpen);
    });

    // Option Click Listener
    themeOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const mode = opt.getAttribute('data-value');
        applyTheme(mode);

        themeMenu.classList.remove('show');
        themeDropdownBtn.classList.remove('open');
        themeDropdownBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close Menu on Click Outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-dropdown-container')) {
        themeMenu.classList.remove('show');
        themeDropdownBtn.classList.remove('open');
        themeDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.setAttribute('data-theme', mode);
    localStorage.setItem('tg_theme_preference', mode);

    // Update Label & Active States
    if (themeCurrentLabel) {
      themeCurrentLabel.textContent = mode === 'light' ? '☀️ Bright Theme' : '🌙 Dark Theme';
    }

    themeOptions.forEach(opt => {
      if (opt.getAttribute('data-value') === mode) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  // UI Elements
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');

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

  // State Variables
  let originalFileName = '';
  let processedData = []; // Array of [Truss, ID, Member, Qty, Length, Product ID]
  let summaryStats = { total: 0, dups: 0, renames: 0, clean: 0 };
  let isTxtFile = false;
  let rawTxtLines = [];
  let allLogEntries = []; // Array of { msg, type }

  // Log Search Navigation State
  let matchingLogElements = [];
  let currentMatchIdx = -1;

  // Drag & Drop Handlers
  dropzone.addEventListener('click', () => fileInput.click());
  
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // Preset Sample Handlers
  if (sampleExcelBtn) {
    sampleExcelBtn.addEventListener('click', () => loadSampleFile('working sheet - Copy (3).xlsx'));
  }
  if (sampleTxtBtn) {
    sampleTxtBtn.addEventListener('click', () => loadSampleFile('T-2674-Blok Akademik 3-00 Truss Cutlist.txt'));
  }

  modalCloseBtn.addEventListener('click', closeModal);
  errorModalCloseBtn.addEventListener('click', closeErrorModal);
  errorModalOkBtn.addEventListener('click', closeErrorModal);

  function closeModal() {
    refinementModal.classList.remove('active');
  }

  function closeErrorModal() {
    errorModal.classList.remove('active');
  }

  function hideAlert() {
    errorModal.classList.remove('active');
  }

  // Show Error Pop-up Modal
  function showAlert(msg) {
    errorModalText.innerHTML = msg;
    errorModal.classList.add('active');
  }

  // File Handler Routing
  function handleFile(file) {
    hideAlert();
    originalFileName = file.name;
    const ext = file.name.split('.').pop().toLowerCase();

    if (!['xlsx', 'xls', 'csv', 'txt'].includes(ext)) {
      showAlert(`<strong>Invalid File Format:</strong> .${ext} is not supported.<br>Please upload an Excel (.xlsx, .xls), CSV (.csv), or Text Cutlist (.txt) file.`);
      return;
    }

    const reader = new FileReader();

    if (ext === 'txt') {
      isTxtFile = true;
      reader.onload = (e) => processTextContent(e.target.result);
      reader.readAsText(file);
    } else {
      isTxtFile = false;
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          processExcelRows(jsonRows);
        } catch (err) {
          showAlert(`<strong>File Parse Error:</strong> Could not parse spreadsheet structure.<br>Please ensure it is a valid raw data file.`);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Strict Validation Engine
  function validateColumnsAndContent(rows) {
    if (!rows || rows.length < 2) return false;
    const sampleText = JSON.stringify(rows.slice(0, 100));
    const hasValidMemberCodes = /\b(MB|UB|CPLN|UC)\d+/i.test(sampleText);
    const hasValidIDPatterns = /\b(B\d+|T\d+|W\d+|R\d+|ST\d+|S\d+)\b/i.test(sampleText);

    return hasValidMemberCodes && hasValidIDPatterns;
  }

  // Sample File Loader
  async function loadSampleFile(fileName) {
    hideAlert();
    originalFileName = fileName;
    const ext = fileName.split('.').pop().toLowerCase();
    
    try {
      const samplePath = `../TG/${fileName}`;
      const resp = await fetch(encodeURI(samplePath));
      if (!resp.ok) throw new Error('Fetch sample failed');
      
      if (ext === 'txt') {
        isTxtFile = true;
        const textData = await resp.text();
        processTextContent(textData);
      } else {
        isTxtFile = false;
        const arrayBuf = await resp.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuf), { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        processExcelRows(jsonRows);
      }
    } catch (err) {
      if (ext === 'txt') {
        const mockTxt = `Truss Material Report\nCompany Name Teck Guan Steel S/B\n\nTruss ID Member Qty Length\nGI1 B1 MB10010 1 9750\nGI1 T1 MB10010 1 5379\nGI1 T1 UB10010 1 5379\nGI1 W1 MB7510 1 150\nGI1 W10 MB7510 1 820`;
        isTxtFile = true;
        processTextContent(mockTxt);
      } else {
        const mockRows = [
          ['Material Summary by Truss'],
          ['Truss', 'ID', 'Truss ID', 'Member', 'Length', 'Qty'],
          ['HN1', 'B1', 'HN1 B1', 'MB10010', '280', '8'],
          ['HN1', 'T1', 'HN1 T1', 'MB10010', '993', '8'],
          ['HN1', 'T1', 'HN1 T1', 'UB10010', '993', '8'],
          ['HN1', 'W1', 'HN1 W1', 'MB7510', '180', '8']
        ];
        isTxtFile = false;
        processExcelRows(mockRows);
      }
    }
  }

  // --- LOG ENGINE & REAL-TIME SEARCH NAVIGATION ---
  function addLog(msg, type = 'info') {
    const entry = { msg, type };
    allLogEntries.push(entry);

    const filterTerm = terminalSearch ? terminalSearch.value.trim().toLowerCase() : '';
    
    if (!filterTerm || msg.toLowerCase().includes(filterTerm)) {
      const el = renderLogLine(entry, filterTerm);
      if (filterTerm) {
        matchingLogElements.push(el);
      }
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

    if (btnSearchClear) {
      btnSearchClear.style.display = term ? 'inline-flex' : 'none';
    }

    allLogEntries.forEach(entry => {
      if (!term || entry.msg.toLowerCase().includes(term)) {
        const lineEl = renderLogLine(entry, term);
        if (term) {
          matchingLogElements.push(lineEl);
        }
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
        if (e.shiftKey) {
          goToPrevMatch();
        } else {
          goToNextMatch();
        }
      }
    });
  }

  if (btnSearchClear) btnSearchClear.addEventListener('click', clearSearchInput);
  if (btnSearchNext) btnSearchNext.addEventListener('click', goToNextMatch);
  if (btnSearchPrev) btnSearchPrev.addEventListener('click', goToPrevMatch);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHtml(string) {
    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Initialize Processing State inside Modal
  function startModalProcessing() {
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
    addLog(`Initiating refinement for ${originalFileName}...`, 'info');
  }

  // --- EXCEL PROCESSING PIPELINE (STRICT EMPTY ROW FILTER) ---
  function processExcelRows(rawRows) {
    if (!validateColumnsAndContent(rawRows)) {
      showAlert(`<strong>Validation Failed:</strong> Uploaded file '<em>${originalFileName}</em>' does not match expected Product Cutlist / Truss dataset.<br><br>Required data fields: Engineering Member Codes (e.g., MB10010, UB10010) and Truss Element IDs (e.g., T1, B1, W1). Please upload a valid raw cutlist file.`);
      return;
    }

    startModalProcessing();

    // Filter out completely empty or whitespace-only rows
    const validRows = rawRows.filter(r => 
      Array.isArray(r) && r.some(c => String(c || '').trim() !== '')
    );
    const totalCount = validRows.length;
    
    const cleanOutput = [];
    const seenProductIDs = new Set();
    let dupsCount = 0;
    let productIDCreatedCount = 0;
    let index = 0;

    function step() {
      const batchSize = Math.max(1, Math.floor(totalCount / 40));
      const end = Math.min(index + batchSize, totalCount);

      for (; index < end; index++) {
        const row = validRows[index];

        // Omit empty/whitespace rows
        const nonBlankCells = row.filter(c => String(c || '').trim() !== '');
        if (nonBlankCells.length === 0) continue;

        // Standardize Fields: [Truss, ID, Member, Qty, Length]
        let truss = '', idVal = '', memberCode = '', qty = '', length = '';

        for (let c = 0; c < row.length; c++) {
          const val = String(row[c] || '').trim();
          if (!val) continue;

          if (!truss && /^(GI|HN|J|LH|RH|ST|S)\d+$/i.test(val)) {
            truss = val;
          } else if (!idVal && /^(?:[A-Z]{1,3}\d{1,3}|[A-Z]\d+)$/i.test(val) && !/^(MB|UB|CPLN|UC)\d+/i.test(val)) {
            idVal = val;
          } else if (!memberCode && /^(MB|UB|CPLN|UC)\d+/i.test(val)) {
            memberCode = val;
          }
        }

        if (!truss && row.length > 0) truss = String(row[0] || '').trim();
        if (!idVal && row.length > 1) idVal = String(row[1] || '').trim();
        if (!memberCode && row.length > 3) memberCode = String(row[3] || '').trim();

        if (!truss || !idVal || !memberCode || truss.toLowerCase().includes('material summary') || idVal.toLowerCase() === 'id' || memberCode.toLowerCase() === 'member') {
          continue;
        }

        const nums = row.map(c => String(c || '').trim()).filter(c => /^\d+$/.test(c));
        if (nums.length >= 2) {
          const n1 = parseInt(nums[0], 10);
          const n2 = parseInt(nums[1], 10);
          if (n1 > n2 && n1 > 50) {
            length = String(n1); qty = String(n2);
          } else if (n2 > n1 && n2 > 50) {
            length = String(n2); qty = String(n1);
          } else {
            qty = nums[0]; length = nums[1];
          }
        } else if (nums.length === 1) {
          length = nums[0]; qty = '1';
        } else {
          qty = '1'; length = '0';
        }

        // --- STEP 1: Rename Member Prefix ONLY when constructing Product ID ---
        let productIDPrefixMember = memberCode;
        if (memberCode.startsWith('MB')) {
          productIDPrefixMember = memberCode.replace(/^MB/, 'CPLN');
        } else if (memberCode.startsWith('UB')) {
          productIDPrefixMember = memberCode.replace(/^UB/, 'UC');
        }

        // --- STEP 2: Create Product ID = Renamed Prefix Member + 'X' + Length ---
        const productID = `${productIDPrefixMember}X${length}`;
        productIDCreatedCount++;

        // --- STEP 3: Find & Remove Duplicate Product ID ---
        if (seenProductIDs.has(productID)) {
          dupsCount++;
          addLog(`[DUP REMOVED] Row ${index + 1}: Duplicate Product ID '${productID}' removed.`, 'dup');
          continue; // Omit duplicate Product ID
        }

        seenProductIDs.add(productID);
        addLog(`[PRODUCT ID CREATED] Row ${index + 1}: '${productID}' (Member: '${memberCode}')`, 'convert');

        // Standardized 6-Column Output: [Truss, ID, Member (Unchanged), Qty, Length, Product ID]
        const record = [truss, idVal, memberCode, qty, length, productID];
        cleanOutput.push(record);
      }

      const pct = Math.min(100, Math.round((index / totalCount) * 100));
      progressBarFill.style.width = pct + '%';
      modalProgressBadge.textContent = pct + '%';

      if (index < totalCount) {
        requestAnimationFrame(step);
      } else {
        progressBarFill.style.width = '100%';
        modalProgressBadge.textContent = '100%';
        modalTitle.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> Processing Complete!`;
        addLog(`100% complete! Refined ${cleanOutput.length} unique Product IDs into [Truss, ID, Member, Qty, Length, Product ID].`, 'info');
        setTimeout(() => finalizeProcessing(cleanOutput, totalCount, dupsCount, productIDCreatedCount), 300);
      }
    }

    step();
  }

  // --- TEXT CUTLIST PROCESSING PIPELINE (STRICT EMPTY ROW FILTER) ---
  function processTextContent(txt) {
    const lines = txt.split(/\r?\n/).filter(line => line.trim() !== '');
    if (!validateColumnsAndContent(lines)) {
      showAlert(`<strong>Validation Failed:</strong> Uploaded file '<em>${originalFileName}</em>' does not match expected Product Cutlist format.<br><br>Required data fields: Engineering Member Codes (e.g., MB10010, UB10010) and Truss Element IDs (e.g., T1, B1, W1).`);
      return;
    }

    startModalProcessing();

    const totalCount = lines.length;
    const cleanRecords = [];
    const cleanTxtLines = [];
    const seenProductIDs = new Set();
    
    let dupsCount = 0;
    let productIDCreatedCount = 0;
    let index = 0;

    function stepTxt() {
      const batchSize = Math.max(1, Math.floor(totalCount / 40));
      const end = Math.min(index + batchSize, totalCount);

      for (; index < end; index++) {
        let line = lines[index];
        const trimmed = line.trim();

        // Omit completely empty lines
        if (!trimmed) continue;

        const tokens = trimmed.split(/\s+/);
        
        if (tokens.length >= 5 && /^(MB|UB|CPLN|UC)\d+/i.test(tokens[2])) {
          const truss = tokens[0];
          const idVal = tokens[1];
          const memberCode = tokens[2]; // Unchanged original member code
          const qty = tokens[3];
          const length = tokens[4];

          // STEP 1: Prefix rename ONLY for Product ID creation
          let productIDPrefixMember = memberCode;
          if (memberCode.startsWith('MB')) {
            productIDPrefixMember = memberCode.replace(/^MB/, 'CPLN');
          } else if (memberCode.startsWith('UB')) {
            productIDPrefixMember = memberCode.replace(/^UB/, 'UC');
          }

          // STEP 2: Product ID = Renamed Prefix Member + 'X' + Length
          const productID = `${productIDPrefixMember}X${length}`;
          productIDCreatedCount++;

          // STEP 3: Deduplicate by Product ID
          if (seenProductIDs.has(productID)) {
            dupsCount++;
            addLog(`[DUP REMOVED] Line ${index + 1}: Duplicate Product ID '${productID}' removed.`, 'dup');
            continue;
          }
          seenProductIDs.add(productID);
          addLog(`[PRODUCT ID CREATED] Line ${index + 1}: '${productID}' (Member: '${memberCode}')`, 'convert');

          const record = [truss, idVal, memberCode, qty, length, productID];
          cleanRecords.push(record);

          const formattedLine = `${truss.padEnd(6)} ${idVal.padEnd(7)} ${memberCode.padEnd(14)} ${qty.padStart(3)}  ${length.padStart(6)}  ${productID}`;
          cleanTxtLines.push(formattedLine);
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
        modalTitle.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> Processing Complete!`;
        addLog(`100% complete! Refined ${cleanRecords.length} unique Product IDs.`, 'info');
        setTimeout(() => finalizeTextProcessing(cleanTxtLines, cleanRecords, totalCount, dupsCount, productIDCreatedCount), 300);
      }
    }

    stepTxt();
  }

  // --- FINALIZE: SHOW BOTH PROGRESS & REFINE SUMMARY SECTIONS IN MODAL ---
  function finalizeProcessing(cleanOutput, totalInput, dupsCount, renamesCount) {
    processedData = cleanOutput;
    summaryStats = {
      total: totalInput,
      dups: dupsCount,
      renames: renamesCount,
      clean: cleanOutput.length
    };

    renderSummaryMetrics();
  }

  function finalizeTextProcessing(cleanLines, cleanRecords, totalInput, dupsCount, renamesCount) {
    rawTxtLines = cleanLines;
    processedData = cleanRecords;
    summaryStats = {
      total: totalInput,
      dups: dupsCount,
      renames: renamesCount,
      clean: cleanRecords.length
    };

    renderSummaryMetrics();
  }

  function renderSummaryMetrics() {
    valTotalRows.textContent = summaryStats.total.toLocaleString();
    valDupsRemoved.textContent = summaryStats.dups.toLocaleString();
    valRenamedCodes.textContent = summaryStats.renames.toLocaleString();
    valCleanRows.textContent = summaryStats.clean.toLocaleString();

    btnDownloadXlsx.style.display = 'inline-flex';
    btnDownloadCsv.style.display = 'inline-flex';
    btnDownloadTxt.style.display = isTxtFile ? 'inline-flex' : 'none';

    modalSummarySection.style.display = 'block';
  }

  // --- DOWNLOAD GENERATORS (Standardized 6 Columns: Truss, ID, Member, Qty, Length, Product ID) ---
  btnDownloadXlsx.addEventListener('click', () => {
    const exportData = [STANDARD_HEADERS, ...processedData];
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    ws['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 8 }, { wch: 10 }, { wch: 22 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Refined Product Data');
    
    const exportName = originalFileName ? `Refined_${originalFileName.replace(/\.[^/.]+$/, '')}.xlsx` : 'Refined_Product_Data.xlsx';
    XLSX.writeFile(wb, exportName);
  });

  btnDownloadCsv.addEventListener('click', () => {
    const exportData = [STANDARD_HEADERS, ...processedData];
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const exportName = originalFileName ? `Refined_${originalFileName.replace(/\.[^/.]+$/, '')}.csv` : 'Refined_Product_Data.csv';
    
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', exportName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  btnDownloadTxt.addEventListener('click', () => {
    const txtContent = rawTxtLines.join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const exportName = originalFileName ? `Refined_${originalFileName}` : 'Refined_Truss_Cutlist.txt';

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', exportName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  btnReset.addEventListener('click', () => {
    closeModal();
    fileInput.value = '';
    hideAlert();
  });
});
