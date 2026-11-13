/* NoeloTools — Category Carousel (3D কার্ড চাকা)
 * বাংলা: ক্যাটাগরি অনুযায়ী টুলের কার্ড ঘুরিয়ে দেখায়।
 * ডেটা আসে assets/data/tools.json থেকে, তাই নতুন টুল যোগ করলে কার্ডে নিজেই আসে।
 * কোনো বাইরের লাইব্রেরি লাগে না। JS না চললে আগের ক্যাটাগরি গ্রিডই দেখা যায়।
 */
(function () {
  'use strict';

  // ---------- ক্যাটাগরির তালিকা (নাম, আইকন, রঙের hue) ----------
  var CATEGORIES = {
    'pdf':       { label: 'PDF Tools',      icon: 'PDF', hue: 8   },
    'money-tax': { label: 'Money & Tax',    icon: '€',   hue: 150 },
    'media':     { label: 'Media',          icon: '✦',   hue: 285 },
    'developer': { label: 'Developer',      icon: '{ }', hue: 200 },
    'writing':   { label: 'Writing & Text', icon: 'Aa',  hue: 38  },
    'health':    { label: 'Health',         icon: '♡',   hue: 340 },
    'math':      { label: 'Math',           icon: '∑',   hue: 235 },
    'everyday':  { label: 'Everyday',       icon: '⌁',   hue: 172 }
  };
  var ORDER = ['pdf', 'money-tax', 'writing', 'health', 'math', 'everyday', 'developer', 'media'];

  // =====================================================================
  // অংশ ১: বিশুদ্ধ ফাংশন (টেস্টযোগ্য)
  // =====================================================================

  // বাংলা: "Money & Tax", "Money Tax", "money-tax" সবই এক কী-তে আনে
  function normalizeCategory(raw) {
    var s = String(raw || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (CATEGORIES[s]) return s;
    if (s.indexOf('pdf') === 0) return 'pdf';
    if (s.indexOf('money') === 0 || s.indexOf('finance') === 0 || s.indexOf('tax') === 0) return 'money-tax';
    if (s.indexOf('writ') === 0 || s.indexOf('text') === 0) return 'writing';
    if (s.indexOf('health') === 0) return 'health';
    if (s.indexOf('math') === 0) return 'math';
    if (s.indexOf('every') === 0) return 'everyday';
    if (s.indexOf('dev') === 0) return 'developer';
    if (s.indexOf('media') === 0 || s.indexOf('image') === 0) return 'media';
    return '';
  }

  // বাংলা: tools.json-এর বিভিন্ন গঠন সামলায় (অ্যারে, {tools:[]}, {items:[]})
  function extractList(json) {
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.tools)) return json.tools;
    if (json && Array.isArray(json.items)) return json.items;
    return [];
  }

  // বাংলা: লিংক শুধু নিজের সাইটের পাথ বা https হলে গ্রহণযোগ্য
  function resolveUrl(tool, base) {
    var u = tool.url || tool.href || tool.path || '';
    if (!u && tool.slug) u = 'tools/' + tool.slug + '/';
    if (!u) return '';
    if (/^(javascript|data|vbscript):/i.test(u)) return '';
    if (/^https?:\/\//i.test(u) || u.charAt(0) === '/') return u;
    return base + u.replace(/^\.?\//, '');
  }

  // বাংলা: টুলের তালিকা থেকে ক্যাটাগরি অনুযায়ী গ্রুপ বানায়
  function groupTools(list, base, minTools) {
    var groups = {};
    list.forEach(function (t) {
      if (!t || t.hidden === true || t.draft === true || t.comingSoon === true) return;
      var key = normalizeCategory(t.category || t.categorySlug || t.group);
      var name = t.name || t.title;
      var url = resolveUrl(t, base);
      if (!key || !name || !url) return;
      (groups[key] = groups[key] || []).push({
        name: String(name),
        url: url,
        featured: !!(t.featured || t.popular)
      });
    });
    var result = [];
    ORDER.concat(Object.keys(CATEGORIES)).forEach(function (key) {
      if (!groups[key] || result.some(function (g) { return g.key === key; })) return;
      if (groups[key].length < minTools) return;
      var tools = groups[key];
      var top = tools.filter(function (t) { return t.featured; })
        .concat(tools.filter(function (t) { return !t.featured; }))
        .slice(0, 3);
      result.push({ key: key, meta: CATEGORIES[key], count: tools.length, top: top });
    });
    return result;
  }

  // বাংলা: গোলাকার সূচিতে সক্রিয় কার্ড থেকে দূরত্ব (−n/2 .. n/2)
  function circularOffset(i, active, n) {
    var d = (i - active) % n;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  }

  // বাংলা: সব ক্যাটাগরি কার্ডকে একই 3D সিলিন্ডার/চাকার চারপাশে বসায়
  function cardPose(d, cardWidth, total) {
    var count = Math.max(total || 1, 1);
    var angle = d * (360 / count);
    // বাংলা: কেন্দ্র থেকে কার্ডের দূরত্ব; সব কার্ড একই বৃত্তে থাকে
    var radius = cardWidth * 0.9;
    var radians = angle * Math.PI / 180;
    var depth = Math.cos(radians);
    var scale = Math.abs(d) === 0 ? 1 : 0.92;
    return {
      // বাংলা: rotateY + translateZ মিলে প্রকৃত 3D circular wheel তৈরি করে
      transform: 'rotateY(' + angle.toFixed(2) + 'deg) translateZ(' + radius.toFixed(1) + 'px) scale(' + scale + ')',
      opacity: 1,
      z: Math.round(100 + depth * 50),
      visible: true
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { normalizeCategory: normalizeCategory, extractList: extractList, resolveUrl: resolveUrl,
      groupTools: groupTools, circularOffset: circularOffset, cardPose: cardPose };
  }

  // =====================================================================
  // অংশ ২: ব্রাউজারের ইন্টারফেস
  // =====================================================================
  if (typeof document === 'undefined') return;

  function init() {
    var root = document.getElementById('category-carousel');
    if (!root) return;
    var stage = root.querySelector('[data-cc-stage]');
    var track = root.querySelector('[data-cc-track]');
    var dotsBox = root.querySelector('[data-cc-dots]');
    var prevBtn = root.querySelector('[data-cc-prev]');
    var nextBtn = root.querySelector('[data-cc-next]');
    var live = root.querySelector('[data-cc-live]');
    if (!stage || !track || !dotsBox || !prevBtn || !nextBtn) return;

    var src = root.getAttribute('data-tools-src');
    var base = root.getAttribute('data-base') || '/';
    var minTools = Number(root.getAttribute('data-min-tools')) || 1;
    var groups = [];
    var cards = [];
    var dots = [];
    var active = 0;

    fetch(src, { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (json) {
        groups = groupTools(extractList(json), base, minTools);
        if (groups.length < 2) return; // একটা কার্ড দিয়ে চাকা অর্থহীন; আগের গ্রিড থাকবে
        build();
        root.hidden = false;
        layout();
      })
      .catch(function (err) { if (window.console) console.warn('Category carousel skipped:', err); });

    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    }

    function build() {
      groups.forEach(function (g, i) {
        var card = el('article', 'cc-card');
        card.style.setProperty('--h', g.meta.hue);
        card.setAttribute('data-category', g.key);
        card.setAttribute('aria-label', g.meta.label + ', ' + g.count + (g.count === 1 ? ' tool' : ' tools'));

        card.appendChild(el('span', 'cc-icon', g.meta.icon)).setAttribute('aria-hidden', 'true');
        card.appendChild(el('h3', 'cc-title', g.meta.label));

        var ul = el('ul', 'cc-list');
        g.top.forEach(function (t) {
          var li = el('li');
          var a = el('a', 'cc-tool', t.name);
          a.href = t.url;
          li.appendChild(a);
          ul.appendChild(li);
        });
        card.appendChild(ul);

        var foot = el('div', 'cc-foot');
        foot.appendChild(el('span', 'cc-count', g.count + (g.count === 1 ? ' tool' : ' tools')));
        var more = el('a', 'cc-more', 'Explore');
        more.href = '#tools';
        more.setAttribute('data-category', g.key);
        more.addEventListener('click', function () {
          // বাংলা: হোমপেজে ফিল্টার ফাংশন থাকলে সেটা চালায়, না থাকলে শুধু #tools-এ স্ক্রল করে
          if (window.NoeloTools && typeof window.NoeloTools.filterCategory === 'function') {
            window.NoeloTools.filterCategory(g.key);
          }
        });
        foot.appendChild(more);
        card.appendChild(foot);

        // পাশের কার্ডে ক্লিক করলে সেটা মাঝে আসে (লিংকে নয়)
        card.addEventListener('click', function (e) {
          if (i !== active) { e.preventDefault(); e.stopPropagation(); go(i); }
        }, true);

        track.appendChild(card);
        cards.push(card);

        var dot = el('button', 'cc-dot');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Show ' + g.meta.label);
        dot.addEventListener('click', function () { go(i); });
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    function layout() {
      var n = cards.length;
      var w = cards[0].offsetWidth || 280;
      cards.forEach(function (card, i) {
        var pose = cardPose(circularOffset(i, active, n), w, n);
        card.style.transform = pose.transform;
        card.style.opacity = pose.opacity;
        card.style.zIndex = pose.z;
        card.style.pointerEvents = pose.visible ? 'auto' : 'none';
        card.classList.toggle('is-active', i === active);
        card.setAttribute('aria-hidden', i === active ? 'false' : 'true');
        // বাংলা: সক্রিয় নয় এমন কার্ডের লিংকে কিবোর্ড ফোকাস যাবে না
        var links = card.querySelectorAll('a');
        for (var k = 0; k < links.length; k++) links[k].tabIndex = i === active ? 0 : -1;
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === active);
        d.setAttribute('aria-current', i === active ? 'true' : 'false');
        d.style.setProperty('--h', groups[i].meta.hue);
      });
      if (live) live.textContent = groups[active].meta.label + ', ' + (active + 1) + ' of ' + n;
    }

    function go(i) {
      var n = cards.length;
      active = ((i % n) + n) % n;
      layout();
    }

    prevBtn.addEventListener('click', function () { go(active - 1); });
    nextBtn.addEventListener('click', function () { go(active + 1); });

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    });

    // সোয়াইপ / টানা (উল্লম্ব স্ক্রল আটকায় না, কারণ CSS-এ touch-action: pan-y)
    var startX = null;
    var moved = false;
    stage.addEventListener('pointerdown', function (e) { startX = e.clientX; moved = false; });
    stage.addEventListener('pointermove', function (e) {
      if (startX === null || moved) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 45) { moved = true; go(active + (dx < 0 ? 1 : -1)); }
    });
    function endDrag() { startX = null; }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', endDrag);
    // টানার পর ভুলে লিংকে ক্লিক হওয়া আটকানো
    stage.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { if (cards.length) layout(); }, 120);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();