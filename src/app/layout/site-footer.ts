import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FIGMA_URL, REPO_URL } from '../core/navigation';

@Component({
  selector: 'inap-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-base-300 bg-surface-muted">
      <div class="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-8 text-sm text-neutral-text sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>INAP · Instituto Nacional de Administración Pública, Guatemala</p>
        <p>Angular 22 · Tailwind CSS 4.1.4 · daisyUI 5.5.19 · Lucide 0.469.0</p>
        <ul class="flex gap-4">
          <li><a [href]="figmaUrl" target="_blank" rel="noopener" class="link">Figma<span class="sr-only"> (se abre en una pestaña nueva)</span></a></li>
          <li><a [href]="repoUrl" target="_blank" rel="noopener" class="link">Repositorio<span class="sr-only"> (se abre en una pestaña nueva)</span></a></li>
        </ul>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly figmaUrl = FIGMA_URL;
  protected readonly repoUrl = REPO_URL;
}
