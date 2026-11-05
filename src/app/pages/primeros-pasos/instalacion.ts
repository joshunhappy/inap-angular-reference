import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { dedent } from '../../core/dedent';
import { REPO_URL } from '../../core/navigation';
import { CodeBlock } from '../../ui/code-block/code-block';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Icon } from '../../ui/icon/icon';

@Component({
  selector: 'inap-instalacion-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock, DocPage, Icon, RouterLink],
  template: `
    <inap-doc-page section="primeros-pasos" slug="instalacion">
      <p>
        Para la plataforma de cursos (Angular + Tailwind 4.1.4 + daisyUI 5.5.19). Son cuatro archivos CSS de este
        repositorio y la fuente Montserrat. WordPress no instala nada de esto: usa el CSS ya compilado
        (<a href="#wordpress">ver abajo</a>).
      </p>

      <h2 id="archivos">Archivos</h2>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead><tr><th scope="col">Archivo</th><th scope="col">Qué hace</th><th scope="col">Dónde va</th></tr></thead>
          <tbody>
            @for (f of files; track f.name) {
              <tr>
                <td class="whitespace-nowrap">
                  <a [href]="repo + '/blob/main/src/styles/theme/' + f.name" target="_blank" rel="noopener"
                     class="font-semibold text-primary-text underline underline-offset-2 hover:no-underline">
                    <code>{{ f.name }}</code><span class="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </td>
                <td>{{ f.what }}</td>
                <td>{{ f.where }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <h2 id="tokens">1. Tokens</h2>
      <p>
        <code>inap-theme.css</code> reemplaza el inicio de <code>tailwind.css</code>: desde
        <code>&#64;import 'tailwindcss';</code> hasta el cierre de <code>&#64;layer base</code>, justo antes de
        <code>.text-md</code>. El resto del archivo se queda igual.
      </p>
      <p>
        Desactiva los temas integrados de daisyUI (<code>themes: false</code>). Solo existen <code>inap</code>
        (predeterminado) y <code>dark</code>, así que «Cambiar tema» (cupcake, retro…) deja de funcionar y sale del
        rediseño.
      </p>

      <h2 id="componentes">2. Ajustes de componentes</h2>
      <p>Copiar los demás archivos junto a <code>tailwind.css</code> e importarlos <strong>al final</strong>, después de todos los estilos de componentes:</p>
      <inap-code-block language="CSS" [code]="imports" />
      <ul class="mt-4">
        <li>
          <code>inap-components.css</code> va al final para que sus reglas ganen por orden a las de la misma
          especificidad. Corrige el contraste de botones, campos, <code>ng-select</code>, controles de selección,
          badges, alertas y tabs.
        </li>
        <li>
          <code>inap-safelist.css</code> obliga a Tailwind a generar todos los colores y tamaños de daisyUI. Sin él,
          una clase armada en código (<code>'btn-' + color</code>) no existe y el componente sale sin color.
        </li>
      </ul>

      <h2 id="fuente">3. Fuente</h2>
      <p>
        <code>--font-sans</code> ya define Montserrat con sus dos nombres: <code>"Montserrat Variable"</code> (el que
        registra el paquete variable) y <code>"Montserrat"</code>. Solo hay que cargarla:
      </p>
      <inap-code-block language="Terminal" [code]="fontInstall" />
      <inap-code-block class="mt-4" language="CSS" [code]="fontImport" />
      <p class="mt-4">
        Con pesos fijos: <code>&#64;fontsource/montserrat</code> con 400, 500, 600 y 700. Dancing Script
        (<code>font-script</code>) solo se carga en las pantallas que la usan.
      </p>

      <h2 id="tema">4. Atributo de tema</h2>
      <p>
        <code>&lt;html&gt;</code> lleva <code>data-theme="inap"</code> o <code>data-theme="dark"</code>. Cómo
        ponerlo sin parpadeo y cómo cambiarlo: <a routerLink="/primeros-pasos/tema-claro-oscuro">Tema claro y oscuro</a>.
      </p>

      <h2 id="iconos">5. Íconos</h2>
      <p>
        Lucide con <code>lucide-static</code> v0.469.0, como sprite. Instalación y componente:
        <a routerLink="/fundamentos/iconos">Íconos</a>.
      </p>

      <h2 id="comprobar">Comprobar la instalación</h2>
      <p>Este botón debe verse azul INAP con texto blanco, en Montserrat, y su contorno de foco azul al llegar con Tab:</p>
      <inap-code-block language="HTML" [code]="check" />

      <h2 id="wordpress">WordPress</h2>
      <p>
        El sitio institucional carga el CSS que compila este repositorio, con los mismos tokens y ajustes:
      </p>
      <inap-code-block language="Terminal" [code]="wpBuild" />
      <ul class="mt-4">
        <li>Sale en <code>dist/wordpress/inap.css</code>. No incluye la fuente: WordPress la carga por su cuenta.</li>
        <li>
          Tailwind solo genera las clases que encuentra en los archivos que revisa. Cuando exista el tema de
          WordPress, agregar su ruta en <code>src/styles/wordpress.css</code>:
        </li>
      </ul>
      <inap-code-block language="CSS" [code]="wpSource" />

      <p class="mt-6">
        <a [href]="repo" target="_blank" rel="noopener" class="inline-flex items-center gap-1">
          Ver el repositorio en GitHub <inap-icon name="arrow-up-right" [size]="16" />
          <span class="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </p>
    </inap-doc-page>
  `,
})
export class InstalacionPage {
  protected readonly repo = REPO_URL;

  protected readonly files = [
    { name: 'inap-theme.css', what: 'Tokens de color, tipografía y forma; temas inap y dark.', where: 'Inicio de tailwind.css (reemplaza el bloque del tema)' },
    { name: 'inap-components.css', what: 'Ajustes de contraste de los componentes de daisyUI.', where: 'Al final de tailwind.css' },
    { name: 'inap-safelist.css', what: 'Colores y tamaños de daisyUI que siempre se generan.', where: 'Al final de tailwind.css' },
    { name: 'inap-navigation.css', what: 'Navegación lateral (nav-link, nav-active). Opcional.', where: 'Al final, si usan la navegación lateral' },
  ];

  protected readonly imports = dedent(`
    /* últimas líneas de tailwind.css */
    @import './inap-components.css';
    @import './inap-safelist.css';
    @import './inap-navigation.css'; /* opcional */
  `);

  protected readonly fontInstall = 'npm i @fontsource-variable/montserrat';

  protected readonly fontImport = dedent(`
    /* inicio de tailwind.css, antes de @import 'tailwindcss' */
    @import '@fontsource-variable/montserrat';
  `);

  protected readonly check = '<button type="button" class="btn btn-primary">Inscribirme</button>';

  protected readonly wpBuild = 'npm run build:css';

  protected readonly wpSource = dedent(`
    @source '../app';
    @source '../../../wordpress/tema-inap'; /* ejemplo: ruta del tema */
  `);
}
