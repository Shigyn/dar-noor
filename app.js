/* Dar Noor — apercu LocWeb : carte, fiche plat, panier, commande (sans paiement reel).
   Prix indicatifs, a remplacer par ceux du restaurant. */
(function () {
  'use strict';

  // La carte du restaurant (photo du menu, 13/11). Seul ajout : « Harissa ? » sur les sandwichs.
  var PIQUANT = { id: 'piquant', titre: 'Harissa ?', min: 1, max: 1, options: ['Sans', 'Avec'] };
  var BROCHETTE = { id: 'brochette', titre: 'Quelle brochette ?', min: 1, max: 1, options: ['Kefta', 'Agneau', 'Escalope marinée', 'Foie', 'Escalope', 'Bœuf mariné', 'Merguez'] };

  var CARTE = [
    { id: 'sandwichs', titre: 'Sandwichs', panier: 'Sandwich', plats: [
      { id: 's-brochettes', n: 'Brochettes au choix', d: '', p: 7.9, groupes: [BROCHETTE, PIQUANT] },
      { id: 's-kefta', n: 'Kefta', d: '', p: 7.9, groupes: [PIQUANT] },
      { id: 's-bavette', n: 'Bavette', d: '', p: 8.5, groupes: [PIQUANT] },
      { id: 's-merguez', n: 'Merguez', d: '', p: 7.9, groupes: [PIQUANT] },
      { id: 's-poulet', n: 'Cuisse de poulet désossée', d: '', p: 7.5, groupes: [PIQUANT] }
    ] },
    { id: 'grillades', titre: 'Plats grillades', panier: 'Plat', plats: [
      { id: 'g-mixte', n: 'Grillade mixte', d: '', p: 11.9, photo: 'assiette' },
      { id: 'g-bavette', n: 'Bavette', d: '', p: 12.9 },
      { id: 'g-entrecote', n: 'Entrecôte', d: '', p: 14.9 },
      { id: 'g-veau', n: 'Côte de veau', d: '', p: 13.9 },
      { id: 'g-agneau', n: 'Côtelettes d’agneau', d: '', p: 13.5 },
      { id: 'g-poulet', n: 'Cuisse de poulet désossée', d: '', p: 10.9 }
    ] },
    { id: 'brochettes', titre: 'Brochettes', panier: 'Brochette', sous: 'Prix à l’unité : composez votre assortiment.', plats: [
      { id: 'b-kefta', n: 'Kefta', d: '', p: 2.5, photo: 'kofta' },
      { id: 'b-agneau', n: 'Agneau', d: '', p: 2.5 },
      { id: 'b-escalope-marinee', n: 'Escalope marinée', d: '', p: 2.5, photo: 'brochettes' },
      { id: 'b-foie', n: 'Foie', d: '', p: 2.5 },
      { id: 'b-escalope', n: 'Escalope', d: '', p: 2.5 },
      { id: 'b-boeuf', n: 'Bœuf mariné', d: '', p: 2.5 },
      { id: 'b-merguez', n: 'Merguez', d: '', p: 2.5 },
      { id: 'b-poulet', n: 'Cuisse de poulet désossée', d: '', p: 3.9 }
    ] },
    { id: 'assiettes', titre: 'Assiettes', plats: [
      { id: 'a-brick', n: 'Brick', d: '', p: 5.9 },
      { id: 'a-tastira', n: 'Tastira', d: '', p: 5.9 },
      { id: 'a-shakshouka', n: 'Shakshouka', d: '', p: 5.9, photo: 'ojja' }
    ] },
    { id: 'salades', titre: 'Salades', panier: 'Salade', plats: [
      { id: 'sa-tunisienne', n: 'Tunisienne', d: '', p: 4 },
      { id: 'sa-houria', n: 'Houria', d: '', p: 3 },
      { id: 'sa-mechouia', n: 'Méchouia', d: '', p: 4.5 },
      { id: 'sa-mixte', n: 'Mixte', d: '', p: 4 },
      { id: 'sa-verte', n: 'Verte', d: '', p: 3 }
    ] },
    { id: 'frites', titre: 'Frites maison', panier: 'Frites,', plats: [
      { id: 'f-grande', n: 'Grande portion', d: '', p: 3.9, photo: 'frites' },
      { id: 'f-petite', n: 'Petite portion', d: '', p: 2.9 }
    ] }
  ];

  var PLATS = {};
  CARTE.forEach(function (c) { c.plats.forEach(function (p) { PLATS[p.id] = p; p.np = c.panier ? c.panier + ' ' + p.n.charAt(0).toLowerCase() + p.n.slice(1) : p.n; }); });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euros = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- la carte ---------- */
  $('[data-onglets]').innerHTML = CARTE.map(function (c) { return '<a href="#cat-' + c.id + '">' + esc(c.titre) + '</a>'; }).join('');
  $('[data-carte]').innerHTML = CARTE.map(function (c) {
    return '<section class="categorie" id="cat-' + c.id + '"><h3>' + esc(c.titre) + '</h3>' + (c.sous ? '<p>' + esc(c.sous) + '</p>' : '') +
      '<ul class="plats">' + c.plats.map(function (p) {
        return '<li><button type="button" class="plat" data-plat="' + p.id + '">' +
          (p.photo ? '<img src="photos/' + p.photo + '.webp" alt="" loading="lazy" width="104" height="104">' : '') +
          '<span class="plat-texte"><span class="plat-nom">' + esc(p.n) + '</span>' +
          (p.d ? '<span class="plat-desc">' + esc(p.d) + '</span>' : '') +
          '<span class="plat-bas"><span class="plat-prix">' + euros(p.p) + '</span><span class="plat-plus" aria-hidden="true">+</span></span></span></button></li>';
      }).join('') + '</ul></section>';
  }).join('');

  // L'onglet de la categorie a l'ecran
  var onglets = $$('[data-onglets] a');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        onglets.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('actif', on);
          if (on) a.parentNode.scrollLeft = a.offsetLeft - 16;
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('.categorie').forEach(function (s) { obs.observe(s); });
  }

  /* ---------- le panier ---------- */
  var CLE = 'darnoor_panier';
  var panier = [];
  try { panier = JSON.parse(localStorage.getItem(CLE) || '[]'); if (!Array.isArray(panier)) panier = []; } catch (e) { panier = []; }
  panier = panier.filter(function (l) { return PLATS[l.id]; });
  function garder() { try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) {} }
  function totalPanier() { return panier.reduce(function (t, l) { return t + PLATS[l.id].p * l.qte; }, 0); }
  function nbPanier() { return panier.reduce(function (t, l) { return t + l.qte; }, 0); }
  function detail(l) { return Object.keys(l.choix || {}).map(function (k) { var v = l.choix[k]; return k === 'piquant' ? (v === 'Sans' ? 'sans harissa' : 'avec harissa') : v; }).join(', '); }

  function rendrePanier() {
    var n = nbPanier(), t = euros(totalPanier());
    $$('[data-compte]').forEach(function (e) { e.textContent = n; });
    $$('[data-total]').forEach(function (e) { e.textContent = t; });
    $('[data-pluriel]').textContent = n > 1 ? 's' : '';
    $('[data-barre]').hidden = !n;
    $('[data-vide]').hidden = !!n;
    $('[data-commande]').hidden = !n;
    $('[data-lignes]').innerHTML = panier.map(function (l, i) {
      var p = PLATS[l.id], d = detail(l);
      return '<li><span class="ligne-nom">' + l.qte + ' × ' + esc(p.np) + '</span><span class="ligne-prix">' + euros(p.p * l.qte) + '</span>' +
        '<span class="ligne-detail">' + esc(d) + '</span><span class="ligne-actions">' +
        '<button type="button" data-ligne-moins="' + i + '" aria-label="Un ' + esc(p.n) + ' de moins">−</button>' +
        '<button type="button" data-ligne-plus="' + i + '" aria-label="Un ' + esc(p.n) + ' de plus">+</button></span></li>';
    }).join('');
  }

  $('[data-lignes]').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var i = +(b.getAttribute('data-ligne-moins') || b.getAttribute('data-ligne-plus'));
    if (b.hasAttribute('data-ligne-plus')) panier[i].qte = Math.min(20, panier[i].qte + 1);
    else if (--panier[i].qte < 1) panier.splice(i, 1);
    garder(); rendrePanier();
  });

  /* ---------- la fiche d'un plat ---------- */
  var fiche = $('[data-fiche]'), platOuvert = null, qte = 1;
  function prixFiche() { $('[data-fiche-prix]').textContent = euros(platOuvert.p * qte); $('[data-qte]').textContent = qte; }
  function ouvrirFiche(id) {
    var p = PLATS[id]; platOuvert = p; qte = 1;
    var img = $('[data-fiche-photo]');
    img.hidden = !p.photo;
    if (p.photo) { img.src = 'photos/' + p.photo + '.webp'; img.alt = p.n; }
    $('[data-fiche-titre]').textContent = p.n;
    $('[data-fiche-desc]').textContent = p.d;
    $('[data-fiche-groupes]').innerHTML = (p.groupes || []).map(function (g) {
      return '<fieldset class="groupe" data-groupe="' + g.id + '"><legend>' + esc(g.titre) + ' <small>obligatoire</small></legend><div class="choix">' +
        g.options.map(function (o) { return '<label><input type="radio" name="g-' + g.id + '" value="' + esc(o) + '"><span>' + esc(o) + '</span></label>'; }).join('') +
        '</div></fieldset>';
    }).join('');
    var err = $('.erreur', fiche); if (err) err.remove();
    prixFiche();
    fiche.showModal();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-plat]');
    if (b) ouvrirFiche(b.getAttribute('data-plat'));
  });
  $('[data-moins]').addEventListener('click', function () { qte = Math.max(1, qte - 1); prixFiche(); });
  $('[data-plus]').addEventListener('click', function () { qte = Math.min(20, qte + 1); prixFiche(); });
  $('[data-ajouter]').addEventListener('click', function () {
    var choix = {}, manque = null;
    (platOuvert.groupes || []).forEach(function (g) {
      var c = $('input[name="g-' + g.id + '"]:checked', fiche);
      if (c) choix[g.id] = c.value; else if (!manque) manque = g;
    });
    if (manque) {
      var err = $('.erreur', fiche) || document.createElement('p');
      err.className = 'erreur';
      err.textContent = 'Choisissez d’abord : ' + manque.titre.replace(/\s*\?$/, '').toLowerCase() + '.';
      $('.fiche-pied', fiche).before(err);
      return;
    }
    var cle = JSON.stringify(choix), deja = panier.find(function (l) { return l.id === platOuvert.id && JSON.stringify(l.choix) === cle; });
    if (deja) deja.qte = Math.min(20, deja.qte + qte); else panier.push({ id: platOuvert.id, qte: qte, choix: choix });
    garder(); rendrePanier(); fiche.close();
  });
  // Clic sur le fond = fermer
  $$('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  });

  /* ---------- panier et commande ---------- */
  var dPanier = $('[data-panier]');
  $$('[data-ouvrir-panier]').forEach(function (b) { b.addEventListener('click', function () { remplirHeures(); dPanier.showModal(); }); });
  $('[data-fermer-panier]').addEventListener('click', function () { dPanier.close(); });

  // Heures de retrait : au plus vite (~20 min), puis toutes les 15 minutes jusqu'a 1 h.
  function remplirHeures() {
    var s = $('[data-heures]'), maintenant = new Date(), t = new Date(maintenant.getTime() + 30 * 60000);
    t.setMinutes(Math.ceil(t.getMinutes() / 15) * 15, 0, 0);
    var fin = new Date(maintenant); fin.setHours(25, 0, 0, 0);
    if (maintenant.getHours() < 2) fin.setHours(1, 0, 0, 0);
    var h = ['<option value="vite">Au plus vite (environ 20 min)</option>'];
    for (var n = 0; t <= fin && n < 40; n++, t = new Date(t.getTime() + 15 * 60000)) {
      var x = String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0');
      h.push('<option value="' + x + '">' + x.replace(':', ' h ') + '</option>');
    }
    s.innerHTML = h.join('');
  }

  $('[data-commande]').addEventListener('submit', function (e) {
    e.preventDefault();
    dPanier.close();
    $('[data-apercu]').showModal();
  });

  rendrePanier();
})();
