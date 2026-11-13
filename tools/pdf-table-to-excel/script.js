/* NoeloTools — PDF Table to Excel
 * বাংলা: সব কাজ ব্যবহারকারীর ব্রাউজারে হয়। PDF কোথাও আপলোড হয় না।
 * লাইব্রেরি: pdf.js (PDF পড়া) এবং SheetJS (XLSX তৈরি) — দুটোই CDN থেকে লোড হয়।
 */
(function () {
  'use strict';
  // ---------- সীমা ----------
  var MAX_FILE_MB = 30;
  var MAX_PAGES = 150;
  var PREVIEW_ROWS = 100;
  // =====================================================================
  // অংশ ১: বিশুদ্ধ ফাংশন (DOM ছাড়া, তাই আলাদাভাবে টেস্ট করা যায়)
  // =====================================================================
  // বাংলা: pdf.js-এর টেক্সট আইটেম থেকে প্রয়োজনীয় তথ্য বের করে
  function normalizeItems(rawItems) {
    var out = [];
    for (var i = 0; i < rawItems.length; i++) {
      var it = rawItems[i];
      if (!it || typeof it.str !== 'string') continue;
      var text = it.str.replace(/\s+/g, ' ').trim();
      if (!text) continue;
      var x0 = it.transform[4];
      var y = it.transform[5];
      var h = Math.abs(it.height) || Math.abs(it.transform[3]) || 10;
      var w = it.width || 0;
      out.push({ str: text, x0: x0, x1: x0 + w, y: y, h: h });
    }
    return out;
  }
  // বাংলা: একই উচ্চতার (y) আইটেমগুলোকে এক লাইনে জড়ো করে
  function groupLines(items) {
    var sorted = items.slice().sort(function (a, b) {
      return (b.y - a.y) || (a.x0 - b.x0);
    });
    var lines = [];
    for (var i = 0; i < sorted.length; i++) {
      widths.push({ wch: Math.min(max + 2, 50) });
    }
    ws['!cols'] = widths;
    var wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, 'Table');
    window.XLSX.writeFile(wb, state.baseName + '.xlsx');
  }
  function downloadCsv() {
    if (!state.table) return;
    var delimiter = el.delimiter.value === 'tab' ? '\t' : el.delimiter.value;
    var csv = toCsv(state.table.rows, delimiter);
    download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), state.baseName + '.csv');
  }
  // ---------- ইভেন্ট ----------
  el.file.addEventListener('change', function () { handleFile(el.file.files && el.file.files[0]); });
  ['dragenter', 'dragover'].forEach(function (ev) {
    el.drop.addEventListener(ev, function (e) { e.preventDefault(); el.drop.classList.add('ptx-drag'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    el.drop.addEventListener(ev, function (e) { e.preventDefault(); el.drop.classList.remove('ptx-drag'); });
  });
  el.drop.addEventListener('drop', function (e) {
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(f);
  });
  el.gap.addEventListener('input', function () {
    el.gapValue.textContent = Number(el.gap.value).toFixed(1);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 150);
  });
  el.repeated.addEventListener('change', render);
  el.single.addEventListener('change', render);
  el.xlsx.addEventListener('click', downloadXlsx);
  el.csv.addEventListener('click', downloadCsv);
  el.reset.addEventListener('click', resetAll);
})();