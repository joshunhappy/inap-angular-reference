import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  activeFilters, catalogoTemplate, countText, filterCourses, GROUPS, PAGE_SIZE, pagination, resultsGrid, Selected, Sort, sortCourses, tagsFor,
} from '../../content/plantillas/catalogo';
import { ThemeService } from '../../core/theme.service';
import { wireVista } from './vista';

/**
 * Catálogo a pantalla completa (ruta /vista/catalogo). Funciona con los 24 cursos de ejemplo:
 * filtros, etiquetas, orden, paginación (9 por página en escritorio, 6 en celular), estado vacío
 * y hoja de filtros en celular. En la plataforma, el estado vive en la URL y los datos vienen del servicio.
 */
@Component({
  selector: 'inap-catalogo-vista',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block bg-base-100 text-base-content' },
  template: `<div #page [innerHTML]="html"></div>`,
})
export class CatalogoVistaPage {
  // Contenido escrito en el código fuente del sitio, nunca del usuario.
  protected readonly html = inject(DomSanitizer).bypassSecurityTrustHtml(catalogoTemplate());
  private readonly page = viewChild.required<ElementRef<HTMLElement>>('page');

  constructor() {
    const doc = inject(DOCUMENT);
    const theme = inject(ThemeService);
    const route = inject(ActivatedRoute);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const root = this.page().nativeElement;
      const unwire = wireVista(root, doc, theme, route);
      const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = root) => el.querySelector<T>(s)!;

      const sidebar = $<HTMLFormElement>('[data-filtros]');
      const sheet = $<HTMLDialogElement>('#cat-hoja');
      const heading = $('#cat-resultados');
      const desktop = matchMedia('(min-width: 768px)');

      let sel: Selected = {};
      let sort: Sort = 'proximos';
      let page = 1;

      /** Lee los checkbox marcados de un contenedor. */
      const read = (el: ParentNode): Selected => {
        const out: Selected = {};
        el.querySelectorAll<HTMLInputElement>('input[type=checkbox]:checked').forEach((i) => (out[i.name] ??= []).push(i.value));
        return out;
      };
      /** Marca los checkbox de un contenedor según la selección. */
      const write = (el: ParentNode, s: Selected) =>
        el.querySelectorAll<HTMLInputElement>('input[type=checkbox]').forEach((i) => (i.checked = !!s[i.name]?.includes(i.value)));

      const render = () => {
        const list = sortCourses(filterCourses(sel), sort);
        const size = desktop.matches ? PAGE_SIZE.desktop : PAGE_SIZE.mobile;
        const pages = Math.max(1, Math.ceil(list.length / size));
        page = Math.min(page, pages);
        $('[data-resultados]').innerHTML = resultsGrid(list.slice((page - 1) * size, page * size));
        $('[data-conteo]').textContent = countText(list.length);
        $('[data-activos]').innerHTML = activeFilters(tagsFor(sel));
        $('[data-paginas]').innerHTML = pages > 1 ? pagination(page, pages) : '';
        write(sidebar, sel);
        const n = Object.values(sel).flat().length;
        $('[data-abrir-filtros]').textContent = n ? `Filtros (${n})` : 'Filtros';
      };
      const focusResults = () => heading.focus({ preventScroll: true });

      // Ver todas las opciones de un grupo (Áreas de formación).
      const toggleMore = (btn: HTMLElement) => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        btn.closest('details')!.querySelectorAll<HTMLElement>('[data-extra]').forEach((el) => (el.hidden = !open));
        btn.querySelector('span')!.textContent = open ? 'Ver menos' : GROUPS.find((g) => btn.closest('details')!.querySelector(`[name="${g.key}"]`))?.more ?? '';
      };

      const sheetCount = () => {
        const n = filterCourses(read(sheet)).length;
        $('[data-aplicar]', sheet).textContent = `Ver ${countText(n)}`;
      };
      const openSheet = () => {
        write(sheet, sel);
        sheet.querySelectorAll('details').forEach((d) => (d.open = !!d.querySelector('input:checked')));
        sheetCount();
        doc.documentElement.style.overflow = 'hidden';
        sheet.showModal();
      };
      const onSheetClose = () => (doc.documentElement.style.overflow = '');

      const onClick = (e: Event) => {
        const t = e.target as Element;
        const tag = t.closest<HTMLElement>('[data-quitar]');
        const pageLink = t.closest<HTMLElement>('[data-pagina]');
        const more = t.closest<HTMLElement>('[data-more]');
        if (tag) {
          const [key, value] = tag.dataset['quitar']!.split(':');
          sel = { ...sel, [key]: sel[key].filter((v) => v !== value) };
          page = 1;
          render();
          focusResults();
        } else if (t.closest('[data-limpiar]')) {
          sel = {};
          page = 1;
          render();
          focusResults();
        } else if (pageLink) {
          e.preventDefault();
          page = Number(pageLink.dataset['pagina']);
          render();
          heading.scrollIntoView({ block: 'start' });
          focusResults();
        } else if (more) {
          toggleMore(more);
        } else if (t.closest('[data-abrir-filtros]')) {
          openSheet();
        } else if (t.closest('[data-cerrar]')) {
          sheet.close();
        } else if (t.closest('[data-limpiar-hoja]')) {
          write(sheet, {});
          sheetCount();
        } else if (t.closest('[data-aplicar]')) {
          sel = read(sheet);
          page = 1;
          sheet.close();
          render();
        }
      };

      const onChange = (e: Event) => {
        const t = e.target as HTMLElement;
        if (sidebar.contains(t)) {
          sel = read(sidebar);
          page = 1;
          render();
        } else if (sheet.contains(t)) {
          sheetCount();
        } else if (t.matches('[data-orden]')) {
          sort = (t as HTMLSelectElement).value as Sort;
          page = 1;
          render();
        }
      };

      render();
      root.addEventListener('click', onClick);
      root.addEventListener('change', onChange);
      sheet.addEventListener('close', onSheetClose);
      desktop.addEventListener('change', render);
      destroyRef.onDestroy(() => {
        unwire();
        root.removeEventListener('click', onClick);
        root.removeEventListener('change', onChange);
        sheet.removeEventListener('close', onSheetClose);
        desktop.removeEventListener('change', render);
        doc.documentElement.style.overflow = '';
      });
    });
  }
}
