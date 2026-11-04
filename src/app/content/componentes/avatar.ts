import { dedent } from '../../core/dedent';
import { ComponentDoc } from './types';

export const avatar: ComponentDoc = {
  intro: `<p>Foto o iniciales de una persona: el usuario en la barra de navegación y el docente en el detalle de curso. En Figma, Avatar tiene tamaños S, M y L; el docente usa 88 px.</p>`,
  examples: [
    { title: 'Iniciales', description: 'Cuando no hay foto.', html: dedent(`
      <div class="avatar avatar-placeholder">
        <div class="w-8 rounded-full bg-primary text-primary-content"><span class="text-xs font-semibold">AL</span></div>
      </div>
      <div class="avatar avatar-placeholder">
        <div class="w-10 rounded-full bg-primary text-primary-content"><span class="text-sm font-semibold">AL</span></div>
      </div>
      <div class="avatar avatar-placeholder">
        <div class="w-[88px] rounded-full bg-primary text-primary-content"><span class="text-2xl font-semibold">AL</span></div>
      </div>
    `) },
    { title: 'Sin foto ni nombre', description: 'Docente sin foto: ícono de persona sobre surface-subtle.', html: dedent(`
      <div class="avatar avatar-placeholder">
        <div class="w-[88px] rounded-full bg-surface-subtle text-neutral-text">
          <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="assets/lucide/sprite.svg#user-round" /></svg>
        </div>
      </div>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Iniciales: primera letra del nombre y del primer apellido.</li>
      <li>Fotos recortadas en círculo (<code>rounded-full</code>), con <code>object-cover</code>.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li>Si el nombre está escrito al lado, la foto lleva <code>alt=""</code> y las iniciales <code>aria-hidden="true"</code>.</li>
    <li>En el botón de usuario, el nombre accesible es del botón: <code>aria-label="Mi cuenta: Ana López"</code>.</li>
    <li>Iniciales en <code>primary-content</code> sobre <code>primary</code>: 6.79:1.</li>
  </ul>`,
  classes: [
    ['avatar', 'Contenedor de la foto.'],
    ['avatar-placeholder', 'Contenedor para iniciales o ícono.'],
  ],
  snippets: [
    { title: 'Foto', language: 'HTML', code: dedent(`
      <div class="avatar">
        <div class="w-[88px] rounded-full">
          <img src="/docentes/ana-lopez.jpg" alt="" class="object-cover" />
        </div>
      </div>
    `) },
  ],
};
