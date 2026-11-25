import { dedent } from '../../core/dedent';
import { activeFilters, emptyState, FilterGroupData, filterGroup, filterSheet, pagination } from '../componentes/sitio-catalogo';
import { courseCard, thumbIllustration, thumbPhoto } from '../componentes/sitio-cursos';
import { footer, navbarDesktop, navbarMobile } from '../componentes/sitio-navegacion';

/*
  Plantilla del Catálogo (Figma: Catálogo • Desktop 518:16304, Mobile 521:11743; estados filtrado
  520:16775 / 522:12013, sin resultados 520:20007 / 522:12346, hoja de filtros 522:12658).
  Las 9 primeras tarjetas son las de Figma; las otras 15 completan los conteos de los filtros.
  Contenido de ejemplo hasta que el equipo de desarrollo conecte el servicio de cursos.
*/

const ind = (html: string, n: number) => html.replace(/\n/g, '\n' + ' '.repeat(n));

const WRAP = 'mx-auto w-full max-w-316 px-4 md:px-8';

/* ── Filtros ────────────────────────────────────────────────────────────────── */

export const GROUPS: FilterGroupData[] = [
  { key: 'tipo', title: 'Tipo de formación', options: [['certificacion', 'Cursos con opción a certificación', 14], ['cursos', 'Cursos y diplomados', 7], ['posgrado', 'Estudios de posgrado', 3]] },
  { key: 'nivel', title: 'Nivel de certificación', options: [['basica', 'Básica', 6], ['intermedia', 'Intermedia', 5], ['avanzada', 'Avanzada', 3]] },
  {
    key: 'area', title: 'Área de formación', visible: 5, more: 'Ver las 9 áreas',
    options: [
      ['modernizacion', 'Modernización del Estado', 3],
      ['gestion', 'Gestión administrativa y organizacional', 2],
      ['etica', 'Ética, transparencia y rendición de cuentas', 3],
      ['liderazgo', 'Liderazgo, comunicación y clima organizacional', 4],
      ['finanzas', 'Finanzas públicas y calidad del gasto', 4],
      ['planificacion', 'Planificación y gestión pública', 2],
      ['derechos', 'Derechos humanos, inclusión y género', 2],
      ['territorial', 'Desarrollo territorial y sostenibilidad ambiental', 2],
      ['investigacion', 'Investigación y gestión del conocimiento público', 2],
    ],
  },
  { key: 'modalidad', title: 'Modalidad', options: [['elearning', 'e-Learning', 10], ['mooc', 'MOOC', 4], ['mlearning', 'm-Learning', 2], ['mpresencial', 'm-Presencial', 5], ['presencial', 'Presencial', 3]] },
  { key: 'inscripcion', title: 'Inscripción', options: [['abierta', 'Abierta', 10], ['proximamente', 'Próximamente', 14]] },
];

/** Texto de la etiqueta de filtro activo cuando la opción sola no se entiende fuera de su grupo. */
const TAG_LABEL: Record<string, string> = {
  basica: 'Nivel básico', intermedia: 'Nivel intermedio', avanzada: 'Nivel avanzado',
  abierta: 'Inscripción abierta', proximamente: 'Inscripción próximamente',
};

/** Filtros elegidos por grupo: { tipo: ['certificacion'], inscripcion: ['abierta'] }. */
export type Selected = Record<string, string[]>;

export const tagsFor = (sel: Selected): [string, string][] =>
  GROUPS.flatMap((g) => g.options.filter(([v]) => sel[g.key]?.includes(v)).map(([v, label]): [string, string] => [TAG_LABEL[v] ?? label, `${g.key}:${v}`]));

/* ── Cursos de ejemplo ──────────────────────────────────────────────────────── */

export interface Course {
  title: string;
  badge: string;
  tipo: string;
  nivel?: string;
  area: string;
  modalidad: string;
  inscripcion: string;
  duration: string;
  img?: string;
}

const AREA_NAME = Object.fromEntries(GROUPS[2].options.map(([v, l]) => [v, l]));
const MODALITY_NAME = Object.fromEntries(GROUPS[3].options.map(([v, l]) => [v, l]));
/** Ícono de área para la miniatura ilustrada (mismos del Home). */
const AREA_ICON: Record<string, string> = {
  modernizacion: 'lightbulb', gestion: 'building-2', etica: 'eye', liderazgo: 'message-circle', finanzas: 'banknote',
  planificacion: 'chart-pie', derechos: 'users', territorial: 'map-pin', investigacion: 'file-search',
};

const C = (title: string, badge: string, tipo: string, nivel: string | undefined, area: string, modalidad: string, inscripcion: string, duration: string, img?: string): Course =>
  ({ title, badge, tipo, nivel, area, modalidad, inscripcion, duration, img: img && `images/cursos/${img}` });

const CERT = 'Con certificación';

/** Orden = «Próximos a iniciar». */
export const COURSES: Course[] = [
  C('Curso y Certificación de Conocimientos en Administración Pública — Nivel Básico', CERT, 'certificacion', 'basica', 'modernizacion', 'elearning', 'abierta', '6 semanas', 'recursos-humanos.png'),
  C('Curso y Certificación en Gestión Financiera — Nivel Intermedio', CERT, 'certificacion', 'intermedia', 'finanzas', 'elearning', 'abierta', '8 semanas', 'administracion-publica.png'),
  C('Curso y Certificación para Profesionales de Recursos Humanos', CERT, 'certificacion', 'intermedia', 'gestion', 'mpresencial', 'abierta', '10 semanas', 'reunion-de-equipo.jpg'),
  C('Introducción al Derecho Administrativo', 'Curso', 'cursos', undefined, 'etica', 'mooc', 'abierta', '4 semanas', 'trabajo-en-linea.jpg'),
  C('Ética y valores en el Servicio Civil', 'Curso', 'cursos', undefined, 'etica', 'mooc', 'abierta', '4 semanas', 'dialogo-inclusivo.jpg'),
  C('Diplomado en Gestión Local y Desarrollo Territorial', 'Diplomado', 'cursos', undefined, 'territorial', 'mpresencial', 'abierta', '12 semanas', 'derecho-administrativo.png'),
  C('Diplomado en Inteligencia Emocional en la Gestión Pública', 'Diplomado', 'cursos', undefined, 'liderazgo', 'elearning', 'abierta', '10 semanas', 'gestion-financiera.png'),
  C('Maestría en Gerencia Pública INAP–ICAP', 'Posgrado', 'posgrado', undefined, 'liderazgo', 'presencial', 'abierta', '2 años', 'trabajo-en-linea.jpg'),
  C('Curso de Presentación Pública', 'Curso', 'cursos', undefined, 'finanzas', 'elearning', 'abierta', '3 semanas', 'administracion-publica.png'),
  C('Curso y Certificación en Gestión Financiera — Nivel Básico', CERT, 'certificacion', 'basica', 'finanzas', 'elearning', 'proximamente', '6 semanas'),
  C('Curso y Certificación en Gestión Financiera — Nivel Avanzado', CERT, 'certificacion', 'avanzada', 'finanzas', 'mpresencial', 'proximamente', '10 semanas'),
  C('Certificación de Conocimientos en Administración Pública — Nivel Intermedio', CERT, 'certificacion', 'intermedia', 'modernizacion', 'elearning', 'proximamente', '8 semanas'),
  C('Certificación de Conocimientos en Administración Pública — Nivel Avanzado', CERT, 'certificacion', 'avanzada', 'modernizacion', 'mpresencial', 'proximamente', '10 semanas'),
  C('Certificación en Compras y Contrataciones del Estado — Nivel Básico', CERT, 'certificacion', 'basica', 'gestion', 'elearning', 'proximamente', '6 semanas'),
  C('Certificación en Probidad y Rendición de Cuentas — Nivel Básico', CERT, 'certificacion', 'basica', 'etica', 'mooc', 'proximamente', '4 semanas'),
  C('Certificación en Liderazgo Público — Nivel Intermedio', CERT, 'certificacion', 'intermedia', 'liderazgo', 'mlearning', 'proximamente', '8 semanas'),
  C('Certificación en Planificación Estratégica — Nivel Básico', CERT, 'certificacion', 'basica', 'planificacion', 'elearning', 'proximamente', '6 semanas'),
  C('Certificación en Planificación Estratégica — Nivel Intermedio', CERT, 'certificacion', 'intermedia', 'planificacion', 'mpresencial', 'proximamente', '8 semanas'),
  C('Certificación en Atención Ciudadana con Enfoque de Derechos — Nivel Básico', CERT, 'certificacion', 'basica', 'derechos', 'mooc', 'proximamente', '4 semanas'),
  C('Certificación en Gestión del Conocimiento Público — Nivel Avanzado', CERT, 'certificacion', 'avanzada', 'investigacion', 'mlearning', 'proximamente', '10 semanas'),
  C('Curso de Igualdad de Género en la Gestión Pública', 'Curso', 'cursos', undefined, 'derechos', 'elearning', 'abierta', '5 semanas'),
  C('Diplomado en Gestión Ambiental Municipal', 'Diplomado', 'cursos', undefined, 'territorial', 'elearning', 'proximamente', '12 semanas'),
  C('Especialización en Liderazgo y Negociación', 'Posgrado', 'posgrado', undefined, 'liderazgo', 'presencial', 'proximamente', '1 año'),
  C('Maestría en Investigación de Políticas Públicas', 'Posgrado', 'posgrado', undefined, 'investigacion', 'presencial', 'proximamente', '2 años'),
];

/** Dentro de un grupo se suman las opciones (O); entre grupos se combinan (Y). */
export const filterCourses = (sel: Selected, list = COURSES) =>
  list.filter((c) => GROUPS.every(({ key }) => {
    const want = sel[key] ?? [];
    return want.length === 0 || want.includes(String(c[key as keyof Course] ?? ''));
  }));

export type Sort = 'proximos' | 'recientes' | 'nombre';

export const sortCourses = (list: Course[], sort: Sort) =>
  sort === 'nombre' ? [...list].sort((a, b) => a.title.localeCompare(b.title, 'es'))
    : sort === 'recientes' ? [...list].reverse()
      : list;

/** Cursos por página: 9 en escritorio (3 × 3), 6 en celular. */
export const PAGE_SIZE = { desktop: 9, mobile: 6 };

/* ── Resultados ─────────────────────────────────────────────────────────────── */

const card = (c: Course) =>
  courseCard(c.img ? thumbPhoto(c.badge, c.img) : thumbIllustration(c.badge, AREA_ICON[c.area]), c.title, AREA_NAME[c.area], c.duration, MODALITY_NAME[c.modalidad]);

/** Cuadrícula de una página. Sin resultados, el estado vacío. */
export const resultsGrid = (list: Course[]) => list.length === 0 ? emptyState() : dedent(`
  <ul class="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
    ${list.map((c) => `<li>\n      ${ind(card(c), 6)}\n    </li>`).join('\n    ')}
  </ul>
`);

export const countText = (n: number) => `${n} ${n === 1 ? 'curso' : 'cursos'}`;

/* ── Página ─────────────────────────────────────────────────────────────────── */

const sortSelect = () => dedent(`
  <div class="flex flex-1 items-center gap-3 lg:flex-none">
    <label for="cat-orden" class="sr-only text-sm text-neutral-text lg:not-sr-only"><span class="whitespace-nowrap">Ordenar por</span></label>
    <select id="cat-orden" data-orden class="select select-lg w-full lg:select-md lg:w-55">
      <option value="proximos" selected>Próximos a iniciar</option>
      <option value="recientes">Más recientes</option>
      <option value="nombre">Nombre (A–Z)</option>
    </select>
  </div>
`);

const header = () => dedent(`
  <div class="hidden bg-surface-muted md:block">
    <nav aria-label="Breadcrumb" class="breadcrumbs mx-auto max-w-360 px-8 py-3 text-sm xl:px-20">
      <ul>
        <li><a href="/" class="font-medium text-primary-text underline hover:no-underline">Inicio</a></li>
        <li><span aria-current="page" class="text-neutral-text">Catálogo de cursos</span></li>
      </ul>
    </nav>
  </div>
  <div class="${WRAP} flex flex-col gap-2 py-6 md:gap-3 md:pt-12 md:pb-10">
    <h1 id="cat-titulo" class="text-3xl font-semibold text-base-content md:text-5xl md:font-bold">Catálogo de cursos</h1>
    <p class="max-w-180 text-base text-neutral-text md:text-lg">Cursos, diplomados y estudios de posgrado para servidores públicos y equipos de instituciones del Estado.</p>
  </div>
`);

const sidebar = () => dedent(`
  <aside aria-labelledby="cat-filtrar" class="hidden w-70 shrink-0 lg:block">
    <h2 id="cat-filtrar" class="pb-2 text-lg font-semibold text-base-content">Filtrar por</h2>
    <form data-filtros>
      ${GROUPS.map((g) => ind(filterGroup('cat', g), 6)).join('\n      ')}
    </form>
  </aside>
`);

const results = () => {
  const first = COURSES.slice(0, PAGE_SIZE.desktop);
  return dedent(`
    <section aria-labelledby="cat-resultados" class="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
      <h2 id="cat-resultados" tabindex="-1" class="sr-only">Resultados</h2>
      <div class="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-between">
        <p role="status" data-conteo class="order-last w-full pt-4 text-base font-medium text-base-content lg:order-first lg:w-auto lg:pt-0">${countText(COURSES.length)}</p>
        <button type="button" data-abrir-filtros aria-haspopup="dialog" aria-controls="cat-hoja" class="btn btn-outline btn-primary btn-lg lg:hidden">Filtros</button>
        ${ind(sortSelect(), 8)}
      </div>
      <div data-activos class="empty:hidden"></div>
      <div data-resultados>
        ${ind(resultsGrid(first), 8)}
      </div>
      <div data-paginas class="pt-6 pb-6 md:pt-4 md:pb-0">
        ${ind(pagination(1, Math.ceil(COURSES.length / PAGE_SIZE.desktop)), 8)}
      </div>
    </section>
  `);
};

/** Página completa: barra (celular o escritorio), encabezado, filtros, resultados, pie y hoja de filtros. */
export const catalogoTemplate = () => dedent(`
  <a href="#cat-contenido" class="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">Saltar al contenido principal</a>
  <div class="xl:hidden">
    ${ind(navbarMobile('cat-m', 'angular'), 4)}
  </div>
  <div class="hidden xl:block">
    ${ind(navbarDesktop('cat-d', 'angular'), 4)}
  </div>
  <main id="cat-contenido" tabindex="-1" class="outline-none">
    ${ind(header(), 4)}
    <div class="${WRAP} flex items-start gap-10 pb-12 md:pb-24">
      ${ind(sidebar(), 6)}
      ${ind(results(), 6)}
    </div>
  </main>
  ${ind(footer('cat-f'), 2)}
  ${ind(filterSheet('cat-hoja', GROUPS), 2)}
`);

export { activeFilters, pagination };
