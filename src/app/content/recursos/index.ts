import { FIGMA_URL, REPO_URL } from '../../core/navigation';
import { icon } from '../componentes/types';
import { PatternDoc } from '../patrones/types';

const table = (head: string[], rows: string[][]) => `<div class="doc-table-wrap"><table class="doc-table">
  <thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
  <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div>`;

/** Enlace de descarga: archivo servido por este sitio. */
const download = (href: string, name: string) =>
  `<a href="${href}" download class="inline-flex items-center gap-1 font-semibold">${icon('download', 16)}<span>${name}</span></a>`;

/** Enlace externo, abre en otra pestaña. */
const external = (href: string, text: string) =>
  `<a href="${href}" target="_blank" rel="noopener">${text}<span class="sr-only"> (se abre en otra pestaña)</span></a>`;

/* ── Descargas ──────────────────────────────────────────────────────────────── */

const descargas: PatternDoc = {
  intro: `<p>Los archivos del sistema de diseño, iguales a los del repositorio. Cómo instalarlos en <a href="primeros-pasos/instalacion">Instalación</a>.</p>`,
  sections: [
    {
      id: 'tema',
      title: 'CSS del tema',
      html: table(
        ['Archivo', 'Qué contiene', 'Dónde va'],
        [
          [download('archivos/tema/inap-theme.css', 'inap-theme.css'), 'Tokens de color, tipografía y forma; temas inap y dark.', 'Inicio de <code>tailwind.css</code> (reemplaza el bloque del tema)'],
          [download('archivos/tema/inap-components.css', 'inap-components.css'), 'Ajustes de contraste de los componentes de daisyUI.', 'Al final de <code>tailwind.css</code>'],
          [download('archivos/tema/inap-safelist.css', 'inap-safelist.css'), 'Colores y tamaños de daisyUI que siempre se generan.', 'Al final de <code>tailwind.css</code>'],
          [download('archivos/tema/inap-navigation.css', 'inap-navigation.css'), 'Navegación lateral (nav-link, nav-active). Opcional.', 'Al final, si usan la navegación lateral'],
        ],
      ) + `<p>Para Tailwind 4.1.4 y daisyUI 5.5.19, las mismas versiones de la plataforma.</p>`,
    },
    {
      id: 'wordpress',
      title: 'CSS para WordPress',
      html: `<p>El sitio institucional usa un solo archivo compilado con los mismos archivos del tema. No se descarga desde aquí: Tailwind solo genera las clases que encuentra en las plantillas, y las del tema de WordPress no están en este sitio.</p>
      <ul>
        <li>Se compila con <code>npm run build:css</code> en este repositorio, con el tema de WordPress en la carpeta vecina, y sale en <code>dist/wordpress/inap.css</code>.</li>
        <li>Va dentro del tema de WordPress, en <code>assets/css/inap.css</code>. Cada versión del tema (archivo .zip) ya lo incluye.</li>
        <li>No se edita a mano: un cambio se hace en los archivos del tema y se vuelve a compilar.</li>
      </ul>`,
    },
    {
      id: 'logos',
      title: 'Logos',
      html: table(
        ['Archivo', 'Uso'],
        [
          [download('brand/logo-color.svg', 'logo-color.svg'), 'Sobre fondos claros.'],
          [download('brand/logo-white.svg', 'logo-white.svg'), 'Sobre fondos oscuros o de color de marca.'],
        ],
      ) + `<p>Tamaño mínimo, área de protección y usos incorrectos en <a href="fundamentos/logo">Logo y marca</a>. En el código, el logo va como SVG en línea para que cambie de color con el tema.</p>`,
    },
    {
      id: 'enlaces',
      title: 'Enlaces',
      html: `<ul>
        <li>${external(FIGMA_URL, 'Figma: INAP Design System')}: componentes y pantallas. Es la fuente de verdad del diseño.</li>
        <li>${external(REPO_URL, 'Repositorio de este sitio')}: código del sitio, archivos del tema y CSS para WordPress.</li>
        <li>${external(REPO_URL + '/blob/main/docs/guia-implementacion-angular.md', 'Guía de implementación en Angular')}: cómo aplicar el sistema de diseño con daisyUI.</li>
        <li>${external(REPO_URL + '/blob/main/docs/consideraciones-desarrollo.md', 'Consideraciones de desarrollo')}: reglas comunes de Angular y WordPress, con su estado.</li>
      </ul>`,
    },
  ],
  usedIn: [],
};

/* ── Registro de cambios ────────────────────────────────────────────────────── */

/** Semanas, de la más reciente a la más antigua. Agregar una línea con cada cambio publicado. */
const CHANGES: { id: string; week: string; items: string[] }[] = [
  {
    id: 'semana-23-nov',
    week: 'Semana del 23 al 27 de noviembre de 2026',
    items: [
      '<strong>Plantillas:</strong> Home, Catálogo con filtros que funcionan y Detalle de curso en cada estado de inscripción, en escritorio y celular.',
      '<strong>Patrones:</strong> las ocho páginas (estructura, foco al cambiar de ruta, mostrar u ocultar al desplazar, anclas, diálogos, formularios, estados de inscripción y filtros).',
      '<strong>Guía de implementación §10:</strong> el foco va a <code>&lt;main&gt;</code> solo si cambia la ruta; las tabs usan <code>aria-current="location"</code>; nueva regla del scroll spy.',
      '<strong>Contenido:</strong> voz y tono, textos de la interfaz y contenido provisional.',
      '<strong>Recursos:</strong> descargas y este registro.',
      '<strong>Consideraciones:</strong> tamaño mínimo de la foto del curso (1600 × 760 px); en el breadcrumb solo la página actual va en gris; «Inscribirme» de un evento lleva a Angular.',
    ],
  },
  {
    id: 'semana-16-nov',
    week: 'Semana del 16 al 20 de noviembre de 2026',
    items: [
      '<strong>Componentes del sitio:</strong> sugerencias de búsqueda (Angular y WordPress), barra de navegación, pie de página, mega menú, menú en celular y menú de usuario.',
      '<strong>Pantallas:</strong> nueva sección con las pantallas de Figma y capturas de cada estado.',
      '<strong>WordPress:</strong> las plantillas de encabezado y pie, y los menús iniciales, salen de este repositorio.',
      '<strong>Consideraciones:</strong> el registro ya no pide confirmar la contraseña; el buscador de la barra empieza oculto también en el inicio de WordPress; ondas de marca en el encabezado del detalle de curso.',
    ],
  },
  {
    id: 'semana-9-nov',
    week: 'Semana del 9 al 13 de noviembre de 2026',
    items: [
      '<strong>Componentes del sitio:</strong> detalle de curso (tarjeta de inscripción, datos, docente, ediciones, barra de administración), Home (carrusel, selector de audiencia, encabezado de sección, tarjetas, estadística, testimonio) y buscador.',
      '<strong>Tema claro y oscuro:</strong> sigue la configuración del dispositivo; el botón solo guarda la elección si es distinta.',
      '<strong>Consideraciones:</strong> respuestas del equipo de desarrollo del 13 de noviembre; Transparencia con un enlace a OneDrive por periodo y nombres de los numerales según el artículo 10.',
    ],
  },
  {
    id: 'semana-2-nov',
    week: 'Semana del 2 al 6 de noviembre de 2026',
    items: [
      '<strong>Primera versión del sitio:</strong> Angular 22, Tailwind 4.1.4, daisyUI 5.5.19 y el tema de INAP.',
      '<strong>Fundamentos, tokens y componentes base</strong>, con el contraste WCAG de cada token.',
      '<strong>Primeros pasos:</strong> instalación, tema claro y oscuro, cómo leer Figma, revisión antes de entregar y cambios de diseño.',
      '<strong>Componentes del sitio:</strong> tarjeta de curso, miniatura, etiquetas y chip.',
      '<strong>Consideraciones:</strong> propuestas de inicio de sesión, registro y completar perfil (se pide al inscribirse, en 2 pasos).',
    ],
  },
];

const registroDeCambios: PatternDoc = {
  intro: `<p>Qué cambió en el sistema de diseño y en los documentos, por semana. El detalle de cada cambio está en el ${external(REPO_URL + '/commits/main', 'historial del repositorio')}.</p>`,
  sections: CHANGES.map((c) => ({ id: c.id, title: c.week, html: `<ul>${c.items.map((i) => `<li>${i}</li>`).join('')}</ul>` })),
  usedIn: [],
};

/** Páginas de Recursos, por slug. */
export const RESOURCE_DOCS: Record<string, PatternDoc> = {
  descargas,
  'registro-de-cambios': registroDeCambios,
};
