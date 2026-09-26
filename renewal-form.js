document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('orderForm');
  var errorBox = document.getElementById('renewalError');
  var layout = document.getElementById('renewalLayout');
  if (!form) return;

  var token = new URLSearchParams(window.location.search).get('token');
  if (!token) {
    errorBox.style.display = '';
    return;
  }

  var supabaseUrl = 'https://qlzugnwsufbgznoawvic.supabase.co';
  var supabasePublishableKey = 'sb_publishable_m7GxKtc8I3F8ASzuMaJvZg_8CQuKToA';
  var renewalEndpoint = supabaseUrl + '/functions/v1/renewal';
  // A new menu PDF is optional and uploaded after payment on upload.html
  // (see the order-upload function) - nothing is uploaded from this form.

  // Same rationale as order-form.js: the handful of messages this form still
  // shows via alert()/plain text follow the page's localStorage language
  // switch instead of always being English.
  function t(en, de) {
    return localStorage.getItem('selectedLang') === 'de' ? de : en;
  }

  var planInputs = Array.prototype.slice.call(form.querySelectorAll('input[name="Selected Plan"]'));
  var hiddenTotal = document.getElementById('hiddenTotal');
  var hiddenPlanName = document.getElementById('hiddenPlanName');
  var sumPlanName = document.getElementById('sumPlanName');
  var sumUpdates = document.getElementById('sumUpdates');
  var sumTotal = document.getElementById('sumTotal');
  var payButton = document.getElementById('payButton');

  function eur(n) {
    return '€' + parseFloat(n).toFixed(2);
  }

  function applyPlan(input) {
    if (!input) return;
    sumPlanName.textContent = input.getAttribute('data-name');
    sumUpdates.textContent = input.getAttribute('data-updates') + t(' / month', ' / Monat');
    sumTotal.textContent = eur(input.getAttribute('data-price'));
    hiddenTotal.value = eur(input.getAttribute('data-price'));
    hiddenPlanName.value = input.getAttribute('data-name');
  }

  planInputs.forEach(function (input) {
    input.addEventListener('change', function () { applyPlan(input); });
  });

  // See order-form.js: the summary's "N / month" text is JS-managed, not
  // data-i18n, so it needs to be refreshed when the language changes too.
  document.querySelectorAll('.lang-btn, .flag-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var current = form.querySelector('input[name="Selected Plan"]:checked');
      if (current) applyPlan(current);
    });
  });

  fetch(renewalEndpoint + '?token=' + encodeURIComponent(token))
    .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'This renewal link is not valid.'); return data; }); })
    .then(function (data) {
      document.getElementById('firstName').value = data.firstName || '';
      document.getElementById('lastName').value = data.lastName || '';
      document.getElementById('email').value = data.email || '';
      document.getElementById('companyName').value = data.companyName || '';
      document.getElementById('phone').value = data.phone || '';
      var planMap = { start: 'planStart', pro: 'planPro', premium: 'planPremium' };
      var planInput = document.getElementById(planMap[data.plan] || 'planPro');
      if (planInput) {
        planInput.checked = true;
        applyPlan(planInput);
      }
      layout.style.display = '';
    })
    .catch(function () {
      errorBox.style.display = '';
    });

  function setBusy(text) {
    payButton.disabled = true;
    if (!payButton.dataset.originalText) payButton.dataset.originalText = payButton.textContent;
    payButton.textContent = text;
  }

  function resetButton() {
    payButton.disabled = false;
    payButton.textContent = payButton.dataset.originalText || 'Renew now';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var selectedPlan = form.querySelector('input[name="Selected Plan"]:checked');
    if (!selectedPlan) {
      alert(t('Please choose a plan.', 'Bitte wählen Sie einen Plan.'));
      return;
    }

    setBusy(t('Opening secure checkout…', 'Sichere Bezahlung wird geöffnet…'));
    fetch(renewalEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabasePublishableKey },
      body: JSON.stringify({
        token: token,
        plan: selectedPlan.dataset.code,
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        companyName: document.getElementById('companyName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        lang: localStorage.getItem('selectedLang') === 'de' ? 'de' : 'en'
      })
    })
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'Renewal checkout could not be started.'); return data; }); })
      .then(function (data) { window.location.assign(data.url); })
      .catch(function (error) {
        alert(error.message);
        resetButton();
      });
  });
});
