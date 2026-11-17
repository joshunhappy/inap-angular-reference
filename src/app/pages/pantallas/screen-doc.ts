import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FIGMA_URL, PageRef, findPage } from '../../core/navigation';
import { EXPORTED, SCREEN_DOCS, ScreenDoc } from '../../content/pantallas';
import { DocPage } from '../../ui/doc-page/doc-page';
import { DocTab, DocTabs } from '../../ui/doc-tabs/doc-tabs';
import { Icon } from '../../ui/icon/icon';

/** Pantalla diseñada en Figma: capturas del estado principal, otros estados y componentes que usa. */
@Component({
  selector: 'inap-screen-doc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DocPage, DocTab, DocTabs, Icon],
  template: `
    @if (doc(); as d) {
      <inap-doc-page section="pantallas" [slug]="page()" [figma]="figma(d.images[0].node)">
        <p>{{ d.intro }}</p>
        <dl class="mb-8 grid max-w-prose grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt class="font-semibold">Plataforma</dt>
          <dd class="text-neutral-text">{{ ref()?.platform }}</dd>
          @if (d.route) {
            <dt class="font-semibold">Dirección</dt>
            <dd><code>{{ d.route }}</code></dd>
          }
          <dt class="font-semibold">En código</dt>
          <dd class="text-neutral-text">
            @if (d.template) {
              Pendiente: será la plantilla <a [routerLink]="d.template">{{ templateTitle(d.template) }}</a>.
            } @else {
              Pendiente.
            }
          </dd>
        </dl>

        @if (d.sampleContent) {
          <div role="note" class="alert alert-info mb-8 max-w-prose items-start alert-soft">
            <inap-icon name="info" class="mt-0.5" />
            <p class="m-0">
              Textos, cifras, fotos y testimonios son de ejemplo hasta que Comunicación Social entregue el contenido
              real. Ver <a routerLink="/contenido/contenido-provisional">Contenido provisional</a>.
            </p>
          </div>
        }

        <h2 id="capturas">Capturas</h2>
        <p>
          Exportadas de Figma el {{ exported }}. Si algo no coincide, Figma manda. Desplacen dentro del recuadro para
          ver la página completa.
        </p>
        <inap-doc-tabs label="Tamaño de pantalla">
          @for (img of d.images; track img.file) {
            <ng-template [inapTab]="img.label">
              <figure class="m-0">
                <div role="region" tabindex="0" [attr.aria-label]="img.alt"
                     class="overflow-y-auto rounded-box border border-base-300 bg-surface-subtle"
                     [class]="img.device === 'celular' ? 'mx-auto max-h-[min(844px,80vh)] max-w-[390px]' : 'max-h-[80vh]'">
                  <img [src]="'capturas/' + img.file" [width]="img.width" [height]="img.height" [alt]="img.alt"
                       loading="lazy" decoding="async" class="block h-auto w-full" />
                </div>
                <figcaption class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
                            [class.justify-center]="img.device === 'celular'">
                  <span class="text-neutral-text">{{ img.caption }}</span>
                  <a [href]="figma(img.node)" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5">
                    Frame en Figma<span class="sr-only"> (se abre en una pestaña nueva)</span>
                    <inap-icon name="external-link" [size]="16" />
                  </a>
                  <a [href]="'capturas/' + img.file" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5">
                    Imagen en tamaño real<span class="sr-only"> (se abre en una pestaña nueva)</span>
                    <inap-icon name="external-link" [size]="16" />
                  </a>
                </figcaption>
              </figure>
            </ng-template>
          }
        </inap-doc-tabs>

        @if (d.states.length) {
          <h2 id="estados">Otros estados en Figma</h2>
          <p>Por ahora solo en Figma. Se agregarán aquí como capturas.</p>
          <div class="doc-table-wrap">
            <table class="doc-table">
              <thead>
                <tr><th scope="col">Estado</th><th scope="col">Escritorio</th><th scope="col">Celular</th></tr>
              </thead>
              <tbody>
                @for (s of d.states; track s.label) {
                  <tr>
                    <th scope="row" class="font-normal">{{ s.label }}</th>
                    <td>
                      @if (s.escritorio) {
                        <a [href]="figma(s.escritorio)" target="_blank" rel="noopener">Ver<span class="sr-only"> {{ s.label }} en escritorio en Figma (se abre en una pestaña nueva)</span></a>
                      } @else {
                        <span aria-hidden="true">—</span><span class="sr-only">No aplica</span>
                      }
                    </td>
                    <td>
                      @if (s.celular) {
                        <a [href]="figma(s.celular)" target="_blank" rel="noopener">Ver<span class="sr-only"> {{ s.label }} en celular en Figma (se abre en una pestaña nueva)</span></a>
                      } @else {
                        <span aria-hidden="true">—</span><span class="sr-only">No aplica</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <h2 id="componentes">Componentes en esta pantalla</h2>
        <ul>
          @for (c of components(); track c.slug) {
            <li><a [routerLink]="c.path">{{ c.title }}</a>: {{ c.description }}</li>
          }
        </ul>
      </inap-doc-page>
    }
  `,
})
export class ScreenDocPage {
  /** Desde la ruta (withComponentInputBinding). */
  readonly page = input.required<string>();
  protected readonly exported = EXPORTED;

  protected readonly doc = computed<ScreenDoc | undefined>(() => SCREEN_DOCS[this.page()]);
  protected readonly ref = computed(() => findPage('pantallas', this.page()));
  protected readonly components = computed<PageRef[]>(() =>
    (this.doc()?.components ?? []).map((slug) => findPage('componentes', slug)).filter((p): p is PageRef => !!p),
  );

  protected figma(node: string): string {
    return `${FIGMA_URL}?node-id=${node.replace(':', '-')}`;
  }

  protected templateTitle(path: string): string {
    return findPage('plantillas', path.split('/').pop() ?? '')?.title ?? path;
  }
}
