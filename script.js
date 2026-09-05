document.addEventListener('DOMContentLoaded', function () {
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

  // Sprache beim Laden der Seite wiederherstellen
  var savedLang = localStorage.getItem('selectedLang') || 'en';
  switchLanguage(savedLang);
});

// Zentrales Übersetzungswörterbuch für die gesamte Website
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

    // --- Index / Startseite ---
    'index_hero_title': '<span class="accent">SCAN. VIEW. ENJOY.</span> Smart solutions for modern business',
    'index_hero_lede': 'Welcome to Smart Menu Solutions, where we blend digital innovation with modern branding to revolutionise the hospitality industry. Discover how our creative solutions can transform your restaurant or cafe.',
    'index_hero_btn': 'Explore our services',
    'index_transform_title': 'Transform your business <span class="accent">today</span>',
    'index_transform_desc': 'Ready to embrace the future? Our digital menu solutions are designed to be modern, eye-catching, and incredibly easy to use. See how Smart Menu Solutions can bring a fresh, vibrant energy to your establishment and delight your customers.',
    'index_transform_btn': 'Start your order',

    // --- Our Services Seite ---
    'services_hero_title': '<span class="accent">Beyond</span> the ordinary',
    'services_hero_lede': "Elevate your business with digital menus. Smart Menu Solutions empowers restaurants, cafés, bars and hotels to deliver a cutting-edge menu experience that's quick, convenient, and perpetually updated.",
    'services_section_heading': 'Services',
    'services_section_sub': "Whether you're a restaurant, café, food truck, bar, or takeaway service, Smart Menu Solutions provides an affordable and professional digital menu platform designed to help small businesses grow.",
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

    // --- FAQ Seite ---
    'faq_hero_title': '<span class="accent">FAQ</span>',
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

    // --- Order Seite ---
    'order_overview_title': 'Your order at a glance',
    'order_overview_desc': 'Follow these simple steps to get your modern, digital menu up and running.',
    'order_steps_heading': 'How to order your <span class="accent">digital menu</span>',
    'order_steps_sub': "We've made the process simple, affordable, and completely hassle-free. Get started in minutes.",
    'step1_title': 'Choose your plan',
    'step1_desc': 'Select the package that best fits your business: Smart Start, Smart Pro, or Smart Premium.',
    'step2_title': 'Complete your details',
    'step2_desc': 'Enter your first name, last name, and email address.',
    'step3_title': 'Submit your request',
    'step3_desc': 'Send us your details and menu securely through the order form.',
    'step4_title': 'We review your menu',
    'step4_desc': "We'll review your uploaded menu and contact you if we need your logo or any additional branding details.",
    'step5_title': 'We build your digital menu',
    'step5_desc': 'Our team creates your professional QR code menu tailored to your business.',
    'step6_title': 'Receive your QR code',
    'step6_desc': "We'll send you your unique QR code and digital menu link.",
    'step7_title': 'Go live',
    'step7_desc': 'Display your QR code on tables, counters, menus, flyers, or takeaway packaging and start serving customers instantly.',
    'order_cta_btn': 'Start your order',

    // --- Contact Seite ---
    'contact_hero_title': 'Get in touch to start your digital menu journey',
    'contact_hero_desc': "Whether you're ready to launch your first digital menu or want to learn more about our solutions, we're here to help."
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

    // --- Index / Startseite ---
    'index_hero_title': '<span class="accent">SCANNEN. ANSEHEN. GENIESSEN.</span> Intelligente Lösungen für moderne Unternehmen',
    'index_hero_lede': 'Willkommen bei Smart Menu Solutions, wo wir digitale Innovation mit modernem Branding verbinden, um das Gastgewerbe zu revolutionieren.',
    'index_hero_btn': 'Unsere Dienste erkunden',
    'index_transform_title': 'Verändern Sie Ihr Unternehmen <span class="accent">heute</span>',
    'index_transform_desc': 'Bereit, die Zukunft zu gestalten? Unsere digitalen Menülösungen sind modern, auffallend und unglaublich einfach zu bedienen.',
    'index_transform_btn': 'Bestellung starten',

    // --- Our Services Seite ---
    'services_hero_title': '<span class="accent">Mehr als</span> gewöhnlich',
    'services_hero_lede': 'Bring dein Business mit digitalen Speisekarten auf das nächste Level. Smart Menu Solutions unterstützt Restaurants, Cafés, Bars und Hotels dabei, ein modernes, schnelles, bequemes und stets aktuelles Menü-Erlebnis zu bieten.',
    'services_section_heading': 'Unsere Leistungen',
    'services_section_sub': 'Egal ob Restaurant, Café, Food Truck, Bar oder Imbiss – Smart Menu Solutions bietet eine günstige und professionelle digitale Menü-Plattform, die kleinen Unternehmen beim Wachsen hilft.',
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

    // --- Pricing Plans Seite ---
    'pricing_page_title': '<span class="accent">Mehr als</span> gewöhnlich',
    'pricing_page_desc': 'Hier beginnt unsere Reise. Lerne unser Unternehmen kennen, erfahre, was wir tun und wie wir uns für Qualität und hervorragenden Service einsetzen.',
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

    // --- FAQ Seite ---
    'faq_hero_title': '<span class="accent">FAQ</span>',
    'faq_hero_desc': 'Unsere Reise begann mit einer einfachen Idee: Restaurants mit einer modernen, auffälligen Marke zu digitalisieren. Hier ist, was uns Kunden meistens fragen, bevor sie starten.',
    'faq_q1': 'Brauche ich technische Vorkenntnisse?',
    'faq_a1': 'Nein. Wir übernehmen die komplette Einrichtung für dich.',
    'faq_q2': 'Wie fange ich an?',
    'faq_a2': 'Wähle einen Tarif, schließe deine Bestellung ab und schicke uns deine Speisekarte sowie dein Logo.',
    'faq_q3': 'Müssen Kunden eine App herunterladen?',
    'faq_a3': 'Nein. Sie scannen einfach den QR-Code mit ihrer Smartphone-Kamera.',
    'faq_q4': 'Bietet ihr Support an?',
    'faq_a4': 'Ja. Wir sind immer für dich da, wenn du Hilfe brauchst.',
    'faq_q5': 'Kann ich meine Speisekarte später aktualisieren?',
    'faq_a5': 'Ja. Menü-Updates sind je nach gewähltem Tarif inklusive.',
    'faq_q6': 'Kann ich meinen Tarif upgraden?',
    'faq_a6': 'Ja. Du kannst jederzeit upgraden, wenn dein Geschäft wächst.',
    'faq_q7': 'Was passiert, nachdem ich meine Bestellung abgeschickt habe?',
    'faq_a7': 'Wir prüfen deine Details und Speisekarte und kontaktieren dich direkt, um die nächsten Schritte zu besprechen.',
    'faq_beyond_accent': 'Mehr als',
    'faq_beyond_title': 'gewöhnlich',
    'faq_beyond_desc': 'Lerne unser Unternehmen kennen und erfahre, wie wir uns für Qualität und exzellenten Service einsetzen.',
    'faq_beyond_btn': 'Jetzt starten',

    // --- Order Seite ---
    'order_overview_title': 'Deine Bestellung auf einen Blick',
    'order_overview_desc': 'Folge diesen einfachen Schritten, um deine moderne digitale Speisekarte einzurichten.',
    'order_steps_heading': 'So bestellst du dein <span class="accent">digitales Menü</span>',
    'order_steps_sub': 'Wir haben den Prozess einfach, günstig und völlig unkompliziert gestaltet. Starte in wenigen Minuten.',
    'step1_title': 'Wähle deinen Tarif',
    'step1_desc': 'Wähle das Paket, das am besten zu deinem Betrieb passt: Smart Start, Smart Pro oder Smart Premium.',
    'step2_title': 'Gib deine Daten ein',
    'step2_desc': 'Trage deinen Vornamen, Nachnamen und deine E-Mail-Adresse ein.',
    'step3_title': 'Anfrage absenden',
    'step3_desc': 'Sende uns deine Details und Speisekarte sicher über das Bestellformular.',
    'step4_title': 'Wir prüfen deine Speisekarte',
    'step4_desc': 'Wir prüfen deine hochgeladene Speisekarte und melden uns, falls wir dein Logo oder weitere Branding-Details benötigen.',
    'step5_title': 'Wir erstellen deine digitale Speisekarte',
    'step5_desc': 'Unser Team erstellt deine professionelle QR-Code-Speisekarte, maßgeschneidert für dein Unternehmen.',
    'step6_title': 'Erhalte deinen QR-Code',
    'step6_desc': 'Wir senden dir deinen einzigartigen QR-Code und den Link zu deiner digitalen Speisekarte.',
    'step7_title': 'Live gehen',
    'step7_desc': 'Platziere deinen QR-Code auf Tischen, Theken, Karten, Flyern oder Verpackungen und bediene Gäste sofort.',
    'order_cta_btn': 'Bestellung starten',

    // --- Contact Seite ---
    'contact_hero_title': 'Kontaktiere uns und starte deine Reise zur digitalen Speisekarte',
    'contact_hero_desc': 'Egal, ob du bereit bist, deine erste digitale Speisekarte einzuführen oder mehr über unsere Lösungen erfahren möchtest – wir sind für dich da.'
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
