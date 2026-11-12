import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

export type InapTheme = 'inap' | 'dark';

/**
 * Tema claro/oscuro. El script de index.html pone el tema inicial antes de que arranque Angular.
 * Sigue la preferencia del dispositivo, también si cambia con la página abierta. El botón guarda
 * una elección solo cuando es distinta de la del dispositivo; un cambio del dispositivo la borra.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly key = 'inap-tema';
  private readonly media = isPlatformBrowser(inject(PLATFORM_ID))
    ? matchMedia('(prefers-color-scheme: dark)')
    : null;

  readonly theme = signal<InapTheme>(
    this.doc.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'inap',
  );

  constructor() {
    effect(() => this.doc.documentElement.setAttribute('data-theme', this.theme()));
    if (!this.media) return;
    const onChange = (e: MediaQueryListEvent) => {
      this.store(null);
      this.theme.set(e.matches ? 'dark' : 'inap');
    };
    this.media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => this.media?.removeEventListener('change', onChange));
  }

  toggle(): void {
    const next: InapTheme = this.theme() === 'dark' ? 'inap' : 'dark';
    this.theme.set(next);
    const system: InapTheme = this.media?.matches ? 'dark' : 'inap';
    this.store(next === system ? null : next);
  }

  private store(value: InapTheme | null): void {
    try {
      value ? localStorage.setItem(this.key, value) : localStorage.removeItem(this.key);
    } catch {
      /* modo privado */
    }
  }
}
