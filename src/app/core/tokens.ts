import { TOKENS, Token, TokenGroup } from '../generated/tokens';

export type { Token, TokenGroup };
export { TOKENS };

export const GROUP_LABELS: Record<TokenGroup, string> = {
  marca: 'Marca (fijos)',
  semanticos: 'Semánticos',
  superficies: 'Superficies',
  decorativos: 'Decorativos',
  categoria: 'Categorías',
  rampas: 'Rampas',
  forma: 'Forma',
  tipografia: 'Tipografía',
};

export function token(name: string): Token | undefined {
  return TOKENS.find((t) => t.name === name);
}

/** Mínimo WCAG que debe cumplir el token, o null si es decorativo. */
export function minimum(t: Token): number | null {
  if (!t.against) return null;
  if (t.name.endsWith('-line')) return null;
  if (t.name === 'color-base-border') return 3;
  return 4.5;
}

export function cssVar(name: string): string {
  return `var(--${name})`;
}
