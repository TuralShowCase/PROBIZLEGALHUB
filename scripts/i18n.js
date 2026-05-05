"use strict";

window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// i18n MODULE — Language switching, translation application, switcher injection
//
// Attributes recognised:
//   data-i18n="key"       → sets element.textContent
//   data-i18n-html="key"  → sets element.innerHTML  (use only for trusted keys
//                           with inline markup, e.g. index.pf_desc)
//   data-i18n-aria="key"  → sets element.setAttribute('aria-label', …)
//
// Public API:
//   PROBIZ.i18n.init()          — call first in DOMContentLoaded
//   PROBIZ.i18n.setLang(lang)   — switch language at runtime
//   PROBIZ.i18n.getLang()       — returns current language code
// =============================================================================
PROBIZ.i18n = (function () {

  const STORAGE_KEY = "plh_lang";
  const SUPPORTED   = ["az", "en", "ru"];
  const LABELS      = { az: "AZ", en: "EN", ru: "RU" };

  let _lang = "az";

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  const _t = (key) => {
    const dict = PROBIZ.translations[_lang];
    if (dict && dict[key] !== undefined) return dict[key];
    // Fall back to az so the page never shows a raw key
    const fallback = PROBIZ.translations.az;
    return (fallback && fallback[key] !== undefined) ? fallback[key] : key;
  };

  const _apply = () => {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const val = _t(el.dataset.i18n);
      el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const val = _t(el.dataset.i18nHtml);
      el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const val = _t(el.dataset.i18nAria);
      el.setAttribute("aria-label", val);
    });

    document.documentElement.lang = _lang;
  };

  // ---------------------------------------------------------------------------
  // Language switcher — injected into the existing .lang-toggle dropdown
  // ---------------------------------------------------------------------------

  const _injectSwitcher = () => {
    const container = document.querySelector(".lang-toggle")?.closest(".dropdown");
    if (!container) return;

    container.innerHTML = `
      <a href="#"
         class="text-white text-decoration-none dropdown-toggle lang-toggle"
         data-bs-toggle="dropdown"
         role="button"
         aria-label="Change language">
        <i class="bi bi-globe2 small"></i>
        <span class="plh-lang-label">${LABELS[_lang]}</span>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark lang-menu">
        <li><a class="dropdown-item" href="javascript:void(0)" data-plh-lang="az">Azərbaycanca</a></li>
        <li><a class="dropdown-item" href="javascript:void(0)" data-plh-lang="en">English</a></li>
        <li><a class="dropdown-item" href="javascript:void(0)" data-plh-lang="ru">Русский</a></li>
      </ul>
    `;

    container.querySelectorAll("[data-plh-lang]").forEach(item => {
      item.addEventListener("click", e => {
        e.preventDefault();
        setLang(item.dataset.plhLang);
      });
    });

    _updateSwitcher();
  };

  const _updateSwitcher = () => {
    const label = document.querySelector(".plh-lang-label");
    if (label) label.textContent = LABELS[_lang];

    document.querySelectorAll("[data-plh-lang]").forEach(item => {
      item.classList.toggle("active", item.dataset.plhLang === _lang);
    });
  };

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  const getLang = () => _lang;

  const setLang = (lang) => {
    if (!SUPPORTED.includes(lang)) return;

    // Navigate to the same page in the new language folder
    const parts = window.location.pathname.split("/");
    if (SUPPORTED.includes(parts[1])) {
      parts[1] = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      window.location.href = parts.join("/") || "/";
      return;
    }

    _lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    _apply();
    _updateSwitcher();
    document.dispatchEvent(new CustomEvent("plh:langChange", { detail: { lang: _lang } }));
  };

  const init = () => {
    if (typeof PROBIZ.translations === "undefined") {
      console.warn("PROBIZ i18n: translations.js must load before i18n.js");
      return;
    }

    // Detect language from URL path first (/az/, /en/, /ru/)
    const urlLang = window.location.pathname.split("/")[1];
    if (SUPPORTED.includes(urlLang)) {
      _lang = urlLang;
      localStorage.setItem(STORAGE_KEY, _lang);
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      _lang = SUPPORTED.includes(saved) ? saved : "az";
    }

    _injectSwitcher();
    _apply();
  };

  return { init, setLang, getLang };

})();
