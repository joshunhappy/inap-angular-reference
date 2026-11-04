import { dedent } from '../../core/dedent';
import { ComponentDoc } from './types';

export const seleccion: ComponentDoc = {
  intro: `<p>Casilla (<code>checkbox</code>) para opciones independientes, radio para elegir una sola opción de un grupo e interruptor (<code>toggle</code>) para activar algo que surte efecto de inmediato. En Figma: Color (Base + 8) × State.</p>`,
  examples: [
    { title: 'Casillas', previewClass: 'p-6', html: dedent(`
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Modalidad</legend>
        <label class="label gap-2 text-base-content"><input type="checkbox" class="checkbox checkbox-primary" checked /> Virtual</label>
        <label class="label gap-2 text-base-content"><input type="checkbox" class="checkbox checkbox-primary" /> Presencial</label>
        <label class="label gap-2 text-base-content"><input type="checkbox" class="checkbox checkbox-primary" disabled /> Semipresencial</label>
      </fieldset>
    `) },
    { title: 'Radio', previewClass: 'p-6', html: dedent(`
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Tipo de formación</legend>
        <label class="label gap-2 text-base-content"><input type="radio" name="ej-tipo" class="radio radio-primary" checked /> Curso</label>
        <label class="label gap-2 text-base-content"><input type="radio" name="ej-tipo" class="radio radio-primary" /> Diplomado</label>
        <label class="label gap-2 text-base-content"><input type="radio" name="ej-tipo" class="radio radio-primary" /> Posgrado</label>
      </fieldset>
    `) },
    { title: 'Interruptor', previewClass: 'p-6', html: dedent(`
      <label class="label gap-3 text-base-content">
        <input type="checkbox" role="switch" class="toggle toggle-primary" checked />
        Recibir avisos de nuevos cursos
      </label>
    `) },
    { title: 'Colores', previewClass: 'flex flex-wrap items-center gap-4 p-6', html: ['primary', 'secondary', 'accent', 'success', 'warning', 'error'].map((c) =>
      `<input type="checkbox" class="checkbox checkbox-${c}" checked aria-label="${c}" />\n<input type="radio" class="radio radio-${c}" checked aria-label="${c}" />\n<input type="checkbox" class="toggle toggle-${c}" checked aria-label="${c}" />`).join('\n') },
  ],
  usage: {
    html: `<ul>
      <li>Casilla: opciones que se pueden marcar juntas (filtros del catálogo). Radio: una sola opción. Interruptor: un ajuste que se aplica al momento, sin botón «Guardar».</li>
      <li>La etiqueta va a la derecha del control y es parte de la zona de clic.</li>
      <li>Un grupo siempre tiene título (<code>&lt;legend&gt;</code>).</li>
      <li>En la mayoría de los casos, <code>-primary</code>. Los colores de estado solo cuando el control representa ese estado.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Controles nativos:</strong> <code>&lt;input type="checkbox"&gt;</code> y <code>type="radio"</code>. Teclado y lector de pantalla funcionan sin JavaScript.</li>
    <li><strong>Grupos:</strong> <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>; los radios de un grupo comparten <code>name</code> (las flechas cambian la opción).</li>
    <li><strong>Interruptor:</strong> checkbox con <code>role="switch"</code>.</li>
    <li><strong>Contraste:</strong> sin marcar, borde <code>base-border</code> (3:1 o más). Radio e interruptor marcados usan el token <code>-text</code>. El checkbox es cuadrado para no confundirse con el radio.</li>
  </ul>`,
  classes: [
    ['checkbox, radio, toggle', 'Control base. Borde sin marcar en <code>base-border</code>.'],
    ['checkbox-{color}, radio-{color}, toggle-{color}', 'Color marcado. Radio y toggle usan el token <code>-text</code>.'],
    ['checkbox-sm … checkbox-xl', 'Tamaño (igual para radio y toggle).'],
  ],
};
