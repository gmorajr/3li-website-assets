
(function () {
  'use strict';

  // ==========================================
  // 3LI WEBSITE — MAIN JAVASCRIPT
  // ==========================================

  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');

  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  // Validate external URLs
  const safeUrl = (s) => {
    try {
      const u = new URL(s, location.href);
      return ['http:', 'https:'].includes(u.protocol) ? u.href : '';
    } catch {
      return '';
    }
  };

  // Create HTML elements
  function el(tag, cls, text) {
    const n = document.createElement(tag);

    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;

    return n;
  }

  // ==========================================
  // PRODUCT LISTINGS AND CATEGORY FILTERS
  // ==========================================

  function render(filter = 'All') {
    if (!grid || !empty) return;

    grid.replaceChildren();

    const items = (window.ELI_PRODUCTS || []).filter(
      p => filter === 'All' || p.category === filter
    );

    empty.hidden = items.length !== 0;

    items.forEach(p => {
      const card = el('article', 'product-card');
      const visual = el('div', 'product-visual');

      if (p.image) {
        const img = el('img', 'product-photo');
        img.src = p.image;
        img.alt = p.name;
        img.loading = 'lazy';
        visual.append(img);
      } else {
        const emoji = el('span', 'product-emoji', p.emoji || '✳');
        emoji.setAttribute('aria-hidden', 'true');
        visual.append(emoji);
      }

      visual.append(
        el('span', 'product-badge', p.badge || 'NEW FIND')
      );

      const body = el('div', 'product-body');

      body.append(
        el('span', 'product-category', p.category || 'Finds'),
        el('h3', 'product-title', p.name),
        el(
          'p',
          'product-condition',
          p.condition || 'Condition details coming soon'
        )
      );

      const row = el('div', 'product-price-row');

      row.append(
        el(
          'strong',
          'product-price',
          fmt.format(Number(p.price) || 0)
        )
      );

      if (
        p.compareAt &&
        Number(p.compareAt) > Number(p.price)
      ) {
        row.append(
          el(
            'del',
            'product-compare',
            fmt.format(Number(p.compareAt))
          )
        );
      }

      body.append(row);

      const link = safeUrl(p.url || '');

      if (link) {
        const a = el(
          'a',
          'product-cta',
          'VIEW LISTING ↗'
        );

        a.href = link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        body.append(a);
      } else {
        const b = el(
          'span',
          'product-cta disabled',
          'COMING SOON'
        );

        body.append(b);
      }

      card.append(visual, body);
      grid.append(card);
    });

    // Update active category button
    document.querySelectorAll('.filter').forEach(b => {
      const selected = b.dataset.filter === filter;

      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
  }

  // Initial product rendering
  render();

  // Product category filtering
  document.querySelectorAll('[data-filter]').forEach(b => {
    b.addEventListener('click', () => {
      render(b.dataset.filter);
    });
  });

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const toggle = document.querySelector('.menu-toggle');
  const mobile = document.getElementById('mobile-nav');

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const isOpen =
        toggle.getAttribute('aria-expanded') === 'true';

      toggle.setAttribute(
        'aria-expanded',
        String(!isOpen)
      );

      mobile.hidden = isOpen;
    });

    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobile.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // SHOP YOUR WAY — MARKETPLACE LINKS
  // ==========================================

  // Use the actual URLs entered in Webflow.
  // Do not override them with ELI_SOCIAL.

  document.querySelectorAll('[data-platform]').forEach(a => {
    const url = safeUrl(a.getAttribute('href') || '');

    if (url) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      a.classList.remove('platform-placeholder');
      a.removeAttribute('title');
    } else {
      a.classList.add('platform-placeholder');
    }
  });

  // ==========================================
  // EMAIL SUBSCRIPTION — PREVIEW MODE
  // ==========================================

  const form = document.getElementById('subscribe-form');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const field = document.getElementById('email');
      const message = document.getElementById('form-message');

      if (!field || !message) return;

      const valid = field.checkValidity();

      message.textContent = valid
        ? 'This is a design preview. Email signups are not yet active.'
        : 'Please enter a valid email address.';

      message.classList.toggle('error', !valid);
    });
  }

  // ==========================================
  // AUTOMATIC COPYRIGHT YEAR
  // ==========================================

  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

})();
