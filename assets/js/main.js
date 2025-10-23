/* Bootstrap for all pages */
(function() {
  function onReady(fn){ if(document.readyState!=='loading'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }

  onReady(function() {
    if (window.ApexUI && typeof window.ApexUI.inject === 'function') { window.ApexUI.inject(); }
    if (window.ApexConsent && typeof window.ApexConsent.initConsent === 'function') { window.ApexConsent.initConsent(); }
    if (window.setupForms) { window.setupForms(); }
  });
})();
