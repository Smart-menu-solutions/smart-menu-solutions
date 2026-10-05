// upload.html / de/upload.html / it/upload.html - the upload step after payment. Stripe
// Checkout redirects here with ?session_id=..., the confirmation email links
// here with ?token=... . Everything is checked server-side by the
// order-upload Edge Function (paid order only, fixed paths, real file
// content); the checks here only give the customer a quick, clear message.
document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('uploadApp');
  if (!root) return;

  var supabaseUrl = 'https://qlzugnwsufbgznoawvic.supabase.co';
  var supabasePublishableKey = 'sb_publishable_m7GxKtc8I3F8ASzuMaJvZg_8CQuKToA';
  var endpoint = supabaseUrl + '/functions/v1/order-upload';
  var MAX_BYTES = 50 * 1024 * 1024;
  // Accepted first bytes per file kind (the logo may be PNG or JPEG).
  var MAGICS = { pdf: [[0x25, 0x50, 0x44, 0x46, 0x2d]], zip: [[0x50, 0x4b, 0x03, 0x04]], logo: [[0x89, 0x50, 0x4e, 0x47], [0xff, 0xd8, 0xff]] };

  var lang = root.getAttribute('data-lang');
  if (lang !== 'en' && lang !== 'it') lang = 'de';
  var serverLang = lang;
  var TEXT = {
    de: {
      thanksInitial: 'Vielen Dank für Ihre Bestellung{name}!',
      thanksRenewal: 'Vielen Dank für Ihre Verlängerung{name}!',
      introInitial: 'Ihre Zahlung ist eingegangen. Laden Sie jetzt bitte Ihre Speisekarte hoch, damit wir mit der Einrichtung beginnen können.',
      introRenewal: 'Ihre Zahlung ist eingegangen. Falls sich Ihre Speisekarte geändert hat, laden Sie hier die neue Version hoch. Sonst klicken Sie einfach auf „Fertig“.',
      pdfLabel: '01 / SPEISEKARTE (PDF)',
      pdfLabelOptional: '01 / NEUE SPEISEKARTE (PDF, OPTIONAL)',
      zipLabel: '02 / FOTOS (ZIP)',
      zipLabelOptional: '02 / FOTOS (ZIP, OPTIONAL)',
      logoLabel: '{n} / LOGO (OPTIONAL)',
      logoTitle: 'Logo hochladen (PNG oder JPG)',
      tablesLabel: '{n} / TISCHE',
      tablesHint: 'Für Smart ServiceHub™: Wie sind Ihre Tische nummeriert? Jeder Tisch bekommt seinen eigenen QR-Code zum Bestellen.',
      notLogo: 'Das Logo muss ein PNG- oder JPG-Bild sein.',
      pdfTitle: 'Speisekarte als PDF hochladen',
      zipTitle: 'Fotos als ZIP-Datei hochladen',
      dropSub: 'Hier klicken oder Datei hierher ziehen',
      already: 'Bereits hochgeladen. Eine neue Datei ersetzt sie.',
      submit: 'Dateien absenden',
      submitRenewal: 'Fertig',
      uploading: 'Wird hochgeladen …',
      checking: 'Wird geprüft …',
      notPdf: 'Das ist keine gültige PDF-Datei. Bitte wählen Sie Ihre Speisekarte als PDF.',
      notZip: 'Das ist keine gültige ZIP-Datei. Bitte packen Sie Ihre Fotos in eine ZIP-Datei.',
      tooBig: 'Die Datei ist größer als 50 MB. Bitte verkleinern Sie sie oder schreiben Sie uns.',
      needPdf: 'Bitte wählen Sie zuerst Ihre Speisekarte (PDF) aus.',
      needZip: 'Bitte wählen Sie noch Ihre Fotos (ZIP) aus.',
      failed: 'Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal.',
      missingLink: 'Dieser Link ist unvollständig. Bitte nutzen Sie den Link aus Ihrer Bestätigungs-E-Mail.'
    },
    en: {
      thanksInitial: 'Thank you for your order{name}!',
      thanksRenewal: 'Thank you for renewing{name}!',
      introInitial: 'Your payment has been received. Please upload your menu now so we can start setting it up.',
      introRenewal: 'Your payment has been received. If your menu has changed, upload the new version here. Otherwise just click "Done".',
      pdfLabel: '01 / MENU (PDF)',
      pdfLabelOptional: '01 / NEW MENU (PDF, OPTIONAL)',
      zipLabel: '02 / PHOTOS (ZIP)',
      zipLabelOptional: '02 / PHOTOS (ZIP, OPTIONAL)',
      logoLabel: '{n} / LOGO (OPTIONAL)',
      logoTitle: 'Upload your logo (PNG or JPG)',
      tablesLabel: '{n} / TABLES',
      tablesHint: 'For Smart ServiceHub™: how are your tables numbered? Each table gets its own QR code for ordering.',
      notLogo: 'The logo must be a PNG or JPG image.',
      pdfTitle: 'Upload your menu as a PDF',
      zipTitle: 'Upload your photos as a ZIP file',
      dropSub: 'Click here or drag the file here',
      already: 'Already uploaded. A new file replaces it.',
      submit: 'Send files',
      submitRenewal: 'Done',
      uploading: 'Uploading …',
      checking: 'Checking …',
      notPdf: 'This is not a valid PDF file. Please choose your menu as a PDF.',
      notZip: 'This is not a valid ZIP file. Please put your photos into a ZIP file.',
      tooBig: 'The file is larger than 50 MB. Please make it smaller or email us.',
      needPdf: 'Please choose your menu (PDF) first.',
      needZip: 'Please also choose your photos (ZIP).',
      failed: 'Something went wrong. Please try again.',
      missingLink: 'This link is incomplete. Please use the link from your confirmation email.'
    },
    it: {
      thanksInitial: 'Grazie per il vostro ordine{name}!',
      thanksRenewal: 'Grazie per il rinnovo{name}!',
      introInitial: 'Abbiamo ricevuto il vostro pagamento. Caricate ora il vostro menu, così possiamo iniziare a prepararlo.',
      introRenewal: 'Abbiamo ricevuto il vostro pagamento. Se il vostro menu è cambiato, caricate qui la nuova versione. Altrimenti cliccate semplicemente su "Fatto".',
      pdfLabel: '01 / MENU (PDF)',
      pdfLabelOptional: '01 / NUOVO MENU (PDF, OPZIONALE)',
      zipLabel: '02 / FOTO (ZIP)',
      zipLabelOptional: '02 / FOTO (ZIP, OPZIONALE)',
      logoLabel: '{n} / LOGO (OPZIONALE)',
      logoTitle: 'Caricate il vostro logo (PNG o JPG)',
      tablesLabel: '{n} / TAVOLI',
      tablesHint: 'Per Smart ServiceHub™: come sono numerati i vostri tavoli? Ogni tavolo riceve il proprio QR code per ordinare.',
      notLogo: 'Il logo deve essere un\'immagine PNG o JPG.',
      pdfTitle: 'Caricate il vostro menu in PDF',
      zipTitle: 'Caricate le vostre foto come file ZIP',
      dropSub: 'Cliccate qui o trascinate qui il file',
      already: 'Già caricato. Un nuovo file lo sostituisce.',
      submit: 'Invia i file',
      submitRenewal: 'Fatto',
      uploading: 'Caricamento in corso …',
      checking: 'Verifica in corso …',
      notPdf: 'Questo non è un file PDF valido. Scegliete il vostro menu in formato PDF.',
      notZip: 'Questo non è un file ZIP valido. Mettete le vostre foto in un file ZIP.',
      tooBig: 'Il file supera i 50 MB. Riducetene le dimensioni o scriveteci.',
      needPdf: 'Scegliete prima il vostro menu (PDF).',
      needZip: 'Scegliete anche le vostre foto (ZIP).',
      failed: 'Purtroppo qualcosa non ha funzionato. Riprovate.',
      missingLink: 'Questo link è incompleto. Usate il link della vostra e-mail di conferma.'
    }
  }[lang];

  var params = new URLSearchParams(window.location.search);
  var credentials = { session_id: params.get('session_id') || '', token: params.get('token') || '' };

  // The DE/EN switch has to keep ?session_id= / ?token=, otherwise the other
  // language's page wouldn't know which order it's for.
  document.querySelectorAll('.flag-btn').forEach(function (link) {
    link.setAttribute('href', link.getAttribute('href').split('?')[0] + window.location.search);
  });

  var loading = document.getElementById('uploadLoading');
  var errorBox = document.getElementById('uploadError');
  var form = document.getElementById('uploadForm');
  var done = document.getElementById('uploadDone');
  var submitButton = document.getElementById('uploadSubmit');
  var status = null;
  var chosen = { pdf: null, zip: null, logo: null };

  function show(element) { [loading, errorBox, form, done].forEach(function (el) { el.hidden = el !== element; }); }
  function fail(message) { errorBox.querySelector('p').textContent = message; show(errorBox); }

  function call(body) {
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabasePublishableKey },
      body: JSON.stringify(Object.assign({ lang: serverLang }, credentials, body))
    }).catch(function () {
      throw new Error(TEXT.failed); // offline / network error - not the browser's own English text
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok) { var error = new Error(data.error || TEXT.failed); error.retry = !!data.retry; throw error; }
        return data;
      });
    });
  }

  if (!credentials.session_id && !credentials.token) { fail(TEXT.missingLink); return; }
  if (!window.supabase) { fail(TEXT.failed); return; }
  var supabaseClient = window.supabase.createClient(supabaseUrl, supabasePublishableKey);

  call({ action: 'status' }).then(function (data) {
    status = data;
    var name = data.firstName ? ', ' + data.firstName : '';
    var renewal = data.type === 'renewal';
    document.getElementById('uploadTitle').textContent = (renewal ? TEXT.thanksRenewal : TEXT.thanksInitial).replace('{name}', name);
    document.getElementById('uploadIntro').textContent = renewal ? TEXT.introRenewal : TEXT.introInitial;
    setupDropzone('pdf', renewal ? TEXT.pdfLabelOptional : TEXT.pdfLabel, TEXT.pdfTitle, data.files.pdf);
    if (data.photoAddon) setupDropzone('zip', data.zipRequired ? TEXT.zipLabel : TEXT.zipLabelOptional, TEXT.zipTitle, data.files.zip);
    document.getElementById('zipSection').hidden = !data.photoAddon;
    var step = data.photoAddon ? 3 : 2;
    var stepLabel = function (text) { return text.replace('{n}', ('0' + step++).slice(-2)); };
    setupDropzone('logo', stepLabel(TEXT.logoLabel), TEXT.logoTitle, data.files.logo);
    var tablesSection = document.getElementById('tablesSection');
    tablesSection.hidden = !data.hubAddon;
    if (data.hubAddon) {
      tablesSection.querySelector('.order-step-label').textContent = stepLabel(TEXT.tablesLabel);
      tablesSection.querySelector('.tables-hint').textContent = TEXT.tablesHint;
    }
    submitButton.querySelector('span').textContent = renewal ? TEXT.submitRenewal : TEXT.submit;
    show(form);
  }).catch(function (error) { fail(error.message); });

  function setupDropzone(kind, label, title, alreadyThere) {
    var section = document.getElementById(kind + 'Section');
    var zone = section.querySelector('.dropzone');
    var input = section.querySelector('input[type="file"]');
    var titleEl = section.querySelector('.dz-title');
    section.querySelector('.order-step-label').textContent = label;
    titleEl.textContent = title;
    section.querySelector('.dz-sub').textContent = TEXT.dropSub;
    section.querySelector('.upload-already').hidden = !alreadyThere;
    section.querySelector('.upload-already').textContent = '✓ ' + TEXT.already;

    function pick(file) {
      if (!file) return;
      checkFile(file, kind).then(function (problem) {
        if (problem) {
          alert(problem);
          input.value = '';
          chosen[kind] = null;
          titleEl.textContent = title;
          return;
        }
        chosen[kind] = file;
        titleEl.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
      });
    }
    zone.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () { pick(input.files && input.files[0]); });
    ['dragover', 'dragenter'].forEach(function (evt) {
      zone.addEventListener(evt, function (e) { e.preventDefault(); zone.style.opacity = '.85'; });
    });
    ['dragleave', 'dragend'].forEach(function (evt) {
      zone.addEventListener(evt, function () { zone.style.opacity = '1'; });
    });
    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.style.opacity = '1';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) pick(e.dataTransfer.files[0]);
    });
  }

  // Looks at the file's first bytes, not its name or declared type.
  function checkFile(file, kind) {
    if (file.size > MAX_BYTES) return Promise.resolve(TEXT.tooBig);
    return file.slice(0, 8).arrayBuffer().then(function (buffer) {
      var bytes = new Uint8Array(buffer);
      var ok = MAGICS[kind].some(function (magic) { return magic.every(function (byte, i) { return bytes[i] === byte; }); });
      return ok ? null : ({ pdf: TEXT.notPdf, zip: TEXT.notZip, logo: TEXT.notLogo })[kind];
    });
  }

  function upload(kind) {
    var file = chosen[kind];
    if (!file) return Promise.resolve();
    // A logo's real type is known from its first bytes (checkFile), its name may lie.
    var logoType = kind === 'logo' ? (file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png') : undefined;
    return (kind === 'logo' ? file.slice(0, 1).arrayBuffer().then(function (buffer) {
      logoType = new Uint8Array(buffer)[0] === 0xff ? 'image/jpeg' : 'image/png';
    }) : Promise.resolve()).then(function () {
      return call({ action: 'sign', kind: kind, contentType: logoType });
    }).then(function (signed) {
      return supabaseClient.storage.from('menu-pdfs').uploadToSignedUrl(signed.path, signed.token, file, { contentType: signed.contentType, upsert: true });
    }).then(function (result) {
      if (result && result.error) throw new Error(TEXT.failed);
    });
  }

  // The order row is created by Stripe's webhook, which can lag a few seconds
  // behind the redirect - order-upload answers 409 + retry until it's there.
  function complete(attempt) {
    var numbersInput = document.getElementById('tableNumbers');
    var tableNumbers = status && status.hubAddon && numbersInput ? numbersInput.value.trim() : '';
    return call({ action: 'complete', tableNumbers: tableNumbers }).catch(function (error) {
      if (error.retry && attempt < 10) {
        return new Promise(function (resolve) { setTimeout(resolve, 3000); }).then(function () { return complete(attempt + 1); });
      }
      throw error;
    });
  }

  function setBusy(busy, text) {
    submitButton.disabled = busy;
    submitButton.querySelector('span').textContent = busy ? text : (status && status.type === 'renewal' ? TEXT.submitRenewal : TEXT.submit);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (status.type !== 'renewal' && !chosen.pdf && !status.files.pdf) { alert(TEXT.needPdf); return; }
    if (status.zipRequired && !chosen.zip && !status.files.zip) { alert(TEXT.needZip); return; }

    setBusy(true, TEXT.uploading);
    upload('pdf')
      .then(function () { return upload('zip'); })
      .then(function () { return upload('logo'); })
      .then(function () { setBusy(true, TEXT.checking); return complete(0); })
      .then(function () { show(done); window.scrollTo(0, 0); })
      .catch(function (error) { alert(error.message || TEXT.failed); setBusy(false); });
  });
});
