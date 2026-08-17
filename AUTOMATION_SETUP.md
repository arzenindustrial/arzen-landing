# Sistema de Automatización Comercial — Checklist de puesta en marcha

Basado en `Documento 3 — Sistema de Automatización Comercial`. Este documento traduce
la especificación de los 6 bots en una secuencia concreta de cuentas, credenciales y
pasos, en el orden en que conviene construirlos.

**Regla de oro que ya está en el documento y que no cambia:** ningún bot cierra,
negocia precio ni condiciones de contrato. Todo bot agenda, enriquece, escribe o
notifica — la llamada de cierre y la negociación son 100% humanas, siempre.

---

## 0. Antes de construir un solo bot

Decisiones que bloquean todo lo demás si no están tomadas:

1. **Nombre legal y dominio funcionales confirmados** (Arzen Industrial Group /
   arzenindustrial.com) — ya resuelto en el documento 2.
2. **Cuenta de correo de outbound separada del correo principal** — nunca envíes
   secuencias frías desde `andrea@arzenindustrial.com` directamente; ese dominio se
   protege para clientes ya en conversación. Usa un dominio "primo" (ej.
   `arzensourcing.com` o `getarzen.com`) solo para prospección fría, con 2-3 bandejas
   rotando.
3. **Cuenta de LinkedIn personal de Andrea** — Bot 3 opera sobre su perfil real, no
   sobre una página de empresa (LinkedIn no permite automatizar mensajes 1:1 desde
   páginas de empresa).
4. **Presupuesto mensual aproximado para herramientas** (ver tabla de costos abajo)
   antes de crear las cuentas, para no empezar en un tier que tendrás que migrar en
   dos semanas.

---

## 1. Orden de implementación recomendado (4 fases)

No construyas los 6 bots en paralelo — cada fase depende de que la anterior funcione.

### Fase A — Fundación de datos (semana 1)
- Airtable (base de prospectos) + esquema de campos y pipeline.
- Cuenta de Apollo.io + Clay para enriquecimiento.
- Sin esto, Bot 1 no tiene dónde escribir ni con qué enriquecer.

### Fase B — Orquestador + Bot 1 (semana 1-2)
- n8n desplegado (Railway) o Make.com.
- Bot 1: búsqueda diaria de leads → Airtable.
- Corre en modo de prueba una semana revisando manualmente los prospectos que
  encuentra antes de conectar cualquier canal de salida.

### Fase C — Canales de salida: Bot 2 + Bot 3 (semana 2-3)
- Instantly.ai/Smartlead (correo) + Expandi.io/HeyReach (LinkedIn).
- Integración de Claude API para personalización de primera línea.
- Empieza con volumen bajo (10-15 correos/día, no 40-50) durante el calentamiento
  de dominio — ver sección de salvaguardas.

### Fase D — Agenda, notificaciones y reportes: Bot 4, 5, 6 (semana 3-4)
- Calendly + Google Calendar.
- WhatsApp Business API o Slack.
- Claude API para reportes pre-reunión.
- Este es el último tramo porque depende de que ya haya respuestas reales entrando
  por los Bots 2 y 3.

---

## 2. Cuentas y credenciales a crear (en orden de necesidad)

| # | Herramienta | Para qué bot | Qué necesitas obtener |
|---|---|---|---|
| 1 | **Airtable** (Team plan si vas a automatizar vía API) | Base de todos | API key + Base ID + ID de cada tabla |
| 2 | **Railway** | Hospedar n8n | Cuenta + tarjeta de pago (plan Hobby/Pro) |
| 3 | **n8n** (self-hosted en Railway) | Orquestador de todos | URL de la instancia + credenciales admin |
| 4 | **Apollo.io** | Bot 1 (enriquecimiento) | API key (plan con acceso a API, no solo UI) |
| 5 | **Clay** | Bot 1 (enriquecimiento avanzado) | API key o integración nativa con n8n |
| 6 | **Instantly.ai** o **Smartlead** | Bot 2 | API key + 2-3 bandejas de correo conectadas |
| 7 | **Expandi.io** o **HeyReach** | Bot 3 | Conexión a la cuenta de LinkedIn de Andrea |
| 8 | **Calendly** (plan Standard mínimo, para embed sin marca) | Bot 4 + landing page | API key (opcional, para automatizar aún más) + Event Type URL |
| 9 | **Google Calendar / Google Workspace** | Bot 4 | Cuenta de servicio o OAuth conectado en n8n |
| 10 | **Anthropic Console (Claude API)** | Bot 2, Bot 6 | API key de producción, con billing activo |
| 11 | **WhatsApp Business API** (vía Twilio o 360dialog) *o* **Slack** | Bot 5, Bot 6 | Número verificado + token, o workspace de Slack + bot token |
| 12 | **ThomasNet / ImportGenius / LinkedIn Sales Navigator** | Bot 1 (fuente compradores EE. UU.) | Suscripciones activas; revisar sus Términos de Servicio antes de automatizar scraping — algunas prohíben scraping explícitamente y solo permiten su API oficial |
| 13 | **INDEX / CANACINTRA Nuevo León / Querétaro Aerocluster** | Bot 1 (fuente proveedores MX) | La mayoría son directorios públicos; validar si requieren membresía para acceso completo |

### Costo mensual aproximado (etapa inicial, mes 1-6)

| Herramienta | Rango mensual (USD) |
|---|---|
| Railway (n8n self-hosted) | $5–20 |
| Airtable (Team) | $20–24/usuario |
| Apollo.io | $49–99 |
| Clay | $149+ (plan Starter) |
| Instantly.ai / Smartlead | $37–97 |
| Expandi.io / HeyReach | $99 |
| Calendly Standard | $10–12 |
| Claude API (uso variable) | $20–80 según volumen |
| WhatsApp Business (Twilio) o Slack | $0–30 |
| **Total aproximado** | **≈ $400–600/mes** |

Esto valida por qué el modelo cobra el fee de arranque al comprador de EE. UU.: cubre
holgadamente el costo operativo del sistema desde el primer cliente cerrado.

---

## 3. Por qué Railway (y no Vercel) para n8n

n8n es un proceso de larga duración con su propia base de datos (workflows, historial
de ejecuciones, credenciales cifradas) — no es una función serverless. Vercel está
diseñado para funciones de corta duración y sitios estáticos (como la landing page),
así que **no** es donde debe vivir n8n.

Pasos para desplegar n8n en Railway:

1. Railway → *New Project* → *Deploy a template* → busca **"n8n"** en la galería de
   templates oficiales (incluye Postgres para persistencia).
2. Railway aprovisiona automáticamente:
   - Un servicio `n8n` (la app).
   - Un servicio `Postgres` (base de datos de workflows/credenciales).
3. Variables de entorno mínimas a revisar/configurar en el servicio `n8n`:
   - `N8N_BASIC_AUTH_ACTIVE=true` + `N8N_BASIC_AUTH_USER` / `N8N_BASIC_AUTH_PASSWORD`
     (o mejor, activar SSO/2FA si tu plan de n8n lo permite).
   - `N8N_ENCRYPTION_KEY` (genera una clave larga y guárdala aparte — sin ella no
     puedes restaurar credenciales si migras de instancia).
   - `WEBHOOK_URL` = la URL pública que Railway asigna a tu servicio (necesaria para
     que Instantly, Expandi, Calendly, etc. puedan mandarle webhooks a n8n).
   - `GENERIC_TIMEZONE=America/Mexico_City` (para que los triggers de las 6:00 AM y
     6:00 PM del documento 3 corran en el huso horario correcto).
4. Railway → Settings → *Generate Domain* para obtener la URL pública HTTPS de n8n.
5. Entra a esa URL, crea el usuario admin, y empieza a dar de alta las credenciales
   de cada herramienta (Airtable, Apollo, Claude API, etc.) dentro de n8n antes de
   construir el primer flujo.
6. Activa backups automáticos del servicio Postgres en Railway (Settings → Backups) —
   ahí vive todo tu trabajo de automatización.

---

## 4. Esquema de base de datos en Airtable

Una sola base ("Arzen CRM") con al menos estas tablas:

**Tabla `Prospectos`**
| Campo | Tipo |
|---|---|
| Nombre | Texto |
| Empresa | Texto |
| Cargo | Texto |
| País/Geografía | Selección única: `Texas` / `Querétaro` / `Nuevo León` |
| Idioma | Selección única: `EN` / `ES` |
| Email | Email |
| LinkedIn URL | URL |
| Etapa | Selección única — **debe ser exactamente** la lista del documento 3: `Nuevo` → `Contactado` → `Respondió` → `Llamada agendada` → `Propuesta enviada` → `Contrato firmado` → `Cliente activo` → `Reorden recurrente` |
| Fuente | Selección única: `ThomasNet` / `Sales Navigator` / `ImportGenius` / `INDEX` / `CANACINTRA` / `Querétaro Aerocluster` / `Google Maps` |
| Fecha último contacto | Fecha |
| Días en etapa actual | Fórmula (`DATETIME_DIFF(TODAY(), {Fecha cambio de etapa}, 'days')`) — para la auditoría semanal |
| Historial de mensajes | Texto largo o vínculo a tabla `Interacciones` |
| Notas de Andrea | Texto largo |

**Tabla `Interacciones`** (opcional pero recomendable en vez de un solo campo de texto)
| Campo | Tipo |
|---|---|
| Prospecto | Vínculo a `Prospectos` |
| Canal | `Email` / `LinkedIn` / `Llamada` |
| Dirección | `Saliente` / `Entrante` |
| Contenido | Texto largo |
| Fecha | Fecha/hora |

**Vista automatizada clave:** un filtro "Estancados +10 días" (`Días en etapa actual`
≥ 10) que alimenta la auditoría semanal del domingo del documento 3.

---

## 5. Los 6 bots — checklist de construcción en n8n

Para cada bot: trigger → lógica → salida. Constrúyelos en este orden y prueba cada
uno de forma aislada antes de conectarlo al siguiente.

### Bot 1 — Búsqueda diaria de leads
- [ ] Trigger: **Schedule Trigger** en n8n, cron `0 6 * * 1-5` (America/Mexico_City).
- [ ] Nodo(s) de fuente: HTTP Request a las APIs de ThomasNet/ImportGenius/Sales
      Navigator (o el conector que ofrezcan), + scraping autorizado de directorios MX.
- [ ] Nodo Apollo/Clay: enriquecer cada resultado nuevo.
- [ ] Nodo Airtable: `Create Record` con estatus `Nuevo — sin contactar`.
- [ ] Alerta si el conteo diario cae por debajo de 40 prospectos (umbral del documento 3).

### Bot 2 — Outbound por correo
- [ ] Trigger: **Airtable Trigger** (o polling) sobre cambio a estatus `Listo para
      contacto`.
- [ ] Nodo Claude API (Anthropic): genera la primera línea de personalización a
      partir de los campos del prospecto — nunca dejar pasar un registro sin esa línea.
- [ ] Nodo Instantly/Smartlead: inscribe al prospecto en la secuencia de 3 correos
      (plantilla EN o ES según el campo `Idioma`), espaciado 3-4 días.
- [ ] Webhook de respuesta → nodo que saca al prospecto de la secuencia y actualiza
      Airtable a `Respondió` + dispara Bot 5.
- [ ] Límite: máx. 40-50 correos nuevos/bandeja/día — configúralo en la herramienta
      de envío, no confíes solo en el volumen que produce Bot 1.

### Bot 3 — Outbound en LinkedIn
- [ ] Trigger: mismo cambio de estatus que Bot 2, pero solo si el prospecto tiene
      `LinkedIn URL` válida.
- [ ] Nodo Expandi/HeyReach: solicitud de conexión personalizada + 2 mensajes de
      seguimiento (3-5 días de espaciado).
- [ ] Límite duro: 15-20 solicitudes nuevas/día — configurado en la herramienta, con
      alerta en n8n si se acerca al tope (no solo que falle en silencio).
- [ ] Regla de contenido: el mensaje de LinkedIn nunca debe ser un duplicado del
      correo del mismo prospecto — usa una plantilla distinta.

### Bot 4 — Agenda automática de llamadas
- [ ] Trigger: webhook de respuesta positiva (palabras clave: `interested`, `send
      more info`, `sí, cuéntame más`, etc. — mantener esta lista como nodo de
      configuración, no hardcodeada, para poder ampliarla).
- [ ] Nodo: responde automáticamente con el link de Calendly.
- [ ] Webhook de Calendly (`invitee.created`) → crea evento en Google Calendar +
      actualiza Airtable a `Llamada agendada` + dispara Bot 6 con el tiempo calculado
      (2 horas antes de la llamada).
- [ ] Notifica a Andrea inmediatamente (dispara Bot 5).

### Bot 5 — Notificaciones y recordatorios
- [ ] Sub-flujo reutilizable (no un bot aislado) que reciben Bot 2, 3, 4 y 6.
- [ ] Notificación inmediata por WhatsApp/Slack en cualquier respuesta entrante.
- [ ] Recordatorios: **Schedule Trigger** que revisa llamadas agendadas y dispara a
      T-24h y T-1h.
- [ ] Resumen diario: cron `0 18 * * *` con conteo de prospectos nuevos, correos
      enviados, respuestas y llamadas del día siguiente (query a Airtable).
- [ ] Alerta de estancamiento: cron semanal domingo por la noche sobre la vista
      "Estancados +10 días" de Airtable.

### Bot 6 — Reporte pre-reunión con IA
- [ ] Trigger: calculado por Bot 4 (2 horas antes de cada llamada agendada) —
      en n8n esto se resuelve con un nodo **Wait** o un segundo Schedule Trigger que
      consulta Airtable por llamadas en la ventana de 2 horas.
- [ ] Nodo Claude API: compila resumen del prospecto, historial completo (de la
      tabla `Interacciones`), señales públicas relevantes, y 3-4 preguntas de
      descubrimiento basadas en el guion de 15 minutos.
- [ ] Formato de salida: una sola página, enviada por correo y WhatsApp a Andrea.

---

## 6. Salvaguardas — configurar ANTES de encender los bots en modo producción

Estas reglas del documento 3 se implementan como **validaciones dentro de los flujos
de n8n**, no como buenas intenciones:

- [ ] Nodo de validación en Bot 2 y Bot 3 que **bloquea el envío** si el campo de
      personalización generado por Claude está vacío o es idéntico a un envío previo.
- [ ] Contadores diarios (Airtable o una tabla de control en n8n) que **detienen**
      el flujo de correo al llegar a 40-50/bandeja y el de LinkedIn a 15-20/día, con
      notificación a Andrea en vez de fallo silencioso.
- [ ] **Ningún nodo de n8n debe tener permiso de escribir precio, descuento, término
      de contrato o fecha de cierre** en ningún sistema — esos campos solo los edita
      Andrea manualmente en Airtable tras la llamada real.
- [ ] Calentamiento de dominio nuevo: antes de conectar Bot 2 en producción, corre
      2-3 semanas de calentamiento en Instantly/Smartlead (esto lo gestiona la
      herramienta, pero confírmalo activado explícitamente en su panel).

---

## 7. Orden de "iluminar" el sistema (go-live)

1. Bot 1 corriendo 5-7 días, solo alimentando Airtable, sin ningún canal de salida
   conectado — revisa manualmente la calidad de los prospectos.
2. Bot 2 activado con volumen reducido (10-15/día) durante el calentamiento de
   dominio, subiendo gradualmente hasta el tope de 40-50.
3. Bot 3 activado en paralelo, siempre por debajo de 20 solicitudes/día.
4. Bot 4 + Bot 5 activados en cuanto empiecen a llegar las primeras respuestas
   reales (no antes — probarlos sin datos reales no revela sus fallos típicos).
5. Bot 6 activado en cuanto haya al menos una llamada agendada real en el calendario.
6. Auditoría semanal (parte de Bot 5) activada desde el primer domingo con datos.

Con esto, en 3-4 semanas el sistema completo de los 6 bots debería estar operando
de forma semiautónoma, con Andrea interviniendo solo en respuestas calientes,
llamadas de cierre y negociación — exactamente como define el documento 3.
