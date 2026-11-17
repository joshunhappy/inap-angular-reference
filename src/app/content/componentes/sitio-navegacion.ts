import { dedent } from '../../core/dedent';
import { LOGO, navSearch } from './sitio-busqueda';
import { statusBadge } from './sitio-cursos';
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

/** Datos de contacto del pie y del mega menú «Institución». */
interface Contact { phone: string; tel: string; email: string; address: string }

const CONTACT: Contact = {
  phone: '(+502) 2419-8181',
  tel: '+50224198181',
  email: 'informacion@inap.gob.gt',
  address: 'Boulevard Los Próceres 16-40, zona 10<br />Ciudad de Guatemala',
};

/**
 * Huecos que llena el tema de WordPress con sus menús y ajustes (ver wordpressTemplates()).
 * Sin huecos, cada plantilla usa los datos de ejemplo de este archivo.
 */
interface Slots {
  utility?: string;
  main?: string;
  mobileSections?: string;
  mobileUtility?: string;
  footerColumns?: string;
  social?: string;
  year?: string;
  aula?: string;
  login?: string;
  register?: string;
  contact?: Contact;
}

const ITEM = `flex items-center gap-1 rounded-lg py-2.5 pr-2.5 pl-3 text-sm font-medium text-base-content transition-colors hover:bg-surface-subtle ${FOCUS}`;

/** Ítem del menú: botón que abre un mega menú (chevron) o enlace directo. */
const navItem = (p: string, i: number | string, label: string, mega: boolean, open = false, href = '#') =>
  mega
    ? `<li><button type="button" class="group ${ITEM} aria-expanded:bg-surface-subtle aria-expanded:text-primary-text" aria-expanded="${open}" aria-controls="${p}-mega-${i}">${label}${icon('chevron-down', 16, 'transition-transform group-aria-expanded:rotate-180')}</button></li>`
    : `<li><a href="${href}" class="${ITEM}">${label}</a></li>`;

const utilityLink = (label: string, href = '#') =>
  `<li><a href="${href}" class="rounded-sm text-brand-surface-muted hover:text-brand-surface-content hover:underline ${FOCUS_INV}">${label}</a></li>`;

const utilityBar = (platform: Platform, s: Slots = {}) => dedent(`
  <div class="bg-brand-surface">
    <div class="mx-auto flex h-9 max-w-360 items-center justify-between px-20 text-xs">
      <ul class="flex items-center gap-6">
        ${ind(s.utility ?? UTILITY[platform].map((l) => utilityLink(l)).join('\n'), 8)}
      </ul>
      <div class="flex items-center gap-4">
        <a href="${s.aula ?? '#'}" target="_blank" rel="noopener" class="flex items-center gap-1 rounded-sm text-brand-surface-content hover:underline ${FOCUS_INV}">
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

const authButtons = (s: Slots = {}) => dedent(`
  <a href="${s.login ?? '#'}" class="btn btn-ghost">Iniciar sesión</a>
  <a href="${s.register ?? '#'}" class="btn btn-primary">Regístrate</a>
`);

/** Escritorio: barra superior (36 px) + barra principal (80 px). */
const navbarDesktop = (p: string, platform: Platform, signedIn = false, open = -1, s: Slots = {}) => dedent(`
  <header class="border-b border-base-content/10 bg-base-100">
    ${ind(utilityBar(platform, s), 4)}
    <nav aria-label="Principal" class="mx-auto flex h-20 max-w-360 items-center gap-6 px-20">
      ${LOGO_LINK}
      <ul class="flex shrink-0 items-center gap-0.5">
        ${ind(s.main ?? MENU[platform].map((m, i) => navItem(p, i, m.label, m.mega, i === open)).join('\n'), 8)}
      </ul>
      <div class="min-w-0 flex-1">
        ${ind(navSearch(`${p}-q`, 'live', '', platform === 'wordpress'), 8)}
      </div>
      <div class="flex shrink-0 items-center gap-2">
        ${ind(signedIn ? userButton(p) : authButtons(s), 8)}
      </div>
    </nav>
  </header>
`);

const iconButton = (ico: string, label: string, extra = '') =>
  `<button type="button" class="btn btn-ghost btn-circle size-11 ${FOCUS}" aria-label="${label}"${extra}>${icon(ico, 22)}</button>`;

/** Celular (84 px): logo y acciones. Angular sin sesión usa «Regístrate» lg, como en Figma. */
const navbarMobile = (p: string, platform: Platform, signedIn = false, s: Slots = {}) => {
  const search = iconButton('search', 'Buscar', ` aria-haspopup="dialog" aria-controls="${p}-buscar"`);
  const menu = iconButton('menu', 'Menú', ` aria-haspopup="dialog" aria-controls="${p}-menu"`);
  const account = `<button type="button" class="btn btn-ghost btn-circle size-11 ${FOCUS}" aria-label="Mi cuenta" aria-haspopup="dialog" aria-controls="${p}-cuenta">${AVATAR}</button>`;
  const register = `<a href="${s.register ?? '#'}" class="btn btn-primary${platform === 'angular' ? ' btn-lg' : ''}">Regístrate</a>`;
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

/* ── Mega menú ─────────────────────────────────────────────────────────────── */

/** Enlace: título, descripción opcional y si abre otro sitio (Aula virtual, CECODINAP). */
type MegaLink = [title: string, description?: string, external?: boolean];

interface MegaMenu {
  columns: [heading: string, links: MegaLink[]][];
  hub: string;
  aside:
    | { kind: 'feature'; icon: string; title: string; text: string; cta: string }
    | { kind: 'contact' };
}

const MEGA: Record<string, MegaMenu> = {
  Cursos: {
    columns: [
      ['Agenda académica', [
        ['Cursos con opción a certificación', 'Valida tus competencias con un certificado oficial'],
        ['Cursos y diplomados', 'Formación continua a tu ritmo'],
        ['Estudios de posgrado', 'Maestrías y doctorados'],
        ['Investigación y asesoría técnica', 'Acompañamiento a instituciones'],
      ]],
      ['Empieza aquí', [
        ['Para servidores públicos', 'Rutas según tu puesto'],
        ['Para gobiernos locales', 'Formación municipal'],
      ]],
    ],
    hub: 'Ver toda la agenda académica',
    aside: { kind: 'feature', icon: 'file-text', title: 'Oferta Académica 2026', text: 'Todos los cursos, diplomados y posgrados del año en un solo documento.', cta: 'Descargar PDF' },
  },
  Formación: {
    columns: [
      ['Agenda académica', [
        ['Cursos con opción a certificación', 'Valida tus competencias con un certificado oficial'],
        ['Cursos y diplomados', 'Formación continua a tu ritmo'],
        ['Estudios de posgrado', 'Maestrías y doctorados'],
        ['Investigación y asesoría técnica', 'Acompañamiento a instituciones'],
      ]],
      ['Áreas de formación', [
        ['Modernización del Estado'], ['Gestión administrativa'], ['Ética y transparencia'], ['Liderazgo y comunicación'],
        ['Planificación y gestión pública'], ['Derechos humanos e inclusión'], ['Desarrollo territorial'], ['Finanzas públicas'],
        ['Investigación y conocimiento'],
      ]],
      ['Programas', [
        ['Maestría en Gestión Pública Local INAP-USAC'], ['Diplomado en Gerencia Pública'],
        ['Transformación digital e IA en el gobierno'], ['Yo sé de género (ONU Mujeres)'], ['Taller de facilitadores INAP–SESAN'],
      ]],
      ['Empieza aquí', [
        ['Para servidores públicos', 'Rutas según tu puesto'],
        ['Para gobiernos locales', 'Formación municipal'],
        ['Cómo inscribirse', 'Guía paso a paso'],
        ['Aula virtual', 'Continúa tus cursos', true],
      ]],
    ],
    hub: 'Ver toda la agenda académica',
    aside: { kind: 'feature', icon: 'file-text', title: 'Oferta Académica 2026', text: 'Todos los cursos, diplomados y posgrados del año en un solo documento.', cta: 'Descargar PDF' },
  },
  Fortalecimiento: {
    columns: [
      ['Servicios', [
        ['Agenda de servicios', 'Programas a la medida de tu institución'],
        ['Asesoría y asistencia técnica', 'Diagnóstico y acompañamiento'],
        ['Modelo de gestión por procesos', 'Guía para el sector público'],
        ['Formatos y lineamientos', 'Plantillas descargables'],
      ]],
      ['Instrumentos de medición', [
        ['Direccionamiento estratégico'], ['Tecnologías y sistemas de información'], ['Gestión por procesos'],
        ['Marco normativo'], ['Habilidades gerenciales'],
      ]],
      ['Casos de fortalecimiento', [
        ['COPADEH'], ['Hospital Nacional de Salud Mental Federico Mora'], ['Instituto Nacional de Estadística (INE)'],
        ['Viceministerio de MIPYME'], ['Viceministerio del Agua'],
      ]],
    ],
    hub: 'Ver fortalecimiento institucional',
    aside: { kind: 'feature', icon: 'building-2', title: 'Fortalece a tu institución', text: 'Programas grupales, asesoría técnica e investigación para entidades del Estado.', cta: 'Solicitar asesoría' },
  },
  Recursos: {
    columns: [
      ['Biblioteca', [
        ['CECODINAP', 'Centro de Consulta Digital', true],
        ['Revista INAP', 'Todas las ediciones'],
        ['Envía tu aporte', 'Comparte investigación con el INAP'],
      ]],
      ['Revista INAP', [['7ma. edición'], ['6ta. edición']]],
      ['Legislación', [
        ['Decreto 12-2002', 'Código Municipal'],
        ['Decreto 15-98', 'Ley del IUSI'],
        ['Decreto 6-91', 'Código Tributario'],
      ]],
    ],
    hub: 'Ver todos los recursos',
    aside: { kind: 'feature', icon: 'book-open', title: 'Revista INAP · 7ma. edición', text: 'Análisis y experiencias para una gestión pública basada en evidencia.', cta: 'Leer edición' },
  },
  Institución: {
    columns: [
      ['Conócenos', [
        ['Quiénes somos', 'Misión, visión y valores'],
        ['Marco legal y organigrama', 'Normativa interna'],
        ['Autoridades', 'Junta Directiva y Gerencia'],
        ['Salud y seguridad ocupacional', 'Compromiso con nuestro personal'],
      ]],
      ['Direcciones', [
        ['DIFOGI', 'Fortalecimiento de la Gestión Institucional'],
        ['DIADI', 'Investigación y Análisis para el Desarrollo'],
        ['DIDE', 'Delegaciones'],
        ['DEGI', 'Evaluación y Gestión Institucional'],
      ]],
      ['Contacto y empleo', [
        ['Delegaciones', 'Oficinas en los departamentos'],
        ['Directorio', 'Teléfonos y correos'],
        ['Trabaja con nosotros', 'Buzón de empleo'],
        ['Transparencia', 'Información pública de oficio (LAIP)'],
      ]],
    ],
    hub: 'Ver institución',
    aside: { kind: 'contact' },
  },
};

const NEW_TAB = '<span class="sr-only">(se abre en una pestaña nueva)</span>';

const megaLink = ([title, desc, external]: MegaLink, href = '#') =>
  `<li><a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''} class="flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm hover:bg-surface-subtle ${FOCUS}">` +
  `<span class="flex items-center gap-1 font-medium text-primary-text"><span class="flex-1">${title}</span>${external ? icon('arrow-up-right', 14, 'shrink-0') + NEW_TAB : ''}</span>` +
  (desc ? `<span class="text-neutral-text">${desc}</span>` : '') +
  `</a></li>`;

const megaColumnHtml = (id: string, heading: string, links: string) => dedent(`
  <div class="flex min-w-0 flex-1 flex-col gap-1">
    <div class="px-3 pb-2">
      <p id="${id}" class="border-b border-base-content/10 pb-3 text-sm font-medium text-base-content">${heading}</p>
    </div>
    <ul aria-labelledby="${id}" class="flex flex-col gap-1">
      ${ind(links, 6)}
    </ul>
  </div>
`);

const megaColumn = (id: string, [heading, links]: MegaMenu['columns'][number]) =>
  megaColumnHtml(id, heading, links.map((l) => megaLink(l)).join('\n'));

const ARROW = icon('arrow-right', 16, 'shrink-0');

const megaAside = (aside: MegaMenu['aside'], href = '#', c: Contact = CONTACT) =>
  aside.kind === 'feature'
    ? dedent(`
      <div class="relative flex flex-col gap-3 rounded-xl border border-base-content/10 bg-base-100 p-5">
        <span class="flex size-10 items-center justify-center rounded-lg bg-primary-400/20 text-primary-text" aria-hidden="true">${icon(aside.icon, 20)}</span>
        <p class="text-base font-semibold text-base-content">${aside.title}</p>
        <p class="text-sm text-neutral-text">${aside.text}</p>
        <a href="${href}" class="flex items-center gap-1.5 self-start rounded-sm text-sm font-medium text-primary-text after:absolute after:inset-0 after:rounded-xl hover:underline ${FOCUS}">${aside.cta}${ARROW}</a>
      </div>
    `)
    : dedent(`
      <div class="flex flex-col gap-4 text-sm">
        <p class="font-medium text-base-content">Contacto</p>
        <address class="not-italic">
          <ul class="flex flex-col gap-4 text-base-content">
            <li class="flex items-start gap-2.5">${icon('phone', 18, 'mt-px shrink-0 text-neutral-text')}<a href="tel:${c.tel}" class="rounded-sm hover:underline ${FOCUS}">${c.phone}</a></li>
            <li class="flex items-start gap-2.5">${icon('mail', 18, 'mt-px shrink-0 text-neutral-text')}<a href="mailto:${c.email}" class="rounded-sm hover:underline ${FOCUS}">${c.email}</a></li>
            <li class="flex items-start gap-2.5">${icon('map-pin', 18, 'mt-px shrink-0 text-neutral-text')}<span>${c.address.replace('<br />', ', ')}</span></li>
          </ul>
        </address>
      </div>
    `);

/** Panel de 1280 px: columnas, pie con enlace a la página principal de la sección y columna lateral de 280 px. */
const megaShell = (id: string, columns: string, hub: string, hubHref: string, aside: string) => dedent(`
  <div id="${id}" class="flex w-full overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-xl">
    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex gap-6 p-8">
        ${ind(columns, 8)}
      </div>
      <div class="border-t border-base-content/10 px-11 py-5">
        <a href="${hubHref}" class="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary-text hover:underline ${FOCUS}">${hub}${ARROW}</a>
      </div>
    </div>
    <div class="w-70 shrink-0 border-l border-base-content/10 bg-surface-subtle p-8">
      ${ind(aside, 6)}
    </div>
  </div>
`);

const megaPanel = (id: string, menu: string) => {
  const m = MEGA[menu];
  return megaShell(id, m.columns.map((c, i) => megaColumn(`${id}-h${i}`, c)).join('\n'), m.hub, '#', megaAside(m.aside));
};

/** Barra con el mega menú abierto debajo: 8 px de separación, alineado al contenedor de 1280 px. */
const megaOpen = (p: string, platform: Platform, menu: string) => {
  const i = MENU[platform].findIndex((m) => m.label === menu);
  return dedent(`
    <div class="relative bg-surface-subtle pb-8">
      ${ind(navbarDesktop(p, platform, false, i), 6)}
      <div class="mx-auto mt-2 max-w-360 px-20">
        ${ind(megaPanel(`${p}-mega-${i}`, menu), 8)}
      </div>
    </div>
  `);
};

/** Vista a 1440 px al 72 %: barra y panel completos. */
const WIDE_PREVIEW = 'overflow-x-auto bg-surface-subtle p-0 [&>*]:w-[1440px] [&>*]:[zoom:0.72]';

export const megaMenu: ComponentDoc = {
  figmaNode: '85-702',
  intro: `<p>Panel que abre un ítem de la barra principal en escritorio. Columnas con encabezado y enlaces (Mega Link), un pie con el enlace a la página principal de la sección y una columna lateral con un destacado o, en «Institución», el contacto. Angular tiene uno («Cursos»); WordPress, cuatro.</p>`,
  examples: [
    {
      title: 'Angular · «Cursos» abierto',
      description: 'Debajo de la barra, a 8 px, con el ancho del contenedor (1280 px). El ítem queda con fondo y chevron hacia arriba.',
      previewClass: WIDE_PREVIEW,
      html: megaOpen('mm-a', 'angular', 'Cursos'),
    },
    {
      title: 'WordPress · Formación',
      description: 'Cuatro columnas. «Aula virtual» es un sitio aparte: ícono y aviso de pestaña nueva.',
      previewClass: DESKTOP_PREVIEW,
      html: megaPanel('mm-wf', 'Formación'),
    },
    {
      title: 'WordPress · Fortalecimiento',
      description: 'Las columnas sin descripción son listas largas de enlaces.',
      previewClass: DESKTOP_PREVIEW,
      html: megaPanel('mm-wfo', 'Fortalecimiento'),
    },
    {
      title: 'WordPress · Recursos',
      description: 'CECODINAP abre otro sitio.',
      previewClass: DESKTOP_PREVIEW,
      html: megaPanel('mm-wr', 'Recursos'),
    },
    {
      title: 'WordPress · Institución',
      description: 'La columna lateral muestra el contacto en lugar de un destacado.',
      previewClass: DESKTOP_PREVIEW,
      html: megaPanel('mm-wi', 'Institución'),
    },
  ],
  usage: {
    html: `<ul>
      <li><strong>Solo en escritorio</strong> (desde <code>xl</code>). En celular, el mismo contenido va en el «Menú en celular», en secciones que se expanden.</li>
      <li><strong>Abre con clic</strong> (o Enter y Espacio, que ya hace el botón). No abre al pasar el mouse: se abriría sin querer al cruzar la barra hacia el buscador.</li>
      <li><strong>Cierra</strong> con Esc, clic fuera, otro ítem del menú o cuando el foco sale del panel. Solo uno abierto a la vez.</li>
      <li><strong>Posición:</strong> <code>absolute</code> debajo de la barra, a 8 px, con el ancho del contenedor (1280 px).</li>
      <li><strong>Enlaces:</strong> título en <code>primary-text</code> y descripción corta opcional. En una columna, todos con descripción o ninguno.</li>
      <li><strong>Sitios aparte</strong> (Aula virtual, CECODINAP): <code>target="_blank"</code>, ícono <code>arrow-up-right</code> y aviso para lectores de pantalla. Las páginas de la otra plataforma (Angular ↔ WordPress) abren en la misma pestaña, sin ícono.</li>
      <li><strong>Pie:</strong> siempre lleva a la página principal de la sección («Ver toda la agenda académica»).</li>
      <li><strong>Destacado:</strong> la tarjeta completa es un solo enlace; el texto del enlace es la acción («Descargar PDF»).</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Patrón de divulgación</strong> (disclosure), no <code>role="menu"</code>: el panel es una lista de enlaces y se recorre con Tab.</li>
    <li><strong>Botón:</strong> <code>aria-expanded</code> y <code>aria-controls</code> con el <code>id</code> del panel. Cerrado, el panel lleva <code>hidden</code>.</li>
    <li><strong>Orden de foco:</strong> el panel va justo después de su botón en el HTML, así Tab entra al panel desde el botón.</li>
    <li><strong>Esc</strong> cierra y devuelve el foco al botón.</li>
    <li><strong>Columnas:</strong> el encabezado es un <code>&lt;p id&gt;</code> y la lista lo usa con <code>aria-labelledby</code>. No son títulos <code>&lt;h2&gt;</code> para no llenar el índice de títulos de cada página.</li>
    <li><strong>Destacado:</strong> la tarjeta se activa con el enlace estirado (<code>after:absolute after:inset-0</code>); el ícono es decorativo.</li>
    <li><strong>Foco:</strong> anillo de 2 px <code>primary-text</code> en cada enlace (va en las clases porque el CSS de WordPress no trae regla global).</li>
    <li><strong>Contraste:</strong> títulos <code>primary-text</code> y descripciones <code>neutral-text</code> sobre <code>base-100</code> y <code>surface-subtle</code>, más de 4.5:1 en los dos temas.</li>
  </ul>`,
  classes: [
    ['flex overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-xl', 'Panel.'],
    ['flex gap-6 p-8', 'Columnas.'],
    ['px-3 pb-2 > border-b border-base-content/10 pb-3 text-sm font-medium', 'Encabezado de columna: la línea queda alineada con el texto de los enlaces.'],
    ['flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm hover:bg-surface-subtle', 'Mega Link.'],
    ['font-medium text-primary-text', 'Título del enlace.'],
    ['text-neutral-text', 'Descripción del enlace.'],
    ['border-t border-base-content/10 px-11 py-5', 'Pie con el enlace a la sección.'],
    ['w-70 border-l border-base-content/10 bg-surface-subtle p-8', 'Columna lateral (280 px).'],
    ['relative rounded-xl border bg-base-100 p-5 + after:absolute after:inset-0', 'Destacado: tarjeta con enlace estirado.'],
    ['size-10 rounded-lg bg-primary-400/20 text-primary-text', 'Ícono del destacado.'],
  ],
  codeNotes: `<p><strong>Angular:</strong> el estado abierto vive en <code>inap-navbar</code> (un <code>signal</code> con el índice abierto); el panel es un componente <code>inap-mega-menu</code> que recibe el contenido. <strong>WordPress:</strong> el contenido sale de un menú de WordPress con submenús (columna = ítem de segundo nivel) y un script pequeño para abrir y cerrar. Los destacados son campos del menú o de una página de opciones.</p>`,
  snippets: [
    { title: 'Mega menú (Angular, «Cursos»)', language: 'HTML', code: megaPanel('nav-mega-0', 'Cursos') },
    { title: 'Abrir y cerrar', language: 'TypeScript', code: dedent(`
      readonly open = signal<number | null>(null);
      private readonly host = inject(ElementRef<HTMLElement>);

      toggle(i: number): void {
        this.open.update((o) => (o === i ? null : i));
      }

      @HostListener('document:keydown.escape')
      onEscape(): void {
        const i = this.open();
        if (i === null) return;
        this.open.set(null);
        this.host.nativeElement.querySelector<HTMLElement>(\`[aria-controls="nav-mega-\${i}"]\`)?.focus();
      }

      /** Clic fuera de la barra: cerrar. Los clics en otro ítem ya los resuelve toggle(). */
      @HostListener('document:click', ['$event'])
      onClick(e: MouseEvent): void {
        if (!this.host.nativeElement.contains(e.target as Node)) this.open.set(null);
      }

      /** Foco fuera del panel y de su botón (Tab al siguiente ítem, al buscador…): cerrar. */
      @HostListener('document:focusin', ['$event'])
      onFocusIn(e: FocusEvent): void {
        const i = this.open();
        if (i === null) return;
        const t = e.target as Node;
        const panel = document.getElementById(\`nav-mega-\${i}\`);
        const button = this.host.nativeElement.querySelector(\`[aria-controls="nav-mega-\${i}"]\`);
        if (!panel?.contains(t) && !button?.contains(t)) this.open.set(null);
      }
    `) },
  ],
};

/* ── Menú en celular ───────────────────────────────────────────────────────── */

/** Sección del menú en celular: acordeón con grupos de enlaces, o enlace directo. */
type MobileSection =
  | { label: string; groups: [label: string, links: MegaLink[]][] }
  | { label: string; href: string };

/** Grupos del acordeón a partir del mega menú de escritorio (sin descripciones). */
const fromMega = (menu: string) => MEGA[menu].columns.map(([h, links]): [string, MegaLink[]] => [h, links.map(([t, , ext]) => [t, undefined, ext])]);

const MOBILE_MENU: Record<Platform, MobileSection[]> = {
  angular: [
    { label: 'Cursos', groups: fromMega('Cursos') },
    { label: 'Áreas de formación', href: '#' },
    { label: 'Programas', href: '#' },
    { label: 'Cómo inscribirse', href: '#' },
  ],
  wordpress: [
    { label: 'Formación', groups: [
      ['Agenda académica', fromMega('Formación')[0][1]],
      ['Empieza aquí', [['Áreas de formación'], ['Programas'], ['Para servidores públicos'], ['Para gobiernos locales'], ['Cómo inscribirse'], ['Aula virtual', undefined, true]]],
    ] },
    { label: 'Fortalecimiento institucional', groups: fromMega('Fortalecimiento') },
    { label: 'Recursos', groups: fromMega('Recursos') },
    { label: 'Institución', groups: fromMega('Institución') },
  ],
};

const MOBILE_UTILITY: Record<Platform, string[]> = {
  angular: ['Portal institucional', 'Ayuda'],
  wordpress: ['Noticias', 'Eventos', 'Transparencia', 'Contacto'],
};

const ROW = `flex w-full items-center justify-between gap-3 rounded-lg px-1 py-3.5 text-start text-base font-medium text-base-content ${FOCUS}`;

const mobileLink = (label: string, href: string) =>
  `<li class="border-b border-base-content/10"><a href="${href}" class="${ROW}">${label}${icon('chevron-right', 20, 'shrink-0')}</a></li>`;

const mobileGroup = (id: string, label: string, links: string) => dedent(`
  <p id="${id}" class="px-3 pt-2 pb-1 text-xs font-semibold text-neutral-text">${label}</p>
  <ul aria-labelledby="${id}" class="flex flex-col gap-0.5">
    ${ind(links, 4)}
  </ul>
`);

const mobileSectionShell = (id: string, label: string, groups: string, open: boolean) => dedent(`
  <li class="${open ? '' : 'border-b border-base-content/10'}">
    <button type="button" class="group ${ROW} aria-expanded:text-primary-text" aria-expanded="${open}" aria-controls="${id}">${label}${icon('chevron-down', 20, 'shrink-0 transition-transform group-aria-expanded:rotate-180')}</button>
    <div id="${id}" class="flex flex-col gap-0.5 border-b border-base-content/10 pb-3"${open ? '' : ' hidden'}>
      ${ind(groups, 6)}
    </div>
  </li>
`);

const mobileSection = (p: string, i: number, s: MobileSection, open: boolean) => {
  if ('href' in s) return mobileLink(s.label, s.href);
  const id = `${p}-sec-${i}`;
  const groups = s.groups.map(([label, links], g) => mobileGroup(`${id}-g${g}`, label, links.map((l) => megaLink(l)).join('\n'))).join('\n');
  return mobileSectionShell(id, s.label, groups, open);
};

const MOBILE_LINK = `flex items-center justify-between rounded-sm py-3 text-sm ${FOCUS_INV}`;

/** Fila de la tarjeta azul oscuro; la última no lleva línea inferior. */
const mobileUtilityRow = (label: string, href = '#', last = false) =>
  `<li${last ? '' : ' class="border-b border-brand-surface-muted"'}><a href="${href}" class="${MOBILE_LINK} text-brand-surface-muted hover:text-brand-surface-content">${label}${icon('chevron-right', 16, 'shrink-0')}</a></li>`;

/** Tarjeta azul oscuro con Aula virtual (externo) y los enlaces de la barra superior. */
const mobileUtility = (platform: Platform, s: Slots = {}) => {
  const rows = [
    `<li class="border-b border-brand-surface-muted"><a href="${s.aula ?? '#'}" target="_blank" rel="noopener" class="${MOBILE_LINK} text-brand-surface-content">Aula virtual${NEW_TAB}${icon('arrow-up-right', 16, 'shrink-0')}</a></li>`,
    s.mobileUtility ?? MOBILE_UTILITY[platform].map((l, i, a) => mobileUtilityRow(l, '#', i === a.length - 1)).join('\n'),
  ];
  return dedent(`
    <ul aria-label="Más enlaces" class="mt-4 rounded-lg bg-brand-surface px-4 py-1">
      ${ind(rows.join('\n'), 6)}
    </ul>
  `);
};

const ACCOUNT_ROW = `<button type="button" aria-haspopup="dialog" class="flex w-full items-center gap-3 rounded-xl bg-surface-subtle px-3 py-2 text-start ${FOCUS}"><span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content" aria-hidden="true">JD</span><span class="flex min-w-0 flex-1 flex-col"><span class="truncate text-base font-medium text-base-content">Josué De La Cruz</span><span class="text-sm text-neutral-text">Mi cuenta</span></span>${icon('chevron-right', 20, 'shrink-0 text-base-content')}</button>`;

/**
 * Menú a pantalla completa: encabezado, cuerpo con scroll (buscador, secciones, enlaces de utilidad)
 * y pie fijo con modo oscuro y la sesión. En la plataforma es un <dialog> abierto con showModal().
 */
const mobileMenu = (p: string, platform: Platform, signedIn = false, open = 0, s: Slots = {}) => dedent(`
  <dialog open id="${p}-menu" aria-label="Menú" class="static m-0 flex h-dvh max-h-none w-full max-w-none flex-col border-0 bg-base-100 p-0 text-base-content">
    <div class="flex h-21 shrink-0 items-center justify-between pr-2 pl-4">
      ${ind(LOGO_LINK, 6)}
      <button type="button" class="btn btn-ghost btn-square size-11 rounded-lg ${FOCUS}" aria-label="Cerrar menú">${icon('x', 22)}</button>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto">
      <div class="px-4 pt-4 pb-2">
        ${ind(navSearch(`${p}-q`, 'live', '', platform === 'wordpress'), 8)}
      </div>
      <nav aria-label="Principal" class="px-4 pt-2 pb-4">
        <ul>
          ${ind(s.mobileSections ?? MOBILE_MENU[platform].map((m, i) => mobileSection(p, i, m, i === open)).join('\n'), 10)}
        </ul>
        ${ind(mobileUtility(platform, s), 8)}
      </nav>
    </div>
    <div class="flex shrink-0 flex-col gap-3 border-t border-base-content/10 px-4 pt-3 pb-6">
      <button type="button" aria-pressed="false" class="flex items-center gap-2 self-start rounded-sm py-1 text-sm font-medium ${FOCUS}">${icon('moon', 18)}Modo oscuro</button>
      ${signedIn ? ACCOUNT_ROW : `<div class="flex gap-2">
        <a href="${s.login ?? '#'}" class="btn btn-outline btn-primary h-11 flex-1">Iniciar sesión</a>
        <a href="${s.register ?? '#'}" class="btn btn-primary h-11 flex-1">Regístrate</a>
      </div>`}
    </div>
  </dialog>
`);

/** Teléfono de 390 × 700 en la vista previa (en la plataforma ocupa la pantalla: h-dvh). */
const PHONE_PREVIEW = 'flex justify-center bg-surface-subtle p-6 [&>*]:w-full [&>*]:max-w-[390px] [&>*]:h-[700px]! [&>*]:rounded-box [&>*]:border [&>*]:border-base-content/10';

export const menuMovil: ComponentDoc = {
  figmaNode: '329-2534',
  intro: `<p>Menú a pantalla completa en celular y tableta (debajo de <code>xl</code>). Tiene el mismo orden que el escritorio: las secciones con mega menú se abren como acordeón y las demás son enlaces. Debajo van los enlaces de la barra superior y, fijo al pie, «Modo oscuro» y la sesión.</p>`,
  examples: [
    {
      title: 'Angular · Sin sesión',
      description: '«Cursos» abierto; Áreas de formación, Programas y Cómo inscribirse son enlaces directos.',
      previewClass: PHONE_PREVIEW,
      html: mobileMenu('mv-a', 'angular'),
    },
    {
      title: 'Angular · Sesión iniciada',
      description: 'La fila de cuenta reemplaza «Iniciar sesión» y «Regístrate»; abre «Mi cuenta».',
      previewClass: PHONE_PREVIEW,
      html: mobileMenu('mv-ai', 'angular', true),
    },
    {
      title: 'WordPress',
      description: 'Cuatro secciones en acordeón, una abierta a la vez. Siempre sin sesión: los botones llevan a Angular.',
      previewClass: PHONE_PREVIEW,
      html: mobileMenu('mv-w', 'wordpress'),
    },
  ],
  usage: {
    html: `<ul>
      <li><strong>Se abre</strong> con el botón «Menú» de la barra en celular y <strong>se cierra</strong> con la X, con Esc o al elegir un enlace.</li>
      <li><strong>Acordeón:</strong> solo una sección abierta a la vez. Al abrir el menú, la sección de la página actual empieza abierta.</li>
      <li><strong>Enlaces sin descripción:</strong> en celular solo va el título; las descripciones del mega menú se omiten.</li>
      <li><strong>Pie fijo:</strong> «Modo oscuro» y la sesión siempre a la vista; el resto hace scroll.</li>
      <li><strong>Botones del pie:</strong> 44 px de alto, uno al lado del otro.</li>
      <li><strong>Aula virtual</strong> encabeza la tarjeta azul: abre en otra pestaña, con <code>arrow-up-right</code>.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Diálogo modal:</strong> <code>&lt;dialog aria-label="Menú"&gt;</code> abierto con <code>showModal()</code>. El navegador atrapa el foco, deja el fondo inerte y cierra con Esc. Al cerrar, el foco vuelve al botón «Menú».</li>
    <li><strong>Scroll del fondo:</strong> bloquearlo mientras está abierto (<code>overflow: hidden</code> en <code>&lt;html&gt;</code>).</li>
    <li><strong>Foco inicial:</strong> en el botón «Cerrar menú».</li>
    <li><strong>Secciones:</strong> <code>&lt;button aria-expanded aria-controls&gt;</code>; el panel cerrado lleva <code>hidden</code>. Abierta: texto <code>primary-text</code> y chevron hacia arriba.</li>
    <li><strong>Grupos:</strong> <code>&lt;p id&gt;</code> con la lista <code>aria-labelledby</code>, igual que en el mega menú.</li>
    <li><strong>Áreas táctiles:</strong> filas de 52 px, botones de 44 px.</li>
    <li><strong>Modo oscuro:</strong> <code>aria-pressed</code>. <strong>Fila de cuenta:</strong> botón con el nombre visible; el avatar es decorativo.</li>
    <li><strong>Foco:</strong> anillo de 2 px <code>primary-text</code>, blanco en la tarjeta azul oscuro.</li>
  </ul>`,
  classes: [
    ['flex h-dvh w-full max-w-none max-h-none flex-col p-0', 'Diálogo a pantalla completa.'],
    ['min-h-0 flex-1 overflow-y-auto', 'Cuerpo con scroll.'],
    ['flex w-full items-center justify-between px-1 py-3.5 text-base font-medium', 'Fila de sección (52 px).'],
    ['aria-expanded:text-primary-text group-aria-expanded:rotate-180', 'Sección abierta.'],
    ['px-3 pt-2 pb-1 text-xs font-semibold text-neutral-text', 'Etiqueta de grupo.'],
    ['rounded-lg bg-brand-surface px-4 py-1', 'Tarjeta de enlaces de utilidad.'],
    ['border-t px-4 pt-3 pb-6', 'Pie fijo.'],
    ['btn h-11 flex-1', 'Botones del pie (44 px).'],
    ['rounded-xl bg-surface-subtle px-3 py-2', 'Fila de cuenta.'],
  ],
  codeNotes: `<p><strong>Angular:</strong> componente <code>inap-mobile-menu</code> dentro de <code>inap-navbar</code>, con las mismas entradas (<code>session</code>) y el contenido del mega menú. <strong>WordPress:</strong> el mismo <code>wp_nav_menu</code> del escritorio con otro walker (sin descripciones) dentro de un <code>&lt;dialog&gt;</code> en <code>header.php</code>.</p>`,
  snippets: [
    { title: 'Menú (Angular, sin sesión)', language: 'HTML', code: mobileMenu('menu', 'angular').replace('<dialog open ', '<dialog ').replace('static m-0 ', 'm-0 ') },
    { title: 'Abrir y cerrar', language: 'TypeScript', code: dedent(`
      private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('menu');
      readonly section = signal<number | null>(0);

      open(): void {
        document.documentElement.style.overflow = 'hidden';
        this.dialog().nativeElement.showModal();
      }

      /** Evento close del <dialog> (X, Esc o enlace): el navegador devuelve el foco al botón «Menú». */
      onClose(): void {
        document.documentElement.style.overflow = '';
      }

      toggle(i: number): void {
        this.section.update((s) => (s === i ? null : i));
      }
    `) },
  ],
};

/* ── Menú de usuario ───────────────────────────────────────────────────────── */

type Role = 'Participante' | 'Representante institucional' | 'DIFOGI' | 'Administrador';
type MenuEntry = [icon: string, label: string, external?: boolean];

const LEARNING: MenuEntry[] = [['user', 'Mi perfil'], ['book-open', 'Mis cursos'], ['award', 'Mis diplomas']];
const ACCOUNT_END: MenuEntry[] = [['monitor', 'Aula virtual', true], ['settings', 'Configuración'], ['log-out', 'Cerrar sesión']];

/** Sección que depende de los permisos del usuario (ejemplos por rol, no una regla). */
const ROLE_SECTION: Record<Role, [label: string, items: MenuEntry[]] | null> = {
  Participante: null,
  'Representante institucional': ['Institución', [['building-2', 'Perfil institucional']]],
  DIFOGI: ['Administración', [['clipboard-check', 'Cursos']]],
  Administrador: ['Administración', [
    ['layout-dashboard', 'Dashboard gerencial'], ['clipboard-check', 'Cursos'], ['users', 'Usuarios'], ['banknote', 'Pagos'],
    ['ticket', 'Códigos institucionales'], ['tags', 'Catálogos'], ['handshake', 'Convenios'],
  ]],
};

const accountHeader = (role: Role, pad: string) => dedent(`
  <div class="flex items-start gap-3 ${pad}">
    <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content" aria-hidden="true">JD</span>
    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <p class="truncate text-base font-medium text-base-content">Josué De La Cruz</p>
      <p class="truncate text-sm text-neutral-text">josue.delacruz@correo.gt</p>
      <p class="pt-1.5"><span class="sr-only">Rol: </span>${statusBadge('bg-neutral-text', role)}</p>
    </div>
  </div>
`);

const SECTION_LABEL = 'px-3 pt-3 pb-1 text-xs font-semibold tracking-[0.06em] text-neutral-text uppercase';

/* Escritorio: popover con role="menu" */

const menuItem = ([ico, label, external]: MenuEntry) =>
  `<li role="none"><a href="#" role="menuitem" tabindex="-1"${external ? ' target="_blank" rel="noopener"' : ''} class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content hover:bg-surface-subtle focus:bg-surface-subtle ${FOCUS}">${icon(ico, 20, 'shrink-0 text-neutral-text')}<span class="flex-1">${label}</span>${external ? icon('arrow-up-right', 16, 'shrink-0') + NEW_TAB : ''}</a></li>`;

const SEPARATOR = '<li role="separator" class="my-1.5 h-px bg-base-content/10"></li>';

const menuGroup = (id: string, label: string, items: MenuEntry[]) => dedent(`
  <li role="none">
    <p id="${id}" class="${SECTION_LABEL}" aria-hidden="true">${label}</p>
    <ul role="group" aria-labelledby="${id}" class="flex flex-col gap-0.5">
      ${ind(items.map(menuItem).join('\n'), 6)}
    </ul>
  </li>
`);

/** Popover de 320 px bajo el botón de usuario. Filas de 36 px. */
const userMenu = (p: string, role: Role) => {
  const extra = ROLE_SECTION[role];
  const parts = [
    menuGroup(`${p}-g0`, 'Mi aprendizaje', LEARNING),
    SEPARATOR,
    ...(extra ? [menuGroup(`${p}-g1`, extra[0], extra[1]), SEPARATOR] : []),
    ...ACCOUNT_END.map(menuItem),
  ];
  return dedent(`
    <div class="flex max-h-[calc(100dvh-132px)] w-80 flex-col overflow-y-auto rounded-2xl border border-base-content/10 bg-base-100 p-2 shadow-lg">
      ${ind(accountHeader(role, 'p-3'), 6)}
      <div class="my-1.5 h-px bg-base-content/10"></div>
      <ul id="${p}" role="menu" aria-label="Mi cuenta" class="flex flex-col gap-0.5">
        ${ind(parts.join('\n'), 8)}
      </ul>
    </div>
  `);
};

/** Barra con sesión iniciada y el menú abierto, alineado a la derecha del contenedor. */
const userMenuOpen = (p: string, role: Role) => dedent(`
  <div class="bg-surface-subtle pb-8">
    ${ind(navbarDesktop(p, 'angular', true).replace(`aria-expanded="false" aria-controls="${p}-cuenta"`, `aria-expanded="true" aria-controls="${p}-cuenta"`), 4)}
    <div class="mx-auto flex max-w-360 justify-end px-20 pt-2">
      ${ind(userMenu(`${p}-cuenta`, role), 6)}
    </div>
  </div>
`);

/* Celular: hoja «Mi cuenta» a pantalla completa (diálogo), filas de 44 px */

const sheetLink = ([ico, label, external]: MenuEntry) =>
  `<li><a href="#"${external ? ' target="_blank" rel="noopener"' : ''} class="flex items-center gap-3 rounded-lg p-3 text-sm text-base-content hover:bg-surface-subtle ${FOCUS}">${icon(ico, 20, 'shrink-0 text-neutral-text')}<span class="flex-1">${label}</span>${external ? icon('arrow-up-right', 16, 'shrink-0') + NEW_TAB : ''}</a></li>`;

const sheetGroup = (id: string, label: string, items: MenuEntry[]) => dedent(`
  <p id="${id}" class="${SECTION_LABEL}">${label}</p>
  <ul aria-labelledby="${id}" class="flex flex-col gap-0.5">
    ${ind(items.map(sheetLink).join('\n'), 4)}
  </ul>
`);

const SHEET_RULE = '<div class="my-1.5 h-px bg-base-content/10"></div>';

/** Administrador en celular: la sección larga se pliega para que el menú quepa. */
const sheetCollapsible = (id: string, items: MenuEntry[], open: boolean) => dedent(`
  <button type="button" class="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm text-base-content hover:bg-surface-subtle ${FOCUS}" aria-expanded="${open}" aria-controls="${id}">${icon('settings', 20, 'shrink-0 text-neutral-text')}<span class="flex-1">Administración</span>${icon('chevron-down', 16, 'shrink-0 transition-transform group-aria-expanded:rotate-180')}</button>
  <ul id="${id}" class="flex flex-col gap-0.5 ps-8"${open ? '' : ' hidden'}>
    ${ind(items.map(sheetLink).join('\n'), 4)}
  </ul>
`);

const userSheet = (p: string, role: Role, adminOpen = false) => {
  const extra = ROLE_SECTION[role];
  const middle = !extra ? ''
    : role === 'Administrador' ? sheetCollapsible(`${p}-admin`, extra[1], adminOpen) + '\n' + SHEET_RULE
    : sheetGroup(`${p}-g1`, extra[0], extra[1]) + '\n' + SHEET_RULE;
  return dedent(`
    <dialog open aria-labelledby="${p}-t" class="static m-0 flex h-dvh max-h-none w-full max-w-none flex-col border-0 bg-base-100 p-0 text-base-content">
      <h2 id="${p}-t" class="sr-only">Mi cuenta</h2>
      <div class="flex h-21 shrink-0 items-center justify-between pr-2 pl-4">
        ${ind(LOGO_LINK, 8)}
        <button type="button" class="btn btn-ghost btn-circle size-11 ${FOCUS}" aria-label="Cerrar">${icon('x', 22)}</button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        ${ind(accountHeader(role, 'py-3'), 8)}
        ${SHEET_RULE}
        <nav aria-label="Mi cuenta">
          ${ind([sheetGroup(`${p}-g0`, 'Mi aprendizaje', LEARNING), SHEET_RULE, middle, `<ul class="flex flex-col gap-0.5">\n  ${ACCOUNT_END.map(sheetLink).join('\n  ')}\n</ul>`].filter(Boolean).join('\n'), 10)}
        </nav>
      </div>
    </dialog>
  `);
};

const PHONES_PREVIEW = 'flex flex-wrap justify-center gap-6 bg-surface-subtle p-6 [&>*]:w-[390px] [&>*]:h-[700px]! [&>*]:rounded-box [&>*]:border [&>*]:border-base-content/10';

export const menuDeUsuario: ComponentDoc = {
  figmaNode: '329-2327',
  intro: `<p>Menú de la cuenta con sesión iniciada (solo Angular). En escritorio es un menú de 320 px bajo el botón de usuario; en celular, la hoja «Mi cuenta» a pantalla completa. Todos ven «Mi aprendizaje», Aula virtual, Configuración y Cerrar sesión; las demás secciones salen de los permisos del usuario.</p>`,
  examples: [
    {
      title: 'Escritorio · Participante',
      description: 'Abierto bajo el botón de usuario, alineado a la derecha del contenedor, a 8 px.',
      previewClass: WIDE_PREVIEW,
      html: userMenuOpen('um', 'Participante'),
    },
    {
      title: 'Escritorio · Con permisos',
      description: 'Representante institucional, DIFOGI y Administrador. Los roles son ejemplos de combinaciones de permisos.',
      previewClass: 'flex flex-wrap items-start justify-center gap-4 bg-surface-subtle p-6',
      html: [userMenu('um-r', 'Representante institucional'), userMenu('um-d', 'DIFOGI'), userMenu('um-ad', 'Administrador')].join('\n\n'),
    },
    {
      title: 'Celular · Participante y Administrador',
      description: 'Hoja «Mi cuenta» con filas de 44 px. En Administrador, la sección «Administración» se pliega.',
      previewClass: PHONES_PREVIEW,
      html: [userSheet('us-p', 'Participante'), userSheet('us-a', 'Administrador')].join('\n\n'),
    },
  ],
  usage: {
    html: `<ul>
      <li><strong>Solo en Angular.</strong> WordPress no muestra la sesión.</li>
      <li><strong>Se arma con los permisos</strong> del usuario, no con un rol fijo. Los módulos son los mismos de «Módulos» en la plataforma: Dashboard gerencial, Cursos, Usuarios, Pagos, Códigos institucionales, Catálogos y Convenios.</li>
      <li><strong>Orden:</strong> datos de la cuenta, «Mi aprendizaje», la sección por permisos («Institución» o «Administración») y al final Aula virtual, Configuración y Cerrar sesión.</li>
      <li><strong>Rol:</strong> badge neutro bajo el correo.</li>
      <li><strong>Página actual:</strong> la opción lleva <code>aria-current="page"</code> y fondo <code>surface-subtle</code>.</li>
      <li><strong>Escritorio:</strong> si no cabe, alto máximo de la ventana menos la barra y 16 px, con scroll dentro.</li>
      <li><strong>Celular:</strong> abre con el avatar de la barra o con la fila de cuenta del menú. En Administrador, «Administración» empieza plegada.</li>
      <li><strong>Pendiente:</strong> la sección de docentes («Cursos que imparto») y el reparto exacto de módulos por dirección, por confirmar con el equipo de desarrollo.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Escritorio, patrón de menú:</strong> el botón lleva <code>aria-haspopup="menu"</code>, <code>aria-expanded</code> y <code>aria-controls</code>. La lista es <code>role="menu"</code>; cada opción, <code>role="menuitem"</code> con <code>tabindex="-1"</code>.</li>
    <li><strong>Teclado:</strong> al abrir, foco en la primera opción. Flechas arriba y abajo recorren las opciones (con vuelta), Inicio y Fin van a la primera y la última. Esc cierra y devuelve el foco al botón; Tab cierra y sigue el orden normal.</li>
    <li><strong>Grupos:</strong> <code>role="group"</code> con <code>aria-labelledby</code>; líneas con <code>role="separator"</code>. Los datos de la cuenta van fuera del <code>role="menu"</code>.</li>
    <li><strong>Celular:</strong> <code>&lt;dialog&gt;</code> modal con título «Mi cuenta» (oculto a la vista) y listas normales de enlaces, sin <code>role="menu"</code>. Al cerrar, el foco vuelve al avatar.</li>
    <li><strong>Íconos:</strong> decorativos, en <code>neutral-text</code>. Aula virtual avisa que abre en otra pestaña.</li>
    <li><strong>Etiquetas de sección:</strong> en mayúsculas con CSS (<code>uppercase</code>); el texto va normal para que los lectores de pantalla no lo deletreen.</li>
    <li><strong>Áreas táctiles:</strong> filas de 36 px en escritorio y 44 px en celular.</li>
  </ul>`,
  classes: [
    ['w-80 rounded-2xl border border-base-content/10 bg-base-100 p-2 shadow-lg', 'Menú en escritorio (320 px).'],
    ['max-h-[calc(100dvh-132px)] overflow-y-auto', 'Alto máximo con scroll interno.'],
    ['flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface-subtle', 'Opción (Menu Item, 36 px).'],
    ['p-3', 'Opción en celular (44 px).'],
    ['px-3 pt-3 pb-1 text-xs font-semibold tracking-[0.06em] uppercase text-neutral-text', 'Etiqueta de sección.'],
    ['my-1.5 h-px bg-base-content/10', 'Separador.'],
    ['badge badge-soft gap-1.5 text-xs font-semibold', 'Badge del rol (Status Badge neutro).'],
  ],
  codeNotes: `<p><strong>Angular:</strong> componente <code>inap-user-menu</code> con la entrada <code>user</code> (nombre, correo, rol y permisos). Las opciones de la sección por permisos salen de la misma lista que hoy arma «Módulos». En celular, la hoja la abre <code>inap-navbar</code> (avatar) o <code>inap-mobile-menu</code> (fila de cuenta).</p>`,
  snippets: [
    { title: 'Menú (escritorio, Participante)', language: 'HTML', code: userMenu('cuenta', 'Participante') },
    { title: 'Teclado del menú', language: 'TypeScript', code: dedent(`
      private items(): HTMLElement[] {
        return [...this.menu().nativeElement.querySelectorAll<HTMLElement>('[role="menuitem"]')];
      }

      open(): void {
        this.expanded.set(true);
        afterNextRender(() => this.items()[0]?.focus(), { injector: this.injector });
      }

      onKeydown(e: KeyboardEvent): void {
        const items = this.items();
        const i = items.indexOf(document.activeElement as HTMLElement);
        const next: Record<string, number> = {
          ArrowDown: (i + 1) % items.length,
          ArrowUp: (i - 1 + items.length) % items.length,
          Home: 0,
          End: items.length - 1,
        };
        if (e.key in next) {
          e.preventDefault();
          items[next[e.key]].focus();
        } else if (e.key === 'Escape') {
          this.expanded.set(false);
          this.button().nativeElement.focus();
        } else if (e.key === 'Tab') {
          this.expanded.set(false);
        }
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

const footerLink = (label: string, href = '#') => `<li><a href="${href}" class="${FLINK}">${label}</a></li>`;

const socialLink = (label: string, href = '#') =>
  `<li><a href="${href}" class="rounded-sm text-brand-surface-content hover:underline ${FOCUS_INV}">${label}</a></li>`;

const footerColHtml = (id: string, title: string, links: string) => dedent(`
  <div class="flex flex-col gap-3">
    <h2 id="${id}" class="text-sm font-semibold text-brand-surface-content">${title}</h2>
    <ul aria-labelledby="${id}" class="flex flex-col gap-3">
      ${ind(links, 6)}
    </ul>
  </div>
`);

const footerCol = (p: string, i: number, title: string, links: string[]) =>
  footerColHtml(`${p}-col${i}`, title, links.map((l) => footerLink(l)).join('\n'));

const footer = (p: string, s: Slots = {}, c: Contact = s.contact ?? CONTACT) => dedent(`
  <footer class="relative overflow-hidden bg-brand-surface text-sm">
    <img src="brand/waves.svg" alt="" width="1440" height="411" class="pointer-events-none absolute top-0 left-1/2 w-[1440px] max-w-none -translate-x-1/2 opacity-5" />
    <div class="relative mx-auto flex max-w-360 flex-col gap-8 px-4 pt-10 pb-6 lg:gap-12 lg:px-30 lg:pt-16 lg:pb-8">
      <div class="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div class="flex flex-col gap-6 lg:flex-1">
          <a href="/" aria-label="INAP, ir al inicio" class="self-start rounded-sm ${FOCUS_INV}"><img src="brand/logo-white.svg" alt="" width="109" height="67" class="w-[109px]" /></a>
          <address class="not-italic">
            <ul class="flex flex-col gap-2.5 text-brand-surface-muted">
              ${contactRow('map-pin', c.address)}
              ${contactRow('phone', `<a href="tel:${c.tel}" class="${FLINK}">${c.phone}</a>`)}
              ${contactRow('mail', `<a href="mailto:${c.email}" class="${FLINK}">${c.email}</a>`)}
            </ul>
          </address>
        </div>
        <nav aria-label="Pie de página" class="grid grid-cols-2 gap-x-6 gap-y-8 lg:flex lg:gap-16 lg:[&>*]:w-45">
          ${ind(s.footerColumns ?? FOOTER_COLS.map(([t, l], i) => footerCol(p, i + 1, t, l)).join('\n'), 10)}
        </nav>
      </div>
      <div class="flex flex-col gap-4 border-t border-brand-surface-line pt-6 text-xs lg:flex-row lg:items-center lg:justify-between lg:pt-8">
        <p class="text-brand-surface-muted">© ${s.year ?? 2026} INAP — Instituto Nacional de Administración Pública. Guatemala, C. A.</p>
        <ul aria-label="Redes sociales" class="flex gap-5 font-semibold">
          ${ind(s.social ?? SOCIAL.map((l) => socialLink(l)).join('\n'), 10)}
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

/* ── Plantillas para el tema de WordPress ─────────────────────────────────── */

const slot = (name: string) => `{{${name}}}`;

/**
 * Plantillas de la barra, los mega menús, el menú de celular y el pie de WordPress, con el mismo HTML
 * de los ejemplos. Los {{huecos}} los llena el tema con sus menús y ajustes; el script de sincronización
 * del tema las copia, no se escriben a mano.
 */
export function wordpressTemplates(): Record<string, string> {
  const s: Slots = {
    utility: slot('utilidad'),
    main: slot('principal'),
    mobileSections: slot('secciones'),
    mobileUtility: slot('movil_utilidad'),
    footerColumns: slot('columnas'),
    social: slot('redes'),
    year: slot('anio'),
    aula: slot('aula_url'),
    login: slot('login_url'),
    register: slot('registro_url'),
    contact: { phone: slot('telefono'), tel: slot('tel'), email: slot('correo'), address: slot('direccion') },
  };
  const t = slot('titulo');
  const u = slot('url');
  return {
    'header-desktop': navbarDesktop('nav', 'wordpress', false, -1, s),
    'header-mobile': navbarMobile('nav', 'wordpress', false, s),
    'menu-mobile': mobileMenu('nav', 'wordpress', false, -1, s).replace('<dialog open ', '<dialog ').replace('static m-0 ', 'm-0 '),
    footer: footer('pie', s),
    'utilidad': utilityLink(t, u),
    'nav-mega': navItem('nav', slot('i'), t, true),
    'nav-enlace': navItem('nav', slot('i'), t, false, false, u),
    'mega-panel': megaShell(`nav-mega-${slot('i')}`, slot('columnas'), slot('hub'), slot('hub_url'), slot('lateral')),
    'mega-columna': megaColumnHtml(slot('id'), t, slot('enlaces')),
    'mega-enlace': megaLink([t], u),
    'mega-enlace-desc': megaLink([t, slot('descripcion')], u),
    'mega-enlace-ext': megaLink([t, undefined, true], u),
    'mega-enlace-ext-desc': megaLink([t, slot('descripcion'), true], u),
    'mega-destacado': megaAside({ kind: 'feature', icon: slot('icono'), title: t, text: slot('texto'), cta: slot('boton') }, u),
    'mega-contacto': megaAside({ kind: 'contact' }, '#', s.contact),
    'movil-enlace': mobileLink(t, u),
    'movil-seccion': mobileSectionShell(slot('id'), t, slot('grupos'), false),
    'movil-grupo': mobileGroup(slot('id'), t, slot('enlaces')),
    'movil-utilidad': mobileUtilityRow(t, u),
    'movil-utilidad-ultimo': mobileUtilityRow(t, u, true),
    'pie-columna': footerColHtml(slot('id'), t, slot('enlaces')),
    'pie-enlace': footerLink(t, u),
    'red': socialLink(t, u),
  };
}

/**
 * Contenido inicial de los menús de WordPress (los mismos datos de los ejemplos). El tema lo carga una
 * sola vez; después Comunicación Social los edita en Apariencia › Menús.
 */
export function wordpressMenus() {
  return {
    utilidad: UTILITY.wordpress,
    principal: MENU.wordpress.map(({ label }, i) => {
      const m = MEGA[label];
      const mobile = MOBILE_MENU.wordpress[i].label;
      return {
        titulo: label,
        movil: mobile === label ? '' : mobile,
        hub: m.hub,
        lateral: m.aside.kind === 'feature' ? { icono: m.aside.icon, titulo: m.aside.title, texto: m.aside.text, boton: m.aside.cta } : 'contacto',
        columnas: m.columns.map(([titulo, links]) => ({
          titulo,
          enlaces: links.map(([t, descripcion, externo]) => ({ titulo: t, descripcion: descripcion ?? '', externo: !!externo })),
        })),
      };
    }),
    pie: FOOTER_COLS.map(([titulo, enlaces]) => ({ titulo, enlaces })),
    redes: SOCIAL,
    contacto: CONTACT,
  };
}
