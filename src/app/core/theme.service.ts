import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type InapTheme = 'inap' | 'dark';

/** Tema claro/oscuro. El script de index.html pone el tema inicial antes de que arranque Angular. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly key = 'inap-tema';

  readonly theme = signal<InapTheme>(
    this.doc.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'inap',
  );

  constructor() {
    effect(() => this.doc.documentElement.setAttribute('data-theme', this.theme()));
  }

  toggle(): void {
    const next: InapTheme = this.theme() === 'dark' ? 'inap' : 'dark';
    this.theme.set(next);
    try {
      localStorage.setItem(this.key, next);
    } catch {
      /* modo privado */
    }
  }
}
