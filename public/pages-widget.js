/* Floating page navigator (lower right). Lists the HTML pages in /public via /api/public-pages. */
(function () {
  var host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:20px;bottom:20px;z-index:2147483000;';
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '*{box-sizing:border-box;font-family:Roboto,-apple-system,BlinkMacSystemFont,sans-serif}' +
    'button.fab{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:9999px;border:1.5px solid #08251A;background:#ABFF44;color:#08251A;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(8,37,26,.25)}' +
    'button.fab:hover{background:#7DDD3D}' +
    '.panel{position:absolute;left:0;bottom:52px;width:320px;max-width:calc(100vw - 40px);max-height:60vh;overflow:auto;background:#fff;border:1.5px solid #08251A;border-radius:20px;box-shadow:0 8px 28px rgba(8,37,26,.3);padding:8px}' +
    '.panel[hidden]{display:none}' +
    '.head{padding:8px 12px;font:600 11px "Roboto Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:#08251A}' +
    'a{display:block;padding:10px 12px;border-radius:12px;color:#08251A;text-decoration:none;font-size:13px;font-weight:500;line-height:1.3}' +
    'a:hover{background:#EFF6E9}' +
    'a[aria-current=page]{background:#ABFF44;font-weight:700}' +
    '.path{display:block;margin-top:2px;font:400 11px "Roboto Mono",monospace;opacity:.6}' +
    '.msg{padding:10px 12px;font-size:13px;color:#08251A}' +
    '</style>' +
    '<div class="panel" id="panel" hidden role="dialog" aria-label="Pages"><div class="head">Pages</div><div id="list"><div class="msg">Loading…</div></div></div>' +
    '<button class="fab" id="fab" aria-expanded="false" aria-controls="panel">☰ Pages</button>';

  var fab = root.getElementById('fab');
  var panel = root.getElementById('panel');
  var list = root.getElementById('list');

  function setOpen(open) {
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', String(open));
  }
  fab.addEventListener('click', function () { setOpen(panel.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', function (e) { if (!e.composedPath().includes(host)) setOpen(false); });

  function render(pages) {
    list.textContent = '';
    if (!pages.length) { list.innerHTML = '<div class="msg">No pages found.</div>'; return; }
    [{ path: '/', title: 'Home' }].concat(pages).forEach(function (p) {
      var a = document.createElement('a');
      a.href = p.path;
      if (p.path === location.pathname) a.setAttribute('aria-current', 'page');
      a.textContent = p.title;
      var sub = document.createElement('span');
      sub.className = 'path';
      sub.textContent = p.path;
      a.appendChild(sub);
      list.appendChild(a);
    });
  }

  fetch('/api/public-pages')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { render(d.pages); })
    .catch(function () { list.innerHTML = '<div class="msg">Could not load pages.</div>'; });

  document.body.appendChild(host);
})();
