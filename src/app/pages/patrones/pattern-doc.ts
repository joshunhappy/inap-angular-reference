import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CONTENT_DOCS } from '../../content/contenido';
import { PATTERN_DOCS } from '../../content/patrones';
import { PatternDoc } from '../../content/patrones/types';
import { CodeBlock } from '../../ui/code-block/code-block';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Example } from '../../ui/example/example';

const DOCS: Record<string, Record<string, PatternDoc>> = { patrones: PATTERN_DOCS, contenido: CONTENT_DOCS };

/** Página de patrón o de contenido: introducción y secciones con texto, ejemplo y código, a partir de un archivo de contenido. */
@Component({
  selector: 'inap-pattern-doc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock, DocPage, Example, RouterLink],
  template: `
    <inap-doc-page [section]="section()" [slug]="page()">
      @if (doc(); as d) {
        <div class="mb-8 max-w-prose" [innerHTML]="trust(d.intro)"></div>

        @for (s of d.sections; track s.id) {
          <h2 [id]="s.id">{{ s.title }}</h2>
          <div [innerHTML]="trust(s.html)"></div>
          @if (s.example; as e) {
            <inap-example class="my-6" [title]="e.title" [description]="e.description" [html]="e.html"
                          [previewClass]="e.previewClass ?? 'flex flex-wrap items-center gap-3 p-6'" />
          }
          @for (c of s.snippets ?? []; track c.title) {
            <h3>{{ c.title }}</h3>
            <inap-code-block class="mb-6" [language]="c.language" [code]="c.code" />
          }
        }

        @if (d.usedIn.length) {
          <h2 id="donde-se-usa">Dónde se usa</h2>
          <ul>
            @for (u of d.usedIn; track u[1]) {
              <li><a [routerLink]="'/' + u[1]">{{ u[0] }}</a></li>
            }
          </ul>
        }
      }
    </inap-doc-page>
  `,
})
export class PatternDocPage {
  private readonly sanitizer = inject(DomSanitizer);
  /** Sección y página, desde los datos de la ruta. */
  readonly section = input<string>('patrones');
  readonly page = input.required<string>();

  protected readonly doc = computed<PatternDoc | undefined>(() => DOCS[this.section()]?.[this.page()]);

  /** Contenido escrito en el código fuente del sitio, nunca del usuario. */
  protected trust(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
