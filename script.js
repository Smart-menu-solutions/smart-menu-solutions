// The header is position:fixed, so body's padding-top has to match its real
// height exactly or a sliver of the body background shows above the hero
// image (reported on some mobile browsers) - a hardcoded px value in CSS
// can drift by a pixel or two after load (web font swap, the DE/EN buttons
// re-wrapping at narrow widths, etc.). ResizeObserver keeps --header-h
// correct continuously instead of guessing every possible cause up front.
function syncHeaderHeight() {
  var header = document.querySelector('.site-header');
  if (!header || typeof ResizeObserver === 'undefined') return;
  var apply = function () {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  };
  apply();
  new ResizeObserver(apply).observe(header);
}

document.addEventListener('DOMContentLoaded', function () {
  syncHeaderHeight();
  setupLanguageControls();
  ensureLegalLinks();
  ensureFooterPowered();
  ensureFooterSocial();
  document.querySelectorAll('form[action*="formsubmit.co"]').forEach(function (form) {
    var isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    var nextField = form.querySelector('input[name="_next"]');
    if (nextField) {
      if (isLocalHost || window.location.protocol === 'file:') nextField.remove();
      else nextField.value = new URL(nextField.getAttribute('value') || 'thank-you.html', window.location.href).href;
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

  // Sprache beim Laden der Seite wiederherstellen
  var savedLang = localStorage.getItem('selectedLang') || 'en';
  switchLanguage(savedLang);

  wireStatsDemoModal();
  wireHubDemoModal();
});

// Homepage "Weekly Analytics Report" card - opens the real, live El Greco
// stats page in a small popup so visitors see an actual example instead of
// a mockup. No-ops on every other page (the elements simply don't exist).
// embed=1 tells stats.html to hide its own header/footer (see style.css
// html.is-embedded) so a click in there can't navigate the visitor out of
// this little box. The iframe's src is only set on first open, not on page
// load, so browsing the homepage never fires an extra request against the
// live stats endpoint.
function wireStatsDemoModal() {
  var openButton = document.getElementById('statsDemoOpen');
  var overlay = document.getElementById('statsDemoOverlay');
  var closeButton = document.getElementById('statsDemoClose');
  var frame = document.getElementById('statsDemoFrame');
  if (!openButton || !overlay || !closeButton || !frame) return;
  // Root-relative, not relative - script.js is shared by both /index.html
  // and /de/index.html, and a plain 'stats.html' resolves to the wrong
  // place (de/stats.html, a 404) when loaded from the German page.
  var DEMO_URL = '/stats.html?token=529c5e64-3262-448b-9160-07f1289f8418&embed=1';
  var loaded = false;
  function openModal() {
    if (!loaded) { frame.src = DEMO_URL; loaded = true; }
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }
  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (event) { if (event.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !overlay.hidden) closeModal(); });
}

// Smart ServiceHub "how it works" popup - same open/close/escape pattern as
// wireStatsDemoModal above, but the content is a static flow diagram baked
// into the page (no iframe/live data to lazy-load).
function wireHubDemoModal() {
  var openButton = document.getElementById('hubDemoOpen');
  var overlay = document.getElementById('hubDemoOverlay');
  var closeButton = document.getElementById('hubDemoClose');
  if (!openButton || !overlay || !closeButton) return;
  function openModal() { overlay.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeModal() { overlay.hidden = true; document.body.style.overflow = ''; }
  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (event) { if (event.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !overlay.hidden) closeModal(); });
}

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
    'footer_copyright': '© 2026 Smart Menu Solutions',
    'footer_powered': 'Powered by Smart Menu Solutions',

    // --- Index / Startseite ---
    'index_hero_title': '<span class="accent">Scan|View|Enjoy</span><span class="hero-sub">Digital QR Menus for Restaurants, Bars &amp; Cafés</span>',
    'index_hero_lede': 'Welcome to Smart Menu Solutions, where we blend digital innovation with modern branding to revolutionise the hospitality industry. Discover how our creative solutions can transform your restaurant or cafe.',
    'index_hero_btn': 'Explore our services',
    'index_transform_title': 'Transform your business <span class="accent">today</span>',
    'index_transform_desc': 'Ready to embrace the future? Our digital menu solutions are designed to be modern, eye-catching, and incredibly easy to use. See how Smart Menu Solutions can bring a fresh, vibrant energy to your establishment and delight your customers.',
    'index_transform_btn': 'Start your order',
    'compare_hub_tag': 'Smart ServiceHub™',
    'compare_hub_title': 'Live table service',
    'compare_hub_li1': 'Guests order, staff stay in sync',
    'compare_hub_li2': 'Live dashboards for kitchen, bar, service and cashier',
    'compare_hub_li3': 'Ask for the bill with one tap',
    'compare_hub_li4': 'No app to install — works on any phone or tablet',
    'compare_hub_cta': 'See how it works',
    'hub_flow_title': 'How Smart ServiceHub™ works',
    'hub_flow_guest': 'Guest',
    'hub_flow_step1_title': 'Scan the QR code',
    'hub_flow_step1_desc': 'Guest scans the code at their table',
    'hub_flow_step2_title': 'Digital menu opens',
    'hub_flow_step2_desc': 'Instantly, on their own phone - no app needed',
    'hub_flow_step3_title': 'Places the order',
    'hub_flow_step3_desc': 'A few taps, right from the table',
    'hub_flow_step4_title': 'Instant transmission',
    'hub_flow_step4_desc': 'Goes straight to cashier, kitchen, bar & waiter',
    'hub_flow_step5_title': 'Service & preparation',
    'hub_flow_step5_desc': 'Every station stays perfectly in sync',
    'hub_flow_step6_title': 'Reorder in 1 click',
    'hub_flow_step6_desc': 'No waiting to flag down a waiter',
    'hub_flow_outcome': '😊 Guests order, staff stay in sync',
    'about_title': 'About <span class="accent">Smart Menu Solutions</span>',
    'about_desc': 'We help restaurants, cafes, bars and hotels replace static paper menus with fast, beautiful digital menus guests can open instantly from any phone — no app required.',
    'compare_title': 'From paper menu <span class="accent">to digital experience</span>',
    'compare_desc': 'See the difference a QR menu makes for your restaurant, bar, café or hotel.',
    'compare_before_tag': 'Before',
    'compare_before_title': 'Printed paper menu',
    'compare_before_li1': 'Reprint everything for a single price change',
    'compare_before_li2': 'Usually just one language',
    'compare_before_li3': 'Gets worn, stained, torn or lost',
    'compare_after_tag': 'After',
    'compare_after_title': 'Smart QR digital menu',
    'compare_after_li1': 'Update instantly, anytime.',
    'compare_after_li2': 'Multiple languages built in',
    'compare_after_li3': 'Always clean, modern and on-brand',
    'compare_ready_tag': 'Ready to go',
    'compare_ready_title': 'Your menu, live and ready',
    'compare_ready_li1': 'Every dish with its own photo (optional)',
    'compare_ready_li2': 'Prices and items update instantly',
    'compare_ready_li3': 'Share the link or QR code today',
    'compare_ready_li4': 'Scan the code above to see it live',
    'compare_new_tag': 'Smart WeeklyReport™',
    'compare_new_cta': 'View a live example',
    'compare_new_title': 'Weekly Analytics Report',
    'compare_new_li1': 'See your top dishes & categories',
    'compare_new_li2': 'Delivered to your inbox every Monday',
    'compare_new_li3': 'Click above to see a live example',

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
    'service_card_sfm_name': 'Smart FoodMatch™',
    'service_card_sfm_desc': 'The intelligent add-on for every Smart Menu — guests answer 3 quick questions and get an instant personalized recommendation.',
    'services_addon_heading': 'Add-on',
    'services_addon_sub': 'Extend any Smart Menu plan with optional extras — from eye-catching dish photos to smart recommendations and weekly visitor insights, add exactly what your business needs, whenever you need it.',
    'service_card_photos_name': 'Smart DishPhoto™',
    'service_card_photos_desc': 'Add a real photo to every dish on your menu — a polished, appetizing look that helps guests decide faster and order with confidence.',
    'service_card_report_name': 'Smart WeeklyReport™',
    'service_card_report_desc': 'A weekly email with visitor stats for your menu — see which categories and dishes guests view most, no login required.',
    'service_card_hub_name': 'Smart ServiceHub™',
    'service_card_hub_desc': 'Guests order via QR code while waiter, kitchen, bar and cashier stay perfectly in sync in real time — less paper, fewer errors, faster service.',
    'services_addon_note': 'Already a customer? You can add any of these add-ons to your plan at any time - you\'ll only pay the pro-rated amount for the rest of your current plan year, and it renews automatically from then on.',
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
    'vat_incl_year': 'VAT incl. / year',
    'badge_popular': 'Most popular',
    
    'feat_qr': 'Digital QR code menu',
    'feat_mobile': 'Mobile-friendly design',
    'feat_unique_qr': 'Unique QR code',
    'feat_dish_photo_start': 'Every dish with its own photo (optional* €10.00)',
    'feat_dish_photo_pro': 'Every dish with its own photo (optional* €30.00)',
    'feat_dish_photo_premium': 'Every dish with its own photo (optional* €90.00)',
    'pricing_photo_note': '* Estimated maximum cost if every menu item gets its own photo, at €0.20 per photo. Photos are provided by the customer.',
    'feat_start_items': 'Up to 50 menu items',
    'feat_start_updates': '1 monthly menu update',
    'feat_pro_items': 'Up to 150 menu items',
    'feat_pro_updates': '3 monthly menu updates',
    'feat_pro_lang': '1 extra language',
    'feat_premium_items': 'Up to 450 menu items',
    'feat_premium_updates': '6 monthly menu updates',
    'feat_premium_lang': '5 extra languages',
    'feat_billing_year': 'Billing Cycle 1-Year Subscription',

    'btn_choose_start': 'Choose Smart Start',
    'btn_choose_pro': 'Choose Smart Pro',
    'btn_choose_premium': 'Choose Smart Premium',
    'pricing_questions': 'Questions about a plan? Email',

    'sfm_pricing_title': '<span class="accent">Smart</span> FoodMatch™',
    'sfm_pricing_desc': 'The intelligent add-on for every Smart Menu. Your guests answer 3 quick questions and instantly receive a personalized recommendation from your menu.',
    'sfm_feat_1': 'Personalized menu recommendations',
    'sfm_feat_2': 'Perfect for restaurants, cafés, bars, and takeaways',
    'sfm_feat_3': 'Increase average order value with smarter suggestions',
    'sfm_feat_4': 'Fully integrated into your QR menu',
    'sfm_available': 'Available for Smart Start, Smart Pro, and Smart Premium.',
    'addons_pricing_heading': 'Add-ons',
    'addons_pricing_sub': 'Boost any plan with these optional extras.',
    'addon_photos_feat_1': 'A professional photo for every dish',
    'addon_photos_feat_2': 'Helps guests decide faster and order with confidence',
    'addon_photos_feat_3': 'Priced per plan - see your plan above',
    'addon_photos_feat_4': 'Uploaded once as a single ZIP file',
    'addon_analytics_feat_1': 'Weekly email with your menu\'s visitor stats',
    'addon_analytics_feat_2': 'See your top categories and dishes at a glance',
    'addon_analytics_feat_3': 'Live stats page - shareable, no login required',
    'addon_analytics_feat_4': 'Fully integrated into your QR menu',
    'addon_hub_pricing_desc': 'The live ordering platform for your restaurant. Guests order via QR code while waiter, kitchen, bar and cashier stay perfectly synchronized in real time.',
    'addon_hub_feat_1': 'Guest QR ordering with instant kitchen and bar sync',
    'addon_hub_feat_2': 'Waiter, kitchen, bar and cashier dashboards included',
    'addon_hub_feat_3': 'Unlimited number of tables',
    'addon_hub_feat_4': 'Fully integrated into your QR menu',

    // --- FAQ Seite ---
    'faq_hero_title': '<span class="accent">FAQ</span>',
    'faq_hero_desc': "Our journey began with a simple idea: to digitalise restaurants with a modern, eye-catching brand. Here's what people usually ask us before getting started.",
    'faq_q1': 'Do I need technical skills?',
    'faq_a1': 'No. We handle the entire setup for you.',
    'faq_q2': 'How do I get started?',
    'faq_a2': 'Choose a plan, complete your order, and send us your menu and photos.',
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
    'step4_desc': "We'll review your uploaded menu and contact you if we need your photos or any additional branding details.",
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
    'placeholder_phone': '+44 7700 900123',
    'label_upload_title': 'Upload your menu PDF',
    'label_upload_sub': 'Click here or drag a PDF file to upload',
    'step_photo_label': '04 / UPLOAD PHOTO ZIP',
    'label_photo_upload_title': 'Upload photo PNGs (ZIP)',
    'label_photo_upload_sub': 'Click here or drag a <strong>PNG ZIP</strong> file to upload',
    'label_photo_naming_hint': '<strong>PNG naming tip:</strong> menu title "Bruschetta Classica" → file name "Bruschetta_Classica.png"',
    'label_photo_upload_note': '<strong>Note: The customer is responsible for the quality of the photos.</strong>',
    'addon_photo_mini': 'Smart DishPhoto™',
    'addon_photo_summary': 'Smart DishPhoto™ (optional)',
    'addon_sfm_mini': 'Smart FoodMatch™',
    'addon_sfm_summary': 'Smart FoodMatch™ (optional)',
    'addon_analytics_mini': 'Smart WeeklyReport™',
    'addon_analytics_summary': 'Smart WeeklyReport™ (optional)',
    'addon_hub_mini': 'Smart ServiceHub™',
    'addon_hub_summary': 'Smart ServiceHub™ (optional)',
    'stats_hero_title': 'Your menu\'s weekly traffic',
    'stats_hero_desc': 'How many guests scanned your QR menu, and which categories and dishes they looked at most.',
    'stats_error_desc': 'This link is invalid or has expired. Please contact us so we can help.',
    'stats_paused_desc': 'The Smart WeeklyReport™ add-on isn\'t part of your active plan anymore, so there\'s nothing new to show here.',
    'stats_paused_cta': 'Want it back on? Contact us',
    'stats_loading': 'Loading your stats…',
    'stats_visits_label': 'Visits this week',
    'stats_top_categories': 'Top categories',
    'stats_top_dishes': 'Top dishes',
    'stats_sfm_title': 'Smart FoodMatch™',
    'stats_sfm_subhead': 'Top recommendations',
    'stats_sfm_course_starter': 'Starters',
    'stats_sfm_course_main': 'Main courses',
    'stats_sfm_course_dessert': 'Desserts',
    'contact_support': 'Contact support',
    'addons_hero_title': 'Manage your add-ons',
    'addons_hero_desc': 'Add a feature anytime - you\'ll only pay the pro-rated amount for the rest of your current plan year.',
    'addons_error_desc': 'This link is invalid or has expired. Please contact us so we can help.',
    'addons_locked_desc': 'Your subscription isn\'t currently active, so add-ons can\'t be added right now. Please use the renewal link from your email, or contact us.',
    'addons_loading': 'Loading your add-ons…',
    'addons_list_title': 'Available add-ons',
    'addon_prorate_note': 'Adding a feature charges only the pro-rated amount for the rest of your current plan year - not a full year. From your next renewal on, it\'s included automatically.',
    'submit_order_btn': 'Submit order request',
    'summary_header': 'ORDER SUMMARY',
    'summary_updates_label': 'Menu updates',
    'summary_billing_label': 'Billing Cycle 1-Year Subscription',
    'total_due': 'Total due<br><span style="text-transform:none;font-weight:400;letter-spacing:0;font-size:.82em">VAT incl.</span>',
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
    'footer_copyright': '© 2026 Smart Menu Solutions',
    'footer_powered': 'Bereitgestellt von Smart Menu Solutions',

    // --- Index / Startseite ---
    'index_hero_title': '<span class="accent">Scannen|Ansehen|Genießen</span><span class="hero-sub">Digitale QR-Speisekarten für Restaurants, Bars &amp; Cafés</span>',
    'index_hero_lede': 'Willkommen bei Smart Menu Solutions, wo wir digitale Innovation mit modernem Branding verbinden, um das Gastgewerbe zu revolutionieren.',
    'index_hero_btn': 'Unsere Dienste erkunden',
    'index_transform_title': 'Verändern Sie Ihr Unternehmen <span class="accent">heute</span>',
    'index_transform_desc': 'Bereit, die Zukunft zu gestalten? Unsere digitalen Menülösungen sind modern, auffallend und unglaublich einfach zu bedienen.',
    'index_transform_btn': 'Bestellung starten',
    'compare_hub_tag': 'Smart ServiceHub™',
    'compare_hub_title': 'Live-Tischservice',
    'compare_hub_li1': 'Gäste bestellen, Personal bleibt synchron',
    'compare_hub_li2': 'Live-Ansicht für Küche, Bar, Service und Kasse',
    'compare_hub_li3': 'Rechnung anfordern – mit einem Tipp',
    'compare_hub_li4': 'Keine App nötig – funktioniert auf jedem Handy und Tablet',
    'compare_hub_cta': 'So funktioniert\'s',
    'hub_flow_title': 'So funktioniert Smart ServiceHub™',
    'hub_flow_guest': 'Gast',
    'hub_flow_step1_title': 'QR-Code scannen',
    'hub_flow_step1_desc': 'Gast scannt den Code am Tisch',
    'hub_flow_step2_title': 'Digitales Menü öffnet sich',
    'hub_flow_step2_desc': 'Sofort, auf dem eigenen Handy – ohne App',
    'hub_flow_step3_title': 'Bestellung aufgeben',
    'hub_flow_step3_desc': 'Ein paar Klicks, direkt vom Tisch aus',
    'hub_flow_step4_title': 'Sofortige Übermittlung',
    'hub_flow_step4_desc': 'Geht direkt an Kasse, Küche, Bar & Kellner',
    'hub_flow_step5_title': 'Service & Zubereitung',
    'hub_flow_step5_desc': 'Jede Station bleibt perfekt synchron',
    'hub_flow_step6_title': 'Nachbestellung mit 1 Klick',
    'hub_flow_step6_desc': 'Kein Warten auf den Kellner',
    'hub_flow_outcome': '😊 Gäste bestellen, Personal bleibt synchron',
    'about_title': 'Über <span class="accent">Smart Menu Solutions</span>',
    'about_desc': 'Wir helfen Restaurants, Cafés, Bars und Hotels dabei, statische Papier-Speisekarten durch schnelle, ansprechende digitale Menüs zu ersetzen, die Gäste sofort auf jedem Smartphone öffnen können — ganz ohne App.',
    'compare_title': 'Von der Papier-Speisekarte <span class="accent">zum digitalen Erlebnis</span>',
    'compare_desc': 'Sehen Sie den Unterschied, den ein QR-Menü für Ihr Restaurant, Ihre Bar, Ihr Café oder Hotel macht.',
    'compare_before_tag': 'Vorher',
    'compare_before_title': 'Gedruckte Papier-Speisekarte',
    'compare_before_li1': 'Bei jeder Preisänderung alles neu drucken',
    'compare_before_li2': 'Meist nur eine Sprache',
    'compare_before_li3': 'Wird abgenutzt, fleckig, zerrissen oder geht verloren',
    'compare_after_tag': 'Nachher',
    'compare_after_title': 'Smartes QR-Digitalmenü',
    'compare_after_li1': 'Jederzeit sofort aktualisierbar.',
    'compare_after_li2': 'Mehrere Sprachen fest eingebaut',
    'compare_after_li3': 'Immer sauber, modern und markengerecht',
    'compare_ready_tag': 'Startklar',
    'compare_ready_title': 'Ihr Menü, live und startklar',
    'compare_ready_li1': 'Jedes Gericht mit eigenem Foto (Optional)',
    'compare_ready_li2': 'Preise und Gerichte sofort aktualisiert',
    'compare_ready_li3': 'Link oder QR-Code noch heute teilen',
    'compare_ready_li4': 'Code oben scannen und live ansehen',
    'compare_new_tag': 'Smart WeeklyReport™',
    'compare_new_cta': 'Live-Beispiel ansehen',
    'compare_new_title': 'Wöchentlicher Analyse-Bericht',
    'compare_new_li1': 'Sehen Sie Ihre meistgesehenen Gerichte & Kategorien',
    'compare_new_li2': 'Jeden Montag direkt in Ihr Postfach',
    'compare_new_li3': 'Klicken Sie oben für ein Live-Beispiel',

    // --- Our Services Seite ---
    'services_hero_title': '<span class="accent">Mehr als</span> gewöhnlich',
    'services_hero_lede': 'Bringen Sie Ihr Business mit digitalen Speisekarten auf das nächste Level. Smart Menu Solutions unterstützt Restaurants, Cafés, Bars und Hotels dabei, ein modernes, schnelles, bequemes und stets aktuelles Menü-Erlebnis zu bieten.',
    'services_section_heading': 'Unsere Leistungen',
    'services_section_sub': 'Egal ob Restaurant, Café, Food Truck, Bar oder Imbiss – Smart Menu Solutions bietet eine günstige und professionelle digitale Menü-Plattform, die kleinen Unternehmen beim Wachsen hilft.',
    'contact_us_btn': 'Kontaktieren Sie uns',
    'plan_start_name': 'Smart Start',
    'service_card_start_desc': 'Perfekt für Cafés, Food Trucks, Kioske und kleine Unternehmen, die mit digitalen Menüs starten.',
    'plan_pro_name': 'Smart Pro',
    'service_card_pro_desc': 'Ideal für wachsende Restaurants und Gastronomiebetriebe, die mehr Flexibilität benötigen.',
    'plan_premium_name': 'Smart Premium',
    'service_card_premium_desc': 'Entwickelt für viel besuchte Restaurants, Hotelrestaurants, Ketten und Unternehmen mit höchsten Ansprüchen.',
    'service_card_sfm_name': 'Smart FoodMatch™',
    'service_card_sfm_desc': 'Das intelligente Add-on für jedes Smart Menü — Gäste beantworten 3 kurze Fragen und erhalten sofort eine persönliche Empfehlung.',
    'services_addon_heading': 'Add-on',
    'services_addon_sub': 'Erweitern Sie jeden Smart-Menu-Plan mit optionalen Extras — von ansprechenden Gericht-Fotos über smarte Empfehlungen bis hin zu wöchentlichen Besucher-Einblicken. Fügen Sie genau das hinzu, was Ihr Business braucht, wann immer Sie es brauchen.',
    'service_card_photos_name': 'Smart DishPhoto™',
    'service_card_photos_desc': 'Ein echtes Foto zu jedem Gericht auf Ihrer Speisekarte — ein professioneller, appetitlicher Look, der Gästen hilft, schneller zu entscheiden und mit mehr Zuversicht zu bestellen.',
    'service_card_report_name': 'Smart WeeklyReport™',
    'service_card_report_desc': 'Eine wöchentliche E-Mail mit Besucherstatistiken für Ihre Speisekarte — sehen Sie, welche Kategorien und Gerichte am häufigsten angesehen werden, ganz ohne Login.',
    'service_card_hub_name': 'Smart ServiceHub™',
    'service_card_hub_desc': 'Gäste bestellen per QR-Code, während Kellner, Küche, Bar und Kasse in Echtzeit synchron bleiben — weniger Zettelwirtschaft, weniger Fehler, schnellerer Service.',
    'services_addon_note': 'Schon Kunde? Sie können jedes dieser Add-ons jederzeit zu Ihrem Plan hinzufügen – Sie zahlen nur den anteiligen Betrag für den Rest Ihres laufenden Abo-Jahres, und ab der nächsten Verlängerung läuft es automatisch mit.',
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
    'pricing_page_desc': 'Hier beginnt unsere Reise. Lernen Sie unser Unternehmen kennen und erfahren Sie, was wir tun und wie wir uns für Qualität und hervorragenden Service einsetzen.',
    'pricing_section_heading': 'Wählen Sie Ihren Tarif',
    'pricing_section_sub': 'Wir bieten eine Reihe spezieller Tarife an, die auf Ihre individuellen Bedürfnisse zugeschnitten sind.',
    
    'plan_start_title': 'Smart Start',
    'plan_start_desc': 'Perfekt für Cafés, Food Trucks, Kioske und kleine Unternehmen, die mit digitalen Menüs starten.',
    'plan_pro_title': 'Smart Pro',
    'plan_pro_desc': 'Ideal für wachsende Restaurants und Gastronomiebetriebe, die mehr Flexibilität benötigen.',
    'plan_premium_title': 'Smart Premium',
    'plan_premium_desc': 'Entwickelt für viel besuchte Restaurants, Hotelrestaurants, Ketten und Unternehmen mit höchsten Ansprüchen.',
    
    'vat_incl': 'inkl. MwSt.',
    'vat_incl_year': 'inkl. MwSt. / Jahr',
    'badge_popular': 'Am beliebtesten',
    
    'feat_qr': 'Digitale QR-Code-Speisekarte',
    'feat_mobile': 'Mobilfreundliches Design',
    'feat_unique_qr': 'Einzigartiger QR-Code',
    'feat_dish_photo_start': 'Jedes Gericht mit eigenem Foto (Optional* 10,00 €)',
    'feat_dish_photo_pro': 'Jedes Gericht mit eigenem Foto (Optional* 30,00 €)',
    'feat_dish_photo_premium': 'Jedes Gericht mit eigenem Foto (Optional* 90,00 €)',
    'pricing_photo_note': '* Geschätzte Höchstkosten, falls jeder Menüpunkt ein eigenes Foto erhält, bei 0,20 € pro Foto. Die Fotos werden vom Kunden bereitgestellt.',
    'feat_start_items': 'Bis zu 50 Menüpunkte',
    'feat_start_updates': '1 monatliche Menü-Aktualisierung',
    'feat_pro_items': 'Bis zu 150 Menüpunkte',
    'feat_pro_updates': '3 monatliche Menü-Aktualisierungen',
    'feat_pro_lang': '1 zusätzliche Sprache',
    'feat_premium_items': 'Bis zu 450 Menüpunkte',
    'feat_premium_updates': '6 monatliche Menü-Aktualisierungen',
    'feat_premium_lang': '5 zusätzliche Sprachen',
    'feat_billing_year': 'Abrechnungszeitraum: 1-Jahres-Abo',

    'btn_choose_start': 'Smart Start wählen',
    'btn_choose_pro': 'Smart Pro wählen',
    'btn_choose_premium': 'Smart Premium wählen',
    'pricing_questions': 'Fragen zu einem Tarif? Schreibe an',

    'sfm_pricing_title': '<span class="accent">Smart</span> FoodMatch™',
    'sfm_pricing_desc': 'Das intelligente Add-on für jedes Smart Menü. Ihre Gäste beantworten 3 kurze Fragen und erhalten sofort eine persönliche Empfehlung aus Ihrer Speisekarte.',
    'sfm_feat_1': 'Personalisierte Menü-Empfehlungen',
    'sfm_feat_2': 'Perfekt für Restaurants, Cafés, Bars und Imbisse',
    'sfm_feat_3': 'Höherer durchschnittlicher Bestellwert durch smarte Vorschläge',
    'sfm_feat_4': 'Vollständig in Ihr QR-Menü integriert',
    'sfm_available': 'Verfügbar für Smart Start, Smart Pro und Smart Premium.',
    'addons_pricing_heading': 'Add-ons',
    'addons_pricing_sub': 'Erweitern Sie jeden Plan mit diesen optionalen Extras.',
    'addon_photos_feat_1': 'Ein professionelles Foto für jedes Gericht',
    'addon_photos_feat_2': 'Hilft Gästen, schneller und mit mehr Zuversicht zu bestellen',
    'addon_photos_feat_3': 'Preis je nach Plan - siehe oben',
    'addon_photos_feat_4': 'Einmaliger Upload als ZIP-Datei',
    'addon_analytics_feat_1': 'Wöchentliche E-Mail mit den Besucherstatistiken Ihrer Speisekarte',
    'addon_analytics_feat_2': 'Top-Kategorien und -Gerichte auf einen Blick',
    'addon_analytics_feat_3': 'Live-Statistikseite - zum Teilen, ganz ohne Login',
    'addon_analytics_feat_4': 'Vollständig in Ihr QR-Menü integriert',
    'addon_hub_pricing_desc': 'Die Live-Bestellplattform für Ihr Restaurant. Gäste bestellen per QR-Code, während Kellner, Küche, Bar und Kasse in Echtzeit perfekt synchron bleiben.',
    'addon_hub_feat_1': 'QR-Bestellung für Gäste mit sofortiger Küchen- und Bar-Synchronisierung',
    'addon_hub_feat_2': 'Dashboards für Kellner, Küche, Bar und Kasse inklusive',
    'addon_hub_feat_3': 'Unbegrenzte Anzahl an Tischen',
    'addon_hub_feat_4': 'Vollständig in Ihr QR-Menü integriert',

    // --- FAQ Seite ---
    'faq_hero_title': '<span class="accent">FAQ</span>',
    'faq_hero_desc': 'Unsere Reise begann mit einer einfachen Idee: Restaurants mit einer modernen, auffälligen Marke zu digitalisieren. Hier ist, was uns Kunden meistens fragen, bevor sie starten.',
    'faq_q1': 'Brauche ich technische Vorkenntnisse?',
    'faq_a1': 'Nein. Wir übernehmen die komplette Einrichtung für Sie.',
    'faq_q2': 'Wie fange ich an?',
    'faq_a2': 'Wählen Sie einen Tarif, schließen Sie Ihre Bestellung ab und schicken Sie uns Ihre Speisekarte sowie Ihre Fotos.',
    'faq_q3': 'Müssen Kunden eine App herunterladen?',
    'faq_a3': 'Nein. Sie scannen einfach den QR-Code mit ihrer Smartphone-Kamera.',
    'faq_q4': 'Bieten Sie Support an?',
    'faq_a4': 'Ja. Wir sind immer für Sie da, wenn Sie Hilfe brauchen.',
    'faq_q5': 'Kann ich meine Speisekarte später aktualisieren?',
    'faq_a5': 'Ja. Menü-Updates sind je nach gewähltem Tarif inklusive.',
    'faq_q6': 'Kann ich meinen Tarif upgraden?',
    'faq_a6': 'Ja. Sie können jederzeit upgraden, wenn Ihr Geschäft wächst.',
    'faq_q7': 'Was passiert, nachdem ich meine Bestellung abgeschickt habe?',
    'faq_a7': 'Wir prüfen Ihre Details und Speisekarte und kontaktieren Sie direkt, um die nächsten Schritte zu besprechen.',
    'faq_beyond_accent': 'Mehr als',
    'faq_beyond_title': 'gewöhnlich',
    'faq_beyond_desc': 'Lernen Sie unser Unternehmen kennen und erfahren Sie, wie wir uns für Qualität und exzellenten Service einsetzen.',
    'faq_beyond_btn': 'Jetzt starten',

    // --- Order / Order Info Seite ---
    'order_overview_title': 'Ihre Bestellung auf einen Blick',
    'order_overview_desc': 'Folgen Sie diesen einfachen Schritten, um Ihre moderne digitale Speisekarte einzurichten.',
    'order_steps_heading': 'So bestellen Sie Ihr <span class="accent">digitales Menü</span>',
    'order_steps_sub': 'Wir haben den Prozess einfach, günstig und völlig unkompliziert gestaltet. Starten Sie in wenigen Minuten.',
    'step1_title': 'Wählen Sie Ihren Tarif',
    'step1_desc': 'Wählen Sie das Paket, das am besten zu Ihrem Betrieb passt: Smart Start, Smart Pro oder Smart Premium.',
    'step2_title': 'Geben Sie Ihre Daten ein',
    'step2_desc': 'Tragen Sie Ihren Vornamen, Nachnamen und Ihre E-Mail-Adresse ein.',
    'step3_title': 'Anfrage absenden',
    'step3_desc': 'Senden Sie uns Ihre Details und Speisekarte sicher über das Bestellformular.',
    'step4_title': 'Wir prüfen Ihre Speisekarte',
    'step4_desc': 'Wir prüfen Ihre hochgeladene Speisekarte und melden uns, falls wir Ihre Fotos oder weitere Branding-Details benötigen.',
    'step5_title': 'Wir erstellen Ihre digitale Speisekarte',
    'step5_desc': 'Unser Team erstellt Ihre professionelle QR-Code-Speisekarte, maßgeschneidert für Ihr Unternehmen.',
    'step6_title': 'Erhalten Sie Ihren QR-Code',
    'step6_desc': 'Wir senden Ihnen Ihren einzigartigen QR-Code und den Link zu Ihrer digitalen Speisekarte.',
    'step7_title': 'Live gehen',
    'step7_desc': 'Platzieren Sie Ihren QR-Code auf Tischen, Theken, Karten, Flyern oder Verpackungen und bedienen Sie Gäste sofort.',
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
    'placeholder_phone': '+49 151 23456789',
    'label_upload_title': 'Menü-PDF hochladen',
    'label_upload_sub': 'Hier klicken oder PDF-Datei hierher ziehen',
    'step_photo_label': '04 / FOTO-ZIP HOCHLADEN',
    'label_photo_upload_title': 'Foto-PNG hochladen',
    'label_photo_upload_sub': 'Hier klicken oder <strong>PNG ZIP</strong>-Datei hierher ziehen',
    'label_photo_naming_hint': '<strong>PNG-Hinweis:</strong> Menü-Titel "Bruschetta Classica" → Dateiname "Bruschetta_Classica.png"',
    'label_photo_upload_note': '<strong>Hinweis: Für die Qualität der Fotos ist der Kunde verantwortlich.</strong>',
    'addon_photo_mini': 'Smart DishPhoto™',
    'addon_photo_summary': 'Smart DishPhoto™ (optional)',
    'addon_sfm_mini': 'Smart FoodMatch™',
    'addon_sfm_summary': 'Smart FoodMatch™ (optional)',
    'addon_analytics_mini': 'Smart WeeklyReport™',
    'addon_analytics_summary': 'Smart WeeklyReport™ (optional)',
    'addon_hub_mini': 'Smart ServiceHub™',
    'addon_hub_summary': 'Smart ServiceHub™ (optional)',
    'stats_hero_title': 'Der wöchentliche Traffic Ihrer Speisekarte',
    'stats_hero_desc': 'Wie viele Gäste Ihre QR-Speisekarte gescannt haben, und welche Kategorien und Gerichte am häufigsten angesehen wurden.',
    'stats_error_desc': 'Dieser Link ist ungültig oder abgelaufen. Bitte kontaktieren Sie uns, wir helfen gerne weiter.',
    'stats_paused_desc': 'Das Weekly-Analytics-Report-Addon ist aktuell nicht mehr Teil Ihres Tarifs, daher gibt es hier nichts Neues zu sehen.',
    'stats_paused_cta': 'Wieder aktivieren? Kontaktieren Sie uns',
    'stats_loading': 'Statistik wird geladen…',
    'stats_visits_label': 'Besuche diese Woche',
    'stats_top_categories': 'Meistgesehene Kategorien',
    'stats_top_dishes': 'Meistgesehene Gerichte',
    'stats_sfm_title': 'Smart FoodMatch™',
    'stats_sfm_subhead': 'Top-Empfehlungen',
    'stats_sfm_course_starter': 'Vorspeisen',
    'stats_sfm_course_main': 'Hauptgerichte',
    'stats_sfm_course_dessert': 'Desserts',
    'contact_support': 'Support kontaktieren',
    'addons_hero_title': 'Ihre Zusatzmodule verwalten',
    'addons_hero_desc': 'Fügen Sie jederzeit ein Feature hinzu – Sie zahlen nur den anteiligen Betrag für den Rest Ihres laufenden Abo-Jahres.',
    'addons_error_desc': 'Dieser Link ist ungültig oder abgelaufen. Bitte kontaktieren Sie uns, wir helfen gerne weiter.',
    'addons_locked_desc': 'Ihr Abo ist aktuell nicht aktiv, daher können gerade keine Zusatzmodule hinzugefügt werden. Bitte nutzen Sie den Verlängerungs-Link aus Ihrer E-Mail oder kontaktieren Sie uns.',
    'addons_loading': 'Zusatzmodule werden geladen…',
    'addons_list_title': 'Verfügbare Zusatzmodule',
    'addon_prorate_note': 'Beim Hinzufügen wird nur der anteilige Betrag für den Rest Ihres laufenden Abo-Jahres berechnet - nicht ein volles Jahr. Ab der nächsten Verlängerung ist es automatisch mit dabei.',
    'submit_order_btn': 'Bestellantrag absenden',
    'summary_header': 'BESTELLÜBERSICHT',
    'summary_updates_label': 'Menü-Aktualisierungen',
    'summary_billing_label': 'Abrechnungszeitraum: 1 Jahr Abonnement',
    'total_due': 'Gesamtbetrag<br><span style="text-transform:none;font-weight:400;letter-spacing:0;font-size:.82em">inkl. MwSt.</span>',
    'included': 'Inklusive',
    'what_happens_next': 'Was passiert als Nächstes?',
    'what_happens_next_desc': 'Senden Sie Ihre Bestellanfrage ab und wir kontaktieren Sie mit den nächsten Schritten.',

    // --- Contact Seite ---
    'contact_hero_title': 'Kontaktieren Sie uns und starten Sie Ihre Reise zur digitalen Speisekarte',
    'contact_hero_desc': 'Egal, ob Sie bereit sind, Ihre erste digitale Speisekarte einzuführen, oder mehr über unsere Lösungen erfahren möchten – wir sind für Sie da.',
    'contact_section_heading': 'Kontaktieren Sie uns noch heute',
    'contact_label_company': 'Unternehmen',
    'contact_label_name': 'Name *',
    'contact_label_email': 'E-Mail-Adresse *',
    'contact_label_message': 'Nachricht *',
    'contact_submit': 'Formular absenden',
    'contact_hint': 'Füllen Sie das Formular aus, und wir melden uns so schnell wie möglich bei Ihnen.',
    'contact_next_heading': 'Wie geht es weiter?',
    'contact_next_desc': 'Wir melden uns innerhalb von 24 Stunden, besprechen Ihre Anforderungen, beantworten Ihre Fragen und empfehlen die passende digitale Menülösung für Ihr Unternehmen. Nach Ihrer Freigabe erstellen und richten wir Ihr digitales Menü ein, generieren Ihren QR-Code und machen alles schnell für Ihre Gäste bereit.',
    'contact_next_intro': 'Lassen Sie uns gemeinsam ein smarteres Restauranterlebnis schaffen.'
    ,
    'refund_hero_title': 'Rückerstattungsrichtlinie', 'refund_hero_desc': 'Bitte lesen Sie unsere Rückerstattungsrichtlinie sorgfältig, bevor Sie eine Bestellung aufgeben.', 'refund_updated': 'Zuletzt aktualisiert: September 2026', 'refund_intro_1': 'Bei', 'refund_intro_2': 'ist die Kundenzufriedenheit wichtig. Bitte lesen Sie unsere Rückerstattungsrichtlinie sorgfältig, bevor Sie eine Bestellung aufgeben.', 'refund_h2_digital': 'Digitale Dienstleistungen und individuelle Arbeiten', 'refund_p_digital': 'Unsere Produkte und Dienstleistungen sind individuell erstellte digitale Lösungen. Da die Arbeit unmittelbar nach Bestätigung einer Bestellung beginnt, gelten folgende Rückerstattungsregeln:', 'refund_li_before_title': 'Bevor die Arbeit begonnen hat:', 'refund_li_before_desc': 'Kunden können innerhalb von 24 Stunden nach der Bestellung eine vollständige Rückerstattung anfordern, sofern noch keine Arbeit begonnen hat.', 'refund_li_after_title': 'Nachdem die Arbeit begonnen hat:', 'refund_li_after_desc': 'Sobald Design, Entwicklung, Einrichtung oder Anpassung begonnen haben, sind Rückerstattungen für abgeschlossene oder bereits laufende Arbeiten nicht möglich.', 'refund_qr_note_title': 'Wichtiger Hinweis zu digitalen QR-Menüs:', 'refund_qr_note_desc': 'Aufgrund der individuellen und digitalen Art unserer Dienstleistungen sind Rückerstattungen nach Beginn der Design- oder Entwicklungsarbeiten nicht möglich.', 'refund_h2_completed': 'Abgeschlossene Projekte', 'refund_p_completed': 'Für abgeschlossene digitale Menüprojekte, die dem Kunden übergeben wurden, werden keine Rückerstattungen gewährt.', 'refund_h2_tech': 'Technische Probleme', 'refund_p_tech': 'Wenn ein von Smart Menu Solutions verursachtes technisches Problem die vereinbarte Funktion verhindert, bemühen wir uns angemessen um eine Lösung. Kann das Problem nicht behoben werden, kann nach unserem Ermessen eine teilweise oder vollständige Rückerstattung angeboten werden.', 'refund_h2_sub': 'Abonnementdienste (falls zutreffend)', 'refund_p_sub': 'Bei wiederkehrenden Dienstleistungen können Kunden jederzeit kündigen. Die Kündigung verhindert zukünftige Abrechnungen, bereits geleistete Zahlungen sind jedoch grundsätzlich nicht erstattungsfähig.', 'refund_h2_contact': 'Kontakt', 'refund_p_contact': 'Für Rückerstattungsanfragen oder Fragen kontaktieren Sie uns bitte unter:', 'imprint_main_title': 'Impressum <span class="accent">Rechtliche Hinweise</span>', 'imprint_hero_desc': 'Geschäftsinformationen und rechtliche Kontaktdaten.', 'imprint_effective_date': 'Gültig ab: 1. September 2026', 'imprint_business_info': 'Geschäftsinformationen', 'imprint_business_name_label': 'Firmenname:', 'imprint_owner_label': 'Inhaber:', 'imprint_location_label': 'Standort:', 'imprint_location_value': 'Rhodos, Griechenland', 'imprint_email_label': 'E-Mail:', 'imprint_disclaimer_heading': 'Haftungsausschluss', 'imprint_disclaimer_text': 'Die Informationen auf dieser Website dienen ausschließlich allgemeinen Informationszwecken. Smart Menu Solutions bemüht sich, die Informationen aktuell und korrekt zu halten. Für Vollständigkeit, Zuverlässigkeit oder Richtigkeit wird jedoch keine Garantie übernommen.', 'imprint_external_heading': 'Externe Links', 'imprint_external_text': 'Diese Website kann Links zu externen Websites enthalten. Smart Menu Solutions ist nicht für deren Inhalte, Datenschutzpraktiken oder Verfügbarkeit verantwortlich.', 'imprint_copyright_heading': 'Urheberrechtshinweis', 'imprint_copyright_text1': 'Alle Inhalte dieser Website, einschließlich Texte, Grafiken, Logos, Bilder und Designelemente, sind, sofern nicht anders angegeben, Eigentum von Smart Menu Solutions.', 'imprint_copyright_text2': 'Die Vervielfältigung oder Weitergabe von Website-Inhalten ohne vorherige schriftliche Genehmigung ist untersagt.', 'imprint_contact_heading': 'Kontakt', 'imprint_contact_text': 'Bei rechtlichen oder geschäftlichen Fragen kontaktieren Sie uns bitte:'
  }
};

var policyTranslations = {
  en: {
    refund_hero_title:'Refund <span class="accent">Policy</span>', refund_hero_desc:'Please read our refund policy carefully before placing an order.', refund_updated:'Last updated: September 2026', refund_intro_1:'At', refund_intro_2:'customer satisfaction is important to us. Please read our refund policy carefully before placing an order.', refund_h2_digital:'Digital Services and Custom Work', refund_p_digital:'Our products and services are customized digital solutions. Because work begins immediately after an order is confirmed, refunds are handled as follows:', refund_li_before_title:'Before work has started:', refund_li_before_desc:'Customers may request a full refund within 24 hours of placing an order if no work has been started.', refund_li_after_title:'After work has started:', refund_li_after_desc:'Once design, development, setup, or customization work has begun, refunds are not available for completed work or work already in progress.', refund_qr_note_title:'Important Note for Digital QR Menus:', refund_qr_note_desc:'Due to the custom and digital nature of our services, refunds cannot be provided once design or development work has commenced.', refund_h2_completed:'Completed Projects', refund_p_completed:'Refunds are not provided for completed digital menu projects that have been delivered to the customer.', refund_h2_tech:'Technical Issues', refund_p_tech:'If a technical issue caused by Smart Menu Solutions prevents the service from functioning as agreed, we will make reasonable efforts to resolve the issue. If the issue cannot be resolved, a partial or full refund may be offered at our discretion.', refund_h2_sub:'Subscription Services (if applicable)', refund_p_sub:'For recurring services, customers may cancel at any time. Cancellation will prevent future billing, but payments already made are generally non-refundable.', refund_h2_contact:'Contact', refund_p_contact:'For refund requests or questions, please contact us at:', imprint_main_title:'Imprint <span class="accent">Legal Notice</span>', imprint_hero_desc:'Business information and legal contact details.', imprint_effective_date:'Effective date: 1 September 2026', imprint_business_info:'Business Information', imprint_business_name_label:'Business Name:', imprint_owner_label:'CEO:', imprint_location_label:'Location:', imprint_location_value:'Rhodes, Greece', imprint_email_label:'Email:', imprint_disclaimer_heading:'Disclaimer', imprint_disclaimer_text:'The information provided on this website is for general informational purposes only. Smart Menu Solutions makes every effort to keep the information on this website accurate and up to date. However, no guarantees are made regarding completeness, reliability, or accuracy.', imprint_external_heading:'External Links', imprint_external_text:'This website may contain links to external websites. Smart Menu Solutions is not responsible for the content, privacy practices, or availability of third-party websites.', imprint_copyright_heading:'Copyright Notice', imprint_copyright_text1:'All content on this website, including text, graphics, logos, images, and design elements, is the property of Smart Menu Solutions unless otherwise stated.', imprint_copyright_text2:'Reproduction or redistribution of website content without prior written permission is prohibited.', imprint_contact_heading:'Contact', imprint_contact_text:'If you have any legal or business-related questions, please contact:', privacy_page_title:'Privacy <span class="accent">Policy</span>', privacy_page_desc:'How we collect, use, and protect your personal information.', privacy_effective:'Effective date: 1 September 2026', privacy_intro_heading:'Introduction and organizational info', privacy_scope_heading:'Scope and application', privacy_data_heading:'Data collection and processing', privacy_storage_heading:'Data storage and protection', privacy_rights_heading:'User rights and choices', privacy_cookies_heading:'Cookies and tracking technologies', privacy_us_heading:'Compliance with United States privacy laws', privacy_marketing_heading:'Direct marketing and communications', privacy_updates_heading:'Policy updates and changes', privacy_contact_heading:'Contact us',
    terms_hero_title:'Terms of <span class="accent">Service</span>', terms_hero_desc:'The terms that apply to our digital menu services.', terms_updated:'Effective date: 1 September 2026', terms_h2_services:'Services', terms_p_services:'Smart Menu Solutions provides digital QR menu design, setup and support services as described in the selected order package.', terms_h2_responsibilities:'Customer responsibilities', terms_p_responsibilities:'You are responsible for providing accurate business information, menu content, prices, branding assets and permissions for submitted materials.', terms_h2_payment:'Payment and delivery', terms_p_payment:'Prices, included features and delivery expectations are shown with each package. Work begins after the order and required materials are received.', terms_h2_ip:'Intellectual property', terms_p_ip:'You retain rights to materials you provide. Smart Menu Solutions retains rights to its platform, templates and underlying implementation.', terms_h2_contact:'Contact', terms_p_contact:'Questions about these terms can be sent to <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>.',
    cookie_hero_title:'Cookie <span class="accent">Policy</span>', cookie_hero_desc:'How this website uses cookies and similar technologies.', cookie_updated:'Effective date: 1 September 2026', cookie_h2_use:'Current use', cookie_p_use:'This website does not intentionally set analytics or advertising cookies. Essential browser storage may be used to remember language preferences or support the builder session.', cookie_h2_third:'Third-party services', cookie_p_third:'Some pages load services such as Supabase, payment providers, PDF tools or QR generation. Those services may process technical data under their own policies.', cookie_h2_choices:'Your choices', cookie_p_choices:'You can clear browser storage or block non-essential cookies through your browser settings. Contact us at <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a> with questions.',
    disclaimer_hero_title:'<span class="accent">Disclaimer</span>', disclaimer_hero_desc:'Important information about this website and its content.', disclaimer_h2_general:'General information', disclaimer_p_general:'The information on this website is provided for general information only. We make reasonable efforts to keep it accurate and current, but do not guarantee completeness or uninterrupted availability.', disclaimer_h2_links:'Third-party links', disclaimer_p_links:'Links to third-party services are provided for convenience. Smart Menu Solutions is not responsible for their content, policies or availability.', disclaimer_h2_contact:'Contact', disclaimer_p_contact:'For questions, contact <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>.',
    label_company:'Company name <span style="font-weight:400">(optional)</span>', label_phone:'Phone number <span style="font-weight:400">(optional)</span>', consent_policies:'I agree to the <a href="privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a> and <a href="terms-of-service.html" target="_blank" rel="noopener">Terms of Service</a>.',
    footer_terms:'Terms', footer_cookies:'Cookie Policy', footer_disclaimer:'Disclaimer',
    renewal_hero_title:'Renew your <span class="accent">subscription</span>', renewal_hero_desc:'Confirm your details, choose your plan, and upload your current menu to continue for another year.', renewal_form_title:'Renew your subscription', renewal_step_plan_label:'02 / Confirm or change your plan', renewal_step_upload_label:'03 / Upload your current menu', renewal_label_upload_title:'Upload your menu PDF (new or unchanged)', renewal_submit_btn:'Renew now', renewal_summary_header:'Renewal summary', renewal_what_happens_next_desc:'Your subscription is renewed for another year as soon as payment succeeds.'
  },
  de: {
    refund_hero_title:'Rückerstattungs<span class="accent">richtlinie</span>', refund_hero_desc:'Bitte lesen Sie unsere Rückerstattungsrichtlinie sorgfältig, bevor Sie eine Bestellung aufgeben.', refund_updated:'Zuletzt aktualisiert: September 2026', refund_intro_1:'Bei', refund_intro_2:'ist die Kundenzufriedenheit wichtig. Bitte lesen Sie unsere Rückerstattungsrichtlinie sorgfältig, bevor Sie eine Bestellung aufgeben.', refund_h2_digital:'Digitale Dienstleistungen und individuelle Arbeiten', refund_p_digital:'Unsere Produkte und Dienstleistungen sind individuell erstellte digitale Lösungen. Da die Arbeit unmittelbar nach Bestätigung einer Bestellung beginnt, gelten folgende Rückerstattungsregeln:', refund_li_before_title:'Bevor die Arbeit begonnen hat:', refund_li_before_desc:'Kunden können innerhalb von 24 Stunden nach der Bestellung eine vollständige Rückerstattung anfordern, sofern noch keine Arbeit begonnen hat.', refund_li_after_title:'Nachdem die Arbeit begonnen hat:', refund_li_after_desc:'Sobald Design, Entwicklung, Einrichtung oder Anpassung begonnen haben, sind Rückerstattungen für abgeschlossene oder bereits laufende Arbeiten nicht möglich.', refund_qr_note_title:'Wichtiger Hinweis zu digitalen QR-Menüs:', refund_qr_note_desc:'Aufgrund der individuellen und digitalen Art unserer Dienstleistungen sind Rückerstattungen nach Beginn der Design- oder Entwicklungsarbeiten nicht möglich.', refund_h2_completed:'Abgeschlossene Projekte', refund_p_completed:'Für abgeschlossene digitale Menüprojekte, die dem Kunden übergeben wurden, werden keine Rückerstattungen gewährt.', refund_h2_tech:'Technische Probleme', refund_p_tech:'Wenn ein von Smart Menu Solutions verursachtes technisches Problem die vereinbarte Funktion verhindert, bemühen wir uns angemessen um eine Lösung. Kann das Problem nicht behoben werden, kann nach unserem Ermessen eine teilweise oder vollständige Rückerstattung angeboten werden.', refund_h2_sub:'Abonnementdienste (falls zutreffend)', refund_p_sub:'Bei wiederkehrenden Dienstleistungen können Kunden jederzeit kündigen. Die Kündigung verhindert zukünftige Abrechnungen, bereits geleistete Zahlungen sind jedoch grundsätzlich nicht erstattungsfähig.', refund_h2_contact:'Kontakt', refund_p_contact:'Für Rückerstattungsanfragen oder Fragen kontaktieren Sie uns bitte unter:', imprint_main_title:'Impressum <span class="accent">Rechtliche Hinweise</span>', imprint_hero_desc:'Geschäftsinformationen und rechtliche Kontaktdaten.', imprint_effective_date:'Gültig ab: 1. September 2026', imprint_business_info:'Geschäftsinformationen', imprint_business_name_label:'Firmenname:', imprint_owner_label:'Geschäftsleitung:', imprint_location_label:'Standort:', imprint_location_value:'Rhodos, Griechenland', imprint_email_label:'E-Mail:', imprint_disclaimer_heading:'Haftungsausschluss', imprint_disclaimer_text:'Die Informationen auf dieser Website dienen ausschließlich allgemeinen Informationszwecken. Smart Menu Solutions bemüht sich, die Informationen aktuell und korrekt zu halten. Für Vollständigkeit, Zuverlässigkeit oder Richtigkeit wird jedoch keine Garantie übernommen.', imprint_external_heading:'Externe Links', imprint_external_text:'Diese Website kann Links zu externen Websites enthalten. Smart Menu Solutions ist nicht für deren Inhalte, Datenschutzpraktiken oder Verfügbarkeit verantwortlich.', imprint_copyright_heading:'Urheberrechtshinweis', imprint_copyright_text1:'Alle Inhalte dieser Website, einschließlich Texte, Grafiken, Logos, Bilder und Designelemente, sind, sofern nicht anders angegeben, Eigentum von Smart Menu Solutions.', imprint_copyright_text2:'Die Vervielfältigung oder Weitergabe von Website-Inhalten ohne vorherige schriftliche Genehmigung ist untersagt.', imprint_contact_heading:'Kontakt', imprint_contact_text:'Bei rechtlichen oder geschäftlichen Fragen kontaktieren Sie uns bitte:', privacy_page_title:'Datenschutz<span class="accent">richtlinie</span>', privacy_page_desc:'So erfassen, verwenden und schützen wir Ihre persönlichen Daten.', privacy_effective:'Gültig ab: 1. September 2026', privacy_intro_heading:'Einleitung und Unternehmens informationen', privacy_scope_heading:'Geltungsbereich und Anwendung', privacy_data_heading:'Datenerfassung und Verarbeitung', privacy_storage_heading:'Datenspeicherung und Schutz', privacy_rights_heading:'Ihre Rechte und Wahlmöglichkeiten', privacy_cookies_heading:'Cookies und Tracking-Technologien', privacy_us_heading:'Einhaltung der US-Datenschutzgesetze', privacy_marketing_heading:'Direktmarketing und Kommunikation', privacy_updates_heading:'Aktualisierungen und Änderungen der Richtlinie', privacy_contact_heading:'Kontakt',
    terms_hero_title:'Nutzungs<span class="accent">bedingungen</span>', terms_hero_desc:'Die Bedingungen, die für unsere digitalen Menü-Dienstleistungen gelten.', terms_updated:'Gültig ab: 1. September 2026', terms_h2_services:'Leistungen', terms_p_services:'Smart Menu Solutions bietet Design, Einrichtung und Support für digitale QR-Menüs gemäß dem gewählten Bestellpaket.', terms_h2_responsibilities:'Pflichten des Kunden', terms_p_responsibilities:'Sie sind dafür verantwortlich, korrekte Geschäftsangaben, Menüinhalte, Preise, Markenmaterialien und die nötigen Rechte für eingereichte Inhalte bereitzustellen.', terms_h2_payment:'Zahlung und Lieferung', terms_p_payment:'Preise, enthaltene Leistungen und Lieferzeiten sind bei jedem Paket angegeben. Die Arbeit beginnt, nachdem die Bestellung und die benötigten Materialien eingegangen sind.', terms_h2_ip:'Geistiges Eigentum', terms_p_ip:'Sie behalten die Rechte an den von Ihnen bereitgestellten Materialien. Smart Menu Solutions behält die Rechte an seiner Plattform, den Vorlagen und der zugrunde liegenden technischen Umsetzung.', terms_h2_contact:'Kontakt', terms_p_contact:'Fragen zu diesen Bedingungen können an <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a> gesendet werden.',
    cookie_hero_title:'Cookie-<span class="accent">Richtlinie</span>', cookie_hero_desc:'Wie diese Website Cookies und ähnliche Technologien verwendet.', cookie_updated:'Gültig ab: 1. September 2026', cookie_h2_use:'Aktuelle Nutzung', cookie_p_use:'Diese Website setzt bewusst keine Analyse- oder Werbe-Cookies. Notwendiger Browser-Speicher kann verwendet werden, um Spracheinstellungen zu merken oder die Builder-Sitzung zu unterstützen.', cookie_h2_third:'Drittanbieter-Dienste', cookie_p_third:'Manche Seiten laden Dienste wie Supabase, Zahlungsanbieter, PDF-Werkzeuge oder QR-Code-Erstellung. Diese Dienste können technische Daten gemäß ihren eigenen Richtlinien verarbeiten.', cookie_h2_choices:'Ihre Möglichkeiten', cookie_p_choices:'Sie können den Browser-Speicher löschen oder nicht notwendige Cookies über Ihre Browser-Einstellungen blockieren. Bei Fragen kontaktieren Sie uns unter <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>.',
    disclaimer_hero_title:'<span class="accent">Haftungsausschluss</span>', disclaimer_hero_desc:'Wichtige Informationen über diese Website und ihre Inhalte.', disclaimer_h2_general:'Allgemeine Informationen', disclaimer_p_general:'Die Informationen auf dieser Website dienen ausschließlich allgemeinen Informationszwecken. Wir bemühen uns angemessen, sie aktuell und korrekt zu halten, garantieren jedoch keine Vollständigkeit oder ununterbrochene Verfügbarkeit.', disclaimer_h2_links:'Links zu Drittanbietern', disclaimer_p_links:'Links zu Diensten Dritter dienen der Nutzerfreundlichkeit. Smart Menu Solutions übernimmt keine Verantwortung für deren Inhalte, Richtlinien oder Verfügbarkeit.', disclaimer_h2_contact:'Kontakt', disclaimer_p_contact:'Bei Fragen kontaktieren Sie <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>.',
    label_company:'Firmenname <span style="font-weight:400">(optional)</span>', label_phone:'Telefonnummer <span style="font-weight:400">(optional)</span>', consent_policies:'Ich stimme der <a href="privacy-policy.html" target="_blank" rel="noopener">Datenschutzerklärung</a> und den <a href="terms-of-service.html" target="_blank" rel="noopener">Nutzungsbedingungen</a> zu.',
    footer_terms:'AGB', footer_cookies:'Cookie-Richtlinie', footer_disclaimer:'Haftungsausschluss',
    renewal_hero_title:'Verlängern Sie Ihr <span class="accent">Abonnement</span>', renewal_hero_desc:'Bestätigen Sie Ihre Angaben, wählen Sie Ihren Plan und laden Sie Ihr aktuelles Menü hoch, um ein weiteres Jahr fortzufahren.', renewal_form_title:'Abonnement verlängern', renewal_step_plan_label:'02 / Plan bestätigen oder ändern', renewal_step_upload_label:'03 / Aktuelles Menü hochladen', renewal_label_upload_title:'Menü-PDF hochladen (neu oder unverändert)', renewal_submit_btn:'Jetzt verlängern', renewal_summary_header:'Verlängerungsübersicht', renewal_what_happens_next_desc:'Ihr Abonnement wird um ein weiteres Jahr verlängert, sobald die Zahlung erfolgreich war.'
  }
};
Object.assign(translations.en, policyTranslations.en);
Object.assign(translations.de, policyTranslations.de);
Object.assign(translations.en, { privacy_storage_sub:'Data storage', privacy_processing_sub:'Data processing agreements', privacy_control_sub:'Transparency and control', privacy_rights_sub:'Exercising your rights', privacy_cookies_sub:'Understanding cookies and tracking technologies', privacy_use_sub:'How we use these technologies', privacy_choices_sub:'Your choices and consent', privacy_individual_sub:'A. Individual rights', privacy_know_sub:'B. Right to know', privacy_delete_sub:'C. Right to delete', privacy_correct_sub:'D. Right to correct', privacy_limit_sub:'E. Right to limit', privacy_optout_sub:'F. Right to opt out', privacy_nondiscrimination_sub:'G. Right to non-discrimination', privacy_requests_sub:'H. Submitting requests', privacy_sensitive_sub:'I. Sensitive personal data', privacy_consent_sub:'Obtaining consent for direct marketing', privacy_types_sub:'Types of direct marketing communications', privacy_notification_sub:'Notification of changes' });
Object.assign(translations.de, { privacy_storage_sub:'Datenspeicherung', privacy_processing_sub:'Vereinbarungen zur Datenverarbeitung', privacy_control_sub:'Transparenz und Kontrolle', privacy_rights_sub:'Ausübung Ihrer Rechte', privacy_cookies_sub:'Cookies und Tracking-Technologien verstehen', privacy_use_sub:'So verwenden wir diese Technologien', privacy_choices_sub:'Ihre Wahlmöglichkeiten und Einwilligung', privacy_individual_sub:'A. Individuelle Rechte', privacy_know_sub:'B. Recht auf Auskunft', privacy_delete_sub:'C. Recht auf Löschung', privacy_correct_sub:'D. Recht auf Berichtigung', privacy_limit_sub:'E. Recht auf Einschränkung', privacy_optout_sub:'F. Recht auf Widerspruch', privacy_nondiscrimination_sub:'G. Schutz vor Diskriminierung', privacy_requests_sub:'H. Anträge stellen', privacy_sensitive_sub:'I. Sensible personenbezogene Daten', privacy_consent_sub:'Einwilligung für Direktmarketing', privacy_types_sub:'Arten der Direktmarketing-Kommunikation', privacy_notification_sub:'Benachrichtigung über Änderungen' });

Object.assign(translations.de, { refund_hero_title: 'Rückerstattungs<span class="accent">richtlinie</span>' });

// --- Additional pages wired up 2026-09-12: contact fixes (missing accent
// span / truncated copy in the entries above), 404/success/cancel,
// renewal error state, about.html, and the full privacy-policy.html body
// (previously only its headings were translated). ---
Object.assign(translations.en, {
  contact_hero_title: 'Get in touch to start your <span class="accent">digital menu</span> journey',
  contact_hero_desc: "Whether you're ready to launch your first digital menu or want to learn more about our solutions, we're here to help. Contact Smart Menu Solutions today and discover how simple and affordable it is to modernise your restaurant, café, bar, or food business.",
  contact_next_intro: "Let's create a smarter dining experience for your customers.<br><strong>Smart menus. Better experiences.</strong>",
  contact_email_label: 'Email',
  contact_instagram_label: 'Instagram',
  contact_tiktok_label: 'TikTok',

  notfound_desc: 'That page could not be found.',
  notfound_help: 'Use the home page or contact our support team if you followed a broken link.',
  return_home: 'Return home',
  contact_support: 'Contact support',

  cancel_title: 'Checkout <span class="accent">cancelled</span>',
  cancel_desc: 'No payment was completed.',
  cancel_safe_heading: 'Your information is safe',
  cancel_safe_desc: 'You can return to the order page and try again, or contact our team for help.',
  cancel_try_again: 'Try again',

  success_title: 'Order <span class="accent">received</span>',
  success_desc: 'Thank you. We will contact you with the next steps.',
  success_next_heading: 'What happens next?',
  success_next_desc: 'We review your details and menu, confirm the selected package and begin setup after the required information is complete.',

  renewal_error_desc: 'This renewal link is invalid or has expired. Please contact us so we can help.',

  aboutpage_hero_title: 'About <span class="accent">Us</span>',
  aboutpage_hero_desc: 'Digital menu tools built for hospitality teams.',
  aboutpage_mission_heading: 'Our mission',
  aboutpage_mission_p: 'Smart Menu Solutions helps restaurants, cafes, bars and hotels replace static menus with fast, accessible digital experiences.',
  aboutpage_provide_heading: 'What we provide',
  aboutpage_provide_p: 'We create branded QR menus, organize menu content, support multiple languages and keep updates simple for busy teams.',
  aboutpage_vision_heading: 'Our vision',
  aboutpage_vision_p: 'We believe every guest should be able to open a clear, beautiful menu instantly from any phone, without downloading an app.',
  aboutpage_questions: 'Questions? Contact us at',
  aboutpage_footer_link: 'About',

  privacy_intro_p1: 'We, at Smart Menu Solutions, are dedicated to serving our customers and contacts to the best of our abilities. Part of our commitment involves the responsible management of personal information collected through our website and any related interactions. Our primary goals in processing this information include:',
  privacy_intro_ul: '<li>Enhancing the user experience on our platform by understanding customer needs and preferences.</li><li>Providing timely support and responding to inquiries or service requests.</li><li>Improving our products and services to meet the evolving demands of our users.</li><li>Conducting necessary business operations, such as billing and account management.</li>',
  privacy_intro_p2: 'It is our policy to process personal information with the utmost respect for privacy and security. We adhere to all relevant regulations and guidelines to ensure that the data we handle is protected against unauthorized access, disclosure, alteration, and destruction.',
  privacy_intro_p3: 'We do not have a designated Data Protection Officer (DPO) but remain fully committed to addressing your privacy concerns. Should you have any questions or require further information about how we manage personal information, please contact us at <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>.',
  privacy_intro_p4: 'Your privacy is our priority. This commitment extends to our collaboration with third-party services that may process personal information on our behalf, such as in the case of sending invoices. All activities are conducted in strict compliance with applicable privacy laws.',
  privacy_scope_p: 'This privacy policy applies to website visitors, people who contact us, and customers who request or use our services.',
  privacy_data_p1: 'We gather personal data through various interactions, including when you use our services or products &mdash; such as our Digital QR Menu Builder, which creates custom-branded, web-based menus accessible instantly via a smartphone camera scan without requiring an app download &mdash; or when you directly provide information to us.',
  privacy_data_p2: 'The following list details the types of personal information we may process:',
  privacy_data_ul1: '<li>First and last name</li><li>Contact details and information included in your service request</li><li>Technical information that may be recorded in standard server security logs, such as IP address, browser type, and request time</li>',
  privacy_data_p3: 'We only process information that is essential for delivering our services, complying with legal obligations, or enhancing your user experience. The data we collect serves multiple purposes, including:',
  privacy_data_ul2: '<li>Responding to enquiries and processing service requests</li><li>Customer support</li>',
  privacy_data_p4: 'We process your personal information transparently and in accordance with your preferences and applicable privacy laws, and only for the purposes for which it was collected or that you have authorised.',
  privacy_data_p5: 'When you submit a contact or order form, the information and any attached menu file are transmitted through FormSubmit so the request can be delivered to our email inbox. Please do not include sensitive personal or financial information in your message or uploaded document.',
  privacy_storage_ul: '<li>Personal information is stored on secure servers located in Germany. For services that require international data transfer, we ensure such transfers comply with applicable laws and maintain data protection standards equivalent to those in our primary location.</li><li>We partner with reputable data hosting providers committed to state-of-the-art security measures, selected for their adherence to stringent data protection standards.</li>',
  privacy_processing_p: 'When we share your data with third-party service providers, we do so under the protection of Data Processing Agreements (DPAs) that ensure your information is managed in accordance with GDPR and other relevant data protection laws. These agreements require third parties to implement adequate technical and organizational security measures.',
  privacy_control_p: 'We believe in transparency and giving you control over your personal information. You will always be informed of any significant changes to our sharing practices and, where applicable, given the option to consent to such changes. For any questions about how we share and disclose personal information, contact us at <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>.',
  privacy_rights_p: 'We recognize and respect your rights regarding your personal information under the General Data Protection Regulation (GDPR) and other applicable data protection laws:',
  privacy_rights_ul: '<li><strong>Right of access</strong> (Art. 15 GDPR) &mdash; request access to the personal information we hold about you and how we process it.</li><li><strong>Right to rectification</strong> (Art. 16 GDPR) &mdash; request correction or completion of incorrect or incomplete information.</li><li><strong>Right to erasure</strong> ("right to be forgotten," Art. 17 GDPR) &mdash; request deletion of your personal information when it is no longer necessary for the purposes it was collected for.</li><li><strong>Right to restriction of processing</strong> (Art. 18 GDPR) &mdash; request that we restrict processing under certain conditions.</li><li><strong>Right to data portability</strong> (Art. 20 GDPR) &mdash; receive your data in a structured, commonly used, machine-readable format.</li><li><strong>Right to object</strong> (Art. 21 GDPR) &mdash; object to processing under certain conditions, including for direct marketing.</li><li><strong>Right to withdraw consent</strong> (Art. 7(3) GDPR) &mdash; withdraw consent at any time where processing is based on consent.</li><li><strong>Right to lodge a complaint</strong> (Art. 77 GDPR) &mdash; lodge a complaint with a supervisory authority if you believe our processing violates data protection law.</li>',
  privacy_rights_exercise_p: 'To exercise any of these rights, contact us at <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>. We will respond in accordance with applicable data protection laws and within the required timeframes. In some cases we may need to verify your identity to protect the security of your personal information.',
  privacy_cookies_p1: 'We value your privacy and are transparent about our use of cookies and other tracking technologies. These technologies help ensure the smooth operation of our digital platforms, enhance your user experience, and provide insights that help us improve.',
  privacy_cookies_p2: 'Cookies are small data files placed on your device that let us remember your preferences and collect information about your website usage. Tracking technologies such as web beacons and pixel tags help us understand how you interact with our site.',
  privacy_use_ul: "<li><strong>Essential cookies</strong> &mdash; necessary for the website's functionality, such as authentication and security. They do not require consent.</li><li><strong>Performance and analytics cookies</strong> &mdash; collect information about how visitors use the site, to help us improve it.</li><li><strong>Functional cookies</strong> &mdash; enable enhanced functionality and personalisation, such as remembering your preferences.</li><li><strong>Advertising and targeting cookies</strong> &mdash; used to deliver more relevant advertisements and measure campaign effectiveness.</li>",
  privacy_choices_p: 'The current website does not intentionally set analytics or advertising cookies. If non-essential cookies are introduced in the future, we will update this policy and provide appropriate consent controls where required.',
  privacy_us_p: 'For residents of the United States, the California Consumer Privacy Act and related state laws provide additional specific rights regarding your personal information.',
  privacy_individual_p: 'California residents have specific rights regarding their personal information, additional to those described above.',
  privacy_know_p: 'You may request that we disclose what personal information we have collected, used, shared, or sold about you and why, including: the categories of personal information collected; specific pieces of personal information collected; the categories of sources of that information; the purposes for which it is used; and the categories of third parties with whom it is shared or sold.',
  privacy_delete_p: 'You may request that we delete personal information we have collected about you.',
  privacy_correct_p: 'You may ask us to correct inaccurate information we hold about you.',
  privacy_limit_p: 'You can request that we only use your sensitive personal information (for example, precise geolocation or government ID numbers) for limited purposes, such as providing the services you requested.',
  privacy_optout_p: 'Smart Menu Solutions does not sell or share personal information. If your data is ever sold or shared, you have the right to opt out of that sale or sharing.',
  privacy_nondiscrimination_p: 'You have the right to be protected from discrimination for exercising your privacy rights.',
  privacy_requests_p: 'You may submit a request by emailing <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>. We will compare the information you submit with our records to verify your request and respond in accordance with applicable requirements. To appeal a decision, contact us within 60 days of our response, including your original request, the date of our response, and why you believe the decision was incorrect.',
  privacy_sensitive_p: 'We only process sensitive personal data with your prior consent and for specific, clearly disclosed purposes. You may withdraw consent at any time by emailing us.',
  privacy_marketing_p: 'We may use your personal information to send you direct marketing communications about our products, services, promotions, and other information we believe may interest you, in compliance with the GDPR and the ePrivacy Directive.',
  privacy_consent_ul: '<li><strong>Opt-in consent</strong> &mdash; we obtain explicit opt-in consent before sending marketing communications, where required by law.</li><li><strong>Unsubscribe option</strong> &mdash; every marketing communication includes clear instructions to unsubscribe; we promptly honour opt-out requests.</li>',
  privacy_types_p: 'We may contact you via email, SMS, telephone, or social media platforms.',
  privacy_updates_p: 'We may update this privacy policy from time to time to reflect changes in legal requirements, industry standards, or our business operations.',
  privacy_notification_p: 'In the event of significant changes that may affect your rights or how we handle your personal information, we will provide notice through prominent means such as email or website notifications, and indicate the effective date of the updated policy at the top of this document. We encourage you to review this policy periodically; continued use of our services after changes signifies acceptance of the updated terms.',
  privacy_contact_p: "If you have any questions or concerns about this privacy policy, please contact us at <a href=\"mailto:smartmenusolutions@outlook.com\">smartmenusolutions@outlook.com</a>. We're here to help."
});
Object.assign(translations.de, {
  contact_hero_title: 'Kontaktieren Sie uns und starten Sie Ihre Reise zur <span class="accent">digitalen Speisekarte</span>',
  contact_hero_desc: 'Egal, ob Sie bereit sind, Ihre erste digitale Speisekarte einzuführen, oder mehr über unsere Lösungen erfahren möchten – wir sind für Sie da. Kontaktieren Sie Smart Menu Solutions noch heute und erfahren Sie, wie einfach und erschwinglich es ist, Ihr Restaurant, Café, Ihre Bar oder Ihr Food-Business zu modernisieren.',
  contact_next_intro: 'Lassen Sie uns gemeinsam ein smarteres Restauranterlebnis schaffen.<br><strong>Smarte Menüs. Bessere Erlebnisse.</strong>',
  contact_email_label: 'E-Mail',
  contact_instagram_label: 'Instagram',
  contact_tiktok_label: 'TikTok',

  notfound_desc: 'Diese Seite konnte nicht gefunden werden.',
  notfound_help: 'Nutzen Sie die Startseite oder kontaktieren Sie unser Support-Team, falls Sie einem defekten Link gefolgt sind.',
  return_home: 'Zur Startseite',
  contact_support: 'Support kontaktieren',

  cancel_title: 'Checkout <span class="accent">abgebrochen</span>',
  cancel_desc: 'Es wurde keine Zahlung abgeschlossen.',
  cancel_safe_heading: 'Ihre Angaben sind sicher',
  cancel_safe_desc: 'Sie können zur Bestellseite zurückkehren und es erneut versuchen oder unser Team um Hilfe bitten.',
  cancel_try_again: 'Erneut versuchen',

  success_title: 'Bestellung <span class="accent">eingegangen</span>',
  success_desc: 'Vielen Dank. Wir melden uns bei Ihnen mit den nächsten Schritten.',
  success_next_heading: 'Wie geht es weiter?',
  success_next_desc: 'Wir prüfen Ihre Angaben und Ihr Menü, bestätigen das gewählte Paket und beginnen mit der Einrichtung, sobald alle benötigten Informationen vorliegen.',

  renewal_error_desc: 'Dieser Verlängerungslink ist ungültig oder abgelaufen. Bitte kontaktieren Sie uns, damit wir helfen können.',

  aboutpage_hero_title: 'Über <span class="accent">uns</span>',
  aboutpage_hero_desc: 'Digitale Menü-Tools für Teams im Gastgewerbe.',
  aboutpage_mission_heading: 'Unsere Mission',
  aboutpage_mission_p: 'Smart Menu Solutions hilft Restaurants, Cafés, Bars und Hotels dabei, statische Speisekarten durch schnelle, zugängliche digitale Erlebnisse zu ersetzen.',
  aboutpage_provide_heading: 'Was wir bieten',
  aboutpage_provide_p: 'Wir erstellen gebrandete QR-Menüs, organisieren Menüinhalte, unterstützen mehrere Sprachen und halten Aktualisierungen für vielbeschäftigte Teams einfach.',
  aboutpage_vision_heading: 'Unsere Vision',
  aboutpage_vision_p: 'Wir glauben, dass jeder Gast in der Lage sein sollte, sofort auf jedem Smartphone ein klares, ansprechendes Menü zu öffnen – ganz ohne App.',
  aboutpage_questions: 'Fragen? Kontaktieren Sie uns unter',
  aboutpage_footer_link: 'Über uns',

  privacy_intro_p1: 'Wir von Smart Menu Solutions setzen uns dafür ein, unsere Kunden und Kontakte bestmöglich zu betreuen. Ein Teil dieses Engagements ist der verantwortungsvolle Umgang mit personenbezogenen Daten, die über unsere Website und damit verbundene Interaktionen erhoben werden. Unsere wichtigsten Ziele bei der Verarbeitung dieser Daten sind:',
  privacy_intro_ul: '<li>Verbesserung der Nutzererfahrung auf unserer Plattform durch das Verständnis von Kundenbedürfnissen und -präferenzen.</li><li>Zeitnaher Support und Beantwortung von Anfragen oder Serviceanliegen.</li><li>Verbesserung unserer Produkte und Dienstleistungen entsprechend den sich wandelnden Anforderungen unserer Nutzer.</li><li>Durchführung notwendiger Geschäftsvorgänge, wie Abrechnung und Kontoverwaltung.</li>',
  privacy_intro_p2: 'Es ist unsere Politik, personenbezogene Daten mit größtmöglichem Respekt für Privatsphäre und Sicherheit zu verarbeiten. Wir halten uns an alle relevanten Vorschriften und Richtlinien, um sicherzustellen, dass die von uns verarbeiteten Daten vor unbefugtem Zugriff, Offenlegung, Veränderung und Zerstörung geschützt sind.',
  privacy_intro_p3: 'Wir haben keinen benannten Datenschutzbeauftragten (DSB), setzen uns jedoch weiterhin uneingeschränkt für die Klärung Ihrer Datenschutzanliegen ein. Sollten Sie Fragen haben oder weitere Informationen dazu benötigen, wie wir personenbezogene Daten verwalten, kontaktieren Sie uns bitte unter <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>.',
  privacy_intro_p4: 'Ihre Privatsphäre hat für uns oberste Priorität. Dieses Engagement erstreckt sich auch auf unsere Zusammenarbeit mit Drittanbietern, die in unserem Auftrag personenbezogene Daten verarbeiten können, etwa beim Versand von Rechnungen. Alle Tätigkeiten erfolgen unter strikter Einhaltung der geltenden Datenschutzgesetze.',
  privacy_scope_p: 'Diese Datenschutzerklärung gilt für Website-Besucher, Personen, die uns kontaktieren, und Kunden, die unsere Dienstleistungen anfragen oder nutzen.',
  privacy_data_p1: 'Wir erheben personenbezogene Daten durch verschiedene Interaktionen, etwa wenn Sie unsere Dienstleistungen oder Produkte nutzen &mdash; wie unseren digitalen QR-Menü-Builder, der individuell gebrandete, webbasierte Menüs erstellt, die sofort per Smartphone-Kamera-Scan ohne App-Download aufrufbar sind &mdash; oder wenn Sie uns direkt Informationen zur Verfügung stellen.',
  privacy_data_p2: 'Die folgende Liste zeigt die Arten personenbezogener Daten, die wir gegebenenfalls verarbeiten:',
  privacy_data_ul1: '<li>Vor- und Nachname</li><li>Kontaktdaten und Informationen aus Ihrer Serviceanfrage</li><li>Technische Informationen, die in Standard-Server-Sicherheitsprotokollen erfasst werden können, wie IP-Adresse, Browsertyp und Zeitpunkt der Anfrage</li>',
  privacy_data_p3: 'Wir verarbeiten nur Informationen, die für die Erbringung unserer Dienstleistungen, die Erfüllung gesetzlicher Pflichten oder die Verbesserung Ihrer Nutzererfahrung notwendig sind. Die von uns erhobenen Daten dienen mehreren Zwecken, unter anderem:',
  privacy_data_ul2: '<li>Beantwortung von Anfragen und Bearbeitung von Serviceanfragen</li><li>Kundensupport</li>',
  privacy_data_p4: 'Wir verarbeiten Ihre personenbezogenen Daten transparent und im Einklang mit Ihren Präferenzen und den geltenden Datenschutzgesetzen, und ausschließlich zu den Zwecken, für die sie erhoben wurden oder die Sie genehmigt haben.',
  privacy_data_p5: 'Wenn Sie ein Kontakt- oder Bestellformular absenden, werden die Angaben sowie eine eventuell angehängte Menü-Datei über FormSubmit übermittelt, damit die Anfrage in unserem E-Mail-Postfach ankommt. Bitte geben Sie keine sensiblen persönlichen oder finanziellen Informationen in Ihrer Nachricht oder im hochgeladenen Dokument an.',
  privacy_storage_ul: '<li>Personenbezogene Daten werden auf sicheren Servern in Deutschland gespeichert. Bei Dienstleistungen, die eine internationale Datenübermittlung erfordern, stellen wir sicher, dass diese Übermittlungen den geltenden Gesetzen entsprechen und ein Datenschutzniveau gewährleisten, das dem an unserem Hauptstandort entspricht.</li><li>Wir arbeiten mit renommierten Hosting-Anbietern zusammen, die sich modernsten Sicherheitsmaßnahmen verpflichtet haben und aufgrund ihrer strengen Datenschutzstandards ausgewählt wurden.</li>',
  privacy_processing_p: 'Wenn wir Ihre Daten mit Drittanbietern teilen, geschieht dies stets im Rahmen von Auftragsverarbeitungsverträgen (AVV), die sicherstellen, dass Ihre Daten im Einklang mit der DSGVO und anderen relevanten Datenschutzgesetzen verwaltet werden. Diese Verträge verpflichten Dritte zur Umsetzung angemessener technischer und organisatorischer Sicherheitsmaßnahmen.',
  privacy_control_p: 'Transparenz ist uns wichtig, ebenso wie Ihre Kontrolle über Ihre personenbezogenen Daten. Sie werden stets über wesentliche Änderungen unserer Weitergabepraxis informiert und erhalten, wo anwendbar, die Möglichkeit, solchen Änderungen zuzustimmen. Bei Fragen dazu, wie wir personenbezogene Daten weitergeben und offenlegen, kontaktieren Sie uns unter <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>.',
  privacy_rights_p: 'Wir erkennen und respektieren Ihre Rechte in Bezug auf Ihre personenbezogenen Daten gemäß der Datenschutz-Grundverordnung (DSGVO) und anderen geltenden Datenschutzgesetzen:',
  privacy_rights_ul: '<li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO) &mdash; Auskunft über die von uns über Sie gespeicherten personenbezogenen Daten und deren Verarbeitung verlangen.</li><li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO) &mdash; Berichtigung oder Vervollständigung unrichtiger oder unvollständiger Daten verlangen.</li><li><strong>Recht auf Löschung</strong> ("Recht auf Vergessenwerden", Art. 17 DSGVO) &mdash; Löschung Ihrer personenbezogenen Daten verlangen, wenn diese für die Zwecke, für die sie erhoben wurden, nicht mehr erforderlich sind.</li><li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO) &mdash; unter bestimmten Voraussetzungen eine Einschränkung der Verarbeitung verlangen.</li><li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO) &mdash; Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format erhalten.</li><li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) &mdash; der Verarbeitung unter bestimmten Voraussetzungen widersprechen, auch im Hinblick auf Direktmarketing.</li><li><strong>Recht auf Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO) &mdash; eine erteilte Einwilligung jederzeit widerrufen, sofern die Verarbeitung auf einer Einwilligung beruht.</li><li><strong>Recht auf Beschwerde</strong> (Art. 77 DSGVO) &mdash; sich bei einer Aufsichtsbehörde beschweren, wenn Sie der Ansicht sind, dass unsere Verarbeitung gegen Datenschutzrecht verstößt.</li>',
  privacy_rights_exercise_p: 'Um eines dieser Rechte auszuüben, kontaktieren Sie uns unter <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>. Wir werden im Einklang mit den geltenden Datenschutzgesetzen und innerhalb der vorgeschriebenen Fristen antworten. In manchen Fällen müssen wir Ihre Identität überprüfen, um die Sicherheit Ihrer personenbezogenen Daten zu gewährleisten.',
  privacy_cookies_p1: 'Wir schätzen Ihre Privatsphäre und sind transparent über unsere Nutzung von Cookies und anderen Tracking-Technologien. Diese Technologien tragen dazu bei, den reibungslosen Betrieb unserer digitalen Plattformen sicherzustellen, Ihre Nutzererfahrung zu verbessern und uns Erkenntnisse zu liefern, mit denen wir uns weiterentwickeln können.',
  privacy_cookies_p2: 'Cookies sind kleine Dateien, die auf Ihrem Gerät gespeichert werden und es uns ermöglichen, Ihre Präferenzen zu merken und Informationen über Ihre Nutzung der Website zu erfassen. Tracking-Technologien wie Web-Beacons und Pixel-Tags helfen uns zu verstehen, wie Sie mit unserer Website interagieren.',
  privacy_use_ul: '<li><strong>Notwendige Cookies</strong> &mdash; erforderlich für die Funktionalität der Website, etwa für Authentifizierung und Sicherheit. Sie erfordern keine Einwilligung.</li><li><strong>Leistungs- und Analyse-Cookies</strong> &mdash; erfassen Informationen darüber, wie Besucher die Website nutzen, um sie zu verbessern.</li><li><strong>Funktionale Cookies</strong> &mdash; ermöglichen erweiterte Funktionen und Personalisierung, etwa das Merken Ihrer Präferenzen.</li><li><strong>Werbe- und Targeting-Cookies</strong> &mdash; werden verwendet, um relevantere Werbung auszuspielen und die Wirksamkeit von Kampagnen zu messen.</li>',
  privacy_choices_p: 'Die aktuelle Website setzt bewusst keine Analyse- oder Werbe-Cookies. Sollten künftig nicht notwendige Cookies eingeführt werden, aktualisieren wir diese Richtlinie und stellen dort, wo erforderlich, entsprechende Einwilligungsmöglichkeiten bereit.',
  privacy_us_p: 'Für Einwohner der Vereinigten Staaten gewähren der California Consumer Privacy Act und verwandte bundesstaatliche Gesetze zusätzliche spezifische Rechte in Bezug auf Ihre personenbezogenen Daten.',
  privacy_individual_p: 'Einwohner Kaliforniens haben zusätzlich zu den oben beschriebenen Rechten spezifische Rechte in Bezug auf ihre personenbezogenen Daten.',
  privacy_know_p: 'Sie können verlangen, dass wir offenlegen, welche personenbezogenen Daten wir über Sie erhoben, verwendet, weitergegeben oder verkauft haben und warum, einschließlich: der Kategorien der erhobenen personenbezogenen Daten; konkreter erhobener personenbezogener Daten; der Kategorien der Datenquellen; der Zwecke ihrer Verwendung; und der Kategorien der Dritten, mit denen sie geteilt oder an die sie verkauft wurden.',
  privacy_delete_p: 'Sie können verlangen, dass wir die über Sie erhobenen personenbezogenen Daten löschen.',
  privacy_correct_p: 'Sie können uns bitten, unrichtige Daten, die wir über Sie gespeichert haben, zu berichtigen.',
  privacy_limit_p: 'Sie können verlangen, dass wir Ihre sensiblen personenbezogenen Daten (zum Beispiel genaue Standortdaten oder amtliche Ausweisnummern) nur für begrenzte Zwecke verwenden, etwa zur Erbringung der von Ihnen angeforderten Dienstleistungen.',
  privacy_optout_p: 'Smart Menu Solutions verkauft oder teilt keine personenbezogenen Daten. Sollten Ihre Daten dennoch jemals verkauft oder geteilt werden, haben Sie das Recht, diesem Verkauf oder dieser Weitergabe zu widersprechen.',
  privacy_nondiscrimination_p: 'Sie haben das Recht, vor Benachteiligung geschützt zu werden, wenn Sie Ihre Datenschutzrechte ausüben.',
  privacy_requests_p: 'Sie können eine Anfrage per E-Mail an <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a> stellen. Wir gleichen die von Ihnen übermittelten Angaben mit unseren Unterlagen ab, um Ihre Anfrage zu überprüfen, und antworten gemäß den geltenden Vorgaben. Um einen Bescheid anzufechten, kontaktieren Sie uns innerhalb von 60 Tagen nach unserer Antwort und geben Sie Ihre ursprüngliche Anfrage, das Datum unserer Antwort sowie den Grund an, warum Sie die Entscheidung für falsch halten.',
  privacy_sensitive_p: 'Wir verarbeiten sensible personenbezogene Daten nur mit Ihrer vorherigen Einwilligung und für konkrete, klar offengelegte Zwecke. Sie können Ihre Einwilligung jederzeit per E-Mail widerrufen.',
  privacy_marketing_p: 'Wir können Ihre personenbezogenen Daten nutzen, um Ihnen im Einklang mit der DSGVO und der ePrivacy-Richtlinie Direktmarketing-Mitteilungen über unsere Produkte, Dienstleistungen, Aktionen und andere für Sie möglicherweise interessante Informationen zuzusenden.',
  privacy_consent_ul: '<li><strong>Opt-in-Einwilligung</strong> &mdash; wir holen, sofern gesetzlich erforderlich, vor dem Versand von Marketing-Mitteilungen eine ausdrückliche Opt-in-Einwilligung ein.</li><li><strong>Abmeldemöglichkeit</strong> &mdash; jede Marketing-Mitteilung enthält klare Hinweise zur Abmeldung; wir setzen Abmeldewünsche umgehend um.</li>',
  privacy_types_p: 'Wir können Sie per E-Mail, SMS, Telefon oder über soziale Medien kontaktieren.',
  privacy_updates_p: 'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen gesetzlicher Anforderungen, Branchenstandards oder unserer Geschäftstätigkeit widerzuspiegeln.',
  privacy_notification_p: 'Bei wesentlichen Änderungen, die Ihre Rechte oder den Umgang mit Ihren personenbezogenen Daten betreffen können, informieren wir Sie deutlich sichtbar, etwa per E-Mail oder Hinweis auf der Website, und geben das Datum des Inkrafttretens der aktualisierten Richtlinie oben in diesem Dokument an. Wir empfehlen Ihnen, diese Richtlinie regelmäßig zu überprüfen; die fortgesetzte Nutzung unserer Dienstleistungen nach Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen.',
  privacy_contact_p: 'Wenn Sie Fragen oder Bedenken zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte unter <a href="mailto:smartmenusolutions@outlook.com">smartmenusolutions@outlook.com</a>. Wir helfen Ihnen gerne weiter.'
});

function applyMobileRefundHeading() {
  var isMobile = window.matchMedia('(max-width: 480px)').matches;
  document.querySelectorAll('[data-i18n="refund_hero_title"], [data-i18n="privacy_page_title"]').forEach(function (title) {
    var accent = title.querySelector('.accent');
    if (!accent) return;
    accent.style.display = isMobile ? 'block' : '';
    title.style.fontSize = isMobile ? 'clamp(1.8rem, 8.5vw, 2.25rem)' : '';
  });
}

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
  applyMobileRefundHeading();
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
  '.nav-cta:not(.builder-login)': 'get_started',
  '.footer-links li:nth-child(1) a': 'services',
  '.footer-links li:nth-child(2) a': 'pricing',
  '.footer-links li:nth-child(3) a': 'faq',
  '.footer-links li:nth-child(4) a': 'contact',
  '.footer-legal a[href="privacy-policy.html"]': 'privacy_policy',
  '.footer-legal a[href="terms-of-service.html"]': 'footer_terms',
  '.footer-legal a[href="refund-policy.html"]': 'refund_policy',
  '.footer-legal a[href="cookie-policy.html"]': 'footer_cookies',
  '.footer-legal a[href="disclaimer.html"]': 'footer_disclaimer',
  '.footer-legal a[href="imprint.html"]': 'imprint',
  '.footer-bottom > span:first-of-type': 'footer_copyright',
  '.footer-bottom > span.footer-powered': 'footer_powered'
};

  var pageTranslationSelectors = {
  'our-services.html': {
    '.hero-inner h1': 'services_hero_title', '.hero-lede': 'services_hero_lede', '#services-section-head h2': 'services_section_heading', '#services-section-head p': 'services_section_sub',
    '#services-grid .service-card:nth-child(1) h3': 'plan_start_name', '#services-grid .service-card:nth-child(1) p': 'service_card_start_desc', '#services-grid .service-card:nth-child(2) h3': 'plan_pro_name', '#services-grid .service-card:nth-child(2) p': 'service_card_pro_desc', '#services-grid .service-card:nth-child(3) h3': 'plan_premium_name', '#services-grid .service-card:nth-child(3) p': 'service_card_premium_desc',
    '.services-testimonials .section-head h2': 'testimonials_heading', '.testimonial:nth-child(1) p': 'testimonial_1_text', '.testimonial:nth-child(1) cite': 'testimonial_1_author', '.testimonial:nth-child(2) p': 'testimonial_2_text', '.testimonial:nth-child(2) cite': 'testimonial_2_author', '.testimonial:nth-child(3) p': 'testimonial_3_text', '.testimonial:nth-child(3) cite': 'testimonial_3_author', '.cta-band h2': 'cta_band_title', '.cta-band p': 'cta_band_sub', '.cta-band a': 'cta_band_btn'
  },
  'pricing-plans.html': {
    '.page-hero h1': 'pricing_page_title', '.page-hero p': 'pricing_page_desc', '#pricing-section-head h2': 'pricing_section_heading', '#pricing-section-head p': 'pricing_section_sub', '#plans-grid .price-card:nth-child(1) h3': 'plan_start_title', '#plans-grid .price-card:nth-child(1) > p:nth-of-type(2)': 'plan_start_desc', '#plans-grid .price-card:nth-child(2) h3': 'plan_pro_title', '#plans-grid .price-card:nth-child(2) > p:nth-of-type(2)': 'plan_pro_desc', '#plans-grid .price-card:nth-child(3) h3': 'plan_premium_title', '#plans-grid .price-card:nth-child(3) > p:nth-of-type(2)': 'plan_premium_desc', '#plans-grid .price-card:nth-child(1) .price small': 'vat_incl', '#plans-grid .price-card:nth-child(2) .price small': 'vat_incl', '#plans-grid .price-card:nth-child(3) .price small': 'vat_incl', '#plans-grid .price-card:nth-child(2) .badge': 'badge_popular', '#plans-grid .price-card:nth-child(1) li:nth-child(1)': 'feat_qr', '#plans-grid .price-card:nth-child(2) li:nth-child(1)': 'feat_qr', '#plans-grid .price-card:nth-child(3) li:nth-child(1)': 'feat_qr', '#plans-grid .price-card:nth-child(1) li:nth-child(2)': 'feat_start_items', '#plans-grid .price-card:nth-child(2) li:nth-child(2)': 'feat_pro_items', '#plans-grid .price-card:nth-child(3) li:nth-child(2)': 'feat_premium_items', '#plans-grid .price-card:nth-child(1) li:nth-child(3)': 'feat_mobile', '#plans-grid .price-card:nth-child(2) li:nth-child(3)': 'feat_mobile', '#plans-grid .price-card:nth-child(3) li:nth-child(3)': 'feat_mobile', '#plans-grid .price-card:nth-child(1) li:nth-child(4)': 'feat_unique_qr', '#plans-grid .price-card:nth-child(2) li:nth-child(4)': 'feat_unique_qr', '#plans-grid .price-card:nth-child(3) li:nth-child(4)': 'feat_unique_qr', '#plans-grid .price-card:nth-child(1) li:nth-child(5)': 'feat_dish_photo_start', '#plans-grid .price-card:nth-child(2) li:nth-child(5)': 'feat_dish_photo_pro', '#plans-grid .price-card:nth-child(3) li:nth-child(5)': 'feat_dish_photo_premium', '#plans-grid .price-card:nth-child(1) li:nth-child(6)': 'feat_start_updates', '#plans-grid .price-card:nth-child(2) li:nth-child(6)': 'feat_pro_updates', '#plans-grid .price-card:nth-child(3) li:nth-child(6)': 'feat_premium_updates', '#plans-grid .price-card:nth-child(1) li:nth-child(7)': 'feat_billing_year', '#plans-grid .price-card:nth-child(2) li:nth-child(7)': 'feat_pro_lang', '#plans-grid .price-card:nth-child(2) li:nth-child(8)': 'feat_billing_year', '#plans-grid .price-card:nth-child(3) li:nth-child(7)': 'feat_premium_lang', '#plans-grid .price-card:nth-child(3) li:nth-child(8)': 'feat_billing_year', '#plans-grid .price-card:nth-child(1) .btn': 'btn_choose_start', '#plans-grid .price-card:nth-child(2) .btn': 'btn_choose_pro', '#plans-grid .price-card:nth-child(3) .btn': 'btn_choose_premium'
  },
  'faq.html': {
    '.page-hero h1': 'faq_hero_title', '.page-hero p': 'faq_hero_desc', '.faq-item:nth-child(1) summary': 'faq_q1', '.faq-item:nth-child(1) .faq-a': 'faq_a1', '.faq-item:nth-child(2) summary': 'faq_q2', '.faq-item:nth-child(2) .faq-a': 'faq_a2', '.faq-item:nth-child(3) summary': 'faq_q3', '.faq-item:nth-child(3) .faq-a': 'faq_a3', '.faq-item:nth-child(4) summary': 'faq_q4', '.faq-item:nth-child(4) .faq-a': 'faq_a4', '.faq-item:nth-child(5) summary': 'faq_q5', '.faq-item:nth-child(5) .faq-a': 'faq_a5', '.faq-item:nth-child(6) summary': 'faq_q6', '.faq-item:nth-child(6) .faq-a': 'faq_a6', '.faq-item:nth-child(7) summary': 'faq_q7', '.faq-item:nth-child(7) .faq-a': 'faq_a7', '.section--alt p': 'faq_beyond_desc', '.section--alt a': 'faq_beyond_btn'
  },
  'order.html': {
    '.page-hero h1': 'order_overview_title', '.page-hero p': 'order_overview_desc', '.section-head h2': 'order_steps_heading', '.section-head p': 'order_steps_sub', '.step:nth-child(1) h3': 'step1_title', '.step:nth-child(1) p': 'step1_desc', '.step:nth-child(2) h3': 'step2_title', '.step:nth-child(2) p': 'step2_desc', '.step:nth-child(3) h3': 'step3_title', '.step:nth-child(3) p': 'step3_desc', '.step:nth-child(4) h3': 'step4_title', '.step:nth-child(4) p': 'step4_desc', '.step:nth-child(5) h3': 'step5_title', '.step:nth-child(5) p': 'step5_desc', '.step:nth-child(6) h3': 'step6_title', '.step:nth-child(6) p': 'step6_desc', '.step:nth-child(7) h3': 'step7_title', '.step:nth-child(7) p': 'step7_desc', '.section > .container > div[style] a': 'order_cta_btn'
  },
  'order-info.html': {
    '.page-hero h1': 'order_info_hero_title', '.page-hero p': 'order_info_hero_desc', '.order-card > h2': 'form_main_title', '#orderForm .order-section:nth-of-type(1) .order-step-label': 'step_contact_label', '#orderForm .order-section:nth-of-type(2) .order-step-label': 'step_plan_label', '#orderForm .order-section:nth-of-type(3) .order-step-label': 'step_upload_label', '#orderForm .order-section:nth-of-type(4) .order-step-label': 'step_photo_label', 'label[for="firstName"]': 'label_firstname', 'label[for="lastName"]': 'label_lastname', 'label[for="email"]': 'label_email', '#firstName': 'placeholder_firstname', '#lastName': 'placeholder_lastname', '#email': 'placeholder_email', '#fileLabel': 'label_upload_title', '#dropzone .dz-sub': 'label_upload_sub', '#photoFileLabel': 'label_photo_upload_title', '#photoDropzone .dz-sub': 'label_photo_upload_sub', '#payButton': 'submit_order_btn', '.os-label': 'summary_header', '.os-line-qr span:first-child': 'feat_unique_qr', '.os-line-qr span:last-child': 'included', '.os-line-updates span:first-child': 'summary_updates_label', '.os-line-billing span:first-child': 'summary_billing_label', '.os-line-billing span:last-child': 'included', '.os-total-label': 'total_due', '.os-note strong': 'what_happens_next', '.os-note p': 'what_happens_next_desc', 'label[for="companyName"]': 'label_company', 'label[for="phone"]': 'label_phone', '.order-consent-text': 'consent_policies'
  },
  'renewal.html': {
    '.page-hero h1': 'renewal_hero_title', '.page-hero p': 'renewal_hero_desc', '.order-card > h2': 'renewal_form_title', '#orderForm .order-section:nth-of-type(1) .order-step-label': 'step_contact_label', '#orderForm .order-section:nth-of-type(2) .order-step-label': 'renewal_step_plan_label', '#orderForm .order-section:nth-of-type(3) .order-step-label': 'renewal_step_upload_label', 'label[for="firstName"]': 'label_firstname', 'label[for="lastName"]': 'label_lastname', 'label[for="email"]': 'label_email', 'label[for="companyName"]': 'label_company', 'label[for="phone"]': 'label_phone', '#fileLabel': 'renewal_label_upload_title', '.dz-sub': 'label_upload_sub', '.order-consent-text': 'consent_policies', '#payButton': 'renewal_submit_btn', '.os-label': 'renewal_summary_header', '.os-line-qr span:first-child': 'feat_unique_qr', '.os-line-qr span:last-child': 'included', '.os-line-updates span:first-child': 'summary_updates_label', '.os-line-billing span:first-child': 'summary_billing_label', '.os-line-billing span:last-child': 'included', '.os-total-label': 'total_due', '.os-note strong': 'what_happens_next', '.os-note p': 'renewal_what_happens_next_desc'
  },
  'contact.html': { '.page-hero h1': 'contact_hero_title', '.page-hero p': 'contact_hero_desc', '.contact-grid h2': 'contact_section_heading', 'label[for="company"]': 'contact_label_company', 'label[for="name"]': 'contact_label_name', 'label[for="email"]': 'contact_label_email', 'label[for="message"]': 'contact_label_message', '#contact-form button': 'contact_submit', '.field-hint:not(.privacy-note)': 'contact_hint', '.contact-side h3': 'contact_next_heading', '.contact-side .panel > p:nth-of-type(1)': 'contact_next_desc', '.contact-side .panel > p:nth-of-type(2)': 'contact_next_intro' },
  'refund-policy.html': {},
  'imprint.html': {},
  'privacy-policy.html': { '.page-hero h1': 'privacy_page_title', '.page-hero p': 'privacy_page_desc' }
};

function ensureLegalLinks() {
  document.querySelectorAll('.footer-legal').forEach(function (legal) {
    if (!legal.querySelector('a[href="refund-policy.html"]')) legal.insertAdjacentHTML('beforeend', '<li><a href="refund-policy.html" data-i18n="refund_policy">Refund Policy</a></li>');
    if (!legal.querySelector('a[href="imprint.html"]')) legal.insertAdjacentHTML('beforeend', '<li><a href="imprint.html" data-i18n="imprint">Imprint</a></li>');
    var emailLink = legal.querySelector('a[href^="mailto:"]');
    if (emailLink) legal.appendChild(emailLink.parentElement);
  });
}

function ensureFooterPowered() {
  document.querySelectorAll('.footer-bottom').forEach(function (bottom) {
    if (bottom.querySelector('.footer-powered')) return;
    var span = document.createElement('span');
    span.className = 'footer-powered';
    span.textContent = 'Powered by Smart Menu Solutions';
    var legal = bottom.querySelector('.footer-legal');
    if (legal) bottom.insertBefore(span, legal); else bottom.appendChild(span);
  });
}

function ensureFooterSocial() {
  document.querySelectorAll('.footer-social').forEach(function (social) {
    if (social.querySelector('a[href*="tiktok.com"]')) return;
    social.insertAdjacentHTML('beforeend', '<a href="https://www.tiktok.com/@smartmenusolutions" aria-label="Smart Menu Solutions on TikTok" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>');
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

}

