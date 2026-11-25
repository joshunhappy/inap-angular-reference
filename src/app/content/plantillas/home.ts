import { dedent } from '../../core/dedent';
import { heroSearch } from '../componentes/sitio-busqueda';
import { courseCard, thumbPhoto } from '../componentes/sitio-cursos';
import {
  TYPES, areaCard, audienceToggle, carousel, courseTypeCard, sectionHeader, stat, testimonial,
} from '../componentes/sitio-home';
import { footer, navbarDesktop, navbarMobile } from '../componentes/sitio-navegacion';
import { icon } from '../componentes/types';

/*
  Plantilla del Home (Figma: Home / Desktop 64:2, Home / Mobile 477:10258).
  Compone los componentes del sitio con su mismo HTML; aquí solo se agrega el diseño de página
  (contenedor, espacios por sección y cambios entre celular y escritorio).
  Contenido de ejemplo hasta que Comunicación Social entregue el real.
*/

/** Sangra las líneas siguientes de un bloque insertado dentro de otra plantilla. */
const ind = (html: string, n: number) => html.replace(/\n/g, '\n' + ' '.repeat(n));

/** Contenedor de página: 1200 px de contenido en escritorio (120 px de margen a 1440), 16 px en celular. */
const WRAP = 'mx-auto w-full max-w-316 px-4 md:px-8';
/** Espacio vertical de sección: 48 px en celular, 96 px en escritorio. */
const SECTION = 'py-12 md:py-24';

/** Enlace de texto con flecha. En celular el área táctil llega a 44 px. */
const arrowLink = (label: string, extra = 'text-primary-text', lead = '') =>
  `<a href="#" class="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold hover:underline md:min-h-0 ${extra}">${lead}${label}${icon('arrow-right', 18)}</a>`;

/** Foco blanco para lo que va sobre azul oscuro (primary-text no llega a 3:1 ahí). */
const FOCUS_INV = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-surface-content';

/** Ondas de marca (brand/waves.svg), decorativas. */
const waves = (classes: string) =>
  `<img src="brand/waves.svg" alt="" width="1440" height="411" class="pointer-events-none absolute left-1/2 max-w-none -translate-x-1/2 ${classes}" />`;

/* ── Hero ───────────────────────────────────────────────────────────────────── */

const POPULAR = ['Gestión pública', 'Ética y transparencia', 'Finanzas públicas', 'Liderazgo'];

const hero = () => dedent(`
  <section aria-labelledby="home-titulo" class="relative overflow-hidden">
    ${waves('top-87.5 w-[184rem] opacity-15 md:top-60 md:w-[90rem] xl:w-full')}
    <div class="sr-only">
      <h1 id="home-titulo">Fórmate para servir mejor a Guatemala</h1>
      <p>Cursos, certificaciones, diplomados y posgrados en línea para servidores públicos y ciudadanía.</p>
    </div>
    ${ind(carousel('Cursos en portada'), 4)}
    <div class="${WRAP} relative flex flex-col gap-8 pt-4 pb-10 md:gap-6 md:pt-12 md:pb-12">
      <div class="flex flex-col gap-5 md:items-center md:gap-6">
        <div class="flex w-full flex-col gap-3 md:items-center lg:flex-row lg:items-start lg:justify-center lg:gap-6">
          ${ind(audienceToggle('home-audiencia', 'responsive'), 10)}
          <div data-home-search class="w-full lg:max-w-160 lg:flex-1">
            ${ind(heroSearch('home-buscar', 'responsive'), 12)}
          </div>
        </div>
        <div class="flex flex-col text-sm md:flex-row md:items-center md:gap-4">
          <p id="home-populares" class="text-neutral-text">Populares:</p>
          <ul aria-labelledby="home-populares" class="flex flex-wrap gap-x-4">
            ${POPULAR.map((l) => `<li><a href="#" class="inline-flex min-h-11 items-center rounded-sm font-medium text-primary-text underline hover:no-underline md:min-h-0">${l}</a></li>`).join('\n            ')}
          </ul>
        </div>
      </div>
      <ul class="grid sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        ${TYPES.map((t) => `<li>\n          ${ind(courseTypeCard(t, true), 10)}\n        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>
`);

/* ── Cifras ─────────────────────────────────────────────────────────────────── */

const STATS: [string, string][] = [
  ['+50 000', 'servidores públicos formados'],
  ['+300', 'instituciones del Estado atendidas'],
  ['9', 'áreas de formación especializada'],
  ['22', 'departamentos con participantes'],
];

const trustStrip = () => dedent(`
  <section aria-label="El INAP en cifras" class="bg-surface-subtle py-8 md:py-10">
    <ul class="${WRAP} grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-6">
      ${STATS.map((s) => ind(stat(s), 6)).join('\n      ')}
    </ul>
  </section>
`);

/* ── Cursos destacados ──────────────────────────────────────────────────────── */

const FEATURED: [string, string, string, string, string][] = [
  ['images/cursos/gestion-financiera-taller.jpg', 'Con certificación', 'Curso y Certificación en Gestión Financiera — Nivel Intermedio', 'Finanzas públicas y calidad del gasto', '8 semanas'],
  ['images/cursos/recursos-humanos.png', 'Con certificación', 'Curso y Certificación para Profesionales de Recursos Humanos', 'Gestión administrativa y organizacional', '10 semanas'],
  ['images/cursos/administracion-publica.png', 'Con certificación', 'Certificación de Conocimientos en Administración Pública — Nivel Básico', 'Modernización del Estado', '6 semanas'],
  ['images/cursos/derecho-administrativo.png', 'Curso', 'Introducción al Derecho Administrativo', 'Ética, transparencia y rendición de cuentas', '4 semanas'],
];

const FILTERS: [string, boolean][] = [
  ['Todos', true],
  ['Con certificación', false],
  ['Cursos y diplomados', false],
  ['Posgrados', false],
];

const chip = ([label, pressed]: [string, boolean]) =>
  `<button type="button" aria-pressed="${pressed}" class="group inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-base-border px-4 text-sm font-medium text-base-content transition-colors hover:border-base-content hover:bg-base-content/10 aria-pressed:border-secondary aria-pressed:bg-secondary aria-pressed:text-secondary-content md:h-9"><span class="hidden group-aria-pressed:inline">${icon('check', 16)}</span>${label}</button>`;

/** En celular, fila con desplazamiento horizontal de borde a borde (las tarjetas asoman). */
const SCROLL_ROW = '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scroll-px-4 [scrollbar-width:none]';

const featured = () => dedent(`
  <section aria-labelledby="home-destacados" class="${SECTION}">
    <div class="${WRAP} flex flex-col gap-5 md:gap-8">
      <div class="flex items-end justify-between gap-6">
        ${ind(sectionHeader('Cursos destacados', 'Programas con inscripción abierta y alta demanda en el sector público.').replace('<h2', '<h2 id="home-destacados"'), 8)}
        <a href="#" class="btn btn-outline btn-primary hidden shrink-0 md:inline-flex">Ver todos los cursos</a>
      </div>
      <div role="group" aria-label="Filtrar cursos destacados" data-home-chips class="${SCROLL_ROW} gap-2 md:mx-0 md:flex-wrap md:px-0">
        ${FILTERS.map(chip).join('\n        ')}
      </div>
      <ul class="${SCROLL_ROW} md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:px-0 xl:grid-cols-4">
        ${FEATURED.map(([img, badge, title, area, weeks]) => `<li class="w-70.5 shrink-0 snap-start md:w-auto">\n          ${ind(courseCard(thumbPhoto(badge, img), title, area, weeks), 10)}\n        </li>`).join('\n        ')}
      </ul>
      <a href="#" class="btn btn-outline btn-primary btn-lg w-full md:hidden">Ver todos los cursos</a>
    </div>
  </section>
`);

/* ── Áreas de formación ─────────────────────────────────────────────────────── */

const AREAS: [string, string, string][] = [
  ['lightbulb', 'Modernización del Estado', '18 cursos'],
  ['building-2', 'Gestión administrativa y organizacional', '24 cursos'],
  ['eye', 'Ética, transparencia y rendición de cuentas', '12 cursos'],
  ['message-circle', 'Liderazgo, comunicación y clima organizacional', '21 cursos'],
  ['chart-pie', 'Planificación y gestión pública', '16 cursos'],
  ['users', 'Derechos humanos, inclusión y género', '14 cursos'],
  ['map-pin', 'Desarrollo territorial y sostenibilidad ambiental', '9 cursos'],
  ['banknote', 'Finanzas públicas y calidad del gasto', '19 cursos'],
  ['file-search', 'Investigación y gestión del conocimiento público', '7 cursos'],
];

const areas = () => dedent(`
  <section aria-labelledby="home-areas" class="bg-surface-subtle ${SECTION}">
    <div class="${WRAP} flex flex-col gap-5 md:gap-12">
      ${ind(sectionHeader('Aprende a modernizar, gestionar y liderar', 'Nueve áreas alineadas con los retos de la administración pública guatemalteca.', 'md').replace('<h2', '<h2 id="home-areas"'), 6)}
      <ul class="grid gap-x-6 md:grid-cols-2 md:gap-y-6 xl:grid-cols-3">
        ${AREAS.map((a) => ind(areaCard(a), 8)).join('\n        ')}
      </ul>
    </div>
  </section>
`);

/* ── Para instituciones ─────────────────────────────────────────────────────── */

const SERVICES: [string, string, string][] = [
  ['users', 'Programas a la medida', 'Contenidos diseñados según las funciones y metas de tus equipos.'],
  ['clipboard-check', 'Inscripción grupal', 'Inscribe a tus colaboradores en un solo proceso y da seguimiento a su avance.'],
  ['file-search', 'Investigación y asistencia técnica', 'Acompañamiento especializado para fortalecer procesos institucionales.'],
];

const service = ([ico, title, text]: [string, string, string]) => dedent(`
  <li class="flex items-start gap-4 rounded-box bg-brand-surface-line p-4 md:px-6 md:py-5">
    <span class="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-content">${icon(ico, 22)}</span>
    <div class="flex flex-col gap-1">
      <h3 class="font-semibold text-brand-surface-content">${title}</h3>
      <p class="text-sm text-brand-surface-muted">${text}</p>
    </div>
  </li>
`);

const institutions = () => dedent(`
  <section aria-labelledby="home-instituciones" class="relative overflow-hidden bg-brand-surface ${SECTION}">
    ${waves('top-1/2 w-[140rem] -translate-y-1/2 opacity-15')}
    <div class="${WRAP} relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-20">
      <div class="flex flex-col gap-4 lg:flex-1 lg:gap-5">
        <h2 id="home-instituciones" class="text-3xl font-bold text-brand-surface-content md:text-4xl lg:max-w-122">Fortalece las capacidades de tu institución</h2>
        <p class="text-base text-brand-surface-muted md:text-lg">Diseñamos programas de formación, investigación y asistencia técnica a la medida de cada entidad del Estado.</p>
        <div class="flex flex-col items-center gap-1 pt-2 md:flex-row md:gap-6 md:pt-3">
          <a href="#" class="btn btn-accent btn-lg w-full md:w-auto ${FOCUS_INV}">Solicitar asesoría</a>
          ${arrowLink('Ver agenda de servicios 2026', `text-brand-surface-content ${FOCUS_INV}`)}
        </div>
      </div>
      <ul class="flex flex-col gap-3 lg:w-132 lg:shrink-0">
        ${SERVICES.map((s) => ind(service(s), 8)).join('\n        ')}
      </ul>
    </div>
  </section>
`);

/* ── Cómo funciona ──────────────────────────────────────────────────────────── */

const STEPS: [string, string][] = [
  ['Crea tu cuenta', 'Regístrate con tu DPI y correo electrónico en menos de un minuto.'],
  ['Elige e inscríbete', 'Filtra por área o tipo de curso y completa tu inscripción.'],
  ['Aprende y certifícate', 'Avanza en el Aula Virtual y descarga tu constancia o certificado.'],
];

const step = ([title, text]: [string, string], i: number) => dedent(`
  <li class="flex gap-4 md:flex-col md:items-center md:gap-3 md:px-4 md:text-center">
    <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-content" aria-hidden="true">${i + 1}</span>
    <div class="flex flex-col gap-1 md:gap-3">
      <h3 class="text-lg font-semibold text-base-content">${title}</h3>
      <p class="text-base text-neutral-text">${text}</p>
    </div>
  </li>
`);

const howItWorks = () => dedent(`
  <section aria-labelledby="home-pasos" class="${SECTION}">
    <div class="${WRAP} flex flex-col gap-6 md:items-center md:gap-12">
      ${ind(sectionHeader('Empieza en tres pasos', 'Sin trámites en papel: todo el proceso es en línea.', 'md').replace('<h2', '<h2 id="home-pasos"'), 6)}
      <ol role="list" class="grid w-full gap-6 md:grid-cols-3">
        ${STEPS.map((s, i) => ind(step(s, i), 8)).join('\n        ')}
      </ol>
      ${arrowLink('Ver videotutorial de registro', 'text-primary-text', icon('circle-play', 20))}
    </div>
  </section>
`);

/* ── Testimonios ────────────────────────────────────────────────────────────── */

const QUOTES: [string, string, string, string][] = [
  ['MG', 'María García', 'Analista, Ministerio de Finanzas Públicas', 'El diplomado me dio herramientas concretas para mejorar la planificación de mi unidad. Lo apliqué desde la primera semana.'],
  ['CP', 'Carlos Pérez', 'Jefe de RR. HH., Municipalidad de Quetzaltenango', 'La certificación en recursos humanos me ayudó a ordenar los procesos de contratación de toda la municipalidad.'],
  ['AL', 'Ana López', 'Directora de Formación, SEGEPLAN', 'Inscribimos a 40 colaboradores en un solo proceso y pudimos dar seguimiento al avance de cada equipo.'],
];

const testimonials = () => dedent(`
  <section aria-labelledby="home-testimonios" class="bg-surface-subtle ${SECTION}">
    <div class="${WRAP} flex flex-col gap-5 md:gap-12">
      ${ind(sectionHeader('Lo que dicen nuestros participantes', 'Servidores públicos de todo el país ya aplican lo aprendido en su trabajo.', 'md').replace('<h2', '<h2 id="home-testimonios"'), 6)}
      <div role="region" aria-label="Testimonios, desplazable" tabindex="0" class="${SCROLL_ROW} rounded-box lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0">
        ${QUOTES.map(([ini, name, role, quote]) => `<div class="w-75 shrink-0 snap-start lg:w-auto">\n          ${ind(testimonial(ini, name, role, quote), 10)}\n        </div>`).join('\n        ')}
      </div>
    </div>
  </section>
`);

/* ── Preguntas frecuentes y llamado final ───────────────────────────────────── */

const FAQ: [string, string][] = [
  ['¿Cómo me inscribo en un curso?', 'Crea tu cuenta, elige el curso y completa el formulario de inscripción. Recibirás un correo con los pasos para acceder al Aula Virtual.'],
  ['¿Los cursos tienen costo?', 'Depende del programa. Cada curso indica si es gratuito o el monto de inscripción y las formas de pago.'],
  ['¿Qué diferencia hay entre constancia y certificación?', 'La constancia acredita tu participación; la certificación valida tus competencias mediante una evaluación.'],
  ['¿Mi institución puede inscribir a un grupo?', 'Sí. Desde «Para instituciones» puedes solicitar inscripción grupal o un programa a la medida.'],
];

/** Pregunta frecuente (FAQ Item): <details> con el mismo `name` en todo el grupo, así abrir una cierra las demás. */
export const faqItem = ([q, a]: [string, string], open: boolean, name = 'home-faq') => dedent(`
  <details class="group border-b border-base-content/10" name="${name}"${open ? ' open' : ''}>
    <summary class="flex cursor-pointer list-none items-center gap-4 rounded-sm py-5 font-semibold text-base-content [&::-webkit-details-marker]:hidden">
      <span class="flex-1">${q}</span>
      ${icon('plus', 20, 'shrink-0 text-primary-text group-open:hidden')}${icon('minus', 20, 'hidden shrink-0 text-primary-text group-open:block')}
    </summary>
    <p class="pb-5 text-base text-neutral-text">${a}</p>
  </details>
`);

const faqCta = () => dedent(`
  <div class="relative overflow-hidden">
    ${waves('bottom-0 w-[90rem] opacity-20 xl:w-full')}
    <section aria-labelledby="home-faq" class="relative ${SECTION}">
      <div class="${WRAP} flex flex-col gap-6 lg:flex-row lg:gap-24">
        <div class="flex flex-col items-start gap-2 lg:w-96 lg:shrink-0 lg:gap-6">
          ${ind(sectionHeader('Preguntas frecuentes', '¿No encuentras tu respuesta? Escríbenos a informacion@inap.gob.gt.').replace('<h2', '<h2 id="home-faq"'), 10)}
          ${arrowLink('Ver todas las preguntas')}
        </div>
        <div class="lg:flex-1">
          ${FAQ.map((f, i) => ind(faqItem(f, i === 0), 10)).join('\n          ')}
        </div>
      </div>
    </section>
    <section aria-labelledby="home-cta" class="relative pb-12 md:pb-24">
      <div class="${WRAP}">
        <div class="relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl bg-brand-surface px-6 py-10 text-center md:gap-5 md:px-16 md:py-18">
          <img src="brand/logo-white.svg" alt="" width="1138" height="703" class="pointer-events-none absolute top-[calc(50%+6.2rem)] left-[calc(50%+3.9rem)] w-[71rem] max-w-none -translate-1/2 opacity-10" />
          <div class="pointer-events-none absolute -top-40 -left-30 size-120 rounded-full bg-inap-brand-blue/60 blur-3xl" aria-hidden="true"></div>
          <div class="pointer-events-none absolute -right-40 -bottom-50 size-105 rounded-full bg-inap-brand-cyan/40 blur-3xl md:right-auto md:bottom-auto md:top-30 md:left-205" aria-hidden="true"></div>
          <h2 id="home-cta" class="relative text-3xl font-bold text-brand-surface-content md:text-4xl">El mejor momento para aprender es ahora</h2>
          <p class="relative text-base text-brand-surface-muted md:text-lg">Regístrate y da el primer paso para impulsar tu carrera en el servicio público.</p>
          <div class="relative flex w-full flex-col items-center gap-1 pt-2 md:w-auto md:flex-row md:gap-6">
            <a href="#" class="btn btn-accent btn-lg w-full md:w-auto ${FOCUS_INV}">Crear mi cuenta</a>
            ${arrowLink('Explorar cursos', `text-brand-surface-content ${FOCUS_INV}`)}
          </div>
        </div>
      </div>
    </section>
  </div>
`);

/** Página completa: barra (celular o escritorio), contenido y pie. */
export const homeTemplate = () => dedent(`
  <a href="#home-contenido" class="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">Saltar al contenido principal</a>
  <div class="xl:hidden">
    ${ind(navbarMobile('home-m', 'angular'), 4)}
  </div>
  <div class="hidden xl:block">
    ${ind(navbarDesktop('home-d', 'angular'), 4)}
  </div>
  <main id="home-contenido" tabindex="-1" class="outline-none">
    ${ind(hero(), 4)}
    ${ind(trustStrip(), 4)}
    ${ind(featured(), 4)}
    ${ind(areas(), 4)}
    ${ind(institutions(), 4)}
    ${ind(howItWorks(), 4)}
    ${ind(testimonials(), 4)}
    ${ind(faqCta(), 4)}
  </main>
  ${ind(footer('home-f'), 2)}
`);

/** Marcador de posición del buscador según la audiencia (selector «Para ti» / «Para tu institución»). */
export const SEARCH_PLACEHOLDER = {
  persona: '¿Qué quieres aprender hoy?',
  institucion: '¿Qué necesita aprender tu equipo?',
};
