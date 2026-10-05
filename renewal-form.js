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
  function t(en, de, it) {
    var lang = localStorage.getItem('selectedLang');
    if (lang === 'de') return de;
    if (lang === 'it' && it) return it;
    return en;
  }

  var planInputs = Array.prototype.slice.call(form.querySelectorAll('input[name="Selected Plan"]'));
  var hiddenTotal = document.getElementById('hiddenTotal');
  var hiddenPlanName = document.getElementById('hiddenPlanName');
  var sumPlanName = document.getElementById('sumPlanName');
  var sumUpdates = document.getElementById('sumUpdates');
  var sumTotal = document.getElementById('sumTotal');
  var payButton = document.getElementById('payButton');

  // Upgrade from Smart Discovery (the €2.99 pass): the same page, but it also
  // sells the add-ons (pre-ticked - the customer just tried all of them) and
  // shows the €2.99 credit the renewal function applies as a Stripe coupon.
  // Prices mirror create-checkout-session's PLAN_PRICING.
  var isUpgrade = false;
  var DISCOVERY_CREDIT = 2.99;
  var PHOTO_PRICES = { start: 10, pro: 30, premium: 90 };
  var ADDONS = [
    { key: 'photoAddon', box: 'upPhoto', line: 'upLinePhoto', price: function (plan) { return PHOTO_PRICES[plan] || 0; } },
    { key: 'smartFoodMatchAddon', box: 'upSfm', line: 'upLineSfm', price: function () { return 5; } },
    { key: 'analyticsReportsAddon', box: 'upAnalytics', line: 'upLineAnalytics', price: function () { return 5; } },
    { key: 'smartServiceHubAddon', box: 'upHub', line: 'upLineHub', price: function () { return 89; } }
  ];

  function eur(n) {
    return '€' + parseFloat(n).toFixed(2);
  }

  function currentPlan() {
    return form.querySelector('input[name="Selected Plan"]:checked');
  }

  function updateTotal() {
    var input = currentPlan();
    if (!input) return;
    var plan = input.dataset.code;
    var total = parseFloat(input.getAttribute('data-price'));
    if (isUpgrade) {
      ADDONS.forEach(function (addon) {
        var box = document.getElementById(addon.box);
        var price = addon.price(plan);
        var priceLabel = document.getElementById(addon.box + 'Price');
        if (priceLabel) priceLabel.textContent = '+' + eur(price);
        var line = document.getElementById(addon.line);
        if (line) {
          line.style.display = box && box.checked ? '' : 'none';
          line.lastElementChild.textContent = '+' + eur(price);
        }
        if (box && box.checked) total += price;
      });
      total -= DISCOVERY_CREDIT;
    }
    sumTotal.textContent = eur(total);
    hiddenTotal.value = eur(total);
  }

  function applyPlan(input) {
    if (!input) return;
    sumPlanName.textContent = input.getAttribute('data-name');
    sumUpdates.textContent = input.getAttribute('data-updates') + t(' / month', ' / Monat', ' / mese');
    hiddenPlanName.value = input.getAttribute('data-name');
    updateTotal();
  }

  // The page's own texts say "renew" (script.js translates them on load and on
  // every language switch), so in upgrade mode they're replaced afterwards.
  function applyUpgradeTexts() {
    if (!isUpgrade) return;
    var set = function (selector, html) { var el = document.querySelector(selector); if (el) el.innerHTML = html; };
    set('.page-hero h1', t('Upgrade from <span class="accent">Smart Discovery</span>', 'Upgrade von <span class="accent">Smart Discovery</span>', 'Upgrade da <span class="accent">Smart Discovery</span>'));
    set('.page-hero p', t('Keep your digital menu: choose a plan and the add-ons you want to keep. Your €2.99 is credited.', 'Behalten Sie Ihre digitale Speisekarte: Wählen Sie einen Tarif und die Zusatzmodule, die Sie behalten möchten. Ihre 2,99 € werden angerechnet.', 'Mantenete il vostro menu digitale: scegliete un piano e gli add-on che volete tenere. I vostri 2,99 € vengono scalati.'));
    set('.order-card > h2', t('Upgrade your menu', 'Speisekarte upgraden', 'Fate l\'upgrade del vostro menu'));
    set('.os-label', t('Upgrade summary', 'Upgrade-Übersicht', 'Riepilogo dell\'upgrade'));
    set('#payButton span', t('Upgrade now', 'Jetzt upgraden', 'Fai l\'upgrade ora'));
    set('#upgradeAddonsLabel', t('03 / Add-ons', '03 / Zusatzmodule', '03 / Add-on'));
    set('#upgradeAddonsHint', t('You tried all add-ons in Smart Discovery – they are pre-selected. Untick what you don\'t need.', 'In Smart Discovery haben Sie alle Zusatzmodule getestet – sie sind vorausgewählt. Entfernen Sie den Haken bei allem, was Sie nicht brauchen.', 'In Smart Discovery avete provato tutti gli add-on: sono preselezionati. Togliete la spunta da ciò che non vi serve.'));
    set('#upLineCredit span', t('Smart Discovery credit', 'Smart Discovery angerechnet', 'Credito Smart Discovery'));
    var note = document.querySelector('.os-note span[data-i18n]');
    if (note) note.textContent = t('Your menu stays online and continues on the new plan as soon as payment succeeds.', 'Ihre Speisekarte bleibt online und läuft nach der Zahlung im neuen Tarif weiter.', 'Il vostro menu resta online e continua con il nuovo piano appena il pagamento va a buon fine.');
  }

  planInputs.forEach(function (input) {
    input.addEventListener('change', function () { applyPlan(input); });
  });
  ADDONS.forEach(function (addon) {
    var box = document.getElementById(addon.box);
    if (box) box.addEventListener('change', updateTotal);
  });

  // See order-form.js: the summary's "N / month" text is JS-managed, not
  // data-i18n, so it needs to be refreshed when the language changes too.
  document.querySelectorAll('.lang-btn, .flag-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var current = currentPlan();
      if (current) applyPlan(current);
      applyUpgradeTexts();
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
      isUpgrade = data.plan === 'discovery';
      if (isUpgrade) {
        document.getElementById('upgradeAddons').hidden = false;
        document.getElementById('upLineCredit').style.display = '';
      }
      var planMap = { start: 'planStart', pro: 'planPro', premium: 'planPremium' };
      var planInput = document.getElementById(planMap[data.plan] || 'planPro');
      if (planInput) {
        planInput.checked = true;
        applyPlan(planInput);
      }
      applyUpgradeTexts();
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
    var selectedPlan = currentPlan();
    if (!selectedPlan) {
      alert(t('Please choose a plan.', 'Bitte wählen Sie einen Plan.', 'Scegliete un piano.'));
      return;
    }

    var body = {
      token: token,
      plan: selectedPlan.dataset.code,
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      companyName: document.getElementById('companyName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      lang: localStorage.getItem('selectedLang') === 'de' ? 'de' : 'en'
    };
    // Only honoured by the renewal function for a Smart Discovery upgrade.
    if (isUpgrade) {
      ADDONS.forEach(function (addon) {
        var box = document.getElementById(addon.box);
        body[addon.key] = !!(box && box.checked);
      });
    }

    setBusy(t('Opening secure checkout…', 'Sichere Bezahlung wird geöffnet…', 'Apertura del pagamento sicuro…'));
    fetch(renewalEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabasePublishableKey },
      body: JSON.stringify(body)
    })
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'Renewal checkout could not be started.'); return data; }); })
      .then(function (data) { window.location.assign(data.url); })
      .catch(function (error) {
        alert(error.message);
        resetButton();
      });
  });
});
