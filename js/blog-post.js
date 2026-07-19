/* ==========================================================================
   blog-post.js
   Single-post-page behaviour only. Loaded exclusively on /blog/[slug]/
   pages, after main.js. Building the Table of Contents from the article's
   actual H2/H3 elements means it can never drift out of sync with the
   content — add or remove a heading in the article and the TOC updates
   itself with no manual editing required.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var article = document.querySelector('.blog-post-content');
    var tocDesktop = document.getElementById('tocListDesktop');
    var tocMobile = document.getElementById('tocListMobile');
    if (!article || (!tocDesktop && !tocMobile)) return;

    var headings = Array.prototype.slice.call(article.querySelectorAll('h2, h3'));
    if (!headings.length) return;

    var usedIds = {};
    function slugify(text) {
      var base = text.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      var id = base;
      var n = 1;
      while (usedIds[id]) { id = base + '-' + (++n); }
      usedIds[id] = true;
      return id;
    }

    var fragment = document.createDocumentFragment();
    var links = [];

    headings.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent || 'section');
      var li = document.createElement('li');
      if (h.tagName === 'H3') li.className = 'toc-h3';
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + h.id);
        var mobileToc = document.getElementById('tocMobile');
        if (mobileToc) mobileToc.removeAttribute('open');
      });
      li.appendChild(a);
      fragment.appendChild(li);
      links.push({ id: h.id, el: h });
    });

    if (tocDesktop) tocDesktop.appendChild(fragment.cloneNode(true));
    if (tocMobile) tocMobile.appendChild(fragment);

    /* Re-bind click handlers on the mobile clone (cloneNode does not copy listeners) */
    if (tocDesktop) {
      tocDesktop.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.getElementById(a.getAttribute('href').slice(1));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', a.getAttribute('href'));
          }
        });
      });
    }

    /* Active-section highlighting while scrolling */
    var allLinkEls = document.querySelectorAll('.toc-list a');
    function setActive(id) {
      allLinkEls.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });

    links.forEach(function (l) { observer.observe(l.el); });
  });
})();
