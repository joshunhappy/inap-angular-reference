import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

/*
  Componentes del catálogo (Figma: Filter Option 515:1947, Filter Group Header 515:1956,
  Filter Tag 515:1957, Pagination 515:1991, Catalog Empty State 515:1992).
  Las plantillas y las páginas de componentes usan estas mismas funciones.
*/

/** Sangra las líneas siguientes de un bloque insertado dentro de otra plantilla. */
const ind = (html: string, n: number) => html.replace(/\n/g, '\n' + ' '.repeat(n));

/* ── Filtros ────────────────────────────────────────────────────────────────── */

/** Opción de filtro: [valor, etiqueta, conteo]. */
export type FilterOptionData = [string, string, number];

export interface FilterGroupData {
  /** Nombre del parámetro en la URL (?tipo=certificacion). */
  key: string;
  title: string;
  options: FilterOptionData[];
  /** Cuántas opciones se ven antes de «Ver las N…». */
  visible?: number;
  /** Texto del botón para ver todas, con N = total. */
  more?: string;
}

/**
 * Fila de filtro: checkbox + etiqueta + conteo. Toda la fila es el <label>, así que el área táctil
 * es de 44 px de alto aunque el checkbox mida 24.
 */
export const filterOption = (id: string, name: string, [value, label, count]: FilterOptionData, checked = false, hidden = false) => dedent(`
  <label for="${id}" class="flex min-h-11 cursor-pointer items-center gap-3 py-2.5 text-sm text-base-content"${hidden ? ' data-extra hidden' : ''}>
    <input id="${id}" type="checkbox" name="${name}" value="${value}" class="checkbox checkbox-primary shrink-0"${checked ? ' checked' : ''} />
    <span class="flex-1">${label}</span>
    <span class="text-neutral-text">${count}<span class="sr-only"> cursos</span></span>
  </label>
`);

/**
 * Grupo de filtros: <details> abre y cierra sin JavaScript y el lector anuncia «expandido / contraído».
 * Dentro, un <fieldset> agrupa los checkbox con el mismo nombre.
 */
export const filterGroup = (p: string, g: FilterGroupData, checked: string[] = [], open = true) => {
  const shown = g.visible ?? g.options.length;
  const opts = g.options
    .map((o, i) => ind(filterOption(`${p}-${g.key}-${o[0]}`, g.key, o, checked.includes(o[0]), i >= shown), 6))
    .join('\n      ');
  const more = shown < g.options.length
    ? `\n    <button type="button" data-more aria-expanded="false" class="inline-flex h-11 items-center gap-1 rounded-sm text-sm font-medium text-primary-text hover:underline"><span>${g.more}</span>${icon('chevron-down', 16, 'transition-transform [[aria-expanded=true]>&]:rotate-180')}</button>`
    : '';
  return dedent(`
    <details class="group/filtro border-t border-base-border py-3"${open ? ' open' : ''}>
      <summary class="flex h-11 cursor-pointer list-none items-center gap-2 rounded-sm text-sm font-semibold text-base-content [&::-webkit-details-marker]:hidden">
        <span class="flex-1">${g.title}</span>
        ${icon('chevron-down', 20, 'shrink-0 transition-transform group-open/filtro:rotate-180')}
      </summary>
      <fieldset>
        <legend class="sr-only">${g.title}</legend>
        ${opts}
      </fieldset>${more}
    </details>
  `);
};

/** Etiqueta de filtro activo: botón que quita el filtro. */
export const filterTag = (label: string, value: string, extra = 'h-9') =>
  `<button type="button" data-quitar="${value}" class="inline-flex ${extra} shrink-0 items-center gap-1.5 rounded-full bg-secondary pr-2.5 pl-4 text-sm font-medium whitespace-nowrap text-secondary-content hover:bg-secondary/85"><span class="sr-only">Quitar filtro: </span>${label}${icon('x', 16)}</button>`;

/**
 * Fila de filtros activos. En celular se desplaza en horizontal de borde a borde (las etiquetas
 * miden 44 px); desde 1024 px se envuelve.
 */
export const activeFilters = (tags: [string, string][]) => tags.length === 0 ? '' : dedent(`
  <div role="group" aria-label="Filtros activos" class="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
    ${tags.map(([label, value]) => filterTag(label, value, 'h-11 lg:h-9')).join('\n    ')}
    <button type="button" data-limpiar class="inline-flex h-11 shrink-0 items-center rounded-sm px-2 text-sm font-medium text-primary-text underline hover:no-underline lg:h-9"><span class="lg:hidden">Limpiar</span><span class="hidden lg:inline">Limpiar filtros</span></button>
  </div>
`);

/* ── Estado vacío ───────────────────────────────────────────────────────────── */

export const emptyState = (
  title = 'No encontramos cursos con estos filtros',
  text = 'Prueba quitar algún filtro o busca con otras palabras.',
  action = '<button type="button" data-limpiar class="btn btn-outline btn-primary btn-lg lg:btn-md">Limpiar filtros</button>',
) => dedent(`
  <div class="flex flex-col items-center gap-4 px-6 py-16 text-center">
    <span class="flex size-16 items-center justify-center rounded-full bg-surface-muted text-base-content">${icon('search', 28)}</span>
    <h3 class="text-xl font-semibold text-base-content">${title}</h3>
    <p class="text-base text-neutral-text">${text}</p>
    ${action}
  </div>
`);

/* ── Paginación ─────────────────────────────────────────────────────────────── */

/** Páginas visibles: todas hasta 7; si hay más, la primera, la última y las vecinas de la actual. */
const pageList = (page: number, total: number): (number | '…')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = [1, page - 1, page, page + 1, total].filter((n) => n >= 1 && n <= total);
  const out: (number | '…')[] = [];
  [...new Set(set)].sort((a, b) => a - b).forEach((n, i, arr) => {
    if (i > 0 && n - arr[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
};

const PAGE_LINK = 'inline-flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium';

const prevNext = (page: number, total: number, dir: 'prev' | 'next') => {
  const target = dir === 'prev' ? page - 1 : page + 1;
  const label = dir === 'prev' ? 'Anterior' : 'Siguiente';
  const ico = icon(dir === 'prev' ? 'chevron-left' : 'chevron-right', 16);
  const inner = dir === 'prev' ? `${ico}${label}` : `${label}${ico}`;
  return target < 1 || target > total
    ? `<span class="${PAGE_LINK} text-base-content/60" aria-disabled="true">${inner}</span>`
    : `<a href="?pagina=${target}" data-pagina="${target}" class="${PAGE_LINK} text-primary-text hover:bg-primary/10" aria-label="${label}: página ${target}">${inner}</a>`;
};

/**
 * Paginación del catálogo. Escritorio: números; celular: «Página X de Y». Los enlaces llevan la
 * página en la URL (?pagina=2).
 */
export const pagination = (page: number, total: number) => dedent(`
  <nav aria-label="Paginación">
    <ul class="flex items-center justify-between md:justify-center md:gap-1">
      <li>${prevNext(page, total, 'prev')}</li>
      <li class="text-sm text-neutral-text md:hidden">Página ${page} de ${total}</li>
      ${pageList(page, total)
        .map((n) =>
          n === '…'
            ? `<li class="hidden px-1 text-sm text-neutral-text md:block" aria-hidden="true">…</li>`
            : n === page
              ? `<li class="hidden md:block"><a href="?pagina=${n}" data-pagina="${n}" aria-current="page" class="flex size-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-content"><span class="sr-only">Página </span>${n}</a></li>`
              : `<li class="hidden md:block"><a href="?pagina=${n}" data-pagina="${n}" class="flex size-11 items-center justify-center rounded-lg text-sm font-semibold text-base-content hover:bg-base-content/10"><span class="sr-only">Página </span>${n}</a></li>`,
        )
        .join('\n      ')}
      <li>${prevNext(page, total, 'next')}</li>
    </ul>
  </nav>
`);

/* ── Hoja de filtros en celular ─────────────────────────────────────────────── */

/**
 * Filtros en celular: <dialog> a pantalla completa con pie fijo. Los cambios se aplican con
 * «Ver N cursos»; cerrar con la X o Esc los descarta. `open` = vista estática para documentar.
 */
export const filterSheet = (p: string, groups: FilterGroupData[], checked: Record<string, string[]> = {}, count = 24, open = false) => {
  const body = groups
    .map((g) => ind(filterGroup(p, g, checked[g.key] ?? [], (checked[g.key] ?? []).length > 0), 6))
    .join('\n      ')
    .replace('border-t border-base-border py-3', 'py-3');
  return dedent(`
    <dialog id="${p}"${open ? ' open' : ''} aria-labelledby="${p}-titulo" class="${open ? 'static ' : ''}m-0 flex h-dvh max-h-none w-full max-w-none flex-col border-0 bg-base-100 p-0 text-base-content not-open:hidden">
      <div class="flex h-16 shrink-0 items-center justify-between border-b border-base-content/10 pr-2 pl-4">
        <h2 id="${p}-titulo" class="text-xl font-semibold">Filtros</h2>
        <button type="button" data-cerrar class="btn btn-ghost btn-square size-11" aria-label="Cerrar filtros">${icon('x', 24)}</button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-4 [&>details]:border-base-border [&>details+details]:border-t">
        ${body}
      </div>
      <div class="flex shrink-0 gap-3 border-t border-base-content/10 p-4">
        <button type="button" data-limpiar-hoja class="btn btn-outline btn-primary btn-lg flex-1">Limpiar</button>
        <button type="button" data-aplicar class="btn btn-primary btn-lg flex-1">Ver ${count} ${count === 1 ? 'curso' : 'cursos'}</button>
      </div>
    </dialog>
  `);
};

/* ── Datos de ejemplo para la documentación ─────────────────────────────────── */

const EJ_TIPO: FilterGroupData = {
  key: 'tipo',
  title: 'Tipo de formación',
  options: [['certificacion', 'Cursos con opción a certificación', 14], ['cursos', 'Cursos y diplomados', 7], ['posgrado', 'Estudios de posgrado', 3]],
};
const EJ_AREA: FilterGroupData = {
  key: 'area',
  title: 'Área de formación',
  visible: 3,
  more: 'Ver las 5 áreas',
  options: [['modernizacion', 'Modernización del Estado', 3], ['gestion', 'Gestión administrativa y organizacional', 2], ['etica', 'Ética, transparencia y rendición de cuentas', 3], ['liderazgo', 'Liderazgo, comunicación y clima organizacional', 4], ['finanzas', 'Finanzas públicas y calidad del gasto', 4]],
};
const EJ_INSCRIPCION: FilterGroupData = {
  key: 'inscripcion',
  title: 'Inscripción',
  options: [['abierta', 'Abierta', 10], ['proximamente', 'Próximamente', 14]],
};

export const filtros: ComponentDoc = {
  figmaNode: '515-1947',
  intro: `<p>Filtros del catálogo y de los resultados de búsqueda. En escritorio (desde 1024 px) van en una columna a la izquierda y se aplican al marcar. En celular se abren en una hoja a pantalla completa y se aplican con «Ver N cursos». Los filtros elegidos van en la URL y se muestran como etiquetas sobre los resultados.</p>`,
  examples: [
    {
      title: 'Opción de filtro',
      description: 'Checkbox, etiqueta y conteo. Toda la fila es el área táctil de 44 px.',
      previewClass: 'p-6 max-w-80',
      html: [
        filterOption('ej-f-1', 'ej-tipo', ['certificacion', 'Cursos con opción a certificación', 14], true),
        filterOption('ej-f-2', 'ej-tipo', ['cursos', 'Cursos y diplomados', 7]),
      ].join('\n'),
    },
    {
      title: 'Grupo de filtros',
      description: 'Abierto y cerrado. Áreas de formación muestra las primeras y un botón para ver todas.',
      previewClass: 'p-6 max-w-80',
      html: [filterGroup('ej-g', EJ_TIPO, ['certificacion']), filterGroup('ej-g', EJ_AREA), filterGroup('ej-g', EJ_INSCRIPCION, [], false)].join('\n'),
    },
    {
      title: 'Filtros activos',
      description: 'Una etiqueta por filtro elegido y «Limpiar filtros» al final. En celular la fila se desplaza en horizontal y dice «Limpiar».',
      previewClass: 'p-6',
      html: activeFilters([['Cursos con opción a certificación', 'certificacion'], ['Inscripción abierta', 'abierta']]),
    },
    {
      title: 'Hoja de filtros en celular',
      description: 'Abierta, a 390 px. Solo los grupos con algo marcado empiezan abiertos.',
      previewClass: 'mx-auto my-6 h-[44rem] w-[390px] overflow-hidden rounded-box border border-base-content/10 [&_dialog]:h-full',
      html: filterSheet('ej-hoja', [EJ_TIPO, { key: 'nivel', title: 'Nivel de certificación', options: [['basica', 'Básica', 6], ['intermedia', 'Intermedia', 5], ['avanzada', 'Avanzada', 3]] }, EJ_INSCRIPCION], { tipo: ['certificacion'], inscripcion: ['abierta'] }, 3, true),
    },
  ],
  usage: {
    html: `<ul>
      <li><strong>Escritorio:</strong> cada cambio filtra al instante y actualiza el conteo, las etiquetas y la URL (<code>?tipo=certificacion&amp;inscripcion=abierta</code>). La página vuelve a 1.</li>
      <li><strong>Celular:</strong> el botón «Filtros» (con el número de filtros elegidos, «Filtros (2)») abre la hoja con <code>showModal()</code>. Los cambios no se aplican hasta «Ver N cursos»; N se recalcula al marcar. La X y Esc cierran sin aplicar; «Limpiar» desmarca todo en la hoja.</li>
      <li>Dentro de un grupo, las opciones se suman (O); entre grupos, se combinan (Y).</li>
      <li>El conteo es el total de cursos con esa opción, sin contar los demás filtros, para que no cambie mientras se marca.</li>
      <li>Áreas de formación muestra 5 de 9; «Ver las 9 áreas» despliega el resto en el mismo lugar.</li>
      <li>Las etiquetas usan un texto que se entiende fuera de su grupo: «Abierta» en Inscripción se muestra como «Inscripción abierta».</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Grupos:</strong> <code>&lt;details&gt;</code> y <code>&lt;summary&gt;</code>; el lector anuncia «expandido / contraído». Los checkbox van en un <code>&lt;fieldset&gt;</code> con <code>&lt;legend&gt;</code> (oculta, repite el título).</li>
    <li><strong>Opción:</strong> <code>&lt;label&gt;</code> que envuelve el checkbox, la etiqueta y el conteo; el conteo se lee «14 cursos».</li>
    <li><strong>Etiquetas:</strong> botones con nombre «Quitar filtro: Inscripción abierta». Al quitar una, el foco pasa al encabezado de los resultados.</li>
    <li><strong>Resultados:</strong> el conteo («24 cursos») es <code>role="status"</code>, así el lector anuncia el cambio sin mover el foco.</li>
    <li><strong>Hoja:</strong> <code>&lt;dialog&gt;</code> con <code>aria-labelledby</code> al título «Filtros»; el foco queda dentro y vuelve al botón «Filtros» al cerrar.</li>
    <li><strong>Contraste:</strong> borde del checkbox y separadores de grupo en <code>base-border</code> (3:1 o más); etiqueta seleccionada <code>secondary-content</code> sobre <code>secondary</code>.</li>
  </ul>`,
  classes: [
    ['checkbox checkbox-primary', 'Checkbox de 24 px.'],
    ['min-h-11 py-2.5 gap-3', 'Fila de opción (44 px).'],
    ['border-t border-base-border py-3', 'Separador de grupo.'],
    ['group-open/filtro:rotate-180', 'Chevron del grupo abierto.'],
    ['bg-secondary text-secondary-content rounded-full', 'Etiqueta de filtro activo.'],
  ],
  snippets: [
    { title: 'Filtros en la URL (Angular)', language: 'TypeScript', code: dedent(`
      private readonly route = inject(ActivatedRoute);
      private readonly router = inject(Router);

      /** { tipo: ['certificacion'], inscripcion: ['abierta'] } leído de la URL. */
      readonly selected = toSignal(this.route.queryParamMap.pipe(
        map((q) => Object.fromEntries(GROUPS.map((g) => [g.key, q.getAll(g.key)]))),
      ), { requireSync: true });

      toggle(key: string, value: string, checked: boolean): void {
        const current = this.selected()[key];
        const next = checked ? [...current, value] : current.filter((v) => v !== value);
        // Cambiar filtros vuelve a la página 1.
        this.router.navigate([], { queryParams: { [key]: next, pagina: null }, queryParamsHandling: 'merge' });
      }
    `) },
  ],
};

export const estadoVacio: ComponentDoc = {
  figmaNode: '515-1992',
  intro: `<p>Mensaje cuando los filtros o la búsqueda no devuelven cursos. Explica qué pasó y ofrece una salida en la misma vista.</p>`,
  examples: [
    { title: 'Sin resultados en el catálogo', previewClass: 'p-6', html: emptyState() },
    {
      title: 'Sin resultados en la búsqueda',
      description: 'Con un enlace al catálogo en lugar de limpiar filtros.',
      previewClass: 'p-6',
      html: emptyState('No encontramos cursos para «gestion financiera»', 'Revisa la ortografía o prueba con menos palabras.', '<a href="#" class="btn btn-outline btn-primary btn-lg lg:btn-md">Ver todo el catálogo</a>'),
    },
  ],
  usage: {
    html: `<ul>
      <li>Reemplaza la cuadrícula de resultados; el conteo («0 cursos»), las etiquetas y los filtros siguen visibles para poder corregir.</li>
      <li>Título que dice qué pasó, una línea con qué hacer y un solo botón.</li>
      <li>Botón de 48 px en celular (<code>btn-lg</code>) y 40 px en escritorio.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li>El ícono es decorativo (<code>aria-hidden</code>).</li>
    <li>El título es un <code>&lt;h3&gt;</code> dentro de los resultados.</li>
    <li>El cambio lo anuncia el conteo de resultados (<code>role="status"</code>): «0 cursos».</li>
  </ul>`,
  classes: [
    ['size-16 rounded-full bg-surface-muted', 'Círculo del ícono.'],
    ['text-xl font-semibold', 'Título.'],
    ['btn btn-outline btn-primary btn-lg lg:btn-md', 'Acción.'],
  ],
};
