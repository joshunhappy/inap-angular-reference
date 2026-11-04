import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { SECTIONS } from '../core/navigation';
import { Icon } from '../ui/icon/icon';
import { Logo } from '../ui/logo/logo';
import { SiteNav } from './site-nav';

/** Menú completo para pantallas sin barra lateral ni enlaces superiores. */
@Component({
  selector: 'inap-menu-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Logo, SiteNav],
  template: `
    <dialog #dlg class="modal modal-start" aria-labelledby="menu-title">
      <div class="modal-box flex h-full max-h-none w-80 max-w-[85vw] flex-col rounded-none p-0">
        <div class="flex h-21 shrink-0 items-center justify-between border-b border-base-300 px-4">
          <h2 id="menu-title" class="sr-only">Menú</h2>
          <a routerLink="/" aria-label="INAP Design System, inicio" class="rounded-field"><inap-logo /></a>
          <button type="button" class="btn btn-ghost btn-square" aria-label="Cerrar menú" (click)="close()">
            <inap-icon name="x" [size]="24" />
          </button>
        </div>
        <nav aria-label="Principal" class="grow overflow-y-auto px-3 py-6">
          <inap-site-nav [sections]="sections" />
        </nav>
      </div>
      <form method="dialog" class="modal-backdrop"><button>Cerrar</button></form>
    </dialog>
  `,
})
export class MenuDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  protected readonly sections = SECTIONS;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.close());
  }

  open(): void {
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    const dlg = this.dialog().nativeElement;
    if (dlg.open) dlg.close();
  }
}
