import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

const COLORS = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
const LABELS: Record<string, string> = {
  primary: 'Primario', secondary: 'Secundario', accent: 'Acento', neutral: 'Neutro',
  info: 'Info', success: 'Éxito', warning: 'Advertencia', error: 'Error',
};
const row = (extra: string) =>
  COLORS.map((c) => `<button class="btn ${extra}btn-${c}">${LABELS[c]}</button>`).join('\n');

export const boton: ComponentDoc = {
  figmaNode: '33-66',
  intro: `<p>Los botones ejecutan acciones: enviar, inscribirse, abrir un diálogo. Para ir a otra página se usa un enlace (<code>&lt;a&gt;</code>), aunque tenga forma de botón. En Figma hay un set por estilo (Button, Button Outline, Button Soft, Button Ghost), con las variantes Color × State; el tamaño sale del modo <strong>Control size</strong>.</p>`,
  examples: [
    { title: 'Sólido', description: 'La acción principal de la vista. Uno por sección.', html: row('') },
    { title: 'Contorno', description: 'Acciones secundarias junto a un botón sólido.', html: row('btn-outline ') },
    { title: 'Suave', description: 'Acciones de menor peso dentro de tarjetas y barras.', html: row('btn-soft ') },
    { title: 'Fantasma', description: 'Acciones terciarias, barras de herramientas y botones de solo ícono.', html: dedent(`
      <button class="btn btn-ghost">Cancelar</button>
      <button class="btn btn-ghost btn-square" aria-label="Buscar">${icon('search')}</button>
    `) },
    { title: 'Con ícono', html: dedent(`
      <button class="btn btn-primary">Inscribirme ${icon('arrow-right')}</button>
      <button class="btn btn-outline btn-primary">${icon('download')} Descargar programa</button>
    `) },
    { title: 'Blanco sobre foto o superficie navy', description: 'Color=White en Figma. Igual en los dos temas.', previewClass: 'flex flex-wrap items-center gap-3 bg-inap-brand-navy p-6', html: dedent(`
      <a href="#" class="btn border-white bg-white text-inap-brand-navy hover:bg-inap-neutral-100">Ver cursos</a>
    `) },
    { title: 'Deshabilitado', description: 'Botón con el atributo disabled; enlace con btn-disabled y aria-disabled.', html: dedent(`
      <button class="btn btn-primary" disabled>Inscribirme</button>
      <a class="btn btn-primary btn-disabled" role="link" aria-disabled="true" tabindex="-1">Ver diploma</a>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Un solo botón sólido <code>btn-primary</code> por sección: es la acción que el usuario busca.</li>
      <li>La etiqueta empieza con un verbo y dice qué pasa: «Inscribirme», «Descargar programa». Nada de «Clic aquí» ni «Enviar» a secas.</li>
      <li>En celular, todos los botones usan <code>btn-lg</code> (48 px).</li>
      <li>Los colores de estado (<code>success</code>, <code>error</code>…) se usan solo cuando el botón comunica ese estado; por ejemplo, <code>btn-error</code> para eliminar.</li>
    </ul>`,
    doDont: [
      {
        doText: 'Una acción principal, acompañada de una secundaria en contorno.',
        dontText: 'Varios botones sólidos que compiten entre sí.',
        doHtml: `<button class="btn btn-primary">Inscribirme</button><button class="btn btn-outline btn-primary">Ver programa</button>`,
        dontHtml: `<button class="btn btn-primary">Inscribirme</button><button class="btn btn-secondary">Ver programa</button><button class="btn btn-accent">Compartir</button>`,
      },
    ],
  },
  a11y: `<ul>
    <li><strong>Foco:</strong> anillo de 2 px en el token <code>-text</code> del color, con 2 px de separación. <code>btn-accent</code> usa <code>accent-text</code> porque el cian da 2.44:1 sobre blanco. Ya está en <code>inap-components.css</code>.</li>
    <li><strong>Contraste:</strong> el texto de todos los colores sólidos cumple 4.5:1 con su <code>-content</code>.</li>
    <li><strong>Botón o enlace:</strong> <code>&lt;button&gt;</code> para acciones, <code>&lt;a&gt;</code> para navegar. Un enlace con <code>btn</code> sigue siendo un enlace para el lector de pantalla.</li>
    <li><strong>Solo ícono:</strong> requiere <code>aria-label</code>; el SVG lleva <code>aria-hidden="true"</code>.</li>
    <li><strong>Deshabilitado:</strong> atributo <code>disabled</code>. En enlaces, <code>btn-disabled</code> + <code>aria-disabled="true"</code> + <code>tabindex="-1"</code>. Si el usuario necesita saber por qué no puede continuar, mejor dejar el botón activo y explicar el problema al pulsarlo.</li>
    <li><strong>Área táctil:</strong> 44 × 44 px como mínimo en celular; con <code>btn-lg</code> se cumple.</li>
  </ul>`,
  classes: [
    ['btn', 'Base del botón.'],
    ['btn-{color}', 'Color: primary, secondary, accent, neutral, info, success, warning, error.'],
    ['btn-outline', 'Estilo contorno.'],
    ['btn-soft', 'Estilo suave.'],
    ['btn-ghost', 'Sin fondo ni borde.'],
    ['btn-xs … btn-xl', 'Tamaño. Ver <a href="/fundamentos/tamano-de-controles">Tamaño de controles</a>.'],
    ['btn-square, btn-circle', 'Botón de solo ícono, cuadrado o redondo.'],
    ['btn-disabled', 'Aspecto deshabilitado, para enlaces.'],
    ['btn-primary-light, btn-secondary-light', 'Estilos del equipo de desarrollo. Su hover pasa a <code>bg-primary</code> / <code>bg-secondary</code> (4.25 → 6.79).'],
  ],
  snippets: [
    { title: 'Botón con ícono en Angular', language: 'HTML · Angular', code: dedent(`
      <button type="button" class="btn btn-primary" (click)="inscribir()">
        Inscribirme <inap-icon name="arrow-right" />
      </button>
    `) },
  ],
};
