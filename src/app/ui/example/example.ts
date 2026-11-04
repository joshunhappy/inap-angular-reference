import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InapTheme, ThemeService } from '../../core/theme.service';
import { CodeBlock } from '../code-block/code-block';

/**
 * Ejemplo vivo: la vista previa y el código salen del mismo texto HTML.
 * Cada ejemplo tiene su propio selector de tema (data-theme en el contenedor).
 */
@Component({
  selector: 'inap-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  host: { class: 'block' },
  template: `
    <figure class="flex flex-col">
      @if (title()) {
        <figcaption class="mb-3">
          <span class="font-semibold">{{ title() }}</span>
          @if (description()) {
            <span class="mt-1 block text-sm text-neutral-text">{{ description() }}</span>
          }
        </figcaption>
      }
      <div class="rounded-t-box border border-b-0 border-base-300">
        <div class="flex items-center justify-end gap-1 border-b border-base-300 px-3 py-1.5">
          <span class="me-auto text-xs font-semibold text-neutral-text">Vista previa</span>
          <div class="join" role="group" [attr.aria-label]="'Tema de la vista previa' + (title() ? ': ' + title() : '')">
            <button type="button" class="btn btn-xs join-item" [class.btn-primary]="theme() === 'inap'"
                    [class.btn-ghost]="theme() !== 'inap'" [attr.aria-pressed]="theme() === 'inap'" (click)="theme.set('inap')">Claro</button>
            <button type="button" class="btn btn-xs join-item" [class.btn-primary]="theme() === 'dark'"
                    [class.btn-ghost]="theme() !== 'dark'" [attr.aria-pressed]="theme() === 'dark'" (click)="theme.set('dark')">Oscuro</button>
          </div>
        </div>
        <div [attr.data-theme]="theme()" class="bg-base-100 text-base-content" [class]="previewClass()"
             [innerHTML]="safeHtml()"></div>
      </div>
      <inap-code-block [code]="html()" language="HTML" [flatTop]="true" />
    </figure>
  `,
})
export class Example {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly site = inject(ThemeService);

  readonly html = input.required<string>();
  readonly title = input<string>();
  readonly description = input<string>();
  /** Clases del contenedor de la vista previa (alineación, padding). */
  readonly previewClass = input('flex flex-wrap items-center gap-3 p-6');

  /** Empieza con el tema del sitio; cada ejemplo puede cambiarlo. */
  protected readonly theme = linkedSignal<InapTheme>(() => this.site.theme());

  // Contenido escrito en el código fuente del sitio, nunca del usuario.
  protected readonly safeHtml = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.html()));
}
