import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FIGMA_URL } from '../../core/navigation';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Icon } from '../../ui/icon/icon';

@Component({
  selector: 'inap-leer-figma-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, Icon, RouterLink],
  template: `
    <inap-doc-page section="primeros-pasos" slug="leer-figma">
      <p>
        El archivo de Figma «INAP Design System» tiene los componentes y las pantallas del rediseño. Si Figma y el
        código no coinciden, manda Figma: avísenme para corregir el archivo de tokens.
      </p>
      <p>
        <a [href]="figma" target="_blank" rel="noopener" class="inline-flex items-center gap-1">
          Abrir el archivo en Figma <inap-icon name="arrow-up-right" [size]="16" />
          <span class="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </p>

      <h2 id="paginas">Páginas y pantallas</h2>
      <ul>
        <li>Componentes: páginas «Web Components» y una por familia (Button, Form Fields, Selection Controls, Badge, Alert, Brand).</li>
        <li>
          Pantallas: <strong>Desktop Light, Desktop Dark, Mobile Light y Mobile Dark</strong>. Las de Dark son
          instancias de las de Light con el modo de color <code>dark</code>: mismo HTML, otro <code>data-theme</code>.
        </li>
        <li>
          Nombre de cada frame: <code>Pantalla • Desktop|Mobile • Light|Dark • estado</code>, por ejemplo
          <code>Curso • Desktop • Light • Cupo lleno</code>. Cada estado es un frame; implementen todos.
        </li>
      </ul>

      <h2 id="variables">Variables = clases de Tailwind</h2>
      <p>En Dev Mode, cada variable muestra su nombre de código, que es la variable CSS de <code>inap-theme.css</code>:</p>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead><tr><th scope="col">Figma muestra</th><th scope="col">Clase de Tailwind</th></tr></thead>
          <tbody>
            @for (r of variables; track r.figma) {
              <tr><td><code>{{ r.figma }}</code></td><td>{{ r.tailwind }}</td></tr>
            }
          </tbody>
        </table>
      </div>
      <ul>
        <li><strong>No copiar hex.</strong> Si Dev Mode muestra un hex sin variable, pregúntenme: probablemente falta enlazarlo.</li>
        <li><strong>No usar el CSS que genera Figma tal cual.</strong> Sirve para ver valores; el código final usa clases de daisyUI y Tailwind.</li>
        <li>Lista completa de variables: <a routerLink="/tokens/todos">Tokens</a>.</li>
      </ul>

      <h2 id="sufijos">Sufijos en nombres de capa</h2>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead><tr><th scope="col">Sufijo</th><th scope="col">Significa</th><th scope="col">En código</th></tr></thead>
          <tbody>
            <tr>
              <td><code>• sr-only</code></td>
              <td>No se ve, pero debe estar en el HTML para lectores de pantalla</td>
              <td>Clase <code>sr-only</code>. Nunca <code>hidden</code>, <code>display: none</code> ni <code>visibility: hidden</code></td>
            </tr>
            <tr>
              <td><code>hotspot/*</code></td>
              <td>Zona de clic del prototipo</td>
              <td>No se implementa</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="provisional">Contenido provisional</h2>
      <p>
        Estadísticas, testimonios, conteos de cursos y los módulos de ejemplo son <strong>provisionales</strong> hasta
        que Comunicación Social o DIFOGI entreguen el contenido real. Áreas, tipos de curso y opciones de filtro
        nunca se fijan en el código: siempre vienen de los datos.
      </p>
    </inap-doc-page>
  `,
})
export class LeerFigmaPage {
  protected readonly figma = FIGMA_URL;

  protected readonly variables = [
    { figma: 'var(--color-primary-text)', tailwind: 'text-primary-text, border-primary-text, outline-primary-text' },
    { figma: 'var(--color-surface-subtle)', tailwind: 'bg-surface-subtle' },
    { figma: 'color-mix(in oklab, var(--color-base-content) 60%, transparent)', tailwind: 'text-base-content/60' },
    { figma: 'color-mix(in oklab, var(--color-primary) 8%, var(--color-base-100))', tailwind: 'Fondo soft de daisyUI (badge-soft, alert-soft); no hace falta escribirlo' },
    { figma: 'calc(var(--spacing) * 6)', tailwind: 'p-6, gap-6… (24 px)' },
    { figma: 'var(--radius-box)', tailwind: 'rounded-box' },
    { figma: 'var(--text-sm) + var(--text-sm--line-height)', tailwind: 'text-sm' },
    { figma: 'Shadow/md', tailwind: 'shadow-md' },
  ];
}
