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
  function t(en, de, it) {
    var lang = localStorage.getItem('selectedLang');
    if (lang === 'de') return de;
    if (lang === 'it' && it) return it;
    return en;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  // One accent-to-tint ramp, reused for every ring so a segment's rank
  // (1st, 2nd, ...) always reads the same color across cards.
  var RING_COLORS = ['#f66a09', '#f7903d', '#f7ac70', '#f8c79f', '#f0e4d6'];
  var RING_CIRCUMFERENCE = 326.7; // 2 * PI * 52 (matches the r=52 circle below)

  // Pure SVG donut - no charting library. Segments are drawn as concentric
  // stroke-dasharray arcs on the same circle, rotated -90deg so the first
  // segment starts at 12 o'clock, matching how a plain read-then-render
  // pie/donut is usually hand-built.
  function ringSvg(centerValue, centerLabel, segments) {
    var total = segments.reduce(function (sum, seg) { return sum + seg.count; }, 0);
    var offset = 0;
    var circles = total > 0
      ? segments.map(function (seg) {
        var len = RING_CIRCUMFERENCE * (seg.count / total);
        var circle = '<circle cx="60" cy="60" r="52" stroke="' + seg.color + '" stroke-width="14" fill="none" stroke-dasharray="' + len.toFixed(1) + ' ' + RING_CIRCUMFERENCE + '" stroke-dashoffset="-' + offset.toFixed(1) + '"></circle>';
        offset += len;
        return circle;
      }).join('')
      : '<circle cx="60" cy="60" r="52" stroke="#f0e4d6" stroke-width="14" fill="none"></circle>';
    return '<svg viewBox="0 0 120 120" class="ring" role="img" aria-label="' + escapeHtml(centerValue + ' ' + centerLabel) + '">' +
      '<g transform="rotate(-90 60 60)">' + circles + '</g>' +
      '<text x="60" y="56" text-anchor="middle" class="ring-num">' + escapeHtml(centerValue) + '</text>' +
      '<text x="60" y="72" text-anchor="middle" class="ring-sub">' + escapeHtml(centerLabel) + '</text></svg>';
  }

  function legendHtml(segments) {
    return segments.map(function (seg) {
      return '<span><i style="background:' + seg.color + '"></i>' + escapeHtml(seg.label) + '<b>' + seg.count + '</b></span>';
    }).join('');
  }

  function renderDonutCard(container, items, unitLabel) {
    if (!items || !items.length) {
      container.innerHTML = '<p class="stats-bars-empty">' + t('No visits recorded yet this week.', 'Diese Woche noch keine Aufrufe erfasst.', 'Nessuna visita registrata questa settimana.') + '</p>';
      return;
    }
    var segments = items.map(function (item, index) {
      return { label: item.label, count: item.count, color: RING_COLORS[index] || RING_COLORS[RING_COLORS.length - 1] };
    });
    var total = segments.reduce(function (sum, seg) { return sum + seg.count; }, 0);
    container.innerHTML = '<div class="donut-row"><div class="ring-wrap">' + ringSvg(total, unitLabel, segments) + '</div><div class="ring-legend">' + legendHtml(segments) + '</div></div>';
  }

  // Evaluated at render time (not cached) so it always reflects whichever
  // language was just switched to - the page never reloads on a language
  // change, only re-fetches and re-renders.
  function courseLabels() {
    return {
      starter: t('Starters', 'Vorspeisen', 'Antipasti'),
      main: t('Main courses', 'Hauptgerichte', 'Piatti principali'),
      dessert: t('Desserts', 'Desserts', 'Dolci'),
      drink: t('Drinks', 'Getränke', 'Bevande')
    };
  }

  function sfmLegendHtml(items) {
    var labels = courseLabels();
    return items.map(function (item, index) {
      var color = RING_COLORS[index] || RING_COLORS[RING_COLORS.length - 1];
      var courseLabel = labels[item.course] || item.course;
      return '<span class="sfm-row"><i style="background:' + color + '"></i><span class="sfm-course">' + escapeHtml(courseLabel) + '</span><span class="sfm-dish">' + escapeHtml(item.dish) + '</span><b>' + item.count + '</b></span>';
    }).join('');
  }

  function renderSfmCard(container, items, totalCompletions) {
    if (!items || !items.length) {
      container.innerHTML = '<p class="stats-bars-empty">' + t('No recommendations given out yet this week.', 'Diese Woche noch keine Empfehlungen ausgegeben.', 'Nessun consiglio dato questa settimana.') + '</p>';
      return;
    }
    // The ring's segments are still sized by each course's top-dish count
    // (so the split reads correctly), but the center number is the real
    // total quiz completions, not the sum of those three (possibly
    // smaller) top counts - see topRecommendations()'s comment in
    // get-stats for why those can differ once a course has more than one
    // distinct dish recommended.
    var segments = items.map(function (item, index) {
      return { count: item.count, color: RING_COLORS[index] || RING_COLORS[RING_COLORS.length - 1] };
    });
    container.innerHTML = '<div class="donut-row"><div class="ring-wrap">' + ringSvg(totalCompletions, t('quizzes', 'Durchläufe', 'quiz'), segments) + '</div><div class="sfm-legend">' + sfmLegendHtml(items) + '</div></div>';
  }

  function renderTrend(current, previous) {
    if (!previous) return current > 0 ? t('New this week', 'Neu diese Woche', 'Nuovo questa settimana') : '';
    var change = Math.round(((current - previous) / previous) * 100);
    if (change > 0) return '▲ ' + change + '% ' + t('more than last week', 'mehr als letzte Woche', 'in più rispetto alla settimana scorsa');
    if (change < 0) return '▼ ' + Math.abs(change) + '% ' + t('less than last week', 'weniger als letzte Woche', 'in meno rispetto alla settimana scorsa');
    return t('Same as last week', 'Gleich wie letzte Woche', 'Come la settimana scorsa');
  }

  var langSwitcher = document.getElementById('statsLangSwitcher');

  function setActiveLangButton(lang) {
    if (!langSwitcher) return;
    langSwitcher.querySelectorAll('.flag-btn').forEach(function (button) {
      button.classList.toggle('active', button.dataset.lang === lang);
    });
  }

  function loadStats(lang) {
    fetch(statsEndpoint + '?token=' + encodeURIComponent(token) + '&lang=' + encodeURIComponent(lang))
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'This link is not valid.'); return data; }); })
      .then(function (data) {
        loadingBox.style.display = 'none';
        if (!data.addonActive) {
          pausedBox.style.display = '';
          return;
        }
        document.getElementById('statsMenuName').textContent = data.menuName || t('Your menu', 'Deine Speisekarte', 'Il vostro menu');
        document.getElementById('statsRange').textContent = data.rangeStart + ' – ' + data.rangeEnd;

        var current = data.totalVisits || 0;
        var previous = data.previousWeekVisits || 0;
        var visitSegments = [
          { label: t('This week', 'Diese Woche', 'Questa settimana'), count: current, color: '#f66a09' },
          { label: t('Last week', 'Letzte Woche', 'Settimana scorsa'), count: previous, color: '#f0e4d6' }
        ];
        document.getElementById('statsVisitsRing').innerHTML = ringSvg(current, t('visits', 'Besuche', 'visite'), visitSegments);
        document.getElementById('statsVisitsLegend').innerHTML = legendHtml(visitSegments);

        var trendEl = document.getElementById('statsTrend');
        var trendText = renderTrend(current, previous);
        trendEl.textContent = trendText;
        trendEl.classList.toggle('down', trendText.indexOf('▼') === 0);
        trendEl.style.display = trendText ? '' : 'none';

        renderDonutCard(document.getElementById('statsCategoryDonut'), data.topCategories, t('views', 'Aufrufe', 'visualizzazioni'));
        renderDonutCard(document.getElementById('statsDishDonut'), data.topDishes, t('views', 'Aufrufe', 'visualizzazioni'));

        var sfmCard = document.getElementById('statsSfmCard');
        if (data.sfmEnabled) {
          sfmCard.style.display = '';
          renderSfmCard(document.getElementById('statsSfmDonut'), data.topRecommendations, data.sfmTotalCompletions || 0);
        } else {
          sfmCard.style.display = 'none';
        }

        layout.style.display = '';
      })
      .catch(function () {
        loadingBox.style.display = 'none';
        errorBox.style.display = '';
      });
  }

  function switchStatsLanguage(lang) {
    try { localStorage.setItem('selectedLang', lang); } catch (e) {}
    setActiveLangButton(lang);
    // switchLanguage() (script.js) re-translates every static data-i18n
    // element on the page (hero title, card headings, etc.) - the dynamic
    // parts below are rebuilt separately via loadStats().
    if (typeof window.switchLanguage === 'function') window.switchLanguage(lang);
    loadStats(lang);
  }

  if (langSwitcher) {
    langSwitcher.querySelectorAll('.flag-btn').forEach(function (button) {
      button.addEventListener('click', function () { switchStatsLanguage(button.dataset.lang); });
    });
  }

  // get-stats translates dish and category names into de/en/it when the menu
  // has that translation, otherwise it shows the menu's own names.
  var storedLang = localStorage.getItem('selectedLang');
  var initialLang = storedLang === 'de' || storedLang === 'it' ? storedLang : 'en';
  setActiveLangButton(initialLang);
  loadStats(initialLang);
});
