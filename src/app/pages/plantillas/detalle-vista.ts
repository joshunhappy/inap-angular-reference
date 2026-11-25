import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { detalleTemplate } from '../../content/plantillas/detalle-de-curso';
import { ThemeService } from '../../core/theme.service';
import { wireVista } from './vista';

/**
 * Detalle de curso a pantalla completa (ruta /vista/detalle-de-curso). `?estado=` elige el estado de la
 * tarjeta de inscripción (abierta, cupoLleno, inscrito… o admin). Funcionan las tabs con scroll spy,
 * los módulos del programa, las preguntas y la barra de inscripción en celular.
 */
@Component({
  selector: 'inap-detalle-vista',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block bg-base-100 text-base-content' },
  template: `<div #page [innerHTML]="html"></div>`,
})
export class DetalleVistaPage {
  private readonly route = inject(ActivatedRoute);
  // Contenido escrito en el código fuente del sitio, nunca del usuario.
  protected readonly html = inject(DomSanitizer).bypassSecurityTrustHtml(
    detalleTemplate(this.route.snapshot.queryParamMap.get('estado') ?? 'abierta'),
  );
  private readonly page = viewChild.required<ElementRef<HTMLElement>>('page');

  constructor() {
    const doc = inject(DOCUMENT);
    const theme = inject(ThemeService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const root = this.page().nativeElement;
      const unwire = wireVista(root, doc, theme, this.route);
      const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-seccion]')];
      const sections = links.map((a) => doc.getElementById(a.dataset['seccion']!)!);
      const card = root.querySelector<HTMLElement>('[data-tarjeta]')!;
      const bar = root.querySelector<HTMLElement>('[data-barra]')!;

      // Módulos del programa: el botón alterna aria-expanded y la lista de temas.
      const onClick = (e: Event) => {
        const btn = (e.target as Element).closest<HTMLButtonElement>('button[aria-controls^="modulo-"]');
        if (!btn) return;
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        doc.getElementById(btn.getAttribute('aria-controls')!)!.hidden = !open;
      };

      // Scroll spy: la sección actual es la última cuyo inicio ya pasó bajo las tabs (64 px).
      let current = '';
      const setCurrent = (id: string) => {
        if (id === current) return;
        current = id;
        links.forEach((a) => {
          if (a.dataset['seccion'] === id) {
            a.setAttribute('aria-current', 'location');
            a.closest('ul')!.scrollTo({ left: a.parentElement!.offsetLeft - 16, behavior: 'smooth' });
          } else {
            a.removeAttribute('aria-current');
          }
        });
      };
      let frame = 0;
      const onScroll = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const passed = sections.filter((s) => s.getBoundingClientRect().top <= 72);
          setCurrent((passed.at(-1) ?? sections[0]).id);
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      // Barra de inscripción (celular): aparece cuando la tarjeta ya quedó arriba, fuera de la vista.
      const barSpy = new IntersectionObserver(([en]) => {
        bar.hidden = en.isIntersecting || en.boundingClientRect.top > 0;
      });
      barSpy.observe(card);

      root.addEventListener('click', onClick);
      destroyRef.onDestroy(() => {
        unwire();
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(frame);
        barSpy.disconnect();
        root.removeEventListener('click', onClick);
      });
    });
  }
}
