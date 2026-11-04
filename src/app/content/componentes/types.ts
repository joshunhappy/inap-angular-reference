/** Contenido de una página de componente. Los campos `html` son HTML propio del sitio (de confianza). */
export interface ComponentExample {
  title: string;
  description?: string;
  html: string;
  previewClass?: string;
}

export interface ComponentDoDont {
  doText: string;
  dontText: string;
  doHtml: string;
  dontHtml: string;
}

export interface ComponentSnippet {
  title: string;
  language: string;
  code: string;
}

export interface ComponentDoc {
  /** Nodo de Figma (formato 33-66), si se conoce. */
  figmaNode?: string;
  intro: string;
  examples: ComponentExample[];
  usage: { html: string; doDont?: ComponentDoDont[] };
  a11y: string;
  classes: [string, string][];
  codeNotes?: string;
  snippets?: ComponentSnippet[];
}

/** Ícono de Lucide en HTML plano, para las vistas previas. */
export function icon(name: string, size = 20, extra = ''): string {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra ? ' class="' + extra + '"' : ''}><use href="assets/lucide/sprite.svg#${name}" /></svg>`;
}
