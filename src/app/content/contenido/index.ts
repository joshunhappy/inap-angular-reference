import { dedent } from '../../core/dedent';
import { emptyState } from '../componentes/sitio-catalogo';
import { STATES } from '../componentes/sitio-detalle-curso';
import { icon } from '../componentes/types';
import { PatternDoc } from '../patrones/types';

const table = (head: string[], rows: string[][]) => `<div class="doc-table-wrap"><table class="doc-table">
  <thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
  <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div>`;

/* ── Voz y tono ─────────────────────────────────────────────────────────────── */

const vozYTono: PatternDoc = {
  intro: `<p>INAP habla en la interfaz como una institución que acompaña a quien aprende: clara, cercana y respetuosa. La voz es la misma en la plataforma (Angular) y en el sitio institucional (WordPress); el tono cambia según el momento.</p>`,
  sections: [
    {
      id: 'principios',
      title: 'Principios',
      html: `<ul>
        <li><strong>Clara.</strong> Una idea por oración, con palabras de uso común. Decir qué pasa después: «Recibirás el acceso por correo».</li>
        <li><strong>Cercana.</strong> Se habla de tú y en segunda persona: «Completa tu perfil para inscribirte en cursos».</li>
        <li><strong>Respetuosa.</strong> Nunca culpa al usuario. Un error dice qué pasó y cómo corregirlo, sin tono de regaño.</li>
        <li><strong>Institucional, no burocrática.</strong> Sin frases como «Se le informa que…» o «Favor de…». Los términos legales solo cuando hacen falta (Transparencia), con una explicación corta.</li>
      </ul>`,
    },
    {
      id: 'tuteo',
      title: 'Tú y español de Guatemala',
      html: `<ul>
        <li><strong>Tú en toda la interfaz:</strong> «¿Qué quieres aprender hoy?», «Revisa tus datos». En el camino para instituciones, la persona sigue siendo tú: «¿Qué necesita aprender tu equipo?».</li>
        <li><strong>No mezclar tú y usted</strong> en la misma pantalla ni en el mismo flujo. Los textos de normas o documentos oficiales que se citan conservan su redacción.</li>
        <li><strong>Palabras de Guatemala:</strong> celular, DPI, correo, municipio, departamento.</li>
        <li><strong>Formatos:</strong> fechas DD/MM/AAAA (27/08/2026), hora de 24 horas (23:59), precios en quetzales con dos decimales (Q200.00).</li>
      </ul>`,
    },
    {
      id: 'palabras',
      title: 'Palabras que usamos',
      html: table(
        ['Usamos', 'En lugar de'],
        [
          ['Iniciar sesión', 'Login, Ingresar, Entrar'],
          ['Regístrate', 'Crear usuario, Sign up'],
          ['Cerrar sesión', 'Salir, Logout'],
          ['Correo', 'Email, e-mail, correo electrónico (salvo en etiquetas de campo largas)'],
          ['Contraseña', 'Clave, password'],
          ['Celular', 'Móvil, teléfono móvil'],
          ['Breadcrumb', 'Migas, migajas (en documentación; el usuario no ve la palabra)'],
          ['Aula Virtual', 'aula virtual, plataforma Moodle'],
          ['Inscribirme', 'Matricularme, Aplicar'],
          ['Edición (de un curso)', 'Cohorte, grupo, sección'],
        ],
      ),
    },
    {
      id: 'escritura',
      title: 'Mayúsculas y puntuación',
      html: `<ul>
        <li><strong>Mayúscula solo al inicio</strong> en títulos, botones y etiquetas: «Cursos destacados», no «Cursos Destacados». Los nombres propios conservan las suyas: INAP, Aula Virtual, Comunicación Social.</li>
        <li><strong>Sin punto final</strong> en títulos, botones, etiquetas y opciones. Con punto en oraciones completas: ayudas, mensajes y avisos.</li>
        <li><strong>Signos de apertura</strong> siempre: «¿Olvidaste tu contraseña?».</li>
        <li><strong>Comillas latinas</strong> para citar nombres de cursos o búsquedas: Te inscribiste en «Gestión pública por resultados».</li>
        <li><strong>Exclamaciones solo para plazos que vencen</strong>: «¡Último día para inscribirte!». Nunca en errores.</li>
        <li><strong>Números en cifras:</strong> «14 cursos», «Paso 1 de 2».</li>
      </ul>`,
    },
    {
      id: 'tono',
      title: 'El tono según el momento',
      html: table(
        ['Momento', 'Tono', 'Ejemplo'],
        [
          ['Explorar cursos', 'Cálido, invita', '«¿Qué quieres aprender hoy?»'],
          ['Confirmación', 'Breve, dice qué sigue', '«Te inscribiste en “Gestión pública por resultados”.»'],
          ['Error', 'Calmado, dice cómo corregir', '«El DPI tiene 13 dígitos. Revisa el número.»'],
          ['Plazo que vence', 'Directo, con fecha y hora', '«Cierra hoy a las 23:59»'],
          ['Datos personales', 'Explica para qué se piden', '«Datos para estadísticas», con una línea sobre su uso'],
          ['Sin resultados', 'Propone otro camino', '«Prueba quitar algún filtro o busca con otras palabras.»'],
        ],
      ),
      example: {
        title: 'Un error, dos formas de decirlo',
        description: 'La segunda culpa al usuario y no dice qué hacer.',
        previewClass: 'flex flex-col gap-3 p-6',
        html: dedent(`
          <div role="alert" class="alert alert-soft alert-error">${icon('circle-x')}<span>No pudimos procesar el pago. Intenta de nuevo o usa otra tarjeta.</span></div>
          <p class="text-sm text-neutral-text"><s>Error: datos de pago inválidos.</s></p>
        `),
      },
    },
  ],
  usedIn: [['Textos de la interfaz', 'contenido/textos-de-interfaz'], ['Formularios y errores', 'patrones/formularios']],
};

/* ── Textos de la interfaz ──────────────────────────────────────────────────── */

const textosDeInterfaz: PatternDoc = {
  intro: `<p>Los textos que se repiten en la plataforma, para escribirlos siempre igual. Salen de las plantillas y componentes de este sitio; si un texto cambia, se cambia aquí y en el componente.</p>`,
  sections: [
    {
      id: 'botones',
      title: 'Botones y enlaces',
      html: `<ul>
        <li><strong>Empiezan con un verbo</strong> y dicen qué pasa al pulsarlos: «Descargar diploma», no «Diploma» ni «Aceptar».</li>
        <li><strong>En primera persona</strong> cuando la acción es del usuario sobre sí mismo: «Inscribirme», «Avisarme cuando abra». En infinitivo en los demás casos: «Completar perfil», «Limpiar filtros».</li>
        <li><strong>Nunca</strong> «Clic aquí», «Ver más» sin contexto ni «Enviar» a secas. Si el enlace se repite en una lista, el nombre accesible incluye a qué lleva (ver <a href="componentes/tarjeta-de-curso">Tarjeta de curso</a>).</li>
      </ul>
      ${table(
        ['Texto', 'Dónde'],
        [
          ['Iniciar sesión / Regístrate', 'Barra principal y menú en celular, sin sesión'],
          ['Cerrar sesión', '«Mi cuenta»'],
          ['Inscribirme', 'Tarjeta y barra de inscripción'],
          ['Ver programa', 'Tarjeta de curso'],
          ['Ver todos', 'Encabezado de secciones del Home'],
          ['Limpiar filtros / Ver N cursos', 'Catálogo; hoja de filtros en celular'],
          ['Continuar / Regresar', 'Formularios por pasos'],
          ['Anterior / Siguiente', 'Paginación'],
          ['Compartir', 'Detalle de curso'],
        ],
      )}`,
    },
    {
      id: 'etiquetas-accesibles',
      title: 'Etiquetas para lectores de pantalla',
      html: `<p>Los botones de solo ícono y los controles que cambian de estado llevan <code>aria-label</code>. Dicen la acción y el objeto, sin la palabra «botón» (el lector ya la anuncia).</p>
      ${table(
        ['aria-label', 'Control'],
        [
          ['Saltar al contenido principal', 'Enlace para saltar (texto visible al enfocarlo)'],
          ['Cerrar menú · Cerrar aviso · Cerrar', 'Botón X del menú, de una alerta y de un diálogo'],
          ['Mostrar contraseña / Ocultar contraseña', 'Botón del ojo, con <code>aria-pressed</code>'],
          ['Pausar carrusel / Reanudar carrusel', 'Carrusel del Home'],
          ['Quitar filtro: {nombre}', 'Etiqueta de filtro activo'],
          ['Página 2', 'Número de la paginación'],
          ['Buscar', 'Botón de la lupa'],
        ],
      )}`,
    },
    {
      id: 'mensajes',
      title: 'Mensajes y avisos',
      html: `<ul>
        <li><strong>Error en un campo:</strong> dice cómo corregirlo. «El DPI tiene 13 dígitos. Revisa el número.»</li>
        <li><strong>Resumen de errores:</strong> «Revisa los 2 campos marcados», con enlaces a cada campo (ver <a href="patrones/formularios">Formularios y errores</a>).</li>
        <li><strong>Inicio de sesión fallido:</strong> «El correo o la contraseña no son correctos…». No dice cuál de los dos falló.</li>
        <li><strong>Cuenta deshabilitada:</strong> «Tu cuenta está deshabilitada. Para reactivarla, escríbenos desde la página de contacto.» con «Contactar a INAP».</li>
        <li><strong>Recuperar contraseña:</strong> «Si hay una cuenta con…». No revela si el correo está registrado.</li>
        <li><strong>Confirmaciones</strong> en pasado y con el nombre de lo que se hizo: «Te inscribiste en “Gestión pública por resultados”.»</li>
      </ul>`,
      example: {
        title: 'Avisos',
        description: 'Confirmación, información, advertencia y error.',
        previewClass: 'flex flex-col gap-3 p-6',
        html: dedent(`
          <div role="status" class="alert alert-soft alert-success">${icon('circle-check')}<span>Te inscribiste en «Gestión pública por resultados».</span></div>
          <div role="status" class="alert alert-soft alert-info">${icon('info')}<span>Esta edición inicia el 12/01/2027.</span></div>
          <div role="status" class="alert alert-soft alert-warning">${icon('triangle-alert')}<span>Tienes un saldo pendiente de Q100.00.</span></div>
          <div role="alert" class="alert alert-soft alert-error">${icon('circle-x')}<span>No pudimos procesar el pago. Intenta de nuevo.</span></div>
        `),
      },
    },
    {
      id: 'estados-vacios',
      title: 'Sin resultados',
      html: `<p>Un título que dice qué pasó, una línea con qué probar y una acción para salir. En búsquedas, el título repite lo que se buscó.</p>`,
      example: {
        title: 'Búsqueda sin resultados',
        previewClass: 'p-6',
        html: emptyState('No encontramos cursos para «gestion financiera»', 'Revisa la ortografía o prueba con menos palabras.', '<a href="#" class="btn btn-outline btn-primary btn-lg lg:btn-md">Ver todo el catálogo</a>'),
      },
    },
    {
      id: 'inscripcion',
      title: 'Estados de inscripción',
      html: `<p>Etiqueta, nota y acción de cada estado. Cuándo se usa cada uno, en <a href="patrones/estados-de-inscripcion">Estados de inscripción</a>.</p>
      ${table(
        ['Etiqueta', 'Nota (ejemplo)', 'Acción'],
        Object.values(STATES).map((s) => [s.badge, s.note, s.action]),
      )}`,
    },
    {
      id: 'buscador',
      title: 'Texto de ejemplo del buscador',
      html: table(
        ['Dónde', 'Texto'],
        [
          ['Barra de la plataforma (Angular)', 'Busca cursos, diplomados o temas'],
          ['Barra del sitio institucional (WordPress)', 'Busca noticias, eventos o páginas'],
          ['Home, «Para ti»', '¿Qué quieres aprender hoy?'],
          ['Home, «Para tu institución»', '¿Qué necesita aprender tu equipo?'],
        ],
      ) + `<p>El texto de ejemplo nunca reemplaza a la etiqueta: el campo conserva su nombre accesible.</p>`,
    },
    {
      id: 'cantidades',
      title: 'Cantidades, fechas y precios',
      html: `<ul>
        <li><strong>Singular y plural:</strong> «1 curso», «14 cursos». Con cero, el estado vacío en lugar de «0 cursos» cuando es el resultado principal.</li>
        <li><strong>Fechas:</strong> 27/08/2026 en datos; 24/08 cuando el año se sobreentiende (barra de inscripción). Rangos: «Inició el 27/08/2026 y termina el 05/09/2026».</li>
        <li><strong>Precios:</strong> Q200.00, y las cuotas aparte: «en 2 cuotas», «cuota 2 de 2».</li>
        <li><strong>Progreso y páginas:</strong> «Paso 1 de 2 · Tus datos», «Página 1 de 4».</li>
      </ul>`,
    },
  ],
  usedIn: [['Voz y tono', 'contenido/voz-y-tono'], ['Plantilla del Detalle de curso', 'plantillas/detalle-de-curso'], ['Plantilla del Catálogo', 'plantillas/catalogo']],
};

/* ── Contenido provisional ──────────────────────────────────────────────────── */

const contenidoProvisional: PatternDoc = {
  intro: `<p>Parte del contenido de Figma y de este sitio es de ejemplo. Sirve para diseñar y probar, pero no se publica tal cual: se reemplaza con el contenido real cuando Comunicación Social o DIFOGI lo entreguen, o viene de los datos de la plataforma.</p>`,
  sections: [
    {
      id: 'que-es-provisional',
      title: 'Qué es provisional',
      html: table(
        ['Contenido', 'Dónde aparece', 'De dónde sale el real'],
        [
          ['Estadísticas', 'Home', 'Comunicación Social. <strong>Pendiente:</strong> si serán editables o fijas.'],
          ['Testimonios', 'Home', 'Comunicación Social. <strong>Pendiente:</strong> si serán editables o fijos.'],
          ['Módulos y temas del programa', 'Detalle de curso', 'Comunicación Social o DIFOGI, con cada curso'],
          ['Conteos de cursos', 'Filtros, áreas de formación, resultados', 'Datos de la plataforma'],
          ['Áreas, tipos de curso y opciones de filtro', 'Catálogo, Home, menú', 'Datos de la plataforma'],
          ['Cursos, fechas, precios y docentes', 'Tarjetas, carrusel, detalle', 'Administración de cursos'],
          ['Fotos de los cursos', 'Tarjetas y encabezado del detalle', 'Cada curso; al menos 1600 × 760 px'],
          ['Estado «En curso»', 'Tarjeta de inscripción', 'Depende de que la edición guarde las fechas del curso'],
        ],
      ),
    },
    {
      id: 'reglas',
      title: 'Reglas',
      html: `<ul>
        <li><strong>Nada de listas fijas en el código:</strong> áreas, tipos de curso, opciones de filtro y conteos siempre vienen de los datos.</li>
        <li><strong>El contenido provisional va en datos</strong>, no escrito dentro de la plantilla, para reemplazarlo sin tocar el componente.</li>
        <li><strong>No se publican cifras ni testimonios de ejemplo.</strong> Si el contenido real no ha llegado, la sección no se muestra.</li>
        <li><strong>En la revisión</strong> de cada pantalla se confirma que el contenido provisional está marcado (ver <a href="primeros-pasos/revision">Revisión antes de entregar</a>).</li>
      </ul>`,
    },
    {
      id: 'en-este-sitio',
      title: 'En este sitio',
      html: `<p>Los ejemplos y plantillas usan cursos, fechas, precios, nombres de docentes y cifras inventados para mostrar cada estado. Las fotos son de ejemplo. Solo los textos de la interfaz (botones, mensajes, etiquetas) son los que se usan en la plataforma.</p>`,
    },
  ],
  usedIn: [['Plantilla del Home', 'plantillas/home'], ['Plantilla del Detalle de curso', 'plantillas/detalle-de-curso'], ['Revisión antes de entregar', 'primeros-pasos/revision']],
};

/** Páginas de Contenido, por slug. */
export const CONTENT_DOCS: Record<string, PatternDoc> = {
  'voz-y-tono': vozYTono,
  'textos-de-interfaz': textosDeInterfaz,
  'contenido-provisional': contenidoProvisional,
};
