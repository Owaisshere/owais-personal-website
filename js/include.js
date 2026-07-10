/* ==========================================================================
   include.js
   Lightweight client-side HTML component loader.

   Usage in index.html:
     <div data-include="components/header.html"></div>
     ...
     <div data-include="components/footer.html"></div>

   Fetches each referenced component and injects its HTML into the
   placeholder element. Once ALL includes on the page have finished
   loading, a "components:loaded" CustomEvent is dispatched on
   `document` so other scripts (see main.js) can safely wire up
   behaviour that depends on elements living inside header.html /
   footer.html (nav toggle, scroll state, current year, etc).

   IMPORTANT: fetch() cannot read local files over the file:// protocol.
   Serve this project through a local web server while developing, e.g.:
     npx serve .
     python3 -m http.server
   This structure (independent header/footer partials assembled at
   request time) also maps cleanly onto Astro components/layouts later,
   e.g. <Header /> and <Footer /> islands in an Astro layout.
   ========================================================================== */

(function () {
  'use strict';

  function loadInclude(el) {
    var file = el.getAttribute('data-include');
    if (!file) return Promise.resolve();

    return fetch(file)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to fetch ' + file + ' (' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        el.removeAttribute('data-include');
      })
      .catch(function (err) {
        console.error('[include.js] Error including', file, err);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var includeEls = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));

    if (includeEls.length === 0) {
      document.dispatchEvent(new CustomEvent('components:loaded'));
      return;
    }

    Promise.all(includeEls.map(loadInclude)).then(function () {
      document.dispatchEvent(new CustomEvent('components:loaded'));
    });
  });
})();
