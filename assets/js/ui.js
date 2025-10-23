/* UI: Header/Footer injection and helpers */
(function() {
  function currentPath() { return (location.pathname || '/').replace(/\/index\.html$/, '/'); }
  function isActive(href) {
    const here = currentPath();
    try {
      const url = new URL(href, location.origin);
      const path = url.pathname.replace(/\/index\.html$/, '/');
      return here === path || (here.startsWith('/services') && path.startsWith('/services'));
    } catch (_) { return false; }
  }

  function navLink(href, label) {
    const active = isActive(href) ? ' nav__link--active' : '';
    return `<a class=\"nav__link${active}\" href=\"${href}\">${label}</a>`;
  }

  function renderHeader() {
    return `
<header class=\"header\">
  <div class=\"container nav\" role=\"navigation\" aria-label=\"Main\">
    <a class=\"brand\" href=\"/index.html\" aria-label=\"Apex Aether home\">
      <img src=\"/logo.png\" alt=\"Apex Aether logo\" />
      <span>Apex Aether</span>
    </a>
    <button class=\"nav__toggle\" id=\"navToggle\" type=\"button\" aria-label=\"Menu\" aria-expanded=\"false\" aria-controls=\"primaryNav\"><span aria-hidden=\"true\">☰</span></button>
    <nav id=\"primaryNav\" class=\"nav__links\" aria-label=\"Primary\">
      ${navLink('/services/index.html', 'Services')}
      ${navLink('/about.html', 'About')}
      ${navLink('/blog/index.html', 'Blog')}
      ${navLink('/contact.html', 'Contact')}
      <a class=\"btn\" href=\"/contact.html#consultation\">Free Consultation</a>
    </nav>
  </div>
</header>`;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return `
<footer class=\"footer\" role=\"contentinfo\">
  <div class=\"container cols\">
    <div>
      <a class=\"brand\" href=\"/index.html\">
        <img src=\"/logo.png\" alt=\"Apex Aether logo\" />
        <span>Apex Aether</span>
      </a>
      <p style=\"max-width:560px\">AI solutions, web development, and consulting to accelerate your digital transformation.</p>
      <form id=\"newsletter-form\" class=\"form\" data-form-type=\"newsletter\" aria-label=\"Newsletter signup\">
        <label class=\"label\" for=\"newsletter-email\">Subscribe to our insights</label>
        <div style=\"display:flex; gap:8px; flex-wrap:wrap\">
          <input id=\"newsletter-email\" name=\"email\" type=\"email\" required class=\"input\" placeholder=\"you@company.com\" aria-describedby=\"newsletter-help\" />
          <button class=\"btn\" type=\"submit\">Subscribe</button>
        </div>
        <span id=\"newsletter-help\" class=\"help\">Monthly. No spam. Unsubscribe anytime.</span>
        <div class=\"help\" id=\"newsletter-status\" role=\"status\" aria-live=\"polite\"></div>
      </form>
    </div>
    <div>
      <h3>Company</h3>
      <div><a href=\"/about.html\">About</a></div>
      <div><a href=\"/blog/index.html\">Blog</a></div>
      <div><a href=\"/contact.html\">Contact</a></div>
    </div>
    <div>
      <h3>Services</h3>
      <div><a href=\"/services/ai.html\">AI Solutions</a></div>
      <div><a href=\"/services/web.html\">Web Development</a></div>
      <div><a href=\"/services/consulting.html\">Consulting</a></div>
    </div>
    <div>
      <h3>Legal</h3>
      <div><a href=\"/legal/privacy.html\">Privacy Policy</a></div>
      <div><a href=\"/legal/cookies.html\">Cookie Policy</a></div>
      <div><a href=\"/legal/terms.html\">Terms of Service</a></div>
    </div>
  </div>
  <div class=\"container\" style=\"border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:14px 0; gap:12px; flex-wrap:wrap\">
    <small>© ${year} Apex Aether. All rights reserved.</small>
    <div style=\"display:flex; gap:10px\">
      <a class=\"badge\" href=\"/sitemap.xml\">Sitemap</a>
      <a class=\"badge\" href=\"/robots.txt\">Robots</a>
      <button class=\"btn btn--ghost\" id=\"cookiePrefsBtn\" type=\"button\">Cookie preferences</button>
    </div>
  </div>
</footer>`;
  }

  function inject() {
    const body = document.body;
    const headerHtml = renderHeader();
    const footerHtml = renderFooter();
    // Skip link for a11y
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main';
    skip.textContent = 'Skip to content';
    body.prepend(document.createRange().createContextualFragment(headerHtml));
    body.prepend(skip);
    body.appendChild(document.createRange().createContextualFragment(footerHtml));

    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('primaryNav');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('nav__links--open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
  }

  window.ApexUI = { inject };
})();
