/* socolode shared i18n framework
 * Each page defines a global dict: window.SocolodeI18nDict = { en: {...}, zh: {...} }
 * Then calls SocolodeI18n.init().
 * Elements with data-i18n get textContent replaced.
 * Elements with data-i18n-html get innerHTML replaced (for inline markup).
 * Dynamic strings in page JS use SocolodeI18n.t('key').
 * Default language: en. Persisted in localStorage('socolode-lang').
 */
(function () {
  var STORAGE_KEY = 'socolode-lang';
  var DEFAULT_LANG = 'en';
  var current = DEFAULT_LANG;
  var dict = { en: {}, zh: {} };

  function load() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'zh') current = saved;
      else current = DEFAULT_LANG;
    } catch (e) { current = DEFAULT_LANG; }
  }

  function save(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function t(key) {
    var langDict = dict[current] || {};
    if (key in langDict) return langDict[key];
    if (key in (dict.en || {})) return dict.en[key];
    return key;
  }

  function apply() {
    var html = document.documentElement;
    html.setAttribute('lang', current === 'zh' ? 'zh-CN' : 'en');

    // Update page title if a data-i18n-title meta/key exists
    var titleEl = document.querySelector('[data-i18n-title]');
    if (titleEl) {
      var tk = titleEl.getAttribute('data-i18n-title');
      document.title = t(tk);
    }
    // Update meta description
    var desc = document.querySelector('meta[name="description"]');
    if (desc && desc.hasAttribute('data-i18n-desc')) {
      desc.setAttribute('content', t(desc.getAttribute('data-i18n-desc')));
    }

    // Static text nodes
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      if (el.tagName !== 'HEAD') el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });

    // Language toggle button: highlight the active language segment
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      var parts = btn.querySelectorAll('[data-lang-part]');
      parts.forEach(function (part) {
        var active = part.getAttribute('data-lang-part') === current;
        part.style.background = active
          ? 'linear-gradient(135deg,#7c6cf0,#8b5cf6)'
          : 'transparent';
        part.style.boxShadow = active ? '0 2px 8px rgba(124,108,240,.5)' : 'none';
        part.style.color = active ? '#ffffff' : 'rgba(255,255,255,.55)';
      });
      btn.style.borderColor = 'rgba(124,108,240,.55)';
    });

    // Notify page scripts that language changed
    var evt = document.createEvent('Event');
    evt.initEvent('socolode:lang', true, false);
    document.dispatchEvent(evt);
  }

  function toggle() {
    current = current === 'zh' ? 'en' : 'zh';
    save(current);
    apply();
  }

  function init(userDict) {
    if (userDict) dict = userDict;
    load();
    // Build the floating toggle button
    buildToggle();
    apply();
  }

  function buildToggle() {
    if (document.querySelector('#socolode-lang-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'socolode-lang-toggle';
    btn.setAttribute('data-lang-toggle', '');
    btn.setAttribute('title', 'Switch language / 切换语言');
    btn.style.cssText =
      'position:fixed;top:12px;right:12px;z-index:9998;display:inline-flex;align-items:center;gap:2px;' +
      'height:30px;padding:3px;border-radius:999px;cursor:pointer;' +
      'font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.2px;line-height:1;' +
      'color:#fff;background:rgba(15,16,30,.72);border:1px solid rgba(255,255,255,.22);' +
      'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
      'box-shadow:0 4px 14px rgba(0,0,0,.35);transition:all .2s ease;-webkit-user-select:none;user-select:none;' +
      'min-width:76px;justify-content:center;';
    btn.innerHTML =
      '<span data-lang-part="zh" style="padding:4px 9px;border-radius:999px;transition:all .2s ease;">中文</span>' +
      '<span data-lang-part="en" style="padding:4px 9px;border-radius:999px;transition:all .2s ease;">English</span>';
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    document.body.appendChild(btn);
  }

  window.SocolodeI18n = { init: init, toggle: toggle, apply: apply, t: t, getLang: function () { return current; } };
})();