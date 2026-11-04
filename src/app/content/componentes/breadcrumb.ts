import { dedent } from '../../core/dedent';
import { ComponentDoc } from './types';

export const breadcrumb: ComponentDoc = {
  intro: `<p>Muestra dónde está la página dentro del sitio y permite subir de nivel. Solo en escritorio, en una barra de ancho completo (<code>bg-surface-muted</code>) bajo la barra de administración. En celular se reemplaza por el enlace «Regresar». El breadcrumb nunca cruza de Angular a WordPress.</p>`,
  examples: [
    { title: 'Breadcrumb', previewClass: 'bg-surface-muted px-6 py-3', html: dedent(`
      <nav aria-label="Breadcrumb" class="breadcrumbs text-sm">
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Cursos</a></li>
          <li><span aria-current="page">Gestión pública por resultados</span></li>
        </ul>
      </nav>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>El primer elemento es «Inicio» de la plataforma de cursos.</li>
      <li>El último es la página actual, sin enlace.</li>
      <li>Títulos largos se recortan con <code>truncate</code> y un ancho máximo; el texto completo sigue en el <code>&lt;h1&gt;</code>.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><code>&lt;nav aria-label="Breadcrumb"&gt;</code> con una lista.</li>
    <li>La página actual lleva <code>aria-current="page"</code>.</li>
    <li>Los separadores son decorativos (daisyUI los dibuja con CSS, así que no se leen).</li>
  </ul>`,
  classes: [['breadcrumbs', 'Lista con separadores.']],
};
