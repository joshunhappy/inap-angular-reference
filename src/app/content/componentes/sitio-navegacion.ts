import { dedent } from '../../core/dedent';
import { LOGO, navSearch } from './sitio-busqueda';
import { ComponentDoc, icon } from './types';

/** Sangra las líneas siguientes de un bloque insertado dentro de otra plantilla. */
const ind = (html: string, n: number) => html.replace(/\n/g, '\n' + ' '.repeat(n));

/*
  Anillos de foco explícitos: el CSS de WordPress no trae la regla global de foco del sitio
  de referencia, así que cada elemento de la barra y del pie lleva el suyo.
  Sobre azul oscuro (brand-surface) el anillo es blanco: primary-text no llega a 3:1 ahí.
*/
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text';
const FOCUS_INV = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-surface-content';

/* ── Barra de navegación ───────────────────────────────────────────────────── */

type Platform = 'angular' | 'wordpress';

const MENU: Record<Platform, { label: string; mega: boolean }[]> = {
  angular: [
    { label: 'Cursos', mega: true },
    { label: 'Áreas de formación', mega: false },
    { label: 'Programas', mega: false },
    { label: 'Cómo inscribirse', mega: false },
  ],
  wordpress: [
    { label: 'Formación', mega: true },
    { label: 'Fortalecimiento', mega: true },
    { label: 'Recursos', mega: true },
    { label: 'Institución', mega: true },
  ],
};

const UTILITY: Record<Platform, string[]> = {
  angular: ['Portal institucional', 'Ayuda'],
  wordpress: ['Noticias', 'Eventos', 'Transparencia', 'Contacto'],
};

const ITEM = `flex items-center gap-1 rounded-lg py-2.5 pr-2.5 pl-3 text-sm font-medium text-base-content transition-colors hover:bg-surface-subtle ${FOCUS}`;

/** Ítem del menú: botón que abre un mega menú (chevron) o enlace directo. */
const navItem = (p: string, i: number, label: string, mega: boolean) =>
  mega
    ? `<li><button type="button" class="group ${ITEM} aria-expanded:bg-surface-subtle aria-expanded:text-primary-text" aria-expanded="false" aria-controls="${p}-mega-${i}">${label}${icon('chevron-down', 16, 'transition-transform group-aria-expanded:rotate-180')}</button></li>`
    : `<li><a href="#" class="${ITEM}">${label}</a></li>`;

const utilityBar = (platform: Platform) => dedent(`
  <div class="bg-brand-surface">
    <div class="mx-auto flex h-9 max-w-360 items-center justify-between px-20 text-xs">
      <ul class="flex items-center gap-6">
        ${ind(UTILITY[platform].map((l) => `<li><a href="#" class="rounded-sm text-brand-surface-muted hover:text-brand-surface-content hover:underline ${FOCUS_INV}">${l}</a></li>`).join('\n'), 8)}
      </ul>
      <div class="flex items-center gap-4">
        <a href="#" target="_blank" rel="noopener" class="flex items-center gap-1 rounded-sm text-brand-surface-content hover:underline ${FOCUS_INV}">
          Aula virtual ${icon('arrow-up-right', 12)}<span class="sr-only">(se abre en una pestaña nueva)</span>
        </a>
        <span class="h-4 w-px bg-brand-surface-muted" aria-hidden="true"></span>
        <button type="button" aria-pressed="false" class="flex items-center gap-1.5 rounded-sm text-brand-surface-content hover:underline ${FOCUS_INV}">
          ${icon('moon', 14)}Modo oscuro
        </button>
      </div>
    </div>
  </div>
`);

const LOGO_LINK = `<a href="/" aria-label="INAP, ir al inicio" class="shrink-0 rounded-sm ${FOCUS}">${LOGO}</a>`;

const AVATAR = `<span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-content" aria-hidden="true">JD</span>`;

const userButton = (p: string) =>
  `<button type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="${p}-cuenta" class="flex h-11 items-center gap-2 rounded-full py-1.5 pr-3 pl-1 text-sm font-semibold text-base-content hover:bg-surface-subtle aria-expanded:bg-surface-subtle ${FOCUS}">${AVATAR}Josué${icon('chevron-down', 16)}</button>`;

const authButtons = dedent(`
  <a href="#" class="btn btn-ghost">Iniciar sesión</a>
  <a href="#" class="btn btn-primary">Regístrate</a>
`);

/** Escritorio: barra superior (36 px) + barra principal (80 px). */
const navbarDesktop = (p: string, platform: Platform, signedIn = false) => dedent(`
  <header class="border-b border-base-content/10 bg-base-100">
    ${ind(utilityBar(platform), 4)}
    <nav aria-label="Principal" class="mx-auto flex h-20 max-w-360 items-center gap-6 px-20">
      ${LOGO_LINK}
      <ul class="flex shrink-0 items-center gap-0.5">
        ${ind(MENU[platform].map((m, i) => navItem(p, i, m.label, m.mega)).join('\n'), 8)}
      </ul>
      <div class="min-w-0 flex-1">
        ${ind(navSearch(`${p}-q`, 'live', '', platform === 'wordpress'), 8)}
      </div>
      <div class="flex shrink-0 items-center gap-2">
        ${ind(signedIn ? userButton(p) : authButtons, 8)}
      </div>
    </nav>
  </header>
`);

const iconButton = (ico: string, label: string, extra = '') =>
  `<button type="button" class="btn btn-ghost btn-circle size-11 ${FOCUS}" aria-label="${label}"${extra}>${icon(ico, 22)}</button>`;

/** Celular (84 px): logo y acciones. Angular sin sesión usa «Regístrate» lg, como en Figma. */
const navbarMobile = (p: string, platform: Platform, signedIn = false) => {
  const search = iconButton('search', 'Buscar', ` aria-haspopup="dialog" aria-controls="${p}-buscar"`);
  const menu = iconButton('menu', 'Menú', ` aria-haspopup="dialog" aria-controls="${p}-menu"`);
  const account = `<button type="button" class="btn btn-ghost btn-circle size-11 ${FOCUS}" aria-label="Mi cuenta" aria-haspopup="dialog" aria-controls="${p}-cuenta">${AVATAR}</button>`;
  const register = `<a href="#" class="btn btn-primary${platform === 'angular' ? ' btn-lg' : ''}">Regístrate</a>`;
  const actions = signedIn ? [search, account, menu] : [search, menu, register];
  return dedent(`
    <header class="flex h-21 items-center justify-between border-b border-base-content/10 bg-base-100 pr-2 pl-4">
      ${LOGO_LINK}
      <div class="flex items-center">
        ${ind(actions.join('\n'), 8)}
      </div>
    </header>
  `);
};

/** Escritorio a 1280 px, mostrado al 82 % para que quepa en la vista previa (solo la vista previa). */
const DESKTOP_PREVIEW = 'overflow-x-auto bg-surface-subtle p-0 [&>*]:w-[1280px] [&>*]:[zoom:0.82]';
const MOBILE_PREVIEW = 'flex justify-center bg-surface-subtle p-6 [&>*]:w-full [&>*]:max-w-[390px]';

export const barraDeNavegacion: ComponentDoc = {
  figmaNode: '62-138',
  intro: `<p>Encabezado de las dos plataformas. Mismo diseño, menú propio: Angular (cursos) con y sin sesión iniciada; WordPress (sitio institucional) siempre sin sesión, con «Iniciar sesión» y «Regístrate» que llevan a Angular. En escritorio, barra superior azul oscuro y barra principal; en celular, logo, lupa, menú y la acción principal.</p>`,
  examples: [
    {
      title: 'Angular · Escritorio · Sin sesión',
      description: '«Cursos» abre el mega menú; los demás son enlaces. Barra superior: Portal institucional, Ayuda, Aula virtual y Modo oscuro.',
      previewClass: DESKTOP_PREVIEW,
      html: navbarDesktop('nb-a', 'angular'),
    },
    {
      title: 'Angular · Escritorio · Sesión iniciada',
      description: 'El botón de usuario (avatar y nombre) abre el menú de cuenta.',
      previewClass: DESKTOP_PREVIEW,
      html: navbarDesktop('nb-ai', 'angular', true),
    },
    {
      title: 'WordPress · Escritorio',
      description: 'Cuatro mega menús, buscador de noticias y páginas. Sin estado de sesión: los botones llevan a Angular.',
      previewClass: DESKTOP_PREVIEW,
      html: navbarDesktop('nb-w', 'wordpress'),
    },
    {
      title: 'Celular',
      description: 'Angular sin sesión, Angular con sesión y WordPress. Cada botón de 44 px abre una vista a pantalla completa.',
      previewClass: MOBILE_PREVIEW.replace('flex justify-center', 'flex flex-col items-center gap-4'),
      html: [navbarMobile('nm-a', 'angular'), navbarMobile('nm-ai', 'angular', true), navbarMobile('nm-w', 'wordpress')].join('\n\n'),
    },
  ],
  usage: {
    html: `<ul>
      <li><strong>Un encabezado por plataforma.</strong> Angular y WordPress lo implementan por separado con el mismo diseño y comportamiento; el menú de cada uno es propio (ver «Consideraciones de desarrollo» §2).</li>
      <li><strong>Escritorio desde 1280 px</strong> (<code>xl</code>). Debajo, la versión de celular.</li>
      <li><strong>Fija al desplazar</strong> (<code>sticky top-0</code>). La barra superior se oculta al bajar y vuelve al subir; la principal siempre se ve.</li>
      <li><strong>Buscador:</strong> ocupa el espacio libre entre el menú y las acciones. En el Home de Angular empieza oculto hasta que el del hero sale de la vista.</li>
      <li><strong>Aula virtual</strong> es el único enlace externo: otra pestaña, ícono <code>arrow-up-right</code>. «Portal institucional» lleva a WordPress en la misma pestaña, sin ícono.</li>
      <li><strong>Celular:</strong> sin sesión, lupa, menú y «Regístrate»; con sesión, lupa, avatar («Mi cuenta») y menú. «Iniciar sesión» va en el pie del menú.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Landmarks:</strong> <code>&lt;header&gt;</code> y <code>&lt;nav aria-label="Principal"&gt;</code>. El primer elemento de la página es el enlace «Saltar al contenido» (patrón «Estructura de página»).</li>
    <li><strong>Logo:</strong> enlace al inicio con <code>aria-label="INAP, ir al inicio"</code>; la imagen va con <code>alt=""</code>.</li>
    <li><strong>Mega menú:</strong> <code>&lt;button aria-expanded aria-controls&gt;</code>. Abierto: fondo <code>surface-subtle</code>, texto <code>primary-text</code> y chevron hacia arriba. Esc cierra y devuelve el foco al botón.</li>
    <li><strong>Modo oscuro:</strong> <code>&lt;button aria-pressed&gt;</code>, <code>true</code> con el tema oscuro activo. La etiqueta no cambia.</li>
    <li><strong>Aula virtual:</strong> <code>target="_blank"</code> con <code>&lt;span class="sr-only"&gt;(se abre en una pestaña nueva)&lt;/span&gt;</code>.</li>
    <li><strong>Botón de usuario:</strong> <code>aria-haspopup="menu"</code> y <code>aria-expanded</code>; el nombre es visible y el avatar es decorativo.</li>
    <li><strong>Celular:</strong> botones de 44 px con <code>aria-label</code> («Buscar», «Menú», «Mi cuenta») y <code>aria-haspopup="dialog"</code>.</li>
    <li><strong>Foco:</strong> anillo de 2 px <code>primary-text</code> en la barra blanca y <code>brand-surface-content</code> (blanco) en la azul oscuro, donde <code>primary-text</code> no llega a 3:1. Va en las clases de cada elemento porque el CSS de WordPress no trae una regla global de foco.</li>
    <li><strong>Contraste:</strong> enlaces de la barra superior <code>brand-surface-muted</code> sobre <code>brand-surface</code>, más de 4.5:1 en los dos temas.</li>
  </ul>`,
  classes: [
    ['sticky top-0 z-40 border-b border-base-content/10 bg-base-100', 'Encabezado.'],
    ['bg-brand-surface', 'Barra superior (36 px, h-9).'],
    ['mx-auto max-w-360 px-20', 'Ancho de contenido en escritorio (1440 px con 80 px a los lados).'],
    ['text-xs text-brand-surface-muted hover:text-brand-surface-content', 'Enlaces de la barra superior.'],
    ['flex h-20 items-center gap-6', 'Barra principal.'],
    ['rounded-lg py-2.5 pr-2.5 pl-3 text-sm font-medium hover:bg-surface-subtle', 'Ítem del menú (Nav Item).'],
    ['aria-expanded:bg-surface-subtle aria-expanded:text-primary-text', 'Ítem con el mega menú abierto.'],
    ['h-11 rounded-full py-1.5 pr-3 pl-1 text-sm font-semibold', 'Botón de usuario.'],
    ['flex h-21 items-center justify-between pr-2 pl-4', 'Barra en celular (84 px).'],
    ['btn btn-ghost btn-circle size-11', 'Botones de ícono en celular (44 px).'],
    ['focus-visible:outline-brand-surface-content', 'Anillo de foco sobre azul oscuro.'],
  ],
  codeNotes: `<p><strong>Angular:</strong> componente <code>inap-navbar</code> con la entrada <code>session</code> (lo da el servicio de autenticación). Usa <code>inap-search</code>, el mega menú y el menú de usuario. <strong>WordPress:</strong> plantilla <code>header.php</code> del tema con las mismas clases; el menú sale de <code>wp_nav_menu</code>, y «Iniciar sesión» y «Regístrate» llevan a las páginas de Angular con URL absolutas. Las clases están en <code>dist/wordpress/inap.css</code>.</p>`,
  snippets: [
    { title: 'Escritorio (Angular, sin sesión)', language: 'HTML', code: navbarDesktop('nav', 'angular') },
    { title: 'Celular (Angular, sin sesión)', language: 'HTML', code: navbarMobile('nav', 'angular') },
    { title: 'Barra superior que se oculta al bajar', language: 'TypeScript', code: dedent(`
      readonly utilityHidden = signal(false);
      private lastY = 0;

      @HostListener('window:scroll')
      onScroll(): void {
        const y = window.scrollY;
        if (Math.abs(y - this.lastY) < 8) return; // evita parpadeo con desplazamientos pequeños
        this.utilityHidden.set(y > this.lastY && y > 36);
        this.lastY = y;
      }
    `) },
  ],
};

/* ── Pie de página ─────────────────────────────────────────────────────────── */

const FOOTER_COLS: [string, string[]][] = [
  ['INAP', ['Conócenos', 'Misión y visión', 'Qué ofrecemos', 'Nuestras delegaciones']],
  ['Ayuda', ['Contáctanos', 'Tutoriales', 'Preguntas frecuentes', 'Agenda de servicios']],
  ['Más', ['Noticias INAP', 'Transparencia', 'Recursos formativos', 'CECODINAP']],
];

const SOCIAL = ['Facebook', 'LinkedIn', 'YouTube', 'X'];

const FLINK = `rounded-sm text-brand-surface-muted hover:text-brand-surface-content hover:underline ${FOCUS_INV}`;

const contactRow = (ico: string, html: string) =>
  `<li class="flex items-start gap-2.5">${icon(ico, 18, 'mt-px shrink-0 text-brand-surface-muted')}<span>${html}</span></li>`;

const footerCol = (p: string, i: number, title: string, links: string[]) => dedent(`
  <div class="flex flex-col gap-3">
    <h2 id="${p}-col${i}" class="text-sm font-semibold text-brand-surface-content">${title}</h2>
    <ul aria-labelledby="${p}-col${i}" class="flex flex-col gap-3">
      ${ind(links.map((l) => `<li><a href="#" class="${FLINK}">${l}</a></li>`).join('\n'), 6)}
    </ul>
  </div>
`);

const footer = (p: string) => dedent(`
  <footer class="relative overflow-hidden bg-brand-surface text-sm">
    <img src="brand/waves.svg" alt="" width="1440" height="411" class="pointer-events-none absolute top-0 left-1/2 w-[1440px] max-w-none -translate-x-1/2 opacity-5" />
    <div class="relative mx-auto flex max-w-360 flex-col gap-8 px-4 pt-10 pb-6 lg:gap-12 lg:px-30 lg:pt-16 lg:pb-8">
      <div class="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div class="flex flex-col gap-6 lg:flex-1">
          <a href="/" aria-label="INAP, ir al inicio" class="self-start rounded-sm ${FOCUS_INV}"><img src="brand/logo-white.svg" alt="" width="109" height="67" class="w-[109px]" /></a>
          <address class="not-italic">
            <ul class="flex flex-col gap-2.5 text-brand-surface-muted">
              ${contactRow('map-pin', 'Boulevard Los Próceres 16-40, zona 10<br />Ciudad de Guatemala')}
              ${contactRow('phone', `<a href="tel:+50224198181" class="${FLINK}">(+502) 2419-8181</a>`)}
              ${contactRow('mail', `<a href="mailto:informacion@inap.gob.gt" class="${FLINK}">informacion@inap.gob.gt</a>`)}
            </ul>
          </address>
        </div>
        <nav aria-label="Pie de página" class="grid grid-cols-2 gap-x-6 gap-y-8 lg:flex lg:gap-16 lg:[&>*]:w-45">
          ${ind(FOOTER_COLS.map(([t, l], i) => footerCol(p, i + 1, t, l)).join('\n'), 10)}
        </nav>
      </div>
      <div class="flex flex-col gap-4 border-t border-brand-surface-line pt-6 text-xs lg:flex-row lg:items-center lg:justify-between lg:pt-8">
        <p class="text-brand-surface-muted">© 2026 INAP — Instituto Nacional de Administración Pública. Guatemala, C. A.</p>
        <ul aria-label="Redes sociales" class="flex gap-5 font-semibold">
          ${ind(SOCIAL.map((s) => `<li><a href="#" class="rounded-sm text-brand-surface-content hover:underline ${FOCUS_INV}">${s}</a></li>`).join('\n'), 10)}
        </ul>
      </div>
    </div>
  </footer>
`);

/** Vista previa de celular dentro de una ventana ancha: quita las clases lg:. */
const mobileOnly = (html: string) => html.replace(/ lg:[^\s"]+/g, '');

export const pieDePagina: ComponentDoc = {
  figmaNode: '62-250',
  intro: `<p>Pie sobre azul oscuro (<code>brand-surface</code>) con las ondas de marca al 5 %. Igual en los dos temas: en oscuro el azul es un poco más profundo. Lleva logo, datos de contacto, tres columnas de enlaces, derechos y redes sociales. Cada plataforma tiene el suyo con el mismo diseño.</p>`,
  examples: [
    {
      title: 'Escritorio',
      description: 'Desde lg (1024 px): logo y contacto a la izquierda, tres columnas de 180 px a la derecha.',
      previewClass: DESKTOP_PREVIEW,
      html: footer('pie'),
    },
    {
      title: 'Celular',
      description: 'Las columnas pasan a dos por fila y los derechos van sobre las redes. Es la misma plantilla sin las clases lg:.',
      previewClass: MOBILE_PREVIEW,
      html: mobileOnly(footer('pie-m')),
    },
  ],
  usage: {
    html: `<ul>
      <li>Va al final de todas las páginas, fuera de <code>&lt;main&gt;</code>.</li>
      <li>Los enlaces del pie no repiten el menú principal: son páginas de consulta (institución, ayuda, transparencia).</li>
      <li>Teléfono y correo son enlaces (<code>tel:</code> y <code>mailto:</code>) para llamar o escribir desde el celular.</li>
      <li>Redes sociales: texto con el nombre de cada red, no solo íconos. Abren en la misma pestaña (son enlaces de INAP).</li>
      <li>El año del aviso de derechos se calcula: <code>new Date().getFullYear()</code> en Angular, <code>date('Y')</code> en WordPress.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Landmarks:</strong> <code>&lt;footer&gt;</code> (contentinfo) y <code>&lt;nav aria-label="Pie de página"&gt;</code>, distinto de la navegación principal.</li>
    <li><strong>Columnas:</strong> título <code>&lt;h2&gt;</code> y lista con <code>aria-labelledby</code>.</li>
    <li><strong>Contacto:</strong> en <code>&lt;address&gt;</code>; íconos decorativos.</li>
    <li><strong>Ondas:</strong> imagen decorativa (<code>alt=""</code>, <code>pointer-events-none</code>) al 5 %, no afecta el contraste.</li>
    <li><strong>Contraste:</strong> enlaces <code>brand-surface-muted</code> (blanco 78 %) sobre <code>brand-surface</code>, más de 9:1 en los dos temas; títulos y redes en blanco.</li>
    <li><strong>Foco:</strong> anillo blanco de 2 px (<code>brand-surface-content</code>).</li>
  </ul>`,
  classes: [
    ['relative overflow-hidden bg-brand-surface', 'Contenedor.'],
    ['absolute top-0 left-1/2 w-[1440px] -translate-x-1/2 opacity-5', 'Ondas de marca (brand/waves.svg).'],
    ['px-4 pt-10 pb-6 lg:px-30 lg:pt-16 lg:pb-8', 'Márgenes: 16 px en celular, 120 px en escritorio.'],
    ['text-brand-surface-muted hover:text-brand-surface-content', 'Enlaces y datos de contacto.'],
    ['text-sm font-semibold text-brand-surface-content', 'Título de columna.'],
    ['grid grid-cols-2 lg:flex lg:gap-16 lg:[&>*]:w-45', 'Columnas de enlaces (180 px en escritorio).'],
    ['border-t border-brand-surface-line', 'Línea antes de los derechos.'],
  ],
  codeNotes: `<p><strong>Angular:</strong> componente <code>inap-footer</code> sin entradas. <strong>WordPress:</strong> <code>footer.php</code> del tema con las mismas clases; las columnas pueden salir de menús de WordPress. Copiar <code>brand/waves.svg</code> y <code>brand/logo-white.svg</code> al tema.</p>`,
  snippets: [{ title: 'Pie de página', language: 'HTML', code: footer('pie') }],
};
