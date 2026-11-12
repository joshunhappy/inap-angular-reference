import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { dedent } from '../../core/dedent';
import { CodeBlock } from '../../ui/code-block/code-block';
import { DocPage } from '../../ui/doc-page/doc-page';

@Component({
  selector: 'inap-tema-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock, DocPage, RouterLink],
  template: `
    <inap-doc-page section="primeros-pasos" slug="tema-claro-oscuro">
      <p>
        Las dos plataformas tienen tema claro (<code>inap</code>) y oscuro (<code>dark</code>). El oscuro no se
        diseña aparte: es el mismo HTML con otro valor de <code>data-theme</code>, y los tokens cambian solos.
      </p>

      <h2 id="reglas">Reglas</h2>
      <ul>
        <li>Se sigue la preferencia del dispositivo (<code>prefers-color-scheme</code>), también si cambia con la página abierta.</li>
        <li>El botón «Modo oscuro» guarda la elección en <code>localStorage</code> solo si es distinta de la del dispositivo. Cada plataforma guarda la suya.</li>
        <li>Si la persona cambia el modo del dispositivo, se borra la elección guardada y la página lo sigue.</li>
        <li>La variante <code>dark:</code> de Tailwind ya está ligada a <code>[data-theme=dark]</code>. No usar la clase <code>.dark</code>.</li>
        <li>Si algo se ve distinto en oscuro, es un token, no una regla CSS nueva. Ver <a routerLink="/fundamentos/color">Color</a>.</li>
      </ul>

      <h2 id="sin-parpadeo">1. Tema antes de que arranque Angular</h2>
      <p>En <code>index.html</code>, dentro de <code>&lt;head&gt;</code>, para evitar un destello blanco al cargar:</p>
      <inap-code-block language="HTML" [code]="script" />

      <h2 id="servicio">2. Servicio</h2>
      <p>Angular 17 o posterior; adaptar si usan una versión anterior.</p>
      <inap-code-block language="TypeScript" [code]="service" />

      <h2 id="boton">3. Botón «Modo oscuro»</h2>
      <p>
        Con <code>aria-pressed</code>, para que el lector de pantalla anuncie si el modo oscuro está activo. El
        botón del encabezado de este sitio funciona así.
      </p>
      <inap-code-block language="HTML" [code]="button" />
    </inap-doc-page>
  `,
})
export class TemaPage {
  protected readonly script = dedent(`
    <script>
      try {
        var t = localStorage.getItem('inap-tema');
        if (t !== 'inap' && t !== 'dark') {
          t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'inap';
        }
        document.documentElement.setAttribute('data-theme', t);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'inap');
      }
    </script>
  `);

  protected readonly service = dedent(`
    import { DOCUMENT, isPlatformBrowser } from '@angular/common';
    import { DestroyRef, Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

    export type InapTheme = 'inap' | 'dark';

    @Injectable({ providedIn: 'root' })
    export class ThemeService {
      private readonly doc = inject(DOCUMENT);
      private readonly key = 'inap-tema';
      private readonly media = isPlatformBrowser(inject(PLATFORM_ID))
        ? matchMedia('(prefers-color-scheme: dark)')
        : null;

      readonly theme = signal<InapTheme>(
        this.doc.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'inap'
      );

      constructor() {
        effect(() => this.doc.documentElement.setAttribute('data-theme', this.theme()));
        if (!this.media) return;
        // El dispositivo cambió de modo: se borra la elección guardada y se sigue al dispositivo.
        const onChange = (e: MediaQueryListEvent) => {
          this.store(null);
          this.theme.set(e.matches ? 'dark' : 'inap');
        };
        this.media.addEventListener('change', onChange);
        inject(DestroyRef).onDestroy(() => this.media?.removeEventListener('change', onChange));
      }

      toggle(): void {
        const next: InapTheme = this.theme() === 'dark' ? 'inap' : 'dark';
        this.theme.set(next);
        const system: InapTheme = this.media?.matches ? 'dark' : 'inap';
        this.store(next === system ? null : next); // igual al dispositivo = sin elección guardada
      }

      private store(value: InapTheme | null): void {
        try {
          value ? localStorage.setItem(this.key, value) : localStorage.removeItem(this.key);
        } catch { /* modo privado */ }
      }
    }
  `);

  protected readonly button = dedent(`
    <button type="button" class="btn btn-ghost"
            [attr.aria-pressed]="theme.theme() === 'dark'" (click)="theme.toggle()">
      <inap-icon name="moon" /> Modo oscuro
    </button>
  `);
}
