import { dedent } from '../../core/dedent';
import { ComponentDoc } from './types';

const COLORS = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
const row = (style: string) => COLORS.map((c) => `<span class="badge ${style}badge-${c}">${c}</span>`).join('\n');

export const badge: ComponentDoc = {
  intro: `<p>Etiquetas cortas que describen algo: el estado de una inscripción, el tipo o la categoría de un curso. No son interactivas. En Figma hay tres sets: Badge (sólido, con Base y Ghost), Badge Soft y Badge Outline.</p>`,
  examples: [
    { title: 'Suave', description: 'El estilo más usado: estados (Status Badge) y etiquetas (Tag).', html: row('badge-soft ') },
    { title: 'Sólido', html: row('') },
    { title: 'Contorno', html: row('badge-outline ') },
    { title: 'Categorías', description: 'Solo en suave.', html: ['garbo', 'royal', 'deep', 'danger'].map((c) => `<span class="badge badge-soft badge-${c}">${c}</span>`).join('\n') },
    { title: 'Estados de inscripción', html: dedent(`
      <span class="badge badge-soft badge-success">Inscripción abierta</span>
      <span class="badge badge-soft badge-info">Inscrito</span>
      <span class="badge badge-soft badge-warning">¡Queda 1 día!</span>
      <span class="badge badge-soft badge-error">Cupo lleno</span>
      <span class="badge badge-soft badge-neutral">Cerrada</span>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Texto de una a tres palabras. El texto dice el significado; el color lo refuerza.</li>
      <li>Estados con <code>badge-soft</code> y los colores de estado. Categorías de curso con los colores de categoría, solo en suave.</li>
      <li>Si la etiqueta quita un filtro al pulsarla, no es un badge: es un botón (Filter Tag).</li>
    </ul>`,
    doDont: [
      {
        doText: 'El texto dice el estado.',
        dontText: 'Solo color, sin texto que lo explique.',
        doHtml: `<span class="badge badge-soft badge-error">Cupo lleno</span>`,
        dontHtml: `<span class="badge badge-error badge-xs" aria-hidden="true"></span><span class="text-sm">Administración pública</span>`,
      },
    ],
  },
  a11y: `<ul>
    <li><strong>Contraste:</strong> en suave y contorno el texto usa el token <code>-text</code>. El fondo suave es opaco (8 % del color mezclado con <code>base-100</code>), así que el contraste no cambia dentro de tarjetas.</li>
    <li><strong>No interactivo:</strong> un <code>&lt;span&gt;</code>. Si hace algo, es <code>&lt;button&gt;</code>.</li>
    <li><strong>Contexto:</strong> si el badge solo tiene sentido junto a otro dato (por ejemplo, «Nuevo»), el lector de pantalla debe oírlo en orden: el badge va dentro del mismo enlace o encabezado.</li>
  </ul>`,
  classes: [
    ['badge', 'Base.'],
    ['badge-{color}', 'Color de estado o de categoría.'],
    ['badge-soft', 'Fondo suave opaco y texto <code>-text</code>.'],
    ['badge-outline', 'Contorno; borde y texto en <code>-text</code>.'],
    ['badge-xs … badge-xl', 'Tamaño.'],
  ],
};
