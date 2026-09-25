document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('orderForm');
  if (!form) return;

  var planInputs = Array.prototype.slice.call(form.querySelectorAll('input[name="Selected Plan"]'));
  var hiddenTotal = document.getElementById('hiddenTotal');
  var hiddenPlanName = document.getElementById('hiddenPlanName');
  var sumPlanName = document.getElementById('sumPlanName');
  var sumUpdates = document.getElementById('sumUpdates');
  var sumTotal = document.getElementById('sumTotal');
  // Each plan card has its own "add photos" checkbox so its price can show
  // next to that specific plan. Only the checkbox on the currently selected
  // plan's card counts - the other two are inert until that plan is chosen.
  var photoAddonChecks = Array.prototype.slice.call(document.querySelectorAll('.photo-addon-check'));
  var osLinePhoto = document.getElementById('osLinePhoto');
  var sumPhotoPrice = document.getElementById('sumPhotoPrice');
  // Same per-card pattern as the photo add-on, just a second independent
  // toggle - Smart Food Match is priced the same across all three plans.
  var sfmAddonChecks = Array.prototype.slice.call(document.querySelectorAll('.sfm-addon-check'));
  var osLineSfm = document.getElementById('osLineSfm');
  var sumSfmPrice = document.getElementById('sumSfmPrice');
  // Same per-card pattern again, third independent toggle.
  var analyticsAddonChecks = Array.prototype.slice.call(document.querySelectorAll('.analytics-addon-check'));
  var osLineAnalytics = document.getElementById('osLineAnalytics');
  var sumAnalyticsPrice = document.getElementById('sumAnalyticsPrice');
  // Same pattern again, fourth independent toggle - flat €89 across all plans.
  var hubAddonChecks = Array.prototype.slice.call(document.querySelectorAll('.hub-addon-check'));
  var osLineHub = document.getElementById('osLineHub');
  var sumHubPrice = document.getElementById('sumHubPrice');
  var payButton = document.getElementById('payButton');

  // The menu PDF (and the photo ZIP) are no longer uploaded here: Stripe
  // Checkout redirects to upload.html after payment, and only a paid order can
  // upload (see the order-upload function).
  var supabaseUrl = 'https://qlzugnwsufbgznoawvic.supabase.co';
  var supabasePublishableKey = 'sb_publishable_m7GxKtc8I3F8ASzuMaJvZg_8CQuKToA';
  var checkoutEndpoint = supabaseUrl + '/functions/v1/create-checkout-session';

  // These are the messages this form still shows via alert()/plain text
  // instead of data-i18n, so they follow the same localStorage language
  // switch as the rest of the page instead of always being English.
  function t(en, de) {
    return localStorage.getItem('selectedLang') === 'de' ? de : en;
  }

  function eur(n) {
    return '€' + parseFloat(n).toFixed(2);
  }

  function currentPlanInput() {
    return form.querySelector('input[name="Selected Plan"]:checked');
  }

  // The photo add-on's price depends on which plan is selected (more menu
  // items -> more photos -> higher estimated cost), so only the checkbox
  // that lives inside the currently selected plan's own card counts.
  function isPhotoAddonChecked() {
    var input = currentPlanInput();
    if (!input) return false;
    var card = input.closest('.plan-option');
    var checkbox = card && card.querySelector('.photo-addon-check');
    return !!(checkbox && checkbox.checked);
  }

  function isSfmAddonChecked() {
    var input = currentPlanInput();
    if (!input) return false;
    var card = input.closest('.plan-option');
    var checkbox = card && card.querySelector('.sfm-addon-check');
    return !!(checkbox && checkbox.checked);
  }

  function isAnalyticsAddonChecked() {
    var input = currentPlanInput();
    if (!input) return false;
    var card = input.closest('.plan-option');
    var checkbox = card && card.querySelector('.analytics-addon-check');
    return !!(checkbox && checkbox.checked);
  }

  function isHubAddonChecked() {
    var input = currentPlanInput();
    if (!input) return false;
    var card = input.closest('.plan-option');
    var checkbox = card && card.querySelector('.hub-addon-check');
    return !!(checkbox && checkbox.checked);
  }

  function updateTotal() {
    var input = currentPlanInput();
    if (!input) return;
    var name = input.getAttribute('data-name');
    var price = parseFloat(input.getAttribute('data-price'));
    var photoPrice = parseFloat(input.getAttribute('data-photo-price')) || 0;
    var sfmPrice = parseFloat(input.getAttribute('data-sfm-price')) || 0;
    var analyticsPrice = parseFloat(input.getAttribute('data-analytics-price')) || 0;
    var hubPrice = parseFloat(input.getAttribute('data-hub-price')) || 0;
    var addonOn = isPhotoAddonChecked();
    var sfmOn = isSfmAddonChecked();
    var analyticsOn = isAnalyticsAddonChecked();
    var hubOn = isHubAddonChecked();

    var total = price + (addonOn ? photoPrice : 0) + (sfmOn ? sfmPrice : 0) + (analyticsOn ? analyticsPrice : 0) + (hubOn ? hubPrice : 0);
    sumTotal.textContent = eur(total);
    hiddenTotal.value = eur(total);
    hiddenPlanName.value = name;

    if (osLinePhoto) osLinePhoto.style.display = addonOn ? '' : 'none';
    if (sumPhotoPrice) sumPhotoPrice.textContent = '+' + eur(photoPrice);

    if (osLineSfm) osLineSfm.style.display = sfmOn ? '' : 'none';
    if (sumSfmPrice) sumSfmPrice.textContent = '+' + eur(sfmPrice);

    if (osLineAnalytics) osLineAnalytics.style.display = analyticsOn ? '' : 'none';
    if (sumAnalyticsPrice) sumAnalyticsPrice.textContent = '+' + eur(analyticsPrice);

    if (osLineHub) osLineHub.style.display = hubOn ? '' : 'none';
    if (sumHubPrice) sumHubPrice.textContent = '+' + eur(hubPrice);
  }

  function applyPlan(input) {
    if (!input) return;
    var name = input.getAttribute('data-name');
    var updates = input.getAttribute('data-updates');
    sumPlanName.textContent = name;
    sumUpdates.textContent = updates + t(' / month', ' / Monat');
    updateTotal();
  }

  planInputs.forEach(function (input) {
    input.addEventListener('change', function () { applyPlan(input); });
  });

  // Each mini toggle is independent (it only ever matters for its own plan
  // card) - stop its click from bubbling up into the plan card's own
  // <label>, which would otherwise re-select that plan on every toggle click.
  photoAddonChecks.forEach(function (checkbox) {
    checkbox.addEventListener('click', function (e) { e.stopPropagation(); });
    checkbox.addEventListener('change', function () { updateTotal(); });
  });

  sfmAddonChecks.forEach(function (checkbox) {
    checkbox.addEventListener('click', function (e) { e.stopPropagation(); });
    checkbox.addEventListener('change', function () { updateTotal(); });
  });

  analyticsAddonChecks.forEach(function (checkbox) {
    checkbox.addEventListener('click', function (e) { e.stopPropagation(); });
    checkbox.addEventListener('change', function () { updateTotal(); });
  });

  hubAddonChecks.forEach(function (checkbox) {
    checkbox.addEventListener('click', function (e) { e.stopPropagation(); });
    checkbox.addEventListener('change', function () { updateTotal(); });
  });

  // Clicking a plan's photo toggle also selects that plan, since the toggle
  // is a property of that specific card, not a page-wide setting.
  document.querySelectorAll('.p-photo-toggle').forEach(function (wrapper) {
    wrapper.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = wrapper.closest('.plan-option');
      var planRadio = card && card.querySelector('input[name="Selected Plan"]');
      if (planRadio && !planRadio.checked) {
        planRadio.checked = true;
        applyPlan(planRadio);
      }
      if (e.target.tagName === 'INPUT') return;
      var checkbox = wrapper.querySelector('.photo-addon-check');
      if (!checkbox) return;
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Same pattern as the photo toggle above, independent addon.
  document.querySelectorAll('.p-sfm-toggle').forEach(function (wrapper) {
    wrapper.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = wrapper.closest('.plan-option');
      var planRadio = card && card.querySelector('input[name="Selected Plan"]');
      if (planRadio && !planRadio.checked) {
        planRadio.checked = true;
        applyPlan(planRadio);
      }
      if (e.target.tagName === 'INPUT') return;
      var checkbox = wrapper.querySelector('.sfm-addon-check');
      if (!checkbox) return;
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Same pattern again, third independent addon.
  document.querySelectorAll('.p-analytics-toggle').forEach(function (wrapper) {
    wrapper.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = wrapper.closest('.plan-option');
      var planRadio = card && card.querySelector('input[name="Selected Plan"]');
      if (planRadio && !planRadio.checked) {
        planRadio.checked = true;
        applyPlan(planRadio);
      }
      if (e.target.tagName === 'INPUT') return;
      var checkbox = wrapper.querySelector('.analytics-addon-check');
      if (!checkbox) return;
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Same pattern again, fourth independent addon.
  document.querySelectorAll('.p-hub-toggle').forEach(function (wrapper) {
    wrapper.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = wrapper.closest('.plan-option');
      var planRadio = card && card.querySelector('input[name="Selected Plan"]');
      if (planRadio && !planRadio.checked) {
        planRadio.checked = true;
        applyPlan(planRadio);
      }
      if (e.target.tagName === 'INPUT') return;
      var checkbox = wrapper.querySelector('.hub-addon-check');
      if (!checkbox) return;
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Pre-select a plan from ?plan=start|pro|premium
  var params = new URLSearchParams(window.location.search);
  var planParam = params.get('plan');
  var map = { start: 'planStart', pro: 'planPro', premium: 'planPremium' };
  var preselectId = map[planParam] || 'planPro';
  var preselect = document.getElementById(preselectId);
  if (preselect) {
    preselect.checked = true;
    applyPlan(preselect);
  }

  // The order summary's "N / month" text is set by applyPlan() above, not
  // by data-i18n, so switching language afterwards would otherwise leave
  // it in whichever language was active when the plan was last (re)selected.
  document.querySelectorAll('.lang-btn, .flag-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var current = form.querySelector('input[name="Selected Plan"]:checked');
      if (current) applyPlan(current);
    });
  });

  function setBusy(text) {
    payButton.disabled = true;
    if (!payButton.dataset.originalText) payButton.dataset.originalText = payButton.textContent;
    payButton.textContent = text;
  }

  function resetButton() {
    payButton.disabled = false;
    payButton.textContent = payButton.dataset.originalText || 'Submit order request';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var selectedPlan = form.querySelector('input[name="Selected Plan"]:checked');
    setBusy(t('Opening secure checkout…', 'Sichere Bezahlung wird geöffnet…'));

    fetch(checkoutEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabasePublishableKey },
      body: JSON.stringify({
        plan: selectedPlan && selectedPlan.dataset.code,
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        companyName: document.getElementById('companyName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        photoAddon: isPhotoAddonChecked(),
        smartFoodMatchAddon: isSfmAddonChecked(),
        analyticsReportsAddon: isAnalyticsAddonChecked(),
        smartServiceHubAddon: isHubAddonChecked(),
        lang: localStorage.getItem('selectedLang') === 'de' ? 'de' : 'en'
      })
    })
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'Checkout could not be started.'); return data; }); })
      .then(function (data) { window.location.assign(data.url); })
      .catch(function (error) {
        alert(error.message);
        resetButton();
      });
  });
});
