import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPage } from '../../ui/doc-page/doc-page';

@Component({
  selector: 'inap-radios-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage],
  template: `
    <inap-doc-page section="fundamentos" slug="radios">
      <p>Tres tokens de daisyUI definen el redondeo. daisyUI los aplica solo a sus componentes.</p>
      <ul class="mb-8 grid list-none gap-4 ps-0 sm:grid-cols-3 lg:grid-cols-5">
        @for (r of radii; track r.cls) {
          <li class="flex flex-col items-center gap-3 rounded-box border border-base-300 p-5 text-center">
            <span class="size-20 border-2 border-primary-text bg-surface-subtle" [class]="r.cls" aria-hidden="true"></span>
            <code>{{ r.cls }}</code>
            <span class="text-sm text-neutral-text">{{ r.value }}</span>
          </li>
        }
      </ul>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead><tr><th scope="col">Token</th><th scope="col">Valor</th><th scope="col">Clase</th><th scope="col">Uso</th></tr></thead>
          <tbody>
            <tr><td><code>--radius-field</code></td><td>4 px</td><td><code>rounded-field</code></td><td>Botones, campos y checkbox</td></tr>
            <tr><td><code>--radius-box</code></td><td>12 px</td><td><code>rounded-box</code></td><td>Tarjetas, alertas, menús, hojas</td></tr>
            <tr><td><code>--radius-selector</code></td><td>16 px</td><td><code>rounded-selector</code></td><td>Toggle y badge</td></tr>
            <tr><td>—</td><td>8 / 16 px</td><td><code>rounded-lg</code>, <code>rounded-2xl</code></td><td>Imágenes y miniaturas, según el frame</td></tr>
            <tr><td>—</td><td>completo</td><td><code>rounded-full</code></td><td>Avatar, chips, indicadores, flechas del carrusel</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        El checkbox es cuadrado (<code>radius-field</code>) aunque daisyUI le da <code>radius-selector</code>: con 16 px
        se confunde con un radio. El ajuste está en <code>inap-components.css</code>.
      </p>
    </inap-doc-page>
  `,
})
export class RadiosPage {
  protected readonly radii = [
    { cls: 'rounded-field', value: '4 px' },
    { cls: 'rounded-lg', value: '8 px' },
    { cls: 'rounded-box', value: '12 px' },
    { cls: 'rounded-selector', value: '16 px' },
    { cls: 'rounded-full', value: 'completo' },
  ];
}
