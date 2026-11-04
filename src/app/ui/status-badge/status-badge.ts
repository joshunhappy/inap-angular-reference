import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Status } from '../../core/navigation';

const STATUS: Record<Status, { label: string; color: string }> = {
  decidido: { label: 'Decidido', color: 'badge-success' },
  propuesta: { label: 'Propuesta', color: 'badge-info' },
  pendiente: { label: 'Pendiente', color: 'badge-warning' },
};

/** Estado de una decisión de diseño: Decidido, Propuesta o Pendiente. */
@Component({
  selector: 'inap-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="'badge badge-soft ' + info().color"><span class="sr-only">Estado: </span>{{ info().label }}</span>`,
})
export class StatusBadge {
  readonly status = input.required<Status>();
  protected readonly info = computed(() => STATUS[this.status()]);
}
