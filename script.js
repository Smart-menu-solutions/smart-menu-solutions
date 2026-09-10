document.addEventListener('DOMContentLoaded', function () {
  setupLanguageControls();
  ensureLegalLinks();
  document.querySelectorAll('form[action*="formsubmit.co"]').forEach(function (form) {
    var isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    var nextField = form.querySelector('input[name="_next"]');
    if (nextField) {
      if (isLocalHost || window.location.protocol === 'file:') nextField.remove();
      else nextField.value = new URL('thank-you.html', window.location.href).href;
    }
    if (isLocalHost && !form.querySelector('input[name="_captcha"]')) {
      var captchaField = document.createElement('input');
      captchaField.type = 'hidden';
      captchaField.name = '_captcha';
      captchaField.value = 'false';
      form.appendChild(captchaField);
    }
    var emailField = form.querySelector('input[type="email"]');
    if (emailField) {
      var replyToField = form.querySelector('input[name="_replyto"]');
      if (!replyToField) {
        replyToField = document.createElement('input');
        replyToField.type = 'hidden';
        replyToField.name = '_replyto';
        form.appendChild(replyToField);
      }
      emailField.addEventListener('input', function () { replyToField.value = emailField.value; });
    }
  });
  // Mobile Navigation Toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Restore language on page load
  var savedLang = localStorage.getItem('selectedLang') || 'en';
  switchLanguage(savedLang);
});

// Central translation dictionary
var translations = {
  'en': {
    'skip_link': 'Skip to main content',
    'home': 'Home',
    'services': 'Our Services',
    'pricing': 'Pricing Plans',
    'faq': 'FAQ',
    'order': 'Order',
    'contact': 'Contact',
    'get_started': 'Get started',
    'privacy_policy': 'Privacy Policy',
    'refund_policy': 'Refund Policy',
    'imprint': 'Imprint',
    'footer_copyright': '© 2026 Smart Menu Solutions — Powered by Smart Menu Solutions',
    'index_hero_title': '<span class="accent">SCAN. VIEW. ENJOY.</span> Smart solutions for modern business',
    'index_hero_lede': 'Welcome to Smart Menu Solutions, where we blend digital innovation with modern branding to revolutionise the hospitality industry. Discover how our creative solutions can transform your restaurant or cafe.',
    'index_hero_btn': 'Explore our services',
    'index_transform_title': 'Transform your business <span class="accent">today</span>',
    'index_transform_desc': 'Ready to embrace the future? Our digital menu solutions are designed to be modern, eye-catching, and incredibly easy to use. See how Smart Menu Solutions can bring a fresh, vibrant energy to your establishment and delight your customers.',
    'index_transform_btn': 'Start your order'
  },
  'de': {
    'skip_link': 'Zum Hauptinhalt springen',
    'home': 'Startseite',
    'services': 'Unsere Dienste',
    'pricing': 'Preise',
    'faq': 'FAQ',
    'order': 'Bestellen',
    'contact': 'Kontakt',
    'get_started': 'Loslegen',
    'privacy_policy': 'Datenschutz',
    'refund_policy': 'Rückerstattungsrichtlinie',
    'imprint': 'Impressum',
    'footer_copyright': '© 2026 Smart Menu Solutions — Powered by Smart Menu Solutions',
    'index_hero_title': '<span class="accent">SCANNEN. ANSEHEN. GENIESSEN.</span> Intelligente Lösungen für moderne Unternehmen',
    'index_hero_lede': 'Willkommen bei Smart Menu Solutions, wo wir digitale Innovation mit modernem Branding verbinden, um das Gastgewerbe zu revolutionieren.',
    'index_hero_btn': 'Unsere Dienste erkunden',
    'index_transform_title': 'Verändern Sie Ihr Unternehmen <span class="accent">heute</span>',
    'index_transform_desc': 'Bereit, die Zukunft zu gestalten? Unsere digitalen Menülösungen sind modern, auffallend und unglaublich einfach zu bedienen.',
    'index_transform_btn': 'Bestellung starten'
  }
};

function switchLanguage(lang) {
  localStorage.setItem('selectedLang', lang);
  document.documentElement.lang = lang;
  wirePageTranslations();
  var elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (translations[lang][key].includes('<')) {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
  updateLanguageButtonState(lang);
}

function setupLanguageControls() {
  document.querySelectorAll('[data-lang]').forEach(function (button) {
    button.removeAttribute('onclick');
    button.addEventListener('click', function () {
      switchLanguage(button.getAttribute('data-lang'));
    });
  });
}

function ensureLegalLinks() {
  document.querySelectorAll('.footer-legal').forEach(function (legal) {
    if (!legal.querySelector('a[href="privacy-policy.html"]')) {
      legal.insertAdjacentHTML('beforeend', '<li><a href="privacy-policy.html" data-i18n="privacy_policy">Privacy Policy</a></li>');
    }
    if (!legal.querySelector('a[href="refund-policy.html"]')) {
      legal.insertAdjacentHTML('beforeend', '<li><a href="refund-policy.html" data-i18n="refund_policy">Refund Policy</a></li>');
    }
    if (!legal.querySelector('a[href="imprint.html"]')) {
      legal.insertAdjacentHTML('beforeend', '<li><a href="imprint.html" data-i18n="imprint">Imprint</a></li>');
    }
  });
}

function wirePageTranslations() {
  // Page-specific translations can be added here
}

function updateLanguageButtonState(lang) {
  document.querySelectorAll('[data-lang]').forEach(function (button) {
    button.classList.toggle('active', button.getAttribute('data-lang') === lang);
  });
}