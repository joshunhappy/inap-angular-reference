import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

export const alerta: ComponentDoc = {
  intro: `<p>Mensajes que informan sobre el estado de algo: una inscripción confirmada, un dato que falta, un error al pagar. En Figma: Alert, Alert Soft y Alert Outline, cada uno Color × Layout (Horizontal / Vertical).</p>`,
  examples: [
    { title: 'Suave', previewClass: 'flex flex-col gap-3 p-6', html: dedent(`
      <div role="status" class="alert alert-soft alert-info">${icon('info')}<span>Esta edición inicia el 12 de enero de 2027.</span></div>
      <div role="status" class="alert alert-soft alert-success">${icon('circle-check')}<span>Te inscribiste en «Gestión pública por resultados».</span></div>
      <div role="status" class="alert alert-soft alert-warning">${icon('triangle-alert')}<span>Tienes un saldo pendiente de Q150.00.</span></div>
      <div role="alert" class="alert alert-soft alert-error">${icon('circle-x')}<span>No pudimos procesar el pago. Intenta de nuevo.</span></div>
    `) },
    { title: 'Contorno y guiones', previewClass: 'flex flex-col gap-3 p-6', html: dedent(`
      <div role="status" class="alert alert-outline alert-info">${icon('info')}<span>Los cupos se asignan por orden de inscripción.</span></div>
      <div role="status" class="alert alert-dash alert-warning">${icon('triangle-alert')}<span>Esta edición tiene pocos cupos.</span></div>
    `) },
    { title: 'Con acciones (vertical en celular)', previewClass: 'p-6', html: dedent(`
      <div role="status" class="alert alert-soft alert-warning alert-vertical sm:alert-horizontal">
        ${icon('triangle-alert')}
        <div>
          <p class="font-semibold">Saldo pendiente</p>
          <p class="text-sm">Paga la cuota antes del 30 de noviembre para conservar tu cupo.</p>
        </div>
        <a href="#" class="btn btn-sm btn-warning">Pagar cuota</a>
      </div>
    `) },
    { title: 'Con botón de cerrar', previewClass: 'p-6', html: dedent(`
      <div role="status" class="alert alert-soft alert-success">
        ${icon('circle-check')}
        <span>Guardamos tus cambios.</span>
        <button type="button" class="btn btn-ghost btn-sm btn-square" aria-label="Cerrar aviso">${icon('x')}</button>
      </div>
    `) },
  ],
  usage: {
    html: `<ul>
      <li><code>alert-soft</code> es el estilo por defecto. Contorno y guiones, para avisos dentro de tarjetas o formularios.</li>
      <li>El mensaje dice qué pasó y qué hacer: «No pudimos procesar el pago. Intenta de nuevo».</li>
      <li>Una alerta con acciones no desaparece sola.</li>
      <li>Layout Vertical en celular: <code>alert-vertical sm:alert-horizontal</code>.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Rol:</strong> <code>role="status"</code> para confirmaciones y avisos (se anuncian sin interrumpir); <code>role="alert"</code> solo para errores urgentes.</li>
    <li><strong>Ícono:</strong> decorativo, <code>aria-hidden="true"</code>. El texto dice el significado.</li>
    <li><strong>Cerrar:</strong> botón con <code>aria-label="Cerrar aviso"</code>; al cerrar, el foco pasa a un elemento lógico, no a <code>&lt;body&gt;</code>.</li>
    <li><strong>Contraste:</strong> en suave, contorno y guiones, texto y borde usan el token <code>-text</code>.</li>
    <li><strong>Mensajes dinámicos:</strong> el contenedor con <code>role</code> debe existir antes de insertar el texto para que el lector de pantalla lo anuncie.</li>
  </ul>`,
  classes: [
    ['alert', 'Base.'],
    ['alert-info, alert-success, alert-warning, alert-error', 'Color.'],
    ['alert-soft, alert-outline, alert-dash', 'Estilo. Texto y borde en <code>-text</code>.'],
    ['alert-vertical, alert-horizontal', 'Disposición. En celular: <code>alert-vertical sm:alert-horizontal</code>.'],
  ],
};
