import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Logo oficial del INAP en línea. Colores: tokens logo-primary y logo-accent
 * (azul y cian en el tema inap, blanco en dark). Ancho mínimo en web: 109 px.
 */
@Component({
  selector: 'inap-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-[109px]' },
  templateUrl: './logo.html',
})
export class Logo {}
