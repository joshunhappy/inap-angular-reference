import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FIGMA_URL } from '../../core/navigation';
import { ComponentDoc } from '../../content/componentes/types';
import { CodeBlock } from '../../ui/code-block/code-block';
import { DoDont } from '../../ui/do-dont/do-dont';
import { DocPage } from '../../ui/doc-page/doc-page';
import { DocTab, DocTabs } from '../../ui/doc-tabs/doc-tabs';
import { Example } from '../../ui/example/example';
import { COMPONENT_DOCS } from '../../content/componentes';

/** Página de componente: Ejemplos, Uso, Accesibilidad y Código, a partir de un archivo de contenido. */
@Component({
  selector: 'inap-component-doc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock, DoDont, DocPage, DocTab, DocTabs, Example],
  templateUrl: './component-doc.html',
})
export class ComponentDocPage {
  private readonly sanitizer = inject(DomSanitizer);
  readonly page = input.required<string>();

  protected readonly doc = computed<ComponentDoc | undefined>(() => COMPONENT_DOCS[this.page()]);
  protected readonly figma = computed(() => {
    const node = this.doc()?.figmaNode;
    return node ? `${FIGMA_URL}?node-id=${node}` : undefined;
  });

  /** Contenido escrito en el código fuente del sitio, nunca del usuario. */
  protected trust(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
