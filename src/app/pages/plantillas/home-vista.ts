import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { homeTemplate, SEARCH_PLACEHOLDER } from '../../content/plantillas/home';
import { ThemeService } from '../../core/theme.service';
import { initCarouselDemo } from '../../ui/example/carousel-demo';

/**
 * Home a pantalla completa, sin la navegación del sitio de referencia (ruta /vista/home).
 * La página de la plantilla lo muestra en un iframe, así los cambios de celular a escritorio
 * dependen del ancho real, como en la plataforma. `?tema=dark|inap` fija el tema.
 */
@Component({
  selector: 'inap-home-vista',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block bg-base-100 text-base-content' },
  template: `<div #page [innerHTML]="html"></div>`,
})
export class HomeVistaPage {
  // Contenido escrito en el código fuente del sitio, nunca del usuario.
  protected readonly html = inject(DomSanitizer).bypassSecurityTrustHtml(homeTemplate());
  private readonly page = viewChild.required<ElementRef<HTMLElement>>('page');

  constructor() {
    const doc = inject(DOCUMENT);
    const theme = inject(ThemeService);
    const route = inject(ActivatedRoute);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const tema = route.snapshot.queryParamMap.get('tema');
      if (tema === 'dark' || tema === 'inap') theme.theme.set(tema);

      const root = this.page().nativeElement;
      const stops = [...root.querySelectorAll<HTMLElement>('[data-carousel]')].map(initCarouselDemo);

      // Selector de audiencia: cambia el marcador de posición del buscador.
      const input = root.querySelector<HTMLInputElement>('[data-home-search] input');
      const onAudience = (e: Event) => {
        const t = e.target as HTMLInputElement;
        if (t.name === 'home-audiencia' && input) input.placeholder = SEARCH_PLACEHOLDER[t.value as keyof typeof SEARCH_PLACEHOLDER];
      };

      // Filtros de cursos destacados: un solo chip presionado (demostración, no filtra).
      const onChip = (e: Event) => {
        const chip = (e.target as Element).closest('[data-home-chips] button');
        if (!chip) return;
        chip.parentElement!.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === chip)));
      };

      // Enlaces de ejemplo: no salen de la vista. Con <base href="/">, «#id» iría al inicio del sitio.
      const onClick = (e: Event) => {
        onChip(e);
        const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[href="/"]');
        if (!a) return;
        e.preventDefault();
        const id = a.getAttribute('href')!.slice(1);
        if (id && id !== '/') doc.getElementById(id)?.focus();
      };
      const onSubmit = (e: Event) => e.preventDefault();

      // «Modo oscuro» de la barra superior.
      const darkButton = [...root.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')]
        .find((b) => b.textContent?.includes('Modo oscuro'));
      const syncDark = () => darkButton?.setAttribute('aria-pressed', String(doc.documentElement.getAttribute('data-theme') === 'dark'));
      const onDark = () => {
        theme.toggle();
        setTimeout(syncDark);
      };
      syncDark();

      root.addEventListener('change', onAudience);
      root.addEventListener('click', onClick);
      root.addEventListener('submit', onSubmit);
      darkButton?.addEventListener('click', onDark);
      destroyRef.onDestroy(() => {
        stops.forEach((stop) => stop());
        root.removeEventListener('change', onAudience);
        root.removeEventListener('click', onClick);
        root.removeEventListener('submit', onSubmit);
        darkButton?.removeEventListener('click', onDark);
      });
    });
  }
}
