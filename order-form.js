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
  var photoUploadSection = document.getElementById('photoUploadSection');
  var photoDropzone = document.getElementById('photoDropzone');
  var photoUpload = document.getElementById('photoUpload');
  var photoFileLabel = document.getElementById('photoFileLabel');
  var payButton = document.getElementById('payButton');
  var dropzone = document.getElementById('dropzone');
  var pdfInput = document.getElementById('pdfUpload');
  var fileLabel = document.getElementById('fileLabel');

  var supabaseUrl = 'https://qlzugnwsufbgznoawvic.supabase.co';
  var supabasePublishableKey = 'sb_publishable_m7GxKtc8I3F8ASzuMaJvZg_8CQuKToA';
  var checkoutEndpoint = supabaseUrl + '/functions/v1/create-checkout-session';

  // These are the messages this form still shows via alert()/plain text
  // instead of data-i18n, so they follow the same localStorage language
  // switch as the rest of the page instead of always being English.
  function t(en, de) {
    return localStorage.getItem('selectedLang') === 'de' ? de : en;
  }

  if (!window.supabase) {
    alert(t('Could not load the order form. Please refresh the page.', 'Das Bestellformular konnte nicht geladen werden. Bitte laden Sie die Seite neu.'));
    return;
  }
  var supabaseClient = window.supabase.createClient(supabaseUrl, supabasePublishableKey);

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

  function updateTotal() {
    var input = currentPlanInput();
    if (!input) return;
    var name = input.getAttribute('data-name');
    var price = parseFloat(input.getAttribute('data-price'));
    var photoPrice = parseFloat(input.getAttribute('data-photo-price')) || 0;
    var addonOn = isPhotoAddonChecked();

    var total = price + (addonOn ? photoPrice : 0);
    sumTotal.textContent = eur(total);
    hiddenTotal.value = eur(total);
    hiddenPlanName.value = name;

    if (osLinePhoto) osLinePhoto.style.display = addonOn ? '' : 'none';
    if (sumPhotoPrice) sumPhotoPrice.textContent = '+' + eur(photoPrice);
    if (photoUploadSection) photoUploadSection.style.display = addonOn ? '' : 'none';
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
      alert(t('Please upload a valid PDF file.', 'Bitte laden Sie eine gültige PDF-Datei hoch.'));
      pdfInput.value = '';
      fileLabel.textContent = t('Upload your menu PDF', 'Menü als PDF hochladen');
      return;
    }
    fileLabel.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
  }

  // Second dropzone (its own "04" step), only shown once the photo add-on
  // is active for the selected plan (see updateTotal()). Takes a single ZIP
  // containing all the dish photos, rather than picking PNGs one by one.
  if (photoDropzone && photoUpload) {
    photoDropzone.addEventListener('click', function () { photoUpload.click(); });

    photoUpload.addEventListener('change', function () {
      handlePhotoZip(photoUpload.files && photoUpload.files[0]);
    });

    ['dragover', 'dragenter'].forEach(function (evt) {
      photoDropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        photoDropzone.style.opacity = '.85';
      });
    });
    ['dragleave', 'dragend'].forEach(function (evt) {
      photoDropzone.addEventListener(evt, function () { photoDropzone.style.opacity = '1'; });
    });
    photoDropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      photoDropzone.style.opacity = '1';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        photoUpload.files = e.dataTransfer.files;
        handlePhotoZip(e.dataTransfer.files[0]);
      }
    });
  }

  function isZipFile(file) {
    return file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || /\.zip$/i.test(file.name);
  }

  function handlePhotoZip(file) {
    if (!file) return;
    if (!isZipFile(file)) {
      alert(t('Please upload a ZIP file.', 'Bitte laden Sie eine ZIP-Datei hoch.'));
      photoUpload.value = '';
      photoFileLabel.textContent = t('Upload photo PNGs (ZIP)', 'Foto-PNG hochladen');
      return;
    }
    photoFileLabel.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
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
      alert(t('Please attach your menu PDF before continuing.', 'Bitte fügen Sie Ihr Menü als PDF an, bevor Sie fortfahren.'));
      return;
    }

    var addonOn = isPhotoAddonChecked();
    var photoZipFile = photoUpload && photoUpload.files ? photoUpload.files[0] : null;
    if (addonOn && !photoZipFile) {
      alert(t('Please upload your dish photos as a ZIP file, or turn off the photo add-on.', 'Bitte laden Sie Ihre Gerichtfotos als ZIP-Datei hoch oder deaktivieren Sie den Foto-Zusatz.'));
      return;
    }

    var selectedPlan = form.querySelector('input[name="Selected Plan"]:checked');
    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('email').value.trim();
    var companyName = document.getElementById('companyName').value.trim();
    var phone = document.getElementById('phone').value.trim();

    setBusy('Uploading menu…');
    var token = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    var safeName = file.name.replace(/[^a-zA-Z0-9.\-_]+/g, '_');
    var storagePath = 'pending/' + token + '-' + safeName;
    var photoZipPath = 'pending/' + token + '-photos.zip';
    var uploaded = false;
    var photoZipUploaded = false;

    supabaseClient.storage.from('menu-pdfs').upload(storagePath, file, { contentType: 'application/pdf' })
      .then(function (result) {
        if (result.error) throw new Error('Could not upload your PDF: ' + (result.error.message || 'unknown error'));
        uploaded = true;
        if (!photoZipFile) return null;
        setBusy(t('Uploading photos…', 'Fotos werden hochgeladen…'));
        return supabaseClient.storage.from('menu-pdfs').upload(photoZipPath, photoZipFile, { contentType: 'application/zip' })
          .then(function (result) {
            if (result.error) throw new Error('Could not upload your photo ZIP: ' + (result.error.message || 'unknown error'));
            photoZipUploaded = true;
          });
      })
      .then(function () {
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
            pdfPath: storagePath,
            photoAddon: addonOn,
            photoZipPath: photoZipUploaded ? photoZipPath : ''
          })
        });
      })
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'Checkout could not be started.'); return data; }); })
      .then(function (data) { window.location.assign(data.url); })
      .catch(function (error) {
        // Checkout failed (or was declined) after files already made it to
        // storage — remove them rather than leaving orphaned uploads with no
        // order attached to them. Best-effort: a failure here isn't shown to
        // the customer, it just means manual cleanup is needed later.
        if (uploaded) {
          supabaseClient.storage.from('menu-pdfs').remove([storagePath]).catch(function () {});
        }
        if (photoZipUploaded) {
          supabaseClient.storage.from('menu-pdfs').remove([photoZipPath]).catch(function () {});
        }
        alert(error.message);
        resetButton();
      });
  });
});
