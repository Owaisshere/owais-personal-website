/* ==========================================================================
   service-page.js
   Single service page behaviour only: highlights the active item in the
   sidebar's Quick Navigation card as the visitor scrolls through the
   page's sections. No-op on any page without a .sb-nav-list.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var navLinks = document.querySelectorAll('.sb-nav-list a');
    if (!navLinks.length) return;

    var sections = [];
    navLinks.forEach(function (a) {
      var id = a.getAttribute('href').replace('#', '');
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, link: a });
    });
    if (!sections.length) return;

    function setActive(id) {
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-110px 0px -70% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s.el); });
  });
})();
