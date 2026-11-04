import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

export const campos: ComponentDoc = {
  intro: `<p>Campos para escribir o elegir un valor: <code>input</code>, <code>select</code> y <code>textarea</code>. En Figma, los ejes son Style (Default, Ghost) × State (Default, Filled, Focus, Error, Disabled). Los ajustes de borde, placeholder, foco y error ya están en <code>inap-components.css</code>.</p>`,
  examples: [
    { title: 'Campo con etiqueta y ayuda', previewClass: 'p-6', html: dedent(`
      <fieldset class="fieldset max-w-sm">
        <label class="fieldset-legend" for="ej-correo">Correo electrónico</label>
        <input id="ej-correo" type="email" class="input" placeholder="nombre@institucion.gob.gt" aria-describedby="ej-correo-ayuda" />
        <p id="ej-correo-ayuda" class="label text-base-content/60">Usa tu correo institucional.</p>
      </fieldset>
    `) },
    { title: 'Error', description: 'Borde y mensaje en error-text. El mensaje dice cómo corregirlo.', previewClass: 'p-6', html: dedent(`
      <fieldset class="fieldset max-w-sm">
        <label class="fieldset-legend" for="ej-dpi">DPI</label>
        <input id="ej-dpi" class="input input-error" value="1234" aria-invalid="true" aria-describedby="ej-dpi-error" />
        <p id="ej-dpi-error" class="label text-error-text">El DPI tiene 13 dígitos. Revisa el número.</p>
      </fieldset>
    `) },
    { title: 'Select y textarea', previewClass: 'grid gap-4 p-6 sm:grid-cols-2', html: dedent(`
      <fieldset class="fieldset">
        <label class="fieldset-legend" for="ej-modalidad">Modalidad</label>
        <select id="ej-modalidad" class="select">
          <option>Virtual</option>
          <option>Presencial</option>
          <option>Semipresencial</option>
        </select>
      </fieldset>
      <fieldset class="fieldset">
        <label class="fieldset-legend" for="ej-motivo">Motivo de la solicitud</label>
        <textarea id="ej-motivo" class="textarea" rows="3" placeholder="Describe lo que necesita tu equipo"></textarea>
      </fieldset>
    `) },
    { title: 'Con ícono (Ghost)', description: 'Solo donde el campo ya se identifica, como un buscador.', previewClass: 'p-6', html: dedent(`
      <form role="search" class="max-w-md">
        <label class="input w-full">
          ${icon('search', 20, 'text-base-content/60')}
          <input type="search" class="grow" placeholder="Busca cursos o temas" aria-label="Buscar cursos" />
        </label>
      </form>
    `) },
    { title: 'Deshabilitado', previewClass: 'p-6', html: dedent(`
      <fieldset class="fieldset max-w-sm">
        <label class="fieldset-legend" for="ej-codigo">Código institucional</label>
        <input id="ej-codigo" class="input" value="INAP-2026" disabled />
      </fieldset>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Toda etiqueta es visible y va arriba del campo. El placeholder es un ejemplo, no la etiqueta.</li>
      <li>La ayuda va debajo, en <code>text-base-content/60</code>. El error reemplaza a la ayuda.</li>
      <li>Los campos ocupan el ancho de su columna (<code>w-full</code>, ya en <code>inap-components.css</code>); el ancho de la columna se ajusta al dato esperado.</li>
      <li><code>input-ghost</code> solo en buscadores con ícono. En formularios, la variante normal.</li>
    </ul>`,
    doDont: [
      {
        doText: 'Etiqueta visible arriba; el placeholder solo da un ejemplo.',
        dontText: 'El placeholder como única etiqueta: desaparece al escribir.',
        doHtml: `<fieldset class="fieldset w-64"><span class="fieldset-legend">Nombre completo</span><input class="input" placeholder="Ana López" aria-label="Nombre completo" /></fieldset>`,
        dontHtml: `<input class="input w-64" placeholder="Nombre completo" aria-label="Nombre completo" />`,
      },
    ],
  },
  a11y: `<ul>
    <li><strong>Etiqueta:</strong> cada campo tiene <code>&lt;label for&gt;</code> o está dentro de un <code>&lt;label&gt;</code>. <code>aria-label</code> solo cuando no hay etiqueta visible (buscador).</li>
    <li><strong>Ayuda y error:</strong> enlazados con <code>aria-describedby</code>. En error, <code>aria-invalid="true"</code>.</li>
    <li><strong>Contraste:</strong> borde <code>base-border</code> (4.81:1), placeholder <code>/60</code> (4.73:1), foco <code>primary-text</code> + halo (6.79:1), error <code>error-text</code> (5.53:1).</li>
    <li><strong>Tipo correcto:</strong> <code>type="email"</code>, <code>tel</code>, <code>number</code> e <code>inputmode</code> muestran el teclado adecuado en celular. <code>autocomplete</code> en datos personales.</li>
  </ul>`,
  classes: [
    ['input, select, textarea', 'Campo base. Borde, foco y error ajustados en <code>inap-components.css</code>.'],
    ['input-error, select-error, textarea-error', 'Borde de error.'],
    ['input-ghost', 'Sin borde; solo en buscadores con ícono.'],
    ['input-sm … input-xl', 'Tamaño (igual para select y textarea).'],
    ['fieldset, fieldset-legend, label', 'Agrupación, etiqueta y texto de ayuda de daisyUI.'],
    ['floating-label-*', 'Etiquetas flotantes del equipo de desarrollo; el texto usa <code>base-content/60</code>.'],
    ['ng-select.custom', 'Mismo borde y foco que los campos.'],
  ],
  snippets: [
    { title: 'Con Reactive Forms', language: 'HTML · Angular', code: dedent(`
      <fieldset class="fieldset">
        <label class="fieldset-legend" for="dpi">DPI</label>
        <input id="dpi" class="input" formControlName="dpi" inputmode="numeric"
               [class.input-error]="dpiInvalido()" [attr.aria-invalid]="dpiInvalido()"
               [attr.aria-describedby]="dpiInvalido() ? 'dpi-error' : null" />
        @if (dpiInvalido()) {
          <p id="dpi-error" class="label text-error-text">El DPI tiene 13 dígitos. Revisa el número.</p>
        }
      </fieldset>
    `) },
  ],
};
