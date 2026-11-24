import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FIGMA_URL } from '../../core/navigation';
import { InapTheme, ThemeService } from '../../core/theme.service';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Icon } from '../../ui/icon/icon';

type Device = 'escritorio' | 'celular';

/** Ancho de diseño de cada dispositivo (frames de Figma). */
const WIDTH: Record<Device, number> = { escritorio: 1440, celular: 390 };

interface Row { section: string; mobile: string; desktop: string; components: [string, string][] }

const ROWS: Row[] = [
  { section: 'Barra de navegación', mobile: 'Logo, buscar, menú y «Regístrate» (84 px).', desktop: 'Barra superior azul y barra principal con mega menú y buscador; desde 1280 px.', components: [['Barra de navegación', 'barra-de-navegacion'], ['Mega menú', 'mega-menu'], ['Menú en celular', 'menu-movil']] },
  { section: 'Hero', mobile: 'Carrusel con una diapositiva y la siguiente asomando; selector a todo el ancho y buscador debajo; populares en dos líneas; tipos de curso apilados.', desktop: 'Carrusel con flechas; selector y buscador en una fila (desde 1024 px); tipos de curso en 4 columnas.', components: [['Carrusel', 'carrusel'], ['Selector de audiencia', 'selector-de-audiencia'], ['Buscador', 'buscador'], ['Tarjeta de tipo de curso', 'tarjeta-tipo-de-curso']] },
  { section: 'Cifras', mobile: '2 × 2.', desktop: 'Una fila de 4.', components: [['Estadística', 'estadistica']] },
  { section: 'Cursos destacados', mobile: 'Chips y tarjetas se desplazan en horizontal; «Ver todos los cursos» a todo el ancho debajo.', desktop: '«Ver todos los cursos» arriba a la derecha; 2 columnas en tableta, 4 desde 1280 px.', components: [['Encabezado de sección', 'encabezado-de-seccion'], ['Chip', 'chip'], ['Tarjeta de curso', 'tarjeta-de-curso']] },
  { section: 'Áreas de formación', mobile: 'Lista de una columna con separadores; encabezado a la izquierda.', desktop: '3 columnas; encabezado centrado.', components: [['Tarjeta de área', 'tarjeta-de-area']] },
  { section: 'Para instituciones', mobile: 'Apilado; botón a todo el ancho y enlace debajo.', desktop: 'Texto a la izquierda y tres servicios a la derecha.', components: [] },
  { section: 'Cómo funciona', mobile: 'Número a la izquierda y texto a la derecha.', desktop: 'Tres columnas centradas.', components: [] },
  { section: 'Testimonios', mobile: 'Tarjetas de 300 px que se desplazan en horizontal.', desktop: 'Tres columnas desde 1024 px.', components: [['Testimonio', 'testimonio']] },
  { section: 'Preguntas frecuentes y llamado final', mobile: 'Apilado; botón del llamado a todo el ancho.', desktop: 'Introducción a la izquierda y preguntas a la derecha; tarjeta azul centrada.', components: [['Acordeón', 'acordeon']] },
  { section: 'Pie de página', mobile: 'Columnas en 2 × 2.', desktop: 'Logo y contacto a la izquierda, tres columnas de enlaces.', components: [['Pie de página', 'pie-de-pagina']] },
];

/** Plantilla del Home: la página completa en un iframe, con cambio de tamaño y tema, y notas por sección. */
@Component({
  selector: 'inap-home-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, Icon, RouterLink],
  template: `
    <inap-doc-page section="plantillas" slug="home" [figma]="figmaUrl">
      <p>
        Home de la plataforma de cursos armado con los componentes del sitio, tal como se ve en celular y en escritorio.
        Es la misma página en todos los tamaños: cambia el ancho y el diseño se reorganiza. Las capturas de Figma están en
        <a routerLink="/pantallas/home">Pantallas › Home</a>.
      </p>
      <dl class="mb-8 grid max-w-prose grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt class="font-semibold">Plataforma</dt>
        <dd class="text-neutral-text">Angular</dd>
        <dt class="font-semibold">Dirección</dt>
        <dd><code>/</code></dd>
      </dl>

      <div role="note" class="alert alert-info mb-8 max-w-prose items-start alert-soft">
        <inap-icon name="info" class="mt-0.5" />
        <p class="m-0">
          Textos, cifras, fotos y testimonios son de ejemplo hasta que Comunicación Social entregue el contenido real. Ver
          <a routerLink="/contenido/contenido-provisional">Contenido provisional</a>.
        </p>
      </div>

      <h2 id="vista">Vista previa</h2>
      <p>
        Funciona: el carrusel rota, el selector «Para ti» / «Para tu institución» cambia el texto del buscador, los filtros
        se marcan y las preguntas se abren. Los enlaces no llevan a ninguna parte.
      </p>

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
          <a [href]="src()" target="_blank" rel="noopener" class="ms-auto inline-flex items-center gap-1.5 text-sm">
            Abrir a pantalla completa<span class="sr-only"> (se abre en una pestaña nueva)</span>
            <inap-icon name="external-link" [size]="16" />
          </a>
        </div>
        <div #frame class="overflow-hidden bg-surface-subtle" [class.p-4]="device() === 'celular'">
          <iframe [src]="safeSrc()" [title]="'Plantilla del Home, vista de ' + device()"
                  class="mx-auto block border-0 bg-base-100"
                  [class.rounded-box]="device() === 'celular'" [class.shadow-lg]="device() === 'celular'"
                  [style.width.px]="width()" [style.height.px]="height()" [style.zoom]="scale()"></iframe>
        </div>
      </div>

      <h2 id="secciones">Secciones</h2>
      <p>De arriba hacia abajo. Celular: menos de 768 px. Las columnas de cada sección cambian en los anchos indicados.</p>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead>
            <tr><th scope="col">Sección</th><th scope="col">Celular</th><th scope="col">Escritorio</th><th scope="col">Componentes</th></tr>
          </thead>
          <tbody>
            @for (r of rows; track r.section) {
              <tr>
                <th scope="row" class="font-semibold">{{ r.section }}</th>
                <td>{{ r.mobile }}</td>
                <td>{{ r.desktop }}</td>
                <td>
                  @for (c of r.components; track c[1]; let last = $last) {
                    <a [routerLink]="'/componentes/' + c[1]">{{ c[0] }}</a>{{ last ? '' : ', ' }}
                  } @empty {
                    <span class="text-neutral-text">Propia del Home</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <h2 id="diseno">Diseño de página</h2>
      <ul>
        <li><strong>Contenedor:</strong> 1200 px de contenido como máximo (<code>max-w-316 px-8</code>), 16 px de margen en celular (<code>px-4</code>).</li>
        <li><strong>Espacio entre secciones:</strong> 96 px arriba y abajo en escritorio, 48 px en celular (<code>py-12 md:py-24</code>). La franja de cifras es más baja: 40 y 32 px.</li>
        <li><strong>Fondos alternos:</strong> blanco, <code>surface-subtle</code> (cifras, áreas, testimonios) y <code>brand-surface</code> (para instituciones y llamado final), para separar secciones sin líneas.</li>
        <li><strong>Filas con desplazamiento:</strong> en celular, chips, cursos y testimonios van de borde a borde (<code>-mx-4 px-4</code>) para que la siguiente tarjeta asome y se note que hay más.</li>
        <li><strong>Ondas de marca:</strong> <code>brand/waves.svg</code> detrás del hero (15 %), de «Para instituciones» (15 %) y del llamado final (20 %). Son decorativas (<code>alt=""</code>).</li>
      </ul>

      <h2 id="accesibilidad">Accesibilidad</h2>
      <ul>
        <li><strong>Encabezados:</strong> un solo H1, «Fórmate para servir mejor a Guatemala», oculto con <code>sr-only</code> y colocado <em>antes</em> del carrusel para que sea el primero de la página. Cada sección abre con un H2; tarjetas, pasos y servicios usan H3.</li>
        <li><strong>Regiones:</strong> <code>header</code>, <code>main</code> y <code>footer</code>; cada sección es un <code>&lt;section&gt;</code> con <code>aria-labelledby</code> a su H2. La franja de cifras usa <code>aria-label="El INAP en cifras"</code>.</li>
        <li><strong>Carrusel:</strong> se llama «Cursos en portada» para no repetir el nombre de la sección «Cursos destacados».</li>
        <li><strong>Enlace para saltar:</strong> «Saltar al contenido principal» es lo primero al pulsar Tab.</li>
        <li><strong>Desplazamiento horizontal:</strong> chips y tarjetas de curso tienen enlaces o botones, así que el foco los trae a la vista. La fila de testimonios no tiene nada enfocable: es una región con <code>tabindex="0"</code> y nombre para moverla con las flechas.</li>
        <li><strong>Preguntas frecuentes:</strong> <code>&lt;details&gt;</code> con el mismo <code>name</code>; abrir una cierra las demás. La primera empieza abierta.</li>
        <li><strong>Áreas táctiles:</strong> en celular, enlaces de texto, populares, chips y puntos del carrusel miden al menos 44 px de alto.</li>
        <li><strong>Sobre azul oscuro:</strong> botones y enlaces llevan anillo de foco blanco (<code>outline-brand-surface-content</code>).</li>
      </ul>

      <h2 id="codigo">Código</h2>
      <p>
        El HTML sale de <code>src/app/content/plantillas/home.ts</code>, que compone las mismas funciones de las páginas de componentes.
        En la plataforma, cada sección es un componente de Angular con sus datos del servicio; el diseño de página
        (contenedor, espacios y columnas) es el de esta plantilla.
      </p>
    </inap-doc-page>
  `,
})
export class HomeTemplatePage {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly site = inject(ThemeService);
  protected readonly figmaUrl = `${FIGMA_URL}?node-id=64-2`;
  protected readonly rows = ROWS;
  protected readonly devices: Device[] = ['escritorio', 'celular'];

  protected readonly device = signal<Device>('escritorio');
  /** Empieza con el tema del sitio. */
  protected readonly theme = linkedSignal<InapTheme>(() => this.site.theme());

  protected readonly src = computed(() => `vista/home?tema=${this.theme()}`);
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
