/* STUZEN TECHNOLOGIES — vanilla site behaviour (no framework, no build step). */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------------- Loader ---------------- */
  function initLoader() {
    var loader = doc.getElementById('stuzen-loader');
    if (!loader) return;

    var started = window.performance && performance.now ? performance.now() : Date.now();
    var minimum = reduceMotion ? 0 : 620;
    var finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      var elapsed = (window.performance && performance.now ? performance.now() : Date.now()) - started;
      var wait = Math.max(0, minimum - elapsed);

      window.setTimeout(function () {
        loader.classList.add('stuzen-loader--exiting');
        loader.setAttribute('aria-hidden', 'true');
        window.setTimeout(function () {
          loader.style.display = 'none';
        }, reduceMotion ? 0 : 480);
      }, wait);
    }

    if (doc.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    /* Never hold the page hostage if an external asset stalls. */
    window.setTimeout(finish, 2800);
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var items = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (item) {
        item.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );

    items.forEach(function (item) {
      if (item.classList.contains('is-visible')) return;
      var rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.98) {
        item.classList.add('is-visible');
        return;
      }
      observer.observe(item);
    });
  }

  /* ---------------- Desktop dropdowns ---------------- */
  function initDropdowns() {
    var groups = Array.prototype.slice.call(doc.querySelectorAll('.nav-group'));
    if (!groups.length) return;

    groups.forEach(function (group) {
      var button = group.querySelector('[data-dropdown-toggle]');
      if (!button) return;

      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var willOpen = !group.classList.contains('is-open');

        groups.forEach(function (other) {
          if (other === group) return;
          other.classList.remove('is-open');
          var otherButton = other.querySelector('[data-dropdown-toggle]');
          if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        });

        group.classList.toggle('is-open', willOpen);
        button.setAttribute('aria-expanded', String(willOpen));
      });
    });

    doc.addEventListener('click', function (event) {
      if (event.target.closest('.nav-group')) return;
      groups.forEach(function (group) {
        group.classList.remove('is-open');
        var button = group.querySelector('[data-dropdown-toggle]');
        if (button) button.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Mobile navigation ---------------- */
  function initMobileMenu() {
    var menu = doc.getElementById('mobile-menu');
    var openButton = doc.querySelector('[data-menu-open]');
    if (!menu || !openButton) return;

    var closeButtons = Array.prototype.slice.call(menu.querySelectorAll('[data-menu-close]'));
    var lastFocused = null;

    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      openButton.setAttribute('aria-expanded', String(open));
      doc.body.classList.toggle('menu-open', open);

      if (open) {
        lastFocused = doc.activeElement;
        var first = menu.querySelector('[data-menu-close]');
        if (first) window.setTimeout(function () { first.focus(); }, 30);
      } else if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
        lastFocused = null;
      }
    }

    openButton.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });

    closeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setOpen(false);
      });
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
      }

      if (event.key !== 'Tab' || !menu.classList.contains('is-open')) return;
      var focusable = Array.prototype.slice
        .call(menu.querySelectorAll('a[href], button:not([disabled])'))
        .filter(function (element) { return element.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && menu.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ---------------- FAQ accordions ---------------- */
  function initFaqs() {
    var toggles = Array.prototype.slice.call(doc.querySelectorAll('[data-faq-toggle]'));
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        var panelId = toggle.getAttribute('aria-controls');
        var panel = panelId ? doc.getElementById(panelId) : null;

        toggle.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  }

  /* ---------------- Copy email ---------------- */
  function initCopyEmail() {
    var button = doc.querySelector('[data-copy-email]');
    if (!button) return;

    function markCopied() {
      var original = button.getAttribute('aria-label') || 'Copy email address';
      button.classList.add('is-copied');
      button.setAttribute('aria-label', 'Email address copied');
      button.setAttribute('title', 'Email address copied');
      window.setTimeout(function () {
        button.classList.remove('is-copied');
        button.setAttribute('aria-label', original);
        button.removeAttribute('title');
      }, 1800);
    }

    button.addEventListener('click', function () {
      var email = 'hello@stuzen.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(markCopied, function () {
          fallbackCopy(email, markCopied);
        });
      } else {
        fallbackCopy(email, markCopied);
      }
    });

    function fallbackCopy(text, done) {
      var area = doc.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      doc.body.appendChild(area);
      area.select();
      try { doc.execCommand('copy'); done(); } catch (error) { /* no-op */ }
      doc.body.removeChild(area);
    }
  }

  /* ---------------- Contact form ---------------- */
  function initContactForm() {
    var form = doc.getElementById('contact-form');
    if (!form) return;

    var status = doc.getElementById('form-status');
    var service = doc.getElementById('serviceFocus');
    var fields = {
      fullName: doc.getElementById('fullName'),
      emailAddress: doc.getElementById('emailAddress'),
      mobileNumber: doc.getElementById('mobileNumber'),
      serviceFocus: service,
      projectBudget: doc.getElementById('projectBudget'),
      projectDescription: doc.getElementById('projectDescription')
    };

    if (!fields.fullName || !status) return;

    /* Preselect a service when arriving from a service page (?service=SEO). */
    try {
      var requested = new URLSearchParams(window.location.search).get('service');
      if (requested && service) {
        var match = Array.prototype.slice.call(service.options).filter(function (option) {
          return option.value && option.value.toLowerCase() === requested.toLowerCase();
        })[0];
        if (match) service.value = match.value;
      }
    } catch (error) { /* URLSearchParams is optional */ }

    function phoneDigits(value) {
      var digits = String(value).replace(/\D/g, '');
      if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
      if (digits.length === 11 && digits.charAt(0) === '0') digits = digits.slice(1);
      return digits;
    }

    var validators = {
      fullName: function (value) {
        var name = value.trim();
        if (!name) return 'Please enter your full name.';
        if (name.length < 2) return 'Please enter your full name.';
        if (/\d/.test(name)) return 'Please enter a valid name without numbers.';
        if (!/\p{L}/u.test(name)) return 'Please enter a valid name.';
        return '';
      },
      emailAddress: function (value) {
        var email = value.trim();
        if (!email) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Please enter a valid email address.';
        return '';
      },
      mobileNumber: function (value) {
        if (!value.trim()) return 'Please enter your mobile number.';
        var digits = phoneDigits(value);
        if (!/^[6-9]\d{9}$/.test(digits)) {
          return 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.';
        }
        return '';
      },
      serviceFocus: function (value) {
        return value ? '' : 'Please select a service.';
      },
      projectBudget: function (value) {
        return value ? '' : 'Please select a project budget.';
      },
      projectDescription: function (value) {
        return value.trim() ? '' : 'Please describe your project.';
      }
    };

    function errorNode(name) {
      return doc.getElementById(name + '-error');
    }

    function setError(name, message) {
      var field = fields[name];
      var node = errorNode(name);
      if (field) {
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('is-invalid');
      }
      if (node) node.textContent = message;
    }

    function clearError(name) {
      var field = fields[name];
      var node = errorNode(name);
      if (field) {
        field.removeAttribute('aria-invalid');
        field.classList.remove('is-invalid');
      }
      if (node) node.textContent = '';
    }

    function clearStatus() {
      status.hidden = true;
      status.textContent = '';
      status.className = 'form-status';
      status.setAttribute('role', 'status');
    }

    Object.keys(fields).forEach(function (name) {
      var field = fields[name];
      if (!field) return;
      var eventName = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, function () {
        clearError(name);
        clearStatus();
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstInvalid = null;
      var data = {
        fullName: fields.fullName.value,
        emailAddress: fields.emailAddress.value,
        mobileNumber: fields.mobileNumber.value,
        companyName: (doc.getElementById('companyName') || {}).value || '',
        serviceFocus: fields.serviceFocus.value,
        projectBudget: fields.projectBudget.value,
        projectDescription: fields.projectDescription.value
      };

      Object.keys(validators).forEach(function (name) {
        var message = validators[name](fields[name] ? fields[name].value : '');
        if (message) {
          setError(name, message);
          if (!firstInvalid) firstInvalid = fields[name];
        } else {
          clearError(name);
        }
      });

      if (firstInvalid) {
        status.hidden = false;
        status.className = 'form-status form-status--error';
        status.setAttribute('role', 'alert');
        status.innerHTML = '<p class="form-status__title">Please review the highlighted fields.</p><p>Check the details below and submit the enquiry again.</p>';
        firstInvalid.focus();
        return;
      }

      var digits = phoneDigits(data.mobileNumber);
      var name = data.fullName.trim();
      var budgetLabel = fields.projectBudget.options[fields.projectBudget.selectedIndex].textContent;

      var bodyLines = [
        'Name: ' + name,
        'Email: ' + data.emailAddress.trim(),
        'Mobile: +91 ' + digits,
        'Company: ' + (data.companyName.trim() || 'Not provided'),
        'Service: ' + data.serviceFocus,
        'Budget: ' + budgetLabel,
        '',
        'Project description:',
        data.projectDescription.trim()
      ];
      var mailto = 'mailto:hello@stuzen.com?subject=' + encodeURIComponent('Project enquiry — ' + data.serviceFocus) + '&body=' + encodeURIComponent(bodyLines.join('\n'));

      form.reset();
      Object.keys(fields).forEach(clearError);
      clearStatus();

      status.hidden = false;
      status.className = 'form-status form-status--success';
      status.setAttribute('role', 'status');
      status.innerHTML =
        '<p class="form-status__title">Thank you, ' + escapeHtml(name) + '.</p>' +
        '<p>Your enquiry has been validated in this browser. This demo build has no connected form endpoint, so it has not been sent automatically.</p>' +
        '<p>To send it now, open the email draft below or contact us directly.</p>' +
        '<div class="form-status__actions"><a class="btn-primary" href="' + mailto.replace(/"/g, '&quot;') + '">Open email draft</a><a class="form-status__link" href="tel:+917418672022">Call +91 74186 72022</a></div>';
      status.focus();
    });
  }

  ready(function () {
    initLoader();
    initReveal();
    initDropdowns();
    initMobileMenu();
    initFaqs();
    initCopyEmail();
    initContactForm();
  });
})();
