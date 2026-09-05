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

// Erweitertes Wörterbuch für Übersetzungen
var translations = {
  'en': {
    'home': 'Home',
    'services': 'Our Services',
    'pricing': 'Pricing Plans',
    'faq': 'FAQ',
    'order': 'Order',
    'contact': 'Contact',
    'get_started': 'Get started',
    
    // Allgemeine Seiteninhalte & Hero-Bereiche
    'hero_beyond': 'Beyond',
    'choose_plan': 'Choose your plan',
    'plan_subtitle': 'We offer a range of specialised plans tailored to meet your individual needs.',
    
    // Preiskarten-Titel
    'plan_start_title': 'Smart Start',
    'plan_pro_title': 'Smart Pro',
    'plan_premium_title': 'Smart Premium',
    
    // Buttons
    'btn_start': 'Choose Smart Start',
    'btn_pro': 'Choose Smart Pro',
    'btn_premium': 'Choose Smart Premium'
  },
  'de': {
    'home': 'Startseite',
    'services': 'Unsere Leistungen',
    'pricing': 'Preise',
    'faq': 'FAQ',
    'order': 'Bestellen',
    'contact': 'Kontakt',
    'get_started': 'Loslegen',
    
    // Allgemeine Seiteninhalte & Hero-Bereiche
    'hero_beyond': 'Jenseits des',
    'choose_plan': 'Wähle deinen Tarif',
    'plan_subtitle': 'Wir bieten eine Reihe spezialisierter Tarife, die auf deine individuellen Bedürfnisse zugeschnitten sind.',
    
    // Preiskarten-Titel
    'plan_start_title': 'Smart Start',
    'plan_pro_title': 'Smart Pro',
    'plan_premium_title': 'Smart Premium',
    
    // Buttons
    'btn_start': 'Smart Start wählen',
    'btn_pro': 'Smart Pro wählen',
    'btn_premium': 'Smart Premium wählen'
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
  elements.elements = elements || [];
  elements.forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}
