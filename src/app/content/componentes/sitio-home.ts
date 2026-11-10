import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

/** Aviso de contenido provisional (cifras y testimonios hasta que Comunicación Social envíe los reales). */
const placeholderNote = `<div role="note" class="alert alert-warning alert-soft mt-4">${icon('triangle-alert', 20)}<span><strong>Contenido provisional.</strong> Las cifras y los textos de ejemplo no son reales. Se reemplazan cuando Comunicación Social envíe los datos.</span></div>`;

/* ── Section Header ────────────────────────────────────────────────────────── */

const sectionHeader = (title: string, text: string, center = false) => dedent(`
  <div class="flex max-w-180 flex-col gap-2 md:gap-3${center ? ' mx-auto items-center text-center' : ''}">
    <h2 class="text-2xl font-semibold text-base-content md:text-4xl md:font-bold">${title}</h2>
    <p class="text-base text-neutral-text md:text-lg">${text}</p>
  </div>
`);

export const encabezadoDeSeccion: ComponentDoc = {
  figmaNode: '59-102',
  intro: `<p>Título y descripción con que abre cada sección del Home. Sin etiqueta encima del título: el título se sostiene solo.</p>`,
  examples: [
    {
      title: 'Alineado a la izquierda',
      description: 'El tamaño cambia en 768 px: 24 px semibold en celular, 36 px bold en escritorio.',
      previewClass: 'p-6',
      html: sectionHeader('Cursos destacados', 'Programas con inscripción abierta, elegidos por su demanda entre servidores públicos.'),
    },
    {
      title: 'Centrado',
      previewClass: 'p-6',
      html: sectionHeader('Lo que dicen nuestros participantes', 'Servidores públicos que ya aplicaron lo aprendido en su institución.', true),
    },
  ],
  usage: {
    html: `<ul>
      <li>Título de una línea en escritorio; la descripción, de una o dos líneas. Ancho máximo 720 px (<code>max-w-180</code>).</li>
      <li>Centrado solo en secciones sin contenido alineado a la izquierda debajo (testimonios, preguntas frecuentes). En las demás, a la izquierda.</li>
      <li>Si la sección tiene un enlace «Ver todos», va aparte, a la derecha en escritorio y debajo de la cuadrícula en celular.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Encabezado:</strong> el título es <code>&lt;h2&gt;</code>; el H1 del Home está en el hero (oculto con <code>sr-only</code>).</li>
    <li><strong>Contraste:</strong> descripción en <code>neutral-text</code>, más de 7:1 en los dos temas.</li>
  </ul>`,
  classes: [
    ['flex max-w-180 flex-col gap-2 md:gap-3', 'Contenedor.'],
    ['text-2xl font-semibold md:text-4xl md:font-bold', 'Título (H4 en celular, H2 en escritorio).'],
    ['text-base text-neutral-text md:text-lg', 'Descripción.'],
    ['mx-auto items-center text-center', 'Variante centrada.'],
  ],
};

/* ── Course Type Card ──────────────────────────────────────────────────────── */

interface CourseType { icon: string; title: string; text: string; count: string }

const TYPES: CourseType[] = [
  { icon: 'award', title: 'Cursos con certificación', text: 'Valida tus competencias con un certificado oficial del INAP.', count: '48 cursos' },
  { icon: 'book-open', title: 'Cursos y diplomados', text: 'Actualízate con programas cortos y diplomados a tu ritmo.', count: '62 programas' },
  { icon: 'graduation-cap', title: 'Estudios de posgrado', text: 'Maestrías y especializaciones en administración pública.', count: '6 programas' },
  { icon: 'clipboard-check', title: 'Asesoría técnica', text: 'Investigación y acompañamiento para fortalecer tu institución.', count: 'Para instituciones' },
];

const courseTypeCard = (t: CourseType, plain = false) => dedent(`
  <article class="group relative flex h-full flex-col gap-4 rounded-box p-6 transition ${plain
    ? 'hover:bg-surface-subtle'
    : 'border border-base-content/10 bg-base-2 shadow-sm hover:border-primary-text hover:shadow-lg'}
                  has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-text">
    <span class="flex size-12 items-center justify-center rounded-md text-primary-text${plain ? '' : ' bg-primary-400/20'}">${icon(t.icon, 24)}</span>
    <div class="flex flex-1 flex-col gap-1.5">
      <h3 class="text-lg font-semibold text-base-content group-hover:text-primary-text">
        <a href="#" class="after:absolute after:inset-0 focus-visible:outline-none">${t.title}</a>
      </h3>
      <p class="text-sm text-neutral-text">${t.text}</p>
    </div>
    <p class="flex items-center gap-2 text-xs font-semibold text-primary-text">
      <span class="flex-1">${t.count}</span>${icon('arrow-right', 18)}
    </p>
  </article>
`);

export const tarjetaTipoDeCurso: ComponentDoc = {
  figmaNode: '61-63',
  intro: `<p>Tipo de formación del Home. Lleva al catálogo con el filtro de tipo aplicado. Dos estilos: <strong>Card</strong> (con borde y sombra) y <strong>Plain</strong> (sin caja, dentro del hero).</p>`,
  examples: [
    {
      title: 'Card',
      description: 'Pasen el cursor o lleguen con Tab para ver hover y foco.',
      previewClass: 'grid gap-6 p-6 sm:grid-cols-2 xl:grid-cols-4',
      html: TYPES.map(t => courseTypeCard(t)).join('\n\n'),
    },
    {
      title: 'Plain (hero)',
      description: 'Sin fondo, borde ni caja de ícono. En hover, surface-subtle marca la zona de clic.',
      previewClass: 'grid gap-6 p-6 sm:grid-cols-2 xl:grid-cols-4',
      html: TYPES.map(t => courseTypeCard(t, true)).join('\n\n'),
    },
  ],
  usage: {
    html: `<ul>
      <li>Cuatro tipos por audiencia. «Para ti» y «Para tu institución» muestran conjuntos distintos (ver Selector de audiencia).</li>
      <li>En celular las tarjetas van apiladas, una por fila.</li>
      <li>El conteo viene del catálogo (cursos publicados de ese tipo). Si el servicio no lo devuelve, el pie muestra solo la flecha.</li>
      <li>Toda la tarjeta es clicable con un solo enlace en el título, como la tarjeta de curso.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Un solo enlace:</strong> el nombre del enlace es el título; <code>after:absolute after:inset-0</code> amplía el área.</li>
    <li><strong>Foco:</strong> anillo de 2 px en <code>primary-text</code> con 2 px de separación, dibujado en la tarjeta con <code>has-[a:focus-visible]</code>.</li>
    <li><strong>Íconos:</strong> decorativos (<code>aria-hidden</code>).</li>
    <li><strong>Encabezado:</strong> <code>&lt;h3&gt;</code> bajo el H2 de la sección (o el H1 del hero).</li>
  </ul>`,
  classes: [
    ['rounded-box border border-base-content/10 bg-base-2 p-6 shadow-sm', 'Card.'],
    ['hover:border-primary-text hover:shadow-lg', 'Card en hover.'],
    ['rounded-box p-6 hover:bg-surface-subtle', 'Plain.'],
    ['size-12 rounded-md bg-primary-400/20 text-primary-text', 'Caja del ícono (solo Card).'],
    ['text-xs font-semibold text-primary-text', 'Conteo y flecha.'],
  ],
};

/* ── Area Card ─────────────────────────────────────────────────────────────── */

const AREAS: [string, string, string][] = [
  ['banknote', 'Finanzas públicas y calidad del gasto', '24 cursos'],
  ['scale', 'Ética, transparencia y probidad', '18 cursos'],
  ['users', 'Liderazgo y comunicación', '15 cursos'],
];

const areaCard = ([iconName, title, count]: [string, string, string]) => dedent(`
  <li>
    <a href="#" class="group flex items-center gap-4 border-b border-base-content/20 px-3 py-4.5 transition
                       hover:rounded-md hover:border-transparent hover:bg-base-content/10
                       focus-visible:rounded-md focus-visible:outline-offset-2">
      <span class="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-400/20 text-primary-text">${icon(iconName, 22)}</span>
      <span class="flex min-w-0 flex-1 flex-col gap-0.5">
        <span class="line-clamp-2 font-semibold text-base-content group-hover:text-primary-text">${title}</span>
        <span class="text-sm text-neutral-text">${count}</span>
      </span>
      ${icon('chevron-right', 20, 'shrink-0 text-base-content group-hover:text-primary-text')}
    </a>
  </li>
`);

export const tarjetaDeArea: ComponentDoc = {
  figmaNode: '67-1201',
  intro: `<p>Fila de la lista de áreas de formación. Es una lista con separadores, no una tarjeta con caja. Las nueve áreas usan el mismo color; el ícono las distingue.</p>`,
  examples: [
    {
      title: 'Lista de áreas',
      description: 'Pasen el cursor o lleguen con Tab para ver hover y foco.',
      previewClass: 'p-6',
      html: `<ul class="grid gap-x-6 md:grid-cols-2 xl:grid-cols-3">\n${AREAS.map(a => areaCard(a).replace(/^/gm, '  ')).join('\n')}\n</ul>`,
    },
  ],
  usage: {
    html: `<ul>
      <li>Tres columnas en escritorio, una en celular. Lleva al catálogo con el filtro de área aplicado.</li>
      <li>Nombre del área en dos líneas como máximo (<code>line-clamp-2</code>).</li>
      <li>Un color neutro para todas las áreas: reemplaza los colores por área del sitio actual.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Lista:</strong> <code>&lt;ul&gt;</code>; el lector anuncia «lista, 9 elementos».</li>
    <li><strong>Enlace:</strong> el nombre del enlace es el área más el conteo («Finanzas públicas y calidad del gasto 24 cursos»).</li>
    <li><strong>Foco:</strong> el anillo global en <code>primary-text</code>; la fila se redondea al enfocarse.</li>
    <li><strong>Hover:</strong> título en <code>primary-text</code> sobre <code>base-content/10</code>: 5,6:1 en claro.</li>
  </ul>`,
  classes: [
    ['border-b border-base-content/20 px-3 py-4.5', 'Fila.'],
    ['hover:rounded-md hover:border-transparent hover:bg-base-content/10', 'Hover.'],
    ['size-11 rounded-md bg-primary-400/20 text-primary-text', 'Caja del ícono (22 px).'],
    ['line-clamp-2 font-semibold', 'Nombre del área.'],
  ],
};

/* ── Stat ──────────────────────────────────────────────────────────────────── */

const STATS: [string, string][] = [
  ['+50 000', 'servidores públicos formados'],
  ['120', 'cursos al año'],
  ['340', 'instituciones atendidas'],
  ['45 años', 'formando al Estado'],
];

const stat = ([value, label]: [string, string], brand = false) => dedent(`
  <li class="flex flex-col gap-1${brand ? ' bg-brand-surface p-4' : ''}">
    <span class="text-4xl font-bold ${brand ? 'text-brand-surface-content' : 'text-primary-text'}">${value}</span>
    <span class="text-sm ${brand ? 'text-brand-surface-muted' : 'text-neutral-text'}">${label}</span>
  </li>
`);

export const estadistica: ComponentDoc = {
  figmaNode: '61-147',
  intro: `<p>Cifra destacada del Home. Dos superficies: <strong>Default</strong> y <strong>Brand</strong> (navy fijo).</p>${placeholderNote}`,
  examples: [
    {
      title: 'Default',
      description: 'Cuatro cifras: 2 × 2 en celular, una fila en escritorio.',
      previewClass: 'p-6',
      html: `<ul class="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">\n${STATS.map(s => stat(s).replace(/^/gm, '  ')).join('\n')}\n</ul>`,
    },
    {
      title: 'Brand',
      previewClass: 'p-6',
      html: `<ul class="grid grid-cols-2 gap-4 md:grid-cols-4">\n${STATS.map(s => stat(s, true).replace(/^/gm, '  ')).join('\n')}\n</ul>`,
    },
  ],
  usage: {
    html: `<ul>
      <li>Cifras <strong>provisionales</strong>: no se publican hasta que Comunicación Social confirme los datos.</li>
      <li>Número corto (máximo 7 caracteres) y etiqueta de 2 a 4 palabras en minúscula.</li>
      <li>Miles separados con espacio («50 000»), no con coma ni punto.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Lectura:</strong> cifra y etiqueta están en el mismo <code>&lt;li&gt;</code>, así el lector lee «+50 000 servidores públicos formados».</li>
    <li><strong>Sin encabezados:</strong> la cifra no es <code>&lt;h3&gt;</code>; es texto grande.</li>
    <li><strong>Contraste:</strong> <code>primary-text</code> y <code>neutral-text</code> pasan 4.5:1; en Brand, blanco y <code>brand-surface-muted</code> pasan 9:1.</li>
  </ul>`,
  classes: [
    ['text-4xl font-bold text-primary-text', 'Cifra.'],
    ['text-sm text-neutral-text', 'Etiqueta.'],
    ['bg-brand-surface p-4', 'Superficie Brand.'],
    ['text-brand-surface-content / text-brand-surface-muted', 'Cifra y etiqueta en Brand.'],
  ],
};

/* ── Testimonial ───────────────────────────────────────────────────────────── */

const testimonial = (initials: string, name: string, role: string, quote: string) => dedent(`
  <figure class="flex h-full flex-col gap-5 rounded-box border border-base-content/10 bg-base-2 p-7">
    <span class="text-5xl leading-8 font-bold text-accent-text" aria-hidden="true">“</span>
    <blockquote class="flex-1 text-base text-base-content">
      <p>${quote}</p>
    </blockquote>
    <figcaption class="flex items-center gap-3">
      <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-400/20 text-sm font-semibold text-primary-text" aria-hidden="true">${initials}</span>
      <span class="flex min-w-0 flex-col gap-0.5">
        <span class="text-sm font-semibold text-base-content">${name}</span>
        <span class="text-xs text-neutral-text">${role}</span>
      </span>
    </figcaption>
  </figure>
`);

export const testimonio: ComponentDoc = {
  figmaNode: '61-148',
  intro: `<p>Cita de un participante con su nombre y cargo.</p>${placeholderNote}`,
  examples: [
    {
      title: 'Tarjeta de testimonio',
      previewClass: 'grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-3',
      html: [
        testimonial('MG', 'María García', 'Analista, Ministerio de Finanzas Públicas', 'El diplomado me dio herramientas concretas para mejorar la planificación de mi unidad. Lo apliqué desde la primera semana.'),
        testimonial('JL', 'José López', 'Jefe de Recursos Humanos, municipalidad', 'Los módulos virtuales se adaptaron a mi horario y los docentes respondieron cada duda con ejemplos de mi trabajo.'),
      ].join('\n\n'),
    },
  ],
  usage: {
    html: `<ul>
      <li>Testimonios <strong>provisionales</strong> hasta que Comunicación Social envíe citas reales con autorización.</li>
      <li>Cita de 2 a 3 frases (unos 160 caracteres). Iniciales en lugar de foto, salvo que haya foto autorizada.</li>
      <li>Tres en escritorio; en celular se desplazan en horizontal (300 px de ancho).</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Estructura:</strong> <code>&lt;figure&gt;</code> con <code>&lt;blockquote&gt;</code> y <code>&lt;figcaption&gt;</code>: el lector asocia la cita con su autor.</li>
    <li><strong>Decoración:</strong> las comillas grandes y las iniciales llevan <code>aria-hidden</code>; el nombre ya está en texto.</li>
    <li><strong>Desplazamiento en celular:</strong> si la fila se desplaza, el contenedor lleva <code>tabindex="0"</code> y <code>aria-label</code> para poder moverla con el teclado.</li>
  </ul>`,
  classes: [
    ['rounded-box border border-base-content/10 bg-base-2 p-7', 'Tarjeta.'],
    ['text-5xl leading-8 font-bold text-accent-text', 'Comillas.'],
    ['size-11 rounded-full bg-primary-400/20 text-primary-text', 'Iniciales.'],
  ],
};

/* ── Audience Toggle ───────────────────────────────────────────────────────── */

const audienceToggle = (name: string, large = false, institution = false) => {
  const opt = (value: string, iconName: string, label: string, checked: boolean) => `
      <label class="flex cursor-pointer items-center rounded-full border-2 border-transparent font-semibold text-base-content transition
                    ${large ? 'gap-2.5 px-6 py-3 text-lg' : 'gap-2 px-5 py-2.5 text-sm'}
                    has-checked:border-primary-text has-checked:bg-base-2 has-checked:text-primary-text has-checked:shadow-sm
                    has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-text">
        <input type="radio" name="${name}" value="${value}" class="sr-only"${checked ? ' checked' : ''} />
        ${icon(iconName, large ? 20 : 18)}${label}
      </label>`;
  return dedent(`
    <fieldset class="inline-flex gap-1 rounded-full bg-base-content/10 ${large ? 'p-1.5' : 'p-1'}">
      <legend class="sr-only">¿Para quién buscas formación?</legend>${opt('persona', 'user', 'Para ti', !institution)}${opt('institucion', 'landmark', 'Para tu institución', institution)}
    </fieldset>
  `);
};

export const selectorDeAudiencia: ComponentDoc = {
  figmaNode: '59-72',
  intro: `<p>Cambia el hero entre servidores públicos («Para ti») e instituciones («Para tu institución»): texto, buscador y tipos de curso.</p>`,
  examples: [
    {
      title: 'Default',
      description: 'Funciona: hagan clic o usen las flechas del teclado.',
      html: [audienceToggle('audiencia-a'), audienceToggle('audiencia-b', false, true)].join('\n\n'),
    },
    {
      title: 'Large',
      description: 'En el hero de escritorio.',
      html: audienceToggle('audiencia-c', true),
    },
  ],
  usage: {
    html: `<ul>
      <li>Al cambiar de opción se actualizan el texto del hero, el marcador de posición del buscador («¿Qué necesita aprender tu equipo?» en Institución) y los cuatro tipos de curso. La página no cambia de URL.</li>
      <li>Large en escritorio; Default en celular, a todo el ancho.</li>
      <li>Recordar la última elección en <code>localStorage</code> es opcional; si se hace, el Home carga con esa opción.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Grupo de radios nativo:</strong> <code>&lt;fieldset&gt;</code> con <code>&lt;legend class="sr-only"&gt;</code> e <code>&lt;input type="radio"&gt;</code> ocultos con <code>sr-only</code>. Tab entra al grupo; las flechas cambian la opción.</li>
    <li><strong>Foco:</strong> el anillo se dibuja en la etiqueta con <code>has-focus-visible</code>.</li>
    <li><strong>Seleccionado:</strong> no depende solo del color: borde de 2 px, fondo blanco y sombra.</li>
    <li><strong>Cambio de contenido:</strong> el texto del hero cambia debajo del selector, así que no hace falta anunciarlo con <code>aria-live</code>.</li>
  </ul>`,
  classes: [
    ['inline-flex gap-1 rounded-full bg-base-content/10 p-1', 'Contenedor (p-1.5 en Large).'],
    ['rounded-full border-2 border-transparent px-5 py-2.5 text-sm font-semibold', 'Opción (px-6 py-3 text-lg en Large).'],
    ['has-checked:border-primary-text has-checked:bg-base-2 has-checked:text-primary-text has-checked:shadow-sm', 'Opción seleccionada.'],
    ['has-focus-visible:outline-2 has-focus-visible:outline-offset-2', 'Foco.'],
  ],
  codeNotes: `<p>En Angular, un <code>FormControl</code> o una señal enlazada a los dos radios con <code>[(ngModel)]</code>; el hero lee esa señal.</p>`,
};

/* ── Carousel ──────────────────────────────────────────────────────────────── */

const SLIDES: [string, string, string][] = [
  ['images/cursos/modernizacion.jpg', 'Curso de programación', 'Conoce, entiende y lleva a la práctica los aspectos de la programación de sistemas usando Python 3 para problemas reales.'],
  ['images/cursos/derechos-inclusion.jpg', 'Diplomado en Inteligencia Emocional en la Gestión Pública', 'Gestionar emociones, fortalecer relaciones y mejorar la toma de decisiones en la gestión pública.'],
  ['images/cursos/gestion-financiera.png', 'Curso Certificado en Administración Financiera', 'Planificación, presupuesto y control del gasto público con las herramientas del Estado.'],
  ['images/cursos/recursos-humanos.png', 'Curso Certificado para Profesionales de Recursos Humanos', 'Gestión del talento, evaluación del desempeño y normativa del servicio civil.'],
  ['images/cursos/derecho-administrativo.png', 'Introducción al Derecho Administrativo', 'Principios, actos y procedimientos de la administración pública guatemalteca.'],
];

/**
 * Posición de cada diapositiva respecto de la activa (la vista previa la actualiza al rotar):
 * prev = vecina izquierda (solo escritorio), current = activa, second = siguiente visible,
 * next = vecina derecha, rest = oculta. Las vecinas son `inert`.
 */
type SlidePos = 'prev' | 'current' | 'second' | 'next' | 'rest';
const POS_CLASS: Record<SlidePos, string> = {
  prev: 'hidden md:flex opacity-55',
  current: 'flex',
  second: 'flex',
  next: 'flex opacity-55',
  rest: 'hidden',
};

const slide = (i: number, pos: SlidePos) => {
  const [img, title, text] = SLIDES[i];
  const off = pos === 'prev' || pos === 'next' || pos === 'rest';
  return dedent(`
    <div data-slide="${i}" role="group" aria-roledescription="diapositiva" aria-label="${i + 1} de ${SLIDES.length}"${off ? ' inert' : ''}
         class="relative h-80 w-[calc(100%-4.5rem)] shrink-0 flex-col transition-opacity duration-500 motion-reduce:transition-none justify-end overflow-hidden rounded-xl p-5 md:h-86.5 md:w-[min(36.75rem,calc(50%-6.5rem))] md:p-6 ${POS_CLASS[pos]}">
      <img src="${img}" alt="" class="absolute inset-0 size-full object-cover" />
      <div class="absolute inset-0 bg-linear-to-b from-inap-brand-navy/10 via-inap-brand-navy/65 via-30% to-inap-brand-navy/85" aria-hidden="true"></div>
      <div class="relative flex flex-col gap-6 text-white">
        <div>
          <h2 class="text-[1.375rem]/7 font-semibold md:text-3xl">${title}</h2>
          <p class="line-clamp-3 text-sm md:text-base">${text}</p>
        </div>
        <a href="#" class="btn btn-lg self-start border-inap-brand-navy bg-white text-inap-brand-navy hover:bg-inap-neutral-100 focus-visible:outline-white md:btn-md">Más información<span class="sr-only">: ${title}</span></a>
      </div>
    </div>
  `);
};

const DOT_ON = 'block h-2 w-6 rounded-full bg-primary-text';
const DOT_OFF = 'block size-2 rounded-full bg-base-content/50 group-hover:bg-base-content/60';

const dot = (i: number, active = false) =>
  `<button type="button" data-carousel-dot="${i}" class="group flex size-11 items-center justify-center md:size-6${active ? ' md:w-8' : ''}" aria-label="Ir al curso ${i + 1}"${active ? ' aria-current="true"' : ''}>`
  + `<span class="${active ? DOT_ON : DOT_OFF}"></span></button>`;

const arrow = (dir: 'prev' | 'next') => `<button type="button" data-carousel-${dir} aria-label="${dir === 'prev' ? 'Curso anterior' : 'Curso siguiente'}"
          class="absolute top-1/2 ${dir === 'prev' ? 'left-9.5' : 'right-9.5'} hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-inap-brand-navy bg-white text-inap-brand-navy shadow-md hover:bg-inap-neutral-100 disabled:opacity-50 md:flex">${icon(dir === 'prev' ? 'chevron-left' : 'chevron-right', 24)}</button>`;

/** Orden inicial en el DOM: la última (vecina izquierda), la activa, la siguiente, la vecina derecha y el resto. */
const INITIAL: [number, SlidePos][] = [[4, 'prev'], [0, 'current'], [1, 'second'], [2, 'next'], [3, 'rest']];

const carousel = () => dedent(`
  <section data-carousel aria-roledescription="carrusel" aria-label="Cursos destacados" class="flex flex-col items-center gap-1 pt-4 md:gap-4 md:pt-6 md:pb-2">
    <div class="relative w-full overflow-hidden">
      <div data-carousel-track class="flex touch-pan-y gap-3 px-4 md:justify-center md:gap-4 md:px-0" aria-live="off">
        ${INITIAL.map(([i, pos]) => slide(i, pos).replace(/\n/g, '\n        ')).join('\n        ')}
      </div>
      ${arrow('prev')}
      ${arrow('next')}
    </div>
    <div class="flex items-center gap-1 md:gap-4">
      <div class="flex items-center">
        ${SLIDES.map((_, i) => dot(i, i === 0)).join('\n        ')}
      </div>
      <button type="button" data-carousel-toggle class="flex size-11 items-center justify-center md:size-8" aria-label="Pausar carrusel">
        <span class="flex size-8 items-center justify-center rounded-full border border-base-content">${icon('pause', 16)}</span>
      </button>
    </div>
  </section>
`);

/** Clases que cambian al rotar (las usa ui/example/carousel-demo.ts). */
export const CAROUSEL_CLASSES = { pos: POS_CLASS, dotOn: DOT_ON, dotOff: DOT_OFF };

export const carrusel: ComponentDoc = {
  figmaNode: '111-4722',
  intro: `<p>Cursos destacados en la parte superior del Home. Rota sola y siempre tiene botón de pausa. El equipo usa <code>p-carousel</code> de PrimeNG: esta página muestra la apariencia y el comportamiento que debe tener.</p>`,
  examples: [
    {
      title: 'Hero carousel',
      description: 'Funciona: rota cada 6 segundos, se detiene con el cursor o el foco, y responde a flechas, puntos, pausa y deslizar con el dedo. En escritorio: dos diapositivas centradas, vecinas al 55 % y flechas. En celular (menos de 768 px): una diapositiva y la siguiente asomando, sin flechas, puntos de 44 px.',
      previewClass: 'py-2',
      html: carousel(),
    },
  ],
  usage: {
    html: `<ul>
      <li>De 3 a 5 cursos. Cada diapositiva: foto, título, descripción de una frase y «Más información».</li>
      <li>Rotación cada 6 segundos, circular. Se detiene al pasar el cursor, al recibir foco y al tocar en celular; se reanuda al salir, salvo que el usuario la haya pausado.</li>
      <li>Con <code>prefers-reduced-motion: reduce</code> empieza pausado.</li>
      <li>Degradado sobre la foto con el navy fijo de marca (<code>inap-brand-navy</code>), no con <code>secondary</code>, que en oscuro es azul claro.</li>
      <li>Botón y flechas blancos en los dos temas, para leerse sobre la foto.</li>
    </ul>`,
    doDont: [
      {
        doText: 'Botón de pausa visible junto a los indicadores.',
        dontText: 'Rotación automática sin forma de detenerla (falla WCAG 2.2.2).',
        doHtml: `<span class="flex size-8 items-center justify-center rounded-full border border-base-content">${icon('pause', 16)}</span>`,
        dontHtml: `<span class="flex gap-2"><span class="h-2 w-6 rounded-full bg-primary-text"></span><span class="size-2 rounded-full bg-base-content/50"></span><span class="size-2 rounded-full bg-base-content/50"></span></span>`,
      },
    ],
  },
  a11y: `<ul>
    <li><strong>Región:</strong> <code>&lt;section aria-roledescription="carrusel" aria-label="Cursos destacados"&gt;</code>; cada diapositiva, <code>role="group" aria-roledescription="diapositiva" aria-label="1 de 5"</code>.</li>
    <li><strong>Pausa (2.2.2):</strong> botón con <code>aria-label</code> «Pausar carrusel» / «Reanudar carrusel». Cambia el ícono y la etiqueta, no usa <code>aria-pressed</code>.</li>
    <li><strong>Anuncios:</strong> <code>aria-live="off"</code> mientras rota; <code>"polite"</code> cuando está pausado, para anunciar la diapositiva al usar flechas o puntos.</li>
    <li><strong>Diapositivas fuera de vista:</strong> <code>inert</code> (o <code>aria-hidden="true"</code> y <code>tabindex="-1"</code> en sus enlaces), para que Tab no llegue a enlaces ocultos.</li>
    <li><strong>Indicadores:</strong> botones con <code>aria-label="Ir al curso N"</code> y <code>aria-current="true"</code> en el activo. Punto visual de 8 px; área de 24 px en escritorio y 44 px en celular. Inactivo <code>base-content/50</code>: 3,4:1 en claro, 5,1:1 en oscuro (1.4.11).</li>
    <li><strong>Flechas:</strong> «Curso anterior» / «Curso siguiente», 48 × 48 px.</li>
    <li><strong>Enlace:</strong> «Más información» lleva el título en <code>sr-only</code> para distinguir un enlace de otro.</li>
    <li><strong>Texto sobre la foto:</strong> blanco sobre el degradado da al menos 5,2:1 aunque la foto sea blanca, porque el texto está por debajo del 30 % de la altura (navy al 65–85 %).</li>
    <li><strong>Foco sobre la foto:</strong> anillo blanco en el botón de la diapositiva.</li>
  </ul>`,
  classes: [
    ['h-80 md:h-86.5 rounded-xl p-5 md:p-6', 'Diapositiva (320 px celular, 346 px escritorio).'],
    ['w-[calc(100%-4.5rem)] md:w-[min(36.75rem,calc(50%-6.5rem))]', 'Ancho: 318 px en 390; 588 px en 1440.'],
    ['bg-linear-to-b from-inap-brand-navy/10 via-inap-brand-navy/65 via-30% to-inap-brand-navy/85', 'Degradado.'],
    ['btn btn-lg md:btn-md border-inap-brand-navy bg-white text-inap-brand-navy hover:bg-inap-neutral-100', 'Botón blanco.'],
    ['size-12 rounded-full border border-inap-brand-navy bg-white shadow-md', 'Flecha.'],
    ['h-2 w-6 bg-primary-text / size-2 bg-base-content/50', 'Indicador activo / inactivo.'],
    ['opacity-55', 'Diapositiva vecina.'],
  ],
  codeNotes: `<p>Con PrimeNG: <code>p-carousel</code> con <code>[circular]="true"</code>, <code>[numVisible]="2"</code> y <code>responsiveOptions</code> con 1 por debajo de 768 px. PrimeNG no trae botón de pausa: agréguenlo debajo, junto a los indicadores, y controlen <code>autoplayInterval</code> (0 = detenido). Las vecinas al 55 % se logran con <code>pt</code>/<code>styleClass</code> en los ítems no activos. Revisen que <code>aria-roledescription</code> y las etiquetas de los indicadores queden como arriba (PrimeNG los acepta por <code>pt</code> y <code>ariaLabel</code>).</p>
    <p>La vista previa funciona con un script de demostración que lee los atributos <code>data-carousel-*</code>. No es para la plataforma: ahí el comportamiento lo da <code>p-carousel</code> y los atributos no hacen falta.</p>`,
  snippets: [
    { title: 'Pausa con p-carousel', language: 'TypeScript', code: dedent(`
      readonly paused = signal(matchMedia('(prefers-reduced-motion: reduce)').matches);
      readonly interval = computed(() => (this.paused() ? 0 : 6000));

      togglePause(): void {
        this.paused.update(p => !p);
      }
    `) },
    { title: 'Plantilla', language: 'HTML', code: dedent(`
      <section aria-roledescription="carrusel" aria-label="Cursos destacados">
        <p-carousel [value]="cursos" [numVisible]="2" [numScroll]="1" [circular]="true"
                    [autoplayInterval]="interval()" [responsiveOptions]="responsive">
          <ng-template #item let-curso>…diapositiva…</ng-template>
        </p-carousel>
        <button type="button" (click)="togglePause()"
                [attr.aria-label]="paused() ? 'Reanudar carrusel' : 'Pausar carrusel'">…</button>
      </section>
    `) },
  ],
};
