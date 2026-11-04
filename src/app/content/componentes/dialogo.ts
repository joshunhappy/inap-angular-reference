import { dedent } from '../../core/dedent';
import { ComponentDoc } from './types';

export const dialogo: ComponentDoc = {
  intro: `<p>Ventana que pide una decisión o muestra contenido sin salir de la página. Se construye con <code>&lt;dialog&gt;</code> y <code>showModal()</code>: el foco queda atrapado, Esc cierra y el resto de la página queda inerte, sin código extra. También se usa para el menú en celular, «Mi cuenta», la búsqueda en celular y los filtros del catálogo.</p>`,
  examples: [
    { title: 'Confirmación', previewClass: 'p-6', html: dedent(`
      <button class="btn btn-error btn-outline" onclick="document.getElementById('ej-dialogo').showModal()">Cancelar inscripción</button>
      <dialog id="ej-dialogo" class="modal" aria-labelledby="ej-dialogo-titulo">
        <div class="modal-box">
          <h3 id="ej-dialogo-titulo" class="text-lg font-semibold">¿Cancelar tu inscripción?</h3>
          <p class="py-4 text-neutral-text">Liberarás tu cupo en «Gestión pública por resultados». Podrás inscribirte de nuevo si quedan cupos.</p>
          <form method="dialog" class="modal-action">
            <button class="btn btn-ghost">Conservar inscripción</button>
            <button class="btn btn-error">Cancelar inscripción</button>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop"><button>Cerrar</button></form>
      </dialog>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Para decisiones que no se pueden deshacer o que interrumpen a propósito. Para avisos, una alerta en la página.</li>
      <li>El título dice la pregunta; los botones dicen la acción («Cancelar inscripción»), no «Sí» / «No».</li>
      <li>La acción principal va a la derecha. La destructiva usa <code>btn-error</code>.</li>
      <li>En celular, los paneles grandes (menú, filtros) van a pantalla completa con encabezado y pie fijos; solo el centro se desplaza.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Apertura:</strong> <code>showModal()</code>, nunca <code>show()</code>: así el fondo es inerte y Esc cierra.</li>
    <li><strong>Nombre:</strong> <code>aria-labelledby</code> apunta al título.</li>
    <li><strong>Foco:</strong> al abrir, pasa al primer elemento enfocable (o al que tenga <code>autofocus</code>); al cerrar, regresa al botón que lo abrió (lo hace el navegador).</li>
    <li><strong>Animación de daisyUI:</strong> en la primera apertura el contenido aún está oculto mientras corre la transición, y <code>focus()</code> puede fallar. Si hay que enfocar un campo, intentarlo también al terminar la transición (ver Código).</li>
  </ul>`,
  classes: [
    ['modal', 'El <code>&lt;dialog&gt;</code>.'],
    ['modal-box', 'Caja del contenido.'],
    ['modal-action', 'Fila de botones.'],
    ['modal-backdrop', 'Fondo: un <code>&lt;form method="dialog"&gt;</code> para cerrar al pulsar fuera.'],
    ['modal-top, modal-bottom, modal-start, modal-end, modal-middle', 'Posición.'],
  ],
  snippets: [
    { title: 'Abrir desde Angular y enfocar un campo', language: 'TypeScript', code: dedent(`
      private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
      private readonly campo = viewChild.required<ElementRef<HTMLInputElement>>('campo');

      abrir(): void {
        const dlg = this.dialog().nativeElement;
        const campo = this.campo().nativeElement;
        dlg.showModal();
        campo.focus();
        // En la primera apertura la transición de daisyUI aún no termina.
        dlg.addEventListener('transitionend', () => {
          if (dlg.open && document.activeElement !== campo) campo.focus();
        }, { once: true });
      }
    `) },
  ],
};
