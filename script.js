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

  var translations = {
    de: {
      skip_link: 'Zum Hauptinhalt springen',
      home: 'Startseite',
      services: 'Unsere Leistungen',
      pricing: 'Preise',
      faq: 'FAQ',
      order: 'Bestellen',
      contact: 'Kontakt',
      get_started: 'Jetzt starten',
      index_hero_title: '<span class="accent">SCANNEN. ANSEHEN. GENIESSEN.</span> Smarte Lösungen für moderne Unternehmen',
      index_hero_lede: 'Willkommen bei Smart Menu Solutions. Wir verbinden digitale Innovation mit modernem Branding, um die Gastronomie zu revolutionieren. Entdecken Sie, wie unsere Lösungen Ihr Restaurant, Café, Ihre Bar oder Ihr Hotel in ein nahtloses digitales Erlebnis verwandeln.',
      index_hero_btn: 'Unsere Leistungen entdecken',
      index_transform_title: 'Verwandeln Sie Ihr Unternehmen <span class="accent">noch heute</span>',
      index_transform_desc: 'Bereit für die Zukunft? Unsere digitalen Menülösungen sind modern, auffällig und besonders einfach zu bedienen. Erleben Sie, wie Smart Menu Solutions frische Impulse in Ihren Betrieb bringt und Ihre Gäste begeistert.',
      index_transform_btn: 'Bestellung starten',
      footer_copyright: '© 2026 Smart Menu Solutions — Powered by Smart Menu Solutions',
      privacy_policy: 'Datenschutzerklärung',
      terms_of_service: 'Nutzungsbedingungen',
      cookie_policy: 'Cookie-Richtlinie',
      disclaimer: 'Haftungsausschluss',
      refund_policy: 'Rückerstattungsrichtlinie',
      imprint: 'Impressum',
      badge_popular: 'Am beliebtesten',
      privacy_page_title: 'Datenschutz <span class="accent">erklärung</span>',
      refund_hero_title: 'Rückerstattungs <span class="accent">richtlinie</span>',
      refund_hero_desc: 'Bitte lesen Sie unsere Rückerstattungsrichtlinie sorgfältig durch, bevor Sie eine Bestellung aufgeben.',
      refund_updated: 'Zuletzt aktualisiert: September 2026',
      refund_intro_1: 'Bei',
      refund_intro_2: 'ist Kundenzufriedenheit für uns wichtig. Bitte lesen Sie unsere Rückerstattungsrichtlinie sorgfältig, bevor Sie eine Bestellung aufgeben.',
      refund_h2_digital: 'Digitale Services und individuelle Leistungen',
      refund_p_digital: 'Unsere Produkte und Leistungen sind individuelle digitale Lösungen. Da die Arbeit direkt nach Bestätigung der Bestellung beginnt, gelten folgende Regeln:',
      refund_li_before_title: 'Bevor die Arbeit begonnen hat:',
      refund_li_before_desc: 'Kundinnen und Kunden können innerhalb von 24 Stunden nach Bestellung eine vollständige Rückerstattung anfragen, sofern noch keine Arbeit begonnen hat.',
      refund_li_after_title: 'Nachdem die Arbeit begonnen hat:',
      refund_li_after_desc: 'Sobald Design, Entwicklung, Einrichtung oder Individualisierung gestartet wurde, sind Rückerstattungen für bereits geleistete oder laufende Arbeit ausgeschlossen.',
      refund_qr_note_title: 'Wichtiger Hinweis für digitale QR-Menüs:',
      refund_qr_note_desc: 'Aufgrund der individuellen und digitalen Natur unserer Leistungen sind Rückerstattungen nicht möglich, sobald Design- oder Entwicklungsarbeiten begonnen haben.',
      refund_h2_completed: 'Abgeschlossene Projekte',
      refund_p_completed: 'Für abgeschlossene und ausgelieferte digitale Menüprojekte werden keine Rückerstattungen gewährt.',
      refund_h2_tech: 'Technische Probleme',
      refund_p_tech: 'Wenn ein von Smart Menu Solutions verursachtes technisches Problem die vereinbarte Funktion verhindert, bemühen wir uns um eine Lösung. Falls das Problem nicht lösbar ist, kann nach unserem Ermessen eine teilweise oder vollständige Rückerstattung erfolgen.',
      refund_h2_sub: 'Abonnement-Services (falls zutreffend)',
      refund_p_sub: 'Bei wiederkehrenden Services können Kundinnen und Kunden jederzeit kündigen. Die Kündigung verhindert zukünftige Abbuchungen; bereits erfolgte Zahlungen sind in der Regel nicht erstattungsfähig.',
      refund_h2_contact: 'Kontakt',
      refund_p_contact: 'Für Rückerstattungsanfragen oder Fragen kontaktieren Sie uns unter:',
      imprint_main_title: 'Impressum <span class="accent">Rechtliche Hinweise</span>',
      imprint_hero_desc: 'Unternehmensinformationen und rechtliche Kontaktdaten.',
      imprint_effective_date: 'Gültig ab: 1. September 2026',
      imprint_business_info: 'Unternehmensinformationen',
      imprint_business_name_label: 'Unternehmensname:',
      imprint_owner_label: 'Inhaber:',
      imprint_email_label: 'E-Mail:',
      imprint_disclaimer_heading: 'Haftungsausschluss',
      imprint_disclaimer_text: 'Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr.',
      imprint_external_heading: 'Externe Links',
      imprint_external_text: 'Diese Website kann Links zu externen Webseiten Dritter enthalten. Auf deren Inhalte haben wir keinen Einfluss und übernehmen dafür keine Haftung.',
      imprint_copyright_heading: 'Urheberrecht',
      imprint_copyright_text1: 'Alle Inhalte und Werke auf dieser Website unterliegen dem Urheberrecht. Vervielfältigung, Bearbeitung oder Verbreitung bedürfen der schriftlichen Zustimmung.',
      imprint_copyright_text2: 'Inhalte Dritter werden als solche gekennzeichnet. Bei Bekanntwerden von Rechtsverletzungen entfernen wir diese Inhalte umgehend.',
      imprint_contact_heading: 'Kontakt',
      imprint_contact_text: 'Bei Fragen zu rechtlichen Informationen kontaktieren Sie uns bitte per E-Mail.',
      testimonial_4_text: '„Unser Menü wirkt jetzt deutlich professioneller und Gäste finden schneller, was sie suchen.“',
      testimonial_4_author: 'Nikos T., Bistro-Inhaber',
      testimonial_5_text: '„Das QR-Menü funktioniert auf jedem Smartphone hervorragend. Saisonale Updates sind für unser Team viel einfacher geworden.“',
      testimonial_5_author: 'Sofia L., Café-Inhaberin',
      testimonial_6_text: '„Klare Kommunikation, schnelle Umsetzung und ein hochwertiges Ergebnis. Wir sind sehr zufrieden mit unserem neuen digitalen Menü.“',
      testimonial_6_author: 'Michael R., Hotelmanager'
    }
  };

  function setI18nContent(element, value) {
    if (typeof value !== 'string') return;
    if (value.indexOf('<') !== -1 || value.indexOf('&') !== -1) {
      element.innerHTML = value;
      return;
    }
    element.textContent = value;
  }

  function applyTranslations(language) {
    var dictionary = translations[language] || {};
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      var key = element.getAttribute('data-i18n');
      if (!key) return;
      if (!element.hasAttribute('data-i18n-default')) {
        element.setAttribute('data-i18n-default', element.innerHTML);
      }
      var translatedValue = dictionary[key];
      if (typeof translatedValue === 'string') {
        setI18nContent(element, translatedValue);
        return;
      }
      var fallback = element.getAttribute('data-i18n-default');
      if (typeof fallback === 'string') {
        element.innerHTML = fallback;
      }
    });
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
    var storedLanguage = getStoredValue('selectedLang') || 'en';

    var languageButtons = document.querySelectorAll('.flag-btn, .lang-btn');
    if (!languageButtons.length) return;

    document.documentElement.lang = storedLanguage;
    applyTranslations(storedLanguage);
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
      applyTranslations(normalized);
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
        applyTranslations(normalized);
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
    var language = getStoredValue('selectedLang') || 'en';
    var message = language === 'de'
      ? 'Wir verwenden essenzielle Cookies und lokalen Speicher für zentrale Website-Funktionen. <a href="cookie-policy.html">Cookie-Richtlinie</a> · <a href="privacy-policy.html">Datenschutzerklärung</a>'
      : 'We use essential cookies and local storage for core website functions. <a href="cookie-policy.html">Cookie Policy</a> · <a href="privacy-policy.html">Privacy Policy</a>';
    var buttonText = language === 'de' ? 'Akzeptieren' : 'Accept';
    banner.setAttribute('aria-label', language === 'de' ? 'Cookie-Hinweis' : 'Cookie notice');
    banner.innerHTML = '<p>' + message + '</p><button type="button" class="btn cookie-banner__accept">' + buttonText + '</button>';

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
