import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FIGMA_URL, SECTIONS } from '../core/navigation';
import { ThemeService } from '../core/theme.service';
import { Icon } from '../ui/icon/icon';
import { Logo } from '../ui/logo/logo';

@Component({
  selector: 'inap-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon, Logo],
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly theme = inject(ThemeService);
  protected readonly sections = SECTIONS;
  protected readonly figmaUrl = FIGMA_URL;

  /** Etiqueta del atajo: «Ctrl K» o «⌘ K». */
  readonly shortcut = input('Ctrl K');
  readonly openMenu = output<void>();
  readonly openSearch = output<void>();
}
