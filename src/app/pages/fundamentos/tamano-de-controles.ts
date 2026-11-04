import { ChangeDetectionStrategy, Component } from '@angular/core';
import { dedent } from '../../core/dedent';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Example } from '../../ui/example/example';

@Component({
  selector: 'inap-tamano-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, Example],
  template: `
    <inap-doc-page section="fundamentos" slug="tamano-de-controles">
      <p>
        En Figma, el tamaño de botones, campos y controles no es una variante: es el modo de la colección
        <strong>Control size</strong> aplicado a la instancia. Corresponde 1:1 con las clases de tamaño de daisyUI.
      </p>

      <h2 id="tamanos">Tamaños</h2>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead><tr><th scope="col">Modo en Figma</th><th scope="col">Altura</th><th scope="col">Botón</th><th scope="col">Campo</th><th scope="col">Uso</th></tr></thead>
          <tbody>
            <tr><td>xs</td><td>24 px</td><td><code>btn-xs</code></td><td><code>input-xs</code></td><td>—</td></tr>
            <tr><td>sm</td><td>32 px</td><td><code>btn-sm</code></td><td><code>input-sm</code></td><td>Acciones secundarias en tablas</td></tr>
            <tr><td><strong>md</strong> (por defecto)</td><td>40 px</td><td><code>btn</code></td><td><code>input</code></td><td>Escritorio</td></tr>
            <tr><td>lg</td><td>48 px</td><td><code>btn-lg</code></td><td><code>input-lg</code></td><td><strong>Todos los botones en celular</strong>, hero</td></tr>
            <tr><td>xl</td><td>56 px</td><td><code>btn-xl</code></td><td><code>input-xl</code></td><td>—</td></tr>
          </tbody>
        </table>
      </div>
      <p>Igual para <code>select-*</code>, <code>checkbox-*</code>, <code>radio-*</code>, <code>toggle-*</code> y <code>badge-*</code>.</p>

      <inap-example title="Botones y campos en cada tamaño" [html]="sizes" previewClass="flex flex-col gap-4 p-6" />

      <h2 id="areas-tactiles">Áreas táctiles</h2>
      <p>
        En celular, todo lo interactivo tiene un área táctil mínima de 44 × 44 px. Si el elemento es más pequeño
        (indicadores del carrusel, enlaces de texto), la zona de clic se amplía con padding, no con el tamaño visual.
      </p>
      <inap-example title="Enlace de texto con área de 44 px" [html]="touch" />
    </inap-doc-page>
  `,
})
export class TamanoPage {
  protected readonly sizes = dedent(`
    <div class="flex flex-wrap items-center gap-3">
      <button class="btn btn-primary btn-xs">Extra pequeño</button>
      <button class="btn btn-primary btn-sm">Pequeño</button>
      <button class="btn btn-primary">Mediano</button>
      <button class="btn btn-primary btn-lg">Grande</button>
      <button class="btn btn-primary btn-xl">Extra grande</button>
    </div>
    <div class="grid gap-3 sm:grid-cols-3">
      <input class="input input-sm" placeholder="input-sm" aria-label="Campo pequeño" />
      <input class="input" placeholder="input" aria-label="Campo mediano" />
      <input class="input input-lg" placeholder="input-lg" aria-label="Campo grande" />
    </div>
  `);

  protected readonly touch = dedent(`
    <a href="#" class="inline-flex min-h-11 items-center px-2 underline">Ver todos los cursos</a>
  `);
}
