import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { dedent } from '../../core/dedent';
import { ICON_NAMES } from '../../generated/icons';
import { CodeBlock } from '../../ui/code-block/code-block';
import { DocPage } from '../../ui/doc-page/doc-page';
import { Example } from '../../ui/example/example';
import { Icon } from '../../ui/icon/icon';

const LIMIT = 120;

@Component({
  selector: 'inap-iconos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock, DocPage, Example, Icon],
  templateUrl: './iconos.html',
})
export class IconosPage {
  protected readonly total = ICON_NAMES.length;
  protected readonly query = signal('');
  protected readonly matches = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? ICON_NAMES.filter((n) => n.includes(q)) : ICON_NAMES;
  });
  protected readonly shown = computed(() => this.matches().slice(0, LIMIT));
  protected readonly limit = LIMIT;
  protected readonly copied = signal('');

  protected async copy(name: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(name);
      this.copied.set(name);
    } catch {
      /* sin permiso de portapapeles */
    }
  }

  protected readonly install = dedent(`
    npm i lucide-static@0.469.0
  `);

  protected readonly assets = dedent(`
    // angular.json → architect.build.options.assets
    { "glob": "sprite.svg", "input": "node_modules/lucide-static", "output": "assets/lucide" }
  `);

  protected readonly component = dedent(`
    import { ChangeDetectionStrategy, Component, input } from '@angular/core';

    @Component({
      selector: 'inap-icon',
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: { class: 'inline-flex shrink-0' },
      template: \`
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true" focusable="false"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <use [attr.href]="'assets/lucide/sprite.svg#' + name()" />
        </svg>\`,
    })
    export class Icon {
      readonly name = input.required<string>();
      readonly size = input(20);
    }
  `);

  protected readonly usage = dedent(`
    <!-- Decorativo: junto a un texto que ya dice lo mismo -->
    <a class="btn btn-ghost" href="/cursos"><inap-icon name="book-open" /> Cursos</a>

    <!-- Solo ícono: el botón necesita aria-label -->
    <button class="btn btn-ghost btn-square" aria-label="Buscar"><inap-icon name="search" [size]="24" /></button>
  `);

  protected readonly sizes = dedent(`
    <span class="flex items-center gap-2 text-sm text-neutral-text">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="assets/lucide/sprite.svg#calendar" /></svg>
      16 px · filas de datos
    </span>
    <span class="flex items-center gap-2">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="assets/lucide/sprite.svg#calendar" /></svg>
      20 px · por defecto
    </span>
    <span class="flex items-center gap-2 text-primary-text">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="assets/lucide/sprite.svg#calendar" /></svg>
      24 px · navegación
    </span>
  `);
}
