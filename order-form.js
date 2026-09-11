document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('orderForm');
  if (!form) return;

  var planInputs = Array.prototype.slice.call(form.querySelectorAll('input[name="Selected Plan"]'));
  var hiddenTotal = document.getElementById('hiddenTotal');
  var hiddenPlanName = document.getElementById('hiddenPlanName');
  var sumPlanName = document.getElementById('sumPlanName');
  var sumUpdates = document.getElementById('sumUpdates');
  var sumTotal = document.getElementById('sumTotal');
  var payButton = document.getElementById('payButton');
  var dropzone = document.getElementById('dropzone');
  var pdfInput = document.getElementById('pdfUpload');
  var fileLabel = document.getElementById('fileLabel');

  var supabaseUrl = 'https://qlzugnwsufbgznoawvic.supabase.co';
  var supabasePublishableKey = 'sb_publishable_m7GxKtc8I3F8ASzuMaJvZg_8CQuKToA';
  var checkoutEndpoint = supabaseUrl + '/functions/v1/create-checkout-session';
  var supabaseClient = window.supabase.createClient(supabaseUrl, supabasePublishableKey);

  function eur(n) {
    return '€' + parseFloat(n).toFixed(2);
  }

  function applyPlan(input) {
    if (!input) return;
    var name = input.getAttribute('data-name');
    var price = input.getAttribute('data-price');
    var updates = input.getAttribute('data-updates');
    sumPlanName.textContent = name;
    sumUpdates.textContent = updates + ' / month';
    sumTotal.textContent = eur(price);
    hiddenTotal.value = eur(price);
    hiddenPlanName.value = name;
  }

  planInputs.forEach(function (input) {
    input.addEventListener('change', function () { applyPlan(input); });
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

  // Dropzone interactions
  if (dropzone && pdfInput) {
    dropzone.addEventListener('click', function () { pdfInput.click(); });

    pdfInput.addEventListener('change', function () {
      handleFile(pdfInput.files && pdfInput.files[0]);
    });

    ['dragover', 'dragenter'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropzone.style.opacity = '.85';
      });
    });
    ['dragleave', 'dragend'].forEach(function (evt) {
      dropzone.addEventListener(evt, function () { dropzone.style.opacity = '1'; });
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropzone.style.opacity = '1';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        pdfInput.files = e.dataTransfer.files;
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  function handleFile(file) {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      pdfInput.value = '';
      fileLabel.textContent = 'Upload your menu PDF';
      return;
    }
    fileLabel.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
  }

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
    var file = pdfInput.files && pdfInput.files[0];
    if (!file) {
      alert('Please attach your menu PDF before continuing.');
      return;
    }

    var selectedPlan = form.querySelector('input[name="Selected Plan"]:checked');
    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('email').value.trim();
    var companyName = document.getElementById('companyName').value.trim();
    var phone = document.getElementById('phone').value.trim();

    setBusy('Uploading menu…');
    var safeName = file.name.replace(/[^a-zA-Z0-9.\-_]+/g, '_');
    var storagePath = 'pending/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '-' + safeName;

    supabaseClient.storage.from('menu-pdfs').upload(storagePath, file, { contentType: 'application/pdf' })
      .then(function (result) {
        if (result.error) throw new Error('Could not upload your PDF. Please try again.');
        setBusy('Opening secure checkout…');
        return fetch(checkoutEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: supabasePublishableKey },
          body: JSON.stringify({
            plan: selectedPlan && selectedPlan.dataset.code,
            firstName: firstName,
            lastName: lastName,
            email: email,
            companyName: companyName,
            phone: phone,
            pdfPath: storagePath
          })
        });
      })
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'Checkout could not be started.'); return data; }); })
      .then(function (data) { window.location.assign(data.url); })
      .catch(function (error) {
        alert(error.message);
        resetButton();
      });
  });
});
