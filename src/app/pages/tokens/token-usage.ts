import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPage } from '../../ui/doc-page/doc-page';
import { CodeBlock } from '../../ui/code-block/code-block';
import { dedent } from '../../core/dedent';

@Component({
  selector: 'inap-token-usage-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DocPage, CodeBlock],
  template: `
    <inap-doc-page section="tokens" slug="uso">
      <p>
        Cada token es una variable CSS del tema y, a la vez, una clase de Tailwind. En Figma, Dev Mode muestra
        el mismo nombre (code syntax), así que lo que ven en el diseño es lo que escriben en el código.
      </p>

      <h2 id="figma-a-clase">De Figma a clase</h2>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead><tr><th scope="col">Figma muestra</th><th scope="col">Clase de Tailwind</th></tr></thead>
          <tbody>
            <tr><td><code>var(--color-primary-text)</code></td><td><code>text-primary-text</code>, <code>border-primary-text</code>, <code>outline-primary-text</code></td></tr>
            <tr><td><code>var(--color-surface-subtle)</code></td><td><code>bg-surface-subtle</code></td></tr>
            <tr><td><code>color-mix(in oklab, var(--color-base-content) 60%, transparent)</code></td><td><code>text-base-content/60</code></td></tr>
            <tr><td><code>color-mix(in oklab, var(--color-primary) 8%, var(--color-base-100))</code></td><td>Fondo soft de daisyUI (<code>badge-soft</code>, <code>alert-soft</code>)</td></tr>
            <tr><td><code>calc(var(--spacing) * 6)</code></td><td><code>p-6</code>, <code>gap-6</code> (24 px)</td></tr>
            <tr><td><code>var(--radius-box)</code></td><td><code>rounded-box</code></td></tr>
            <tr><td><code>var(--text-sm)</code></td><td><code>text-sm</code></td></tr>
            <tr><td><code>Shadow/md</code></td><td><code>shadow-md</code></td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="reglas">Reglas</h2>
      <ul>
        <li><strong>Nunca hex en el código.</strong> Si Dev Mode muestra un hex sin variable, falta enlazarlo en Figma: avísenme.</li>
        <li><strong>Texto y bordes de color van con <code>-text</code>.</strong> <code>text-primary</code> no pasa en dark; <code>text-accent</code> da 2.44:1 sobre blanco.</li>
        <li><strong>Sin tonos de rampa para texto o bordes</strong> (<code>-300</code>, <code>-500</code>…). Las rampas se invierten en dark.</li>
        <li><strong>Sin valores arbitrarios</strong> (<code>p-[13px]</code>). Si un valor no está en la escala, pregúntenme.</li>
        <li><strong>El CSS que genera Figma no es código final.</strong> Sirve para ver valores; el código usa clases de daisyUI y Tailwind.</li>
        <li><strong>Dark no se diseña aparte.</strong> Es el mismo HTML con <code>data-theme="dark"</code>. Si algo se ve distinto, es un token, no una regla CSS nueva.</li>
      </ul>

      <h2 id="clases-propias">Clases propias</h2>
      <p>
        Las clases nuevas llevan el prefijo <code>inap-</code> y se escriben con <code>&#64;apply</code> y tokens.
        Antes de agregar un color, revisen <a routerLink="/tokens/todos">Todos los tokens</a>; si no existe, se agrega primero en Figma.
      </p>
      <inap-code-block language="CSS" [code]="customClass" />

      <h2 id="cambios">Cuando cambia un token</h2>
      <p>
        Se cambia primero en Figma y después en <code>inap-theme.css</code>; los dos se mantienen iguales.
        Como este proyecto genera el CSS de Angular y de WordPress, el cambio llega a las dos plataformas.
      </p>
    </inap-doc-page>
  `,
})
export class TokenUsagePage {
  protected readonly customClass = dedent(`
    .inap-course-card {
      @apply rounded-box bg-base-2 text-base-content;
    }
    .inap-course-card__meta {
      @apply text-sm text-neutral-text;
    }
  `);
}
