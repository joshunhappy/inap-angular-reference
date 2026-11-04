import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SECTIONS } from '../../core/navigation';
import { Icon } from '../../ui/icon/icon';

@Component({
  selector: 'inap-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './home.html',
})
export class Home {
  protected readonly sections = SECTIONS;
  protected readonly principles = [
    { icon: 'accessibility', title: 'Accesible por defecto', text: 'Todo cumple WCAG 2.1 AA: 4.5:1 para texto y 3:1 para bordes, íconos y foco.' },
    { icon: 'palette', title: 'La marca no se negocia', text: 'Primario #215AA8, secundario #002350 y acento #00B3E6. Si un color no da contraste, se usa su token -text.' },
    { icon: 'figma', title: 'Figma manda', text: 'Cada token y componente existe primero en Figma. Si el código no coincide, se corrige el código.' },
    { icon: 'braces', title: 'Un solo CSS', text: 'Este proyecto genera el CSS de la plataforma de cursos y del sitio institucional.' },
  ];
}
