import { dedent } from '../../core/dedent';
import { courseCard, thumbPhoto } from '../componentes/sitio-cursos';
import {
  adminBarDesktop, adminBarMobile, editionAlert, enrollmentBar, enrollmentCard, factRow, moduleRow, STATES,
} from '../componentes/sitio-detalle-curso';
import { sectionHeader } from '../componentes/sitio-home';
import { footer, navbarDesktop, navbarMobile } from '../componentes/sitio-navegacion';
import { icon } from '../componentes/types';
import { faqItem } from './home';

/*
  Plantilla del Detalle de curso (Figma: Course Detail / Desktop 289:6773, Mobile 290:359;
  pantallas «Curso • …» 289:7477 y 290:1102, al desplazar 338:32223 y 339:36008).
  Contenido de ejemplo: el curso y el docente son ficticios.
*/

const ind = (html: string, n: number) => html.replace(/\n/g, '\n' + ' '.repeat(n));

const WRAP = 'mx-auto w-full max-w-316 px-4 md:px-8';

/** Estados de la vista previa (?estado=…): los nueve de la tarjeta de inscripción y la vista de administración. */
export const ESTADOS: [string, string][] = [
  ['abierta', 'Inscripción abierta'],
  ['proximamente', 'Próximamente'],
  ['ultimoDia', 'Último día'],
  ['cerrada', 'Cerrada'],
  ['cupoLleno', 'Cupo lleno'],
  ['enCurso', 'En curso'],
  ['inscrito', 'Inscrito'],
  ['saldo', 'Saldo pendiente'],
  ['aprobado', 'Aprobado'],
  ['admin', 'Vista de administración'],
];

/** Con Cerrada, Cupo lleno y En curso se avisa de otra edición abierta. */
const WITH_ALERT = ['cerrada', 'cupoLleno', 'enCurso'];

const AREA = 'Finanzas públicas y calidad del gasto';

/* ── Encabezado ─────────────────────────────────────────────────────────────── */

const breadcrumb = () => dedent(`
  <div class="hidden bg-surface-muted md:block">
    <nav aria-label="Breadcrumb" class="breadcrumbs mx-auto max-w-360 px-8 py-3 text-sm xl:px-20">
      <ul>
        <li><a href="/" class="font-medium text-primary-text underline hover:no-underline">Inicio</a></li>
        <li><a href="#" class="font-medium text-primary-text underline hover:no-underline">Catálogo</a></li>
        <li><a href="#" class="font-medium text-primary-text underline hover:no-underline">${AREA}</a></li>
      </ul>
    </nav>
  </div>
  <div class="bg-surface-muted md:hidden">
    <a href="#" class="flex min-h-11 items-center gap-1 px-4 text-sm font-medium text-primary-text">${icon('chevron-left', 16)}${AREA}</a>
  </div>
`);

/**
 * Encabezado con la imagen del curso de fondo. Degradado navy: de izquierda a derecha en escritorio,
 * de arriba hacia abajo en celular; el texto queda sobre la parte de 65 % o más.
 */
const courseHeader = () => dedent(`
  <div class="relative isolate flex min-h-100 flex-col justify-end gap-3 overflow-hidden rounded-xl px-5 pt-20 pb-6 lg:min-h-95 lg:gap-4 lg:rounded-2xl lg:px-10 lg:pt-12 lg:pb-10">
    <img src="images/cursos/reunion-de-equipo.jpg" alt="" class="absolute inset-0 -z-10 size-full object-cover" />
    <div class="absolute inset-0 -z-10 bg-linear-to-b from-inap-brand-navy/10 via-inap-brand-navy/65 via-18% to-inap-brand-navy/85 lg:bg-linear-to-r lg:from-inap-brand-navy/85 lg:via-inap-brand-navy/65 lg:via-70% lg:to-inap-brand-navy/10" aria-hidden="true"></div>
    <img src="brand/waves.svg" alt="" width="1440" height="411" class="pointer-events-none absolute bottom-0 left-0 -z-10 w-[90rem] max-w-none opacity-10" />
    <div class="flex flex-wrap gap-2">
      <span class="badge badge-soft badge-primary text-xs font-semibold">Curso con certificación</span>
      <span class="badge badge-soft text-xs font-semibold">${AREA}</span>
    </div>
    <h1 id="curso-titulo" class="max-w-140 text-3xl font-semibold text-primary-content lg:text-4xl lg:font-bold">Curso Certificado en Administración Financiera</h1>
    <p class="max-w-130 text-base text-primary-content lg:text-lg">Fortalece tus capacidades en presupuesto, contabilidad y control del gasto público.</p>
    <p class="text-sm font-medium text-primary-content">Edición 2, 2026</p>
  </div>
`);

/* ── Tabs de sección ────────────────────────────────────────────────────────── */

const SECTIONS: [string, string][] = [['informacion', 'Información'], ['programa', 'Programa'], ['docente', 'Docente'], ['preguntas', 'Preguntas']];

/** Enlaces de ancla con scroll spy (no son pestañas ARIA). Fijos arriba al desplazar. */
const sectionNav = () => dedent(`
  <nav aria-label="Secciones del curso" class="sticky top-0 z-20 -mx-4 self-start bg-base-100 px-4 lg:col-start-1 lg:mx-0 lg:px-0">
    <ul class="flex gap-5 overflow-x-auto border-b border-base-content/10 [scrollbar-width:none] lg:gap-6">
      ${SECTIONS.map(([id, label], i) => `<li class="shrink-0"><a href="#${id}" data-seccion="${id}"${i === 0 ? ' aria-current="location"' : ''} class="-mb-px flex min-h-11 items-center border-b-3 border-transparent px-1 pt-3.5 pb-3 text-sm font-semibold whitespace-nowrap text-neutral-text hover:text-base-content aria-[current=location]:border-primary-text aria-[current=location]:text-primary-text">${label}</a></li>`).join('\n      ')}
    </ul>
  </nav>
`);

/* ── Contenido ──────────────────────────────────────────────────────────────── */

/** Cada sección es destino de ancla: deja espacio para las tabs fijas y recibe el foco. */
const SECTION = 'scroll-mt-16 outline-none';

const OUTCOMES = [
  'Formula el anteproyecto de presupuesto de su unidad conforme a la normativa vigente.',
  'Registra y da seguimiento a la ejecución del gasto en los sistemas oficiales.',
  'Aplica los controles internos que garantizan la calidad del gasto.',
  'Prepara la información para la rendición de cuentas y la transparencia.',
];

const block = (title: string, body: string, large = false) => dedent(`
  <div class="flex flex-col gap-3 lg:gap-4">
    <h2 class="text-xl font-semibold text-base-content">${title}</h2>
    <p class="text-base text-base-content${large ? ' lg:text-lg' : ''}">${body}</p>
  </div>
`);

const informacion = () => dedent(`
  <section id="informacion" tabindex="-1" aria-label="Información" class="${SECTION} flex flex-col gap-10 lg:gap-12">
    ${ind(block('¿En qué consiste?', 'Este curso desarrolla los conocimientos para planificar, ejecutar y controlar los recursos financieros de una institución pública: formulación del presupuesto, registro contable, ejecución del gasto y rendición de cuentas, conforme a la Ley Orgánica del Presupuesto.', true), 4)}
    ${ind(block('¿A quién va dirigido?', 'Personal de las unidades financieras, de compras y de planificación de las instituciones del Estado que participa en la formulación o ejecución del presupuesto.'), 4)}
    <div class="flex flex-col gap-3 lg:gap-4">
      <h2 class="text-xl font-semibold text-base-content">Lo que aprenderás</h2>
      <ul class="grid gap-x-6 gap-y-3 md:grid-cols-2 md:gap-y-4">
        ${OUTCOMES.map((t) => `<li class="flex gap-3 text-base text-base-content">${icon('circle-check', 24, 'shrink-0 text-success-text')}<span>${t}</span></li>`).join('\n        ')}
      </ul>
    </div>
    ${ind(block('Metodología', 'Aprendizaje práctico en etapas: iniciación, experimentación, sistematización y reflexión. Cada módulo combina lecturas breves, casos reales del sector público y una actividad aplicada a tu puesto.'), 4)}
    ${ind(block('Requisitos', 'Ser servidor público en funciones. No se requieren conocimientos previos de contabilidad.'), 4)}
  </section>
`);

const MODULES: [string, string, string[]][] = [
  ['Marco legal de la administración financiera', '4 temas · 8 horas', ['Ley Orgánica del Presupuesto y su reglamento', 'Sistema Integrado de Administración Financiera', 'Responsabilidades de los servidores públicos', 'Práctica: análisis de un caso institucional']],
  ['Formulación del presupuesto', '4 temas · 8 horas', ['Ciclo y calendario presupuestario', 'Presupuesto por resultados', 'Estructura programática', 'Práctica: anteproyecto de tu unidad']],
  ['Ejecución presupuestaria y contabilidad', '4 temas · 8 horas', ['Etapas del gasto', 'Modificaciones presupuestarias', 'Registro contable', 'Práctica: conciliación mensual']],
  ['Control interno y calidad del gasto', '3 temas · 8 horas', ['Normas de control interno', 'Indicadores de calidad del gasto', 'Hallazgos frecuentes de auditoría']],
  ['Rendición de cuentas y caso práctico', '3 temas · 8 horas', ['Informes de gestión', 'Transparencia y acceso a la información', 'Caso práctico final']],
];

const programa = () => dedent(`
  <section id="programa" tabindex="-1" aria-labelledby="programa-titulo" class="${SECTION} flex flex-col gap-4">
    <div class="flex flex-col gap-3 lg:gap-4">
      <h2 id="programa-titulo" class="text-xl font-semibold text-base-content lg:text-2xl">Programa</h2>
      <p class="text-sm text-neutral-text">5 módulos · 40 horas</p>
    </div>
    <ol class="border-t border-base-content/10">
      ${MODULES.map(([t, meta, topics], i) => ind(moduleRow(i + 1, t, meta, i === 0, topics), 6)).join('\n      ')}
    </ol>
    <a href="#" class="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold text-primary-text hover:underline lg:min-h-0">${icon('file-text', 16)}Descargar programa completo (PDF)</a>
  </section>
`);

const docente = () => dedent(`
  <section id="docente" tabindex="-1" aria-labelledby="docente-titulo" class="${SECTION} flex flex-col gap-3 lg:gap-4">
    <h2 id="docente-titulo" class="text-xl font-semibold text-base-content lg:text-2xl">Docente</h2>
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
      <div class="flex size-22 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-neutral-text">${icon('user-round', 40)}</div>
      <div class="flex min-w-0 flex-col gap-0.5">
        <h3 class="text-base font-semibold text-base-content">Lucía Morales Gómez</h3>
        <p class="text-sm text-neutral-text">Contadora pública · Docente INAP</p>
        <p class="text-sm text-base-content">Quince años en unidades financieras de ministerios y municipalidades. Ha coordinado procesos de presupuesto por resultados y capacita a equipos de administración financiera desde 2018.</p>
      </div>
    </div>
  </section>
`);

const FAQ: [string, string][] = [
  ['¿Recibo un certificado al terminar?', 'Sí. Al aprobar el curso y la evaluación de certificación recibes un certificado digital del INAP, que puedes descargar desde tu perfil.'],
  ['¿Puedo pagar en cuotas?', 'Sí, la inversión de Q200.00 se puede pagar en 2 cuotas.'],
  ['¿Qué pasa si no termino a tiempo?', 'Puedes inscribirte en una próxima edición. Tu avance no se transfiere entre ediciones.'],
];

const preguntas = () => dedent(`
  <section id="preguntas" tabindex="-1" aria-labelledby="preguntas-titulo" class="${SECTION} flex flex-col gap-3 lg:gap-4">
    <h2 id="preguntas-titulo" class="text-xl font-semibold text-base-content lg:text-2xl">Preguntas frecuentes</h2>
    <div>
      ${FAQ.map((f, i) => ind(faqItem(f, i === 0, 'curso-faq'), 6)).join('\n      ')}
    </div>
    <div class="flex flex-col gap-4 pt-8 lg:pt-0">
      <h2 class="text-xl font-semibold text-base-content">¿Tienes dudas?</h2>
      <dl class="flex flex-col gap-4 rounded-xl bg-surface-subtle p-4 md:flex-row md:gap-6 md:p-5 [&>div]:flex-1">
        ${ind(factRow('phone', 'Teléfono', '<a href="#" class="hover:underline">2419-8141</a>'), 8)}
        ${ind(factRow('mail', 'Correo', '<a href="#" class="hover:underline">mhernandez@inap.gob.gt</a>'), 8)}
      </dl>
    </div>
  </section>
`);

/* ── Cursos relacionados ────────────────────────────────────────────────────── */

const RELATED: [string, string, string, string, string][] = [
  ['images/cursos/recursos-humanos.png', 'Con certificación', 'Curso y Certificación para Profesionales de Recursos Humanos', 'Gestión administrativa y organizacional', '10 semanas'],
  ['images/cursos/administracion-publica.png', 'Con certificación', 'Certificación de Conocimientos en Administración Pública — Nivel Básico', 'Modernización del Estado', '6 semanas'],
  ['images/cursos/derecho-administrativo.png', 'Curso', 'Introducción al Derecho Administrativo', 'Ética, transparencia y rendición de cuentas', '4 semanas'],
];

const related = () => dedent(`
  <section aria-labelledby="relacionados" class="bg-surface-subtle py-12 md:py-20">
    <div class="${WRAP} flex flex-col gap-6 md:gap-8">
      ${ind(sectionHeader('Cursos relacionados', 'Otros cursos que complementan tu formación en gestión pública.').replace('<h2', '<h2 id="relacionados"'), 6)}
      <ul class="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scroll-px-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:px-0">
        ${RELATED.map(([img, badge, title, area, weeks]) => `<li class="w-70.5 shrink-0 snap-start md:w-auto">\n          ${ind(courseCard(thumbPhoto(badge, img), title, area, weeks), 10)}\n        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>
`);

/* ── Página ─────────────────────────────────────────────────────────────────── */

/** Página completa en el estado indicado. */
export const detalleTemplate = (estado = 'abierta') => {
  const admin = estado === 'admin';
  const s = STATES[admin ? 'abierta' : estado] ?? STATES['abierta'];
  const alert = WITH_ALERT.includes(estado) ? `\n            ${ind(editionAlert(), 12)}` : '';
  const adminBars = admin
    ? `\n  <div class="hidden lg:block">\n    ${ind(adminBarDesktop().replace('px-6', 'px-8 xl:px-30'), 4)}\n  </div>\n  <div class="lg:hidden">\n    ${ind(adminBarMobile(), 4)}\n  </div>`
    : '';
  return dedent(`
    <a href="#curso-contenido" class="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">Saltar al contenido principal</a>
    <div class="xl:hidden">
      ${ind(navbarMobile('cur-m', 'angular'), 6)}
    </div>
    <div class="hidden xl:block">
      ${ind(navbarDesktop('cur-d', 'angular'), 6)}
    </div>${ind(adminBars, 2)}
    ${ind(breadcrumb(), 4)}
    <main id="curso-contenido" tabindex="-1" class="outline-none">
      <div class="${WRAP} grid grid-cols-[minmax(0,1fr)] gap-y-10 pt-6 pb-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-x-6 lg:gap-y-12 lg:pt-8 lg:pb-24">
        <div class="lg:col-start-1">
          ${ind(courseHeader(), 10)}
        </div>
        <div class="lg:col-start-2 lg:row-span-3 lg:row-start-1">
          <div data-tarjeta class="flex flex-col gap-4 lg:sticky lg:top-6">
            ${ind(enrollmentCard(s), 12)}${alert}
          </div>
        </div>
        ${ind(sectionNav(), 8)}
        <div class="flex flex-col gap-14 lg:col-start-1 lg:gap-16">
          ${ind(informacion(), 10)}
          ${ind(programa(), 10)}
          ${ind(docente(), 10)}
          ${ind(preguntas(), 10)}
        </div>
      </div>
      ${ind(related(), 6)}
    </main>
    ${ind(footer('cur-f'), 4)}
    <div class="h-24 lg:hidden" aria-hidden="true"></div>
    <div data-barra hidden class="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      ${ind(enrollmentBar(s), 6)}
    </div>
  `);
};
