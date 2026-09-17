document.addEventListener('DOMContentLoaded', function () {
  var errorBox = document.getElementById('statsError');
  var pausedBox = document.getElementById('statsPaused');
  var loadingBox = document.getElementById('statsLoading');
  var layout = document.getElementById('statsLayout');
  if (!layout) return;

  var token = new URLSearchParams(window.location.search).get('token');
  if (!token) {
    loadingBox.style.display = 'none';
    errorBox.style.display = '';
    return;
  }

  var supabaseUrl = 'https://qlzugnwsufbgznoawvic.supabase.co';
  var statsEndpoint = supabaseUrl + '/functions/v1/get-stats';

  // Same rationale as order-form.js/renewal-form.js: the handful of
  // messages this page shows via plain text follow the page's localStorage
  // language switch instead of always being English.
  function t(en, de) {
    return localStorage.getItem('selectedLang') === 'de' ? de : en;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function renderBars(container, items) {
    if (!items || !items.length) {
      container.innerHTML = '<p class="stats-bars-empty">' + t('No visits recorded yet this week.', 'Diese Woche noch keine Aufrufe erfasst.') + '</p>';
      return;
    }
    var max = items[0].count || 1;
    container.innerHTML = items.map(function (item) {
      var pct = Math.max(4, Math.round((item.count / max) * 100));
      return '<div class="stats-bar-row"><div class="stats-bar-head"><span>' + escapeHtml(item.label) + '</span><strong>' + item.count + '</strong></div>' +
        '<div class="stats-bar-track"><div class="stats-bar-fill" style="width:' + pct + '%"></div></div></div>';
    }).join('');
  }

  function renderTrend(current, previous) {
    if (!previous) return current > 0 ? t('New this week', 'Neu diese Woche') : '';
    var change = Math.round(((current - previous) / previous) * 100);
    if (change > 0) return '▲ ' + change + '% ' + t('more than last week', 'mehr als letzte Woche');
    if (change < 0) return '▼ ' + Math.abs(change) + '% ' + t('less than last week', 'weniger als letzte Woche');
    return t('Same as last week', 'Gleich wie letzte Woche');
  }

  fetch(statsEndpoint + '?token=' + encodeURIComponent(token))
    .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'This link is not valid.'); return data; }); })
    .then(function (data) {
      loadingBox.style.display = 'none';
      if (!data.addonActive) {
        pausedBox.style.display = '';
        return;
      }
      document.getElementById('statsMenuName').textContent = data.menuName || t('Your menu', 'Deine Speisekarte');
      document.getElementById('statsRange').textContent = data.rangeStart + ' – ' + data.rangeEnd;
      document.getElementById('statsTotalVisits').textContent = data.totalVisits || 0;
      document.getElementById('statsTrend').textContent = renderTrend(data.totalVisits || 0, data.previousWeekVisits || 0);
      renderBars(document.getElementById('statsCategoryBars'), data.topCategories);
      renderBars(document.getElementById('statsDishBars'), data.topDishes);
      layout.style.display = '';
    })
    .catch(function () {
      loadingBox.style.display = 'none';
      errorBox.style.display = '';
    });
});
