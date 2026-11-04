import { ChangeDetectionStrategy, Component } from '@angular/core';
import { dedent } from '../../core/dedent';
import { CodeBlock } from '../../ui/code-block/code-block';
import { DocPage } from '../../ui/doc-page/doc-page';

@Component({
  selector: 'inap-movimiento-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock, DocPage],
  template: `
    <inap-doc-page section="fundamentos" slug="movimiento">
      <p>
        El movimiento explica un cambio (algo se abre, aparece o se desplaza); no decora. Todo movimiento respeta
        la preferencia del sistema <code>prefers-reduced-motion</code>.
      </p>

      <h2 id="reglas">Reglas</h2>
      <ul>
        <li>Desplazamiento suave solo con <code>motion-safe:scroll-smooth</code>.</li>
        <li>Transiciones y animaciones (carrusel, <code>shine-hover</code>, <code>text-rotate</code>) con <code>motion-safe:</code>, o desactivadas con <code>motion-reduce:</code>.</li>
        <li>Autoplay del carrusel: no arranca con movimiento reducido; se detiene con el cursor encima, con el foco y con el botón de pausa (WCAG 2.2.2).</li>
        <li>Cambios de color y de borde (hover, foco): <code>transition-colors</code> corto, sin desplazamiento.</li>
      </ul>
      <inap-code-block [code]="code" />
    </inap-doc-page>
  `,
})
export class MovimientoPage {
  protected readonly code = dedent(`
    <html class="motion-safe:scroll-smooth">

    <div class="transition-transform motion-reduce:transition-none hover:-translate-y-0.5">…</div>
  `);
}
