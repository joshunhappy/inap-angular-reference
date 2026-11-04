import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { findPage, REPO_URL } from '../../core/navigation';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';

/** Página aún sin contenido. */
@Component({
  selector: 'inap-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PageHeader],
  template: `
    @if (data(); as p) {
      <inap-page-header [title]="p.title" [description]="p.description" [status]="p.status"
        [crumbs]="[{ label: 'Inicio', link: '/' }, { label: p.section.title, link: '/' + p.section.slug }]" />
      <div role="status" class="alert alert-soft alert-info max-w-prose">
        <inap-icon name="info" />
        <span>
          Esta página está en preparación. Mientras tanto, la
          <a [href]="guideUrl" target="_blank" rel="noopener" class="link font-semibold">guía de implementación<span class="sr-only"> (abre en otra pestaña)</span></a>
          tiene las reglas de este tema.
        </span>
      </div>
    }
  `,
})
export class Placeholder {
  readonly section = input.required<string>();
  readonly page = input.required<string>();
  protected readonly data = computed(() => findPage(this.section(), this.page()));
  protected readonly guideUrl = `${REPO_URL}/blob/main/docs/guia-implementacion-angular.md`;
}
