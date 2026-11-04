import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOKENS, minimum, token } from '../../core/tokens';
import { Contrast } from '../../ui/contrast/contrast';
import { DocPage } from '../../ui/doc-page/doc-page';

const STATES = [
  { key: 'primary', label: 'Primary', use: 'Acciones principales, enlaces, foco.' },
  { key: 'secondary', label: 'Secondary', use: 'Acciones secundarias y superficies de marca.' },
  { key: 'accent', label: 'Accent', use: 'Acentos puntuales. Como texto, siempre accent-text.' },
  { key: 'neutral', label: 'Neutral', use: 'Texto secundario y elementos neutros.' },
  { key: 'info', label: 'Info', use: 'Avisos informativos.' },
  { key: 'success', label: 'Success', use: 'Confirmaciones y estados positivos.' },
  { key: 'warning', label: 'Warning', use: 'Advertencias.' },
  { key: 'error', label: 'Error', use: 'Errores y acciones destructivas.' },
];

const SURFACES = [
  { name: 'color-base-100', use: 'Fondo de página' },
  { name: 'color-base-2', use: 'Tarjetas' },
  { name: 'color-base-3', use: 'Campos en dark, tarjetas internas' },
  { name: 'color-surface-subtle', use: 'Sección alterna' },
  { name: 'color-surface-muted', use: 'Barra de migas, «Regresar»' },
  { name: 'color-brand-surface', use: 'Superficie navy' },
];

const RAMPS = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error', 'tertiary'];
const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

@Component({
  selector: 'inap-color-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Contrast, DocPage],
  templateUrl: './color.html',
})
export class ColorPage {
  protected readonly brand = [
    { name: 'Azul INAP', hex: '#215AA8', token: 'inap-brand-blue', role: 'primary' },
    { name: 'Navy INAP', hex: '#002350', token: 'inap-brand-navy', role: 'secondary' },
    { name: 'Cian INAP', hex: '#00B3E6', token: 'inap-brand-cyan', role: 'accent' },
  ];
  protected readonly states = STATES.map((s) => ({
    ...s,
    base: token(`color-${s.key}`)!,
    content: token(`color-${s.key}-content`)!,
    text: token(`color-${s.key}-text`)!,
  }));
  protected readonly surfaces = SURFACES.map((s) => ({ ...s, t: token(s.name)! }));
  protected readonly ramps = RAMPS.map((r) => ({
    name: r,
    steps: STEPS.map((n) => token(`color-${r}-${n}`)).filter((t) => !!t),
  }));
  protected readonly categories = TOKENS.filter((t) => t.group === 'categoria' && !t.name.endsWith('-content'));
  protected readonly minimum = minimum;
}
