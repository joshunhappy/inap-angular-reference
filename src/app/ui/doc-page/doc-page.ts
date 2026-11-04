import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { findPage } from '../../core/navigation';
import { PageHeader } from '../page-header/page-header';

/** Página de documentación: encabezado desde navigation.ts + contenido proyectado. */
@Component({
  selector: 'inap-doc-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader],
  host: { class: 'block' },
  template: `
    @if (page(); as p) {
      <inap-page-header [title]="p.title" [description]="p.description" [status]="p.status" [figma]="figma()"
        [crumbs]="[{ label: 'Inicio', link: '/' }, { label: p.section.title, link: '/' + p.section.slug }]" />
    }
    <div class="doc-prose"><ng-content /></div>
  `,
})
export class DocPage {
  readonly section = input.required<string>();
  readonly slug = input.required<string>();
  /** Enlace directo al nodo de Figma, si existe. */
  readonly figma = input<string>();
  protected readonly page = computed(() => findPage(this.section(), this.slug()));
}
