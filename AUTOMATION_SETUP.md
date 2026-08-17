# Sistema de Automatización Comercial — Checklist de puesta en marcha

Basado en `Documento 3 — Sistema de Automatización Comercial`. Este documento traduce
la especificación de los 6 bots en una secuencia concreta de cuentas, credenciales y
pasos, en el orden en que conviene construirlos.

**Regla de oro que ya está en el documento y que no cambia:** ningún bot cierra,
negocia precio ni condiciones de contrato. Todo bot agenda, enriquece, escribe o
notifica — la llamada de cierre y la negociación son 100% humanas, siempre.

---

## 0. Antes de construir un solo bot

1. **Nombre legal y dominio funcionales confirmados** (Arzen Industrial Group /
   arzenindustrial.com) — ya resuelto.
2. **Cuenta de correo de outbound separada del correo principal** — nunca envíes
   secuencias frías desde `ac@arzenindustrial.com` directamente; ese dominio se
   protege para clientes ya en conversación. Usa un dominio "primo" solo para
   prospección fría, con 2-3 bandejas rotando.
3. **Cuenta de LinkedIn personal de Andrea** — Bot 3 opera sobre su perfil real.
4. **Presupuesto mensual aproximado para herramientas** antes de crear las cuentas.

---

## 1. Orden de implementación recomendado (4 fases)

### Fase A — Fundación de datos (semana 1)
Airtable (base de prospectos) + esquema de campos y pipeline. Cuenta de Apollo.io
+ Clay para enriquecimiento.

### Fase B — Orquestador + Bot 1 (semana 1-2)
n8n desplegado (Railway) o Make.com. Bot 1: búsqueda diaria de leads → Airtable.
Corre en modo de prueba una semana revisando manualmente los prospectos.

### Fase C — Canales de salida: Bot 2 + Bot 3 (semana 2-3)
Instantly.ai/Smartlead (correo) + Expandi.io/HeyReach (LinkedIn). Integración de
Claude API para personalización. Empieza con volumen bajo (10-15 correos/día).

### Fase D — Agenda, notificaciones y reportes: Bot 4, 5, 6 (semana 3-4)
Calendly + Google Calendar. WhatsApp Business API o Slack. Claude API para reportes
pre-reunión.

---

## 2. Cuentas y credenciales a crear

| # | Herramienta | Para qué bot | Qué necesitas obtener |
|---|---|---|---|
| 1 | **Airtable** | Base de todos | API key + Base ID |
| 2 | **Railway** | Hospedar n8n | Cuenta + tarjeta de pago |
| 3 | **n8n** (self-hosted en Railway) | Orquestador de todos | URL de instancia + admin |
| 4 | **Apollo.io** | Bot 1 (enriquecimiento) | API key con acceso a API |
| 5 | **Clay** | Bot 1 (enriquecimiento avanzado) | API key o integración con n8n |
| 6 | **Instantly.ai** o **Smartlead** | Bot 2 | API key + 2-3 bandejas conectadas |
| 7 | **Expandi.io** o **HeyReach** | Bot 3 | Conexión a LinkedIn de Andrea |
| 8 | **Calendly** (plan Standard mínimo) | Bot 4 + landing page | Event Type URL |
| 9 | **Google Calendar** | Bot 4 | OAuth conectado en n8n |
| 10 | **Anthropic Console (Claude API)** | Bot 2, Bot 6 | API key de producción |
| 11 | **WhatsApp Business API** o **Slack** | Bot 5, Bot 6 | Número/token o workspace |
| 12 | **ThomasNet / ImportGenius / Sales Navigator** | Bot 1 (EE. UU.) | Suscripciones activas; revisar Términos de Servicio antes de automatizar |
| 13 | **INDEX / CANACINTRA NL / Querétaro Aerocluster** | Bot 1 (MX) | Mayoría públicos; validar membresía |

### Costo mensual aproximado (mes 1-6)

| Herramienta | Rango mensual (USD) |
|---|---|
| Railway (n8n) | $5–20 |
| Airtable (Team) | $20–24/usuario |
| Apollo.io | $49–99 |
| Clay | $149+ |
| Instantly.ai / Smartlead | $37–97 |
| Expandi.io / HeyReach | $99 |
| Calendly Standard | $10–12 |
| Claude API | $20–80 |
| WhatsApp/Slack | $0–30 |
| **Total aproximado** | **≈ $400–600/mes** |

---

## 3. Por qué Railway (y no Vercel) para n8n

n8n es un proceso de larga duración con base de datos propia — Vercel solo sirve
funciones de corta duración y sitios estáticos.

1. Railway → *New Project* → *Deploy a template* → busca **"n8n"**.
2. Railway aprovisiona el servicio `n8n` + `Postgres`.
3. Variables de entorno clave: `N8N_BASIC_AUTH_ACTIVE`, `N8N_BASIC_AUTH_USER/PASSWORD`,
   `N8N_ENCRYPTION_KEY` (guárdala aparte), `WEBHOOK_URL`,
   `GENERIC_TIMEZONE=America/Mexico_City`.
4. Railway → Settings → *Generate Domain*.
5. Da de alta las credenciales de cada herramienta dentro de n8n antes de construir
   el primer flujo.
6. Activa backups automáticos del servicio Postgres.

---

## 4. Esquema de base de datos en Airtable

**Tabla `Prospectos`:** Nombre, Empresa, Cargo, Geografía, Idioma, Email, LinkedIn
URL, Etapa (`Nuevo → Contactado → Respondió → Llamada agendada → Propuesta enviada
→ Contrato firmado → Cliente activo → Reorden recurrente`), Fuente, Fecha último
contacto, Días en etapa actual (fórmula), Historial de mensajes, Notas.

**Tabla `Interacciones`:** Prospecto (vínculo), Canal, Dirección, Contenido, Fecha.

**Vista clave:** "Estancados +10 días" para la auditoría semanal.

---

## 5. Los 6 bots — checklist de construcción en n8n

### Bot 1 — Búsqueda diaria de leads
Schedule Trigger `0 6 * * 1-5` → fuentes EE. UU./MX → Apollo/Clay → Airtable
`Nuevo — sin contactar`. Alerta si el conteo diario cae bajo 40.

### Bot 2 — Outbound por correo
Trigger por cambio a `Listo para contacto` → Claude API genera personalización →
Instantly/Smartlead inscribe (3 correos, 3-4 días) → webhook de respuesta saca de
la secuencia y dispara Bot 5. Límite 40-50/bandeja/día.

### Bot 3 — Outbound en LinkedIn
Mismo trigger, solo si hay LinkedIn URL → Expandi/HeyReach, conexión + 2 mensajes
(3-5 días). Límite duro 15-20/día. Mensaje distinto al de correo.

### Bot 4 — Agenda automática de llamadas
Webhook de respuesta positiva (palabras clave configurables) → responde con
Calendly → webhook `invitee.created` → Google Calendar + Airtable `Llamada
agendada` + dispara Bot 6.

### Bot 5 — Notificaciones y recordatorios
Sub-flujo reutilizable: notificación inmediata, recordatorios T-24h/T-1h, resumen
diario `0 18 * * *`, alerta de estancamiento semanal (domingo).

### Bot 6 — Reporte pre-reunión con IA
2 horas antes de cada llamada → Claude API compila resumen + historial + señales
públicas + preguntas de descubrimiento → una página, correo y WhatsApp.

---

## 6. Salvaguardas — configurar ANTES de producción

- Bloqueo de envío si falta personalización real (Bot 2/3).
- Contadores diarios que detienen el flujo al llegar al límite, con notificación.
- Ningún nodo de n8n escribe precio, descuento o cierre — eso lo hace Andrea
  manualmente en Airtable.
- Calentamiento de dominio 2-3 semanas antes de producción en Bot 2.

---

## 7. Orden de "iluminar" el sistema (go-live)

1. Bot 1 solo, 5-7 días, sin canal de salida — revisión manual de calidad.
2. Bot 2 con volumen reducido durante calentamiento, subiendo a 40-50.
3. Bot 3 en paralelo, bajo 20/día.
4. Bot 4 + 5 en cuanto lleguen respuestas reales.
5. Bot 6 en cuanto haya una llamada agendada real.
6. Auditoría semanal desde el primer domingo con datos.
