import { dedent } from '../../core/dedent';
import { statusBadge } from './sitio-cursos';
import { ComponentDoc, icon } from './types';

/* ── Fact Row ──────────────────────────────────────────────────────────────── */

/** Dato del curso dentro de un <dl>. El ícono va dentro del <dt> para respetar la estructura de la lista. */
const factRow = (iconName: string, label: string, value: string, helper = '') => dedent(`
  <div class="relative pl-7">
    <dt class="text-xs text-neutral-text"><span class="absolute top-0 left-0 text-neutral-text">${icon(iconName, 16)}</span>${label}</dt>
    <dd class="mt-0.5 text-sm font-medium text-base-content">${value}</dd>${helper ? `\n    <dd class="text-sm text-neutral-text">${helper}</dd>` : ''}
  </div>
`);

/* ── Enrollment Card y Enrollment Bar ──────────────────────────────────────── */

interface EnrollmentState {
  dot: string;
  badge: string;
  note: string;
  price?: [string, string];
  action: string;
  /** solid = btn-primary; outline = btn-outline btn-primary. */
  kind: 'solid' | 'outline';
  /** true si la acción navega (enlace); false si hace algo en la página (botón). */
  link: boolean;
  bar: [string, string];
  barAction: string;
}

const STATES: Record<string, EnrollmentState> = {
  proximamente: { dot: 'bg-info-text', badge: 'Próximamente', note: 'Inscripciones desde el 24/08/2026', price: ['Q200.00', 'en 2 cuotas'], action: 'Avisarme cuando abra', kind: 'solid', link: false, bar: ['Q200.00', 'Abre el 24/08 · 2 cuotas'], barAction: 'Avisarme' },
  abierta: { dot: 'bg-success-text', badge: 'Inscripción abierta', note: 'Cierra el 27/10/2026', price: ['Q200.00', 'en 2 cuotas'], action: 'Inscribirme', kind: 'solid', link: true, bar: ['Q200.00', 'Cierra el 27/10 · 2 cuotas'], barAction: 'Inscribirme' },
  ultimoDia: { dot: 'bg-warning-text', badge: '¡Último día para inscribirte!', note: 'Cierra hoy a las 23:59', price: ['Q200.00', 'en 2 cuotas'], action: 'Inscribirme', kind: 'solid', link: true, bar: ['Q200.00', '¡Cierra hoy! · 2 cuotas'], barAction: 'Inscribirme' },
  cerrada: { dot: 'bg-error-text', badge: 'Inscripción cerrada', note: 'Terminó el 27/10/2026. Te avisamos cuando abra la próxima edición.', price: ['Q200.00', 'en 2 cuotas'], action: 'Avisarme de la próxima edición', kind: 'outline', link: false, bar: ['Q200.00', 'Inscripción cerrada · 2 cuotas'], barAction: 'Avisarme' },
  cupoLleno: { dot: 'bg-error-text', badge: 'Cupo lleno', note: 'Ya no hay lugares disponibles en esta edición.', price: ['Q200.00', 'en 2 cuotas'], action: 'Avisarme de la próxima edición', kind: 'outline', link: false, bar: ['Q200.00', 'Cupo lleno · 2 cuotas'], barAction: 'Avisarme' },
  enCurso: { dot: 'bg-neutral-text', badge: 'En curso', note: 'Inició el 27/08/2026 y termina el 05/09/2026.', price: ['Q200.00', 'en 2 cuotas'], action: 'Ver próximas ediciones', kind: 'outline', link: true, bar: ['Q200.00', 'En curso · 2 cuotas'], barAction: 'Ver ediciones' },
  inscrito: { dot: 'bg-info-text', badge: 'Estás inscrito', note: 'El curso inicia el 27/08/2026. Recibirás el acceso por correo.', action: 'Ir al Aula Virtual', kind: 'solid', link: true, bar: ['Estás inscrito', 'Inicia el 27/08'], barAction: 'Ir al Aula Virtual' },
  saldo: { dot: 'bg-warning-text', badge: 'Saldo pendiente', note: 'Tienes una cuota pendiente. Al pagarla se habilita tu acceso al Aula Virtual.', price: ['Q100.00', 'cuota 2 de 2'], action: 'Pagar cuota pendiente', kind: 'solid', link: true, bar: ['Saldo pendiente', 'Cuota 2 de 2 · Q100.00'], barAction: 'Pagar cuota' },
  aprobado: { dot: 'bg-success-text', badge: 'Curso aprobado', note: 'Aprobaste el curso el 05/09/2026. Tu diploma ya está disponible.', action: 'Descargar diploma', kind: 'solid', link: true, bar: ['Curso aprobado', 'Diploma disponible'], barAction: 'Descargar diploma' },
};

const actionButton = (s: EnrollmentState, label: string, extra = '') => {
  const cls = `btn ${s.kind === 'solid' ? 'btn-primary' : 'btn-outline btn-primary'}${extra ? ' ' + extra : ''}`;
  return s.link ? `<a href="#" class="${cls}">${label}</a>` : `<button type="button" class="${cls}">${label}</button>`;
};

const enrollmentCard = (s: EnrollmentState) => dedent(`
  <section aria-label="Inscripción" class="flex flex-col gap-5 rounded-2xl border border-base-content/10 bg-base-2 p-6 shadow-lg">
    <div class="flex flex-col items-start gap-2">
      ${statusBadge(s.dot, s.badge)}
      <p class="text-sm text-neutral-text">${s.note}</p>
    </div>${s.price ? `
    <p class="flex items-baseline gap-2"><span class="text-3xl font-semibold text-base-content">${s.price[0]}</span><span class="text-sm text-neutral-text">${s.price[1]}</span></p>` : ''}
    <div class="flex flex-col gap-3">
      ${actionButton(s, s.action, 'w-full')}
      <div class="flex flex-wrap gap-2">
        <a href="#programa" class="btn btn-ghost flex-1 border-base-content/20 whitespace-nowrap">Ver programa</a>
        <button type="button" class="btn btn-ghost flex-1 border-base-content/20 whitespace-nowrap">Compartir</button>
      </div>
    </div>
    <dl class="flex flex-col gap-3">
      ${factRow('calendar', 'Inscripciones', '24/08/2026 – 27/10/2026').replace(/\n/g, '\n      ')}
      ${factRow('calendar', 'Período del curso', '27/08/2026 – 05/09/2026').replace(/\n/g, '\n      ')}
    </dl>
    <hr class="border-base-content/10" />
    <dl class="flex flex-col gap-3">
      ${factRow('monitor', 'Modalidad', 'Presencial · Sede Central', 'El aprendizaje se realizará presencialmente en la sede indicada.').replace(/\n/g, '\n      ')}
      ${factRow('clock', 'Duración', '40 horas · máximo 2 meses').replace(/\n/g, '\n      ')}
      ${factRow('award', 'Certificación', 'Curso con opción a certificación').replace(/\n/g, '\n      ')}
    </dl>
    <p class="text-xs text-neutral-text">Código 011-10-02-26 · ¿Dudas? 2419-8141</p>
  </section>
`);

const enrollmentBar = (s: EnrollmentState) => dedent(`
  <div class="flex items-center gap-3 border-t border-base-content/10 bg-base-2 px-4 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgb(0_0_0/0.08)]">
    <p class="flex min-w-0 flex-1 flex-col">
      <span class="text-lg font-semibold text-base-content">${s.bar[0]}</span>
      <span class="text-xs text-neutral-text">${s.bar[1]}</span>
    </p>
    ${actionButton(s, s.barAction, 'shrink-0')}
  </div>
`);

const stateRows: [string, EnrollmentState, string][] = [
  ['Próximamente', STATES['proximamente'], 'Por fechas de inscripción.'],
  ['Abierta', STATES['abierta'], ''],
  ['Último día', STATES['ultimoDia'], 'Abierta, el último día.'],
  ['Cerrada', STATES['cerrada'], ''],
  ['Cupo lleno', STATES['cupoLleno'], 'Solo con inscripción abierta.'],
  ['En curso', STATES['enCurso'], '<strong>Provisional:</strong> depende de que la edición guarde las fechas del curso.'],
  ['Inscrito', STATES['inscrito'], 'Estado del usuario. Sin precio.'],
  ['Saldo pendiente', STATES['saldo'], 'Sin acceso al Aula Virtual hasta pagar.'],
  ['Aprobado', STATES['aprobado'], 'Sin precio.'],
];

export const tarjetaDeInscripcion: ComponentDoc = {
  figmaNode: '288-1340',
  intro: `<p>Tarjeta con la acción principal del detalle de curso. En escritorio va fija en la columna derecha; en celular va bajo la imagen, y la <strong>Enrollment Bar</strong> repite la acción abajo cuando la tarjeta sale de la vista. Lo que muestran cambia según el estado de la edición y del usuario.</p>`,
  examples: [
    {
      title: 'Tarjeta en tres estados',
      description: 'Abierta (acción principal sólida), Cupo lleno (acción de contorno) y Saldo pendiente (precio de la cuota). Los nueve estados están en la pestaña Uso.',
      previewClass: 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] items-start gap-6 p-6',
      html: [STATES['abierta'], STATES['cupoLleno'], STATES['saldo']].map(enrollmentCard).join('\n\n'),
    },
    {
      title: 'Barra de inscripción (celular)',
      description: 'En la página va con sticky bottom-0 y solo en celular. El relleno inferior respeta el área segura del dispositivo.',
      previewClass: 'flex flex-col gap-4 p-6 [&>*]:max-w-sm',
      html: [STATES['abierta'], STATES['cupoLleno'], STATES['inscrito']].map(enrollmentBar).join('\n\n'),
    },
  ],
  usage: {
    html: `<p>Estados según la plataforma (respuesta del equipo de desarrollo, 26 oct.): por fechas de inscripción (Próximamente, Abierta, Último día, Cerrada) y por cupo (Cupo lleno). Los tres últimos son del usuario.</p>
    <div class="doc-table-wrap"><table class="doc-table">
      <thead><tr><th>Estado</th><th>Status Badge</th><th>Acción principal</th><th>Barra</th><th>Nota</th></tr></thead>
      <tbody>${stateRows
        .map(([name, s, note]) => `<tr><td>${name}</td><td>${s.badge} (<code>${s.dot.replace('bg-', '')}</code>)</td><td>${s.action} (${s.kind === 'solid' ? 'sólido' : 'contorno'})</td><td>${s.barAction}</td><td>${note}</td></tr>`)
        .join('')}</tbody>
    </table></div>
    <ul>
      <li>Una sola acción principal. «Ver programa» (enlace al ancla del programa) y «Compartir» siempre van como botones fantasma con borde.</li>
      <li>Fechas y modalidad usan <a href="componentes/datos-del-curso">Fact Row</a>. El texto de apoyo de la modalidad es visible, no un tooltip.</li>
      <li>La barra aparece solo cuando la tarjeta sale de la vista, para no repetir la acción en la primera pantalla. Ver <a href="patrones/visibilidad-al-desplazar">Mostrar u ocultar al desplazar</a>.</li>
      <li>Si existe otra edición abierta o próxima, en Cerrada, Cupo lleno y En curso se agrega el <a href="componentes/ediciones">Aviso de edición</a>.</li>
    </ul>`,
    doDont: [
      {
        doText: 'Enlace si la acción lleva a otra página (Inscribirme, Ir al Aula Virtual); botón si actúa en la misma (Avisarme, Compartir).',
        dontText: 'Deshabilitar la acción en Cerrada o Cupo lleno. Ofrecer una alternativa: avisar de la próxima edición.',
        doHtml: `<a href="#" class="btn btn-primary">Inscribirme</a>`,
        dontHtml: `<button type="button" class="btn btn-primary" disabled>Inscribirme</button>`,
      },
    ],
  },
  a11y: `<ul>
    <li><strong>Región:</strong> <code>&lt;section aria-label="Inscripción"&gt;</code>, para llegar a ella desde la lista de regiones del lector de pantalla.</li>
    <li><strong>Estado:</strong> lo dice el texto del Status Badge; el punto es decorativo.</li>
    <li><strong>Datos:</strong> <code>&lt;dl&gt;</code> con <code>&lt;dt&gt;</code> (etiqueta) y <code>&lt;dd&gt;</code> (valor); el lector anuncia «Modalidad: Presencial · Sede Central». Íconos con <code>aria-hidden</code>.</li>
    <li><strong>Barra:</strong> al aparecer no recibe el foco ni se anuncia; es un atajo visual a una acción que ya está en la tarjeta. Mientras está visible, la página reserva su alto abajo para no tapar contenido.</li>
    <li><strong>Botones fantasma:</strong> borde <code>base-content/20</code>; se reconocen por el texto, no por el borde.</li>
  </ul>`,
  classes: [
    ['rounded-2xl border border-base-content/10 bg-base-2 p-6 shadow-lg', 'Tarjeta.'],
    ['btn btn-primary w-full | btn btn-outline btn-primary w-full', 'Acción principal.'],
    ['btn btn-ghost flex-1 border-base-content/20 whitespace-nowrap', 'Acciones secundarias.'],
    ['text-3xl font-semibold', 'Precio.'],
    ['sticky bottom-0 z-10 lg:hidden', 'Barra, en la página.'],
    ['pb-[max(1.75rem,env(safe-area-inset-bottom))]', 'Barra: área segura del celular.'],
    ['shadow-[0_-4px_16px_rgb(0_0_0/0.08)]', 'Barra: sombra hacia arriba.'],
  ],
  codeNotes: `<p>En Angular, un componente <code>enrollment-card</code> con una entrada <code>state</code> y los datos de la edición; la barra usa el mismo estado. Los textos de cada estado salen de una tabla en el código, no del servidor.</p>`,
};

/* ── Datos del curso ───────────────────────────────────────────────────────── */

const moduleRow = (n: number, title: string, meta: string, expanded: boolean, topics: string[]) => dedent(`
  <li class="border-b border-base-content/10">
    <h3>
      <button type="button" aria-expanded="${expanded}" aria-controls="modulo-${n}" class="group flex w-full items-center gap-4 py-5 text-left">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-400/20 text-sm font-semibold text-primary-text" aria-hidden="true">${n}</span>
        <span class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span class="text-base font-semibold text-base-content"><span class="sr-only">Módulo ${n}: </span>${title}</span>
          <span class="text-sm text-neutral-text">${meta}</span>
        </span>
        <span class="shrink-0 text-base-content transition-transform group-aria-expanded:rotate-180">${icon('chevron-down', 20)}</span>
      </button>
    </h3>
    <ul id="modulo-${n}" class="flex flex-col gap-2 pb-5 pl-13"${expanded ? '' : ' hidden'}>
${topics.map((t) => `      <li class="flex gap-2.5 text-sm text-base-content"><span class="mt-0.5 shrink-0 text-neutral-text">${icon('file-text', 16)}</span>${t}</li>`).join('\n')}
    </ul>
  </li>
`);

export const datosDelCurso: ComponentDoc = {
  figmaNode: '287-800',
  intro: `<p>Tres piezas del detalle de curso: <strong>Fact Row</strong> (un dato con su etiqueta), <strong>Checklist Item</strong> («Lo que aprenderás») y <strong>Module Row</strong> (un módulo del programa, expandible).</p>`,
  examples: [
    {
      title: 'Fact Row',
      description: 'Etiqueta, valor y, si hace falta, texto de apoyo visible.',
      previewClass: 'p-6 [&>*]:max-w-xs',
      html: dedent(`
        <dl class="flex flex-col gap-3">
          ${factRow('monitor', 'Modalidad', 'Presencial · Sede Central', 'El aprendizaje se realizará presencialmente en la sede indicada.').replace(/\n/g, '\n          ')}
          ${factRow('clock', 'Duración', '40 horas · máximo 2 meses').replace(/\n/g, '\n          ')}
        </dl>
      `),
    },
    {
      title: 'Checklist Item',
      description: 'Competencias o resultados de aprendizaje.',
      previewClass: 'p-6',
      html: dedent(`
        <ul class="grid gap-4 sm:grid-cols-2">
${[
  'Reconoce los fundamentos del Estado, el gobierno y la Administración pública.',
  'Aplica el presupuesto por resultados en su unidad.',
  'Identifica los controles internos del gasto público.',
  'Comunica resultados con datos a la ciudadanía.',
]
  .map((t) => `          <li class="flex gap-3 text-base text-base-content">${icon('circle-check', 24, 'shrink-0 text-success-text')}<span>${t}</span></li>`)
  .join('\n')}
        </ul>
      `),
    },
    {
      title: 'Module Row',
      description: 'Cerrado y abierto. En la vista previa no cambia; en Angular, el botón alterna aria-expanded y el atributo hidden de la lista.',
      previewClass: 'p-6',
      html: dedent(`
        <ol>
          ${moduleRow(1, 'Fundamentos de la inteligencia emocional', '4 temas · 8 horas', false, ['Qué es la inteligencia emocional', 'Autoconocimiento y autorregulación']).replace(/\n/g, '\n          ')}
          ${moduleRow(2, 'Inteligencia emocional en el servicio público', '4 temas · 8 horas', true, ['Qué es la inteligencia emocional y por qué importa en el servicio público', 'Autoconocimiento y autorregulación', 'Empatía y comunicación con la ciudadanía', 'Práctica: diario de emociones']).replace(/\n/g, '\n          ')}
        </ol>
      `),
    },
  ],
  usage: {
    html: `<ul>
      <li><strong>Fact Row:</strong> modalidad, duración, sede, certificación y fechas. Ícono de 16 px en <code>neutral-text</code>.</li>
      <li><strong>Checklist Item:</strong> frases completas que empiezan con verbo. En escritorio, dos columnas.</li>
      <li><strong>Module Row:</strong> número, título, temas y horas. Los temas solo se ven al abrir el módulo.</li>
      <li>El programa por módulos es <strong>contenido provisional</strong> hasta confirmar que existe como datos estructurados en la plataforma.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Fact Row:</strong> <code>&lt;dl&gt;</code>; cada par va en un <code>&lt;div&gt;</code>. El ícono está dentro del <code>&lt;dt&gt;</code> con <code>aria-hidden</code>, porque un <code>&lt;div&gt;</code> de <code>&lt;dl&gt;</code> solo admite <code>&lt;dt&gt;</code> y <code>&lt;dd&gt;</code>.</li>
    <li><strong>Checklist:</strong> <code>&lt;ul&gt;</code>; el ícono es decorativo.</li>
    <li><strong>Module Row:</strong> <code>&lt;h3&gt;&lt;button aria-expanded aria-controls&gt;</code>, como el acordeón de WAI-ARIA. Enter y Espacio abren y cierran. El número es decorativo; el lector oye «Módulo 1: …» por el texto <code>sr-only</code>.</li>
    <li><strong>Contraste:</strong> número en <code>primary-text</code> sobre <code>primary-400/20</code>, 4.5:1 en los dos temas.</li>
  </ul>`,
  classes: [
    ['relative pl-7 + absolute top-0 left-0 (ícono)', 'Fact Row: ícono a la izquierda dentro del <code>&lt;dt&gt;</code>.'],
    ['text-xs text-neutral-text / text-sm font-medium', 'Fact Row: etiqueta / valor.'],
    ['text-success-text', 'Checklist: ícono <code>circle-check</code> de 24 px.'],
    ['size-9 rounded-full bg-primary-400/20 text-primary-text', 'Module Row: número.'],
    ['group-aria-expanded:rotate-180', 'Module Row: flecha abierta.'],
    ['pl-13', 'Module Row: temas alineados con el título.'],
  ],
  codeNotes: `<p>Module Row en Angular: una señal <code>open</code> por módulo; <code>[attr.aria-expanded]="open()"</code> en el botón y <code>[hidden]="!open()"</code> en la lista.</p>`,
};

/* ── Docente ───────────────────────────────────────────────────────────────── */

export const docente: ComponentDoc = {
  figmaNode: '287-878',
  intro: `<p>Docente del curso: foto circular de 88 px, nombre, cargo y reseña. Sin tarjeta alrededor.</p>`,
  examples: [
    {
      title: 'Sin foto',
      description: 'Si la plataforma no tiene foto, se muestra el ícono user-round sobre surface-subtle. Con foto, la imagen ocupa el mismo círculo.',
      previewClass: 'p-6 [&>*]:max-w-md',
      html: dedent(`
        <div class="flex items-start gap-5">
          <div class="flex size-22 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-neutral-text">${icon('user-round', 40)}</div>
          <div class="flex min-w-0 flex-col gap-0.5">
            <h3 class="text-base font-semibold text-base-content">Lucía Morales Gómez</h3>
            <p class="text-sm text-neutral-text">Contadora pública · Docente INAP</p>
            <p class="text-sm text-base-content">Quince años en unidades financieras de ministerios y municipalidades. Ha coordinado procesos de presupuesto por resultados y capacita a equipos de administración financiera desde 2018.</p>
          </div>
        </div>
      `),
    },
  ],
  usage: {
    html: `<ul>
      <li>Con foto: <code>&lt;img class="size-22 shrink-0 rounded-full object-cover"&gt;</code> en lugar del círculo con ícono.</li>
      <li>Nombre y foto vienen de la plataforma. <strong>Cargo y reseña son campos nuevos propuestos</strong>; mientras no existan, se muestran solo foto y nombre.</li>
      <li>Varios docentes: uno debajo de otro en celular, dos columnas en escritorio.</li>
      <li>Los datos del ejemplo son ficticios.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Encabezado:</strong> el nombre es <code>&lt;h3&gt;</code> dentro de la sección «Docente» (<code>&lt;h2&gt;</code>).</li>
    <li><strong>Foto:</strong> <code>alt=""</code>, porque el nombre está al lado. El ícono de respaldo lleva <code>aria-hidden</code>.</li>
    <li><strong>Contraste:</strong> cargo en <code>neutral-text</code>, reseña en <code>base-content</code>.</li>
  </ul>`,
  classes: [
    ['size-22 rounded-full', 'Foto o respaldo (88 px).'],
    ['bg-surface-subtle text-neutral-text', 'Respaldo sin foto, ícono de 40 px.'],
    ['text-base font-semibold', 'Nombre.'],
  ],
};

/* ── Ediciones ─────────────────────────────────────────────────────────────── */

export const ediciones: ComponentDoc = {
  figmaNode: '301-32510',
  intro: `<p><strong>Edition Alert</strong> avisa que hay otra edición del mismo curso con inscripción abierta o próxima. <strong>Edition Row</strong> es una fila de una lista de ediciones con su estado.</p>`,
  examples: [
    {
      title: 'Aviso de edición',
      description: 'Se muestra solo si existe otra edición abierta o próxima; sobre todo en Cerrada, Cupo lleno y En curso.',
      previewClass: 'p-6 [&>*]:max-w-sm',
      html: dedent(`
        <div class="flex gap-3 rounded-xl bg-surface-subtle p-4">
          <span class="shrink-0 text-primary-text">${icon('calendar', 24)}</span>
          <div class="flex min-w-0 flex-col items-start gap-1">
            <p class="text-sm font-medium text-base-content">Hay otra edición con inscripción abierta</p>
            <p class="text-sm text-neutral-text">Edición 3-2026 · inscripciones del 02/11/2026 al 20/11/2026.</p>
            <a href="#" class="inline-flex items-center gap-1 text-sm font-medium text-primary-text hover:underline">Ver edición 3-2026 ${icon('arrow-right', 16)}</a>
          </div>
        </div>
      `),
    },
    {
      title: 'Fila de edición',
      description: 'Nombre de la edición, fechas, estado y enlace.',
      previewClass: 'p-6',
      html: dedent(`
        <ul>
          <li class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-base-content/10 py-4">
            <div class="flex min-w-0 flex-1 flex-col gap-0.5">
              <p class="text-base font-semibold text-base-content">Edición 3, 2026</p>
              <p class="text-sm text-neutral-text">Inscripciones del 01/10 al 20/10 · Curso del 26/10 al 20/11</p>
            </div>
            ${statusBadge('bg-info-text', 'Próximamente', 'shrink-0')}
            <a href="#" class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-text hover:underline">Ver edición<span class="sr-only"> 3, 2026</span>${icon('chevron-right', 16)}</a>
          </li>
        </ul>
      `),
    },
  ],
  usage: {
    html: `<ul>
      <li>En el detalle público, el aviso <strong>reemplaza la lista de ediciones</strong>: las ediciones pasadas no aportan (respuesta del equipo de desarrollo).</li>
      <li>La fila de edición sigue en Figma para listar ediciones vigentes; antes de usarla, confirmar dónde aplica.</li>
      <li>El aviso va bajo la <a href="componentes/tarjeta-de-inscripcion">Tarjeta de inscripción</a>.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Aviso:</strong> es contenido con un enlace, no una alerta: sin <code>role="alert"</code> ni <code>role="status"</code>, porque está desde que carga la página.</li>
    <li><strong>Enlace de la fila:</strong> «Ver edición» se repite en cada fila; el número de edición va en <code>sr-only</code> para que cada enlace tenga un nombre distinto.</li>
    <li><strong>Íconos:</strong> decorativos, <code>aria-hidden</code>.</li>
  </ul>`,
  classes: [
    ['rounded-xl bg-surface-subtle p-4', 'Aviso.'],
    ['text-primary-text', 'Ícono <code>calendar</code> de 24 px y enlace.'],
    ['border-b border-base-content/10 py-4', 'Fila de edición.'],
  ],
};

/* ── Barra de administración ───────────────────────────────────────────────── */

const adminActions: [string, string][] = [
  ['pencil', 'Editar edición'],
  ['globe', 'Publicar'],
  ['users', 'Estudiantes'],
  ['banknote', 'Cuotas'],
  ['award', 'Diplomas'],
  ['graduation-cap', 'Aula Virtual'],
  ['history', 'Ediciones'],
];

export const barraDeAdministracion: ComponentDoc = {
  figmaNode: '288-1456',
  intro: `<p>Barra navy sobre el detalle de curso, solo para usuarios con permisos de administración. Dice qué edición se ve y su visibilidad, y lleva a las acciones de administración. Reemplaza las pestañas Curso / Edición / Ediciones dentro del contenido público.</p>`,
  examples: [
    {
      title: 'Escritorio',
      previewClass: 'p-6',
      html: dedent(`
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 bg-brand-surface px-6 py-2.5 text-brand-surface-content">
          <div class="flex min-w-max flex-1 items-center gap-2.5">
            ${icon('settings', 20, 'shrink-0')}
            <p class="flex items-baseline gap-x-3 text-sm whitespace-nowrap"><span class="font-semibold">Vista de administración</span><span class="text-brand-surface-muted">Edición 2, 2026 · Visible</span></p>
          </div>
          <nav aria-label="Administración del curso">
            <ul class="flex flex-wrap items-center gap-1">
${adminActions.map(([i, l]) => `              <li><a href="#" class="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-semibold hover:bg-brand-surface-line focus-visible:outline-brand-surface-content">${icon(i, 16)}${l}</a></li>`).join('\n')}
            </ul>
          </nav>
        </div>
      `),
    },
    {
      title: 'Celular',
      description: 'Las acciones van en un menú desplegable.',
      previewClass: 'min-h-96 p-6 [&>*]:max-w-sm',
      html: dedent(`
        <div class="flex items-center gap-4 bg-brand-surface px-4 py-2.5 text-brand-surface-content">
          <div class="flex min-w-0 flex-1 items-center gap-2.5">
            ${icon('settings', 20, 'shrink-0')}
            <p class="flex flex-col text-sm"><span class="font-semibold">Administración</span><span class="text-brand-surface-muted">Edición 2, 2026 · Visible</span></p>
          </div>
          <details class="dropdown dropdown-end">
            <summary class="flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-md border border-brand-surface-line px-3 text-xs font-semibold focus-visible:outline-brand-surface-content">Acciones ${icon('chevron-down', 16)}</summary>
            <ul class="menu dropdown-content z-10 mt-2 w-56 rounded-box border border-base-300 bg-base-2 p-2 text-base-content shadow-md">
${adminActions.map(([i, l]) => `              <li><a href="#">${icon(i, 16)} ${l}</a></li>`).join('\n')}
            </ul>
          </details>
        </div>
      `),
    },
  ],
  usage: {
    html: `<ul>
      <li>Cada acción aparece solo si el usuario tiene el permiso (Publicar = administrar visibilidad de cursos; Cuotas = administrar cuotas; Editar = administrar cursos).</li>
      <li>La visibilidad de la edición (Visible, Invisible, Oculta) solo la ven los administradores.</li>
      <li>Va arriba del contenido del curso, debajo de la barra de navegación. En la página, el relleno horizontal sigue el contenedor (120 px en 1440).</li>
      <li>Colores fijos de marca (<code>brand-surface</code>): navy en los dos temas.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Navegación:</strong> las acciones son enlaces en <code>&lt;nav aria-label="Administración del curso"&gt;</code>.</li>
    <li><strong>Foco:</strong> anillo en <code>brand-surface-content</code> (blanco), porque <code>primary-text</code> no llega a 3:1 sobre navy.</li>
    <li><strong>Celular:</strong> el botón «Acciones» mide 44 px de alto (<code>min-h-11</code>) aunque en Figma mide 32, para cumplir el área táctil.</li>
    <li><strong>Contraste:</strong> texto blanco y <code>brand-surface-muted</code> pasan 9:1 sobre navy en los dos temas.</li>
  </ul>`,
  classes: [
    ['bg-brand-surface text-brand-surface-content', 'Barra.'],
    ['text-brand-surface-muted', 'Edición y visibilidad.'],
    ['rounded-md px-2.5 py-2 text-xs font-semibold hover:bg-brand-surface-line', 'Acción.'],
    ['focus-visible:outline-brand-surface-content', 'Foco sobre navy.'],
    ['dropdown dropdown-end + menu', 'Acciones en celular.'],
  ],
};
