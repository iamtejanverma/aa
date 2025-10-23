/* Forms: newsletter, contact, quote handling */
(function() {
  function serialize(form) {
    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = typeof v === 'string' ? v.trim() : v; });
    return data;
  }
  function validateEmail(email) { return /.+@.+\..+/.test(email); }

  async function postJSON(url, payload) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Network error');
    return res.json().catch(() => ({}));
  }

  function sendAnalytics(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  function handleNewsletter(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (form.querySelector('input[name="email"]')?.value || '').trim();
      const status = document.getElementById('newsletter-status');
      if (!validateEmail(email)) { status && (status.textContent = 'Please enter a valid email.'); return; }
      const endpoint = document.documentElement.dataset.formEndpoint || '';
      try {
        if (endpoint) {
          await postJSON(endpoint, { type: 'newsletter', email });
        } else {
          const list = JSON.parse(localStorage.getItem('newsletterSubs') || '[]');
          list.push({ email, ts: Date.now() });
          localStorage.setItem('newsletterSubs', JSON.stringify(list));
        }
        status && (status.textContent = 'Thanks for subscribing!');
        sendAnalytics('newsletter_subscribed', { method: endpoint ? 'api' : 'local' });
        form.reset();
      } catch (_) {
        status && (status.textContent = 'Something went wrong. Please try again.');
      }
    });
  }

  function handleContact(form) {
    const status = form.querySelector('[data-status]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = serialize(form);
      if (!validateEmail(data.email || '')) { status && (status.textContent = 'Enter a valid email.'); return; }
      const endpoint = form.dataset.endpoint || document.documentElement.dataset.formEndpoint || '';
      try {
        if (endpoint) {
          await postJSON(endpoint, { type: 'contact', data });
        } else {
          const list = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
          list.push({ data, ts: Date.now() });
          localStorage.setItem('contactSubmissions', JSON.stringify(list));
        }
        status && (status.textContent = 'Thanks! We will get back within 1 business day.');
        sendAnalytics('contact_submitted', { source: form.id || 'contact' });
        form.reset();
      } catch (_) {
        status && (status.textContent = 'Submission failed. Please email us at hello@apexaether.com');
      }
    });
  }

  function maybeLoadEmbeds() {
    const consent = (window.ApexConsent && window.ApexConsent.getConsent && window.ApexConsent.getConsent()) || {};
    if (!consent.marketing) return;
    document.querySelectorAll('[data-embed-src]')?.forEach((el) => {
      const src = el.getAttribute('data-embed-src');
      if (!src) return;
      const iframe = document.createElement('iframe');
      iframe.src = src; iframe.loading = 'lazy'; iframe.style.width = '100%'; iframe.style.minHeight = '720px'; iframe.style.border = '0';
      el.appendChild(iframe);
    });
  }

  function setupForms() {
    document.querySelectorAll('form[data-form-type="newsletter"]').forEach(handleNewsletter);
    document.querySelectorAll('form[data-form-type="contact"]').forEach(handleContact);
    maybeLoadEmbeds();
  }

  window.setupForms = setupForms;
})();
