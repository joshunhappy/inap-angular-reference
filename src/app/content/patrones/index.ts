import { dedent } from '../../core/dedent';
import { activeFilters, filterGroup } from '../componentes/sitio-catalogo';
import { enrollmentCard, STATES } from '../componentes/sitio-detalle-curso';
import { icon } from '../componentes/types';
import { PatternDoc } from './types';

/* ── Estructura de página ───────────────────────────────────────────────────── */

const estructuraDePagina: PatternDoc = {
  intro: `<p>Todas las páginas de la plataforma tienen el mismo esqueleto: un enlace para saltar al contenido, el encabezado con la navegación, un <code>&lt;main&gt;</code> y el pie. Así los lectores de pantalla pueden saltar entre regiones y quien usa teclado no recorre el menú en cada página.</p>`,
  sections: [
    {
      id: 'esqueleto',
      title: 'Esqueleto',
      html: `<ul>
        <li><strong>Enlace para saltar:</strong> es lo primero que recibe el foco al pulsar Tab. Oculto hasta enfocarlo (<code>sr-only focus:not-sr-only</code>).</li>
        <li><strong>Encabezado:</strong> <code>&lt;header&gt;</code> con <code>&lt;nav aria-label="Principal"&gt;</code>. Si hay otra navegación (breadcrumb, secciones del curso, paginación), cada una lleva su propio <code>aria-label</code>.</li>
        <li><strong>Contenido:</strong> un solo <code>&lt;main id="contenido" tabindex="-1"&gt;</code>. El <code>tabindex</code> permite enfocarlo al cambiar de ruta (ver <a href="patrones/cambio-de-ruta">Título y foco al cambiar de ruta</a>).</li>
        <li><strong>Pie:</strong> <code>&lt;footer&gt;</code>, fuera de <code>&lt;main&gt;</code>.</li>
      </ul>`,
      example: {
        title: 'Enlace para saltar al contenido',
        description: 'Enfoquen la vista previa con Tab: el enlace aparece arriba a la izquierda.',
        previewClass: 'relative min-h-32 p-6',
        html: dedent(`
          <a href="#ej-contenido" class="btn btn-primary sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50">Saltar al contenido principal</a>
          <main id="ej-contenido" tabindex="-1" class="pt-10 text-sm text-neutral-text outline-none">Contenido de la página.</main>
        `),
      },
      snippets: [
        {
          title: 'Plantilla base',
          language: 'HTML',
          code: dedent(`
            <a href="#contenido" class="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
              Saltar al contenido principal
            </a>
            <header>
              <nav aria-label="Principal">…</nav>
            </header>
            <main id="contenido" tabindex="-1" class="outline-none">
              <h1>…</h1>
            </main>
            <footer>…</footer>
          `),
        },
      ],
    },
    {
      id: 'encabezados',
      title: 'Encabezados y regiones',
      html: `<ul>
        <li><strong>Un solo <code>&lt;h1&gt;</code> por página</strong>, con el nombre de la página. En el Home va oculto (<code>sr-only</code>) y antes del carrusel, para que sea el primer encabezado.</li>
        <li><strong>Sin saltar niveles:</strong> H1 › H2 › H3. El tamaño lo dan las clases, no la etiqueta: en el detalle de curso, «¿En qué consiste?» se ve como H5 pero es <code>&lt;h2&gt;</code>.</li>
        <li><strong>Cada sección</strong> es un <code>&lt;section aria-labelledby&gt;</code> que apunta a su H2. Una sección sin título visible usa <code>aria-label</code>.</li>
        <li><strong>Sin regiones repetidas con el mismo nombre:</strong> por eso el carrusel del Home se llama «Cursos en portada» y no «Cursos destacados», que es la sección siguiente.</li>
      </ul>`,
    },
  ],
  usedIn: [['Plantilla del Home', 'plantillas/home'], ['Plantilla del Catálogo', 'plantillas/catalogo'], ['Plantilla del Detalle de curso', 'plantillas/detalle-de-curso']],
};

/* ── Cambio de ruta ─────────────────────────────────────────────────────────── */

const cambioDeRuta: PatternDoc = {
  intro: `<p>En una aplicación de una sola página, el navegador no recarga al cambiar de ruta: el lector de pantalla no anuncia la página nueva y el foco se queda en el enlace que se pulsó, que quizá ya no existe. Dos reglas lo resuelven: cada ruta tiene su título y, al terminar la navegación, el foco pasa a <code>&lt;main&gt;</code>.</p>`,
  sections: [
    {
      id: 'titulo',
      title: 'Título de cada ruta',
      html: `<ul>
        <li>Formato: <strong>«Página | INAP»</strong>. Ejemplos: «Catálogo de cursos | INAP», «Curso Certificado en Administración Financiera | INAP».</li>
        <li>Rutas con datos (un curso) ponen el título cuando llegan los datos, con el servicio <code>Title</code>.</li>
        <li>Resultados de búsqueda: «Resultados para «gestión» | INAP».</li>
      </ul>`,
      snippets: [
        {
          title: 'Rutas',
          language: 'TypeScript',
          code: dedent(`
            export const routes: Routes = [
              { path: '', component: HomePage, title: 'Inicio | INAP' },
              { path: 'login', component: LoginPage, title: 'Iniciar sesión | INAP' },
            ];
          `),
        },
      ],
    },
    {
      id: 'foco',
      title: 'Foco al terminar la navegación',
      html: `<ul>
        <li>Al cambiar de página, el foco pasa a <code>&lt;main id="contenido" tabindex="-1"&gt;</code>. El lector anuncia el título y lo siguiente que lee es el contenido.</li>
        <li><strong>No en la primera carga:</strong> ahí el navegador ya anuncia la página.</li>
        <li><strong>No cuando solo cambian los parámetros o el ancla.</strong> En el catálogo, marcar un filtro o cambiar de página cambia la URL (<code>?tipo=…&amp;pagina=2</code>) sin cambiar de pantalla: el foco se queda donde está o pasa al encabezado de resultados (ver <a href="patrones/filtros-del-catalogo">Filtros del catálogo</a>). Las anclas de las tabs del curso tampoco lo mueven.</li>
        <li><code>preventScroll: true</code>: el desplazamiento lo maneja el router.</li>
      </ul>`,
      snippets: [
        {
          title: 'app.component.ts',
          language: 'TypeScript',
          code: dedent(`
            private readonly router = inject(Router);
            private readonly doc = inject(DOCUMENT);

            constructor() {
              let lastPath = '';
              this.router.events
                .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
                .subscribe((e) => {
                  // Solo la ruta, sin ?parámetros ni #ancla.
                  const path = e.urlAfterRedirects.split(/[?#]/)[0];
                  const first = lastPath === '';
                  const samePage = path === lastPath;
                  lastPath = path;
                  if (first || samePage) return;
                  setTimeout(() => this.doc.getElementById('contenido')?.focus({ preventScroll: true }));
                });
            }
          `),
        },
      ],
    },
  ],
  usedIn: [['Estructura de página', 'patrones/estructura-de-pagina'], ['Filtros del catálogo', 'patrones/filtros-del-catalogo']],
};

/* ── Mostrar u ocultar al desplazar ─────────────────────────────────────────── */

const visibilidadAlDesplazar: PatternDoc = {
  intro: `<p>Tres elementos aparecen o cambian según lo que está en pantalla. Los tres se resuelven con <code>IntersectionObserver</code> en una directiva, sin escuchar el evento <code>scroll</code> en cada componente.</p>`,
  sections: [
    {
      id: 'casos',
      title: 'Dónde se usa',
      html: `<div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th scope="col">Elemento</th><th scope="col">Se muestra cuando</th><th scope="col">Página</th></tr></thead>
        <tbody>
          <tr><td>Buscador de la barra (y la lupa en celular)</td><td>El buscador del hero sale de la vista. Se oculta al regresar arriba.</td><td>Home de Angular e inicio de WordPress. En las demás páginas siempre está visible.</td></tr>
          <tr><td>Barra de inscripción (celular)</td><td>La tarjeta de inscripción ya pasó hacia arriba, no antes: en la primera pantalla la tarjeta está a la vista.</td><td>Detalle de curso.</td></tr>
          <tr><td>Tab activa</td><td>Su sección pasó bajo las tabs fijas.</td><td>Detalle de curso (ver <a href="patrones/anclas">Anclas y scroll spy</a>).</td></tr>
        </tbody>
      </table></div>`,
    },
    {
      id: 'ocultar',
      title: 'Ocultar de verdad',
      html: `<ul>
        <li>Lo oculto sale del orden de tabulación y del árbol de accesibilidad: <code>@if</code>, el atributo <code>hidden</code> o <code>inert</code> con <code>invisible</code>. <strong>Solo <code>opacity-0</code> no basta:</strong> el botón sigue recibiendo el foco sin verse.</li>
        <li>Lo que aparece no recibe el foco ni se anuncia: es un atajo a algo que ya está en la página.</li>
        <li>Una barra fija abajo reserva su alto al final de la página (96 px en el detalle de curso) para no tapar el pie.</li>
        <li>Animaciones de entrada solo con <code>motion-safe:</code>.</li>
      </ul>`,
    },
    {
      id: 'directiva',
      title: 'Directiva',
      html: `<p>Emite la entrada completa del observador: además de saber si el elemento está a la vista, la barra de inscripción necesita saber si quedó arriba o abajo (<code>boundingClientRect.top</code>).</p>`,
      snippets: [
        {
          title: 'in-view.directive.ts',
          language: 'TypeScript',
          code: dedent(`
            @Directive({ selector: '[inapInView]' })
            export class InViewDirective {
              readonly inapInView = output<IntersectionObserverEntry>();
              readonly rootMargin = input('0px');

              constructor() {
                const el = inject(ElementRef<HTMLElement>).nativeElement;
                const destroyRef = inject(DestroyRef);
                afterNextRender(() => {
                  const io = new IntersectionObserver(([entry]) => this.inapInView.emit(entry), {
                    rootMargin: this.rootMargin(),
                  });
                  io.observe(el);
                  destroyRef.onDestroy(() => io.disconnect());
                });
              }
            }
          `),
        },
        {
          title: 'Uso',
          language: 'HTML',
          code: dedent(`
            <!-- Home: el buscador de la barra aparece cuando el del hero sale de la vista -->
            <form role="search" (inapInView)="heroSearchVisible.set($event.isIntersecting)">…</form>

            <!-- Detalle de curso: la barra aparece cuando la tarjeta quedó arriba -->
            <section aria-label="Inscripción"
                     (inapInView)="showBar.set(!$event.isIntersecting && $event.boundingClientRect.top < 0)">…</section>
            @if (showBar()) {
              <div class="fixed inset-x-0 bottom-0 z-30 lg:hidden">…</div>
            }
          `),
        },
      ],
    },
  ],
  usedIn: [['Plantilla del Detalle de curso', 'plantillas/detalle-de-curso'], ['Buscador', 'componentes/buscador'], ['Tarjeta de inscripción', 'componentes/tarjeta-de-inscripcion']],
};

/* ── Anclas y scroll spy ────────────────────────────────────────────────────── */

const anclas: PatternDoc = {
  intro: `<p>Las tabs del detalle de curso (Información, Programa, Docente, Preguntas) no son pestañas: todo el contenido está en la página y cada tab es un enlace de ancla a su sección. Quedan fijas arriba al desplazar y marcan la sección que se está leyendo.</p>`,
  sections: [
    {
      id: 'enlaces',
      title: 'Enlaces de ancla en Angular',
      html: `<ul>
        <li>La aplicación tiene <code>&lt;base href="/frontend/webinap/"&gt;</code>: <code>href="#programa"</code> iría a la raíz. Se usa <code>routerLink</code> con <code>fragment</code> y el desplazamiento del router.</li>
        <li>Cada sección lleva <code>scroll-mt-16</code> para quedar debajo de las tabs fijas y <code>tabindex="-1"</code> para recibir el foco: quien usa teclado sigue leyendo desde la sección elegida.</li>
        <li>Desplazamiento suave solo con <code>motion-safe:scroll-smooth</code>.</li>
      </ul>`,
      example: {
        title: 'Tabs de sección',
        description: 'Mismo HTML que la plantilla. La sección visible lleva aria-current="location".',
        previewClass: 'p-6',
        html: dedent(`
          <nav aria-label="Secciones del curso">
            <ul class="flex gap-5 overflow-x-auto border-b border-base-content/10 lg:gap-6">
              ${[['informacion', 'Información'], ['programa', 'Programa'], ['docente', 'Docente'], ['preguntas', 'Preguntas']]
                .map(([id, label], i) => `<li class="shrink-0"><a href="#${id}"${i === 1 ? ' aria-current="location"' : ''} class="-mb-px flex min-h-11 items-center border-b-3 border-transparent px-1 pt-3.5 pb-3 text-sm font-semibold whitespace-nowrap text-neutral-text hover:text-base-content aria-[current=location]:border-primary-text aria-[current=location]:text-primary-text">${label}</a></li>`)
                .join('\n      ')}
            </ul>
          </nav>
        `),
      },
      snippets: [
        {
          title: 'app.config.ts',
          language: 'TypeScript',
          code: dedent(`
            provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }))
          `),
        },
        {
          title: 'Plantilla del curso',
          language: 'HTML',
          code: dedent(`
            <nav aria-label="Secciones del curso" class="sticky top-0 z-20 bg-base-100">
              <ul class="flex gap-6 overflow-x-auto border-b border-base-content/10">
                @for (s of sections; track s.id) {
                  <li>
                    <a [routerLink]="[]" [fragment]="s.id"
                       [attr.aria-current]="active() === s.id ? 'location' : null"
                       class="… aria-[current=location]:border-primary-text aria-[current=location]:text-primary-text">{{ s.label }}</a>
                  </li>
                }
              </ul>
            </nav>
            <section id="programa" tabindex="-1" class="scroll-mt-16 outline-none">…</section>
          `),
        },
      ],
    },
    {
      id: 'scroll-spy',
      title: 'Scroll spy',
      html: `<ul>
        <li><strong>Regla:</strong> la sección activa es la última cuyo inicio ya pasó bajo las tabs (64 px desde arriba, más un margen). Arriba de todo, la primera.</li>
        <li><strong>Por qué no un observador por sección:</strong> una sección corta, como Docente, comparte la franja con la siguiente y el observador marca la que entró último. Medir la posición de cada sección al desplazar (una vez por cuadro) da siempre la correcta.</li>
        <li>En celular, la fila de tabs se desplaza para que la tab activa quede a la vista.</li>
        <li><code>aria-current="location"</code> en la tab activa; el estilo no depende solo del color (línea inferior de 3 px).</li>
      </ul>`,
      snippets: [
        {
          title: 'Sección activa',
          language: 'TypeScript',
          code: dedent(`
            readonly active = signal('informacion');

            constructor() {
              const destroyRef = inject(DestroyRef);
              afterNextRender(() => {
                const sections = this.sections.map((s) => document.getElementById(s.id)!);
                let frame = 0;
                const onScroll = () => {
                  cancelAnimationFrame(frame);
                  frame = requestAnimationFrame(() => {
                    const passed = sections.filter((el) => el.getBoundingClientRect().top <= 72);
                    this.active.set((passed.at(-1) ?? sections[0]).id);
                  });
                };
                window.addEventListener('scroll', onScroll, { passive: true });
                destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
              });
            }
          `),
        },
      ],
    },
  ],
  usedIn: [['Plantilla del Detalle de curso', 'plantillas/detalle-de-curso'], ['Tabs', 'componentes/tabs']],
};

/* ── Diálogos ───────────────────────────────────────────────────────────────── */

const dialogos: PatternDoc = {
  intro: `<p>Todo lo que se abre encima de la página es un <code>&lt;dialog&gt;</code> abierto con <code>showModal()</code>. El navegador atrapa el foco, cierra con Esc y deja inerte el resto de la página, sin código extra.</p>`,
  sections: [
    {
      id: 'reglas',
      title: 'Reglas',
      html: `<ul>
        <li><strong>Nombre:</strong> <code>aria-labelledby</code> al título del diálogo; si el título no se ve, <code>aria-label</code>.</li>
        <li><strong>Cerrar:</strong> botón con ícono <code>x</code> y <code>aria-label</code> («Cerrar filtros», «Cerrar menú»), Esc y, en ventanas centradas, clic fuera (<code>modal-backdrop</code>).</li>
        <li><strong>Foco al abrir:</strong> el primer elemento útil (el campo de búsqueda, el primer filtro). Si no se indica, el navegador enfoca el primer elemento enfocable.</li>
        <li><strong>Foco al cerrar:</strong> vuelve al botón que abrió el diálogo. El navegador lo hace solo; si ese botón ya no existe, moverlo a mano a un lugar lógico.</li>
        <li><strong>Página de atrás:</strong> no se desplaza mientras el diálogo está abierto (<code>overflow: hidden</code> en <code>&lt;html&gt;</code>; se quita en el evento <code>close</code>).</li>
        <li><strong>Sin ventanas de confirmación innecesarias:</strong> solo para acciones que no se pueden deshacer, como cancelar una inscripción.</li>
      </ul>`,
    },
    {
      id: 'hojas',
      title: 'Hojas a pantalla completa (celular)',
      html: `<p>Menú, «Mi cuenta», búsqueda y filtros del catálogo ocupan toda la pantalla en celular. Mismo <code>&lt;dialog&gt;</code>, con tres partes:</p>
      <ul>
        <li><strong>Encabezado fijo:</strong> título o logo y el botón de cerrar.</li>
        <li><strong>Contenido</strong> con desplazamiento propio (<code>min-h-0 flex-1 overflow-y-auto</code>).</li>
        <li><strong>Pie fijo</strong> con las acciones. En los filtros: «Limpiar» y «Ver N cursos». Los cambios se aplican con el botón principal; cerrar con la X o Esc los descarta.</li>
      </ul>`,
      snippets: [
        {
          title: 'Abrir y cerrar',
          language: 'TypeScript',
          code: dedent(`
            private readonly sheet = viewChild.required<ElementRef<HTMLDialogElement>>('hoja');

            open(): void {
              document.documentElement.style.overflow = 'hidden';
              this.sheet().nativeElement.showModal();
            }

            /** Evento close del <dialog> (X, Esc o acción): el navegador devuelve el foco al botón que lo abrió. */
            onClose(): void {
              document.documentElement.style.overflow = '';
            }
          `),
        },
        {
          title: 'Estructura',
          language: 'HTML',
          code: dedent(`
            <dialog #hoja aria-labelledby="filtros-titulo" (close)="onClose()"
                    class="m-0 flex h-dvh max-h-none w-full max-w-none flex-col border-0 bg-base-100 p-0 not-open:hidden">
              <div class="flex h-16 shrink-0 items-center justify-between border-b border-base-content/10 pr-2 pl-4">
                <h2 id="filtros-titulo" class="text-xl font-semibold">Filtros</h2>
                <button type="button" class="btn btn-ghost btn-square size-11" aria-label="Cerrar filtros" (click)="hoja.close()">…</button>
              </div>
              <div class="min-h-0 flex-1 overflow-y-auto px-4">…</div>
              <div class="flex shrink-0 gap-3 border-t border-base-content/10 p-4">…</div>
            </dialog>
          `),
        },
      ],
    },
    {
      id: 'daisyui',
      title: 'Detalle de daisyUI',
      html: `<p>La primera vez que se abre un <code>modal</code> de daisyUI, su transición de visibilidad todavía no termina y <code>focus()</code> no tiene efecto. Volver a enfocar en <code>transitionend</code>, como en el ejemplo de <a href="componentes/dialogo">Diálogo</a>.</p>`,
    },
  ],
  usedIn: [['Diálogo', 'componentes/dialogo'], ['Menú en celular', 'componentes/menu-movil'], ['Filtros', 'componentes/filtros'], ['Buscador', 'componentes/buscador']],
};

/* ── Formularios y errores ──────────────────────────────────────────────────── */

const formExample = dedent(`
  <form novalidate class="flex max-w-sm flex-col gap-4">
    <div role="alert" class="alert alert-error alert-soft items-start">
      ${icon('circle-alert', 20, 'mt-0.5 shrink-0')}
      <div>
        <p class="font-semibold">Revisa los 2 campos marcados</p>
        <ul class="mt-1 list-disc pl-5 text-sm">
          <li><a href="#ej-f-dpi" class="underline">DPI</a></li>
          <li><a href="#ej-f-correo" class="underline">Correo electrónico</a></li>
        </ul>
      </div>
    </div>
    <fieldset class="fieldset">
      <label class="fieldset-legend" for="ej-f-dpi">DPI</label>
      <input id="ej-f-dpi" class="input input-error w-full" inputmode="numeric" autocomplete="off" value="2345 67890" aria-invalid="true" aria-describedby="ej-f-dpi-error" />
      <p id="ej-f-dpi-error" class="label whitespace-normal text-error-text">El DPI debe tener 13 dígitos. Escribiste 9.</p>
    </fieldset>
    <fieldset class="fieldset">
      <label class="fieldset-legend" for="ej-f-correo">Correo electrónico</label>
      <input id="ej-f-correo" type="email" class="input input-error w-full" autocomplete="email" value="ana.lopez@" aria-invalid="true" aria-describedby="ej-f-correo-error" />
      <p id="ej-f-correo-error" class="label whitespace-normal text-error-text">Escribe el correo completo, por ejemplo nombre@institucion.gob.gt.</p>
    </fieldset>
    <button type="submit" class="btn btn-primary btn-lg w-full md:btn-md">Crear cuenta</button>
  </form>
`);

const formularios: PatternDoc = {
  intro: `<p>Reglas para todos los formularios de la plataforma: acceso, registro, completar perfil, inscripción y contacto. Los ajustes visuales del campo (borde, foco, error) ya están en <code>inap-components.css</code>; ver <a href="componentes/campos">Campos de texto</a>.</p>`,
  sections: [
    {
      id: 'campos',
      title: 'Campos',
      html: `<ul>
        <li><strong>Etiqueta visible arriba de cada campo.</strong> Sin etiquetas flotantes ni solo placeholder: el placeholder desaparece al escribir y no pasa el contraste mínimo.</li>
        <li><strong>Ayuda visible</strong> bajo el campo, unida con <code>aria-describedby</code> (formato, ejemplo). No en un tooltip.</li>
        <li><strong>Tipo y teclado:</strong> <code>type="email"</code>; números como el DPI con <code>inputmode="numeric"</code>, no <code>type="number"</code>.</li>
        <li><strong><code>autocomplete</code>:</strong> <code>email</code> o <code>username</code> en el correo, <code>current-password</code> al iniciar sesión, <code>new-password</code> al crear una contraseña, <code>given-name</code>, <code>family-name</code>, <code>tel</code>…</li>
        <li><strong>Contraseña:</strong> botón para mostrarla dentro del campo (<code>aria-label="Mostrar contraseña"</code>, <code>aria-pressed</code>). Requisitos visibles desde el inicio y marcados al escribir, con su estado en texto <code>sr-only</code>.</li>
        <li><strong>Fechas</strong> en DD/MM/AAAA con un ejemplo debajo; no el selector nativo, que en muchos equipos muestra mm/dd/yyyy.</li>
      </ul>`,
    },
    {
      id: 'errores',
      title: 'Validación y errores',
      html: `<ul>
        <li><strong>Se valida al enviar</strong>, no mientras se escribe.</li>
        <li><strong>El botón de enviar nunca está deshabilitado:</strong> deshabilitado no explica qué falta.</li>
        <li><strong>Resumen arriba</strong> con <code>role="alert"</code>: «Revisa los 2 campos marcados», con un enlace a cada campo.</li>
        <li><strong>Cada campo con error:</strong> <code>aria-invalid="true"</code>, borde <code>input-error</code> y mensaje en <code>error-text</code> unido con <code>aria-describedby</code>. El color no es la única señal: el mensaje está en texto.</li>
        <li><strong>Foco al primer campo con error.</strong></li>
        <li><strong>Los mensajes dicen cómo corregir:</strong> «El DPI debe tener 13 dígitos. Escribiste 9.», no «Campo inválido».</li>
        <li><strong>Errores del servicio</strong> (correo ya registrado, cuenta deshabilitada) van en el resumen con la salida: iniciar sesión, recuperar la contraseña o contactar.</li>
        <li><strong>Datos de acceso incorrectos:</strong> un solo mensaje que no dice cuál falló. Se conserva el correo y se borra la contraseña.</li>
      </ul>`,
      example: { title: 'Después de enviar con errores', previewClass: 'p-6', html: formExample },
      snippets: [
        {
          title: 'Enviar y enfocar el primer error',
          language: 'TypeScript',
          code: dedent(`
            readonly submitted = signal(false);

            submit(): void {
              this.submitted.set(true);
              if (this.form.invalid) {
                this.form.markAllAsTouched();
                // Después de pintar los mensajes: primero el resumen (role="alert"), luego el foco.
                setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
                return;
              }
              // …enviar
            }
          `),
        },
      ],
    },
    {
      id: 'pasos',
      title: 'Formularios en pasos',
      html: `<ul>
        <li>Progreso como lista ordenada: «Paso 1 de 2 · Tus datos», con <code>aria-current="step"</code> en el paso actual.</li>
        <li>«Continuar» valida solo el paso actual. «Regresar» conserva lo escrito.</li>
        <li>Al cambiar de paso, el foco pasa al título del paso.</li>
        <li>Sin ventanas de confirmación al terminar: la página siguiente ya confirma.</li>
      </ul>`,
    },
  ],
  usedIn: [['Pantallas › Acceso', 'pantallas/acceso'], ['Pantallas › Completar perfil', 'pantallas/completar-perfil'], ['Campos de texto', 'componentes/campos']],
};

/* ── Estados de inscripción ─────────────────────────────────────────────────── */

const ROWS: [string, string, string][] = [
  ['proximamente', 'Edición', 'Antes de la fecha de inicio de inscripciones.'],
  ['abierta', 'Edición', 'Entre las fechas de inscripción y con cupo.'],
  ['ultimoDia', 'Edición', 'El último día de inscripciones.'],
  ['cerrada', 'Edición', 'Después de la fecha de cierre.'],
  ['cupoLleno', 'Edición', 'Inscripción abierta, sin lugares.'],
  ['enCurso', 'Edición', 'Entre el inicio y el fin del curso. Provisional: depende de que la edición guarde esas fechas.'],
  ['inscrito', 'Usuario', 'Inscrito y con el pago completo.'],
  ['saldo', 'Usuario', 'Inscrito con una cuota pendiente.'],
  ['aprobado', 'Usuario', 'Curso aprobado.'],
];

const estadosDeInscripcion: PatternDoc = {
  intro: `<p>La tarjeta de inscripción del detalle de curso, y la barra que la repite en celular, cambian según el estado de la edición y del usuario. Cada estado tiene un solo texto de estado, una sola acción principal y, si aplica, el precio.</p>`,
  sections: [
    {
      id: 'estados',
      title: 'Estados',
      html: `<p>Abierta y Próximamente se calculan con las fechas de la edición; no son un estado guardado (respuesta del equipo de desarrollo, 13 nov. 2026). Si el usuario inició sesión y está inscrito en la edición, su estado reemplaza al de la edición.</p>
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th scope="col">Estado</th><th scope="col">De</th><th scope="col">Cuándo</th><th scope="col">Acción principal</th><th scope="col">Barra</th></tr></thead>
        <tbody>${ROWS.map(([k, from, when]) => {
          const s = STATES[k];
          return `<tr><td>${s.badge}</td><td>${from}</td><td>${when}</td><td>${s.action} (${s.kind === 'solid' ? 'sólido' : 'contorno'}, ${s.link ? 'enlace' : 'botón'})</td><td>${s.barAction}</td></tr>`;
        }).join('')}</tbody>
      </table></div>
      <p>Para verlos en la página completa, usen el selector «Estado» de la <a href="plantillas/detalle-de-curso">plantilla del Detalle de curso</a>.</p>`,
    },
    {
      id: 'reglas',
      title: 'Reglas',
      html: `<ul>
        <li><strong>Una sola acción principal.</strong> «Ver programa» y «Compartir» siempre van como botones secundarios.</li>
        <li><strong>Nunca deshabilitada.</strong> Cerrada y Cupo lleno ofrecen «Avisarme de la próxima edición»; En curso, «Ver próximas ediciones».</li>
        <li><strong>Enlace o botón:</strong> enlace si lleva a otra página (Inscribirme, Ir al Aula Virtual, Pagar cuota); botón si actúa en la misma (Avisarme).</li>
        <li><strong>Otra edición:</strong> con Cerrada, Cupo lleno y En curso, si hay otra edición abierta o próxima, se agrega el aviso de edición bajo la tarjeta.</li>
        <li><strong>Precio:</strong> solo antes de inscribirse; con saldo pendiente, el monto de la cuota. Inscrito y Aprobado no muestran precio.</li>
        <li><strong>Estado en texto:</strong> el Status Badge dice el estado; el punto de color solo lo refuerza.</li>
      </ul>`,
      example: {
        title: 'Abierta, Cupo lleno y Saldo pendiente',
        previewClass: 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] items-start gap-6 p-6',
        html: [STATES['abierta'], STATES['cupoLleno'], STATES['saldo']].map(enrollmentCard).join('\n\n'),
      },
    },
  ],
  usedIn: [['Tarjeta de inscripción', 'componentes/tarjeta-de-inscripcion'], ['Ediciones', 'componentes/ediciones'], ['Plantilla del Detalle de curso', 'plantillas/detalle-de-curso']],
};

/* ── Filtros del catálogo ───────────────────────────────────────────────────── */

const filtrosDelCatalogo: PatternDoc = {
  intro: `<p>Una sola página de catálogo con filtros, en lugar de una página por tipo y otra por área. Los filtros, el orden y la página van en la URL, así un enlace con filtros se puede compartir y Atrás deshace el último cambio. Decidido el 3 nov. 2026.</p>`,
  sections: [
    {
      id: 'url',
      title: 'Estado en la URL',
      html: `<ul>
        <li>Parámetros: <code>tipo</code>, <code>nivel</code>, <code>area</code>, <code>modalidad</code>, <code>inscripcion</code> (pueden repetirse), <code>orden</code> y <code>pagina</code>. Ejemplo: <code>?tipo=certificacion&amp;inscripcion=abierta&amp;pagina=2</code>.</li>
        <li>Valores por defecto fuera de la URL: sin filtros, «Próximos a iniciar» y página 1.</li>
        <li>Cambiar un filtro o el orden vuelve a la página 1.</li>
        <li>Los enlaces que hoy son páginas por tipo (<code>/categoria/…</code>) o por área (<code>/area-formacion/…</code>) abren el catálogo con el filtro marcado; el título, la descripción y el breadcrumb cambian al del tipo o área.</li>
        <li>Opciones y conteos vienen de los datos, nunca fijos en el código. El conteo de cada opción es el total del catálogo y no cambia al marcar otros filtros.</li>
      </ul>`,
      snippets: [
        {
          title: 'Leer y cambiar filtros',
          language: 'TypeScript',
          code: dedent(`
            private readonly route = inject(ActivatedRoute);
            private readonly router = inject(Router);

            readonly selected = toSignal(this.route.queryParamMap.pipe(
              map((q) => Object.fromEntries(GROUPS.map((g) => [g.key, q.getAll(g.key)]))),
            ), { requireSync: true });

            toggle(key: string, value: string, checked: boolean): void {
              const current = this.selected()[key];
              const next = checked ? [...current, value] : current.filter((v) => v !== value);
              this.router.navigate([], { queryParams: { [key]: next, pagina: null }, queryParamsHandling: 'merge' });
            }
          `),
        },
      ],
    },
    {
      id: 'escritorio-celular',
      title: 'Escritorio y celular',
      html: `<ul>
        <li><strong>Desde 1024 px:</strong> columna de filtros a la izquierda; se aplican al marcar.</li>
        <li><strong>Menos de 1024 px:</strong> botón «Filtros (N)» que abre una hoja a pantalla completa. Los cambios se aplican con «Ver N cursos», que se recalcula al marcar; la X y Esc los descartan. Ver <a href="patrones/dialogos">Diálogos</a>.</li>
        <li><strong>Filtros activos:</strong> una etiqueta por filtro («Quitar filtro: Inscripción abierta») y «Limpiar filtros». En celular la fila se desplaza en horizontal.</li>
        <li><strong>Paginación:</strong> 9 cursos por página en escritorio y 6 en celular.</li>
        <li><strong>Sin resultados:</strong> el estado vacío con «Limpiar filtros»; el conteo y las etiquetas siguen a la vista para corregir.</li>
      </ul>`,
      example: {
        title: 'Grupo de filtros y filtros activos',
        previewClass: 'grid gap-6 p-6 md:grid-cols-[18rem_1fr] md:items-start',
        html: [
          filterGroup('ej-pf', { key: 'inscripcion', title: 'Inscripción', options: [['abierta', 'Abierta', 10], ['proximamente', 'Próximamente', 14]] }, ['abierta']),
          activeFilters([['Cursos con opción a certificación', 'tipo:certificacion'], ['Inscripción abierta', 'inscripcion:abierta']]),
        ].join('\n'),
      },
    },
    {
      id: 'foco-anuncios',
      title: 'Foco y anuncios',
      html: `<ul>
        <li><strong>Marcar un filtro:</strong> el foco se queda en el checkbox. El conteo («14 cursos») es <code>role="status"</code> y se anuncia solo.</li>
        <li><strong>Quitar una etiqueta, limpiar o cambiar de página:</strong> el foco pasa al encabezado de resultados (<code>tabindex="-1"</code>), porque el botón pulsado desaparece o la lista cambia.</li>
        <li><strong>El cambio de URL no mueve el foco a <code>&lt;main&gt;</code></strong>: es la misma pantalla (ver <a href="patrones/cambio-de-ruta">Título y foco al cambiar de ruta</a>).</li>
      </ul>`,
    },
  ],
  usedIn: [['Plantilla del Catálogo', 'plantillas/catalogo'], ['Filtros', 'componentes/filtros'], ['Paginación', 'componentes/paginacion'], ['Estado vacío', 'componentes/estado-vacio']],
};

/** Contenido por slug de página (navigation.ts). */
export const PATTERN_DOCS: Record<string, PatternDoc> = {
  'estructura-de-pagina': estructuraDePagina,
  'cambio-de-ruta': cambioDeRuta,
  'visibilidad-al-desplazar': visibilidadAlDesplazar,
  anclas,
  dialogos,
  formularios,
  'estados-de-inscripcion': estadosDeInscripcion,
  'filtros-del-catalogo': filtrosDelCatalogo,
};
