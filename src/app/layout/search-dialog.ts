import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ALL_PAGES, PageRef } from '../core/navigation';
import { Icon } from '../ui/icon/icon';

const normalize = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

interface Indexed {
  page: PageRef;
  title: string;
  text: string;
}

const INDEX: Indexed[] = ALL_PAGES.map((page) => ({
  page,
  title: normalize(page.title),
  text: normalize([page.section.title, page.description, ...(page.keywords ?? [])].join(' ')),
}));

/** Búsqueda de páginas (Ctrl/⌘ K o /). Patrón combobox con lista de opciones. */
@Component({
  selector: 'inap-search-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './search-dialog.html',
})
export class SearchDialog {
  private readonly router = inject(Router);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('q');

  protected readonly query = signal('');
  protected readonly active = signal(0);

  protected readonly results = computed<PageRef[]>(() => {
    const q = normalize(this.query());
    if (!q) return ALL_PAGES;
    const words = q.split(/\s+/);
    return INDEX.map((i) => {
      const all = `${i.title} ${i.text}`;
      if (!words.every((w) => all.includes(w))) return null;
      const score = i.title.startsWith(q) ? 0 : i.title.includes(q) ? 1 : 2;
      return { page: i.page, score };
    })
      .filter((r): r is { page: PageRef; score: number } => r !== null)
      .sort((a, b) => a.score - b.score)
      .map((r) => r.page);
  });

  protected readonly activeId = computed(() =>
    this.results().length ? `search-opt-${this.active()}` : null,
  );

  open(): void {
    const dlg = this.dialog().nativeElement;
    if (dlg.open) return;
    this.query.set('');
    this.active.set(0);
    dlg.showModal();
    const input = this.input().nativeElement;
    input.value = '';
    input.focus();
    // En la primera apertura, la transición de visibilidad de daisyUI aún no termina y el
    // campo no acepta el foco; se intenta otra vez al terminar la transición.
    dlg.addEventListener(
      'transitionend',
      () => {
        if (dlg.open && document.activeElement !== input) input.focus();
      },
      { once: true },
    );
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.active.set(0);
  }

  protected onKeydown(e: KeyboardEvent): void {
    const count = this.results().length;
    if (!count) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      this.active.update((i) => (i + step + count) % count);
      this.scrollActiveIntoView();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.go(this.results()[this.active()]);
    }
  }

  protected go(page: PageRef): void {
    this.dialog().nativeElement.close();
    this.router.navigateByUrl(page.path);
  }

  private scrollActiveIntoView(): void {
    queueMicrotask(() =>
      this.dialog()
        .nativeElement.querySelector(`#search-opt-${this.active()}`)
        ?.scrollIntoView({ block: 'nearest' }),
    );
  }
}
