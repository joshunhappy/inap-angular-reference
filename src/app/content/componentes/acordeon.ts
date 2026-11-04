import { dedent } from '../../core/dedent';
import { ComponentDoc } from './types';

export const acordeon: ComponentDoc = {
  intro: `<p>Contenido que se expande al pulsar el título. Se usa para preguntas frecuentes (FAQ Item). Se construye con <code>&lt;details&gt;</code> y <code>&lt;summary&gt;</code>: funciona con teclado sin JavaScript.</p>`,
  examples: [
    { title: 'Preguntas frecuentes', previewClass: 'flex flex-col gap-2 p-6', html: dedent(`
      <details class="collapse collapse-arrow rounded-box border border-base-300 bg-base-2" name="ej-faq" open>
        <summary class="collapse-title font-semibold">¿El curso tiene costo?</summary>
        <div class="collapse-content text-neutral-text">
          <p>Los cursos con opción a certificación son gratuitos para servidores públicos.</p>
        </div>
      </details>
      <details class="collapse collapse-arrow rounded-box border border-base-300 bg-base-2" name="ej-faq">
        <summary class="collapse-title font-semibold">¿Cuándo recibo mi diploma?</summary>
        <div class="collapse-content text-neutral-text">
          <p>Al aprobar el curso, el diploma se descarga desde tu perfil.</p>
        </div>
      </details>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Para contenido secundario que no todos necesitan. Lo importante del curso no va dentro de un acordeón: en el detalle de curso, todo el contenido queda visible.</li>
      <li>Títulos en forma de pregunta o de tema, en <code>font-semibold</code>.</li>
      <li>Con el atributo <code>name</code> compartido, abrir uno cierra los demás.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><code>&lt;summary&gt;</code> es un botón nativo: Enter y Espacio lo abren, y el lector de pantalla anuncia si está expandido.</li>
    <li>No poner encabezados ni enlaces dentro de <code>&lt;summary&gt;</code>.</li>
    <li>El ícono de flecha lo dibuja daisyUI con CSS (<code>collapse-arrow</code>).</li>
  </ul>`,
  classes: [
    ['collapse', 'Base.'],
    ['collapse-arrow, collapse-plus', 'Indicador de abrir y cerrar.'],
    ['collapse-title, collapse-content', 'Título y contenido.'],
  ],
};
