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
      container.innerHTML = '<p class="stats-bars-empty">' + t('No visits recorded yet this week.', 'Diese Woche noch keine Aufrufe erfasst.') + '</p>';
      return;
    }
    var segments = items.map(function (item, index) {
      return { label: item.label, count: item.count, color: RING_COLORS[index] || RING_COLORS[RING_COLORS.length - 1] };
    });
    var total = segments.reduce(function (sum, seg) { return sum + seg.count; }, 0);
    container.innerHTML = '<div class="donut-row"><div class="ring-wrap">' + ringSvg(total, unitLabel, segments) + '</div><div class="ring-legend">' + legendHtml(segments) + '</div></div>';
  }

  var COURSE_LABELS = {
    starter: t('Starters', 'Vorspeisen'),
    main: t('Main courses', 'Hauptgerichte'),
    dessert: t('Desserts', 'Desserts'),
    drink: t('Drinks', 'Getränke')
  };

  function sfmLegendHtml(items) {
    return items.map(function (item, index) {
      var color = RING_COLORS[index] || RING_COLORS[RING_COLORS.length - 1];
      var courseLabel = COURSE_LABELS[item.course] || item.course;
      return '<span class="sfm-row"><i style="background:' + color + '"></i><span class="sfm-course">' + escapeHtml(courseLabel) + '</span><span class="sfm-dish">' + escapeHtml(item.dish) + '</span><b>' + item.count + '</b></span>';
    }).join('');
  }

  function renderSfmCard(container, items, totalCompletions) {
    if (!items || !items.length) {
      container.innerHTML = '<p class="stats-bars-empty">' + t('No recommendations given out yet this week.', 'Diese Woche noch keine Empfehlungen ausgegeben.') + '</p>';
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
    container.innerHTML = '<div class="donut-row"><div class="ring-wrap">' + ringSvg(totalCompletions, t('quizzes', 'Durchläufe'), segments) + '</div><div class="sfm-legend">' + sfmLegendHtml(items) + '</div></div>';
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

      var current = data.totalVisits || 0;
      var previous = data.previousWeekVisits || 0;
      var visitSegments = [
        { label: t('This week', 'Diese Woche'), count: current, color: '#f66a09' },
        { label: t('Last week', 'Letzte Woche'), count: previous, color: '#f0e4d6' }
      ];
      document.getElementById('statsVisitsRing').innerHTML = ringSvg(current, t('visits', 'Besuche'), visitSegments);
      document.getElementById('statsVisitsLegend').innerHTML = legendHtml(visitSegments);

      var trendEl = document.getElementById('statsTrend');
      var trendText = renderTrend(current, previous);
      trendEl.textContent = trendText;
      trendEl.classList.toggle('down', trendText.indexOf('▼') === 0);
      trendEl.style.display = trendText ? '' : 'none';

      renderDonutCard(document.getElementById('statsCategoryDonut'), data.topCategories, t('views', 'Aufrufe'));
      renderDonutCard(document.getElementById('statsDishDonut'), data.topDishes, t('views', 'Aufrufe'));

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
});
