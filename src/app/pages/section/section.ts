import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findSection } from '../../core/navigation';
import { PageHeader } from '../../ui/page-header/page-header';
import { StatusBadge } from '../../ui/status-badge/status-badge';

/** Portada de una sección: lista de sus páginas. */
@Component({
  selector: 'inap-section-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeader, StatusBadge],
  template: `
    @if (data(); as s) {
      <inap-page-header [title]="s.title" [description]="s.description" [crumbs]="[{ label: 'Inicio', link: '/' }]" />
      @for (g of s.groups; track $index) {
        <section class="mb-12" [attr.aria-label]="g.label ?? s.title">
          @if (g.label) {
            <h2 class="mb-4 text-xl font-bold">{{ g.label }}</h2>
          }
          <ul class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            @for (p of g.pages; track p.slug) {
              <li class="relative flex flex-col gap-2 rounded-box border border-base-300 bg-base-2 p-5 transition-colors hover:border-base-border">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="font-semibold">
                    <a [routerLink]="'/' + s.slug + '/' + p.slug" class="after:absolute after:inset-0 after:rounded-box">{{ p.title }}</a>
                  </h3>
                  <inap-status-badge [status]="p.status" />
                </div>
                <p class="text-sm text-neutral-text">{{ p.description }}</p>
              </li>
            }
          </ul>
        </section>
      }
    }
  `,
})
export class SectionPage {
  /** Desde la ruta (withComponentInputBinding). */
  readonly section = input.required<string>();
  protected readonly data = computed(() => findSection(this.section()));
}
