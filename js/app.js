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


  /* Tooltips globales: diccionario por texto de botón */
  var TIPS = {
    'Enviar recordatorio a jefaturas': 'Notifica por correo a todas las jefaturas con personas pendientes en este punto',
    'Enviar recordatorio': 'Env\u00eda un correo autom\u00e1tico a la jefatura con los pendientes de su equipo',
    'Revisar punto cr\u00edtico': 'Abre el detalle del punto con peor cumplimiento',
    'Ir al punto 3.1': 'Abre el detalle de RCP e IAAS',
    'Importar N\u00f3mina': 'Carga masiva de personal con validaci\u00f3n autom\u00e1tica en 3 pasos',
    'Resolver inconsistencias': 'Revisa los conflictos de RUT detectados entre las 3 fuentes',
    'Sincronizar ahora': 'Fuerza una sincronizaci\u00f3n manual con Academia fuera del horario programado',
    'Configurar Intervalo': 'Define la frecuencia de la sincronizaci\u00f3n autom\u00e1tica',
    'Validar y Continuar': 'Revisa el archivo y muestra los errores fila por fila antes de confirmar',
    'Confirmar carga': 'Incorpora las filas v\u00e1lidas a la dotaci\u00f3n; las filas con error quedan excluidas',
    'Bajar Plantilla': 'Descarga el formato oficial de carga de n\u00f3mina',
    'Cancelar operaci\u00f3n': 'Descarta la carga y vuelve a Dotaci\u00f3n',
    'Cargar Documento': 'Adjunta un respaldo PDF a la ficha de la persona',
    'Exportar Ficha': 'Genera un PDF con el estado de acreditaci\u00f3n de la persona',
    'Exportar Excel': 'Descarga el reporte con las columnas seleccionadas',
    'Guardar Template': 'Guarda esta combinaci\u00f3n de columnas para reutilizarla',
    'Exportar PDF': 'Genera el reporte de evidencia para el acreditador',
    'EXPORTAR PDF': 'Genera el reporte de evidencia para el acreditador',
    'Modo presentaci\u00f3n': 'Vista limpia de pantalla completa para mostrar ante el acreditador',
    'SALIR DE MODO': 'Vuelve a la vista normal de tu servicio',
    'Nueva Regla': 'Define una condici\u00f3n de alerta con frecuencia y destinatarios',
    'Configurar umbrales': 'Define la meta de cumplimiento por unidad y por punto',
    'Agregar unidad': 'Incorpora una nueva unidad de la red a la plataforma',
    'VER CERTIFICADO': 'Abre el respaldo del curso tra\u00eddo desde Academia',
    'NOTIFICAR FUNCIONARIO': 'Env\u00eda el recordatorio directamente a la persona',
    'Ver log de ingesta': 'Historial de las sincronizaciones autom\u00e1ticas con Academia',
    'Exportar': 'Descarga la informaci\u00f3n en Excel'
  };
  var tipEl = null;
  function showTip(target, text) {
    hideTip();
    tipEl = document.createElement('div');
    tipEl.style.cssText = 'position:fixed;z-index:10000;background:#12294A;color:#fff;' +
      'padding:8px 12px;border-radius:6px;font:500 12px/1.4 Inter,sans-serif;max-width:260px;' +
      'box-shadow:0 6px 20px rgba(18,41,74,.25);pointer-events:none;opacity:0;transition:opacity .15s;';
    tipEl.textContent = text;
    document.body.appendChild(tipEl);
    var r = target.getBoundingClientRect();
    var top = r.top - tipEl.offsetHeight - 8;
    if (top < 8) { top = r.bottom + 8; }
    var left = Math.max(8, Math.min(r.left + r.width / 2 - tipEl.offsetWidth / 2, window.innerWidth - tipEl.offsetWidth - 8));
    tipEl.style.top = top + 'px';
    tipEl.style.left = left + 'px';
    requestAnimationFrame(function () { if (tipEl) { tipEl.style.opacity = '1'; } });
  }
  function hideTip() { if (tipEl) { tipEl.remove(); tipEl = null; } }
  document.addEventListener('mouseover', function (ev) {
    var el = ev.target.closest('button,a');
    if (!el) { hideTip(); return; }
    var texto = el.textContent.replace(/\s+/g, ' ').trim();
    var tip = null;
    if (el.hasAttribute('data-tip')) { tip = el.getAttribute('data-tip'); }
    else {
      var keys = Object.keys(TIPS);
      for (var i = 0; i < keys.length; i++) {
        if (texto.indexOf(keys[i]) === 0) { tip = TIPS[keys[i]]; break; }
      }
    }
    if (tip) { showTip(el, tip); } else { hideTip(); }
  });
  document.addEventListener('mouseout', function (ev) {
    if (ev.target.closest('button,a')) { hideTip(); }
  });
  document.addEventListener('click', function () { hideTip(); });

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
