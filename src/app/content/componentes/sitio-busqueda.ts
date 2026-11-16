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
    <form role="search" action="/busqueda" class="flex w-full items-center rounded-full border border-base-border bg-base-2 ${s.box} has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary-text">
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

/** `wp` = buscador de WordPress (noticias y páginas, `?s=`). */
export const navSearch = (id: string, state: NavState | 'live', value = '', wp = false) => {
  const box = state === 'live' ? NAV_LIVE
    : state === 'default' ? `${NAV_BASE} ${NAV_IDLE}`
    : `${NAV_BASE} ${NAV_ACTIVE}${state === 'focus' ? ' outline-2 outline-offset-2 outline-primary-text' : ''}`;
  return dedent(`
    <form role="search" action="${wp ? '/' : '/busqueda'}" class="${box}">
      ${icon('search', 20, 'shrink-0 text-base-content')}
      <label for="${id}" class="sr-only">${wp ? 'Buscar en el sitio' : 'Buscar cursos'}</label>
      <input id="${id}" name="${wp ? 's' : 'q'}" type="search" enterkeyhint="search" autocomplete="off"${value ? ` value="${value}"` : ''}
             placeholder="${wp ? 'Busca noticias, eventos o páginas' : 'Busca cursos, diplomados o temas'}"
             class="min-w-0 flex-1 truncate bg-transparent text-sm text-base-content outline-none placeholder:text-neutral-text [&::-webkit-search-cancel-button]:hidden" />${value ? '\n      ' + clearButton(id) : ''}
    </form>
  `);
};

/* ── Search Suggest (panel; se documenta en «Sugerencias de búsqueda») ─────── */

const hl = (before: string, match: string, after: string) =>
  `${before}<strong class="font-semibold">${match}</strong>${after}`;

/** Fila de texto: sugerencia (lupa) o búsqueda reciente (reloj). */
const suggestion = (id: string, html: string, active = false, ico = 'search') =>
  `<div id="${id}" role="option" aria-selected="${active}" class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-base-content hover:bg-surface-subtle aria-selected:bg-surface-subtle">${icon(ico, 18, 'shrink-0')}<span>${html}</span></div>`;

const recent = (id: string, text: string) => suggestion(id, text, false, 'history');

/** Búsqueda popular: opción con forma de Chip. */
const chipOption = (id: string, label: string) =>
  `<div id="${id}" role="option" aria-selected="false" class="inline-flex h-9 cursor-pointer items-center rounded-full border border-base-border px-4 text-sm font-medium text-base-content hover:border-base-content hover:bg-base-content/10 aria-selected:border-base-content aria-selected:bg-base-content/10">${label}</div>`;

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

/** Populares: la etiqueta y los chips en una fila que se envuelve. */
const chipGroup = (id: string, label: string, chips: string[]) => dedent(`
  <div role="group" aria-labelledby="${id}" class="flex flex-col gap-2">
    <div id="${id}" class="px-3 pt-2 text-xs font-semibold text-neutral-text">${label}</div>
    <div class="flex flex-wrap gap-2 px-3 pb-2">
      ${ind(chips.join('\n'), 6)}
    </div>
  </div>
`);

const allResults = (id: string, q: string) => dedent(`
  <div id="${id}" role="option" aria-selected="false" class="flex cursor-pointer items-center gap-1.5 border-t border-base-content/10 px-3 pt-3 pb-2 text-sm font-medium text-primary-text hover:underline aria-selected:bg-surface-subtle">
    Ver todos los resultados para «${q}» ${icon('arrow-right', 16)}
  </div>
`);

/** Solo WordPress: lleva a la búsqueda de cursos de Angular. Con borde arriba si no hay «Ver todos» antes. */
const platformLink = (id: string, border: boolean) => dedent(`
  <div id="${id}" role="option" aria-selected="false" class="group flex cursor-pointer items-center gap-1.5 px-3 pb-2${border ? ' border-t border-base-content/10 pt-3' : ''} aria-selected:bg-surface-subtle">
    <span class="text-xs text-neutral-text">¿Buscas cursos?</span>
    <span class="text-sm font-medium text-primary-text group-hover:underline">Ir a la plataforma de cursos</span>
    ${icon('arrow-right', 16, 'text-primary-text')}
  </div>
`);

/** Marco del panel bajo el buscador de la barra (en Mobile Search ocupa la pantalla sin marco). */
const FRAME = ' w-full max-w-140 rounded-xl border border-base-content/10 shadow-xl';

const listbox = (p: string, parts: string[], framed: boolean) => dedent(`
  <div id="${p}-lista" role="listbox" aria-label="Sugerencias de búsqueda" class="flex flex-col gap-2 bg-base-100 p-2${framed ? FRAME : ''}">
    ${ind(parts.join('\n'), 4)}
  </div>
`);

type Platform = 'angular' | 'wordpress';

/** Campo vacío: recientes, populares y un grupo para explorar. */
const recentPanel = (p: string, platform: Platform) => {
  const wp = platform === 'wordpress';
  return listbox(p, [
    group(`${p}-g1`, 'Búsquedas recientes', wp
      ? [recent(`${p}-r1`, 'Informe de labores 2025'), recent(`${p}-r2`, 'Convocatorias')]
      : [recent(`${p}-r1`, 'Ética pública'), recent(`${p}-r2`, 'Presupuesto municipal')]),
    chipGroup(`${p}-g2`, 'Populares', (wp
      ? ['Convocatorias', 'Acceso a la información', 'Informes', 'Eventos 2026', 'Directorio institucional']
      : ['Gestión pública', 'Finanzas públicas', 'Liderazgo', 'Transformación digital', 'Ética y transparencia']
    ).map((l, i) => chipOption(`${p}-p${i + 1}`, l))),
    wp
      ? group(`${p}-g3`, 'Explora por sección', [
          result(`${p}-e1`, 'newspaper', 'Noticias', '124 publicaciones'),
          result(`${p}-e2`, 'scale', 'Transparencia', 'Información pública de oficio'),
        ])
      : group(`${p}-g3`, 'Explora por tipo', [
          result(`${p}-e1`, 'award', 'Cursos con opción a certificación', '48 cursos'),
          result(`${p}-e2`, 'graduation-cap', 'Estudios de posgrado', '6 programas'),
        ]),
    ...(wp ? [platformLink(`${p}-cursos`, true)] : []),
  ], true);
};

/** Mientras se escribe «ética». `p` = prefijo único de ids; `framed` = false en Mobile Search. */
const typingPanel = (p: string, platform: Platform, framed: boolean) => {
  const wp = platform === 'wordpress';
  return listbox(p, [
    group(`${p}-g1`, 'Sugerencias', [
      suggestion(`${p}-s1`, hl('', 'ética', ' pública'), true),
      suggestion(`${p}-s2`, hl('', 'ética', ' y transparencia')),
      suggestion(`${p}-s3`, hl(wp ? 'comisión de ' : 'código de ', 'ética', '')),
    ]),
    wp
      ? group(`${p}-g2`, 'Noticias y eventos', [
          result(`${p}-c1`, 'newspaper', 'INAP fortalece la ética en el servicio público', 'Noticia · 12 de octubre de 2026'),
          result(`${p}-c2`, 'calendar', 'Foro: ética y transparencia en la gestión pública', 'Evento · 20 de noviembre de 2026'),
        ])
      : group(`${p}-g2`, 'Cursos y programas', [
          result(`${p}-c1`, 'book-open', 'Ética y valores en el Servicio Civil', 'Curso · Ética y transparencia · Edición 2'),
          result(`${p}-c2`, 'award', 'Curso y Certificación de Conocimientos en Administración Pública', 'Curso con opción a certificación · Nivel básico'),
        ]),
    wp
      ? group(`${p}-g3`, 'Páginas', [result(`${p}-a1`, 'file-text', 'Código de ética institucional', 'Transparencia · Documento')])
      : group(`${p}-g3`, 'Área de formación', [result(`${p}-a1`, 'shield-check', 'Ética, transparencia y rendición de cuentas', 'Área · 12 cursos')]),
    allResults(`${p}-todos`, 'ética'),
    ...(wp ? [platformLink(`${p}-cursos`, false)] : []),
  ], framed);
};

/** Panel de Mobile Search (Angular, escribiendo, sin marco). */
export const suggestPanel = (p: string) => typingPanel(p, 'angular', false);

/* ── Mobile Search ─────────────────────────────────────────────────────────── */

export const LOGO = `<img src="brand/logo-color.svg" alt="" width="109" height="67" class="w-[109px] dark:hidden" /><img src="brand/logo-white.svg" alt="" width="109" height="67" class="hidden w-[109px] dark:block" />`;

const mobileSearch = (p: string) => dedent(`
  <div role="dialog" aria-label="Buscar cursos" class="flex min-h-[38rem] flex-col bg-base-100">
    <div class="flex h-21 items-center justify-between pr-2 pl-4">
      <a href="#" aria-label="INAP, ir al inicio">${LOGO}</a>
      <button type="button" class="btn btn-ghost btn-square size-11" aria-label="Cerrar búsqueda">${icon('x', 22)}</button>
    </div>
    <div class="flex h-18 items-center pr-4 pl-2">
      <form role="search" action="/busqueda" class="${NAV_BASE} ${NAV_ACTIVE}">
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
  intro: `<p>Tres formas del mismo buscador de cursos: el del hero del Home (<strong>Hero Search</strong>), el de la barra en las demás páginas (<strong>Nav Search</strong>) y la búsqueda a pantalla completa en celular (<strong>Mobile Search</strong>). Todos llevan a la página de resultados (<code>/busqueda?q=…</code>).</p>`,
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
  codeNotes: `<p>Un solo componente <code>inap-search</code> con entrada <code>variant</code> (<code>hero</code> o <code>nav</code>). El envío navega a <code>/busqueda</code> con <code>queryParams: { q }</code>; la página de resultados lee el parámetro. El panel se documenta en <a href="componentes/sugerencias">Sugerencias de búsqueda</a>.</p>`,
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
        if (q) this.router.navigate(['/busqueda'], { queryParams: { q } });
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

/* ── Sugerencias de búsqueda ───────────────────────────────────────────────── */

/** Nav Search conectado al panel (patrón combobox). */
const comboSearch = (p: string, value: string, active: string) => dedent(`
  <form role="search" action="/busqueda" class="${NAV_BASE} ${NAV_ACTIVE} max-w-140 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary-text">
    ${icon('search', 20, 'shrink-0 text-base-content')}
    <label for="${p}-q" class="sr-only">Buscar cursos</label>
    <input id="${p}-q" name="q" type="search" enterkeyhint="search" autocomplete="off" value="${value}"
           role="combobox" aria-expanded="true" aria-controls="${p}-lista" aria-autocomplete="list" aria-activedescendant="${active}"
           placeholder="Busca cursos, diplomados o temas"
           class="min-w-0 flex-1 truncate bg-transparent text-sm text-base-content outline-none placeholder:text-neutral-text [&::-webkit-search-cancel-button]:hidden" />
    ${clearButton(`${p}-q`)}
  </form>
`);

export const sugerencias: ComponentDoc = {
  figmaNode: '86-528',
  intro: `<p>Panel que se abre bajo el buscador (<a href="componentes/buscador">Nav Search</a> y Mobile Search). Con el campo vacío muestra búsquedas recientes, populares y accesos para explorar; al escribir, sugerencias de texto y resultados agrupados. Cada plataforma busca solo lo suyo: Angular, cursos; WordPress, noticias y páginas, con un enlace a la búsqueda de cursos.</p>`,
  examples: [
    {
      title: 'Con el buscador',
      description: 'Angular, escribiendo «ética». La primera sugerencia está activa (aria-activedescendant) y se marca con surface-subtle.',
      previewClass: 'flex flex-col gap-2 bg-surface-subtle p-6',
      html: [comboSearch('sg-combo', 'ética', 'sg-combo-s1'), typingPanel('sg-combo', 'angular', true)].join('\n'),
    },
    {
      title: 'Angular · Campo vacío',
      description: 'Al enfocar el campo sin texto: búsquedas recientes (guardadas en el dispositivo), populares y tipos de curso.',
      previewClass: 'bg-surface-subtle p-6',
      html: recentPanel('sg-ar', 'angular'),
    },
    {
      title: 'WordPress · Campo vacío',
      description: 'Explora por sección en lugar de por tipo. Al final, el enlace a la plataforma de cursos.',
      previewClass: 'bg-surface-subtle p-6',
      html: recentPanel('sg-wr', 'wordpress'),
    },
    {
      title: 'WordPress · Escribiendo',
      description: 'Noticias y eventos, páginas y «Ver todos los resultados»; el enlace a cursos sigue al final.',
      previewClass: 'bg-surface-subtle p-6',
      html: typingPanel('sg-wt', 'wordpress', true),
    },
  ],
  usage: {
    html: `<ul>
      <li><strong>Se abre</strong> al enfocar el buscador (campo vacío) y se actualiza al escribir. Se cierra con Esc, al hacer clic fuera o al elegir una opción.</li>
      <li><strong>Búsquedas recientes:</strong> las últimas 5, guardadas en el dispositivo (<code>localStorage</code>). Si no hay, el grupo no se muestra.</li>
      <li><strong>Populares</strong> y <strong>Explora por tipo / por sección:</strong> listas que define INAP; los números salen de los datos.</li>
      <li><strong>Al escribir:</strong> hasta 3 sugerencias de texto con la coincidencia en negrita, hasta 2 resultados por grupo y «Ver todos los resultados para «…»», que lleva a la página de resultados.</li>
      <li><strong>Grupos por plataforma:</strong> Angular, «Cursos y programas» y «Área de formación»; WordPress, «Noticias y eventos» y «Páginas». Ninguna muestra resultados de la otra.</li>
      <li><strong>Solo WordPress:</strong> «¿Buscas cursos? Ir a la plataforma de cursos» va siempre al final. Lleva a <code>/busqueda</code> de Angular con <code>?q=…</code> si hay texto; misma pestaña, sin ícono de enlace externo.</li>
      <li>Ancho de 560 px bajo la barra. En celular, el mismo contenido llena la pantalla de Mobile Search, sin borde ni sombra.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Patrón combobox</strong> (lista con foco en el campo): el campo tiene <code>role="combobox"</code>, <code>aria-expanded</code>, <code>aria-controls</code> (id de la lista) y <code>aria-autocomplete="list"</code>. El panel es <code>role="listbox"</code> con <code>aria-label="Sugerencias de búsqueda"</code>; cada grupo, <code>role="group"</code> con <code>aria-labelledby</code> a su título.</li>
    <li><strong>Foco:</strong> nunca sale del campo. La opción activa se indica con <code>aria-activedescendant</code> en el campo y <code>aria-selected="true"</code> en la opción, que se ve con fondo <code>surface-subtle</code>.</li>
    <li><strong>Teclado:</strong> ↓ abre el panel y baja a la siguiente opción; ↑ sube (de la primera pasa a la última); Enter abre la opción activa o, si no hay, envía la búsqueda; Esc cierra el panel y, si ya está cerrado, borra el campo.</li>
    <li><strong>Chips de Populares:</strong> son opciones de la misma lista, en el orden en que se leen; las flechas pasan por ellos.</li>
    <li><strong>Anuncio:</strong> al terminar de escribir, una región <code>role="status"</code> oculta dice cuántas opciones hay («6 sugerencias»), con pausa de 500 ms para no anunciar cada tecla.</li>
    <li><strong>Íconos:</strong> decorativos (<code>aria-hidden</code>); el tipo está en la línea de detalle.</li>
    <li><strong>Contraste:</strong> títulos de grupo y detalle <code>neutral-text</code> sobre <code>base-100</code> y <code>surface-subtle</code>, 4.5:1 o más en los dos temas; ícono sobre <code>primary-400/20</code> en <code>primary-text</code>; borde de chip <code>base-border</code>, 3:1.</li>
  </ul>`,
  classes: [
    ['flex flex-col gap-2 bg-base-100 p-2', 'Panel (listbox).'],
    ['w-full max-w-140 rounded-xl border border-base-content/10 shadow-xl', 'Marco bajo la barra (560 px). Sin marco en Mobile Search.'],
    ['px-3 pt-2 pb-1.5 text-xs font-semibold text-neutral-text', 'Título de grupo.'],
    ['flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm', 'Sugerencia o búsqueda reciente (ícono 18 px).'],
    ['flex items-center gap-3 rounded-lg px-3 py-2', 'Resultado con miniatura.'],
    ['size-10 rounded-lg bg-primary-400/20 text-primary-text', 'Miniatura con ícono 20 px.'],
    ['hover:bg-surface-subtle aria-selected:bg-surface-subtle', 'Opción activa (teclado) y hover.'],
    ['inline-flex h-9 rounded-full border border-base-border px-4 text-sm font-medium', 'Popular (forma de Chip).'],
    ['border-t border-base-content/10 px-3 pt-3 pb-2 text-sm font-medium text-primary-text', '«Ver todos los resultados» y enlace a cursos.'],
  ],
  codeNotes: `<p>Parte de <code>inap-search</code>: el panel es un <code>@if (open())</code> bajo el campo. Los grupos llegan como datos (<code>{ label, items }</code>) y cada opción lleva un índice plano para las flechas. En WordPress, la misma estructura en el tema con JS sin framework.</p>`,
  snippets: [
    { title: 'Campo y panel', language: 'HTML · Angular', code: dedent(`
      <input #campo id="q" type="search" role="combobox" autocomplete="off"
             aria-controls="sugerencias" aria-autocomplete="list"
             [attr.aria-expanded]="open()"
             [attr.aria-activedescendant]="active() >= 0 ? 'op-' + active() : null"
             [value]="q()" (input)="q.set(campo.value); open.set(true)"
             (focus)="open.set(true)" (keydown)="onKeydown($event)" />

      @if (open()) {
        <div id="sugerencias" role="listbox" aria-label="Sugerencias de búsqueda"
             class="flex w-full max-w-140 flex-col gap-2 rounded-xl border border-base-content/10 bg-base-100 p-2 shadow-xl">
          @for (g of groups(); track g.label) {
            <div role="group" [attr.aria-labelledby]="'g-' + $index" class="flex flex-col gap-0.5">
              <div [id]="'g-' + $index" class="px-3 pt-2 pb-1.5 text-xs font-semibold text-neutral-text">{{ g.label }}</div>
              @for (o of g.items; track o.index) {
                <div [id]="'op-' + o.index" role="option" [attr.aria-selected]="active() === o.index"
                     (mousedown)="$event.preventDefault()" (click)="choose(o)"
                     class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-surface-subtle aria-selected:bg-surface-subtle">
                  …
                </div>
              }
            </div>
          }
        </div>
      }
      <p role="status" class="sr-only">{{ announcement() }}</p>
    `) },
    { title: 'Teclado', language: 'TypeScript', code: dedent(`
      readonly open = signal(false);
      readonly active = signal(-1);
      readonly options = computed(() => this.groups().flatMap((g) => g.items));

      onKeydown(e: KeyboardEvent): void {
        const n = this.options().length;
        const i = this.active();
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowUp': {
            e.preventDefault();
            this.open.set(true);
            if (!n) return;
            const down = e.key === 'ArrowDown';
            this.active.set(i < 0 ? (down ? 0 : n - 1) : (i + (down ? 1 : -1) + n) % n);
            document.getElementById('op-' + this.active())?.scrollIntoView({ block: 'nearest' });
            break;
          }
          case 'Enter':
            if (this.open() && i >= 0) {
              e.preventDefault();
              this.choose(this.options()[i]);
            } // sin opción activa, el formulario se envía
            break;
          case 'Escape':
            if (this.open()) this.close();
            else this.q.set('');
            break;
        }
      }

      close(): void {
        this.open.set(false);
        this.active.set(-1);
      }
    `) },
    { title: 'Búsquedas recientes', language: 'TypeScript', code: dedent(`
      private readonly key = 'inap-busquedas';

      recent(): string[] {
        try {
          return JSON.parse(localStorage.getItem(this.key) ?? '[]');
        } catch {
          return [];
        }
      }

      remember(q: string): void {
        const list = [q, ...this.recent().filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 5);
        try {
          localStorage.setItem(this.key, JSON.stringify(list));
        } catch {
          /* modo privado */
        }
      }
    `) },
  ],
};
