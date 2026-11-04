import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPage } from '../../ui/doc-page/doc-page';

@Component({
  selector: 'inap-espaciado-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage],
  template: `
    <inap-doc-page section="fundamentos" slug="espaciado">
      <p>
        Figma usa la escala de Tailwind: <code>--spacing</code> = 4 px. En Dev Mode,
        <code>calc(var(--spacing) * N)</code> equivale a <code>p-N</code>, <code>gap-N</code> o <code>m-N</code>.
      </p>

      <h2 id="escala">Escala</h2>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead><tr><th scope="col">Paso</th><th scope="col">Píxeles</th><th scope="col">Ejemplos</th><th scope="col" class="w-1/2">Tamaño</th></tr></thead>
          <tbody>
            @for (s of steps; track s) {
              <tr>
                <td><code>{{ s }}</code></td>
                <td>{{ s * 4 }} px</td>
                <td><code>p-{{ s }}</code> <code>gap-{{ s }}</code></td>
                <td><span class="block h-4 rounded-sm bg-primary" [style.width.px]="s * 4" aria-hidden="true"></span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <h2 id="reglas">Reglas</h2>
      <ul>
        <li>Sin valores arbitrarios (<code>p-[13px]</code>). Si un valor no cae en la escala, pregúntenme: puede ser un error del diseño.</li>
        <li>El contenedor de página (ancho máximo y márgenes laterales) es el mismo en la barra de navegación, el breadcrumb y el contenido, para que todo quede alineado.</li>
        <li>Para separar elementos hermanos, <code>gap-*</code> en el contenedor flex o grid, en vez de márgenes en cada hijo.</li>
      </ul>
    </inap-doc-page>
  `,
})
export class EspaciadoPage {
  protected readonly steps = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
}
