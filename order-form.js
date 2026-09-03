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

  function eur(n) {
    return '\u20AC' + parseFloat(n).toFixed(2);
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

  // Validate the attachment before the order request is submitted.
  form.addEventListener('submit', function (e) {
    if (!pdfInput.files || pdfInput.files.length === 0) {
      e.preventDefault();
      alert('Please attach your menu PDF before continuing.');
      return;
    }
  });
});
