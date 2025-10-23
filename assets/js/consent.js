/* Cookie consent banner + preferences */
(function() {
  const STORAGE_KEY = 'apexAetherConsent';

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (_) { return {}; }
  }
  function saveConsent(prefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, updatedAt: new Date().toISOString() }));
  }
  function hasSetPreferences() {
    return Boolean(getConsent().hasSet);
  }

  function ensureInit() {
    const prefs = getConsent();
    if (prefs.analytics && typeof window.enableAnalytics === 'function') {
      window.enableAnalytics();
    }
    if (prefs.marketing && typeof window.enableChat === 'function') {
      window.enableChat();
    }
  }

  function renderBanner() {
    const banner = document.createElement('div');
    banner.className = 'banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
      <div class="banner__text">
        We use cookies to enhance your experience, analyze traffic, and provide personalized content. 
        <a href="/legal/cookies.html">Learn more</a>.
      </div>
      <div class="banner__actions">
        <button class="btn btn--ghost" id="consentCustomize">Customize</button>
        <button class="btn btn--ghost" id="consentReject">Reject all</button>
        <button class="btn" id="consentAccept">Accept all</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('consentAccept').addEventListener('click', () => {
      saveConsent({ analytics: true, marketing: true, hasSet: true });
      banner.remove(); ensureInit();
    });
    document.getElementById('consentReject').addEventListener('click', () => {
      saveConsent({ analytics: false, marketing: false, hasSet: true });
      banner.remove();
    });
    document.getElementById('consentCustomize').addEventListener('click', () => openModal());
  }

  function openModal() {
    const prefs = getConsent();
    const modal = document.createElement('div');
    Object.assign(modal.style, { position: 'fixed', inset: '0', background: 'rgba(0,0,0,.6)', zIndex: 70, display: 'grid', placeItems: 'center', padding: '20px' });
    modal.innerHTML = `
      <div style="width:min(680px, 100%); background:#0f172a; border:1px solid #1f2937; border-radius: 14px; padding: 18px;">
        <h2>Cookie preferences</h2>
        <p class="help">Manage how we use cookies on this site.</p>
        <div class="hr"></div>
        <div style="display:grid; gap:10px;">
          <label style="display:flex; justify-content:space-between; align-items:center; gap:12px">
            <div>
              <div class="label">Analytics</div>
              <div class="help">Help us understand traffic and usage.</div>
            </div>
            <input id="pref-analytics" type="checkbox" ${prefs.analytics ? 'checked' : ''} />
          </label>
          <label style="display:flex; justify-content:space-between; align-items:center; gap:12px">
            <div>
              <div class="label">Marketing</div>
              <div class="help">Enable chat and third‑party widgets.</div>
            </div>
            <input id="pref-marketing" type="checkbox" ${prefs.marketing ? 'checked' : ''} />
          </label>
        </div>
        <div class="hr"></div>
        <div style="display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn btn--ghost" id="prefsCancel">Cancel</button>
          <button class="btn" id="prefsSave">Save preferences</button>
        </div>
      </div>
    `;
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);

    document.getElementById('prefsCancel').addEventListener('click', () => modal.remove());
    document.getElementById('prefsSave').addEventListener('click', () => {
      const analytics = document.getElementById('pref-analytics').checked;
      const marketing = document.getElementById('pref-marketing').checked;
      saveConsent({ analytics, marketing, hasSet: true });
      modal.remove(); ensureInit();
    });
  }

  function initConsent() {
    ensureInit();
    const btn = document.getElementById('cookiePrefsBtn');
    if (btn) btn.addEventListener('click', openModal);
    if (!hasSetPreferences()) {
      renderBanner();
    }
  }

  window.ApexConsent = { initConsent, getConsent };
})();
