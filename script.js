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

    // --- Pricing Plans Seite ---
    'pricing_page_title': '<span class="accent">Beyond</span> the ordinary',
    'pricing_page_desc': "This is where our journey begins. Get to know our business and what we do, and how we're committed to quality and great service. Join us as we grow and succeed together.",
    'pricing_section_heading': 'Choose your plan',
    'pricing_section_sub': 'We offer a range of specialised plans tailored to meet your individual needs.',
    
    'plan_start_title': 'Smart Start',
    'plan_start_desc': 'Perfect for cafés, food trucks, kiosks, and small businesses getting started with digital menus.',
    'plan_pro_title': 'Smart Pro',
    'plan_pro_desc': 'Ideal for growing restaurants and hospitality businesses that need greater flexibility.',
    'plan_premium_title': 'Smart Premium',
    'plan_premium_desc': 'Designed for busy restaurants, hotel restaurants, chains, and businesses seeking a fully professional solution.',
    
    'vat_incl': ' VAT incl.',
    'badge_popular': 'Most popular',
    
    'feat_qr': 'Digital QR code menu',
    'feat_mobile': 'Mobile-friendly design',
    'feat_unique_qr': 'Unique QR code',
    'feat_start_items': 'Up to 50 menu items',
    'feat_start_updates': '1 monthly menu update',
    'feat_pro_items': 'Up to 150 menu items',
    'feat_pro_updates': '3 monthly menu updates',
    'feat_pro_lang': '1 extra language',
    'feat_premium_items': 'Up to 450 menu items',
    'feat_premium_updates': '6 monthly menu updates',
    'feat_premium_lang': '2 extra languages',
    'feat_billing_year': 'Billing Cycle 1-Year Subscription',

    'btn_choose_start': 'Choose Smart Start',
    'btn_choose_pro': 'Choose Smart Pro',
    'btn_choose_premium': 'Choose Smart Premium',
    'pricing_questions': 'Questions about a plan? Email',

    // --- Our Services Seite ---
    'services_hero_title': '<span class="accent">Beyond</span> the ordinary',
    'services_hero_lede': "Elevate your business with digital menus. Smart Menu Solutions empowers restaurants, cafés, bars and hotels to deliver a cutting-edge menu experience that's quick, convenient, and perpetually updated.",
    'services_section_heading': 'Services',
    'services_section_sub': "Whether you're a restaurant, café, food truck, bar, or takeaway service, Smart Menu Solutions provides an affordable and professional digital menu platform designed to help small businesses grow.",
    'plan_start_name': 'Smart Start',
    'service_card_start_desc': 'Perfect for cafés, food trucks, kiosks, and small businesses getting started with digital menus.',
    'plan_pro_name': 'Smart Pro',
    'service_card_pro_desc': 'Ideal for growing restaurants and hospitality businesses that need greater flexibility.',
    'plan_premium_name': 'Smart Premium',
    'service_card_premium_desc': 'Designed for busy restaurants, hotel restaurants, chains, and businesses seeking a fully professional solution.',
    'contact_us_btn': 'Contact us',
    'testimonials_heading': 'What our customers say',
    'testimonial_1_text': '"Smart Menu Solutions made the transition to a digital menu incredibly easy. Our customers love scanning the QR code, and updating menu items is now quick and hassle-free."',
    'testimonial_1_author': 'Maria K., Restaurant Owner',
    'testimonial_2_text': '"The setup was fast, professional, and exactly what we needed. We no longer worry about printing new menus every time prices or items change."',
    'testimonial_2_author': 'Andreas P., Café Manager',
    'testimonial_3_text': '"The digital menu looks fantastic on mobile phones, and our customers find it very easy to use. Excellent service and support from the team."',
    'testimonial_3_author': 'Elena M., Hotel Food &amp; Beverage Manager',
    'cta_band_title': 'Not sure which plan fits?',
    'cta_band_sub': 'Compare features and pricing side by side.',
    'cta_band_btn': 'View pricing plans',

    // --- Index / Startseite ---
    'index_hero_title': '<span class="accent">SCAN. VIEW. ENJOY.</span> Smart solutions for modern business',
    'index_hero_lede': 'Welcome to Smart Menu Solutions, where we blend digital innovation with modern branding to revolutionise the hospitality industry. Discover how our creative solutions can transform your restaurant or cafe.',
    'index_hero_btn': 'Explore our services',
    'index_transform_title': 'Transform your business <span class="accent">today</span>',
    'index_transform_desc': 'Ready to embrace the future? Our digital menu solutions are designed to be modern, eye-catching, and incredibly easy to use. See how Smart Menu Solutions can bring a fresh, vibrant energy to your establishment and delight your customers.',
    'index_transform_btn': 'Start your order',

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

    // --- Thank You Seite ---
    'thank_title': 'Thank you!',
    'thank_desc': 'Your request has been successfully submitted. We will be in touch shortly.'
  },
  'de': {
    // --- Globale Navigation & Footer ---
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

    // --- Pricing Plans Seite ---
    'pricing_page_title': '<span class="accent">Mehr als</span> gewöhnlich',
    'pricing_page_desc': 'Hier beginnt unsere Reise. Lerne unser Unternehmen kennen, erfahre, was wir tun und wie wir uns für Qualität und hervorragenden Service einsetzen. Begleite uns auf unserem gemeinsamen Weg zum Erfolg.',
    'pricing_section_heading': 'Wähle deinen Tarif',
    'pricing_section_sub': 'Wir bieten eine Reihe spezieller Tarife an, die auf deine individuellen Bedürfnisse zugeschnitten sind.',
    
    'plan_start_title': 'Smart Start',
    'plan_start_desc': 'Perfekt für Cafés, Food Trucks, Kioske und kleine Unternehmen, die mit digitalen Menüs starten.',
    'plan_pro_title': 'Smart Pro',
    'plan_pro_desc': 'Ideal für wachsende Restaurants und Gastronomiebetriebe, die mehr Flexibilität benötigen.',
    'plan_premium_title': 'Smart Premium',
    'plan_premium_desc': 'Entwickelt für viel besuchte Restaurants, Hotelrestaurants, Ketten und Unternehmen mit höchsten Ansprüchen.',
    
    'vat_incl': ' inkl. MwSt.',
    'badge_popular': 'Am beliebtesten',
    
    'feat_qr': 'Digitale QR-Code-Speisekarte',
    'feat_mobile': 'Mobilfreundliches Design',
    'feat_unique_qr': 'Einzigartiger QR-Code',
    'feat_start_items': 'Bis zu 50 Menüpunkte',
    'feat_start_updates': '1 monatliche Menü-Aktualisierung',
    'feat_pro_items': 'Bis zu 150 Menüpunkte',
    'feat_pro_updates': '3 monatliche Menü-Aktualisierungen',
    'feat_pro_lang': '1 zusätzliche Sprache',
    'feat_premium_items': 'Bis zu 450 Menüpunkte',
    'feat_premium_updates': '6 monatliche Menü-Aktualisierungen',
    'feat_premium_lang': '2 zusätzliche Sprachen',
    'feat_billing_year': 'Abrechnungszeitraum: 1-Jahres-Abo',

    'btn_choose_start': 'Smart Start wählen',
    'btn_choose_pro': 'Smart Pro wählen',
    'btn_choose_premium': 'Smart Premium wählen',
    'pricing_questions': 'Fragen zu einem Tarif? Schreibe an',

    // --- Our Services Seite ---
    'services_hero_title': '<span class="accent">Mehr als</span> gewöhnlich',
    'services_hero_lede': 'Bring dein Business mit digitalen Speisekarten auf das nächste Level. Smart Menu Solutions unterstützt Restaurants, Cafés, Bars und Hotels dabei, ein modernes, schnelles, bequemes und stets aktuelles Menü-Erlebnis zu bieten.',
    'services_section_heading': 'Unsere Leistungen',
    'services_section_sub': 'Egal ob Restaurant, Café, Food Truck, Bar oder Imbiss – Smart Menu Solutions bietet eine günstige und professionelle digitale Menü-Plattform, die kleinen Unternehmen beim Wachsen hilft.',
    'plan_start_name': 'Smart Start',
    'service_card_start_desc': 'Perfekt für Cafés, Food Trucks, Kioske und kleine Unternehmen, die mit digitalen Menüs starten.',
    'plan_pro_name': 'Smart Pro',
    'service_card_pro_desc': 'Ideal für wachsende Restaurants und Gastronomiebetriebe, die mehr Flexibilität benötigen.',
    'plan_premium_name': 'Smart Premium',
    'service_card_premium_desc': 'Entwickelt für viel besuchte Restaurants, Hotelrestaurants, Ketten und Unternehmen mit höchsten Ansprüchen.',
    'contact_us_btn': 'Kontaktiere uns',
    'testimonials_heading': 'Was unsere Kunden sagen',
    'testimonial_1_text': '"Smart Menu Solutions hat den Wechsel zu einer digitalen Speisekarte unglaublich einfach gemacht. Unsere Kunden lieben das Scannen des QR-Codes, und das Aktualisieren geht blitzschnell."',
    'testimonial_1_author': 'Maria K., Restaurantbesitzerin',
    'testimonial_2_text': '"Die Einrichtung war schnell, professionell und genau das, was wir brauchten. Wir müssen keine teuren Speisekarten mehr neu drucken, wenn sich Preise oder Gerichte ändern."',
    'testimonial_2_author': 'Andreas P., Café-Manager',
    'testimonial_3_text': '"Die digitale Speisekarte sieht auf dem Handy fantastisch aus, und unsere Gäste finden sie extrem benutzerfreundlich. Hervorragender Service und Support vom Team."',
    'testimonial_3_author': 'Elena M., Hotel Food &amp; Beverage Managerin',
    'cta_band_title': 'Unsicher, welcher Tarif passt?',
    'cta_band_sub': 'Vergleiche Funktionen und Preise direkt miteinander.',
    'cta_band_btn': 'Tarife ansehen',

    // --- Index / Startseite ---
    'index_hero_title': '<span class="accent">SCANNEN. ANSEHEN. GENIESSEN.</span> Intelligente Lösungen für moderne Unternehmen',
    'index_hero_lede': 'Willkommen bei Smart Menu Solutions, wo wir digitale Innovation mit modernem Branding verbinden, um das Gastgewerbe zu revolutionieren. Entdecken Sie, wie unsere kreativen Lösungen Ihr Restaurant oder Café verändern können.',
    'index_hero_btn': 'Unsere Dienste erkunden',
    'index_transform_title': 'Verändern Sie Ihr Unternehmen <span class="accent">heute</span>',
    'index_transform_desc': 'Bereit, die Zukunft zu gestalten? Unsere digitalen Menülösungen sind modern, auffallend und unglaublich einfach zu bedienen. Erfahren Sie, wie Smart Menu Solutions frische, lebendige Energie in Ihren Betrieb bringt und Ihre Gäste begeistert.',
    'index_transform_btn': 'Bestellung starten',

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
      if (translations[lang][key].includes('<')) {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}
