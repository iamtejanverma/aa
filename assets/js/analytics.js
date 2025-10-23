/* Analytics + Chat loader gated by consent */
(function() {
  let analyticsLoaded = false;
  function getConfig() {
    const el = document.documentElement;
    return {
      gaId: el.dataset.gaId || 'G-XXXXXXXXXX',
      chatProvider: el.dataset.chatProvider || '',
      chatId: el.dataset.chatId || ''
    };
  }

  function loadScript(src, attrs = {}) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.async = true; Object.entries(attrs).forEach(([k,v]) => s.setAttribute(k, v));
      s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
  }

  async function enableAnalytics() {
    if (analyticsLoaded) return; analyticsLoaded = true;
    const { gaId } = getConfig(); if (!gaId || gaId === 'G-XXXXXXXXXX') return;
    await loadScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId, { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
  }

  let chatLoaded = false;
  async function enableChat() {
    if (chatLoaded) return; chatLoaded = true;
    const { chatProvider, chatId } = getConfig();
    if (!chatProvider || !chatId) return;
    if (chatProvider === 'tawk') {
      await loadScript(`https://embed.tawk.to/${chatId}`);
    } else if (chatProvider === 'crisp') {
      window.$crisp=[];window.CRISP_WEBSITE_ID=chatId; await loadScript('https://client.crisp.chat/l.js');
    }
  }

  window.enableAnalytics = enableAnalytics;
  window.enableChat = enableChat;
})();
