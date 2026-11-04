import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  contentChildren,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/** Contenido de una pestaña: <ng-template inapTab="Uso">…</ng-template> */
@Directive({ selector: 'ng-template[inapTab]' })
export class DocTab {
  readonly label = input.required<string>({ alias: 'inapTab' });
  readonly template = inject(TemplateRef);
}

let nextId = 0;

/** Pestañas ARIA (tablist) con flechas, Inicio y Fin. Para Ejemplos / Uso / Accesibilidad / Código. */
@Component({
  selector: 'inap-doc-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { class: 'block' },
  template: `
    <div role="tablist" [attr.aria-label]="label()" class="tabs tabs-border mb-8 border-b border-base-300" (keydown)="onKeydown($event)">
      @for (t of tabs(); track t.label(); let i = $index) {
        <button #tab type="button" role="tab" class="tab h-11 font-semibold"
                [class.tab-active]="i === active()" [class.text-primary-text]="i === active()"
                [id]="id + '-tab-' + i" [attr.aria-controls]="id + '-panel-' + i"
                [attr.aria-selected]="i === active()" [attr.tabindex]="i === active() ? 0 : -1"
                (click)="active.set(i)">{{ t.label() }}</button>
      }
    </div>
    @for (t of tabs(); track t.label(); let i = $index) {
      <div role="tabpanel" [id]="id + '-panel-' + i" [attr.aria-labelledby]="id + '-tab-' + i"
           [hidden]="i !== active()" tabindex="0" class="outline-none">
        <ng-container [ngTemplateOutlet]="t.template" />
      </div>
    }
  `,
})
export class DocTabs {
  readonly label = input('Secciones de la página');
  protected readonly tabs = contentChildren(DocTab);
  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('tab');
  protected readonly active = signal(0);
  protected readonly id = `doc-tabs-${nextId++}`;

  protected onKeydown(e: KeyboardEvent): void {
    const count = this.tabs().length;
    const keys: Record<string, number> = {
      ArrowRight: (this.active() + 1) % count,
      ArrowLeft: (this.active() - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    this.active.set(keys[e.key]);
    this.buttons()[keys[e.key]]?.nativeElement.focus();
  }
}
