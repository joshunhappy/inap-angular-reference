import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavSection } from '../core/navigation';

/** Lista de páginas por sección. Se usa en la barra lateral y en el menú de celular. */
@Component({
  selector: 'inap-site-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-nav.html',
})
export class SiteNav {
  readonly sections = input.required<NavSection[]>();
}
