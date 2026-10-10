// Smart Discovery order form (discovery.html + de/discovery.html +
// it/discovery.html): contact details only - plan and price are fixed
// server-side in create-checkout-session (plan "discovery", €2.99 one-off).
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('discoveryForm');
  if (!form) return;

  var supabaseUrl = 'https://qlzugnwsufbgznoawvic.supabase.co';
  var supabasePublishableKey = 'sb_publishable_m7GxKtc8I3F8ASzuMaJvZg_8CQuKToA';
  var checkoutEndpoint = supabaseUrl + '/functions/v1/create-checkout-session';
  var payButton = document.getElementById('payButton');
  var pageLang = document.documentElement.lang;
  var isDe = pageLang === 'de';
  var isIt = pageLang === 'it';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var original = payButton.innerHTML;
    payButton.disabled = true;
    payButton.textContent = isDe ? 'Sichere Bezahlung wird geöffnet…' : isIt ? 'Apertura del pagamento sicuro…' : 'Opening secure checkout…';

    fetch(checkoutEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabasePublishableKey },
      body: JSON.stringify({
        plan: 'discovery',
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        companyName: document.getElementById('companyName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        // Decides the language of every email for this pass (de/en/it).
        lang: isDe ? 'de' : isIt ? 'it' : 'en'
      })
    })
      .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.error || 'Checkout could not be started.'); return data; }); })
      .then(function (data) { window.location.assign(data.url); })
      .catch(function (error) {
        alert(error.message);
        payButton.disabled = false;
        payButton.innerHTML = original;
      });
  });
});
