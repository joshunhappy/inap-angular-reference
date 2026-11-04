import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Icon } from '../icon/icon';

/** Bloque de código con botón «Copiar». El fondo navy es fijo en los dos temas. */
@Component({
  selector: 'inap-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { class: 'block' },
  template: `
    <div class="relative overflow-hidden rounded-box bg-inap-brand-navy text-white" [class.rounded-t-none]="flatTop()">
      <div class="flex items-center justify-between border-b border-white/15 px-4 py-1.5">
        <span class="text-xs font-semibold text-white/80">{{ language() }}</span>
        <button type="button" class="btn btn-ghost btn-xs text-white hover:bg-white/10 focus-visible:outline-white"
                (click)="copy()" [attr.aria-label]="'Copiar código ' + language()">
          <inap-icon [name]="copied() ? 'check' : 'copy'" [size]="16" />
          <span aria-hidden="true">{{ copied() ? 'Copiado' : 'Copiar' }}</span>
        </button>
      </div>
      <pre class="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6" tabindex="0"
           [attr.aria-label]="'Código ' + language()"><code>{{ code() }}</code></pre>
      <span class="sr-only" aria-live="polite">{{ copied() ? 'Código copiado' : '' }}</span>
    </div>
  `,
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly language = input('HTML');
  /** Sin redondeo arriba, cuando va pegado a una vista previa. */
  readonly flatTop = input(false);
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      /* sin permiso de portapapeles */
    }
  }
}
