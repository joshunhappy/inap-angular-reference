import { dedent } from '../../core/dedent';
import { ComponentDoc } from './types';

export const tabs: ComponentDoc = {
  intro: `<p>Dos usos distintos con el mismo aspecto (<code>tabs tabs-border</code>). <strong>Pestañas</strong>: cambian el panel visible sin salir de la página. <strong>Tabs del detalle de curso</strong>: enlaces de ancla a secciones que están todas visibles, con scroll spy; no son pestañas ARIA.</p>`,
  examples: [
    { title: 'Tabs como enlaces de ancla', description: 'Detalle de curso: todo el contenido está en la página.', previewClass: 'p-6', html: dedent(`
      <nav aria-label="Secciones del curso" class="tabs tabs-border">
        <a href="#informacion" class="tab tab-active text-primary-text" aria-current="location">Información</a>
        <a href="#programa" class="tab">Programa</a>
        <a href="#docente" class="tab">Docente</a>
        <a href="#preguntas" class="tab">Preguntas</a>
      </nav>
    `) },
    { title: 'Pestañas', description: 'Cambian el panel. Necesitan el patrón ARIA y flechas con JavaScript (ver Código).', previewClass: 'p-6', html: dedent(`
      <div role="tablist" aria-label="Mis cursos" class="tabs tabs-border">
        <button role="tab" class="tab tab-active text-primary-text" aria-selected="true" aria-controls="ej-panel-1" id="ej-tab-1">En curso</button>
        <button role="tab" class="tab" aria-selected="false" aria-controls="ej-panel-2" id="ej-tab-2" tabindex="-1">Finalizados</button>
      </div>
      <div role="tabpanel" id="ej-panel-1" aria-labelledby="ej-tab-1" class="pt-4">Dos cursos en curso.</div>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Etiquetas de una o dos palabras.</li>
      <li>La pestaña activa lleva <code>tab-active</code> y el texto en <code>primary-text</code>.</li>
      <li>Si el contenido de cada pestaña es corto, mejor mostrarlo todo. Las pestañas esconden información.</li>
      <li>En el detalle de curso, las tabs quedan fijas al desplazar (<code>sticky</code>) y marcan la sección visible.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Anclas:</strong> <code>&lt;nav aria-label&gt;</code> con enlaces. La sección visible lleva <code>aria-current="location"</code>.</li>
    <li><strong>Pestañas:</strong> <code>role="tablist"</code>, <code>tab</code> y <code>tabpanel</code>; <code>aria-selected</code>, <code>aria-controls</code> y <code>aria-labelledby</code>. Solo la pestaña activa está en el orden de tabulación; las flechas izquierda/derecha cambian de pestaña, Inicio y Fin van a la primera y la última.</li>
    <li><strong>Altura:</strong> 44 px de zona táctil en celular.</li>
  </ul>`,
  classes: [
    ['tabs', 'Contenedor.'],
    ['tabs-border', 'Estilo con línea inferior (el del diseño).'],
    ['tab', 'Cada pestaña o enlace.'],
    ['tab-active', 'Pestaña activa o sección visible.'],
  ],
  codeNotes: `<p>Las páginas de componentes de este sitio usan el patrón de pestañas ARIA completo; el código está en <code>src/app/ui/doc-tabs/doc-tabs.ts</code> del repositorio. El scroll spy del detalle de curso está en <a href="/patrones/anclas">Anclas y scroll spy</a>.</p>`,
};
