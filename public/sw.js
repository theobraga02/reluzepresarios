/* Service worker: abre offline depois da primeira visita. Nunca toca em /api. */
const V = 'emp-v4'
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(['/', '/icon.svg', '/manifest.json'])).then(() => self.skipWaiting()))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', (e) => {
  const r = e.request
  const u = new URL(r.url)
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r).then((res) => { const cp = res.clone(); caches.open(V).then((c) => c.put('/', cp)); return res })
        .catch(() => caches.match('/')),
    )
    return
  }
  // Pedido que exige rede (cache: 'reload') ou dados da Bíblia: rede primeiro, cache só se estiver offline.
  const doc = r.destination === 'document'
  const ehJson = u.pathname.startsWith('/biblia/')
  if (r.cache === 'reload' || r.cache === 'no-store' || ehJson) {
    e.respondWith(
      fetch(r).then((res) => {
        const tipo = res.headers.get('content-type') || ''
        if (res.ok && (!ehJson || tipo.includes('json'))) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)) }
        return res
      }).catch(() => caches.match(r).then((hit) => hit || Response.error())),
    )
    return
  }
  e.respondWith(
    caches.match(r).then((hit) => {
      // Nunca devolve HTML guardado para algo que não é página (evita "JSON" que na verdade é a página inicial).
      if (hit && !doc && (hit.headers.get('content-type') || '').includes('text/html')) hit = undefined
      return hit || fetch(r).then((res) => {
        const tipo = res.headers.get('content-type') || ''
        if (res.ok && (doc || !tipo.includes('text/html'))) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)) }
        return res
      })
    }),
  )
})
