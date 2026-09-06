document.addEventListener('DOMContentLoaded', function () {
  setupLanguageControls();
  ensureLegalLinks();
  document.querySelectorAll('form[action*="formsubmit.co"]').forEach(function (form) {
    var nextField = form.querySelector('input[name="_next"]');
    if (nextField) nextField.value = new URL('thank-you.html', window.location.href).href;
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
    'plan_start_name': 'Smart Start',
    'service_card_start_desc': 'Perfect for cafés, food trucks, kiosks, and small businesses getting started with digital menus.',
    'plan_pro_name': 'Smart Pro',
    'service_card_pro_desc': 'Ideal for growing restaurants and hospitality businesses that need greater flexibility.',
    'plan_premium_name': 'Smart Premium',
    'service_card_premium_desc': 'Designed for busy restaurants, hotel restaurants, chains, and businesses seeking a fully professional solution.',
    'testimonials_heading': 'What our customers say',
    'testimonial_1_text': '"Smart Menu Solutions made the transition to a digital menu incredibly easy. Our customers love scanning the QR code, and updating menu items is now quick and hassle-free."',
    'testimonial_1_author': 'Maria K., Restaurant Owner',
    'testimonial_2_text': '"The setup was fast, professional, and exactly what we needed. We no longer worry about printing new menus every time prices or items change."',
    'testimonial_2_author': 'Andreas P., Café Manager',
    'testimonial_3_text': '"The digital menu looks fantastic on mobile phones, and our customers find it very easy to use. Excellent service and support from the team."',
    'testimonial_3_author': 'Elena M., Hotel Food &amp; Beverage Manager',
    'testimonial_4_text': '"Our menu now looks much more professional, and guests can find what they want without waiting for staff."',
    'testimonial_4_author': 'Nikos T., Bistro Owner',
    'testimonial_5_text': '"The QR menu works beautifully on every phone. It has made seasonal updates much easier for our team."',
    'testimonial_5_author': 'Sofia L., Café Owner',
    'testimonial_6_text': '"Clear communication, quick setup, and a polished result. We are very happy with our new digital menu."',
    'testimonial_6_author': 'Michael R., Hotel Manager',
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
    
    'vat_incl': 'VAT incl.',
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

    // --- Order / Order Info Seite ---
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

    // order-info.html spezifische Übersetzungen
    'order_info_hero_title': 'Start your <span class="accent">order</span>',
    'order_info_hero_desc': 'Fill in your details, choose a plan, and upload your menu — we\'ll take it from there.',
    'form_main_title': 'Start your order',
    'step_contact_label': '01 / CONTACT INFORMATION',
    'step_plan_label': '02 / SELECT YOUR PLAN',
    'step_upload_label': '03 / UPLOAD YOUR MENU',
    'label_firstname': 'First name',
    'placeholder_firstname': 'First name',
    'label_lastname': 'Last name',
    'placeholder_lastname': 'Last name',
    'label_email': 'Email address',
    'placeholder_email': 'you@business.com',
    'label_upload_title': 'Upload your menu PDF',
    'label_upload_sub': 'Click here or drag a PDF file to upload',
    'submit_order_btn': 'Submit order request',
    'summary_header': 'ORDER SUMMARY',
    'summary_updates_label': 'Menu updates',
    'total_due': 'TOTAL DUE',
    'included': 'Included',
    'what_happens_next': 'What happens next?',
    'what_happens_next_desc': 'Submit your order request and we\'ll contact you with the next steps.',

    // --- Contact Seite ---
    'contact_hero_title': 'Get in touch to start your digital menu journey',
    'contact_hero_desc': "Whether you're ready to launch your first digital menu or want to learn more about our solutions, we're here to help.",
    'contact_section_heading': 'Contact us today',
    'contact_label_company': 'Company',
    'contact_label_name': 'Name *',
    'contact_label_email': 'Email address *',
    'contact_label_message': 'Message *',
    'contact_submit': 'Submit form',
    'contact_hint': "Complete the form and we'll get back to you as soon as possible.",
    'contact_next_heading': 'What happens next?',
    'contact_next_desc': "We'll contact you within 24 hours to discuss your requirements, answer any questions, and recommend the best digital menu solution for your business. Once approved, we'll create and set up your digital menu, generate your QR code, and have everything ready for your customers as quickly as possible.",
    'contact_next_intro': "Let's create a smarter dining experience for your customers."
    ,
    'refund_hero_title': 'Refund <span class="accent">Policy</span>',
    'refund_hero_desc': 'Please read our refund policy carefully before placing an order.',
    'refund_updated': 'Last updated: September 2026',
    'refund_intro_1': 'At', 'refund_intro_2': 'customer satisfaction is important to us. Please read our refund policy carefully before placing an order.',
    'refund_h2_digital': 'Digital Services and Custom Work', 'refund_p_digital': 'Our products and services are customized digital solutions. Because work begins immediately after an order is confirmed, refunds are handled as follows:',
    'refund_li_before_title': 'Before work has started:', 'refund_li_before_desc': 'Customers may request a full refund within 24 hours of placing an order if no work has been started.', 'refund_li_after_title': 'After work has started:', 'refund_li_after_desc': 'Once design, development, setup, or customization work has begun, refunds are not available for completed work or work already in progress.',
    'refund_qr_note_title': 'Important Note for Digital QR Menus:', 'refund_qr_note_desc': 'Due to the custom and digital nature of our services, refunds cannot be provided once design or development work has commenced.', 'refund_h2_completed': 'Completed Projects', 'refund_p_completed': 'Refunds are not provided for completed digital menu projects that have been delivered to the customer.', 'refund_h2_tech': 'Technical Issues', 'refund_p_tech': 'If a technical issue caused by Smart Menu Solutions prevents the service from functioning as agreed, we will make reasonable efforts to resolve the issue. If the issue cannot be resolved, a partial or full refund may be offered at our discretion.', 'refund_h2_sub': 'Subscription Services (if applicable)', 'refund_p_sub': 'For recurring services, customers may cancel at any time. Cancellation will prevent future billing, but payments already made are generally non-refundable.', 'refund_h2_contact': 'Contact', 'refund_p_contact': 'For refund requests or questions, please contact us at:',
    'imprint_main_title': 'Imprint <span class="accent">Legal Notice</span>', 'imprint_hero_desc': 'Business information and legal contact details.', 'imprint_effective_date': 'Effective date: 1 September 2026', 'imprint_business_info': 'Business Information', 'imprint_business_name_label': 'Business Name:', 'imprint_owner_label': 'Owner:', 'imprint_location_label': 'Location:', 'imprint_location_value': 'Rhodes, Greece', 'imprint_email_label': 'Email:', 'imprint_disclaimer_heading': 'Disclaimer', 'imprint_disclaimer_text': 'The information provided on this website is for general informational purposes only. Smart Menu Solutions makes every effort to keep the information on this website accurate and up to date. However, no guarantees are made regarding completeness, reliability, or accuracy.', 'imprint_external_heading': 'External Links', 'imprint_external_text': 'This website may contain links to external websites. Smart Menu Solutions is not responsible for the content, privacy practices, or availability of third-party websites.', 'imprint_copyright_heading': 'Copyright Notice', 'imprint_copyright_text1': 'All content on this website, including text, graphics, logos, images, and design elements, is the property of Smart Menu Solutions unless otherwise stated.', 'imprint_copyright_text2': 'Reproduction or redistribution of website content without prior written permission is prohibited.', 'imprint_contact_heading': 'Contact', 'imprint_contact_text': 'If you have any legal or business-related questions, please contact:'
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
    'plan_start_name': 'Smart Start',
    'service_card_start_desc': 'Perfekt für Cafés, Food Trucks, Kioske und kleine Unternehmen, die mit digitalen Menüs starten.',
    'plan_pro_name': 'Smart Pro',
    'service_card_pro_desc': 'Ideal für wachsende Restaurants und Gastronomiebetriebe, die mehr Flexibilität benötigen.',
    'plan_premium_name': 'Smart Premium',
    'service_card_premium_desc': 'Entwickelt für viel besuchte Restaurants, Hotelrestaurants, Ketten und Unternehmen mit höchsten Ansprüchen.',
    'testimonials_heading': 'Was unsere Kunden sagen',
    'testimonial_1_text': '"Smart Menu Solutions hat den Wechsel zu einer digitalen Speisekarte unglaublich einfach gemacht. Unsere Kunden lieben das Scannen des QR-Codes, und das Aktualisieren geht blitzschnell."',
    'testimonial_1_author': 'Maria K., Restaurantbesitzerin',
    'testimonial_2_text': '"Die Einrichtung war schnell, professionell und genau das, was wir brauchten. Wir müssen keine teuren Speisekarten mehr neu drucken, wenn sich Preise oder Gerichte ändern."',
    'testimonial_2_author': 'Andreas P., Café-Manager',
    'testimonial_3_text': '"Die digitale Speisekarte sieht auf dem Handy fantastisch aus, und unsere Gäste finden sie extrem benutzerfreundlich. Hervorragender Service und Support vom Team."',
    'testimonial_3_author': 'Elena M., Hotel Food &amp; Beverage Managerin',
    'testimonial_4_text': '"Unser Menü sieht jetzt deutlich professioneller aus, und Gäste finden schneller, was sie suchen."',
    'testimonial_4_author': 'Nikos T., Bistro-Inhaber',
    'testimonial_5_text': '"Das QR-Menü funktioniert auf jedem Smartphone hervorragend. Saisonale Änderungen sind für unser Team viel einfacher geworden."',
    'testimonial_5_author': 'Sofia L., Café-Inhaberin',
    'testimonial_6_text': '"Klare Kommunikation, schnelle Einrichtung und ein professionelles Ergebnis. Wir sind mit unserem digitalen Menü sehr zufrieden."',
    'testimonial_6_author': 'Michael R., Hotelmanager',
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
    
    'vat_incl': 'inkl. MwSt.',
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
    'feat_premium_lang': '2 zusätzliche Sprache',
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

    // --- Order / Order Info Seite ---
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

    // order-info.html spezifische Übersetzungen
    'order_info_hero_title': 'Starten Sie Ihre <span class="accent">Bestellung</span>',
    'order_info_hero_desc': 'Geben Sie Ihre Daten ein, wählen Sie einen Tarif und laden Sie Ihre Speisekarte hoch – wir kümmern uns um den Rest.',
    'form_main_title': 'Bestellvorgang starten',
    'step_contact_label': '01 / KONTAKTINFORMATIONEN',
    'step_plan_label': '02 / TARIF AUSWÄHLEN',
    'step_upload_label': '03 / SPEISEKARTE HOCHLADEN',
    'label_firstname': 'Vorname',
    'placeholder_firstname': 'Vorname',
    'label_lastname': 'Nachname',
    'placeholder_lastname': 'Nachname',
    'label_email': 'E-Mail-Adresse',
    'placeholder_email': 'ihre@firma.de',
    'label_upload_title': 'Menü-PDF hochladen',
    'label_upload_sub': 'Hier klicken oder PDF-Datei hierher ziehen',
    'submit_order_btn': 'Bestellantrag absenden',
    'summary_header': 'BESTELLÜBERSICHT',
    'summary_updates_label': 'Menü-Aktualisierungen',
    'total_due': 'GESAMTBETRAG',
    'included': 'Inklusive',
    'what_happens_next': 'Was passiert als Nächstes?',
    'what_happens_next_desc': 'Senden Sie Ihre Bestellanfrage ab und wir kontaktieren Sie mit den nächsten Schritten.',

    // --- Contact Seite ---
    'contact_hero_title': 'Kontaktiere uns und starte deine Reise zur digitalen Speisekarte',
    'contact_hero_desc': 'Egal, ob du bereit bist, deine erste digitale Speisekarte einzuführen oder mehr über unsere Lösungen erfahren möchtest – wir sind für dich da.',
    'contact_section_heading': 'Kontaktiere uns heute',
    'contact_label_company': 'Unternehmen',
    'contact_label_name': 'Name *',
    'contact_label_email': 'E-Mail-Adresse *',
    'contact_label_message': 'Nachricht *',
    'contact_submit': 'Formular absenden',
    'contact_hint': 'Fülle das Formular aus und wir melden uns so schnell wie möglich bei dir.',
    'contact_next_heading': 'Wie geht es weiter?',
    'contact_next_desc': 'Wir melden uns innerhalb von 24 Stunden, besprechen deine Anforderungen, beantworten deine Fragen und empfehlen die passende digitale Menülösung für dein Unternehmen. Nach deiner Freigabe erstellen und richten wir dein digitales Menü ein, generieren deinen QR-Code und machen alles schnell für deine Gäste bereit.',
    'contact_next_intro': 'Lass uns gemeinsam ein smarteres Restauranterlebnis schaffen.'
    ,
    'refund_hero_title': 'Rückerstattungsrichtlinie', 'refund_hero_desc': 'Bitte lies unsere Rückerstattungsrichtlinie sorgfältig, bevor du eine Bestellung aufgibst.', 'refund_updated': 'Zuletzt aktualisiert: September 2026', 'refund_intro_1': 'Bei', 'refund_intro_2': 'ist die Kundenzufriedenheit wichtig. Bitte lies unsere Rückerstattungsrichtlinie sorgfältig, bevor du eine Bestellung aufgibst.', 'refund_h2_digital': 'Digitale Dienstleistungen und individuelle Arbeiten', 'refund_p_digital': 'Unsere Produkte und Dienstleistungen sind individuell erstellte digitale Lösungen. Da die Arbeit unmittelbar nach Bestätigung einer Bestellung beginnt, gelten folgende Rückerstattungsregeln:', 'refund_li_before_title': 'Bevor die Arbeit begonnen hat:', 'refund_li_before_desc': 'Kunden können innerhalb von 24 Stunden nach der Bestellung eine vollständige Rückerstattung anfordern, sofern noch keine Arbeit begonnen hat.', 'refund_li_after_title': 'Nachdem die Arbeit begonnen hat:', 'refund_li_after_desc': 'Sobald Design, Entwicklung, Einrichtung oder Anpassung begonnen haben, sind Rückerstattungen für abgeschlossene oder bereits laufende Arbeiten nicht möglich.', 'refund_qr_note_title': 'Wichtiger Hinweis zu digitalen QR-Menüs:', 'refund_qr_note_desc': 'Aufgrund der individuellen und digitalen Art unserer Dienstleistungen sind Rückerstattungen nach Beginn der Design- oder Entwicklungsarbeiten nicht möglich.', 'refund_h2_completed': 'Abgeschlossene Projekte', 'refund_p_completed': 'Für abgeschlossene digitale Menüprojekte, die dem Kunden übergeben wurden, werden keine Rückerstattungen gewährt.', 'refund_h2_tech': 'Technische Probleme', 'refund_p_tech': 'Wenn ein von Smart Menu Solutions verursachtes technisches Problem die vereinbarte Funktion verhindert, bemühen wir uns angemessen um eine Lösung. Kann das Problem nicht behoben werden, kann nach unserem Ermessen eine teilweise oder vollständige Rückerstattung angeboten werden.', 'refund_h2_sub': 'Abonnementdienste (falls zutreffend)', 'refund_p_sub': 'Bei wiederkehrenden Dienstleistungen können Kunden jederzeit kündigen. Die Kündigung verhindert zukünftige Abrechnungen, bereits geleistete Zahlungen sind jedoch grundsätzlich nicht erstattungsfähig.', 'refund_h2_contact': 'Kontakt', 'refund_p_contact': 'Für Rückerstattungsanfragen oder Fragen kontaktiere uns bitte unter:', 'imprint_main_title': 'Impressum <span class="accent">Rechtliche Hinweise</span>', 'imprint_hero_desc': 'Geschäftsinformationen und rechtliche Kontaktdaten.', 'imprint_effective_date': 'Gültig ab: 1. September 2026', 'imprint_business_info': 'Geschäftsinformationen', 'imprint_business_name_label': 'Firmenname:', 'imprint_owner_label': 'Inhaber:', 'imprint_location_label': 'Standort:', 'imprint_location_value': 'Rhodos, Griechenland', 'imprint_email_label': 'E-Mail:', 'imprint_disclaimer_heading': 'Haftungsausschluss', 'imprint_disclaimer_text': 'Die Informationen auf dieser Website dienen ausschließlich allgemeinen Informationszwecken. Smart Menu Solutions bemüht sich, die Informationen aktuell und korrekt zu halten. Für Vollständigkeit, Zuverlässigkeit oder Richtigkeit wird jedoch keine Garantie übernommen.', 'imprint_external_heading': 'Externe Links', 'imprint_external_text': 'Diese Website kann Links zu externen Websites enthalten. Smart Menu Solutions ist nicht für deren Inhalte, Datenschutzpraktiken oder Verfügbarkeit verantwortlich.', 'imprint_copyright_heading': 'Urheberrechtshinweis', 'imprint_copyright_text1': 'Alle Inhalte dieser Website, einschließlich Texte, Grafiken, Logos, Bilder und Designelemente, sind, sofern nicht anders angegeben, Eigentum von Smart Menu Solutions.', 'imprint_copyright_text2': 'Die Vervielfältigung oder Weitergabe von Website-Inhalten ohne vorherige schriftliche Genehmigung ist untersagt.', 'imprint_contact_heading': 'Kontakt', 'imprint_contact_text': 'Bei rechtlichen oder geschäftlichen Fragen kontaktiere uns bitte:'
  }
};

var policyTranslations = {
  en: {
    refund_hero_title:'Refund <span class="accent">Policy</span>', refund_hero_desc:'Please read our refund policy carefully before placing an order.', refund_updated:'Last updated: September 2026', refund_intro_1:'At', refund_intro_2:'customer satisfaction is important to us. Please read our refund policy carefully before placing an order.', refund_h2_digital:'Digital Services and Custom Work', refund_p_digital:'Our products and services are customized digital solutions. Because work begins immediately after an order is confirmed, refunds are handled as follows:', refund_li_before_title:'Before work has started:', refund_li_before_desc:'Customers may request a full refund within 24 hours of placing an order if no work has been started.', refund_li_after_title:'After work has started:', refund_li_after_desc:'Once design, development, setup, or customization work has begun, refunds are not available for completed work or work already in progress.', refund_qr_note_title:'Important Note for Digital QR Menus:', refund_qr_note_desc:'Due to the custom and digital nature of our services, refunds cannot be provided once design or development work has commenced.', refund_h2_completed:'Completed Projects', refund_p_completed:'Refunds are not provided for completed digital menu projects that have been delivered to the customer.', refund_h2_tech:'Technical Issues', refund_p_tech:'If a technical issue caused by Smart Menu Solutions prevents the service from functioning as agreed, we will make reasonable efforts to resolve the issue. If the issue cannot be resolved, a partial or full refund may be offered at our discretion.', refund_h2_sub:'Subscription Services (if applicable)', refund_p_sub:'For recurring services, customers may cancel at any time. Cancellation will prevent future billing, but payments already made are generally non-refundable.', refund_h2_contact:'Contact', refund_p_contact:'For refund requests or questions, please contact us at:', imprint_main_title:'Imprint <span class="accent">Legal Notice</span>', imprint_hero_desc:'Business information and legal contact details.', imprint_effective_date:'Effective date: 1 September 2026', imprint_business_info:'Business Information', imprint_business_name_label:'Business Name:', imprint_owner_label:'Owner:', imprint_location_label:'Location:', imprint_location_value:'Rhodes, Greece', imprint_email_label:'Email:', imprint_disclaimer_heading:'Disclaimer', imprint_disclaimer_text:'The information provided on this website is for general informational purposes only. Smart Menu Solutions makes every effort to keep the information on this website accurate and up to date. However, no guarantees are made regarding completeness, reliability, or accuracy.', imprint_external_heading:'External Links', imprint_external_text:'This website may contain links to external websites. Smart Menu Solutions is not responsible for the content, privacy practices, or availability of third-party websites.', imprint_copyright_heading:'Copyright Notice', imprint_copyright_text1:'All content on this website, including text, graphics, logos, images, and design elements, is the property of Smart Menu Solutions unless otherwise stated.', imprint_copyright_text2:'Reproduction or redistribution of website content without prior written permission is prohibited.', imprint_contact_heading:'Contact', imprint_contact_text:'If you have any legal or business-related questions, please contact:', privacy_page_title:'Privacy <span class="accent">Policy</span>', privacy_page_desc:'How we collect, use, and protect your personal information.', privacy_effective:'Effective date: 1 September 2026', privacy_intro_heading:'Introduction and organizational info', privacy_scope_heading:'Scope and application', privacy_data_heading:'Data collection and processing', privacy_storage_heading:'Data storage and protection', privacy_rights_heading:'User rights and choices', privacy_cookies_heading:'Cookies and tracking technologies', privacy_us_heading:'Compliance with United States privacy laws', privacy_marketing_heading:'Direct marketing and communications', privacy_updates_heading:'Policy updates and changes', privacy_contact_heading:'Contact us'
  },
  de: {
    refund_hero_title:'Rückerstattungsrichtlinie', refund_hero_desc:'Bitte lies unsere Rückerstattungsrichtlinie sorgfältig, bevor du eine Bestellung aufgibst.', refund_updated:'Zuletzt aktualisiert: September 2026', refund_intro_1:'Bei', refund_intro_2:'ist die Kundenzufriedenheit wichtig. Bitte lies unsere Rückerstattungsrichtlinie sorgfältig, bevor du eine Bestellung aufgibst.', refund_h2_digital:'Digitale Dienstleistungen und individuelle Arbeiten', refund_p_digital:'Unsere Produkte und Dienstleistungen sind individuell erstellte digitale Lösungen. Da die Arbeit unmittelbar nach Bestätigung einer Bestellung beginnt, gelten folgende Rückerstattungsregeln:', refund_li_before_title:'Bevor die Arbeit begonnen hat:', refund_li_before_desc:'Kunden können innerhalb von 24 Stunden nach der Bestellung eine vollständige Rückerstattung anfordern, sofern noch keine Arbeit begonnen hat.', refund_li_after_title:'Nachdem die Arbeit begonnen hat:', refund_li_after_desc:'Sobald Design, Entwicklung, Einrichtung oder Anpassung begonnen haben, sind Rückerstattungen für abgeschlossene oder bereits laufende Arbeiten nicht möglich.', refund_qr_note_title:'Wichtiger Hinweis zu digitalen QR-Menüs:', refund_qr_note_desc:'Aufgrund der individuellen und digitalen Art unserer Dienstleistungen sind Rückerstattungen nach Beginn der Design- oder Entwicklungsarbeiten nicht möglich.', refund_h2_completed:'Abgeschlossene Projekte', refund_p_completed:'Für abgeschlossene digitale Menüprojekte, die dem Kunden übergeben wurden, werden keine Rückerstattungen gewährt.', refund_h2_tech:'Technische Probleme', refund_p_tech:'Wenn ein von Smart Menu Solutions verursachtes technisches Problem die vereinbarte Funktion verhindert, bemühen wir uns angemessen um eine Lösung. Kann das Problem nicht behoben werden, kann nach unserem Ermessen eine teilweise oder vollständige Rückerstattung angeboten werden.', refund_h2_sub:'Abonnementdienste (falls zutreffend)', refund_p_sub:'Bei wiederkehrenden Dienstleistungen können Kunden jederzeit kündigen. Die Kündigung verhindert zukünftige Abrechnungen, bereits geleistete Zahlungen sind jedoch grundsätzlich nicht erstattungsfähig.', refund_h2_contact:'Kontakt', refund_p_contact:'Für Rückerstattungsanfragen oder Fragen kontaktiere uns bitte unter:', imprint_main_title:'Impressum <span class="accent">Rechtliche Hinweise</span>', imprint_hero_desc:'Geschäftsinformationen und rechtliche Kontaktdaten.', imprint_effective_date:'Gültig ab: 1. September 2026', imprint_business_info:'Geschäftsinformationen', imprint_business_name_label:'Firmenname:', imprint_owner_label:'Inhaber:', imprint_location_label:'Standort:', imprint_location_value:'Rhodos, Griechenland', imprint_email_label:'E-Mail:', imprint_disclaimer_heading:'Haftungsausschluss', imprint_disclaimer_text:'Die Informationen auf dieser Website dienen ausschließlich allgemeinen Informationszwecken. Smart Menu Solutions bemüht sich, die Informationen aktuell und korrekt zu halten. Für Vollständigkeit, Zuverlässigkeit oder Richtigkeit wird jedoch keine Garantie übernommen.', imprint_external_heading:'Externe Links', imprint_external_text:'Diese Website kann Links zu externen Websites enthalten. Smart Menu Solutions ist nicht für deren Inhalte, Datenschutzpraktiken oder Verfügbarkeit verantwortlich.', imprint_copyright_heading:'Urheberrechtshinweis', imprint_copyright_text1:'Alle Inhalte dieser Website, einschließlich Texte, Grafiken, Logos, Bilder und Designelemente, sind, sofern nicht anders angegeben, Eigentum von Smart Menu Solutions.', imprint_copyright_text2:'Die Vervielfältigung oder Weitergabe von Website-Inhalten ohne vorherige schriftliche Genehmigung ist untersagt.', imprint_contact_heading:'Kontakt', imprint_contact_text:'Bei rechtlichen oder geschäftlichen Fragen kontaktiere uns bitte:', privacy_page_title:'Datenschutz<span class="accent">richtlinie</span>', privacy_page_desc:'So erfassen, verwenden und schützen wir Ihre persönlichen Daten.', privacy_effective:'Gültig ab: 1. September 2026', privacy_intro_heading:'Einleitung und Unternehmensinformationen', privacy_scope_heading:'Geltungsbereich und Anwendung', privacy_data_heading:'Datenerfassung und Verarbeitung', privacy_storage_heading:'Datenspeicherung und Schutz', privacy_rights_heading:'Ihre Rechte und Wahlmöglichkeiten', privacy_cookies_heading:'Cookies und Tracking-Technologien', privacy_us_heading:'Einhaltung der US-Datenschutzgesetze', privacy_marketing_heading:'Direktmarketing und Kommunikation', privacy_updates_heading:'Aktualisierungen und Änderungen der Richtlinie', privacy_contact_heading:'Kontakt'
  }
};
Object.assign(translations.en, policyTranslations.en);
Object.assign(translations.de, policyTranslations.de);
Object.assign(translations.en, { privacy_storage_sub:'Data storage', privacy_processing_sub:'Data processing agreements', privacy_control_sub:'Transparency and control', privacy_rights_sub:'Exercising your rights', privacy_cookies_sub:'Understanding cookies and tracking technologies', privacy_use_sub:'How we use these technologies', privacy_choices_sub:'Your choices and consent', privacy_individual_sub:'A. Individual rights', privacy_know_sub:'B. Right to know', privacy_delete_sub:'C. Right to delete', privacy_correct_sub:'D. Right to correct', privacy_limit_sub:'E. Right to limit', privacy_optout_sub:'F. Right to opt out', privacy_nondiscrimination_sub:'G. Right to non-discrimination', privacy_requests_sub:'H. Submitting requests', privacy_sensitive_sub:'I. Sensitive personal data', privacy_consent_sub:'Obtaining consent for direct marketing', privacy_types_sub:'Types of direct marketing communications', privacy_notification_sub:'Notification of changes' });
Object.assign(translations.de, { privacy_storage_sub:'Datenspeicherung', privacy_processing_sub:'Vereinbarungen zur Datenverarbeitung', privacy_control_sub:'Transparenz und Kontrolle', privacy_rights_sub:'Ausübung Ihrer Rechte', privacy_cookies_sub:'Cookies und Tracking-Technologien verstehen', privacy_use_sub:'So verwenden wir diese Technologien', privacy_choices_sub:'Ihre Wahlmöglichkeiten und Einwilligung', privacy_individual_sub:'A. Individuelle Rechte', privacy_know_sub:'B. Recht auf Auskunft', privacy_delete_sub:'C. Recht auf Löschung', privacy_correct_sub:'D. Recht auf Berichtigung', privacy_limit_sub:'E. Recht auf Einschränkung', privacy_optout_sub:'F. Recht auf Widerspruch', privacy_nondiscrimination_sub:'G. Schutz vor Diskriminierung', privacy_requests_sub:'H. Anträge stellen', privacy_sensitive_sub:'I. Sensible personenbezogene Daten', privacy_consent_sub:'Einwilligung für Direktmarketing', privacy_types_sub:'Arten der Direktmarketing-Kommunikation', privacy_notification_sub:'Benachrichtigung über Änderungen' });

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

  // Placeholder-Attribute übersetzen
  var placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(function (el) {
    var pKey = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][pKey]) {
      el.setAttribute('placeholder', translations[lang][pKey]);
    }
  });

  applyPageTranslations(lang);
}

function setupLanguageControls() {
  document.querySelectorAll('.main-nav').forEach(function (nav) {
    var container = nav.querySelector('.nav-lang-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'nav-lang-container';
      container.innerHTML = '<div class="lang-switcher"><button class="lang-btn" type="button" data-language="de" title="Deutsch">DE</button><button class="lang-btn" type="button" data-language="en" title="English">EN</button></div>';
      nav.appendChild(container);
    }
    container.querySelectorAll('button').forEach(function (button, index) {
      var language = index === 0 ? 'de' : 'en';
      button.className = 'lang-btn';
      button.textContent = language.toUpperCase();
      button.removeAttribute('onclick');
      button.setAttribute('type', 'button');
      button.setAttribute('data-language', language);
    });
    var headerInner = nav.closest('.header-inner');
    if (headerInner && container.parentElement !== headerInner) headerInner.appendChild(container);
  });

  document.querySelectorAll('[data-language]').forEach(function (button) {
    button.addEventListener('click', function () { switchLanguage(button.getAttribute('data-language')); });
  });
}

var globalTranslationSelectors = {
  '.skip-link': 'skip_link',
  '.main-nav li:nth-child(1) a': 'home',
  '.main-nav li:nth-child(2) a': 'services',
  '.main-nav li:nth-child(3) a': 'pricing',
  '.main-nav li:nth-child(4) a': 'faq',
  '.main-nav li:nth-child(5) a': 'order',
  '.main-nav li:nth-child(6) a': 'contact',
  '.nav-cta': 'get_started',
  '.footer-links li:nth-child(1) a': 'services',
  '.footer-links li:nth-child(2) a': 'pricing',
  '.footer-links li:nth-child(3) a': 'faq',
  '.footer-links li:nth-child(4) a': 'contact',
  '.footer-legal a[href="privacy-policy.html"]': 'privacy_policy',
  '.footer-legal a[href="refund-policy.html"]': 'refund_policy',
  '.footer-legal a[href="imprint.html"]': 'imprint',
  '.footer-bottom > span': 'footer_copyright'
};

  var pageTranslationSelectors = {
  'our-services.html': {
    '.hero-inner h1': 'services_hero_title', '.hero-lede': 'services_hero_lede', '.section-head h2': 'services_section_heading', '.section-head p': 'services_section_sub',
    '.service-card:nth-child(1) h3': 'plan_start_name', '.service-card:nth-child(1) p': 'service_card_start_desc', '.service-card:nth-child(2) h3': 'plan_pro_name', '.service-card:nth-child(2) p': 'service_card_pro_desc', '.service-card:nth-child(3) h3': 'plan_premium_name', '.service-card:nth-child(3) p': 'service_card_premium_desc',
    '.section > .container > div[style] a': 'contact_us_btn', '.services-testimonials .section-head h2': 'testimonials_heading', '.testimonial:nth-child(1) p': 'testimonial_1_text', '.testimonial:nth-child(1) cite': 'testimonial_1_author', '.testimonial:nth-child(2) p': 'testimonial_2_text', '.testimonial:nth-child(2) cite': 'testimonial_2_author', '.testimonial:nth-child(3) p': 'testimonial_3_text', '.testimonial:nth-child(3) cite': 'testimonial_3_author', '.cta-band h2': 'cta_band_title', '.cta-band p': 'cta_band_sub', '.cta-band a': 'cta_band_btn'
  },
  'pricing-plans.html': {
    '.page-hero h1': 'pricing_page_title', '.page-hero p': 'pricing_page_desc', '.section-head h2': 'pricing_section_heading', '.section-head p': 'pricing_section_sub', '.price-card:nth-child(1) h3': 'plan_start_title', '.price-card:nth-child(1) > p:nth-of-type(2)': 'plan_start_desc', '.price-card:nth-child(2) h3': 'plan_pro_title', '.price-card:nth-child(2) > p:nth-of-type(2)': 'plan_pro_desc', '.price-card:nth-child(3) h3': 'plan_premium_title', '.price-card:nth-child(3) > p:nth-of-type(2)': 'plan_premium_desc', '.price-card:nth-child(1) .price small': 'vat_incl', '.price-card:nth-child(2) .price small': 'vat_incl', '.price-card:nth-child(3) .price small': 'vat_incl', '.price-card:nth-child(2) .badge': 'badge_popular', '.price-card:nth-child(1) li:nth-child(1)': 'feat_qr', '.price-card:nth-child(2) li:nth-child(1)': 'feat_qr', '.price-card:nth-child(3) li:nth-child(1)': 'feat_qr', '.price-card:nth-child(1) li:nth-child(2)': 'feat_start_items', '.price-card:nth-child(2) li:nth-child(2)': 'feat_pro_items', '.price-card:nth-child(3) li:nth-child(2)': 'feat_premium_items', '.price-card:nth-child(1) li:nth-child(3)': 'feat_mobile', '.price-card:nth-child(2) li:nth-child(3)': 'feat_mobile', '.price-card:nth-child(3) li:nth-child(3)': 'feat_mobile', '.price-card:nth-child(1) li:nth-child(4)': 'feat_unique_qr', '.price-card:nth-child(2) li:nth-child(4)': 'feat_unique_qr', '.price-card:nth-child(3) li:nth-child(4)': 'feat_unique_qr', '.price-card:nth-child(1) li:nth-child(5)': 'feat_start_updates', '.price-card:nth-child(2) li:nth-child(5)': 'feat_pro_updates', '.price-card:nth-child(3) li:nth-child(5)': 'feat_premium_updates', '.price-card:nth-child(1) li:nth-child(6)': 'feat_billing_year', '.price-card:nth-child(2) li:nth-child(6)': 'feat_pro_lang', '.price-card:nth-child(2) li:nth-child(7)': 'feat_billing_year', '.price-card:nth-child(3) li:nth-child(6)': 'feat_premium_lang', '.price-card:nth-child(3) li:nth-child(7)': 'feat_billing_year', '.price-card:nth-child(1) .btn': 'btn_choose_start', '.price-card:nth-child(2) .btn': 'btn_choose_pro', '.price-card:nth-child(3) .btn': 'btn_choose_premium'
  },
  'faq.html': {
    '.page-hero h1': 'faq_hero_title', '.page-hero p': 'faq_hero_desc', '.faq-item:nth-child(1) summary': 'faq_q1', '.faq-item:nth-child(1) .faq-a': 'faq_a1', '.faq-item:nth-child(2) summary': 'faq_q2', '.faq-item:nth-child(2) .faq-a': 'faq_a2', '.faq-item:nth-child(3) summary': 'faq_q3', '.faq-item:nth-child(3) .faq-a': 'faq_a3', '.faq-item:nth-child(4) summary': 'faq_q4', '.faq-item:nth-child(4) .faq-a': 'faq_a4', '.faq-item:nth-child(5) summary': 'faq_q5', '.faq-item:nth-child(5) .faq-a': 'faq_a5', '.faq-item:nth-child(6) summary': 'faq_q6', '.faq-item:nth-child(6) .faq-a': 'faq_a6', '.faq-item:nth-child(7) summary': 'faq_q7', '.faq-item:nth-child(7) .faq-a': 'faq_a7', '.section--alt h2': 'faq_beyond_title', '.section--alt p': 'faq_beyond_desc', '.section--alt a': 'faq_beyond_btn'
  },
  'order.html': {
    '.page-hero h1': 'order_overview_title', '.page-hero p': 'order_overview_desc', '.section-head h2': 'order_steps_heading', '.section-head p': 'order_steps_sub', '.step:nth-child(1) h3': 'step1_title', '.step:nth-child(1) p': 'step1_desc', '.step:nth-child(2) h3': 'step2_title', '.step:nth-child(2) p': 'step2_desc', '.step:nth-child(3) h3': 'step3_title', '.step:nth-child(3) p': 'step3_desc', '.step:nth-child(4) h3': 'step4_title', '.step:nth-child(4) p': 'step4_desc', '.step:nth-child(5) h3': 'step5_title', '.step:nth-child(5) p': 'step5_desc', '.step:nth-child(6) h3': 'step6_title', '.step:nth-child(6) p': 'step6_desc', '.step:nth-child(7) h3': 'step7_title', '.step:nth-child(7) p': 'step7_desc', '.section > .container > div[style] a': 'order_cta_btn'
  },
  'order-info.html': {
    '.page-hero h1': 'order_info_hero_title', '.page-hero p': 'order_info_hero_desc', '.order-card > h2': 'form_main_title', '#orderForm .order-section:nth-of-type(1) .order-step-label': 'step_contact_label', '#orderForm .order-section:nth-of-type(2) .order-step-label': 'step_plan_label', '#orderForm .order-section:nth-of-type(3) .order-step-label': 'step_upload_label', 'label[for="firstName"]': 'label_firstname', 'label[for="lastName"]': 'label_lastname', 'label[for="email"]': 'label_email', '#firstName': 'placeholder_firstname', '#lastName': 'placeholder_lastname', '#email': 'placeholder_email', '#fileLabel': 'label_upload_title', '.dz-sub': 'label_upload_sub', '#payButton': 'submit_order_btn', '.os-label': 'summary_header', '.os-line:nth-of-type(1) span:first-child': 'feat_qr', '.os-line:nth-of-type(1) span:last-child': 'included', '.os-line:nth-of-type(2) span:first-child': 'summary_updates_label', '.os-total-label': 'total_due', '.os-note strong': 'what_happens_next', '.os-note p': 'what_happens_next_desc'
  },
  'contact.html': { '.page-hero h1': 'contact_hero_title', '.page-hero p': 'contact_hero_desc', '.contact-grid h2': 'contact_section_heading', 'label[for="company"]': 'contact_label_company', 'label[for="name"]': 'contact_label_name', 'label[for="email"]': 'contact_label_email', 'label[for="message"]': 'contact_label_message', '#contact-form button': 'contact_submit', '.field-hint': 'contact_hint', '.contact-side h3': 'contact_next_heading', '.contact-side .panel > p:nth-of-type(1)': 'contact_next_desc', '.contact-side .panel > p:nth-of-type(2)': 'contact_next_intro' },
  'refund-policy.html': {},
  'imprint.html': {},
  'privacy-policy.html': { '.page-hero h1': 'privacy_page_title', '.page-hero p': 'privacy_page_desc', '.prose .updated': 'privacy_effective', '.prose h2:nth-of-type(1)': 'privacy_intro_heading', '.prose h2:nth-of-type(2)': 'privacy_scope_heading', '.prose h2:nth-of-type(3)': 'privacy_data_heading', '.prose h2:nth-of-type(4)': 'privacy_storage_heading', '.prose h2:nth-of-type(5)': 'privacy_rights_heading', '.prose h2:nth-of-type(6)': 'privacy_cookies_heading', '.prose h2:nth-of-type(7)': 'privacy_us_heading', '.prose h2:nth-of-type(8)': 'privacy_marketing_heading', '.prose h2:nth-of-type(9)': 'privacy_updates_heading', '.prose h2:nth-of-type(10)': 'privacy_contact_heading', '.prose h3:nth-of-type(1)': 'privacy_storage_sub', '.prose h3:nth-of-type(2)': 'privacy_processing_sub', '.prose h3:nth-of-type(3)': 'privacy_control_sub', '.prose h3:nth-of-type(4)': 'privacy_rights_sub', '.prose h3:nth-of-type(5)': 'privacy_cookies_sub', '.prose h3:nth-of-type(6)': 'privacy_use_sub', '.prose h3:nth-of-type(7)': 'privacy_choices_sub', '.prose h3:nth-of-type(8)': 'privacy_individual_sub', '.prose h3:nth-of-type(9)': 'privacy_know_sub', '.prose h3:nth-of-type(10)': 'privacy_delete_sub', '.prose h3:nth-of-type(11)': 'privacy_correct_sub', '.prose h3:nth-of-type(12)': 'privacy_limit_sub', '.prose h3:nth-of-type(13)': 'privacy_optout_sub', '.prose h3:nth-of-type(14)': 'privacy_nondiscrimination_sub', '.prose h3:nth-of-type(15)': 'privacy_requests_sub', '.prose h3:nth-of-type(16)': 'privacy_sensitive_sub', '.prose h3:nth-of-type(17)': 'privacy_consent_sub', '.prose h3:nth-of-type(18)': 'privacy_types_sub', '.prose h3:nth-of-type(19)': 'privacy_notification_sub' }
};

function ensureLegalLinks() {
  document.querySelectorAll('.footer-legal').forEach(function (legal) {
    if (!legal.querySelector('a[href="refund-policy.html"]')) legal.insertAdjacentHTML('beforeend', '<li><a href="refund-policy.html" data-i18n="refund_policy">Refund Policy</a></li>');
    if (!legal.querySelector('a[href="imprint.html"]')) legal.insertAdjacentHTML('beforeend', '<li><a href="imprint.html" data-i18n="imprint">Imprint</a></li>');
    var emailLink = legal.querySelector('a[href^="mailto:"]');
    if (emailLink) legal.appendChild(emailLink.parentElement);
  });
}

function wirePageTranslations() {
  Object.keys(globalTranslationSelectors).forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (element) { element.setAttribute('data-i18n', globalTranslationSelectors[selector]); });
  });
  var page = window.location.pathname.split('/').pop() || 'index.html';
  var pageMap = pageTranslationSelectors[page] || {};
  Object.keys(pageMap).forEach(function (selector) { document.querySelectorAll(selector).forEach(function (element) { element.setAttribute('data-i18n', pageMap[selector]); }); });
}

function applyPageTranslations(lang) {
  document.querySelectorAll('[data-language]').forEach(function (button) {
    button.classList.toggle('active', button.getAttribute('data-language') === lang);
  });
  document.querySelectorAll('.faq-item summary[data-i18n]').forEach(function (summary) {
    var plus = summary.querySelector('.plus');
    var key = summary.getAttribute('data-i18n');
    if (plus && translations[lang] && translations[lang][key]) summary.firstChild.nodeValue = translations[lang][key];
  });

  applyPrivacyPolicyLanguage(lang);
}

var privacyGermanHtml = '<p class="updated">Gültig ab: 1. September 2026</p>' +
  '<h2>Einleitung und Unternehmensinformationen</h2><p>Wir von Smart Menu Solutions möchten unsere Kunden und Kontakte bestmöglich betreuen. Dazu gehört der verantwortungsvolle Umgang mit personenbezogenen Daten, die über unsere Website und verbundene Kontakte erhoben werden.</p><p>Wir verwenden diese Daten, um die Nutzererfahrung zu verbessern, Anfragen zu beantworten, unsere Leistungen weiterzuentwickeln und notwendige Geschäftsabläufe wie Abrechnung und Kontoverwaltung durchzuführen.</p><p>Wir verarbeiten personenbezogene Daten mit größtem Respekt für Datenschutz und Sicherheit und halten die geltenden Vorschriften ein. Für Fragen kannst du uns unter <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a> kontaktieren.</p>' +
  '<h2>Geltungsbereich und Anwendung</h2><p>Diese Datenschutzrichtlinie gilt für Website-Besucher, Personen, die uns kontaktieren, sowie Kunden, die unsere Leistungen anfragen oder nutzen.</p>' +
  '<h2>Datenerfassung und Verarbeitung</h2><p>Wir erfassen Daten, wenn du unsere Leistungen nutzt oder uns Informationen direkt zur Verfügung stellst, beispielsweise bei der Bestellung unseres Digital QR Menu Builders.</p><p>Verarbeitet werden können insbesondere:</p><ul><li>Vor- und Nachname</li><li>Kontaktdaten und Angaben aus deiner Anfrage</li><li>Technische Informationen aus Sicherheitsprotokollen wie IP-Adresse, Browsertyp und Zeitpunkt der Anfrage</li></ul><p>Wir verarbeiten nur Daten, die für die Erbringung unserer Leistungen, gesetzliche Pflichten oder eine bessere Nutzererfahrung erforderlich sind. Bei Kontakt- oder Bestellformularen werden Angaben und angehängte Menüdateien über FormSubmit an unser E-Mail-Postfach übertragen. Bitte sende keine sensiblen persönlichen oder finanziellen Daten.</p>' +
  '<h2>Datenspeicherung und Schutz</h2><h3>Datenspeicherung</h3><p>Personenbezogene Daten werden auf sicheren Servern in Deutschland gespeichert. Bei internationalen Übermittlungen achten wir auf die Einhaltung der geltenden Datenschutzgesetze.</p><h3>Vereinbarungen zur Datenverarbeitung</h3><p>Wenn wir Daten mit Dienstleistern teilen, geschieht dies auf Grundlage von Auftragsverarbeitungsverträgen und angemessenen technischen und organisatorischen Sicherheitsmaßnahmen.</p><h3>Transparenz und Kontrolle</h3><p>Wir informieren dich über wesentliche Änderungen unserer Datenverarbeitung und geben dir, soweit erforderlich, die Möglichkeit zur Einwilligung.</p>' +
  '<h2>Ihre Rechte und Wahlmöglichkeiten</h2><p>Nach DSGVO und anderen geltenden Datenschutzgesetzen hast du unter anderem folgende Rechte:</p><ul><li>Auskunft über deine gespeicherten Daten</li><li>Berichtigung unrichtiger oder unvollständiger Daten</li><li>Löschung deiner Daten, sofern die gesetzlichen Voraussetzungen erfüllt sind</li><li>Einschränkung der Verarbeitung</li><li>Datenübertragbarkeit</li><li>Widerspruch gegen bestimmte Verarbeitungen</li><li>Widerruf einer Einwilligung jederzeit mit Wirkung für die Zukunft</li><li>Beschwerde bei einer Datenschutzaufsichtsbehörde</li></ul><h3>Ausübung deiner Rechte</h3><p>Zur Ausübung deiner Rechte kontaktiere uns unter <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>. Gegebenenfalls müssen wir deine Identität prüfen.</p>' +
  '<h2>Cookies und Tracking-Technologien</h2><h3>Cookies verstehen</h3><p>Cookies sind kleine Dateien auf deinem Gerät, die Einstellungen speichern und Informationen über die Nutzung unserer Website erfassen können.</p><h3>So verwenden wir diese Technologien</h3><ul><li>Notwendige Cookies für Funktion und Sicherheit</li><li>Analyse-Cookies zur Verbesserung der Website</li><li>Funktionale Cookies für Einstellungen und Personalisierung</li><li>Werbe- und Targeting-Cookies, sofern eingesetzt</li></ul><h3>Deine Wahlmöglichkeiten und Einwilligung</h3><p>Die aktuelle Website setzt nicht absichtlich Analyse- oder Werbe-Cookies. Bei zukünftigen nicht notwendigen Cookies aktualisieren wir diese Richtlinie und stellen erforderliche Einwilligungsmöglichkeiten bereit.</p>' +
  '<h2>Einhaltung der US-Datenschutzgesetze</h2><p>Für Personen in den USA können zusätzliche Rechte nach dem California Consumer Privacy Act und ähnlichen einzelstaatlichen Gesetzen gelten, darunter Auskunft, Löschung, Berichtigung, Einschränkung, Widerspruch und Schutz vor Diskriminierung.</p><h3>Anträge stellen</h3><p>Anfragen können per E-Mail an <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a> gestellt werden. Wir prüfen die Anfrage und antworten innerhalb der geltenden Fristen.</p>' +
  '<h2>Direktmarketing und Kommunikation</h2><p>Wir können personenbezogene Daten verwenden, um dich im Rahmen der geltenden Gesetze über unsere Leistungen und Angebote zu informieren. Marketing-Nachrichten enthalten eine einfache Möglichkeit zur Abmeldung.</p><h3>Arten der Direktmarketing-Kommunikation</h3><p>Eine Kontaktaufnahme kann per E-Mail, SMS, Telefon oder über soziale Netzwerke erfolgen.</p>' +
  '<h2>Aktualisierungen und Änderungen der Richtlinie</h2><p>Wir können diese Datenschutzrichtlinie an gesetzliche, technische oder geschäftliche Änderungen anpassen. Bei wesentlichen Änderungen informieren wir dich über geeignete Kanäle und nennen das neue Gültigkeitsdatum.</p>' +
  '<h2>Kontakt</h2><p>Bei Fragen zu dieser Datenschutzrichtlinie kontaktiere uns bitte unter <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>. Wir helfen dir gerne weiter.</p>';

function applyPrivacyPolicyLanguage(lang) {
  if (window.location.pathname.split('/').pop() !== 'privacy-policy.html') return;
  var prose = document.querySelector('.prose');
  if (!prose) return;
  if (!prose.dataset.englishContent) prose.dataset.englishContent = prose.innerHTML;
  prose.innerHTML = lang === 'de' ? privacyGermanHtml : prose.dataset.englishContent;
}
