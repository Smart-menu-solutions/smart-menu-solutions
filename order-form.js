document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('orderForm');

  if (!form) return;

  var hiddenTotal = document.getElementById('hiddenTotal');
  var hiddenPlanName = document.getElementById('hiddenPlanName');
  var sumPlanName = document.getElementById('sumPlanName');
  var sumUpdates = document.getElementById('sumUpdates');
  var sumTotal = document.getElementById('sumTotal');
  var payButton = document.getElementById('payButton');
  var dropzone = document.getElementById('dropzone');
  var pdfInput = document.getElementById('pdfUpload');
  var fileLabel = document.getElementById('fileLabel');
  var manualAmount = document.getElementById('manualAmount');
  var feedback = document.getElementById('orderFormFeedback');
  var checkoutEndpoint = 'https://qlzugnwsufbgznoawvic.supabase.co/functions/v1/create-checkout-session';
  var supabasePublishableKey = 'sb_publishable_m7GxKtc8I3F8ASzuMaJvZg_8CQuKToA';

  function eur(value) {
    return '\u20AC' + parseFloat(value).toFixed(2);
  }

  function setFeedback(message) {
    if (feedback) {
      feedback.textContent = message || '';
    }
  }

  function resetSubmitButton() {
    if (!payButton) return;
    payButton.disabled = false;
    payButton.textContent = payButton.dataset.originalText || payButton.textContent;
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

    if (manualAmount && manualAmount.dataset.manual !== 'true') {
      manualAmount.value = parseFloat(price).toFixed(2);
    }
  }

  function resetFileState() {
    pdfInput.value = '';
    pdfInput.setCustomValidity('');
    fileLabel.textContent = 'Upload your menu PDF';
  }

  function handleFile(file) {
    if (!file) {
      resetFileState();
      return false;
    }

    var fileName = file.name || '';
    var isPdf = file.type === 'application/pdf' || (!file.type && /\.pdf$/i.test(fileName));

    if (!isPdf) {
      resetFileState();
      pdfInput.setCustomValidity('Please upload a PDF file.');
      pdfInput.reportValidity();
      setFeedback('Please upload a valid PDF file before continuing.');
      return false;
    }

    pdfInput.setCustomValidity('');
    fileLabel.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
    setFeedback('');

    return true;
  }

  function setDroppedFiles(fileList) {
    if (!fileList || !fileList.length) {
      return false;
    }

    var firstFile = fileList[0];

    if (typeof DataTransfer === 'function') {
      var transfer = new DataTransfer();
      transfer.items.add(firstFile);
      pdfInput.files = transfer.files;
      return true;
    }

    return false;
  }

  function validateAmount() {
    var amount = Number(manualAmount.value);

    if (!Number.isFinite(amount) || amount < 119 || amount > 10000) {
      manualAmount.setCustomValidity('Please enter an amount between €119 and €10,000.');
      manualAmount.reportValidity();
      setFeedback('Please enter an amount between €119 and €10,000.');
      return null;
    }

    manualAmount.setCustomValidity('');
    return amount;
  }

  form.addEventListener('change', function (event) {
    var planInput = event.target.closest('input[name="Selected Plan"]');

    if (planInput) {
      manualAmount.dataset.manual = 'false';
      applyPlan(planInput);
      setFeedback('');
      return;
    }

    if (event.target === pdfInput) {
      handleFile(pdfInput.files && pdfInput.files[0]);
    }
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

  if (dropzone && pdfInput) {
    dropzone.addEventListener('click', function () { pdfInput.click(); });
    dropzone.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        pdfInput.click();
      }
    });

    ['dragover', 'dragenter'].forEach(function (type) {
      dropzone.addEventListener(type, function (event) {
        event.preventDefault();
        dropzone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'dragend'].forEach(function (type) {
      dropzone.addEventListener(type, function () {
        dropzone.classList.remove('is-dragover');
      });
    });

    dropzone.addEventListener('drop', function (event) {
      event.preventDefault();
      dropzone.classList.remove('is-dragover');

      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        setDroppedFiles(event.dataTransfer.files);
        handleFile((pdfInput.files && pdfInput.files[0]) || event.dataTransfer.files[0]);
      }
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setFeedback('');

    if (!pdfInput.files || pdfInput.files.length === 0 || !handleFile(pdfInput.files[0])) {
      if (!pdfInput.files || pdfInput.files.length === 0) {
        pdfInput.setCustomValidity('Please attach your menu PDF before continuing.');
        pdfInput.reportValidity();
        setFeedback('Please attach your menu PDF before continuing.');
      }

      return;
    }

    var amount = validateAmount();

    if (amount === null) {
      return;
    }

    var selectedPlan = form.querySelector('input[name="Selected Plan"]:checked');
    var emailField = form.querySelector('input[type="email"]');
    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();

    payButton.disabled = true;
    payButton.dataset.originalText = payButton.textContent;
    payButton.textContent = 'Opening secure checkout…';

    fetch(checkoutEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabasePublishableKey },
      body: JSON.stringify({
        plan: selectedPlan && selectedPlan.dataset.code,
        amount: amount,
        email: emailField.value.trim(),
        firstName: firstName,
        lastName: lastName,
        pdfFileName: pdfInput.files[0].name
      })
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (!response.ok) {
            throw new Error(data.error || 'Checkout could not be started.');
          }

          return data;
        });
      })
      .then(function (data) {
        if (!data.url) {
          throw new Error('Checkout could not be started.');
        }

        window.location.assign(data.url);
      })
      .catch(function (error) {
        setFeedback(error.message);
        resetSubmitButton();
      });
  });

  manualAmount.addEventListener('input', function () {
    var value = Number(manualAmount.value);
    var fallbackPlan = form.querySelector('input[name="Selected Plan"]:checked');

    manualAmount.dataset.manual = 'true';
    manualAmount.setCustomValidity('');
    setFeedback('');

    if (Number.isFinite(value)) {
      sumTotal.textContent = eur(value);
      hiddenTotal.value = eur(value);
      return;
    }

    if (fallbackPlan) {
      sumTotal.textContent = eur(fallbackPlan.getAttribute('data-price'));
      hiddenTotal.value = eur(fallbackPlan.getAttribute('data-price'));
    }
  });
});
