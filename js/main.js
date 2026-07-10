/* ==========================================================================
   main.js
   All interactive behaviour for the Mohammad Owais portfolio homepage.

   Split into two entry points:
   1) initPageBehaviour()   — runs on DOMContentLoaded. Handles everything
      that lives directly in index.html (progress bar, mouse glow, scroll
      reveal, animated stat counters, magnetic buttons, glass tilt, FAQ
      accordion). None of this depends on the header/footer components.

   2) initHeaderFooterBehaviour() — runs once the "components:loaded"
      event fires from include.js. Handles everything that depends on
      elements living inside components/header.html and
      components/footer.html (nav scroll state, mobile nav toggle,
      back-to-top button, current year).
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     1) Page-level behaviour (elements always present in index.html)
     --------------------------------------------------------------------- */
  function initPageBehaviour() {
    /* Ambient mouse glow */
    var glow = document.getElementById('mouseGlow');
    if (glow) {
      window.addEventListener('mousemove', function (e) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }, { passive: true });
    }

    /* Scroll-triggered reveal animations */
    var revealEls = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    /* Animated stat counters */
    var statNumbers = document.querySelectorAll('.stat-number');
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 1700;
          var startTime = performance.now();

          function tick(now) {
            var progress = Math.min((now - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          }
          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    statNumbers.forEach(function (el) { countObserver.observe(el); });

    /* Magnetic buttons + ripple effect */
    document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0,0)';
      });
      btn.addEventListener('click', function (e) {
        var rect = this.getBoundingClientRect();
        var ripple = document.createElement('span');
        var size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
      });
    });

    /* 3D tilt on glass cards (hover-capable devices only) */
    if (window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.glass').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = 'perspective(800px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg) translateY(-6px)';
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
        });
      });
    }

    /* FAQ accordion */
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var answer = item.querySelector('.faq-a');
      item.querySelector('.faq-q').addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
          i.querySelector('.faq-a').style.maxHeight = '';
        });
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 24 + 'px';
        }
      });
    });
    window.addEventListener('resize', function () {
      document.querySelectorAll('.faq-item.open .faq-a').forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + 24 + 'px';
      });
    });

    /* Scroll progress bar + back-to-top visibility (elements live in index.html) */
    var progressBar = document.getElementById('progressBar');
    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      if (progressBar) progressBar.style.width = scrolled + '%';
      if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
      /* Nav "scrolled" state is toggled here too since header may already
         be loaded by the time the user starts scrolling; guarded with a
         null-check in case header hasn't been injected yet. */
      var nav = document.getElementById('siteNav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ---------------------------------------------------------------------
     2) Header / Footer dependent behaviour
     (runs after components/header.html and components/footer.html
      have been injected into the DOM by include.js)
     --------------------------------------------------------------------- */
  function initHeaderFooterBehaviour() {
    /* Footer copyright year */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* Mobile nav toggle */
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
      });
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { navLinks.classList.remove('open'); });
      });
    }

    /* Ensure the nav-cta / any header magnetic buttons injected after
       page-level init also get the magnetic + ripple behaviour. */
    document.querySelectorAll('header .btn-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0,0)';
      });
      btn.addEventListener('click', function (e) {
        var rect = this.getBoundingClientRect();
        var ripple = document.createElement('span');
        var size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initPageBehaviour);
  document.addEventListener('components:loaded', initHeaderFooterBehaviour);
})();
