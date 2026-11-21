// upgrade.html?token=<addon_token>&lang=: move a running Start / Pro plan to a
// bigger one (SmartPilot™ "Upgrade" button, renewal reminder email). The
// upgrade-plan function shows each higher plan with the pro-rated amount due
// now and charges the saved payment method - so the customer confirms first.
document.addEventListener('DOMContentLoaded', function () {
  var errorBox = document.getElementById('upgradeError');
  var loadingBox = document.getElementById('upgradeLoading');
  var layout = document.getElementById('upgradeLayout');
  var doneBox = document.getElementById('upgradeDone');
  var optionsEl = document.getElementById('upgradeOptions');
  if (!layout) return;

  var token = new URLSearchParams(window.location.search).get('token') || '';
  var endpoint = 'https://qlzugnwsufbgznoawvic.supabase.co/functions/v1/upgrade-plan';
  var PLAN_NAMES = { start: 'Smart Start', pro: 'Smart Pro', premium: 'Smart Premium', discovery: 'Smart Discovery' };
  var state = null;
  var errorReason = '';

  // Same language switch as addons.js / renewal-form.js.
  function lang() {
    var value = localStorage.getItem('selectedLang');
    return value === 'de' || value === 'it' ? value : 'en';
  }
  function t(en, de, it) {
    var value = lang();
    return value === 'de' ? de : value === 'it' ? it : en;
  }
  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }
  // "€129.00" in English, "129,00 €" in German and Italian (no-break space).
  function money(cents) {
    var amount = (cents / 100).toFixed(2);
    return lang() === 'en' ? '€' + amount : amount.replace('.', ',') + String.fromCharCode(160) + '€';
  }
  function day(iso) {
    if (!iso) return '';
    var parts = String(iso).slice(0, 10).split('-');
    return lang() === 'de' ? parts[2] + '.' + parts[1] + '.' + parts[0] : parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function show(box) {
    [errorBox, loadingBox, layout, doneBox].forEach(function (element) {
      element.style.display = element === box ? '' : 'none';
    });
  }

  function staticTexts() {
    document.getElementById('upgradeTitle').innerHTML = t('Upgrade your <span class="accent">plan</span>', 'Tarif <span class="accent">upgraden</span>', 'Passate a un <span class="accent">piano superiore</span>');
    document.getElementById('upgradeIntro').textContent = t(
      'Move to a bigger plan anytime – you only pay the difference for the rest of your current plan year.',
      'Wechseln Sie jederzeit in einen größeren Tarif – Sie zahlen nur die Differenz für den Rest Ihres laufenden Abo-Jahres.',
      'Passate in qualsiasi momento a un piano più grande: pagate solo la differenza per il resto del vostro anno di abbonamento in corso.'
    );
    document.getElementById('upgradeLoadingText').textContent = t('Loading your plan…', 'Ihr Tarif wird geladen…', 'Caricamento del vostro piano…');
    document.getElementById('upgradeContact').textContent = t('Contact us', 'Kontakt aufnehmen', 'Contattateci');
    document.getElementById('upgradeNote').textContent = t(
      "The amount is charged to your saved payment method right away. Your renewal date stays the same; from then on the new plan's yearly price applies.",
      'Der Betrag wird sofort von Ihrer hinterlegten Zahlungsmethode abgebucht. Ihr Verlängerungsdatum bleibt gleich, ab dann gilt der Jahrespreis des neuen Tarifs.',
      "L'importo viene addebitato subito sul vostro metodo di pagamento salvato. La data di rinnovo resta la stessa; da quel momento si applica il prezzo annuale del nuovo piano."
    );
    document.getElementById('upgradeErrorText').textContent = errorText(errorReason);
  }

  function errorText(reason) {
    if (reason === 'top') return t('You already have our biggest plan, Smart Premium.', 'Sie haben bereits unseren größten Tarif, Smart Premium.', 'Avete già il nostro piano più grande, Smart Premium.');
    if (reason === 'inactive') return t("Your plan isn't active right now. Please renew it first – or contact us.", 'Ihr Tarif ist gerade nicht aktiv. Bitte verlängern Sie ihn zuerst – oder schreiben Sie uns.', 'Il vostro piano non è attivo in questo momento. Rinnovatelo prima, oppure contattateci.');
    if (reason) return t("This plan can't be upgraded here – just write to us and we'll change it for you.", 'Dieser Tarif lässt sich hier nicht umstellen – schreiben Sie uns einfach, wir stellen ihn für Sie um.', 'Questo piano non si può aggiornare qui: scriveteci e lo cambiamo noi per voi.');
    return t('This link is invalid or has expired. Please contact us so we can help.', 'Dieser Link ist ungültig oder abgelaufen. Bitte schreiben Sie uns, wir helfen Ihnen gern.', 'Questo link non è valido o è scaduto. Contattateci, vi aiutiamo volentieri.');
  }

  function showError(reason) {
    errorReason = reason || '';
    document.getElementById('upgradeErrorText').textContent = errorText(errorReason);
    show(errorBox);
  }

  function render() {
    var until = day(state.periodEnd);
    document.getElementById('upgradeCurrent').innerHTML = escapeHtml(t('Your plan', 'Ihr Tarif', 'Il vostro piano')) + ': <strong>' + escapeHtml(PLAN_NAMES[state.plan] || state.plan) + '</strong>' +
      (until ? ' · ' + escapeHtml(t('renews on ', 'verlängert sich am ', 'si rinnova il ') + until) : '');
    optionsEl.innerHTML = state.options.map(function (option) {
      return '<div class="upgrade-option">' +
        '<div class="upgrade-option-head"><h3>' + escapeHtml(option.label) + '</h3><span class="upgrade-option-yearly">' + escapeHtml(money(option.yearlyCents) + t(' a year', ' im Jahr', " all'anno")) + '</span></div>' +
        '<ul class="upgrade-option-list">' +
          '<li>' + escapeHtml(t('Up to ' + option.items + ' menu items', 'Bis zu ' + option.items + ' Gerichte', 'Fino a ' + option.items + ' piatti')) + '</li>' +
          '<li>' + escapeHtml(t(option.updates + ' menu updates a month', option.updates + ' Änderungen der Speisekarte pro Monat', option.updates + ' aggiornamenti del menu al mese')) + '</li>' +
          '<li>' + escapeHtml(t(option.languages + ' extra languages', option.languages + ' zusätzliche Sprachen', option.languages + ' lingue aggiuntive')) + '</li>' +
        '</ul>' +
        '<p class="upgrade-option-due">' + escapeHtml(t('Due now', 'Jetzt zu zahlen', 'Da pagare ora')) + ': <strong>' + escapeHtml(money(option.dueNowCents)) + '</strong>' +
          (until ? ' <span>' + escapeHtml(t('(pro-rated until ', '(anteilig bis ', '(in proporzione fino al ') + until + ')') + '</span>' : '') + '</p>' +
        '<button type="button" class="btn upgrade-option-btn" data-plan="' + escapeHtml(option.plan) + '">' + escapeHtml(t('Upgrade to ' + option.label, 'Auf ' + option.label + ' upgraden', 'Passa a ' + option.label)) + '</button>' +
        '<p class="upgrade-option-error" data-error="' + escapeHtml(option.plan) + '"></p>' +
      '</div>';
    }).join('');
    optionsEl.querySelectorAll('[data-plan]').forEach(function (button) {
      button.addEventListener('click', function () { upgrade(button); });
    });
  }

  function load(after) {
    fetch(endpoint + '?token=' + encodeURIComponent(token))
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'Invalid link.'); return data; }); })
      .then(function (data) {
        state = data;
        if (data.blocked || !data.options || !data.options.length) {
          showError(data.blocked || 'top');
          return;
        }
        render();
        show(layout);
        if (after) after();
      })
      .catch(function () { showError(''); });
  }

  function upgrade(button) {
    var plan = button.dataset.plan;
    var option = state.options.filter(function (entry) { return entry.plan === plan; })[0];
    if (!option) return;
    var confirmed = window.confirm(t(
      'Upgrade to ' + option.label + '? Your saved payment method will be charged ' + money(option.dueNowCents) + ' now.',
      'Auf ' + option.label + ' upgraden? Von Ihrer hinterlegten Zahlungsmethode werden jetzt ' + money(option.dueNowCents) + ' abgebucht.',
      'Passare a ' + option.label + '? Sul vostro metodo di pagamento salvato verranno addebitati ora ' + money(option.dueNowCents) + '.'
    ));
    if (!confirmed) return;
    optionsEl.querySelectorAll('[data-plan]').forEach(function (entry) { entry.disabled = true; });
    button.textContent = t('Upgrading…', 'Wird umgestellt…', 'Aggiornamento in corso…');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, plan: plan, prorationDate: state.prorationDate })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            var error = new Error(data.error || 'Upgrade failed.');
            error.status = response.status;
            throw error;
          }
          return data;
        });
      })
      .then(function (data) {
        document.getElementById('upgradeDoneTitle').textContent = t('Done – you now have ', 'Erledigt – Sie haben jetzt ', 'Fatto: ora avete ') + data.label;
        document.getElementById('upgradeDoneText').textContent = t(
          money(data.amountChargedCents) + ' has been charged. The confirmation is on its way to your inbox, and your SmartPilot™ app shows the new plan.',
          money(data.amountChargedCents) + ' wurden abgebucht. Die Bestätigung ist per E-Mail unterwegs, und Ihre App SmartPilot™ zeigt den neuen Tarif.',
          'Sono stati addebitati ' + money(data.amountChargedCents) + '. La conferma è in arrivo via e-mail e la vostra app SmartPilot™ mostra il nuovo piano.'
        );
        show(doneBox);
      })
      .catch(function (error) {
        var message = error.status === 500 && /succeeded/.test(error.message)
          ? t('Your payment went through, but saving the new plan failed. Our team has been notified and will fix it shortly.', 'Ihre Zahlung ist eingegangen, aber der neue Tarif konnte nicht gespeichert werden. Unser Team ist informiert und kümmert sich gleich darum.', 'Il pagamento è andato a buon fine, ma non è stato possibile salvare il nuovo piano. Il nostro team è stato avvisato e risolverà a breve.')
          : t('The payment could not be completed, so your plan has not been changed. Please check your card or contact us.', 'Die Zahlung hat nicht geklappt, Ihr Tarif wurde deshalb nicht geändert. Bitte prüfen Sie Ihre Karte oder schreiben Sie uns.', 'Il pagamento non è andato a buon fine, quindi il vostro piano non è stato modificato. Controllate la vostra carta o contattateci.');
        // A fresh preview (new proration date), so a retry is a new attempt.
        load(function () {
          var errorEl = optionsEl.querySelector('[data-error="' + plan + '"]');
          if (errorEl) errorEl.textContent = message;
        });
      });
  }

  // The header's language buttons switch in place (script.js); refresh ours too.
  document.addEventListener('click', function (event) {
    if (!event.target.closest || !event.target.closest('[data-language], .lang-btn, .flag-btn')) return;
    setTimeout(function () {
      staticTexts();
      if (state && layout.style.display !== 'none') render();
    }, 0);
  });

  staticTexts();
  if (!token) {
    showError('');
    return;
  }
  load();
});
