import { pagination } from './sitio-catalogo';
import { ComponentDoc } from './types';

export const paginacion: ComponentDoc = {
  figmaNode: '515-1991',
  intro: `<p>Navegación entre páginas de resultados del catálogo y de la búsqueda. 9 cursos por página en escritorio y 6 en celular. En escritorio muestra los números de página; en celular, «Página 1 de 4» entre «Anterior» y «Siguiente».</p>`,
  examples: [
    { title: 'Primera página', description: '«Anterior» deshabilitado. Cambien el ancho de la ventana por debajo de 768 px para ver la versión de celular.', previewClass: 'p-6', html: pagination(1, 3) },
    { title: 'Muchas páginas', description: 'La primera, la última y las vecinas de la actual; el resto se resume con «…».', previewClass: 'p-6', html: pagination(5, 12) },
  ],
  usage: {
    html: `<ul>
      <li>Hasta 7 páginas se muestran todas; con más, la primera, la última y las vecinas de la actual.</li>
      <li>Los números son enlaces con la página en la URL (<code>?pagina=2</code>), para poder compartir y volver con Atrás.</li>
      <li>Todas las áreas táctiles miden 44 px.</li>
      <li>Al cambiar de página, el foco pasa al encabezado de los resultados.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><code>&lt;nav aria-label="Paginación"&gt;</code> con una lista.</li>
    <li>La página actual lleva <code>aria-current="page"</code>; su estilo no depende solo del color (fondo sólido).</li>
    <li>Cada número se lee «Página 2»; «Anterior» y «Siguiente» dicen a qué página llevan.</li>
    <li>En la primera o la última página, la flecha que no aplica es texto con <code>aria-disabled="true"</code>, no un enlace.</li>
  </ul>`,
  classes: [
    ['size-11 rounded-lg', 'Número de página (44 px).'],
    ['bg-primary text-primary-content', 'Página actual.'],
    ['text-primary-text', '«Anterior» y «Siguiente».'],
    ['text-base-content/60', 'Flecha deshabilitada.'],
  ],
};
