import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FIGMA_URL } from '../../core/navigation';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Icon } from '../../ui/icon/icon';
import { TemplatePreview } from '../../ui/template-preview/template-preview';

interface Row { section: string; mobile: string; desktop: string; components: [string, string][] }

const ROWS: Row[] = [
  { section: 'Barra de navegación', mobile: 'Logo, buscar, menú y «Regístrate».', desktop: 'Barra superior y barra principal; desde 1280 px.', components: [['Barra de navegación', 'barra-de-navegacion']] },
  { section: 'Breadcrumb', mobile: 'No se muestra.', desktop: 'Barra gris de ancho completo desde 768 px: Inicio › Catálogo de cursos.', components: [['Breadcrumb', 'breadcrumb']] },
  { section: 'Encabezado', mobile: 'Título de 30 px y descripción de 16 px.', desktop: 'Título de 48 px y descripción de 18 px, hasta 720 px de ancho.', components: [] },
  { section: 'Filtros', mobile: 'Botón «Filtros» que abre la hoja a pantalla completa; se aplican con «Ver N cursos».', desktop: 'Columna de 280 px a la izquierda desde 1024 px; se aplican al marcar.', components: [['Filtros', 'filtros']] },
  { section: 'Barra de resultados', mobile: '«Filtros (N)» y «Ordenar» en una fila de 48 px; el conteo debajo.', desktop: 'Conteo a la izquierda; «Ordenar por» a la derecha.', components: [['Campos de texto', 'campos']] },
  { section: 'Filtros activos', mobile: 'Etiquetas de 44 px en una fila que se desplaza; «Limpiar».', desktop: 'Etiquetas de 36 px que se envuelven; «Limpiar filtros».', components: [['Filtros', 'filtros']] },
  { section: 'Resultados', mobile: 'Una columna, 6 cursos por página.', desktop: '2 columnas en tableta y 3 desde 1280 px; 9 cursos por página.', components: [['Tarjeta de curso', 'tarjeta-de-curso'], ['Estado vacío', 'estado-vacio']] },
  { section: 'Paginación', mobile: '«Anterior», «Página 1 de 4», «Siguiente».', desktop: 'Números de página centrados.', components: [['Paginación', 'paginacion']] },
  { section: 'Pie de página', mobile: 'Columnas en 2 × 2.', desktop: 'Logo y contacto a la izquierda, tres columnas de enlaces.', components: [['Pie de página', 'pie-de-pagina']] },
];

/** Plantilla del Catálogo: la página completa en un iframe, funcional con cursos de ejemplo. */
@Component({
  selector: 'inap-catalogo-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, Icon, RouterLink, TemplatePreview],
  template: `
    <inap-doc-page section="plantillas" slug="catalogo" [figma]="figmaUrl">
      <p>
        Catálogo de cursos armado con los componentes del sitio, tal como se ve en celular y en escritorio. Las capturas de
        Figma, con los estados filtrado, sin resultados y la hoja de filtros, están en
        <a routerLink="/pantallas/catalogo">Pantallas › Catálogo</a>.
      </p>
      <dl class="mb-8 grid max-w-prose grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt class="font-semibold">Plataforma</dt>
        <dd class="text-neutral-text">Angular</dd>
        <dt class="font-semibold">Dirección</dt>
        <dd>Por definir con el equipo de desarrollo. Los filtros van en la URL: <code>?tipo=certificacion&amp;inscripcion=abierta&amp;pagina=2</code></dd>
      </dl>

      <div role="note" class="alert alert-info mb-8 max-w-prose items-start alert-soft">
        <inap-icon name="info" class="mt-0.5" />
        <p class="m-0">
          Los 24 cursos son de ejemplo: las 9 primeras tarjetas son las de Figma y las demás completan los conteos de los filtros.
          En la plataforma, los cursos y los conteos vienen del servicio.
        </p>
      </div>

      <h2 id="vista">Vista previa</h2>
      <p>
        Funciona: marquen filtros, quiten etiquetas, cambien el orden y la página. «Estudios de posgrado» con «MOOC» da el
        estado sin resultados; «Cursos con opción a certificación» con inscripción «Abierta» da los 3 cursos del estado
        filtrado de Figma. En celular, «Filtros» abre la hoja. Los demás enlaces no llevan a ninguna parte.
      </p>

      <inap-template-preview path="catalogo" label="Plantilla del Catálogo" />

      <h2 id="secciones">Secciones</h2>
      <p>De arriba hacia abajo. Celular: menos de 768 px.</p>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead>
            <tr><th scope="col">Sección</th><th scope="col">Celular</th><th scope="col">Escritorio</th><th scope="col">Componentes</th></tr>
          </thead>
          <tbody>
            @for (r of rows; track r.section) {
              <tr>
                <th scope="row" class="font-semibold">{{ r.section }}</th>
                <td>{{ r.mobile }}</td>
                <td>{{ r.desktop }}</td>
                <td>
                  @for (c of r.components; track c[1]; let last = $last) {
                    <a [routerLink]="'/componentes/' + c[1]">{{ c[0] }}</a>{{ last ? '' : ', ' }}
                  } @empty {
                    <span class="text-neutral-text">Propia del catálogo</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <h2 id="comportamiento">Comportamiento</h2>
      <ul>
        <li><strong>Estado en la URL:</strong> filtros, orden y página son parámetros (<code>?tipo=…&amp;orden=nombre&amp;pagina=2</code>). Se puede compartir el enlace y Atrás deshace el último cambio.</li>
        <li><strong>Filtros:</strong> dentro de un grupo se suman (O), entre grupos se combinan (Y). Cambiar un filtro o el orden vuelve a la página 1.</li>
        <li><strong>Conteos:</strong> el número junto a cada opción es fijo (total de cursos con esa opción), para que no cambie mientras se marca. El conteo de resultados sí cambia.</li>
        <li><strong>Celular:</strong> la hoja empieza con los filtros actuales y con abiertos solo los grupos que tienen algo marcado. «Ver N cursos» se recalcula al marcar; la X y Esc cierran sin aplicar.</li>
        <li><strong>Sin resultados:</strong> se muestran el conteo «0 cursos», las etiquetas y el estado vacío con «Limpiar filtros»; sin paginación.</li>
        <li><strong>Paginación:</strong> 9 cursos por página en escritorio y 6 en celular, como en Figma. Solo aparece si hay más de una página.</li>
        <li><strong>Desde el Home:</strong> «Cursos con opción a certificación» y los demás tipos llegan al catálogo con su filtro marcado (<code>?tipo=certificacion</code>); el título, la descripción y el breadcrumb cambian al del tipo («Catálogo de cursos › Cursos con opción a certificación»). En esta vista previa el título no cambia.</li>
      </ul>

      <h2 id="accesibilidad">Accesibilidad</h2>
      <ul>
        <li><strong>Encabezados:</strong> H1 «Catálogo de cursos»; H2 «Filtrar por» (visible) y «Resultados» (oculto); cada tarjeta es un H3.</li>
        <li><strong>Regiones:</strong> los filtros son un <code>&lt;aside&gt;</code> y los resultados un <code>&lt;section&gt;</code>, cada uno con <code>aria-labelledby</code> a su H2.</li>
        <li><strong>Conteo:</strong> «24 cursos» es <code>role="status"</code>; el lector anuncia el nuevo número al filtrar sin mover el foco.</li>
        <li><strong>Foco:</strong> al quitar una etiqueta, limpiar o cambiar de página, el foco pasa al encabezado «Resultados» (<code>tabindex="-1"</code>), para no perderse cuando el botón desaparece.</li>
        <li><strong>Orden:</strong> <code>&lt;select&gt;</code> con <code>&lt;label&gt;</code> «Ordenar por», visible en escritorio y oculto en celular, donde el campo ocupa la fila.</li>
        <li><strong>Hoja de filtros:</strong> <code>&lt;dialog&gt;</code> abierto con <code>showModal()</code>: el foco queda dentro, Esc cierra y el foco vuelve a «Filtros». La página de atrás no se desplaza mientras está abierta.</li>
        <li><strong>Áreas táctiles:</strong> opciones, grupos, etiquetas y paginación miden al menos 44 px; los botones de celular, 48 px.</li>
      </ul>

      <h2 id="codigo">Código</h2>
      <p>
        El HTML sale de <code>src/app/content/plantillas/catalogo.ts</code>, que compone las funciones de las páginas de componentes
        (<code>filterGroup</code>, <code>activeFilters</code>, <code>courseCard</code>, <code>emptyState</code>, <code>pagination</code>,
        <code>filterSheet</code>). La lógica de la vista previa está en <code>src/app/pages/plantillas/catalogo-vista.ts</code>; en la
        plataforma, el estado sale de la URL (ver el ejemplo en <a routerLink="/componentes/filtros">Filtros</a>).
      </p>
    </inap-doc-page>
  `,
})
export class CatalogoTemplatePage {
  protected readonly figmaUrl = `${FIGMA_URL}?node-id=518-16304`;
  protected readonly rows = ROWS;
}
