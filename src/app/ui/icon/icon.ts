import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Ícono de Lucide (lucide-static 0.469.0) desde el sprite. Decorativo: toma el color del texto. */
@Component({
  selector: 'inap-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true" focusable="false"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <use [attr.href]="'assets/lucide/sprite.svg#' + name()" />
    </svg>`,
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input(20);
}
