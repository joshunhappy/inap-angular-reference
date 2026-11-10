import { Type } from '@angular/core';

/** Estado de cada punto, igual que en docs/: acordado, recomendación o falta información. */
export type Status = 'decidido' | 'propuesta' | 'pendiente';

export interface NavPage {
  slug: string;
  title: string;
  description: string;
  status: Status;
  /** Palabras extra para la búsqueda (nombres en Figma, clases de daisyUI). */
  keywords?: string[];
  /** Página real. Sin `load`, se muestra la página «en preparación». */
  load?: () => Promise<Type<unknown>>;
}

export interface NavGroup {
  label?: string;
  pages: NavPage[];
}

export interface NavSection {
  slug: string;
  title: string;
  description: string;
  icon: string;
  groups: NavGroup[];
}

export interface PageRef extends NavPage {
  path: string;
  section: NavSection;
}

/** Página genérica de componente (contenido en content/componentes). */
const componentDoc = () =>
  import('../pages/componentes/component-doc').then((m) => m.ComponentDocPage);

export const FIGMA_URL = 'https://www.figma.com/design/IntROaQkiRlnkFUci5PbDu';
export const REPO_URL = 'https://github.com/joshunhappy/inap-angular-reference';

export const SECTIONS: NavSection[] = [
  {
    slug: 'primeros-pasos',
    title: 'Primeros pasos',
    description: 'Instalación del tema, modo oscuro, cómo leer Figma y qué revisar antes de entregar una pantalla.',
    icon: 'rocket',
    groups: [
      {
        pages: [
          { slug: 'instalacion', load: () => import('../pages/primeros-pasos/instalacion').then((m) => m.InstalacionPage), title: 'Instalación', status: 'decidido', description: 'Tokens, ajustes de componentes y fuente en un proyecto Angular con Tailwind y daisyUI.', keywords: ['tailwind', 'daisyui', 'montserrat', 'npm'] },
          { slug: 'tema-claro-oscuro', load: () => import('../pages/primeros-pasos/tema-claro-oscuro').then((m) => m.TemaPage), title: 'Tema claro y oscuro', status: 'propuesta', description: 'Atributo data-theme, servicio de tema y botón «Modo oscuro».', keywords: ['dark', 'modo oscuro', 'data-theme'] },
          { slug: 'leer-figma', load: () => import('../pages/primeros-pasos/leer-figma').then((m) => m.LeerFigmaPage), title: 'Cómo leer Figma', status: 'decidido', description: 'Páginas, variables, sufijos en nombres de capa y contenido provisional.', keywords: ['variables', 'sr-only'] },
          { slug: 'revision', load: () => import('../pages/primeros-pasos/revision').then((m) => m.RevisionPage), title: 'Revisión antes de entregar', status: 'propuesta', description: 'Lista de comprobación de diseño y accesibilidad para cada pantalla.', keywords: ['checklist', 'qa'] },
          { slug: 'cambios', load: () => import('../pages/primeros-pasos/cambios').then((m) => m.CambiosPage), title: 'Cuando cambia el diseño', status: 'decidido', description: 'Cómo llegan los cambios de tokens y componentes.' },
        ],
      },
    ],
  },
  {
    slug: 'fundamentos',
    title: 'Fundamentos',
    description: 'Las decisiones visuales de las que parten todos los componentes.',
    icon: 'palette',
    groups: [
      {
        pages: [
          { slug: 'color', load: () => import('../pages/fundamentos/color').then((m) => m.ColorPage), title: 'Color', status: 'decidido', description: 'Colores de marca, tokens semánticos y contraste en los dos temas.', keywords: ['primary', 'secondary', 'accent', 'contraste'] },
          { slug: 'tipografia', load: () => import('../pages/fundamentos/tipografia').then((m) => m.TipografiaPage), title: 'Tipografía', status: 'decidido', description: 'Montserrat, escala de tamaños y estilos de texto.', keywords: ['fuente', 'montserrat', 'dancing script'] },
          { slug: 'espaciado', load: () => import('../pages/fundamentos/espaciado').then((m) => m.EspaciadoPage), title: 'Espaciado', status: 'decidido', description: 'Escala de espacios y márgenes de página.', keywords: ['spacing', 'gap', 'padding'] },
          { slug: 'tamano-de-controles', load: () => import('../pages/fundamentos/tamano-de-controles').then((m) => m.TamanoPage), title: 'Tamaño de controles', status: 'decidido', description: 'Tamaños xs a xl de botones y campos, y áreas táctiles.', keywords: ['size', 'btn-lg', 'touch'] },
          { slug: 'radios', load: () => import('../pages/fundamentos/radios').then((m) => m.RadiosPage), title: 'Radios', status: 'decidido', description: 'Redondeo de cajas, campos y selectores.', keywords: ['radius', 'rounded'] },
          { slug: 'sombras', load: () => import('../pages/fundamentos/sombras').then((m) => m.SombrasPage), title: 'Sombras', status: 'decidido', description: 'Elevación de tarjetas, menús y diálogos.', keywords: ['shadow', 'elevación'] },
          { slug: 'iconos', load: () => import('../pages/fundamentos/iconos').then((m) => m.IconosPage), title: 'Íconos', status: 'decidido', description: 'Lucide 0.469.0: tamaños, color y accesibilidad.', keywords: ['lucide', 'svg', 'icon'] },
          { slug: 'logo', load: () => import('../pages/fundamentos/logo').then((m) => m.LogoPage), title: 'Logo y marca', status: 'decidido', description: 'Versiones del logo, tamaño mínimo y colores de marca fijos.', keywords: ['marca', 'brand'] },
          { slug: 'movimiento', load: () => import('../pages/fundamentos/movimiento').then((m) => m.MovimientoPage), title: 'Movimiento', status: 'propuesta', description: 'Transiciones y respeto a «reducir movimiento».', keywords: ['animación', 'motion', 'prefers-reduced-motion'] },
          { slug: 'accesibilidad', load: () => import('../pages/fundamentos/accesibilidad').then((m) => m.AccesibilidadPage), title: 'Accesibilidad', status: 'decidido', description: 'WCAG 2.1 AA: contraste, foco, teclado y lectores de pantalla.', keywords: ['wcag', 'a11y', 'foco', 'aria'] },
        ],
      },
    ],
  },
  {
    slug: 'tokens',
    title: 'Tokens',
    description: 'Todas las variables del tema, con su clase de Tailwind y su valor en cada tema.',
    icon: 'braces',
    groups: [
      {
        pages: [
          { slug: 'todos', load: () => import('../pages/tokens/all-tokens').then((m) => m.AllTokensPage), title: 'Todos los tokens', status: 'decidido', description: 'Tabla con nombre, clase, valor claro y oscuro, contraste y uso.', keywords: ['variables', 'css'] },
          { slug: 'uso', load: () => import('../pages/tokens/token-usage').then((m) => m.TokenUsagePage), title: 'Cómo usar los tokens', status: 'decidido', description: 'Qué token elegir para texto, bordes y fondos, y qué evitar.', keywords: ['-text', 'contraste'] },
        ],
      },
    ],
  },
  {
    slug: 'componentes',
    title: 'Componentes',
    description: 'Componentes de daisyUI con los ajustes de accesibilidad del INAP y componentes propios del sitio.',
    icon: 'blocks',
    groups: [
      {
        label: 'Base (daisyUI)',
        pages: [
          { slug: 'boton', load: componentDoc, title: 'Botón', status: 'decidido', description: 'Sólido, contorno, suave y fantasma, en todos los colores.', keywords: ['button', 'btn', 'btn-outline', 'btn-soft', 'btn-ghost'] },
          { slug: 'campos', load: componentDoc, title: 'Campos de texto', status: 'decidido', description: 'Input, Select y Textarea con estados de foco y error.', keywords: ['input', 'select', 'textarea', 'formulario'] },
          { slug: 'seleccion', load: componentDoc, title: 'Casilla, radio e interruptor', status: 'decidido', description: 'Checkbox, Radio y Toggle.', keywords: ['checkbox', 'radio', 'toggle'] },
          { slug: 'badge', load: componentDoc, title: 'Badge', status: 'decidido', description: 'Sólido, suave y contorno. No interactivo.', keywords: ['badge-soft', 'etiqueta'] },
          { slug: 'alerta', load: componentDoc, title: 'Alerta', status: 'decidido', description: 'Mensajes de estado con role="status" o role="alert".', keywords: ['alert', 'aviso'] },
          { slug: 'tabs', load: componentDoc, title: 'Tabs', status: 'decidido', description: 'Pestañas y tabs como enlaces de ancla.', keywords: ['tabs-border', 'pestañas'] },
          { slug: 'breadcrumb', load: componentDoc, title: 'Breadcrumb', status: 'decidido', description: 'Ubicación de la página dentro del sitio.', keywords: ['breadcrumbs', 'ruta'] },
          { slug: 'paginacion', load: componentDoc, title: 'Paginación', status: 'decidido', description: 'Navegación entre páginas de resultados.', keywords: ['pagination', 'join'] },
          { slug: 'acordeon', load: componentDoc, title: 'Acordeón', status: 'decidido', description: 'Contenido que se expande con details y summary.', keywords: ['collapse', 'faq'] },
          { slug: 'avatar', load: componentDoc, title: 'Avatar', status: 'decidido', description: 'Foto o iniciales del usuario.', keywords: ['avatar-placeholder'] },
          { slug: 'dialogo', load: componentDoc, title: 'Diálogo', status: 'decidido', description: 'Ventana modal con el elemento dialog.', keywords: ['modal', 'dialog'] },
          { slug: 'menu-desplegable', load: componentDoc, title: 'Menú desplegable', status: 'decidido', description: 'Dropdown y menu.', keywords: ['dropdown', 'menu'] },
        ],
      },
      {
        label: 'Navegación',
        pages: [
          { slug: 'barra-de-navegacion', title: 'Barra de navegación', status: 'propuesta', description: 'Encabezado de Angular, con y sin sesión iniciada.', keywords: ['navbar', 'header'] },
          { slug: 'mega-menu', title: 'Mega menú', status: 'propuesta', description: 'Panel del menú «Cursos».', keywords: ['mega menu', 'dropdown'] },
          { slug: 'menu-movil', title: 'Menú en celular', status: 'propuesta', description: 'Menú a pantalla completa en celular.', keywords: ['mobile menu', 'drawer'] },
          { slug: 'menu-de-usuario', title: 'Menú de usuario', status: 'propuesta', description: 'Botón de usuario y menú por rol.', keywords: ['user menu', 'cuenta'] },
          { slug: 'pie-de-pagina', title: 'Pie de página', status: 'propuesta', description: 'Pie de la plataforma de cursos.', keywords: ['footer'] },
        ],
      },
      {
        label: 'Búsqueda',
        pages: [
          { slug: 'buscador', title: 'Buscador', status: 'propuesta', description: 'Buscador del hero y de la barra.', keywords: ['hero search', 'nav search', 'search'] },
          { slug: 'sugerencias', title: 'Sugerencias de búsqueda', status: 'propuesta', description: 'Panel de sugerencias con patrón combobox.', keywords: ['search suggest', 'combobox'] },
        ],
      },
      {
        label: 'Home',
        pages: [
          { slug: 'carrusel', title: 'Carrusel', status: 'propuesta', description: 'Carrusel destacado con flechas, indicadores y pausa.', keywords: ['carousel', 'p-carousel', 'primeng'] },
          { slug: 'selector-de-audiencia', title: 'Selector de audiencia', status: 'propuesta', description: '«Para ti» y «Para tu institución».', keywords: ['audience toggle', 'radiogroup'] },
          { slug: 'encabezado-de-seccion', title: 'Encabezado de sección', status: 'propuesta', description: 'Título, texto y enlace de cada sección.', keywords: ['section header'] },
          { slug: 'tarjeta-tipo-de-curso', title: 'Tarjeta de tipo de curso', status: 'propuesta', description: 'Tipos de formación del Home.', keywords: ['course type card'] },
          { slug: 'tarjeta-de-area', title: 'Tarjeta de área', status: 'propuesta', description: 'Áreas de formación.', keywords: ['area card'] },
          { slug: 'estadistica', title: 'Estadística', status: 'propuesta', description: 'Cifras destacadas.', keywords: ['stat'] },
          { slug: 'testimonio', title: 'Testimonio', status: 'propuesta', description: 'Tarjeta de testimonio.', keywords: ['testimonial card'] },
        ],
      },
      {
        label: 'Cursos',
        pages: [
          { slug: 'tarjeta-de-curso', load: componentDoc, title: 'Tarjeta de curso', status: 'propuesta', description: 'Tarjeta clicable con miniatura, tipo y datos clave.', keywords: ['course card', 'card'] },
          { slug: 'miniatura-de-curso', load: componentDoc, title: 'Miniatura de curso', status: 'propuesta', description: 'Imagen 16:9 con badge del tipo.', keywords: ['course thumbnail'] },
          { slug: 'etiquetas-y-estados', load: componentDoc, title: 'Etiquetas y estados', status: 'propuesta', description: 'Tag y Status Badge.', keywords: ['tag', 'status badge', 'badge-soft'] },
          { slug: 'chip', load: componentDoc, title: 'Chip', status: 'propuesta', description: 'Enlaces y filtros en forma de chip.', keywords: ['chip', 'aria-pressed'] },
          { slug: 'tarjeta-de-inscripcion', load: componentDoc, title: 'Tarjeta de inscripción', status: 'propuesta', description: 'Tarjeta y barra de inscripción por estado.', keywords: ['enrollment card', 'enrollment bar'] },
          { slug: 'datos-del-curso', load: componentDoc, title: 'Datos del curso', status: 'propuesta', description: 'Fact Row, Checklist Item y Module Row.', keywords: ['fact row', 'checklist item', 'module row', 'dl'] },
          { slug: 'docente', load: componentDoc, title: 'Docente', status: 'propuesta', description: 'Foto, nombre, cargo y reseña.', keywords: ['instructor'] },
          { slug: 'ediciones', load: componentDoc, title: 'Ediciones', status: 'propuesta', description: 'Otras ediciones y aviso de edición.', keywords: ['edition row', 'edition alert'] },
          { slug: 'barra-de-administracion', load: componentDoc, title: 'Barra de administración', status: 'propuesta', description: 'Acciones para usuarios con permisos.', keywords: ['admin bar'] },
        ],
      },
      {
        label: 'Catálogo',
        pages: [
          { slug: 'filtros', title: 'Filtros', status: 'decidido', description: 'Opciones, grupos y etiquetas de filtros activos.', keywords: ['filter option', 'filter group', 'filter tag', 'fieldset'] },
          { slug: 'estado-vacio', title: 'Estado vacío', status: 'decidido', description: 'Mensaje cuando no hay resultados.', keywords: ['empty state', 'sin resultados'] },
        ],
      },
    ],
  },
  {
    slug: 'patrones',
    title: 'Patrones',
    description: 'Soluciones repetibles para problemas comunes de la plataforma.',
    icon: 'workflow',
    groups: [
      {
        pages: [
          { slug: 'estructura-de-pagina', title: 'Estructura de página', status: 'propuesta', description: 'Enlace para saltar al contenido, encabezado, main y pie.', keywords: ['skip link', 'landmarks'] },
          { slug: 'cambio-de-ruta', title: 'Título y foco al cambiar de ruta', status: 'propuesta', description: 'Anunciar la página nueva a los lectores de pantalla.', keywords: ['router', 'focus', 'title'] },
          { slug: 'visibilidad-al-desplazar', title: 'Mostrar u ocultar al desplazar', status: 'propuesta', description: 'Una directiva para buscador, barra de inscripción y scroll spy.', keywords: ['intersection observer', 'scroll'] },
          { slug: 'anclas', title: 'Anclas y scroll spy', status: 'propuesta', description: 'Tabs del detalle de curso como enlaces de ancla.', keywords: ['scroll spy', 'fragment'] },
          { slug: 'dialogos', title: 'Diálogos', status: 'propuesta', description: 'Abrir, cerrar y devolver el foco.', keywords: ['modal', 'dialog', 'foco'] },
          { slug: 'formularios', title: 'Formularios y errores', status: 'propuesta', description: 'Etiquetas, ayuda, validación y mensajes de error.', keywords: ['form', 'validación', 'error'] },
          { slug: 'estados-de-inscripcion', title: 'Estados de inscripción', status: 'propuesta', description: 'Qué muestra la tarjeta en cada estado de la edición.', keywords: ['enrollment', 'cupo'] },
          { slug: 'filtros-del-catalogo', title: 'Filtros del catálogo', status: 'decidido', description: 'Filtros en la URL, escritorio y celular.', keywords: ['catálogo', 'query params'] },
        ],
      },
    ],
  },
  {
    slug: 'plantillas',
    title: 'Plantillas',
    description: 'Páginas completas, adaptables a cualquier pantalla.',
    icon: 'layout-template',
    groups: [
      {
        pages: [
          { slug: 'home', title: 'Home', status: 'propuesta', description: 'Versiones «Para ti» y «Para tu institución».', keywords: ['inicio', 'landing'] },
          { slug: 'catalogo', title: 'Catálogo', status: 'decidido', description: 'Catálogo con filtros y paginación.', keywords: ['catalog', 'cursos'] },
          { slug: 'detalle-de-curso', title: 'Detalle de curso', status: 'propuesta', description: 'Información, programa, docente y preguntas.', keywords: ['course detail', 'curso'] },
        ],
      },
    ],
  },
  {
    slug: 'contenido',
    title: 'Contenido',
    description: 'Cómo escribimos en la interfaz.',
    icon: 'pen-line',
    groups: [
      {
        pages: [
          { slug: 'voz-y-tono', title: 'Voz y tono', status: 'propuesta', description: 'Claro, cercano y respetuoso, en español de Guatemala.', keywords: ['redacción', 'tuteo'] },
          { slug: 'textos-de-interfaz', title: 'Textos de la interfaz', status: 'propuesta', description: 'Botones, mensajes y etiquetas de uso frecuente.', keywords: ['microcopy', 'ux writing'] },
          { slug: 'contenido-provisional', title: 'Contenido provisional', status: 'decidido', description: 'Qué datos del diseño son de ejemplo.', keywords: ['placeholder'] },
        ],
      },
    ],
  },
  {
    slug: 'recursos',
    title: 'Recursos',
    description: 'Archivos, enlaces y registro de cambios.',
    icon: 'library',
    groups: [
      {
        pages: [
          { slug: 'descargas', title: 'Descargas', status: 'decidido', description: 'CSS del tema, CSS para WordPress y logos.', keywords: ['css', 'svg', 'wordpress'] },
          { slug: 'registro-de-cambios', title: 'Registro de cambios', status: 'decidido', description: 'Qué cambió y cuándo.', keywords: ['changelog'] },
        ],
      },
    ],
  },
];

export function sectionPages(section: NavSection): PageRef[] {
  return section.groups.flatMap((g) =>
    g.pages.map((p) => ({ ...p, path: `/${section.slug}/${p.slug}`, section })),
  );
}

export const ALL_PAGES: PageRef[] = SECTIONS.flatMap(sectionPages);

export function findSection(slug: string | undefined): NavSection | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}

export function findPage(section: string, page: string): PageRef | undefined {
  return ALL_PAGES.find((p) => p.section.slug === section && p.slug === page);
}
