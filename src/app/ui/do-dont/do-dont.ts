import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/** Par «Hacer» / «Evitar». El contenido visual va proyectado en slots [do] y [dont]. */
@Component({
  selector: 'inap-do-dont',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { class: 'grid gap-4 md:grid-cols-2' },
  template: `
    <figure class="flex flex-col overflow-hidden rounded-box border border-base-300">
      <div class="flex min-h-32 flex-wrap items-center justify-center gap-3 bg-surface-subtle p-6"><ng-content select="[do]" /></div>
      <figcaption class="flex gap-2 border-t-4 border-success-text p-4 text-sm">
        <inap-icon name="circle-check" [size]="20" class="text-success-text" />
        <span><strong class="font-semibold text-success-text">Hacer.</strong> {{ doText() }}</span>
      </figcaption>
    </figure>
    <figure class="flex flex-col overflow-hidden rounded-box border border-base-300">
      <div class="flex min-h-32 flex-wrap items-center justify-center gap-3 bg-surface-subtle p-6"><ng-content select="[dont]" /></div>
      <figcaption class="flex gap-2 border-t-4 border-error-text p-4 text-sm">
        <inap-icon name="circle-x" [size]="20" class="text-error-text" />
        <span><strong class="font-semibold text-error-text">Evitar.</strong> {{ dontText() }}</span>
      </figcaption>
    </figure>
  `,
})
export class DoDont {
  readonly doText = input.required<string>();
  readonly dontText = input.required<string>();
}
