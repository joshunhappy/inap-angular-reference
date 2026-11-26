import { ComponentExample, ComponentSnippet } from '../componentes/types';

/** Una sección de la página de patrón: texto, ejemplo opcional y código. HTML propio del sitio (de confianza). */
export interface PatternSection {
  id: string;
  title: string;
  html: string;
  example?: ComponentExample;
  snippets?: ComponentSnippet[];
}

export interface PatternDoc {
  intro: string;
  sections: PatternSection[];
  /** Dónde se usa: [texto, ruta del sitio]. */
  usedIn: [string, string][];
}
