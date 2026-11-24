import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FIGMA_URL, PageRef, findPage } from '../../core/navigation';
import { EXPORTED, SCREEN_DOCS, ScreenDoc, ScreenImage } from '../../content/pantallas';
import { STATE_CAPTURES } from '../../content/pantallas/capturas';
import { DocPage } from '../../ui/doc-page/doc-page';
import { DocTab, DocTabs } from '../../ui/doc-tabs/doc-tabs';
import { Icon } from '../../ui/icon/icon';

/** Pantalla diseñada en Figma: capturas del estado principal, otros estados y componentes que usa. */
@Component({
  selector: 'inap-screen-doc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, DocPage, DocTab, DocTabs, Icon],
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
            @if (d.template && templateReady(d.template)) {
              Plantilla <a [routerLink]="d.template">{{ templateTitle(d.template) }}</a>.
            } @else if (d.template) {
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
        <ng-container [ngTemplateOutlet]="viewer" [ngTemplateOutletContext]="{ $implicit: d.images }" />

        @if (states().length) {
          <h2 id="estados">Otros estados</h2>
          <p>Abran cada estado para ver sus capturas.</p>
          <div class="mb-8 flex flex-col gap-2">
            @for (s of states(); track s.label) {
              <details class="group rounded-box border border-base-300">
                <summary class="flex cursor-pointer list-none items-center gap-3 rounded-box px-4 py-3 font-semibold hover:bg-surface-subtle [&::-webkit-details-marker]:hidden">
                  <inap-icon name="chevron-right" [size]="18" class="transition-transform group-open:rotate-90" />
                  <span class="flex-1">{{ s.label }}</span>
                  <span class="hidden shrink-0 text-sm font-normal text-neutral-text sm:inline">{{ s.devices }}</span>
                </summary>
                <div class="border-t border-base-300 p-4">
                  <ng-container [ngTemplateOutlet]="viewer" [ngTemplateOutletContext]="{ $implicit: s.images }" />
                </div>
              </details>
            }
          </div>
        }

        <ng-template #viewer let-images>
          @if (images.length === 1) {
            <ng-container [ngTemplateOutlet]="shot" [ngTemplateOutletContext]="{ $implicit: images[0] }" />
          } @else {
            <inap-doc-tabs label="Tamaño de pantalla">
              @for (img of images; track img.file) {
                <ng-template [inapTab]="img.label">
                  <ng-container [ngTemplateOutlet]="shot" [ngTemplateOutletContext]="{ $implicit: img }" />
                </ng-template>
              }
            </inap-doc-tabs>
          }
        </ng-template>

        <ng-template #shot let-img>
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

  /** Otros estados con sus capturas (public/capturas/estados/<node>.webp). */
  protected readonly states = computed(() => {
    const title = this.ref()?.title ?? '';
    return (this.doc()?.states ?? []).map((s) => {
      const images: ScreenImage[] = [];
      for (const device of ['escritorio', 'celular'] as const) {
        const node = s[device];
        const size = node && STATE_CAPTURES[node.replace(':', '-')];
        if (!node || !size) continue;
        images.push({
          label: device === 'escritorio' ? 'Escritorio' : 'Celular',
          device,
          file: `estados/${node.replace(':', '-')}.webp`,
          width: size[0],
          height: size[1],
          node,
          alt: `Captura de ${title}: ${s.label}, en ${device}.`,
          caption: s.label,
        });
      }
      return { label: s.label, images, devices: images.map((i) => i.label).join(' y ') };
    });
  });

  protected figma(node: string): string {
    return `${FIGMA_URL}?node-id=${node.replace(':', '-')}`;
  }

  /** La plantilla ya tiene página propia (no la de «en preparación»). */
  protected templateReady(path: string): boolean {
    return !!findPage('plantillas', path.split('/').pop() ?? '')?.load;
  }

  protected templateTitle(path: string): string {
    return findPage('plantillas', path.split('/').pop() ?? '')?.title ?? path;
  }
}
