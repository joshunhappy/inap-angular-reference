import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPage } from '../../ui/doc-page/doc-page';

@Component({
  selector: 'inap-cambios-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage],
  template: `
    <inap-doc-page section="primeros-pasos" slug="cambios">
      <p>Figma y el código se mantienen iguales. Así llegan los cambios:</p>
      <ol>
        <li>Un cambio de token se hace primero en Figma y después en <code>inap-theme.css</code>.</li>
        <li>Los cambios de componentes llegan por correo y, si aplican a toda la plataforma, se agregan a <code>inap-components.css</code>.</li>
        <li>Las reglas entre Angular y WordPress se agregan a <code>docs/consideraciones-desarrollo.md</code>.</li>
        <li>
          Si encuentran algo en Figma que no se puede implementar, o un caso que el diseño no cubre, escríbanme antes
          de resolverlo por su cuenta.
        </li>
      </ol>

      <h2 id="estados">Estado de cada página</h2>
      <p>Cada página de este sitio lleva uno de estos estados, los mismos de los documentos del repositorio:</p>
      <ul>
        <li><strong>Decidido:</strong> aprobado; se implementa así.</li>
        <li><strong>Propuesta:</strong> diseño listo, pendiente de confirmar con el equipo o con INAP.</li>
        <li><strong>Pendiente:</strong> falta una decisión o un dato.</li>
      </ul>

      <h2 id="contacto">Contacto</h2>
      <p>
        Josh De La Cruz, Diseñador UX/UI<br />
        <a href="mailto:asesor.ucosip@inap.gob.gt">asesor.ucosip&#64;inap.gob.gt</a>
      </p>
    </inap-doc-page>
  `,
})
export class CambiosPage {}
