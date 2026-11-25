import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ESTADOS } from '../../content/plantillas/detalle-de-curso';
import { FIGMA_URL } from '../../core/navigation';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Icon } from '../../ui/icon/icon';
import { TemplatePreview } from '../../ui/template-preview/template-preview';

interface Row { section: string; mobile: string; desktop: string; components: [string, string][] }

const ROWS: Row[] = [
  { section: 'Barra de navegación', mobile: 'Logo, buscar, menú y «Regístrate».', desktop: 'Barra superior y barra principal; desde 1280 px.', components: [['Barra de navegación', 'barra-de-navegacion']] },
  { section: 'Barra de administración', mobile: 'Solo con permisos; acciones en un menú.', desktop: 'Solo con permisos; acciones en fila.', components: [['Barra de administración', 'barra-de-administracion']] },
  { section: 'Breadcrumb', mobile: 'Enlace «‹ Finanzas públicas y calidad del gasto» al área del curso.', desktop: 'Inicio › Catálogo › área del curso.', components: [['Breadcrumb', 'breadcrumb']] },
  { section: 'Encabezado del curso', mobile: 'Imagen con degradado de arriba hacia abajo; texto abajo; 400 px de alto.', desktop: 'Imagen con degradado de izquierda a derecha; texto a la izquierda hasta 560 px; 380 px de alto.', components: [['Etiquetas y estados', 'etiquetas-y-estados']] },
  { section: 'Tarjeta de inscripción', mobile: 'Debajo del encabezado; la barra inferior repite la acción cuando la tarjeta queda arriba.', desktop: 'Columna derecha de 384 px, fija al desplazar.', components: [['Tarjeta de inscripción', 'tarjeta-de-inscripcion'], ['Ediciones', 'ediciones']] },
  { section: 'Tabs de sección', mobile: 'Se desplazan en horizontal; fijas arriba al desplazar.', desktop: 'Fijas arriba al desplazar; marcan la sección visible.', components: [['Tabs', 'tabs']] },
  { section: 'Información', mobile: '«Lo que aprenderás» en una columna.', desktop: '«Lo que aprenderás» en dos columnas.', components: [['Datos del curso', 'datos-del-curso']] },
  { section: 'Programa', mobile: 'Módulos que se abren; el primero abierto.', desktop: 'Igual.', components: [['Datos del curso', 'datos-del-curso']] },
  { section: 'Docente', mobile: 'Foto arriba del texto.', desktop: 'Foto a la izquierda.', components: [['Docente', 'docente']] },
  { section: 'Preguntas y contacto', mobile: 'Teléfono y correo uno debajo del otro.', desktop: 'Teléfono y correo en una fila.', components: [['Acordeón', 'acordeon'], ['Datos del curso', 'datos-del-curso']] },
  { section: 'Cursos relacionados', mobile: 'Tarjetas de 282 px que se desplazan en horizontal.', desktop: 'Tres columnas.', components: [['Encabezado de sección', 'encabezado-de-seccion'], ['Tarjeta de curso', 'tarjeta-de-curso']] },
  { section: 'Pie de página', mobile: 'Columnas en 2 × 2; espacio abajo para la barra de inscripción.', desktop: 'Logo y contacto a la izquierda, tres columnas de enlaces.', components: [['Pie de página', 'pie-de-pagina']] },
];

/** Plantilla del Detalle de curso: la página completa en un iframe, en cualquiera de sus estados. */
@Component({
  selector: 'inap-detalle-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, Icon, RouterLink, TemplatePreview],
  template: `
    <inap-doc-page section="plantillas" slug="detalle-de-curso" [figma]="figmaUrl">
      <p>
        Detalle de un curso armado con los componentes del sitio, en celular y en escritorio, en los nueve estados de la
        tarjeta de inscripción y en la vista de administración. Las capturas de Figma están en
        <a routerLink="/pantallas/detalle-de-curso">Pantallas › Detalle de curso</a>.
      </p>
      <dl class="mb-8 grid max-w-prose grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt class="font-semibold">Plataforma</dt>
        <dd class="text-neutral-text">Angular</dd>
        <dt class="font-semibold">Dirección</dt>
        <dd>Por definir con el equipo de desarrollo.</dd>
      </dl>

      <div role="note" class="alert alert-info mb-8 max-w-prose items-start alert-soft">
        <inap-icon name="info" class="mt-0.5" />
        <p class="m-0">
          El curso, el docente, los temas de los módulos 2 a 5 y las preguntas son de ejemplo. El programa por módulos es
          contenido provisional hasta confirmar que existe como datos en la plataforma.
        </p>
      </div>

      <h2 id="vista">Vista previa</h2>
      <p>
        Elijan el estado en la barra de la vista previa. Funcionan las tabs (marcan la sección visible al desplazar), los
        módulos del programa y las preguntas. En celular, la barra de inscripción aparece abajo cuando la tarjeta queda
        arriba de la pantalla. Los demás enlaces y botones no hacen nada.
      </p>

      <inap-template-preview path="detalle-de-curso" label="Plantilla del Detalle de curso" [variants]="estados" />

      <h2 id="secciones">Secciones</h2>
      <p>De arriba hacia abajo. Celular: menos de 1024 px, donde la tarjeta pasa de la columna derecha a debajo del encabezado.</p>
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
                    <span class="text-neutral-text">Propia del detalle</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <h2 id="comportamiento">Comportamiento</h2>
      <ul>
        <li><strong>Estados:</strong> la tarjeta y la barra cambian según la edición (Próximamente, Abierta, Último día, Cerrada, Cupo lleno, En curso) y el usuario (Inscrito, Saldo pendiente, Aprobado). Con Cerrada, Cupo lleno y En curso se agrega el aviso de otra edición, si existe. Ver la tabla en <a routerLink="/componentes/tarjeta-de-inscripcion">Tarjeta de inscripción</a>.</li>
        <li><strong>Tabs:</strong> son enlaces de ancla, no pestañas: todo el contenido está en la página. Quedan fijas arriba al desplazar y marcan la sección que cruza la franja de abajo de las tabs. Ver <a routerLink="/patrones/anclas">Anclas y scroll spy</a>.</li>
        <li><strong>Tarjeta en escritorio:</strong> fija en la columna derecha (<code>sticky top-6</code>) mientras se lee el contenido.</li>
        <li><strong>Barra en celular:</strong> fija abajo; aparece solo cuando la tarjeta ya pasó hacia arriba. El pie deja 96 px libres para que la barra no tape el final. Ver <a routerLink="/patrones/visibilidad-al-desplazar">Mostrar u ocultar al desplazar</a>.</li>
        <li><strong>Imagen del curso:</strong> es el fondo del encabezado, decorativa (<code>alt=""</code>), con <code>object-fit: cover</code>, degradado navy y ondas de marca al 10 %.</li>
        <li><strong>Vista de administración:</strong> la barra navy va entre la navegación y el breadcrumb, solo para usuarios con permisos.</li>
      </ul>

      <h2 id="accesibilidad">Accesibilidad</h2>
      <ul>
        <li><strong>Encabezados:</strong> H1 es el nombre del curso. «¿En qué consiste?», «Programa», «Docente», «Preguntas frecuentes» y las demás secciones son H2; módulos y docente, H3.</li>
        <li><strong>Tabs:</strong> <code>&lt;nav aria-label="Secciones del curso"&gt;</code>; la sección visible lleva <code>aria-current="location"</code>. Al elegir una, el foco pasa a la sección (<code>tabindex="-1"</code>) y <code>scroll-margin-top</code> deja espacio para las tabs fijas.</li>
        <li><strong>Texto sobre la imagen:</strong> blanco sobre el degradado navy de 65 % o más (4.5:1 como mínimo). Las etiquetas tienen fondo propio.</li>
        <li><strong>Tarjeta:</strong> <code>&lt;section aria-label="Inscripción"&gt;</code>; los datos son una <code>&lt;dl&gt;</code>.</li>
        <li><strong>Módulos:</strong> <code>&lt;h3&gt;&lt;button aria-expanded aria-controls&gt;</code>; preguntas con <code>&lt;details&gt;</code>.</li>
        <li><strong>Barra en celular:</strong> no recibe el foco al aparecer; repite una acción que ya está en la tarjeta.</li>
        <li><strong>Áreas táctiles:</strong> tabs, enlace al área, módulos y preguntas miden al menos 44 px.</li>
      </ul>

      <h2 id="codigo">Código</h2>
      <p>
        El HTML sale de <code>src/app/content/plantillas/detalle-de-curso.ts</code>, que compone las funciones de las páginas de
        componentes (<code>enrollmentCard</code>, <code>enrollmentBar</code>, <code>moduleRow</code>, <code>factRow</code>,
        <code>editionAlert</code>, <code>adminBarDesktop</code>, <code>courseCard</code>). El scroll spy y la barra están en
        <code>src/app/pages/plantillas/detalle-vista.ts</code>, con <code>IntersectionObserver</code>.
      </p>
    </inap-doc-page>
  `,
})
export class DetalleTemplatePage {
  protected readonly figmaUrl = `${FIGMA_URL}?node-id=289-7477`;
  protected readonly rows = ROWS;
  protected readonly estados = ESTADOS;
}
