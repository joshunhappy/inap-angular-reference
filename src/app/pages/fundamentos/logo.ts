import { ChangeDetectionStrategy, Component } from '@angular/core';
import { dedent } from '../../core/dedent';
import { CodeBlock } from '../../ui/code-block/code-block';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Logo } from '../../ui/logo/logo';

@Component({
  selector: 'inap-logo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock, DocPage, Logo],
  template: `
    <inap-doc-page section="fundamentos" slug="logo">
      <p>
        El logo va en línea (SVG dentro del HTML) para que sus colores salgan de los tokens. La variante
        <strong>Auto</strong> de Figma usa <code>logo-primary</code> y <code>logo-accent</code>: azul y cian en el
        tema claro, blanco en el oscuro.
      </p>

      <h2 id="variantes">Variantes</h2>
      <ul class="mb-6 grid list-none gap-4 ps-0 md:grid-cols-3">
        <li class="flex flex-col overflow-hidden rounded-box border border-base-300">
          <div data-theme="inap" class="flex h-36 items-center justify-center bg-base-100"><inap-logo class="w-[140px]" /></div>
          <p class="mb-0 border-t border-base-300 p-4 text-sm"><strong>Auto, tema claro.</strong> Azul y cian de marca.</p>
        </li>
        <li class="flex flex-col overflow-hidden rounded-box border border-base-300">
          <div data-theme="dark" class="flex h-36 items-center justify-center bg-base-100"><inap-logo class="w-[140px]" /></div>
          <p class="mb-0 border-t border-base-300 p-4 text-sm"><strong>Auto, tema oscuro.</strong> Blanco.</p>
        </li>
        <li class="flex flex-col overflow-hidden rounded-box border border-base-300">
          <div class="flex h-36 items-center justify-center bg-inap-brand-navy"><img src="brand/logo-white.svg" alt="" class="w-[140px]" /></div>
          <p class="mb-0 border-t border-base-300 p-4 text-sm"><strong>White.</strong> Sobre fotos o superficie navy, en los dos temas.</p>
        </li>
      </ul>

      <h2 id="reglas">Reglas</h2>
      <ul>
        <li><strong>Ancho mínimo en web: 109 px</strong> (manual de marca). Por eso la barra mide 92 px en escritorio y 84 px en celular.</li>
        <li>No cambiar colores, proporciones ni agregar efectos. Los colores de marca son fijos.</li>
        <li>El logo de la barra es un enlace al inicio con <code>aria-label="INAP, inicio"</code>; el SVG lleva <code>aria-hidden="true"</code>.</li>
      </ul>

      <h2 id="codigo">Código</h2>
      <p>En el SVG oficial, cada trazo usa la clase del token en lugar del color fijo:</p>
      <inap-code-block [code]="code" />

      <h2 id="archivos">Archivos</h2>
      <ul>
        <li><a href="brand/logo-color.svg" download>logo-color.svg</a> · versión a color</li>
        <li><a href="brand/logo-white.svg" download>logo-white.svg</a> · versión blanca</li>
      </ul>
    </inap-doc-page>
  `,
})
export class LogoPage {
  protected readonly code = dedent(`
    <a href="/" aria-label="INAP, inicio" class="block w-[109px]">
      <svg viewBox="0 0 626.4 386.05" aria-hidden="true" focusable="false" class="block h-auto w-full">
        <path class="fill-logo-primary" d="…" />
        <path class="fill-logo-accent" d="…" />
        <!-- … resto de trazos del archivo oficial -->
      </svg>
    </a>
  `);
}
