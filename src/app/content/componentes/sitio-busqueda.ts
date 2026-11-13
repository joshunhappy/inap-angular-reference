import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

/** Sangra las líneas siguientes de un bloque insertado dentro de otra plantilla. */
const ind = (html: string, n: number) => html.replace(/\n/g, '\n' + ' '.repeat(n));

/* ── Hero Search ───────────────────────────────────────────────────────────── */

type HeroSize = 'lg' | 'md' | 'responsive';

const HERO: Record<HeroSize, { box: string; icon: number; input: string; button: boolean }> = {
  lg: { box: 'h-16 max-w-160 gap-3 pl-6 pr-2 shadow-lg', icon: 22, input: 'text-lg', button: true },
  md: { box: 'h-13 max-w-90 gap-3 pl-4.5 pr-1.5 shadow-md', icon: 20, input: 'text-base', button: false },
  responsive: { box: 'h-13 gap-3 pl-4.5 pr-1.5 shadow-md md:h-16 md:max-w-160 md:pl-6 md:pr-2 md:shadow-lg', icon: 22, input: 'text-base md:text-lg', button: true },
};

const heroSearch = (id: string, size: HeroSize, placeholder = '¿Qué quieres aprender hoy?') => {
  const s = HERO[size];
  const button = s.button
    ? `\n    <button type="submit" class="btn btn-primary btn-lg rounded-full${size === 'responsive' ? ' hidden md:inline-flex' : ''}">Buscar</button>`
    : '';
  return dedent(`
    <form role="search" action="/cursos" class="flex w-full items-center rounded-full border border-base-border bg-base-2 ${s.box} has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary-text">
      ${icon('search', s.icon, 'shrink-0 text-base-content')}
      <label for="${id}" class="sr-only">Buscar cursos</label>
      <input id="${id}" name="q" type="search" enterkeyhint="search" autocomplete="off" placeholder="${placeholder}"
             class="min-w-0 flex-1 bg-transparent ${s.input} text-base-content outline-none placeholder:text-neutral-text" />${button}
    </form>
  `);
};

/* ── Nav Search ────────────────────────────────────────────────────────────── */

type NavState = 'default' | 'focus' | 'filled';

const NAV_BASE = 'flex h-11 w-full items-center gap-2.5 rounded-full border pl-4 pr-2';
const NAV_IDLE = 'border-base-content/10 bg-surface-subtle';
const NAV_ACTIVE = 'border-primary bg-base-100';
/** Clases reales: el estado enfocado lo pone el navegador con has-[input:focus-visible]. */
const NAV_LIVE = `${NAV_BASE} ${NAV_IDLE} has-[input:focus]:border-primary has-[input:focus]:bg-base-100 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary-text`;

const clearButton = (target: string) =>
  `<button type="button" class="btn btn-ghost btn-circle btn-sm shrink-0" aria-label="Borrar búsqueda" data-clear="${target}">${icon('x', 16)}</button>`;

const navSearch = (id: string, state: NavState | 'live', value = '') => {
  const box = state === 'live' ? NAV_LIVE
    : state === 'default' ? `${NAV_BASE} ${NAV_IDLE}`
    : `${NAV_BASE} ${NAV_ACTIVE}${state === 'focus' ? ' outline-2 outline-offset-2 outline-primary-text' : ''}`;
  return dedent(`
    <form role="search" action="/cursos" class="${box}">
      ${icon('search', 20, 'shrink-0 text-base-content')}
      <label for="${id}" class="sr-only">Buscar cursos</label>
      <input id="${id}" name="q" type="search" enterkeyhint="search" autocomplete="off"${value ? ` value="${value}"` : ''}
             placeholder="Busca cursos, diplomados o temas"
             class="min-w-0 flex-1 truncate bg-transparent text-sm text-base-content outline-none placeholder:text-neutral-text [&::-webkit-search-cancel-button]:hidden" />${value ? '\n      ' + clearButton(id) : ''}
    </form>
  `);
};

/* ── Search Suggest (panel; se documenta en «Sugerencias de búsqueda») ─────── */

const hl = (before: string, match: string, after: string) =>
  `${before}<strong class="font-semibold">${match}</strong>${after}`;

const suggestion = (id: string, html: string, active = false) =>
  `<div id="${id}" role="option" aria-selected="${active}" class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-base-content hover:bg-surface-subtle aria-selected:bg-surface-subtle">${icon('search', 18, 'shrink-0')}<span>${html}</span></div>`;

const result = (id: string, ico: string, title: string, meta: string) => dedent(`
  <div id="${id}" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-subtle aria-selected:bg-surface-subtle">
    <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-400/20 text-primary-text">${icon(ico, 20)}</span>
    <span class="flex min-w-0 flex-col gap-0.5">
      <span class="text-sm font-medium text-base-content">${title}</span>
      <span class="text-xs text-neutral-text">${meta}</span>
    </span>
  </div>
`);

const group = (id: string, label: string, items: string[]) => dedent(`
  <div role="group" aria-labelledby="${id}" class="flex flex-col gap-0.5">
    <div id="${id}" class="px-3 pt-2 pb-1.5 text-xs font-semibold text-neutral-text">${label}</div>
    ${ind(items.join('\n'), 4)}
  </div>
`);

/** Panel de sugerencias mientras se escribe «ética». `p` = prefijo único de ids. */
export const suggestPanel = (p: string) => dedent(`
  <div id="${p}-lista" role="listbox" aria-label="Sugerencias de búsqueda" class="flex flex-col gap-2 bg-base-100 p-2">
    ${ind(group(`${p}-g1`, 'Sugerencias', [
      suggestion(`${p}-s1`, hl('', 'ética', ' pública'), true),
      suggestion(`${p}-s2`, hl('', 'ética', ' y transparencia')),
      suggestion(`${p}-s3`, hl('código de ', 'ética', '')),
    ]), 4)}
    ${ind(group(`${p}-g2`, 'Cursos y programas', [
      result(`${p}-c1`, 'book-open', 'Ética y valores en el Servicio Civil', 'Curso · Ética y transparencia · Edición 2'),
      result(`${p}-c2`, 'award', 'Curso y Certificación de Conocimientos en Administración Pública', 'Curso con opción a certificación · Nivel básico'),
    ]), 4)}
    ${ind(group(`${p}-g3`, 'Área de formación', [
      result(`${p}-a1`, 'shield-check', 'Ética, transparencia y rendición de cuentas', 'Área · 12 cursos'),
    ]), 4)}
    <div id="${p}-todos" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-1.5 rounded-lg border-t border-base-content/10 px-3 pt-3 pb-2 text-sm font-medium text-primary-text hover:underline aria-selected:bg-surface-subtle">
      Ver todos los resultados para «ética» ${icon('arrow-right', 16)}
    </div>
  </div>
`);

/* ── Mobile Search ─────────────────────────────────────────────────────────── */

const LOGO = `<img src="brand/logo-color.svg" alt="" width="109" height="67" class="w-[109px] dark:hidden" /><img src="brand/logo-white.svg" alt="" width="109" height="67" class="hidden w-[109px] dark:block" />`;

const mobileSearch = (p: string) => dedent(`
  <div role="dialog" aria-label="Buscar cursos" class="flex min-h-[38rem] flex-col bg-base-100">
    <div class="flex h-21 items-center justify-between pr-2 pl-4">
      <a href="#" aria-label="INAP, ir al inicio">${LOGO}</a>
      <button type="button" class="btn btn-ghost btn-square size-11" aria-label="Cerrar búsqueda">${icon('x', 22)}</button>
    </div>
    <div class="flex h-18 items-center pr-4 pl-2">
      <form role="search" action="/cursos" class="${NAV_BASE} ${NAV_ACTIVE}">
        ${icon('search', 20, 'shrink-0 text-base-content')}
        <label for="${p}-q" class="sr-only">Buscar cursos</label>
        <input id="${p}-q" name="q" type="search" enterkeyhint="search" autocomplete="off" value="ética"
               role="combobox" aria-expanded="true" aria-controls="${p}-lista" aria-autocomplete="list" aria-activedescendant="${p}-s1"
               class="min-w-0 flex-1 truncate bg-transparent text-sm text-base-content outline-none [&::-webkit-search-cancel-button]:hidden" />
        ${clearButton(`${p}-q`)}
      </form>
    </div>
    ${ind(suggestPanel(p), 4)}
  </div>
`);

export const buscador: ComponentDoc = {
  figmaNode: '59-85',
  intro: `<p>Tres formas del mismo buscador de cursos: el del hero del Home (<strong>Hero Search</strong>), el de la barra en las demás páginas (<strong>Nav Search</strong>) y la búsqueda a pantalla completa en celular (<strong>Mobile Search</strong>). Todos llevan a la página de resultados (<code>/cursos?q=…</code>).</p>`,
  examples: [
    {
      title: 'Hero Search · Escritorio',
      description: 'En el hero del Home. Botón «Buscar» lg. El marcador de posición cambia con el selector de audiencia.',
      previewClass: 'bg-surface-subtle p-8',
      html: heroSearch('hero-lg', 'lg'),
    },
    {
      title: 'Hero Search · Celular',
      description: 'Sin botón: se envía con la tecla de búsqueda del teclado (enterkeyhint="search").',
      previewClass: 'flex flex-col gap-4 bg-surface-subtle p-6',
      html: [heroSearch('hero-md', 'md'), heroSearch('hero-md-i', 'md', '¿Qué necesita aprender tu equipo?')].join('\n\n'),
    },
    {
      title: 'Nav Search · Estados',
      description: 'Normal, enfocado y con texto. El estado enfocado se muestra fijo solo para la vista previa; en la página lo pone el navegador.',
      previewClass: 'flex flex-col gap-4 p-6 [&>*]:max-w-90',
      html: [navSearch('nav-a', 'default'), navSearch('nav-b', 'focus'), navSearch('nav-c', 'filled', 'ética')].join('\n\n'),
    },
    {
      title: 'Mobile Search',
      description: 'Se abre a pantalla completa desde la lupa de la barra en celular, con el teclado activo. Muestra el panel de sugerencias.',
      previewClass: 'flex justify-center bg-surface-subtle [&>*]:w-full [&>*]:max-w-[390px]',
      html: mobileSearch('movil'),
    },
  ],
  usage: {
    html: `<ul>
      <li><strong>Hero Search</strong> solo en el Home. Ahí el Nav Search de la barra empieza oculto y aparece cuando el del hero sale de la vista (patrón «Mostrar u ocultar al desplazar»). En las demás páginas el Nav Search siempre está visible.</li>
      <li><strong>Nav Search</strong> ocupa el espacio libre entre el menú y las acciones de la barra (ancho flexible). Al enfocarlo se abre el panel de sugerencias.</li>
      <li>En celular la barra muestra solo la lupa (botón de 44 px). Al tocarla se abre <strong>Mobile Search</strong>; al cerrarla se conserva lo escrito.</li>
      <li>Marcador de posición del hero: «¿Qué quieres aprender hoy?» (Para ti) o «¿Qué necesita aprender tu equipo?» (Para tu institución). Barra: «Busca cursos, diplomados o temas».</li>
      <li>En la página de resultados, el Nav Search muestra el texto buscado para poder corregirlo.</li>
      <li>Atajo «/»: enfoca el buscador de la barra, salvo cuando el foco está en otro campo.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Landmark:</strong> <code>&lt;form role="search"&gt;</code>. Si hay dos buscadores en la misma página (Home), el de la barra está oculto mientras el del hero se ve, así que nunca se anuncian dos a la vez.</li>
    <li><strong>Etiqueta:</strong> <code>&lt;label class="sr-only"&gt;</code> «Buscar cursos». El marcador de posición no reemplaza la etiqueta.</li>
    <li><strong>Envío sin botón:</strong> en celular el formulario se envía con Enter; <code>enterkeyhint="search"</code> muestra «Buscar» en el teclado.</li>
    <li><strong>Foco:</strong> anillo de 2 px <code>primary-text</code> en el contenedor (<code>has-[input:focus-visible]</code>), además del borde <code>primary</code>.</li>
    <li><strong>Borrar:</strong> botón con <code>aria-label="Borrar búsqueda"</code>; al usarlo, el foco regresa al campo. Se oculta la X nativa del navegador para no tener dos.</li>
    <li><strong>Mobile Search:</strong> diálogo modal (<code>&lt;dialog&gt;</code> con <code>showModal()</code>) con <code>aria-label="Buscar cursos"</code>. El foco entra al campo; Esc o «Cerrar búsqueda» lo cierran y el foco regresa a la lupa.</li>
    <li><strong>Contraste:</strong> marcador de posición <code>neutral-text</code> sobre <code>surface-subtle</code> y <code>base-2</code>, más de 4.5:1 en los dos temas; borde del hero <code>base-border</code>, más de 3:1.</li>
  </ul>`,
  classes: [
    ['flex items-center rounded-full border border-base-border bg-base-2', 'Hero Search, contenedor.'],
    ['h-16 max-w-160 pl-6 pr-2 shadow-lg', 'Hero Search escritorio (640 px).'],
    ['h-13 pl-4.5 pr-1.5 shadow-md', 'Hero Search celular, a todo el ancho.'],
    ['btn btn-primary btn-lg rounded-full', 'Botón «Buscar» (solo escritorio).'],
    ['h-11 rounded-full border border-base-content/10 bg-surface-subtle pl-4 pr-2', 'Nav Search en reposo.'],
    ['has-[input:focus]:border-primary has-[input:focus]:bg-base-100', 'Nav Search enfocado o con texto.'],
    ['has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary-text', 'Anillo de foco en el contenedor.'],
    ['min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-text', 'Campo dentro del contenedor.'],
    ['btn btn-ghost btn-circle btn-sm', 'Botón «Borrar búsqueda» (32 px).'],
  ],
  codeNotes: `<p>Un solo componente <code>inap-search</code> con entrada <code>variant</code> (<code>hero</code> o <code>nav</code>). El envío navega a <code>/cursos</code> con <code>queryParams: { q }</code>; el catálogo lee el parámetro. El panel de sugerencias se documenta aparte.</p>`,
  snippets: [
    { title: 'Hero Search responsive', language: 'HTML', code: heroSearch('hero-q', 'responsive') },
    { title: 'Nav Search', language: 'HTML', code: navSearch('nav-q', 'live') },
    { title: 'Envío y borrar', language: 'TypeScript', code: dedent(`
      readonly q = signal('');
      private readonly router = inject(Router);
      private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('campo');

      submit(event: Event): void {
        event.preventDefault();
        const q = this.q().trim();
        if (q) this.router.navigate(['/cursos'], { queryParams: { q } });
      }

      clear(): void {
        this.q.set('');
        this.input().nativeElement.focus();
      }
    `) },
    { title: 'Atajo «/»', language: 'TypeScript', code: dedent(`
      @HostListener('document:keydown', ['$event'])
      onKey(e: KeyboardEvent): void {
        const t = e.target as HTMLElement;
        if (e.key !== '/' || t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
        e.preventDefault();
        this.input().nativeElement.focus();
      }
    `) },
  ],
};
