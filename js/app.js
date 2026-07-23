/* Acreditator UC CHRISTUS — demo estática. Sin backend: estado en localStorage. */
(function () {
  'use strict';
  var KEY = 'acreditator-ucchristus-v1';

  var ROLES = {
    admin:     { nombre: 'Carolina Fuentes', titulo: 'ADMINISTRADORA DE RED' },
    encargado: { nombre: 'Leonardo M.',      titulo: 'ENCARGADO DE UNIDAD' },
    jefatura:  { nombre: 'Dra. P. Contreras', titulo: 'JEFATURA URGENCIA ADULTO' },
    auditor:   { nombre: 'Auditor Externo',  titulo: 'SOLO LECTURA' }
  };
  var HOME = { admin: 'panel.html', encargado: 'panel.html', jefatura: 'jefatura.html', auditor: 'panel.html' };

  function getState() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function setState(patch) {
    var s = getState();
    Object.keys(patch).forEach(function (k) { s[k] = patch[k]; });
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }

  var page = location.pathname.split('/').pop() || 'index.html';
  var isPublic = page === 'index.html' || page === '';
  var state = getState();
  var rol = state.rol;

  /* Guarda de sesión */
  if (!isPublic && !rol) { location.replace('index.html'); return; }

  /* Login: tarjetas con data-rol */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-rol]');
    if (t) {
      ev.preventDefault();
      setState({ rol: t.getAttribute('data-rol') });
      location.href = HOME[t.getAttribute('data-rol')] || 'panel.html';
      return;
    }
    var lo = ev.target.closest('[data-logout]');
    if (lo) {
      ev.preventDefault();
      localStorage.removeItem(KEY);
      location.href = 'index.html';
      return;
    }
    var toastBtn = ev.target.closest('[data-toast]');
    if (toastBtn) {
      ev.preventDefault();
      /* QA#1: auditor en solo lectura no ejecuta acciones, aunque el elemento se haya cableado después */
      if (toastBtn.hasAttribute('disabled') || (rol === 'auditor' && toastBtn.hasAttribute('data-accion'))) { return; }
      toast(toastBtn.getAttribute('data-toast'), toastBtn.getAttribute('data-toast-tipo') || 'ok');
      return;
    }
    var go = ev.target.closest('[data-go]');
    if (go) { ev.preventDefault(); location.href = go.getAttribute('data-go'); return; }
    /* QA#3: links muertos de Stitch → inertes (href="#" o ancla sin destino) */
    var dead = ev.target.closest('a');
    if (dead) {
      var h = dead.getAttribute('href') || '';
      if (h === '#' || (h.charAt(0) === '#' && !document.getElementById(h.slice(1)))) { ev.preventDefault(); }
    }
  });

  if (!isPublic && rol) {
    /* Sidebar por rol */
    document.querySelectorAll('[data-roles]').forEach(function (li) {
      var ok = li.getAttribute('data-roles').split(',').indexOf(rol) >= 0;
      if (!ok) { li.style.display = 'none'; }
    });
    /* Usuario en topbar */
    var u = ROLES[rol] || ROLES.encargado;
    document.querySelectorAll('[data-user-name]').forEach(function (el) { el.textContent = u.nombre; });
    document.querySelectorAll('[data-user-role]').forEach(function (el) { el.textContent = u.titulo; });
    /* Auditor: modo solo lectura — deshabilita acciones marcadas */
    if (rol === 'auditor') {
      document.querySelectorAll('[data-accion]').forEach(function (el) {
        el.setAttribute('disabled', 'disabled');
        el.classList.add('opacity-40', 'pointer-events-none');
      });
    }
  }

  /* Toast global */
  function toast(msg, tipo) {
    var el = document.createElement('div');
    var color = tipo === 'error' ? '#ba1a1a' : (tipo === 'warn' ? '#E8850C' : '#166534');
    el.setAttribute('role', 'status');
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;background:#12294A;' +
      'color:#fff;padding:14px 18px;border-radius:8px;font:500 14px Inter,sans-serif;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.25);display:flex;align-items:center;gap:10px;max-width:360px;';
    el.innerHTML = '<span style="width:8px;height:8px;border-radius:99px;background:' + color +
      ';flex-shrink:0"></span><span></span>';
    el.lastChild.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .4s'; el.style.opacity = '0'; }, 2600);
    setTimeout(function () { el.remove(); }, 3100);
  }

  window.AcreditatorDemo = { getState: getState, setState: setState, toast: toast, rol: rol };
})();
