import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, linkedSignal, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InapTheme, ThemeService } from '../../core/theme.service';
import { Icon } from '../icon/icon';

type Device = 'escritorio' | 'celular';

/** Ancho de diseño de cada dispositivo (frames de Figma). */
const WIDTH: Record<Device, number> = { escritorio: 1440, celular: 390 };

/**
 * Vista previa de una plantilla: la página /vista/{path} en un iframe, a 1440 px (reducida para caber)
 * o a 390 × 844, en tema claro u oscuro. Como es un iframe, los cambios de diseño dependen del ancho real.
 */
@Component({
  selector: 'inap-template-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="mb-10 rounded-box border border-base-300">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-base-300 px-3 py-2">
        <div class="join" role="group" aria-label="Tamaño de pantalla">
          @for (d of devices; track d) {
            <button type="button" class="btn btn-xs join-item" [class.btn-primary]="device() === d" [class.btn-ghost]="device() !== d"
                    [attr.aria-pressed]="device() === d" (click)="device.set(d)">
              {{ d === 'escritorio' ? 'Escritorio (1440 px)' : 'Celular (390 px)' }}
            </button>
          }
        </div>
        <div class="join" role="group" aria-label="Tema de la vista previa">
          <button type="button" class="btn btn-xs join-item" [class.btn-primary]="theme() === 'inap'" [class.btn-ghost]="theme() !== 'inap'"
                  [attr.aria-pressed]="theme() === 'inap'" (click)="theme.set('inap')">Claro</button>
          <button type="button" class="btn btn-xs join-item" [class.btn-primary]="theme() === 'dark'" [class.btn-ghost]="theme() !== 'dark'"
                  [attr.aria-pressed]="theme() === 'dark'" (click)="theme.set('dark')">Oscuro</button>
        </div>
        @if (variants().length) {
          <label class="flex items-center gap-2 text-sm">
            {{ variantLabel() }}
            <select class="select select-xs w-auto" [value]="variant()" (change)="variant.set($any($event.target).value)">
              @for (v of variants(); track v[0]) {
                <option [value]="v[0]">{{ v[1] }}</option>
              }
            </select>
          </label>
        }
        <a [href]="src()" target="_blank" rel="noopener" class="ms-auto inline-flex items-center gap-1.5 text-sm">
          Abrir a pantalla completa<span class="sr-only"> (se abre en una pestaña nueva)</span>
          <inap-icon name="external-link" [size]="16" />
        </a>
      </div>
      <div #frame class="overflow-hidden bg-surface-subtle" [class.p-4]="device() === 'celular'">
        <iframe [src]="safeSrc()" [title]="label() + ', vista de ' + device()"
                class="mx-auto block border-0 bg-base-100"
                [class.rounded-box]="device() === 'celular'" [class.shadow-lg]="device() === 'celular'"
                [style.width.px]="width()" [style.height.px]="height()" [style.zoom]="scale()"></iframe>
      </div>
    </div>
  `,
})
export class TemplatePreview {
  /** Ruta de la vista completa, sin «vista/» (home, catalogo…). */
  readonly path = input.required<string>();
  /** Nombre del iframe, p. ej. «Plantilla del Home». */
  readonly label = input.required<string>();
  /** Variantes opcionales de la vista: [valor, etiqueta]. Se pasan como ?{param}=valor. */
  readonly variants = input<[string, string][]>([]);
  readonly param = input('estado');
  readonly variantLabel = input('Estado');
  protected readonly variant = linkedSignal(() => this.variants()[0]?.[0] ?? '');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly site = inject(ThemeService);
  protected readonly devices: Device[] = ['escritorio', 'celular'];

  protected readonly device = signal<Device>('escritorio');
  /** Empieza con el tema del sitio. */
  protected readonly theme = linkedSignal<InapTheme>(() => this.site.theme());

  protected readonly src = computed(() => `vista/${this.path()}?tema=${this.theme()}${this.variant() ? `&${this.param()}=${this.variant()}` : ''}`);
  protected readonly safeSrc = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.src()));

  /** Ancho disponible para la vista previa (se mide en el navegador). */
  private readonly available = signal(1000);
  private readonly viewport = signal(900);
  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');

  protected readonly width = computed(() => WIDTH[this.device()]);
  /** Escritorio se reduce para caber; celular se muestra a tamaño real si cabe. */
  protected readonly scale = computed(() => {
    const room = this.available() - (this.device() === 'celular' ? 32 : 0);
    return Math.min(1, room / this.width());
  });
  /** Alto visible: 80 % de la ventana en escritorio, 844 px (alto del frame de Figma) en celular. */
  protected readonly height = computed(() => this.device() === 'celular' ? 844 : Math.round(this.viewport() * 0.8 / this.scale()));

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.frame().nativeElement;
      const measure = () => {
        this.available.set(el.clientWidth);
        this.viewport.set(window.innerHeight);
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      destroyRef.onDestroy(() => ro.disconnect());
    });
  }
}
