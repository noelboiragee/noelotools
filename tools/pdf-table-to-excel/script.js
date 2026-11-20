/* NoeloTools — PDF Table to Excel
 * PDF extraction and exports run locally in the browser.
 */
(function () {
  'use strict';

  var MAX_FILE_BYTES = 30 * 1024 * 1024;
  var MAX_PAGES = 150;
  var PREVIEW_ROWS = 100;
  var state = { table: null, baseName: 'pdf-table' };
  var $ = function (id) { return document.getElementById(id); };
  var el = {
    file: $('ptx-file'), drop: $('ptx-drop'), status: $('ptx-status'),
    options: $('ptx-options'), gap: $('ptx-gap'), gapValue: $('ptx-gap-value'),
    numbers: $('ptx-numbers'), delimiter: $('ptx-delimiter'),
    repeated: $('ptx-repeated'), single: $('ptx-single'),
    result: $('ptx-result'), summary: $('ptx-summary'), preview: $('ptx-preview'),
    xlsx: $('ptx-xlsx'), csv: $('ptx-csv'), reset: $('ptx-reset')
  };

  function setStatus(message, error) {
    el.status.textContent = message;
    el.status.dataset.kind = error ? 'error' : 'info';
  }
  function safeCell(value) {
    var text = String(value == null ? '' : value);
    return /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
  }
  function csvCell(value, delimiter) {
    var text = safeCell(value);
    if (text.indexOf('"') >= 0 || text.indexOf(delimiter) >= 0 || /[\r\n]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  }
  function toCsv(rows, delimiter) {
    return '\uFEFF' + rows.map(function (row) {
      return row.map(function (cell) { return csvCell(cell, delimiter); }).join(delimiter);
    }).join('\r\n');
  }
  function normalizeItems(items) {
    return items.filter(function (item) {
      return item && typeof item.str === 'string' && item.str.trim();
    }).map(function (item) {
      return {
        text: item.str.replace(/\s+/g, ' ').trim(),
        x: Number(item.transform && item.transform[4]) || 0,
        y: Number(item.transform && item.transform[5]) || 0,
        height: Math.abs(Number(item.height) || Number(item.transform && item.transform[3]) || 10),
        width: Math.max(0, Number(item.width) || 0)
      };
    });
  }
  function median(values) {
    if (!values.length) return 10;
    var sorted = values.slice().sort(function (a, b) { return a - b; });
    return sorted[Math.floor(sorted.length / 2)] || 10;
  }
  function pageRows(items) {
    var normalized = normalizeItems(items);
    var lineTolerance = Math.max(2, median(normalized.map(function (item) { return item.height; })) * 0.45);
    normalized.sort(function (a, b) { return b.y - a.y || a.x - b.x; });
    var lines = [];
    normalized.forEach(function (item) {
      var line = lines.find(function (candidate) { return Math.abs(candidate.y - item.y) <= lineTolerance; });
      if (!line) { line = { y: item.y, items: [] }; lines.push(line); }
      line.items.push(item);
    });
    var gapThreshold = median(normalized.map(function (item) { return item.height; })) * Number(el.gap.value) * 1.4;
    return lines.map(function (line) {
      line.items.sort(function (a, b) { return a.x - b.x; });
      var cells = [], current = '', previousEnd = null;
      line.items.forEach(function (item) {
        var gap = previousEnd === null ? 0 : item.x - previousEnd;
        if (current && gap > gapThreshold) {
          cells.push(current.trim()); current = '';
        }
        current += (current ? ' ' : '') + item.text;
        previousEnd = item.x + item.width;
      });
      if (current.trim()) cells.push(current.trim());
      return cells;
    }).filter(function (row) { return row.length; });
  }
  function normalizeTable(rows) {
    var width = rows.reduce(function (max, row) { return Math.max(max, row.length); }, 0);
    return rows.map(function (row) {
      var result = row.slice();
      while (result.length < width) result.push('');
      return result;
    });
  }
  function render() {
    if (!state.table) return;
    var rows = state.table;
    el.preview.replaceChildren();
    var table = document.createElement('table');
    var body = document.createElement('tbody');
    rows.slice(0, PREVIEW_ROWS).forEach(function (row) {
      var tr = document.createElement('tr');
      row.forEach(function (cell) {
        var td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    table.appendChild(body);
    el.preview.appendChild(table);
    el.summary.textContent = rows.length + ' rows · ' + (rows[0] ? rows[0].length : 0) + ' columns' +
      (rows.length > PREVIEW_ROWS ? ' · Showing first ' + PREVIEW_ROWS + ' rows' : '');
    el.result.hidden = false;
  }
  function resetAll() {
    state.table = null;
    state.baseName = 'pdf-table';
    el.file.value = '';
    el.options.hidden = true;
    el.result.hidden = true;
    el.preview.replaceChildren();
    setStatus('Choose a text-based PDF to get started.');
  }
  async function handleFile(file) {
    if (!file) return;
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setStatus('Choose a PDF file.', true); return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setStatus('The PDF must be 30 MB or smaller.', true); return;
    }
    if (!window.pdfjsLib || !window.XLSX) {
      setStatus('The PDF or Excel library could not load. Check your connection and reload.', true); return;
    }
    el.options.hidden = true;
    el.result.hidden = true;
    setStatus('Reading PDF pages…');
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      var pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      if (pdf.numPages > MAX_PAGES) throw new Error('This tool supports PDFs with up to 150 pages.');
      var rows = [];
      for (var pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        setStatus('Extracting page ' + pageNumber + ' of ' + pdf.numPages + '…');
        var page = await pdf.getPage(pageNumber);
        var content = await page.getTextContent();
        var extracted = pageRows(content.items);
        if (el.repeated.checked && extracted.length && rows.length) {
          var header = extracted[0].join(' | ');
          if (rows.some(function (row) { return row.join(' | ') === header; })) extracted.shift();
        }
        rows = rows.concat(extracted);
        page.cleanup();
      }
      if (el.single.checked) rows = rows.filter(function (row) { return row.length > 1; });
      if (!rows.length) throw new Error('No selectable table text was found in this PDF.');
      state.table = normalizeTable(rows);
      state.baseName = file.name.replace(/\.pdf$/i, '').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '') || 'pdf-table';
      el.options.hidden = false;
      render();
      setStatus('PDF extraction complete. Review the preview before exporting.');
      if (pdf.destroy) await pdf.destroy();
    } catch (error) {
      state.table = null;
      el.result.hidden = true;
      setStatus(error && error.message ? error.message : 'Could not extract text from this PDF.', true);
    }
  }
  function exportRows() {
    if (!state.table) return null;
    return state.table.map(function (row) {
      return row.map(function (cell) {
        var value = String(cell);
        if (/^[\s]*[=+\-@]/.test(value)) return safeCell(value);
        if (el.numbers.value === 'text') return value;
        var normalized = el.numbers.value === 'eu'
          ? value.replace(/\./g, '').replace(',', '.')
          : value.replace(/,/g, '');
        if (/^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(normalized) && normalized !== '' &&
            !/^0\d+/.test(normalized)) return Number(normalized);
        return value;
      });
    });
  }
  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function downloadXlsx() {
    var rows = exportRows();
    if (!rows) return;
    var sheet = window.XLSX.utils.aoa_to_sheet(rows);
    var widths = [];
    for (var column = 0; column < (rows[0] || []).length; column++) {
      var max = rows.reduce(function (length, row) {
        return Math.max(length, String(row[column] == null ? '' : row[column]).length);
      }, 10);
      widths.push({ wch: Math.min(max + 2, 50) });
    }
    sheet['!cols'] = widths;
    var workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, sheet, 'Table');
    window.XLSX.writeFile(workbook, state.baseName + '.xlsx');
  }
  function downloadCsv() {
    if (!state.table) return;
    var delimiter = el.delimiter.value === 'tab' ? '\t' : el.delimiter.value;
    downloadBlob(new Blob([toCsv(state.table, delimiter)], { type: 'text/csv;charset=utf-8' }), state.baseName + '.csv');
  }

  el.file.addEventListener('change', function () { handleFile(el.file.files && el.file.files[0]); });
  ['dragenter', 'dragover'].forEach(function (name) {
    el.drop.addEventListener(name, function (event) { event.preventDefault(); el.drop.classList.add('ptx-drag'); });
  });
  ['dragleave', 'drop'].forEach(function (name) {
    el.drop.addEventListener(name, function (event) { event.preventDefault(); el.drop.classList.remove('ptx-drag'); });
  });
  el.drop.addEventListener('drop', function (event) {
    event.preventDefault();
    handleFile(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]);
  });
  el.gap.addEventListener('input', function () {
    el.gapValue.textContent = Number(el.gap.value).toFixed(1);
    if (state.table) setStatus('Column spacing changed. Re-upload the PDF to apply the new setting.');
  });
  el.repeated.addEventListener('change', function () {
    if (state.table) setStatus('Header-removal setting changed. Re-upload the PDF to apply it.');
  });
  el.single.addEventListener('change', function () {
    if (state.table) setStatus('Single-cell row setting changed. Re-upload the PDF to apply it.');
  });
  el.xlsx.addEventListener('click', downloadXlsx);
  el.csv.addEventListener('click', downloadCsv);
  el.reset.addEventListener('click', resetAll);
  setStatus('Choose a text-based PDF to get started.');
})();