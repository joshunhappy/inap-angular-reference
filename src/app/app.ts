import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, skip } from 'rxjs';
import { findSection } from './core/navigation';
import { MenuDialog } from './layout/menu-dialog';
import { SearchDialog } from './layout/search-dialog';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';
import { SiteNav } from './layout/site-nav';

@Component({
  selector: 'inap-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SiteHeader, SiteNav, SiteFooter, MenuDialog, SearchDialog],
  templateUrl: './app.html',
  host: { class: 'flex min-h-dvh flex-col', '(document:keydown)': 'onShortcut($event)' },
})
export class App {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly search = viewChild.required(SearchDialog);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Sección actual, para la barra lateral. */
  protected readonly section = computed(() => {
    const slug = this.url().split(/[/?#]/)[1];
    return findSection(slug);
  });

  protected readonly shortcut = signal('Ctrl K');

  constructor() {
    // Al cambiar de ruta, el foco pasa a <main> (no en la primera carga).
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), skip(1), takeUntilDestroyed())
      .subscribe(() =>
        setTimeout(() => this.doc.getElementById('contenido')?.focus({ preventScroll: true })),
      );

    afterNextRender(() => {
      if (/Mac|iPhone|iPad/.test(navigator.platform)) this.shortcut.set('⌘ K');
    });
  }

  protected onShortcut(e: KeyboardEvent): void {
    const target = e.target instanceof Element ? e.target : null;
    const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]');
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
      e.preventDefault();
      this.search().open();
    }
  }
}
