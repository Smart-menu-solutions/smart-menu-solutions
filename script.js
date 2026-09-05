console.log("SCRIPT GELADEN");

document.addEventListener('DOMContentLoaded', function () {
  // Mobile Navigation Toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

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

  // Beim Laden gespeicherte Sprache wiederherstellen (falls vorhanden)
  var savedLang = localStorage.getItem('selectedLang') || 'en';
  setLanguage(savedLang);
});

// Wörterbuch für Übersetzungen
var translations = {
  'en': {
    'home': 'Home',
    'services': 'Our Services',
    'pricing': 'Pricing Plans',
    'faq': 'FAQ',
    'order': 'Order',
    'contact': 'Contact',
    'get_started': 'Get started'
  },
  'de': {
    'home': 'Startseite',
    'services': 'Unsere Leistungen',
    'pricing': 'Preise',
    'faq': 'FAQ',
    'order': 'Bestellen',
    'contact': 'Kontakt',
    'get_started': 'Loslegen'
  }
};

// Hauptfunktion zum Sprachwechsel
function switchLanguage(lang) {
  setLanguage(lang);
  localStorage.setItem('selectedLang', lang); // Sprache für andere Seiten merken
}

function setLanguage(lang) {
  console.log("Sprache aktiv: " + lang);
  document.documentElement.setAttribute('lang', lang);

  // Wir suchen nach Elementen mit dem Attribut data-i18n und übersetzen sie
  var elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}
