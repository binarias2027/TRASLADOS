# SPB · Programación de Traslado — versión PWA (instalable)

## Qué contiene esta carpeta
- `index.html` — la aplicación completa (con Supabase ya conectado)
- `manifest.json` — hace que el navegador la reconozca como app instalable
- `service-worker.js` — permite que funcione instalada y se actualice sola
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `favicon.ico` — íconos de la app

## Requisito importante
Los navegadores **solo permiten instalar y usar sin internet una PWA si se sirve por HTTPS**
(o desde `localhost`). Si simplemente abres `index.html` haciendo doble clic
(`file://...`), la app funciona igual de bien, pero **no vas a poder
instalarla ni usarla sin conexión** — esa parte se activa sola cuando la
subes a un hosting con HTTPS.

## Cómo publicarla (elige una opción)

### Opción A: Netlify (gratis, más fácil)
1. Entra a https://app.netlify.com
2. "Add new site" → "Deploy manually"
3. Arrastra **toda esta carpeta** (los 8 archivos juntos, no por separado)
4. Netlify te da un enlace tipo `https://tu-app.netlify.app`
5. Entra a ese enlace desde el celular o el computador → en el navegador
   aparecerá la opción de **"Instalar"** o **"Agregar a pantalla de inicio"**

### Opción B: Vercel
Igual que Netlify: arrastra la carpeta en https://vercel.com/new

### Opción C: GitHub Pages
1. Crea un repositorio nuevo en GitHub
2. Sube estos 8 archivos (todos en la raíz del repositorio, no en subcarpetas)
3. Ve a Settings → Pages → activa "GitHub Pages" apuntando a la rama `main`
4. Te da un enlace `https://tu-usuario.github.io/tu-repo/`

### Opción D: Tu propio servidor / hosting
Sube los 8 archivos a la raíz del sitio (o a una carpeta), asegurándote de
que el sitio use HTTPS.

## Cómo instalarla en el celular o computador
1. Abre el enlace de tu hosting (https://...) en Chrome, Edge o el navegador
   de tu celular
2. Verás un botón **"⬇ Instalar app"** arriba a la derecha, o la opción
   "Agregar a pantalla de inicio" / "Instalar" en el menú del navegador
3. Una vez instalada, se abre como una app normal, con su propio ícono,
   sin la barra de direcciones del navegador

## Cómo se actualiza sola
Cada vez que subas una nueva versión de `index.html` (o de cualquier
archivo) a tu hosting:
1. Abre el archivo `service-worker.js`
2. Sube en 1 el número de `CACHE_VERSION` (por ejemplo de `'v7'` a `'v8'`)
3. Vuelve a subir todos los archivos a tu hosting

La próxima vez que alguien abra la app instalada (con internet), el
sistema detecta la versión nueva, la descarga en segundo plano y recarga
la app sola — sin que nadie tenga que desinstalar ni reinstalar nada.

## Si le pides ayuda a Claude para el próximo cambio
Dile que edite `index.html` de esta carpeta y que suba también el número
de `CACHE_VERSION` en `service-worker.js` cada vez, para que la
actualización automática funcione.
