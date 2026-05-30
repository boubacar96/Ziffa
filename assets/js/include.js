/* ==========================================================================
   ZIFFA — Injection des partiels partagés (header / footer)
   Chaque page contient <div data-include="partials/header.html"></div>.
   Ce script va chercher le fragment et l'insère, puis active le menu.
   ⚠️ Nécessite un serveur HTTP (fetch ne fonctionne pas en file://).
   ========================================================================== */
(function () {
  "use strict";

  function injectAll() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));
    return Promise.all(
      nodes.map(function (node) {
        var url = node.getAttribute("data-include");
        return fetch(url)
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status + " sur " + url);
            return res.text();
          })
          .then(function (html) {
            node.outerHTML = html;
          })
          .catch(function (err) {
            console.error("[include] Échec du chargement de", url, err);
            node.innerHTML =
              '<p style="padding:12px;font-family:monospace;color:#A82822">' +
              "Fragment introuvable : " + url +
              " — servez le site via un serveur HTTP (ex. python -m http.server)." +
              "</p>";
          });
      })
    );
  }

  function initNav() {
    var page = document.body.getAttribute("data-page");

    // État actif du lien de navigation correspondant à la page courante
    if (page) {
      var current = document.querySelector('.nav-link[data-page="' + page + '"]');
      if (current) current.classList.add("active");
    }

    // Menu mobile (hamburger)
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      // Sur mobile, un premier tap sur un onglet à sous-menu ouvre le dropdown
      document.querySelectorAll(".nav-item > .nav-link").forEach(function (link) {
        link.addEventListener("click", function (e) {
          if (window.matchMedia("(max-width: 1200px)").matches) {
            var item = link.parentElement;
            if (!item.classList.contains("open")) {
              e.preventDefault();
              document.querySelectorAll(".nav-item.open").forEach(function (o) {
                if (o !== item) o.classList.remove("open");
              });
              item.classList.add("open");
            }
          }
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectAll().then(initNav);
  });
})();
