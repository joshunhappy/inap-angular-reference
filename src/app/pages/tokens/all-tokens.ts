import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { GROUP_LABELS, TOKENS, Token, TokenGroup, minimum } from '../../core/tokens';
import { Contrast } from '../../ui/contrast/contrast';
import { DocPage } from '../../ui/doc-page/doc-page';

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

@Component({
  selector: 'inap-all-tokens-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Contrast, DocPage],
  templateUrl: './all-tokens.html',
})
export class AllTokensPage {
  protected readonly groups = Object.entries(GROUP_LABELS) as [TokenGroup, string][];
  protected readonly query = signal('');
  protected readonly group = signal<TokenGroup | ''>('');

  protected readonly filtered = computed(() => {
    const q = normalize(this.query().trim());
    const g = this.group();
    return TOKENS.filter(
      (t) =>
        (!g || t.group === g) &&
        (!q || normalize(`${t.name} ${t.utility ?? ''} ${t.light} ${t.dark}`).includes(q)),
    );
  });

  protected readonly label = (g: TokenGroup) => GROUP_LABELS[g];
  protected readonly minimum = minimum;
  protected readonly isColor = (t: Token) => t.name.startsWith('color-');
}
