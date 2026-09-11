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
  var supabaseClient = window.supabase.createClient(supabaseUrl, supabasePublishableKey);

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

  function eur(n) {
    return '€' + parseFloat(n).toFixed(2);
  }

  function applyPlan(input) {
    if (!input) return;
    sumPlanName.textContent = input.getAttribute('data-name');
    sumUpdates.textContent = input.getAttribute('data-updates') + ' / month';
    sumTotal.textContent = eur(input.getAttribute('data-price'));
    hiddenTotal.value = eur(input.getAttribute('data-price'));
    hiddenPlanName.value = input.getAttribute('data-name');
  }

  planInputs.forEach(function (input) {
    input.addEventListener('change', function () { applyPlan(input); });
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

  if (dropzone && pdfInput) {
    dropzone.addEventListener('click', function () { pdfInput.click(); });
    pdfInput.addEventListener('change', function () { handleFile(pdfInput.files && pdfInput.files[0]); });
    ['dragover', 'dragenter'].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) { e.preventDefault(); dropzone.style.opacity = '.85'; });
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
      fileLabel.textContent = 'Upload your menu PDF (new or unchanged)';
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
    payButton.textContent = payButton.dataset.originalText || 'Renew now';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var file = pdfInput.files && pdfInput.files[0];
    if (!file) {
      alert('Please attach your menu PDF before continuing.');
      return;
    }
    var selectedPlan = form.querySelector('input[name="Selected Plan"]:checked');
    if (!selectedPlan) {
      alert('Please choose a plan.');
      return;
    }

    setBusy('Uploading menu…');
    var safeName = file.name.replace(/[^a-zA-Z0-9.\-_]+/g, '_');
    var storagePath = 'pending/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '-' + safeName;

    supabaseClient.storage.from('menu-pdfs').upload(storagePath, file, { contentType: 'application/pdf' })
      .then(function (result) {
        if (result.error) throw new Error('Could not upload your PDF: ' + (result.error.message || 'unknown error'));
        setBusy('Opening secure checkout…');
        return fetch(renewalEndpoint, {
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
            pdfPath: storagePath
          })
        });
      })
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'Renewal checkout could not be started.'); return data; }); })
      .then(function (data) { window.location.assign(data.url); })
      .catch(function (error) {
        alert(error.message);
        resetButton();
      });
  });
});
