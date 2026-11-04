import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPage } from '../../ui/doc-page/doc-page';

@Component({
  selector: 'inap-sombras-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage],
  template: `
    <inap-doc-page section="fundamentos" slug="sombras">
      <p>
        Los estilos <code>Shadow/sm</code>, <code>Shadow/md</code> y <code>Shadow/lg</code> de Figma son las sombras
        de Tailwind con el mismo nombre. La sombra no separa: el borde o el cambio de superficie sí. Úsenla para lo
        que flota sobre la página. El frame de Figma indica cuál lleva cada componente.
      </p>
      <ul class="mb-8 grid list-none gap-6 ps-0 sm:grid-cols-3">
        @for (s of shadows; track s.cls) {
          <li class="flex flex-col gap-2">
            <span class="flex h-28 items-center justify-center rounded-box border border-base-300 bg-base-2" [class]="s.cls">
              <code>{{ s.cls }}</code>
            </span>
            <span class="text-sm text-neutral-text">{{ s.use }}</span>
          </li>
        }
      </ul>
    </inap-doc-page>
  `,
})
export class SombrasPage {
  protected readonly shadows = [
    { cls: 'shadow-sm', use: 'Elevación leve.' },
    { cls: 'shadow-md', use: 'Menús y paneles desplegables.' },
    { cls: 'shadow-lg', use: 'Diálogos y paneles grandes.' },
  ];
}
