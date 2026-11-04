import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

export const paginacion: ComponentDoc = {
  intro: `<p>Navegación entre páginas de resultados del catálogo. 9 cursos por página en escritorio.</p>`,
  examples: [
    { title: 'Paginación', html: dedent(`
      <nav aria-label="Paginación">
        <ul class="join">
          <li><a href="#" class="join-item btn btn-ghost btn-square" aria-label="Página anterior">${icon('chevron-left')}</a></li>
          <li><a href="#" class="join-item btn btn-ghost" aria-label="Página 1">1</a></li>
          <li><a href="#" class="join-item btn btn-primary" aria-label="Página 2" aria-current="page">2</a></li>
          <li><a href="#" class="join-item btn btn-ghost" aria-label="Página 3">3</a></li>
          <li><span class="join-item btn btn-ghost pointer-events-none" aria-hidden="true">…</span></li>
          <li><a href="#" class="join-item btn btn-ghost" aria-label="Página 8">8</a></li>
          <li><a href="#" class="join-item btn btn-ghost btn-square" aria-label="Página siguiente">${icon('chevron-right')}</a></li>
        </ul>
      </nav>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Muestra la primera, la última y las páginas alrededor de la actual; el resto se resume con «…».</li>
      <li>Los números son enlaces con la página en la URL (<code>?pagina=2</code>), para poder compartir y volver con Atrás.</li>
      <li>En celular, los botones usan <code>btn-lg</code> o, como mínimo, 44 px de zona táctil.</li>
      <li>Al cambiar de página, el foco pasa al encabezado de los resultados.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><code>&lt;nav aria-label="Paginación"&gt;</code>.</li>
    <li>La página actual lleva <code>aria-current="page"</code>; su estilo no depende solo del color (fondo sólido).</li>
    <li>Flechas con <code>aria-label</code> («Página anterior», «Página siguiente»). En la primera o la última página, la flecha se quita o se deshabilita.</li>
  </ul>`,
  classes: [
    ['join, join-item', 'Agrupa los botones.'],
    ['btn btn-primary', 'Página actual.'],
    ['btn btn-ghost', 'Resto de páginas y flechas.'],
  ],
};
