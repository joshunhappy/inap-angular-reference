import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

/** Miniatura con foto o ilustración, compartida por la miniatura y la tarjeta de curso. */
const thumbPhoto = (badge: string) => dedent(`
  <div class="relative aspect-video overflow-hidden">
    <img src="images/cursos/gestion-financiera.png" alt="" class="size-full object-cover" />
    <span class="absolute top-4 left-4 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-inap-brand-navy">${badge}</span>
  </div>
`);

const thumbIllustration = (badge: string, area: string) => dedent(`
  <div class="relative aspect-video overflow-hidden bg-brand-surface">
    <div class="absolute -top-22 -right-22 size-55 rounded-full bg-inap-brand-cyan/55 blur-2xl" aria-hidden="true"></div>
    <div class="absolute -bottom-30 -left-20 size-60 rounded-full bg-inap-brand-blue/90 blur-2xl" aria-hidden="true"></div>
    <span class="absolute top-4 left-4 rounded-full bg-brand-surface-line px-2.5 py-1 text-xs font-semibold text-brand-surface-content">${badge}</span>
    <span class="absolute bottom-5 left-5 text-brand-surface-content">${icon(area, 44)}</span>
  </div>
`);

const courseCard = (thumb: string, title: string, area: string) => dedent(`
  <article class="group relative flex h-full flex-col overflow-hidden rounded-box border border-base-content/10 bg-base-2 shadow-sm transition
                  hover:border-primary-text hover:shadow-lg has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary-text">
    ${thumb.replace(/\n/g, '\n    ')}
    <div class="flex flex-1 flex-col gap-2.5 px-4 pt-4 pb-5">
      <h3 class="line-clamp-3 text-base leading-6 font-semibold text-base-content group-hover:text-primary-text">
        <a href="#" class="after:absolute after:inset-0 focus-visible:outline-none">${title}</a>
      </h3>
      <p class="flex-1 text-sm text-neutral-text">${area}</p>
      <ul class="flex gap-4 border-t border-base-content/10 pt-2.5 text-xs text-neutral-text">
        <li class="flex items-center gap-1.5">${icon('clock', 16)}<span class="sr-only">Duración:</span> 6 semanas</li>
        <li class="flex items-center gap-1.5">${icon('monitor', 16)}<span class="sr-only">Modalidad:</span> Virtual</li>
      </ul>
    </div>
  </article>
`);

export const tarjetaDeCurso: ComponentDoc = {
  figmaNode: '61-129',
  intro: `<p>Tarjeta del catálogo, de los resultados de búsqueda y de los cursos destacados del Home. Toda la tarjeta lleva al detalle del curso, con un solo enlace en el título.</p>`,
  examples: [
    {
      title: 'Con foto y con ilustración',
      description: 'Sin foto del curso, la miniatura usa la ilustración de marca con el ícono del área. Pasen el cursor o lleguen con Tab para ver los estados.',
      previewClass: 'grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3',
      html: [
        courseCard(thumbPhoto('Con certificación'), 'Curso y Certificación en Gestión Financiera — Nivel Intermedio', 'Finanzas públicas y calidad del gasto'),
        courseCard(thumbIllustration('Diplomado', 'banknote'), 'Diplomado en Presupuesto por Resultados', 'Finanzas públicas y calidad del gasto'),
      ].join('\n\n'),
    },
  ],
  usage: {
    html: `<ul>
      <li>Título de 2 a 3 líneas como máximo (<code>line-clamp-3</code>). El texto completo está en el detalle.</li>
      <li>Datos fijos de la tarjeta: tipo de curso (en la miniatura), título, área, duración y modalidad. Vienen de los datos del curso.</li>
      <li>En una cuadrícula, todas las tarjetas de una fila tienen la misma altura (<code>h-full</code>); el área empuja la fila de datos hacia abajo.</li>
      <li>Hover: borde y título en <code>primary-text</code>, sombra <code>shadow-lg</code>. Foco: anillo de 2 px en <code>primary-text</code> alrededor de toda la tarjeta.</li>
    </ul>`,
    doDont: [
      {
        doText: 'Un solo enlace, en el título, que cubre la tarjeta con after:absolute.',
        dontText: 'Envolver toda la tarjeta en un enlace con botones u otros enlaces dentro.',
        doHtml: `<a href="#" class="font-semibold text-primary-text underline">Curso de Gestión Financiera</a>`,
        dontHtml: `<span class="text-sm">&lt;a&gt; … &lt;a&gt;Ver más&lt;/a&gt; … &lt;/a&gt;</span>`,
      },
    ],
  },
  a11y: `<ul>
    <li><strong>Un solo enlace:</strong> el lector de pantalla anuncia el título como nombre del enlace. El pseudo-elemento <code>after:absolute after:inset-0</code> hace clicable toda la tarjeta sin repetir el enlace.</li>
    <li><strong>Encabezado:</strong> el título es <code>&lt;h3&gt;</code> (o el nivel que siga al de la sección), para poder saltar de curso en curso.</li>
    <li><strong>Foco:</strong> el anillo se dibuja en la tarjeta con <code>has-[a:focus-visible]</code>; el enlace no muestra el suyo.</li>
    <li><strong>Datos:</strong> los íconos son decorativos (<code>aria-hidden</code>). «Duración:» y «Modalidad:» van en <code>sr-only</code>, porque sin el ícono «6 semanas» y «Virtual» no se entienden.</li>
    <li><strong>Imagen:</strong> <code>alt=""</code>, porque el título ya dice de qué es el curso.</li>
    <li><strong>Contraste:</strong> título en <code>base-content</code>, área y datos en <code>neutral-text</code>; las dos pasan 4.5:1 en <code>base-2</code>.</li>
  </ul>`,
  classes: [
    ['relative … rounded-box bg-base-2 border-base-content/10 shadow-sm', 'Contenedor (<code>&lt;article&gt;</code>).'],
    ['hover:border-primary-text hover:shadow-lg', 'Hover.'],
    ['has-[a:focus-visible]:outline-2 …:outline-primary-text', 'Anillo de foco en toda la tarjeta.'],
    ['group-hover:text-primary-text', 'Título en hover.'],
    ['after:absolute after:inset-0', 'En el enlace: hace clicable toda la tarjeta.'],
    ['line-clamp-3', 'Título de 3 líneas como máximo.'],
  ],
  codeNotes: `<p>En Angular, la tarjeta es un componente con entradas para cada dato (<code>title</code>, <code>area</code>, <code>type</code>, <code>duration</code>, <code>modality</code>, <code>image</code>, <code>link</code>). Si <code>image</code> no viene, se usa la ilustración.</p>`,
};

export const miniaturaDeCurso: ComponentDoc = {
  figmaNode: '117-4763',
  intro: `<p>Imagen 16:9 de la tarjeta y del detalle de curso, con una insignia del tipo de curso: «Con certificación», «Curso», «Diplomado» o «Posgrado».</p>`,
  examples: [
    {
      title: 'Foto',
      description: 'Imagen del curso. La insignia es blanca con texto navy, igual en los dos temas.',
      previewClass: 'p-6 [&>*]:max-w-sm',
      html: thumbPhoto('Con certificación'),
    },
    {
      title: 'Ilustración',
      description: 'Respaldo cuando el curso no tiene imagen: fondo navy, brillos de marca y el ícono del área de formación.',
      previewClass: 'p-6 [&>*]:max-w-sm',
      html: thumbIllustration('Con certificación', 'banknote'),
    },
  ],
  usage: {
    html: `<ul>
      <li>Proporción fija 16:9 (<code>aspect-video</code>) y <code>object-cover</code>: la foto se recorta, nunca se deforma.</li>
      <li>La ilustración no es una imagen: es HTML con los colores de marca fijos (<code>inap-brand-cyan</code>, <code>inap-brand-blue</code>), así que no hay que generar un archivo por curso.</li>
      <li>El ícono de la ilustración es el del área de formación y viene de los datos (nombre de Lucide).</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Texto alternativo:</strong> <code>alt=""</code> en la tarjeta, porque el título está al lado. En el detalle de curso también, salvo que la foto muestre algo que el texto no dice.</li>
    <li><strong>Insignia:</strong> es texto real, se lee antes del título. Blanco sobre navy y navy sobre blanco pasan 4.5:1.</li>
    <li><strong>Brillos e ícono:</strong> decorativos, con <code>aria-hidden="true"</code>.</li>
  </ul>`,
  classes: [
    ['relative aspect-video overflow-hidden', 'Contenedor.'],
    ['size-full object-cover', 'Foto.'],
    ['bg-white text-inap-brand-navy', 'Insignia sobre foto (fija).'],
    ['bg-brand-surface', 'Fondo de la ilustración.'],
    ['bg-brand-surface-line text-brand-surface-content', 'Insignia sobre la ilustración.'],
    ['bg-inap-brand-cyan/55 blur-2xl, bg-inap-brand-blue/90 blur-2xl', 'Brillos.'],
  ],
};

export const etiquetasYEstados: ComponentDoc = {
  figmaNode: '59-34',
  intro: `<p>Dos alias de <a href="componentes/badge">Badge</a> suave para el sitio. <strong>Tag</strong> nombra el tipo, el área o una categoría. <strong>Status Badge</strong> dice el estado de una edición o de una inscripción, con un punto de color que lo refuerza.</p>`,
  examples: [
    {
      title: 'Tag',
      description: 'Primary, Accent y Neutral. Alto de 24 px, texto Label/Small (12 px, semibold).',
      html: dedent(`
        <span class="badge badge-soft badge-primary text-xs font-semibold">Etiqueta</span>
        <span class="badge badge-soft badge-accent text-xs font-semibold">Etiqueta</span>
        <span class="badge badge-soft text-xs font-semibold">Etiqueta</span>
      `),
    },
    {
      title: 'Status Badge',
      description: 'Fondo neutro y texto base-content en todos los tonos; solo cambia el punto.',
      html: [
        // Clases completas: Tailwind no genera clases armadas con variables.
        ['bg-success-text', 'Inscripción abierta'],
        ['bg-info-text', 'En curso'],
        ['bg-warning-text', 'Último día'],
        ['bg-error-text', 'Cupo lleno'],
        ['bg-neutral-text', 'Cerrada'],
      ]
        .map(([dot, label]) => `<span class="badge badge-soft gap-1.5 pr-2.5 pl-2 text-xs font-semibold"><span class="size-2 rounded-full ${dot}" aria-hidden="true"></span>${label}</span>`)
        .join('\n'),
    },
  ],
  usage: {
    html: `<ul>
      <li>Tag: una a tres palabras. Si al pulsarlo quita un filtro, es un botón (Filter Tag), no un Tag.</li>
      <li>Status Badge: el texto dice el estado («Cupo lleno»), el punto solo lo refuerza.</li>
      <li>Tonos del punto: <code>success</code> abierta, <code>info</code> en curso o inscrito, <code>warning</code> último día o saldo pendiente, <code>error</code> cupo lleno, <code>neutral</code> cerrada.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>No interactivos:</strong> <code>&lt;span&gt;</code>.</li>
    <li><strong>Color:</strong> el punto es decorativo (<code>aria-hidden</code>); el estado está en el texto, que es <code>base-content</code> sobre fondo neutro opaco.</li>
    <li><strong>Punto:</strong> en <code>{tono}-text</code>, que pasa 3:1 sobre el fondo, como los íconos.</li>
    <li><strong>Tag:</strong> texto en <code>primary-text</code> y <code>accent-text</code> (ya en <code>inap-components.css</code>).</li>
  </ul>`,
  classes: [
    ['badge badge-soft badge-primary | badge-accent', 'Tag de color.'],
    ['badge badge-soft', 'Tag neutro y fondo de Status Badge.'],
    ['text-xs font-semibold', 'Label/Small.'],
    ['size-2 rounded-full bg-{tono}-text', 'Punto del Status Badge.'],
  ],
};

export const chip: ComponentDoc = {
  figmaNode: '59-41',
  intro: `<p>Opción en forma de píldora. Como filtro se activa y desactiva (<code>aria-pressed</code>); como acceso rápido es un enlace. Seleccionado usa <code>secondary</code>: navy en claro, azul claro en oscuro.</p>`,
  examples: [
    {
      title: 'Filtros',
      description: 'Sin seleccionar y seleccionado. El estado sale del atributo aria-pressed, no de una clase.',
      html: [
        ['false', 'Virtual'],
        ['true', 'Presencial'],
        ['false', 'Híbrido'],
      ]
        .map(
          ([pressed, label]) => dedent(`
            <button type="button" aria-pressed="${pressed}" class="group inline-flex h-9 items-center gap-1.5 rounded-full border border-base-border px-4 text-sm font-medium text-base-content transition-colors
                    hover:border-base-content hover:bg-base-content/10 aria-pressed:border-secondary aria-pressed:bg-secondary aria-pressed:text-secondary-content">
              <span class="hidden group-aria-pressed:inline">${icon('check', 16)}</span>${label}
            </button>
          `),
        )
        .join('\n'),
    },
    {
      title: 'Enlaces',
      description: 'Accesos rápidos, por ejemplo a un área del catálogo.',
      html: ['Finanzas públicas', 'Gestión pública', 'Ética y transparencia']
        .map((l) => `<a href="#" class="inline-flex h-9 items-center rounded-full border border-base-border px-4 text-sm font-medium text-base-content transition-colors hover:border-base-content hover:bg-base-content/10">${l}</a>`)
        .join('\n'),
    },
  ],
  usage: {
    html: `<ul>
      <li>Filtro: <code>&lt;button aria-pressed&gt;</code>. Enlace: <code>&lt;a&gt;</code>. Nunca un <code>&lt;div&gt;</code> con <code>(click)</code>.</li>
      <li>Alto de 36 px en escritorio. En celular, el área táctil llega a 44 px con el espacio entre chips (<code>gap-2</code> en una fila que se envuelve).</li>
      <li>El ícono <code>check</code> solo aparece seleccionado, para que no dependa solo del color.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Estado:</strong> <code>aria-pressed="true|false"</code>; el lector anuncia «Presencial, botón de alternancia, presionado».</li>
    <li><strong>Grupo:</strong> varios chips que filtran lo mismo van en un <code>&lt;div role="group" aria-label="Modalidad"&gt;</code>.</li>
    <li><strong>Contraste:</strong> borde <code>base-border</code> 3:1 o más; texto <code>base-content</code>; seleccionado <code>secondary-content</code> sobre <code>secondary</code>, 4.5:1 en los dos temas.</li>
    <li><strong>Foco:</strong> anillo global de 2 px en <code>primary-text</code>.</li>
  </ul>`,
  classes: [
    ['inline-flex h-9 rounded-full border border-base-border px-4 text-sm font-medium', 'Base.'],
    ['hover:border-base-content hover:bg-base-content/10', 'Hover.'],
    ['aria-pressed:bg-secondary aria-pressed:text-secondary-content aria-pressed:border-secondary', 'Seleccionado.'],
    ['hidden group-aria-pressed:inline', 'Ícono check, solo seleccionado.'],
  ],
};
