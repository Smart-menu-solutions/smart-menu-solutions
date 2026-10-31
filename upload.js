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
      pdfLabel: '01 / SPEISEKARTE (PDF ODER FOTOS)',
      pdfLabelOptional: '01 / NEUE SPEISEKARTE (PDF ODER FOTOS, OPTIONAL)',
      zipLabel: '02 / FOTOS (ZIP)',
      zipLabelOptional: '02 / FOTOS (ZIP, OPTIONAL)',
      logoLabel: '{n} / LOGO (OPTIONAL)',
      logoTitle: 'Logo hochladen (PNG oder JPG)',
      tablesLabel: '{n} / TISCHE (OPTIONAL)',
      tablesHint: 'Für Smart ServiceHub™: Wie sind Ihre Tische nummeriert? Jeder Tisch bekommt seinen eigenen QR-Code zum Bestellen. Sie können das auch später eintragen – sobald Ihre Speisekarte eingerichtet ist, schicken wir Ihnen einen Link für Tische und Kassennummern.',
      notLogo: 'Das Logo muss ein PNG- oder JPG-Bild sein.',
      pdfTitle: 'Speisekarte als PDF oder Fotos hochladen',
      zipTitle: 'Fotos als ZIP-Datei hochladen',
      dropSub: 'Hier klicken oder Datei hierher ziehen',
      dropSubMenu: 'Hier klicken oder Dateien hierher ziehen – mehrere Fotos werden zu einem PDF',
      photosPreparing: 'Fotos werden vorbereitet …',
      photosChosen: '{n} Foto(s) als PDF ({size} MB)',
      tooManyPhotos: 'Bitte wählen Sie höchstens 10 Fotos auf einmal.',
      photoFailed: 'Ein Foto konnte nicht gelesen werden. Bitte wählen Sie JPG- oder PNG-Bilder.',
      already: 'Bereits hochgeladen. Eine neue Datei ersetzt sie.',
      submit: 'Dateien absenden',
      submitRenewal: 'Fertig',
      uploading: 'Wird hochgeladen …',
      checking: 'Wird geprüft …',
      notPdf: 'Bitte wählen Sie Ihre Speisekarte als PDF oder als Fotos (JPG/PNG).',
      notZip: 'Das ist keine gültige ZIP-Datei. Bitte packen Sie Ihre Fotos in eine ZIP-Datei.',
      tooBig: 'Die Datei ist größer als 50 MB. Bitte verkleinern Sie sie oder schreiben Sie uns.',
      needPdf: 'Bitte wählen Sie zuerst Ihre Speisekarte (PDF oder Fotos) aus.',
      needZip: 'Bitte wählen Sie noch Ihre Fotos (ZIP) aus.',
      failed: 'Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal.',
      missingLink: 'Dieser Link ist unvollständig. Bitte nutzen Sie den Link aus Ihrer Bestätigungs-E-Mail.'
    },
    en: {
      thanksInitial: 'Thank you for your order{name}!',
      thanksRenewal: 'Thank you for renewing{name}!',
      introInitial: 'Your payment has been received. Please upload your menu now so we can start setting it up.',
      introRenewal: 'Your payment has been received. If your menu has changed, upload the new version here. Otherwise just click "Done".',
      pdfLabel: '01 / MENU (PDF OR PHOTOS)',
      pdfLabelOptional: '01 / NEW MENU (PDF OR PHOTOS, OPTIONAL)',
      zipLabel: '02 / PHOTOS (ZIP)',
      zipLabelOptional: '02 / PHOTOS (ZIP, OPTIONAL)',
      logoLabel: '{n} / LOGO (OPTIONAL)',
      logoTitle: 'Upload your logo (PNG or JPG)',
      tablesLabel: '{n} / TABLES (OPTIONAL)',
      tablesHint: 'For Smart ServiceHub™: how are your tables numbered? Each table gets its own QR code for ordering. You can also do this later - once your menu is set up, we send you a link for your tables and till numbers.',
      notLogo: 'The logo must be a PNG or JPG image.',
      pdfTitle: 'Upload your menu as a PDF or photos',
      zipTitle: 'Upload your photos as a ZIP file',
      dropSub: 'Click here or drag the file here',
      dropSubMenu: 'Click here or drag files here – several photos become one PDF',
      photosPreparing: 'Preparing your photos …',
      photosChosen: '{n} photo(s) as a PDF ({size} MB)',
      tooManyPhotos: 'Please choose at most 10 photos at once.',
      photoFailed: 'A photo could not be read. Please choose JPG or PNG images.',
      already: 'Already uploaded. A new file replaces it.',
      submit: 'Send files',
      submitRenewal: 'Done',
      uploading: 'Uploading …',
      checking: 'Checking …',
      notPdf: 'Please choose your menu as a PDF or as photos (JPG/PNG).',
      notZip: 'This is not a valid ZIP file. Please put your photos into a ZIP file.',
      tooBig: 'The file is larger than 50 MB. Please make it smaller or email us.',
      needPdf: 'Please choose your menu (PDF or photos) first.',
      needZip: 'Please also choose your photos (ZIP).',
      failed: 'Something went wrong. Please try again.',
      missingLink: 'This link is incomplete. Please use the link from your confirmation email.'
    },
    it: {
      thanksInitial: 'Grazie per il vostro ordine{name}!',
      thanksRenewal: 'Grazie per il rinnovo{name}!',
      introInitial: 'Abbiamo ricevuto il vostro pagamento. Caricate ora il vostro menu, così possiamo iniziare a prepararlo.',
      introRenewal: 'Abbiamo ricevuto il vostro pagamento. Se il vostro menu è cambiato, caricate qui la nuova versione. Altrimenti cliccate semplicemente su "Fatto".',
      pdfLabel: '01 / MENU (PDF OR PHOTOS)',
      pdfLabelOptional: '01 / NUOVO MENU (PDF O FOTO, OPZIONALE)',
      zipLabel: '02 / FOTO (ZIP)',
      zipLabelOptional: '02 / FOTO (ZIP, OPZIONALE)',
      logoLabel: '{n} / LOGO (OPZIONALE)',
      logoTitle: 'Caricate il vostro logo (PNG o JPG)',
      tablesLabel: '{n} / TAVOLI (FACOLTATIVO)',
      tablesHint: 'Per Smart ServiceHub™: come sono numerati i vostri tavoli? Ogni tavolo riceve il proprio QR code per ordinare. Potete farlo anche più tardi: quando il vostro menu è pronto, vi inviamo un link per tavoli e numeri di cassa.',
      notLogo: 'Il logo deve essere un\'immagine PNG o JPG.',
      pdfTitle: 'Caricate il vostro menu in PDF o in foto',
      zipTitle: 'Caricate le vostre foto come file ZIP',
      dropSub: 'Cliccate qui o trascinate qui il file',
      dropSubMenu: 'Cliccate qui o trascinate qui i file: più foto diventano un unico PDF',
      photosPreparing: 'Preparazione delle foto …',
      photosChosen: '{n} foto in un PDF ({size} MB)',
      tooManyPhotos: 'Scegliete al massimo 10 foto alla volta.',
      photoFailed: 'Non è stato possibile leggere una foto. Scegliete immagini JPG o PNG.',
      already: 'Già caricato. Un nuovo file lo sostituisce.',
      submit: 'Invia i file',
      submitRenewal: 'Fatto',
      uploading: 'Caricamento in corso …',
      checking: 'Verifica in corso …',
      notPdf: 'Scegliete il vostro menu in PDF o come foto (JPG/PNG).',
      notZip: 'Questo non è un file ZIP valido. Mettete le vostre foto in un file ZIP.',
      tooBig: 'Il file supera i 50 MB. Riducetene le dimensioni o scriveteci.',
      needPdf: 'Scegliete prima il vostro menu (PDF o foto).',
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
    var fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
    var name = fullName ? ', ' + fullName : '';
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
      // What was typed on an earlier upload comes back filled in.
      if (data.tableNumbers) document.getElementById('tableNumbers').value = data.tableNumbers;
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
    section.querySelector('.dz-sub').textContent = kind === 'pdf' ? TEXT.dropSubMenu : TEXT.dropSub;
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
    function reset() {
      input.value = '';
      chosen[kind] = null;
      titleEl.textContent = title;
    }
    // The menu may also come as photos (JPG/PNG, several pages): they become
    // one PDF right here, so everything after this step still gets a PDF.
    function pickFiles(files) {
      var list = Array.prototype.slice.call(files || []);
      if (!list.length) return;
      if (kind !== 'pdf') { pick(list[0]); return; }
      Promise.all(list.map(firstBytes)).then(function (heads) {
        if (!heads.every(isPhoto)) {
          if (list.length === 1) { pick(list[0]); return; }
          alert(TEXT.notPdf);
          reset();
          return;
        }
        if (list.length > MAX_PHOTOS) { alert(TEXT.tooManyPhotos); reset(); return; }
        titleEl.textContent = TEXT.photosPreparing;
        return photosToPdf(list).then(function (file) {
          if (file.size > MAX_BYTES) { alert(TEXT.tooBig); reset(); return; }
          chosen.pdf = file;
          titleEl.textContent = TEXT.photosChosen.replace('{n}', list.length).replace('{size}', (file.size / 1024 / 1024).toFixed(2));
        });
      }).catch(function () { alert(TEXT.photoFailed); reset(); });
    }
    zone.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () { pickFiles(input.files); });
    ['dragover', 'dragenter'].forEach(function (evt) {
      zone.addEventListener(evt, function (e) { e.preventDefault(); zone.style.opacity = '.85'; });
    });
    ['dragleave', 'dragend'].forEach(function (evt) {
      zone.addEventListener(evt, function () { zone.style.opacity = '1'; });
    });
    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.style.opacity = '1';
      pickFiles(e.dataTransfer.files);
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

  // Photos of the menu: one PDF page per photo, at most MAX_PHOTOS, each scaled
  // to PHOTO_MAX_PX on the long side - enough to read small menu print, small
  // enough to upload quickly from a phone.
  var MAX_PHOTOS = 10;
  var PHOTO_MAX_PX = 2400;

  function firstBytes(file) {
    return file.slice(0, 4).arrayBuffer().then(function (buffer) { return new Uint8Array(buffer); });
  }

  function isPhoto(bytes) {
    return (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) || (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47);
  }

  function photoToJpeg(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var image = new Image();
      image.onload = function () {
        var scale = Math.min(1, PHOTO_MAX_PX / Math.max(image.naturalWidth, image.naturalHeight));
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        var context = canvas.getContext('2d');
        context.fillStyle = '#fff'; // transparent PNG areas become white, not black
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error('jpeg')); return; }
          blob.arrayBuffer().then(function (buffer) {
            resolve({ bytes: new Uint8Array(buffer), width: canvas.width, height: canvas.height });
          }, reject);
        }, 'image/jpeg', 0.85);
      };
      image.onerror = function () { URL.revokeObjectURL(url); reject(new Error('image')); };
      image.src = url;
    });
  }

  // A minimal PDF: catalog, page tree, then per photo a page, its content
  // stream and the JPEG embedded unchanged (DCTDecode). 1 px = 0.75 pt (96 dpi).
  function jpegsToPdf(pages) {
    var encoder = new TextEncoder();
    var chunks = [];
    var length = 0;
    var offsets = [];
    function add(part) {
      var bytes = typeof part === 'string' ? encoder.encode(part) : part;
      chunks.push(bytes);
      length += bytes.length;
    }
    function object(number, dictionary, stream) {
      offsets[number] = length;
      add(number + ' 0 obj\n' + dictionary + '\n');
      if (stream) { add('stream\n'); add(stream); add('\nendstream\n'); }
      add('endobj\n');
    }
    add('%PDF-1.4\n');
    var kids = pages.map(function (page, index) { return (3 + index * 3) + ' 0 R'; }).join(' ');
    object(1, '<< /Type /Catalog /Pages 2 0 R >>');
    object(2, '<< /Type /Pages /Kids [' + kids + '] /Count ' + pages.length + ' >>');
    pages.forEach(function (page, index) {
      var pageNumber = 3 + index * 3;
      var width = (page.width * 0.75).toFixed(2);
      var height = (page.height * 0.75).toFixed(2);
      var content = encoder.encode('q ' + width + ' 0 0 ' + height + ' 0 0 cm /Im0 Do Q');
      object(pageNumber, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + width + ' ' + height + '] /Resources << /XObject << /Im0 ' + (pageNumber + 2) + ' 0 R >> >> /Contents ' + (pageNumber + 1) + ' 0 R >>');
      object(pageNumber + 1, '<< /Length ' + content.length + ' >>', content);
      object(pageNumber + 2, '<< /Type /XObject /Subtype /Image /Width ' + page.width + ' /Height ' + page.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + page.bytes.length + ' >>', page.bytes);
    });
    var size = 3 + pages.length * 3;
    var xref = length;
    var table = 'xref\n0 ' + size + '\n0000000000 65535 f \n';
    for (var number = 1; number < size; number += 1) table += ('0000000000' + offsets[number]).slice(-10) + ' 00000 n \n';
    add(table + 'trailer\n<< /Size ' + size + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
    var out = new Uint8Array(length);
    var position = 0;
    chunks.forEach(function (chunk) { out.set(chunk, position); position += chunk.length; });
    return out;
  }

  function photosToPdf(files) {
    return files.reduce(function (previous, file) {
      return previous.then(function (pages) {
        return photoToJpeg(file).then(function (page) { pages.push(page); return pages; });
      });
    }, Promise.resolve([])).then(function (pages) {
      return new File([jpegsToPdf(pages)], 'menu-photos.pdf', { type: 'application/pdf' });
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
