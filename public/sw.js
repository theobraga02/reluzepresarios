/* Service worker: abre offline depois da primeira visita. Nunca toca em /api. */
const V = 'emp-v3'
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
  e.respondWith(
    caches.match(r).then((hit) => hit || fetch(r).then((res) => {
      if (res.ok) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)) }
      return res
    })),
  )
})
