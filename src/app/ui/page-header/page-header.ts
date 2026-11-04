import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Status } from '../../core/navigation';
import { Icon } from '../icon/icon';
import { StatusBadge } from '../status-badge/status-badge';

export interface Crumb {
  label: string;
  link: string;
}

/** Encabezado de página: migas de pan, título, estado, descripción y enlace a Figma. */
@Component({
  selector: 'inap-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, StatusBadge],
  templateUrl: './page-header.html',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly status = input<Status>();
  readonly crumbs = input<Crumb[]>([]);
  readonly figma = input<string>();
}
