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

  // Sprache beim Laden wiederherstellen
  var savedLang = localStorage.getItem('selectedLang') || 'en';
  switchLanguage(savedLang);
});

// Übersetzungswörterbuch
var translations = {
  'en': {
    'home': 'Home',
    'services': 'Our Services',
    'pricing': 'Pricing Plans',
    'faq': 'FAQ',
    'order': 'Order',
    'contact': 'Contact',
    'get_started': 'Get started',
    'contact_hero_title': 'Get in touch to start your digital menu journey',
    'contact_hero_desc': "Whether you're ready to launch your first digital menu or want to learn more about our solutions, we're here to help. Contact Smart Menu Solutions today and discover how simple and affordable it is to modernise your restaurant, café, bar, or food business.",
    'contact_form_heading': 'Contact us today',
    'form_name': 'Name *',
    'form_email': 'Email address *',
    'form_message': 'Message *',
    'form_submit': 'Submit form',
    'form_hint': "Complete the form and we'll get back to you as soon as possible.",
    'contact_next_heading': 'What happens next?',
    'contact_next_text1': "We'll contact you within 24 hours to discuss your requirements, answer any questions, and recommend the best digital menu solution for your business. Once approved, we'll create and set up your digital menu, generate your QR code, and have everything ready for your customers as quickly as possible.",
    'contact_next_text2': "Let's create a smarter dining experience for your customers.",
    'contact_tagline': 'Smart menus. Better experiences.'
  },
  'de': {
    'home': 'Home',
    'services': 'Leistungen',
    'pricing': 'Preise',
    'faq': 'FAQ',
    'order': 'Bestellen',
    'contact': 'Kontakt',
    'get_started': 'Loslegen',
    'contact_hero_title': 'Kontaktiere uns und starte deine Reise zur digitalen Speisekarte',
    'contact_hero_desc': 'Egal, ob du bereit bist, deine erste digitale Speisekarte einzuführen oder mehr über unsere Lösungen erfahren möchtest – wir sind für dich da. Kontaktiere Smart Menu Solutions noch heute und entdecke, wie einfach und günstig es ist, dein Restaurant, Café, deine Bar oder dein Gastro-Business zu modernisieren.',
    'contact_form_heading': 'Kontaktiere uns heute',
    'form_name': 'Name *',
    'form_email': 'E-Mail-Adresse *',
    'form_message': 'Nachricht *',
    'form_submit': 'Formular absenden',
    'form_hint': 'Fülle das Formular aus und wir melden uns schnellstmöglich bei dir.',
    'contact_next_heading': 'Wie geht es weiter?',
    'contact_next_text1': 'Wir melden uns innerhalb von 24 Stunden bei dir, um deine Anforderungen zu besprechen, Fragen zu beantworten und die beste digitale Menü-Lösung zu empfehlen. Nach Freigabe erstellen wir deine Speisekarte, generieren den QR-Code und machen alles so schnell wie möglich bereit.',
    'contact_next_text2': 'Lass uns ein smarteres Esserlebnis für deine Gäste schaffen.',
    'contact_tagline': 'Smart menus. Better experiences.'
  }
};

function switchLanguage(lang) {
  localStorage.setItem('selectedLang', lang);
  var elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}
