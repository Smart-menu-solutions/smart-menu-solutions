document.addEventListener('DOMContentLoaded', function () {
  var errorBox = document.getElementById('addonsError');
  var lockedBox = document.getElementById('addonsLocked');
  var loadingBox = document.getElementById('addonsLoading');
  var layout = document.getElementById('addonsLayout');
  var list = document.getElementById('addonsList');
  if (!layout) return;

  var token = new URLSearchParams(window.location.search).get('token');
  if (!token) {
    loadingBox.style.display = 'none';
    errorBox.style.display = '';
    return;
  }

  var supabaseUrl = 'https://qlzugnwsufbgznoawvic.supabase.co';
  var addonsEndpoint = supabaseUrl + '/functions/v1/manage-addons';

  // Same rationale as order-form.js/renewal-form.js/stats.js: the handful
  // of messages this page shows via plain text follow the page's
  // localStorage language switch instead of always being English.
  function t(en, de) {
    return localStorage.getItem('selectedLang') === 'de' ? de : en;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function renderAddons(addons) {
    list.innerHTML = addons.map(function (addon) {
      if (addon.active) {
        return '<div class="addon-row"><span class="addon-name">' + escapeHtml(addon.label) + '</span><span class="addon-active-badge">' + t('Active', 'Aktiv') + '</span></div>';
      }
      var prorateHint = addon.billing === 'recurring'
        ? '<span class="addon-prorate-hint">' + t('adjusted to your pro-rated amount at checkout', 'wird beim Bezahlen auf den anteiligen Betrag angepasst') + '</span>'
        : '';
      return '<div class="addon-row">' +
        '<span class="addon-name">' + escapeHtml(addon.label) + '<span class="addon-price">' + escapeHtml(addon.priceLabel) + '</span>' + prorateHint + '</span>' +
        '<button type="button" class="button-add-addon" data-addon="' + escapeHtml(addon.key) + '">' + t('Add', 'Hinzufügen') + '</button>' +
        '<span class="addon-error" data-addon-error="' + escapeHtml(addon.key) + '"></span>' +
        '</div>';
    }).join('');

    list.querySelectorAll('[data-addon]').forEach(function (button) {
      button.addEventListener('click', function () { addAddon(button); });
    });
  }

  function addAddon(button) {
    var addonKey = button.dataset.addon;
    var errorEl = list.querySelector('[data-addon-error="' + addonKey + '"]');
    if (errorEl) errorEl.textContent = '';
    button.disabled = true;
    button.textContent = t('Adding…', 'Wird hinzugefügt…');

    fetch(addonsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, addon: addonKey })
    })
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || t('Could not add this add-on.', 'Konnte nicht hinzugefügt werden.')); return data; }); })
      .then(function () {
        loadAddons();
      })
      .catch(function (error) {
        button.disabled = false;
        button.textContent = t('Add', 'Hinzufügen');
        if (errorEl) errorEl.textContent = error.message;
      });
  }

  function loadAddons() {
    fetch(addonsEndpoint + '?token=' + encodeURIComponent(token))
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'This link is not valid.'); return data; }); })
      .then(function (data) {
        loadingBox.style.display = 'none';
        errorBox.style.display = 'none';
        lockedBox.style.display = 'none';
        layout.style.display = 'none';
        if (data.status !== 'active') {
          lockedBox.style.display = '';
          return;
        }
        renderAddons(data.addons || []);
        layout.style.display = '';
      })
      .catch(function () {
        loadingBox.style.display = 'none';
        errorBox.style.display = '';
      });
  }

  loadAddons();
});
