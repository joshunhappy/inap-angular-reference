import { ChangeDetectionStrategy, Component } from '@angular/core';
import { dedent } from '../../core/dedent';
import { CodeBlock } from '../../ui/code-block/code-block';
import { DocPage } from '../../ui/doc-page/doc-page';

@Component({
  selector: 'inap-tipografia-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock, DocPage],
  template: `
    <inap-doc-page section="fundamentos" slug="tipografia">
      <p>
        Montserrat es la fuente principal del manual de marca. Dancing Script es solo para acentos puntuales
        (<code>font-script</code>) y no se carga si una pantalla no la usa. Todos los estilos de Figma usan la
        escala por defecto de Tailwind: no hay tamaños nuevos que configurar.
      </p>

      <h2 id="estilos">Estilos de texto</h2>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead><tr><th scope="col">Estilo de Figma</th><th scope="col">Muestra</th><th scope="col">Tamaño / interlineado</th><th scope="col">Clases</th></tr></thead>
          <tbody>
            @for (s of styles; track s.name) {
              <tr>
                <td class="whitespace-nowrap font-semibold">{{ s.name }}</td>
                <td><span [class]="s.classes + ' text-base-content'">Formación pública</span></td>
                <td class="whitespace-nowrap">{{ s.size }}</td>
                <td><code>{{ s.classes }}</code></td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <h2 id="niveles">El estilo no es el nivel</h2>
      <ul>
        <li>«Heading/H4» es un tamaño. La etiqueta (<code>&lt;h1&gt;</code>…<code>&lt;h6&gt;</code>) la da la estructura de la página.</li>
        <li>Un solo <code>&lt;h1&gt;</code> por página y sin saltar niveles. En Información del curso, los subtítulos se ven como H5 pero son <code>&lt;h2&gt;</code>.</li>
        <li>No hay títulos pequeños en mayúsculas encima de los títulos (eyebrows). No los agreguen.</li>
      </ul>
      <inap-code-block [code]="levels" />

      <h2 id="celular">Celular</h2>
      <p>Cuando el frame Mobile usa un estilo más pequeño, se aplica con prefijos de tamaño:</p>
      <inap-code-block [code]="responsive" />

      <h2 id="color-de-texto">Color del texto</h2>
      <ul>
        <li>Texto principal: <code>text-base-content</code>.</li>
        <li>Texto secundario (descripciones, metadatos): <code>text-neutral-text</code>.</li>
        <li>Placeholder y ayuda de campos: <code>text-base-content/60</code>. Nunca <code>/50</code>.</li>
      </ul>

      <h2 id="carga">Carga de la fuente</h2>
      <p>
        <code>--font-sans</code> ya define Montserrat con sus dos nombres posibles, así que funciona con
        cualquiera de las tres formas de cargarla.
      </p>
      <inap-code-block language="CSS" [code]="font" />
    </inap-doc-page>
  `,
})
export class TipografiaPage {
  protected readonly styles = [
    { name: 'Display/Hero', size: '56 / 64 · Bold', classes: 'text-[3.5rem]/16 font-bold' },
    { name: 'Heading/H2', size: '36 / 40 · Bold', classes: 'text-4xl font-bold' },
    { name: 'Heading/H3', size: '30 / 36 · SemiBold', classes: 'text-3xl font-semibold' },
    { name: 'Heading/H4', size: '24 / 32 · SemiBold', classes: 'text-2xl font-semibold' },
    { name: 'Heading/H5', size: '20 / 28 · SemiBold', classes: 'text-xl font-semibold' },
    { name: 'Heading/H6', size: '18 / 28 · SemiBold', classes: 'text-lg font-semibold' },
    { name: 'Heading/Card', size: '16 / 24 · SemiBold', classes: 'text-base font-semibold' },
    { name: 'Body/Large', size: '18 / 28', classes: 'text-lg' },
    { name: 'Body/Base', size: '16 / 24', classes: 'text-base' },
    { name: 'Body/Small', size: '14 / 20', classes: 'text-sm' },
    { name: 'Body/Small Medium', size: '14 / 20 · Medium', classes: 'text-sm font-medium' },
    { name: 'Body/XSmall', size: '12 / 16', classes: 'text-xs' },
    { name: 'Label/Large', size: '18 / 28 · SemiBold', classes: 'text-lg font-semibold' },
    { name: 'Label/Base', size: '14 / 20 · SemiBold', classes: 'text-sm font-semibold' },
    { name: 'Label/Small', size: '12 / 16 · SemiBold', classes: 'text-xs font-semibold' },
  ];

  protected readonly levels = dedent(`
    <!-- Se ve como H5, pero es el segundo nivel de la página -->
    <h2 class="text-xl font-semibold">Requisitos</h2>
  `);

  protected readonly responsive = dedent(`
    <h1 class="text-3xl font-bold md:text-4xl">Catálogo de cursos</h1>
  `);

  protected readonly font = dedent(`
    /* Opción recomendada: fuente variable (un solo archivo para todos los pesos) */
    @import '@fontsource-variable/montserrat';

    /* --font-sans en inap-theme.css */
    --font-sans: "Montserrat Variable", "Montserrat", ui-sans-serif, system-ui, sans-serif;
  `);
}
