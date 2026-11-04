import { dedent } from '../../core/dedent';
import { ComponentDoc, icon } from './types';

export const menuDesplegable: ComponentDoc = {
  intro: `<p>Lista de opciones que se abre desde un botón: el menú de usuario, «Ordenar por». Base de daisyUI: <code>dropdown</code> + <code>menu</code>.</p>`,
  examples: [
    { title: 'Menú de usuario', previewClass: 'flex min-h-64 justify-end p-6', html: dedent(`
      <details class="dropdown dropdown-end">
        <summary class="btn btn-ghost" aria-label="Mi cuenta: Ana López">
          <span class="avatar avatar-placeholder"><span class="w-8 rounded-full bg-primary text-primary-content"><span class="text-xs font-semibold" aria-hidden="true">AL</span></span></span>
          ${icon('chevron-down', 16)}
        </summary>
        <ul class="menu dropdown-content z-10 mt-2 w-56 rounded-box border border-base-300 bg-base-2 p-2 shadow-md">
          <li><a href="#">${icon('user-round', 16)} Perfil</a></li>
          <li><a href="#">${icon('graduation-cap', 16)} Mis cursos</a></li>
          <li><a href="#">${icon('settings', 16)} Configuración</a></li>
          <li><button type="button">${icon('log-out', 16)} Cerrar sesión</button></li>
        </ul>
      </details>
    `) },
  ],
  usage: {
    html: `<ul>
      <li>Para acciones o enlaces relacionados, no para la navegación principal.</li>
      <li>Ícono a la izquierda solo si ayuda a reconocer la opción; todos o ninguno.</li>
      <li>La opción de la página actual lleva <code>menu-active</code> y <code>aria-current="page"</code>.</li>
    </ul>`,
  },
  a11y: `<ul>
    <li><strong>Con <code>&lt;details&gt;</code>:</strong> abre con Enter o Espacio y se anuncia como expandido, sin JavaScript. Cerrar con Esc y al pulsar fuera requiere un poco de JavaScript.</li>
    <li><strong>Con botón:</strong> <code>aria-haspopup="menu"</code> y <code>aria-expanded</code>; Esc cierra y devuelve el foco al botón.</li>
    <li><strong>Nombre:</strong> si el botón solo muestra el avatar, <code>aria-label</code> con el nombre de la persona.</li>
  </ul>`,
  classes: [
    ['dropdown', 'Contenedor.'],
    ['dropdown-end, dropdown-top…', 'Alineación del panel.'],
    ['dropdown-content', 'Panel que se abre.'],
    ['menu', 'Lista de opciones.'],
    ['menu-active', 'Opción actual.'],
  ],
};
