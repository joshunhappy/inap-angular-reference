import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from '../icon/icon';

/** Relación de contraste con indicador de si cumple el mínimo WCAG. */
@Component({
  selector: 'inap-contrast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { class: 'inline-flex items-center gap-1 whitespace-nowrap' },
  template: `
    @if (ratio() !== null) {
      @if (min() === null) {
        <span class="text-neutral-text">{{ ratio() }}:1 · decorativo</span>
      } @else {
        <inap-icon [name]="passes() ? 'circle-check' : 'circle-x'" [size]="16"
                   [class]="passes() ? 'text-success-text' : 'text-error-text'" />
        <span>{{ ratio() }}:1</span>
        <span class="sr-only">{{ passes() ? 'cumple' : 'no cumple' }} el mínimo de {{ min() }}:1</span>
      }
    } @else {
      <span class="text-neutral-text" aria-label="No aplica">—</span>
    }
  `,
})
export class Contrast {
  readonly ratio = input<number | null>(null);
  readonly min = input<number | null>(4.5);
  protected readonly passes = computed(() => (this.ratio() ?? 0) >= (this.min() ?? 0));
}
