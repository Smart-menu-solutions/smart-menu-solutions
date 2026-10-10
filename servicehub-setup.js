// servicehub-setup.html - once we have set up a Smart ServiceHub menu, the
// customer gets this link (?token=...&lang=...) from the builder. They type
// their table numbers and, next to each of their dishes, the dish's number in
// their own till. The servicehub-setup Edge Function checks the token, lists
// the dishes and takes the answers: missing tables are created right away,
// the till numbers land in the builder - nobody copies numbers by hand.
document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('tillApp');
  if (!root) return;

  var endpoint = 'https://qlzugnwsufbgznoawvic.supabase.co/functions/v1/servicehub-setup';
  var publishableKey = 'sb_publishable_m7GxKtc8I3F8ASzuMaJvZg_8CQuKToA';
  var token = new URLSearchParams(window.location.search).get('token') || '';

  function lang() {
    try { var l = localStorage.getItem('selectedLang'); return l === 'de' || l === 'it' ? l : 'en'; } catch (e) { return 'en'; }
  }
  function t(en, de, it) { var l = lang(); return l === 'de' ? de : l === 'it' ? it : en; }
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }
  function formatPrice(price, currency) {
    var number = parseFloat(String(price).replace(',', '.'));
    if (isNaN(number)) return escapeHtml(price);
    var symbol = currency || '€';
    return lang() === 'en' ? symbol + number.toFixed(2) : number.toFixed(2).replace('.', ',') + ' ' + symbol;
  }

  var loading = document.getElementById('tillLoading');
  var errorBox = document.getElementById('tillError');
  var form = document.getElementById('tillForm');
  var done = document.getElementById('tillDone');
  var submit = document.getElementById('tillSubmit');
  var tablesInput = document.getElementById('tablesInput');

  document.getElementById('tillTitle').innerHTML = t('Tables &amp; <span class="accent">till numbers</span>', 'Tische &amp; <span class="accent">Kassennummern</span>', 'Tavoli e <span class="accent">numeri di cassa</span>');
  document.getElementById('tillIntro').textContent = t(
    'Your menu is set up. Tell us your tables and, for each dish, its number in your till - then every order arrives on the cashier screen with the right number.',
    'Ihre Speisekarte ist eingerichtet. Tragen Sie hier Ihre Tische ein und bei jedem Gericht die Nummer aus Ihrer Kasse – dann erscheint jede Bestellung mit der richtigen Nummer auf dem Kassen-Bildschirm.',
    'Il vostro menu è pronto. Indicate qui i vostri tavoli e, per ogni piatto, il suo numero nella vostra cassa: così ogni ordine arriva sullo schermo della cassa con il numero giusto.'
  );
  loading.querySelector('p').textContent = t('Loading your menu …', 'Ihre Speisekarte wird geladen …', 'Caricamento del menu in corso …');
  errorBox.querySelector('p').textContent = t(
    'This link is invalid. Please contact us - we are happy to help.',
    'Dieser Link ist ungültig. Bitte schreiben Sie uns – wir helfen gern.',
    'Questo link non è valido. Scriveteci, vi aiutiamo volentieri.'
  );
  errorBox.querySelector('a').textContent = t('Contact us', 'Kontakt aufnehmen', 'Contattateci');
  document.getElementById('tablesLabel').textContent = '01 / ' + t('Your tables', 'Ihre Tische', 'I vostri tavoli');
  document.getElementById('tablesHint').textContent = t(
    'How are your tables numbered? Each table gets its own QR code for ordering. Ranges work too, e.g. "1-8".',
    'Wie sind Ihre Tische nummeriert? Jeder Tisch bekommt seinen eigenen QR-Code zum Bestellen. Bereiche gehen auch, z. B. „1–8“.',
    'Come sono numerati i vostri tavoli? Ogni tavolo riceve il proprio QR code per ordinare. Vanno bene anche intervalli, ad es. "1–8".'
  );
  tablesInput.placeholder = t('e.g. 1-8, 12, 14, Terrace 1', 'z. B. 1–8, 12, 14, Terrasse 1', 'es. 1–8, 12, 14, Terrazza 1');
  document.getElementById('dishesLabel').textContent = '02 / ' + t('Till numbers', 'Kassennummern', 'Numeri di cassa');
  document.getElementById('dishesHint').textContent = t(
    'Enter the number each dish has in your till. Leave the field empty if a dish has none.',
    'Tragen Sie bei jedem Gericht die Nummer ein, die es in Ihrer Kasse hat. Hat ein Gericht keine, lassen Sie das Feld einfach leer.',
    'Inserite per ogni piatto il numero che ha nella vostra cassa. Se un piatto non ne ha, lasciate vuoto il campo.'
  );
  document.getElementById('tillColumn').textContent = t('Till no.', 'Kassen-Nr.', 'N. cassa');
  submit.querySelector('span').textContent = t('Send', 'Absenden', 'Invia');
  done.querySelector('h2').textContent = t('Thank you!', 'Vielen Dank!', 'Grazie!');
  done.querySelector('p').textContent = t(
    'We have received your tables and till numbers and will set everything up for you. You can open this link again at any time to change something.',
    'Wir haben Ihre Tische und Kassennummern erhalten und richten alles für Sie ein. Sie können diesen Link jederzeit wieder öffnen, um etwas zu ändern.',
    'Abbiamo ricevuto i vostri tavoli e numeri di cassa e configuriamo tutto per voi. Potete riaprire questo link in qualsiasi momento per modificare qualcosa.'
  );

  function show(element) { [loading, errorBox, form, done].forEach(function (el) { el.hidden = el !== element; }); }

  function call(body) {
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: publishableKey },
      body: JSON.stringify(Object.assign({ token: token, lang: lang() }, body))
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok) throw new Error(data.error || 'failed');
        return data;
      });
    });
  }

  var dishes = [];

  function render(data) {
    document.getElementById('tillVenue').textContent = data.venue || '';
    var existing = data.tables || [];
    var existingLine = document.getElementById('tablesExisting');
    existingLine.hidden = !existing.length;
    existingLine.textContent = t('Already set up: ', 'Bereits eingerichtet: ', 'Già configurati: ') + existing.join(', ');
    // What they typed when ordering comes back filled in - until we have set
    // the tables up, then the "already set up" line says it instead.
    if (!existing.length && data.tablesText) tablesInput.value = data.tablesText;

    dishes = [];
    document.getElementById('tillList').innerHTML = (data.sections || []).map(function (section) {
      return '<p class="till-group">' + escapeHtml(section.name) + '</p>' + (section.items || []).map(function (item) {
        dishes.push(item);
        return '<label class="till-row"><span class="till-dish"><strong>' + escapeHtml(item.name) + '</strong>' +
          (item.description ? '<small>' + escapeHtml(item.description) + '</small>' : '') + '</span>' +
          '<span class="till-price">' + formatPrice(item.price, data.currency) + '</span>' +
          '<input class="till-input" data-id="' + escapeHtml(item.id) + '" maxlength="20" autocomplete="off" value="' + escapeHtml(item.posNumber || '') + '" aria-label="' + escapeHtml(t('Till number for ', 'Kassennummer für ', 'Numero di cassa per ') + item.name) + '"></label>';
      }).join('');
    }).join('');
    show(form);
  }

  if (!token) { show(errorBox); return; }
  call({ action: 'load' }).then(render).catch(function () { show(errorBox); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var numbers = {};
    var byNumber = {};
    form.querySelectorAll('.till-input').forEach(function (input) {
      var value = input.value.trim();
      numbers[input.getAttribute('data-id')] = value;
      if (value) (byNumber[value] = byNumber[value] || []).push(input.getAttribute('aria-label'));
    });
    var tables = tablesInput.value.trim();
    var anyNumber = Object.keys(byNumber).length > 0;
    if (!tables && !anyNumber) { alert(t('Please enter your tables or at least one till number.', 'Bitte tragen Sie Ihre Tische oder mindestens eine Kassennummer ein.', 'Inserite i vostri tavoli o almeno un numero di cassa.')); return; }
    // Two dishes with the same till number is almost always a typo.
    var twice = Object.keys(byNumber).filter(function (number) { return byNumber[number].length > 1; });
    if (twice.length) {
      var names = dishes.filter(function (item) { return numbers[item.id] === twice[0]; }).map(function (item) { return item.name; }).join(', ');
      if (!confirm(t('The number ' + twice[0] + ' is used for several dishes (' + names + '). Send anyway?', 'Die Nummer ' + twice[0] + ' steht bei mehreren Gerichten (' + names + '). Trotzdem absenden?', 'Il numero ' + twice[0] + ' è usato per più piatti (' + names + '). Inviare comunque?'))) return;
    }
    submit.disabled = true;
    submit.querySelector('span').textContent = t('Sending …', 'Wird gesendet …', 'Invio in corso …');
    call({ action: 'save', tables: tables, numbers: numbers }).then(function () {
      show(done);
      window.scrollTo(0, 0);
    }).catch(function () {
      alert(t('Something went wrong. Please try again.', 'Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal.', 'Purtroppo qualcosa non ha funzionato. Riprovate.'));
    }).then(function () {
      submit.disabled = false;
      submit.querySelector('span').textContent = t('Send', 'Absenden', 'Invia');
    });
  });
});
