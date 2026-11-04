import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPage } from '../../ui/doc-page/doc-page';

@Component({
  selector: 'inap-accesibilidad-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, RouterLink],
  template: `
    <inap-doc-page section="fundamentos" slug="accesibilidad">
      <p>
        Requisito para la plataforma de cursos y el sitio institucional: <strong>WCAG 2.1 AA</strong>. Los tokens y
        los ajustes de componentes ya cumplen el contraste; estas reglas cubren lo que depende del HTML.
      </p>

      <h2 id="contraste">Contraste</h2>
      <ul>
        <li>4.5:1 para texto; 3:1 para bordes de controles, íconos y anillo de foco.</li>
        <li>Cuando un color de marca no alcanza, se usa su token <code>-text</code>. Ver <a routerLink="/fundamentos/color">Color</a>.</li>
        <li>El color no basta por sí solo: un badge o una alerta dice su significado con texto.</li>
      </ul>

      <h2 id="estructura">Estructura</h2>
      <ul>
        <li>Primer elemento enfocable: «Saltar al contenido principal».</li>
        <li>Regiones: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code> con <code>aria-label</code>, <code>&lt;main&gt;</code> y <code>&lt;footer&gt;</code>.</li>
        <li>Un solo <code>&lt;h1&gt;</code> por página. El tamaño visual no cambia el nivel del encabezado.</li>
        <li>Capas de Figma con el sufijo <code>• sr-only</code>: van en el HTML con la clase <code>sr-only</code>, nunca con <code>hidden</code>.</li>
      </ul>

      <h2 id="teclado">Teclado y foco</h2>
      <ul>
        <li>Todo lo que se hace con el ratón se hace con el teclado, en un orden lógico.</li>
        <li>Anillo de foco visible en cada elemento interactivo (<code>focus-visible</code>).</li>
        <li>Esc cierra menús y diálogos, y el foco regresa al botón que los abrió.</li>
        <li>Al cambiar de ruta, el foco pasa a <code>&lt;main&gt;</code> y el título de la pestaña cambia.</li>
      </ul>

      <h2 id="contenido">Imágenes, íconos y enlaces</h2>
      <ul>
        <li>Imágenes con <code>alt</code> que describe; <code>alt=""</code> si son decorativas o el texto de al lado ya lo dice.</li>
        <li>Botones de solo ícono con <code>aria-label</code>.</li>
        <li>Enlaces que abren otra pestaña: <code>&lt;span class="sr-only"&gt;(se abre en una pestaña nueva)&lt;/span&gt;</code>.</li>
      </ul>

      <h2 id="celular">Celular y zoom</h2>
      <ul>
        <li>Áreas táctiles de 44 × 44 px como mínimo.</li>
        <li>Al 200 % de zoom y a 320 px de ancho no hay desplazamiento horizontal.</li>
      </ul>

      <h2 id="revision">Cómo revisar</h2>
      <ul>
        <li>Navegar la pantalla completa solo con teclado (Tab, Shift+Tab, Enter, Esc, flechas).</li>
        <li>Auditoría de Lighthouse o axe DevTools sin errores.</li>
        <li>Probar con VoiceOver (macOS) o NVDA (Windows) los flujos principales: buscar, filtrar, inscribirse.</li>
      </ul>
    </inap-doc-page>
  `,
})
export class AccesibilidadPage {}
