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

// Übersetzungswörterbuch für alle Seiten
var translations = {
  'en': {
    // --- Globale Navigation & Footer ---
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

    // --- Index / Startseite ---
    'index_hero_title': 'Smart menus. Better experiences.',
    'index_hero_desc': 'Transform your restaurant, café or bar with modern digital QR code menus. Fast, elegant and easy to update.',
    'index_hero_btn': 'Explore Plans',

    // --- Our Services Seite ---
    'services_hero_title': 'Our Services',
    'services_hero_desc': 'Discover how we bring your business into the digital age with custom QR menus, branding, and seamless setup.',
    'services_heading': 'What we offer',
    'services_item1_title': 'Digital QR Menus',
    'services_item1_desc': 'Lightning-fast mobile menus accessible instantly via QR code scan.',
    'services_item2_title': 'Custom Branding & Design',
    'services_item2_desc': 'Tailored design matching your restaurant identity and atmosphere.',
    'services_item3_title': 'Ongoing Updates',
    'services_item3_desc': 'Change prices or dishes anytime without reprinting physical cards.',

    // --- Pricing Plans Seite ---
    'pricing_hero_title': 'Pricing Plans',
    'pricing_hero_desc': 'Choose the perfect plan for your business needs with clear, transparent pricing.',
    'pricing_card1_title': 'Basic',
    'pricing_card1_price': '€29 / month',
    'pricing_card1_desc': 'Ideal for small cafes and bistros starting out.',
    'pricing_card2_title': 'Pro',
    'pricing_card2_price': '€59 / month',
    'pricing_card2_desc': 'Perfect for busy restaurants and growing venues.',
    'pricing_card3_title': 'Enterprise',
    'pricing_card3_price': 'Custom',
    'pricing_card3_desc': 'Full custom solutions for chains and large venues.',
    'pricing_cta': 'Choose Plan',

    // --- Order / Order Info / Order Form Seiten ---
    'order_hero_title': 'Place Your Order',
    'order_hero_desc': 'Fill out the details below to kick off your digital menu setup.',
    'order_step1': '1. Choose your plan',
    'order_step2': '2. Enter restaurant info',
    'order_step3': '3. Submit and get ready',

    // --- Contact Seite ---
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
    'contact_tagline': 'Smart menus. Better experiences.',

    // --- FAQ Seite ---
    'faq_hero_desc': "Our journey began with a simple idea: to digitalise restaurants with a modern, eye-catching brand. Here's what people usually ask us before getting started.",
    'faq_q1': 'Do I need technical skills?',
    'faq_a1': 'No. We handle the entire setup for you.',
    'faq_q2': 'How do I get started?',
    'faq_a2': 'Choose a plan, complete your order, and send us your menu and logo.',
    'faq_q3': 'Do customers need an app?',
    'faq_a3': 'No. They simply scan the QR code with their phone camera.',
    'faq_q4': 'Do you provide support?',
    'faq_a4': "Yes. We're here to help whenever you need assistance.",
    'faq_q5': 'Can I update my menu later?',
    'faq_a5': 'Yes. Menu updates are available based on your plan.',
    'faq_q6': 'Can I upgrade my plan?',
    'faq_a6': 'Yes. You can upgrade at any time as your business grows.',
    'faq_q7': 'What happens after I submit my order request?',
    'faq_a7': "We'll review your details and menu, then contact you directly to confirm the next steps.",
    'faq_beyond_accent': 'Beyond',
    'faq_beyond_title': 'the ordinary',
    'faq_beyond_desc': "Get to know our business and how we're committed to quality and great service. We're glad you're here to be part of our story.",
    'faq_beyond_btn': "Let's get started",

    // --- Thank You Seite ---
    'thank_title': 'Thank you!',
    'thank_desc': 'Your request has been successfully submitted. We will be in touch shortly.'
  },
  'de': {
    // --- Globale Navigation & Footer ---
    'home': 'Home',
    'services': 'Leistungen',
    'pricing': 'Preise',
    'faq': 'FAQ',
    'order': 'Bestellen',
    'contact': 'Kontakt',
    'get_started': 'Loslegen',
    'privacy_policy': 'Datenschutz',
    'refund_policy': 'Widerrufsbelehrung',
    'imprint': 'Impressum',

    // --- Index / Startseite ---
    'index_hero_title': 'Smarte Menüs. Bessere Erlebnisse.',
    'index_hero_desc': 'Transformiere dein Restaurant, Café oder deine Bar mit modernen digitalen QR-Code-Menüs. Schnell, elegant und einfach zu aktualisieren.',
    'index_hero_btn': 'Pläne ansehen',

    // --- Our Services Seite ---
    'services_hero_title': 'Unsere Leistungen',
    'services_hero_desc': 'Entdecke, wie wir dein Business mit maßgeschneiderten QR-Menüs, Branding und nahtloser Einrichtung ins digitale Zeitalter bringen.',
    'services_heading': 'Was wir anbieten',
    'services_item1_title': 'Digitale QR-Menüs',
    'services_item1_desc': 'Blitzschnelle mobile Menüs, die sofort per QR-Code-Scan erreichbar sind.',
    'services_item2_title': 'Individuelles Branding & Design',
    'services_item2_desc': 'Maßgeschneidertes Design passend zur Identität und Atmosphäre deines Restaurants.',
    'services_item3_title': 'Laufende Aktualisierungen',
    'services_item3_desc': 'Ändere Preise oder Gerichte jederzeit, ohne physische Karten neu drucken zu müssen.',

    // --- Pricing Plans Seite ---
    'pricing_hero_title': 'Preise & Tarife',
    'pricing_hero_desc': 'Wähle den perfekten Plan für deine geschäftlichen Anforderungen mit klarer, transparenter Preisgestaltung.',
    'pricing_card1_title': 'Basic',
    'pricing_card1_price': '€29 / Monat',
    'pricing_card1_desc': 'Ideal für kleine Cafés und Bistros am Anfang.',
    'pricing_card2_title': 'Pro',
    'pricing_card2_price': '€59 / Monat',
    'pricing_card2_desc': 'Perfekt für belebte Restaurants und wachsende Betriebe.',
    'pricing_card3_title': 'Enterprise',
    'pricing_card3_price': 'Individuell',
    'pricing_card3_desc': 'Vollständige Individuallösungen für Ketten und große Standorte.',
    'pricing_cta': 'Plan wählen',

    // --- Order / Order Info / Order Form Seiten ---
    'order_hero_title': 'Bestellung aufgeben',
    'order_hero_desc': 'Fülle die folgenden Details aus, um deine digitale Menü-Einrichtung zu starten.',
    'order_step1': '1. Wähle deinen Plan',
    'order_step2': '2. Restaurant-Infos eingeben',
    'order_step3': '3. Absenden und bereit machen',

    // --- Contact Seite ---
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
    'contact_tagline': 'Smart menus. Better experiences.',

    // --- FAQ Seite ---
    'faq_hero_desc': 'Unsere Reise begann mit einer einfachen Idee: Restaurants mit einer modernen, auffälligen Marke zu digitalisieren. Hier sind die häufigsten Fragen, die uns vor dem Start gestellt werden.',
    'faq_q1': 'Brauche ich technische Vorkenntnisse?',
    'faq_a1': 'Nein. Wir übernehmen die komplette Einrichtung für dich.',
    'faq_q2': 'Wie fange ich an?',
    'faq_a2': 'Wähle einen Plan, schließe deine Bestellung ab und sende uns deine Speisekarte und dein Logo.',
    'faq_q3': 'Müssen Kunden eine App herunterladen?',
    'faq_a3': 'Nein. Sie scannen einfach den QR-Code mit ihrer Smartphone-Kamera.',
    'faq_q4': 'Bietet ihr Support an?',
    'faq_a4': 'Ja. Wir sind immer für dich da, wenn du Unterstützung brauchst.',
    'faq_q5': 'Kann ich meine Speisekarte später aktualisieren?',
    'faq_a5': 'Ja. Menü-Updates sind je nach deinem gewählten Plan verfügbar.',
    'faq_q6': 'Kann ich meinen Plan upgraden?',
    'faq_a6': 'Ja. Du kannst jederzeit upgraden, wenn dein Business wächst.',
    'faq_q7': 'Was passiert, nachdem ich meine Bestellung abgeschickt habe?',
    'faq_a7': 'Wir prüfen deine Daten und Speisekarte und kontaktieren dich direkt, um die nächsten Schritte zu besprechen.',
    'faq_beyond_accent': 'Mehr als',
    'faq_beyond_title': 'gewöhnlich',
    'faq_beyond_desc': 'Lerne unser Unternehmen kennen und erfahre, wie wir uns für Qualität und hervorragenden Service einsetzen. Schön, dass du ein Teil unserer Geschichte bist.',
    'faq_beyond_btn': 'Jetzt loslegen',

    // --- Thank You Seite ---
    'thank_title': 'Vielen Dank!',
    'thank_desc': 'Deine Anfrage wurde erfolgreich übermittelt. Wir werden uns in Kürze bei dir melden.'
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
