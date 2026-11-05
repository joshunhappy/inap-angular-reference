import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPage } from '../../ui/doc-page/doc-page';

interface Group {
  id: string;
  title: string;
  items: string[];
}

@Component({
  selector: 'inap-revision-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, RouterLink],
  template: `
    <inap-doc-page section="primeros-pasos" slug="revision">
      <p>
        Antes de entregar una pantalla, revisar cada punto. Las casillas son una ayuda para la revisión: no se
        guardan al salir de la página. Detalle de cada regla en <a routerLink="/fundamentos/accesibilidad">Accesibilidad</a>.
      </p>

      @for (g of groups; track g.id) {
        <h2 [id]="g.id">{{ g.title }}</h2>
        <ul class="mb-4 flex max-w-prose flex-col gap-1">
          @for (item of g.items; track $index) {
            <li>
              <label class="flex cursor-pointer items-start gap-3 rounded-field px-2 py-2 hover:bg-surface-subtle">
                <input type="checkbox" class="checkbox checkbox-primary checkbox-sm mt-1" />
                <span>{{ item }}</span>
              </label>
            </li>
          }
        </ul>
      }
    </inap-doc-page>
  `,
})
export class RevisionPage {
  protected readonly groups: Group[] = [
    {
      id: 'diseno',
      title: 'Diseño',
      items: [
        'Coincide con los frames de Figma en escritorio y celular, en claro y oscuro, y en todos los estados.',
        'No hay hex, tonos -300/-500 para texto o bordes, ni secondary como navy fijo.',
        'El texto de color usa tokens -text. Los bordes de campos usan base-border.',
        'El contenido provisional está marcado; ninguna lista de áreas o tipos está fija en el código.',
      ],
    },
    {
      id: 'estructura',
      title: 'Estructura',
      items: [
        'Un solo <h1> y los niveles de título en orden.',
        'Las capas «• sr-only» están en el HTML con la clase sr-only.',
        'Botones de solo ícono con aria-label. Imágenes con alt correcto (vacío si son decorativas).',
      ],
    },
    {
      id: 'teclado',
      title: 'Teclado y movimiento',
      items: [
        'Todo funciona con teclado, en un orden lógico, con foco visible en cada elemento.',
        'Esc cierra menús y diálogos, y el foco regresa al botón que los abrió.',
        'Con prefers-reduced-motion: reduce no hay animaciones automáticas.',
      ],
    },
    {
      id: 'celular',
      title: 'Celular y zoom',
      items: [
        'Áreas táctiles de 44 px en celular; botones btn-lg.',
        'Al 200 % de zoom y a 320 px de ancho no hay desplazamiento horizontal.',
      ],
    },
    {
      id: 'auditoria',
      title: 'Auditoría',
      items: ['Sin errores en la auditoría de accesibilidad de Lighthouse o axe DevTools.'],
    },
  ];
}
