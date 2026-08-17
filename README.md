# Arzen Industrial Group — Landing page (v3)

## ⚠️ Qué pasó con el bug que viste

Tu HTML se actualizó pero `css/styles.css` se quedó en una versión vieja — por
eso los tabs se veían como botones sin estilo y el ícono del avión salía gigante.
El sitio y el CSS deben subirse **juntos, siempre**, o quedan desincronizados.

Para que esto no vuelva a pasar, hice 2 cosas:

1. Le puse un número de versión visible a `css/styles.css` y `js/main.js`
   (línea 3 de cada archivo dice `VERSION: v3`).
2. Los `index.html` ahora cargan esos archivos con `?v=3` al final
   (`css/styles.css?v=3`) — esto obliga al navegador a descargar la versión
   nueva en vez de usar una guardada en caché.

## Cómo confirmar que subiste todo bien (30 segundos)

Después de subir los archivos a GitHub y que Vercel termine de desplegar:

1. Entra a tu sitio en modo incógnito (para evitar caché de tu navegador).
2. Clic derecho → "Ver código fuente de la página".
3. Busca `styles.css?v=3` — si lo ves, el CSS correcto se cargó.
4. Si algo se ve roto iOS mismo como en tus capturas: entra directo a
   `arzenindustrial.com/css/styles.css` en el navegador y busca en el texto
   `VERSION: v3` cerca del principio. Si no dice v3, el archivo no se subió
   bien — vuelve a arrastrarlo a GitHub, esta vez solo ese archivo.

## Qué cambió en esta versión

- **Bug de estilos corregido** + protección con número de versión (arriba).
- **Hero rediseñado** — más grande, más editorial, estilo Boeing/GE Aerospace:
  titular más grande, franja de 4 datos técnicos debajo en vez de un panel
  lateral.
- **Nueva sección de fotos de planta** (`Inside the shops we verify` /
  `Dentro de los talleres que verificamos`) — hoy tiene 4 espacios reservados
  con textura técnica de marcador de posición. **Reemplázalos con fotos
  reales en cuanto las tengas** — es lo que más va a subir la credibilidad
  del sitio. Instrucciones abajo.
- **2 banners de audiencia nuevos:**
  - En la página en inglés: *"Looking for suppliers?"* → dirige a compradores
    de EE. UU. al tab de comprador en Contacto.
  - En la página en español: *"¿Quieres unirte a nuestra red de
    proveedores?"* → dirige a talleres mexicanos al tab de proveedor.
- **Íconos con tamaño fijo a prueba de fallos** — antes dependían 100% del
  CSS para no salir gigantes; ahora tienen `width`/`height` puestos
  directamente en el código, así que aunque el CSS fallara de nuevo, nunca
  se van a ver como en tu tercera captura.

## Cómo agregar las fotos reales de planta

1. Toma o consigue 4 fotos horizontales de un taller (idealmente uno que ya
   hayas visitado/verificado): piso de maquinado, inspección dimensional,
   ensamble de tooling, piezas terminadas. Buena luz, sin gente identificable
   si no tienes su permiso.
2. Nómbralas exactamente: `planta-1.jpg`, `planta-2.jpg`, `planta-3.jpg`,
   `planta-4.jpg` y súbelas a la carpeta `assets/plants/` del repositorio.
3. En `css/styles.css`, busca el comentario que dice:
   ```
   /* Cuando tengan foto real, sustituir el selector correspondiente con: ... */
   ```
   y en `.plant-photo` agrega, para cada una:
   ```css
   .facility-grid > div:nth-child(1){ background-image:url('/assets/plants/planta-1.jpg'); background-size:cover; background-position:center; }
   .facility-grid > div:nth-child(2){ background-image:url('/assets/plants/planta-2.jpg'); background-size:cover; background-position:center; }
   .facility-grid > div:nth-child(3){ background-image:url('/assets/plants/planta-3.jpg'); background-size:cover; background-position:center; }
   .facility-grid > div:nth-child(4){ background-image:url('/assets/plants/planta-4.jpg'); background-size:cover; background-position:center; }
   ```
   Si prefieres, mándame las fotos en el chat y yo te regreso el código ya
   listo con esto hecho.

## Antes de publicar — reemplazos obligatorios

| Placeholder | Dónde | Reemplazar por |
|---|---|---|
| `https://calendly.com/arzen-industrial/buyers-15min` | tab "Comprador" en `#contacto` (2 archivos) | tu URL real de Calendly |
| `G-XXXXXXX` | script de GA4 (2 archivos) | tu Measurement ID real de GA4 |
| `https://www.linkedin.com/company/arzen-industrial` | footer (2 archivos) | tu URL real de LinkedIn Company Page |

El tab "Proveedor" no usa Calendly — manda un correo pre-llenado a
`ac@arzenindustrial.com`. Si más adelante quieres que también agende una
llamada, crea un segundo Event Type en Calendly y cámbialo por un
`calendly-inline-widget` igual al del tab de comprador.

## Despliegue — GitHub + Vercel

Igual que antes: descarga el zip, descomprime, arrastra **todo** el
contenido (reemplazando lo que ya existe) a tu repo de GitHub, confirma el
commit. Vercel vuelve a publicar solo.

**Esta vez, verifica con el paso de arriba ("Cómo confirmar que subiste todo
bien") antes de darlo por hecho.**
