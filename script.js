(function () {
  'use strict';

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    callback();
  }

  function getStoredValue(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setStoredValue(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
    }
  }

  function initSmartMenus() {
    try {
      if (!window.jQuery || !window.jQuery.fn || typeof window.jQuery.fn.smartmenus !== 'function') {
        return;
      }
      window.jQuery('.main-nav > ul').each(function () {
        var menu = window.jQuery(this);
        if (menu.data('smartmenus')) return;
        menu.smartmenus({
          subMenusSubOffsetX: 1,
          subMenusSubOffsetY: -8
        });
      });
    } catch (error) {
      console.error('SmartMenus initialization failed:', error);
    }
  }

  function initMobileNavigation() {
    var toggles = document.querySelectorAll('.nav-toggle');
    if (!toggles.length) return;

    toggles.forEach(function (toggle, index) {
      var header = toggle.closest('.site-header') || document;
      var nav = header.querySelector('.main-nav');
      if (!nav) return;

      if (!nav.id) {
        nav.id = 'main-nav-' + (index + 1);
      }
      toggle.setAttribute('aria-controls', nav.id);

      function closeNav() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }

      function openNav() {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }

      function isOpen() {
        return nav.classList.contains('is-open');
      }

      toggle.addEventListener('click', function () {
        if (isOpen()) {
          closeNav();
        } else {
          openNav();
        }
      });

      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          closeNav();
        });
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          closeNav();
        }
      });

      document.addEventListener('click', function (event) {
        if (!isOpen()) return;
        if (header.contains(event.target)) return;
        closeNav();
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 860) {
          closeNav();
        }
      });
    });
  }

  function applyStoredLanguage() {
    var storedLanguage = getStoredValue('selectedLang');
    if (!storedLanguage) return;

    var languageButtons = document.querySelectorAll('.flag-btn, .lang-btn');
    if (!languageButtons.length) return;

    document.documentElement.lang = storedLanguage;
    languageButtons.forEach(function (button) {
      var marker = button.getAttribute('data-lang') || button.textContent.trim().toLowerCase();
      var normalized = marker === 'gb' ? 'en' : marker;
      button.classList.toggle('active', normalized === storedLanguage);
    });
  }

  function initLanguageSwitcher() {
    window.switchLanguage = function (language) {
      var normalized = language === 'gb' ? 'en' : String(language || '').toLowerCase();
      if (!normalized) return;
      setStoredValue('selectedLang', normalized);
      document.documentElement.lang = normalized;
      applyStoredLanguage();
    };

    document.querySelectorAll('.flag-btn, .lang-btn').forEach(function (button) {
      if (button.dataset.langBound === 'true') return;
      button.dataset.langBound = 'true';
      button.addEventListener('click', function () {
        var marker = button.getAttribute('data-lang') || button.textContent.trim().toLowerCase();
        var normalized = marker === 'gb' ? 'en' : marker;
        if (!normalized) return;
        setStoredValue('selectedLang', normalized);
        document.documentElement.lang = normalized;
        applyStoredLanguage();
      });
    });

    applyStoredLanguage();
  }

  function initCookieBanner() {
    var consentKey = 'sms_cookie_consent';
    if (getStoredValue(consentKey) || document.body.dataset.cookieBanner === 'disabled') {
      return;
    }

    var banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie notice');
    banner.innerHTML = '<p>We use essential cookies and local storage for core website functions. <a href="cookie-policy.html">Cookie Policy</a> · <a href="privacy-policy.html">Privacy Policy</a></p><button type="button" class="btn cookie-banner__accept">Accept</button>';

    var acceptButton = banner.querySelector('.cookie-banner__accept');
    acceptButton.addEventListener('click', function () {
      setStoredValue(consentKey, 'accepted');
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  function initErrorHandling() {
    window.addEventListener('error', function (event) {
      if (event.error) {
        console.error('Unhandled script error:', event.error);
      }
    });

    window.addEventListener('unhandledrejection', function (event) {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  function enforceHttpsForPages() {
    if (window.location.protocol !== 'http:') return;
    if (!/github\.io$/i.test(window.location.hostname)) return;

    var secureUrl = 'https://' + window.location.host + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(secureUrl);
  }

  onReady(function () {
    enforceHttpsForPages();
    initErrorHandling();
    initSmartMenus();
    initMobileNavigation();
    initLanguageSwitcher();
    initCookieBanner();
  });
})();
