# Páginas en español (para talleres proveedores). Solo hechos que Arzen ya declara públicamente.

PAGES = []

def add(**kw):
    kw.setdefault("lang", "es")
    PAGES.append(kw)

# ---------------------------------------------------------------- SERVICIOS
add(key="svc-hub-es", kind="hub", path="/es/servicios/", foot=None, order=0,
    title="Servicios para Talleres CNC en México | Arzen Industrial",
    desc="Únete a la red de Arzen: verificación en persona de tu taller, conexión con compradores aeroespaciales de EE. UU. y acompañamiento en tu primera orden.",
    h1="Servicios de Arzen para talleres CNC, tooling y estructuras en México", short="Todos los servicios",
    lede="Arzen verifica tu taller en persona y lo conecta con compradores aeroespaciales y de defensa en Estados Unidos. Aplicar y la visita de verificación no tienen costo para ti.",
    crumbs=[("Servicios", "/es/servicios/")],
    tldr=[("Para quién:", "talleres de maquinado CNC, tooling, fixtures y componentes estructurales en Querétaro y Nuevo León."),
          ("Sin costo:", "aplicar y la visita de verificación corren por nuestra cuenta."),
          ("Sin certificación obligatoria:", "no requerimos AS9100 ni NADCAP para entrar."),
          ("Cómo empezar:", "postúlate y respondemos en 1 día hábil.")],
    body="""
<h2>Qué hacemos por los talleres</h2>
<div class="card-grid">
  <a class="card" href="/es/servicios/unirse-a-la-red-de-proveedores/"><h3>Unirte a la red de proveedores</h3><p>Aplica sin costo y sin compromiso. Te explicamos el proceso de principio a fin.</p></a>
  <a class="card" href="/es/servicios/verificacion-de-taller/"><h3>Verificación de taller en persona</h3><p>Visitamos tu taller, confirmamos equipo, tolerancias y capacidad real.</p></a>
  <a class="card" href="/es/servicios/conexion-con-compradores-de-eeuu/"><h3>Conexión con compradores de EE. UU.</h3><p>Te presentamos solo con compradores cuyas piezas encajan con tu capacidad.</p></a>
</div>

<h2>Problemas que resolvemos</h2>
<table class="spec-table">
  <caption>Del problema al servicio</caption>
  <thead><tr><th scope="col">El problema</th><th scope="col">Dónde empezar</th></tr></thead>
  <tbody>
    <tr><th scope="row">Encontrar compradores de exportación por tu cuenta toma meses</th><td><a href="/es/servicios/conexion-con-compradores-de-eeuu/">Conexión con compradores</a></td></tr>
    <tr><th scope="row">Un comprador de EE. UU. no confía en un taller que no conoce</th><td><a href="/es/servicios/verificacion-de-taller/">Verificación en persona</a></td></tr>
    <tr><th scope="row">No sabes si necesitas AS9100 o NADCAP para vender</th><td><a href="/es/guias/as9100-nadcap-certificaciones/">Guía: AS9100 y NADCAP</a></td></tr>
    <tr><th scope="row">No sabes cómo preparar tu taller para exportar</th><td><a href="/es/guias/preparar-taller-exportar-eeuu/">Guía: preparar tu taller para exportar</a></td></tr>
  </tbody>
</table>

<h2>Compradores que buscamos para ti</h2>
<p>Aeroespacial y defensa en cualquier estado de EE. UU.: OEM y Tier 1/2, programas de defensa, MRO de aviación y sistemas espaciales y satelitales. Nos enfocamos en <b>tooling, fixtures y componentes estructurales secundarios</b>, no en piezas prime críticas de vuelo — por eso no necesitas un ciclo de certificación de 12 a 24 meses para entrar.</p>

<h2>Dónde trabajamos</h2>
<p>Verificamos talleres en <a href="/es/ubicaciones/queretaro/">Querétaro</a> y <a href="/es/ubicaciones/nuevo-leon/">Nuevo León</a>.</p>
""",
    related=["svc-join", "loc-hub-es", "contact-es"], faqs=[
        ("¿Cuánto cuesta postularme a la red de Arzen?", "Nada. No cobramos por aplicar ni por la visita de verificación. Ganamos una comisión sobre las órdenes reales que se generan una vez que un comprador te elige."),
        ("¿Arzen es un marketplace?", "No. Arzen es un filtro de verificación: visitamos tu taller en persona antes de presentarte con compradores de Estados Unidos."),
    ])

add(key="svc-join", kind="service", path="/es/servicios/unirse-a-la-red-de-proveedores/", foot="service", order=1,
    title="Red de Proveedores CNC en México: Únete sin Costo | Arzen",
    desc="Postula tu taller de CNC, tooling o estructuras en Querétaro o Nuevo León a la red verificada de Arzen. Sin costo, sin AS9100 ni NADCAP obligatorios.",
    h1="Únete a la red de proveedores de Arzen", short="Unirte a la red",
    lede="Si tu taller maquina CNC, tooling, fixtures o componentes estructurales en Querétaro o Nuevo León, puedes postularte a nuestra red de proveedores verificados. No cobramos por aplicar.",
    crumbs=[("Servicios", "/es/servicios/"), ("Unirte a la red", "/es/servicios/unirse-a-la-red-de-proveedores/")],
    tldr=[("Costo:", "$0 por postularte y por la visita de verificación."),
          ("Certificación:", "no requerimos AS9100 ni NADCAP para entrar al directorio."),
          ("Enfoque:", "tooling, fixtures y estructuras secundarias para aeroespacial y defensa."),
          ("Contacto:", "un punto de contacto de nuestro lado, desde la aplicación hasta tu primera orden.")],
    service={"name": "Red de proveedores verificados", "type": "Supplier network membership (no cost to suppliers)",
             "desc": "Red de talleres de maquinado CNC, tooling y componentes estructurales en Querétaro y Nuevo León verificados por Arzen y conectados con compradores de EE. UU."},
    body="""
<h2>A quién buscamos</h2>
<p>Talleres de maquinado CNC, tooling, fixtures y fabricación de componentes estructurales en <a href="/es/ubicaciones/queretaro/">Querétaro</a> y <a href="/es/ubicaciones/nuevo-leon/">Nuevo León</a>, enfocados o interesados en aeroespacial, defensa, MRO de aviación y sistemas espaciales — tengan o no certificaciones formales.</p>

<h2>Cómo funciona</h2>
<ol>
  <li><b>Aplicación.</b> Nos cuentas de tu taller: equipo, tolerancias, tamaños de pieza y clientes actuales.</li>
  <li><b>Visita de verificación.</b> Vamos a tu taller en persona a confirmar capacidad real. Sin costo para ti.</li>
  <li><b>Directorio verificado.</b> Entras al directorio y te conectamos con compradores que encajan contigo.</li>
  <li><b>Primera orden.</b> Te acompañamos en la cotización y en tu primera orden para arrancar bien la relación.</li>
</ol>

<h2>Qué te conviene tener listo</h2>
<ul>
  <li>Lista de equipo (máquinas, modelos) y equipo de inspección.</li>
  <li>Rango de tolerancias y tamaños de pieza que fabricas.</li>
  <li>Materiales con los que trabajas.</li>
  <li>Clientes actuales que puedan dar referencia.</li>
</ul>
<p>Para el detalle de la visita, lee <a href="/es/guias/visita-de-verificacion-que-esperar/">qué esperar de la visita de verificación</a>.</p>

<h2>Cómo ganamos nosotros</h2>
<p>No cobramos por aplicar ni por la visita. Ganamos una comisión sobre las órdenes reales que se generan una vez que un comprador te elige. Si no hay orden, tu taller no paga nada.</p>

<h2>Qué no prometemos</h2>
<p>Ser parte de la red no garantiza un volumen de órdenes. Presentamos tu taller solo con compradores cuyas piezas encajan con tu capacidad verificada.</p>
""",
    related=["svc-verif-es", "svc-buyers-es", "contact-es"], faqs=[
        ("¿Cuánto cuesta postularme a la red de Arzen?", "Nada. No cobramos por aplicar ni por la visita de verificación. Ganamos una comisión sobre las órdenes reales que se generan una vez que un comprador te elige."),
        ("¿Necesito certificación AS9100 o NADCAP para entrar?", "No. No requerimos AS9100, NADCAP ni ninguna certificación formal para entrar al directorio. Nos enfocamos en tooling, fixtures y componentes estructurales secundarios, no en piezas prime críticas de vuelo."),
        ("¿Qué tipo de talleres buscan en Querétaro y Nuevo León?", "Talleres de maquinado CNC, tooling, fixtures y fabricación de componentes estructurales, enfocados en aeroespacial, defensa, MRO de aviación y sistemas espaciales."),
        ("¿Cuánto tarda responderme Arzen?", "Respondemos en 1 día hábil."),
    ])

add(key="svc-verif-es", kind="service", path="/es/servicios/verificacion-de-taller/", foot="service", order=2,
    title="Verificación de Taller CNC en Persona | Arzen Industrial",
    desc="Arzen visita tu taller CNC en Querétaro o Nuevo León, confirma equipo, tolerancias y capacidad, y valida referencias para presentarte con compradores de EE. UU.",
    h1="Verificación de taller en persona", short="Verificación de taller",
    lede="Un perfil puede decir lo que sea. Nosotros pisamos el taller para saber qué es cierto: confirmamos tu equipo, tolerancias y capacidad real, y validamos tu historial con clientes actuales.",
    crumbs=[("Servicios", "/es/servicios/"), ("Verificación de taller", "/es/servicios/verificacion-de-taller/")],
    tldr=[("Qué es:", "una visita en persona a tu taller, sin costo para ti."),
          ("Qué confirmamos:", "equipo, tolerancias, capacidad y referencias."),
          ("Para qué:", "para poder presentarte con compradores serios de Estados Unidos."),
          ("Dónde:", "Querétaro y Nuevo León.")],
    service={"name": "Verificación de taller en persona", "type": "Supplier verification",
             "desc": "Visita en persona y verificación de talleres de maquinado CNC, tooling y estructuras en Querétaro y Nuevo León, sin costo para el taller."},
    body="""
<h2>Por qué verificamos</h2>
<p>Un comprador en EE. UU. no va a arriesgar su programa aeroespacial con un taller que encontró en un directorio genérico. Necesita saber que alguien ya pisó tu piso, revisó tu equipo y puede responder por ti. Ese "alguien" somos nosotros.</p>

<h2>Qué se revisa en la visita</h2>
<ul>
  <li><b>Visita en persona.</b> Ningún taller entra al directorio sin una visita física.</li>
  <li><b>Capacidad verificada.</b> Equipo, tolerancias y volumen confirmados en sitio.</li>
  <li><b>Referencias cruzadas.</b> Validamos tu historial con tus clientes actuales.</li>
</ul>

<h2>Qué obtienes</h2>
<p>Los resultados se documentan y entran a tu perfil verificado dentro de nuestro directorio. Con eso podemos <a href="/es/servicios/conexion-con-compradores-de-eeuu/">presentarte con compradores</a> cuyas piezas encajan contigo.</p>

<h2>Costo</h2>
<p>La visita de verificación corre por nuestra cuenta. No cobramos por aplicar ni por la visita.</p>

<h2>Cómo prepararte</h2>
<p>Lee la guía <a href="/es/guias/visita-de-verificacion-que-esperar/">qué esperar de la visita de verificación y cómo prepararte</a>. Para postularte, ve a <a href="/es/servicios/unirse-a-la-red-de-proveedores/">unirte a la red</a>.</p>
""",
    related=["svc-join", "guide-visita", "loc-queretaro-es"], faqs=[
        ("¿Qué pasa en la visita de verificación?", "Visitamos tu taller en persona, confirmamos tu equipo, tolerancias y capacidad real, y documentamos tu historial con clientes actuales."),
        ("¿La visita tiene costo?", "No. No cobramos por aplicar ni por la visita de verificación."),
        ("¿La verificación me garantiza órdenes?", "No. La verificación nos permite presentarte con compradores serios, pero las órdenes dependen de que tu capacidad encaje con las piezas del comprador."),
    ])

add(key="svc-buyers-es", kind="service", path="/es/servicios/conexion-con-compradores-de-eeuu/", foot="service", order=3,
    title="Conexión con Compradores Aeroespaciales de EE. UU. | Arzen",
    desc="Arzen presenta tu taller verificado con compradores aeroespaciales y de defensa de EE. UU. cuyas piezas encajan contigo, y te acompaña en la primera orden.",
    h1="Conexión con compradores aeroespaciales y de defensa de EE. UU.", short="Conexión con compradores",
    lede="Solo te presentamos con compradores cuyas piezas encajan con tu capacidad ya verificada, y te acompañamos en la cotización y en tu primera orden.",
    crumbs=[("Servicios", "/es/servicios/"), ("Conexión con compradores", "/es/servicios/conexion-con-compradores-de-eeuu/")],
    tldr=[("Quiénes son:", "equipos de compras de OEM y Tier 1/2, defensa, MRO de aviación y sistemas espaciales."),
          ("Cómo elegimos:", "por encaje con tu capacidad verificada, no con cualquiera."),
          ("Acompañamiento:", "cotización y primera orden."),
          ("Sin promesas vacías:", "no garantizamos volumen de órdenes.")],
    service={"name": "Conexión con compradores de EE. UU.", "type": "Buyer matching for verified suppliers",
             "desc": "Conexión de talleres verificados en Querétaro y Nuevo León con compradores aeroespaciales y de defensa de EE. UU."},
    body="""
<h2>Con quién te conectamos</h2>
<ul>
  <li><b>OEM aeroespacial y Tier 1/2:</b> tooling y componentes estructurales secundarios.</li>
  <li><b>Defensa y sistemas militares:</b> tooling de precisión y piezas estructurales para programas de manufactura de defensa.</li>
  <li><b>MRO de aviación:</b> tooling de reemplazo y componentes para mantenimiento y overhaul.</li>
  <li><b>Sistemas espaciales y satelitales:</b> tooling de apoyo en tierra y componentes estructurales.</li>
</ul>

<h2>Cómo hacemos el match</h2>
<p>Un comprador nos cuenta su pieza, tolerancias, certificaciones y volumen. Buscamos entre los talleres que ya visitamos y solo presentamos los que encajan. Tu taller no entra en la conversación si la pieza no es para ti.</p>

<h2>Cotización y primera orden</h2>
<p>Te acompañamos en la cotización y en tu primera orden para que la relación con el comprador arranque bien. Muchos compradores piden una muestra física antes de comprometer un lote de producción; es una práctica normal y te conviene estar listo para ella.</p>

<h2>Qué debes saber</h2>
<ul>
  <li>No cobramos por aplicar ni por la visita. Ganamos una comisión sobre las órdenes reales.</li>
  <li>No garantizamos volumen ni calendario de órdenes.</li>
  <li>Nos enfocamos en tooling, fixtures y estructuras secundarias, no en piezas prime críticas de vuelo.</li>
</ul>
""",
    related=["svc-join", "svc-verif-es", "guide-exportar"], faqs=[
        ("¿Cómo me conecta Arzen con compradores en Estados Unidos?", "Solo te presentamos con compradores cuyas piezas encajan con tu capacidad real, ya verificada. Te acompañamos en la cotización y en tu primera orden."),
        ("¿Me garantizan órdenes?", "No. Presentamos tu taller con compradores que encajan, pero el volumen depende de cada comprador y de tu capacidad."),
    ])

# ---------------------------------------------------------------- UBICACIONES
add(key="loc-hub-es", kind="hub", path="/es/ubicaciones/", foot=None, order=0, alt="loc-hub",
    title="Dónde Trabajamos: Querétaro y Nuevo León | Arzen",
    desc="Arzen verifica talleres CNC, tooling y estructuras en Querétaro y Nuevo León, México, y los conecta con compradores aeroespaciales de EE. UU.",
    h1="Dónde trabaja Arzen: Querétaro y Nuevo León, México", short="Todas las ubicaciones",
    lede="Arzen es un negocio de zona de servicio: visitamos y verificamos talleres en dos estados de México y servimos a equipos de compras en todo Estados Unidos.",
    crumbs=[("Ubicaciones", "/es/ubicaciones/")],
    tldr=[("Regiones:", "Querétaro y Nuevo León, México."),
          ("Compradores:", "equipos de compras en cualquier estado de EE. UU."),
          ("Cómo trabajamos:", "con cita — visitas en persona a talleres y llamadas con compradores."),
          ("Contacto:", "network@arzenindustrial.com")],
    body="""
<h2>Regiones donde verificamos talleres</h2>
<div class="card-grid">
  <a class="card" href="/es/ubicaciones/queretaro/"><h3>Querétaro</h3><p>Centro de México, una región establecida de manufactura aeroespacial.</p></a>
  <a class="card" href="/es/ubicaciones/nuevo-leon/"><h3>Nuevo León</h3><p>Noreste de México, área de Monterrey, la región más cercana a Texas.</p></a>
</div>

<h2>Servicios y ubicación</h2>
<table class="spec-table">
  <caption>Qué hacemos, y dónde</caption>
  <thead><tr><th scope="col">Servicio</th><th scope="col">Regiones</th></tr></thead>
  <tbody>
    <tr><th scope="row"><a href="/es/servicios/unirse-a-la-red-de-proveedores/">Unirte a la red</a></th><td>Querétaro · Nuevo León</td></tr>
    <tr><th scope="row"><a href="/es/servicios/verificacion-de-taller/">Verificación en persona</a></th><td>En tu taller</td></tr>
    <tr><th scope="row"><a href="/es/servicios/conexion-con-compradores-de-eeuu/">Conexión con compradores</a></th><td>Querétaro · Nuevo León → EE. UU.</td></tr>
  </tbody>
</table>

<h2>¿Tienen oficina?</h2>
<p>Trabajamos con cita y no publicamos una dirección de oficina de atención sin cita. Escríbenos a <a href="mailto:network@arzenindustrial.com">network@arzenindustrial.com</a> o <a href="/es/contacto/">postúlate aquí</a>.</p>
""",
    related=["svc-hub-es", "about-es", "contact-es"], faqs=[
        ("¿En qué estados verifica talleres Arzen?", "En Querétaro y Nuevo León."),
    ])

add(key="loc-queretaro-es", kind="location", path="/es/ubicaciones/queretaro/", foot="location", order=1, alt="loc-queretaro",
    title="Talleres CNC en Querétaro: Red de Proveedores | Arzen",
    desc="Postula tu taller CNC o de tooling en Querétaro a la red de Arzen. Visita de verificación sin costo y conexión con compradores aeroespaciales de EE. UU.",
    h1="Talleres CNC y de tooling en Querétaro: únete a la red de Arzen", short="Querétaro",
    lede="Si tu taller está en Querétaro, Arzen puede visitarlo, verificar tu capacidad y presentarte con compradores aeroespaciales y de defensa de EE. UU. Aplicar y la visita no tienen costo.",
    crumbs=[("Ubicaciones", "/es/ubicaciones/"), ("Querétaro", "/es/ubicaciones/queretaro/")],
    tldr=[("Región:", "estado de Querétaro, centro de México."),
          ("Qué buscamos:", "maquinado CNC, tooling, fixtures y estructuras secundarias."),
          ("Costo:", "sin costo por aplicar ni por la visita."),
          ("Certificación:", "AS9100 y NADCAP no son requisito.")],
    place={"name": "Querétaro", "sameAs": "https://es.wikipedia.org/wiki/Quer%C3%A9taro"},
    service={"name": "Verificación y conexión de talleres en Querétaro", "type": "Supplier verification and buyer matching",
             "desc": "Verificación en persona de talleres CNC, tooling y estructuras en Querétaro y conexión con compradores aeroespaciales de EE. UU."},
    body="""
<h2>Por qué Querétaro</h2>
<p>Querétaro es una región establecida de manufactura aeroespacial en el centro de México, con cadenas de suministro de maquinado de precisión. Para un comprador de EE. UU. la pregunta es la misma que en cualquier lugar: ¿qué taller puede mantener mi tolerancia y cumplir mi fecha? Nosotros lo verificamos en persona.</p>

<h2>Qué hacemos en Querétaro</h2>
<ul>
  <li>Visitamos tu taller y confirmamos equipo, tolerancias y capacidad en sitio.</li>
  <li>Validamos tu historial con tus clientes actuales.</li>
  <li>Te <a href="/es/servicios/conexion-con-compradores-de-eeuu/">presentamos con compradores</a> cuyas piezas encajan contigo.</li>
  <li>Te acompañamos en la cotización y la primera orden.</li>
</ul>

<h2>Cómo postularte</h2>
<p>Cuéntanos de tu taller: equipo, tolerancias, tamaños de pieza y clientes actuales. Empieza en <a href="/es/servicios/unirse-a-la-red-de-proveedores/">unirte a la red</a> o directamente en <a href="/es/contacto/">contacto</a>. Respondemos en 1 día hábil.</p>

<h2>Otra región</h2>
<p>También verificamos talleres en <a href="/es/ubicaciones/nuevo-leon/">Nuevo León</a>.</p>
""",
    related=["svc-join", "svc-verif-es", "loc-nuevo-leon-es"], faqs=[
        ("¿Tiene costo postular mi taller de Querétaro?", "No. No cobramos por aplicar ni por la visita de verificación."),
        ("¿Visitan talleres en toda la ciudad y el estado?", "Visitamos talleres en Querétaro. Cuéntanos dónde estás y coordinamos la visita con cita."),
    ])

add(key="loc-nuevo-leon-es", kind="location", path="/es/ubicaciones/nuevo-leon/", foot="location", order=2, alt="loc-nuevo-leon",
    title="Talleres CNC en Nuevo León y Monterrey | Arzen Industrial",
    desc="Postula tu taller CNC o de tooling en Nuevo León y el área de Monterrey a la red de Arzen. Sin costo y con conexión a compradores aeroespaciales de EE. UU.",
    h1="Talleres CNC y de tooling en Nuevo León (Monterrey): únete a la red", short="Nuevo León",
    lede="Si tu taller está en Nuevo León o el área de Monterrey, Arzen puede visitarlo, verificar tu capacidad y presentarte con compradores aeroespaciales y de defensa de EE. UU.",
    crumbs=[("Ubicaciones", "/es/ubicaciones/"), ("Nuevo León", "/es/ubicaciones/nuevo-leon/")],
    tldr=[("Región:", "estado de Nuevo León, noreste de México (área de Monterrey)."),
          ("Qué buscamos:", "maquinado CNC, tooling, fixtures y estructuras secundarias."),
          ("Costo:", "sin costo por aplicar ni por la visita."),
          ("Certificación:", "AS9100 y NADCAP no son requisito.")],
    place={"name": "Nuevo León", "sameAs": "https://es.wikipedia.org/wiki/Nuevo_Le%C3%B3n"},
    service={"name": "Verificación y conexión de talleres en Nuevo León", "type": "Supplier verification and buyer matching",
             "desc": "Verificación en persona de talleres CNC, tooling y estructuras en Nuevo León y conexión con compradores aeroespaciales de EE. UU."},
    body="""
<h2>Por qué Nuevo León</h2>
<p>Nuevo León, con el área metropolitana de Monterrey como eje, tiene una base industrial amplia y es la más cercana a Texas de las dos regiones donde trabajamos. Para un comprador de EE. UU., esa cercanía importa; igual de importante es saber si tu taller puede mantener su tolerancia. Eso lo verificamos en persona.</p>

<h2>Qué hacemos en Nuevo León</h2>
<ul>
  <li>Visitamos tu taller y confirmamos equipo, tolerancias y capacidad en sitio.</li>
  <li>Validamos tu historial con tus clientes actuales.</li>
  <li>Te <a href="/es/servicios/conexion-con-compradores-de-eeuu/">presentamos con compradores</a> cuyas piezas encajan contigo.</li>
  <li>Te acompañamos en la cotización y la primera orden.</li>
</ul>

<h2>Cómo postularte</h2>
<p>Empieza en <a href="/es/servicios/unirse-a-la-red-de-proveedores/">unirte a la red</a> o en <a href="/es/contacto/">contacto</a>. Respondemos en 1 día hábil.</p>

<h2>Otra región</h2>
<p>También verificamos talleres en <a href="/es/ubicaciones/queretaro/">Querétaro</a>.</p>
""",
    related=["svc-join", "svc-verif-es", "loc-queretaro-es"], faqs=[
        ("¿Tiene costo postular mi taller de Nuevo León?", "No. No cobramos por aplicar ni por la visita de verificación."),
        ("¿Solo trabajan en Monterrey?", "Trabajamos en Nuevo León, con el área de Monterrey como referencia. Cuéntanos dónde está tu taller y lo coordinamos."),
    ])

# ---------------------------------------------------------------- GUÍAS
add(key="guide-hub-es", kind="hub", path="/es/guias/", foot=None, order=0,
    title="Guías para Talleres CNC que Quieren Exportar | Arzen",
    desc="Guías prácticas para talleres CNC en México que quieren vender a compradores aeroespaciales de EE. UU.: exportación, AS9100/NADCAP y verificación.",
    h1="Guías para talleres CNC que quieren exportar a EE. UU.", short="Todas las guías",
    lede="Respuestas cortas y prácticas a las dudas de los talleres antes de vender a compradores aeroespaciales y de defensa.",
    crumbs=[("Guías", "/es/guias/")],
    tldr=[("Para quién:", "talleres CNC, tooling y estructuras en México."),
          ("Temas:", "preparar tu taller, AS9100 y NADCAP, la visita de verificación."),
          ("Siguiente paso:", "postúlate sin costo.")],
    body="""
<h2>Todas las guías</h2>
<div class="card-grid">
  <a class="card" href="/es/guias/preparar-taller-exportar-eeuu/"><h3>Cómo preparar tu taller CNC para exportar a EE. UU.</h3><p>Qué revisan los compradores y cómo estar listo.</p></a>
  <a class="card" href="/es/guias/as9100-nadcap-certificaciones/"><h3>¿Necesitas AS9100 o NADCAP?</h3><p>Cuándo se exigen y cuándo no para tooling y estructuras secundarias.</p></a>
  <a class="card" href="/es/guias/visita-de-verificacion-que-esperar/"><h3>Qué esperar de la visita de verificación</h3><p>Cómo es la visita de Arzen y cómo prepararte.</p></a>
</div>
<h2>¿Prefieres hablar?</h2>
<p>Revisa los <a href="/es/servicios/">servicios</a> o <a href="/es/contacto/">postúlate como proveedor</a>. Respondemos en 1 día hábil.</p>
""",
    related=["svc-hub-es", "loc-hub-es", "contact-es"], faqs=[])

add(key="guide-visita", kind="guide", path="/es/guias/visita-de-verificacion-que-esperar/", foot="guide", order=3,
    title="Qué Esperar de la Visita de Verificación de Arzen",
    desc="Cómo es la visita de verificación de Arzen a tu taller CNC: qué se revisa, qué documentos tener listos y cómo prepararte. Sin costo para el taller.",
    h1="Qué esperar de la visita de verificación de Arzen (y cómo prepararte)", short="La visita de verificación",
    lede="La visita de verificación es lo que nos permite presentarte con compradores serios. Aquí está lo que revisamos y lo que te conviene tener listo.",
    crumbs=[("Guías", "/es/guias/"), ("La visita de verificación", "/es/guias/visita-de-verificacion-que-esperar/")],
    tldr=[("Costo:", "sin costo para tu taller."),
          ("Qué se revisa:", "equipo, tolerancias, capacidad y referencias."),
          ("Cómo prepararte:", "equipo, inspección, muestras y clientes de referencia a la mano."),
          ("Certificaciones:", "AS9100 y NADCAP no son requisito.")],
    published="2026-10-05",
    body="""
<h2>Qué revisamos</h2>
<ul>
  <li><b>Equipo.</b> Comparamos tu lista de equipo con las piezas que realmente produces.</li>
  <li><b>Tolerancias y capacidad.</b> Confirmamos en sitio las tolerancias documentadas, la capacidad y el volumen.</li>
  <li><b>Referencias.</b> Validamos tu historial con tus clientes actuales.</li>
  <li><b>Cómo trabajas.</b> Conversamos con quien dirige el taller y vemos cómo responden cuando algo sale mal.</li>
</ul>

<h2>Qué te conviene tener listo</h2>
<ul>
  <li>Lista de equipo con modelos, y el equipo de inspección con el que mides tus piezas.</li>
  <li>Muestras de piezas representativas, con su tolerancia.</li>
  <li>Materiales con los que trabajas habitualmente.</li>
  <li>Capacidad: turnos y volumen aproximado.</li>
  <li>Dos o tres clientes actuales que puedan dar referencia.</li>
  <li>Documentos de calidad que ya tengas, si los hay. No son obligatorios.</li>
</ul>

<h2>Qué no necesitas</h2>
<p>No necesitas AS9100, NADCAP ni ninguna certificación formal para entrar al directorio. Nos enfocamos en tooling, fixtures y componentes estructurales secundarios.</p>

<h2>Después de la visita</h2>
<p>Documentamos lo que encontramos y entras a tu perfil verificado. Solo te presentamos con compradores cuyas piezas encajan con tu capacidad, y te acompañamos en la <a href="/es/servicios/conexion-con-compradores-de-eeuu/">cotización y la primera orden</a>. Ser parte de la red no garantiza un volumen de órdenes.</p>

<h2>Siguiente paso</h2>
<p>Postúlate en <a href="/es/servicios/unirse-a-la-red-de-proveedores/">unirte a la red</a> o <a href="/es/contacto/">contáctanos</a>. Si aún estás evaluando exportar, lee <a href="/es/guias/preparar-taller-exportar-eeuu/">cómo preparar tu taller</a>.</p>
""",
    related=["svc-verif-es", "svc-join", "guide-exportar"], faqs=[
        ("¿Cuánto cuesta la visita de verificación?", "Nada. No cobramos por aplicar ni por la visita."),
        ("¿Qué pasa si no tengo todos los documentos?", "No hay problema. Ningún documento de certificación es obligatorio; lo importante es que podamos confirmar tu capacidad real en sitio."),
        ("¿Cuándo sabré si entré al directorio?", "Después de la visita documentamos lo que encontramos. Te contamos el resultado y, si encajas, cómo seguimos."),
    ])

# ---------------------------------------------------------------- NOSOTROS / CONTACTO
add(key="about-es", kind="about", path="/es/nosotros/", foot=None, order=0, alt="about",
    title="Sobre Arzen Industrial Group | Verificación de Talleres",
    desc="Quiénes somos, qué hacemos, dónde trabajamos y para quién: Arzen verifica en persona talleres CNC, tooling y estructuras en México para compradores de EE. UU.",
    h1="Sobre Arzen Industrial Group", short="Sobre Arzen",
    lede="Arzen verifica en persona talleres de maquinado CNC, tooling y componentes estructurales en Querétaro y Nuevo León y los conecta con compradores aeroespaciales y de defensa en Estados Unidos.",
    crumbs=[("Nosotros", "/es/nosotros/")],
    tldr=[("Quiénes:", "Arzen Industrial Group, fundada por Andrea Canabal."),
          ("Qué hacemos:", "verificación en persona, conexión con compradores y acompañamiento en la primera orden."),
          ("Dónde:", "talleres en Querétaro y Nuevo León; compradores en todo EE. UU."),
          ("Costo para talleres:", "$0 por aplicar y por la visita.")],
    body="""
<h2>Quiénes somos</h2>
<p>Arzen Industrial Group fue fundada por <b>Andrea Canabal</b>. Operamos en español e inglés, entre compradores de EE. UU. y talleres mexicanos. Arzen no es un marketplace ni una plataforma de cotización automática: somos el filtro de verificación entre tu taller y compradores que buscan proveedores reales, no perfiles.</p>

<h2>Qué hacemos</h2>
<ul>
  <li><a href="/es/servicios/verificacion-de-taller/">Verificación de tu taller en persona</a>.</li>
  <li><a href="/es/servicios/conexion-con-compradores-de-eeuu/">Conexión con compradores</a> cuyas piezas encajan con tu capacidad.</li>
  <li>Acompañamiento en la cotización y en tu primera orden.</li>
</ul>
<p>No fabricamos ni tenemos inventario.</p>

<h2>Dónde trabajamos</h2>
<p>Talleres en <a href="/es/ubicaciones/queretaro/">Querétaro</a> y <a href="/es/ubicaciones/nuevo-leon/">Nuevo León</a>. Compradores en todo Estados Unidos. Trabajamos con cita y no publicamos una dirección de oficina de atención sin cita.</p>

<h2>Para quién trabajamos</h2>
<p>Talleres de CNC, tooling, fixtures y estructuras, y compradores de OEM y Tier 1/2 aeroespacial, defensa, MRO de aviación y sistemas espaciales y satelitales.</p>

<h2>Problemas que resolvemos</h2>
<ul>
  <li>Encontrar compradores de exportación por tu cuenta toma meses y sin garantía de encaje.</li>
  <li>Sin verificación, un comprador de EE. UU. rara vez le da una primera orden a un taller que no conoce.</li>
  <li>Muchos brokers cobran comisiones altas sin transparencia.</li>
</ul>

<h2>Por qué Arzen</h2>
<ul>
  <li><b>Sin costo por aplicar</b> ni por la visita de verificación.</li>
  <li><b>Sin AS9100/NADCAP obligatorios</b> para entrar al directorio.</li>
  <li><b>Un punto de contacto</b> desde la aplicación hasta tu primera orden.</li>
</ul>

<h2>Contacto</h2>
<p>Escríbenos a <a href="mailto:network@arzenindustrial.com">network@arzenindustrial.com</a>, síguenos en <a href="https://www.linkedin.com/company/arzen-industrial-group/" rel="noopener">LinkedIn</a> o <a href="/es/contacto/">postúlate aquí</a>. Respondemos en 1 día hábil.</p>
""",
    related=["svc-hub-es", "loc-hub-es", "guide-hub-es"], faqs=[
        ("¿Arzen es un marketplace?", "No. Arzen es un filtro de verificación: visitamos tu taller en persona antes de presentarte con compradores."),
        ("¿En qué idiomas trabaja Arzen?", "En español e inglés."),
    ])

add(key="contact-es", kind="contact", path="/es/contacto/", foot=None, order=0, alt="contact", form="es",
    title="Contacto Arzen | Postula tu Taller como Proveedor",
    desc="Postula tu taller CNC, tooling o de estructuras a la red de Arzen. Sin costo y sin compromiso. Respondemos en 1 día hábil por correo o formulario.",
    h1="Contacto: postula tu taller a la red de Arzen", short="Contacto",
    lede="Cuéntanos de tu taller. Postularte y la visita de verificación no tienen costo ni compromiso. Respondemos en 1 día hábil.",
    crumbs=[("Contacto", "/es/contacto/")],
    tldr=[("Correo:", "network@arzenindustrial.com"),
          ("Respuesta:", "en 1 día hábil."),
          ("Idiomas:", "español e inglés."),
          ("Costo:", "$0 por postularte.")],
    body="""
<h2>Cómo contactarnos</h2>
<ul>
  <li><b>Correo:</b> <a href="mailto:network@arzenindustrial.com">network@arzenindustrial.com</a></li>
  <li><b>LinkedIn:</b> <a href="https://www.linkedin.com/company/arzen-industrial-group/" rel="noopener">Arzen Industrial Group</a></li>
  <li><b>Zona de servicio:</b> México (Querétaro, Nuevo León) y Estados Unidos. Trabajamos con cita.</li>
</ul>

<h2>Qué incluir</h2>
<p>Equipo, tolerancias, tamaños de pieza, materiales y clientes actuales. Más detalle en <a href="/es/guias/visita-de-verificacion-que-esperar/">qué esperar de la visita de verificación</a>.</p>

<h2>Postúlate como proveedor</h2>
<!--FORM-->
""",
    related=["svc-hub-es", "about-es", "guide-hub-es"], faqs=[
        ("¿Cuánto tarda en responder Arzen?", "Respondemos en 1 día hábil."),
        ("¿Postularme me compromete a algo?", "No. Postularte no tiene costo ni compromiso."),
    ])
