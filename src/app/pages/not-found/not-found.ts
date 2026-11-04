import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'inap-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="flex max-w-prose flex-col gap-4 py-12">
      <h1 class="text-3xl font-bold">No encontramos esta página</h1>
      <p class="text-neutral-text">Puede que la dirección haya cambiado. Usa el buscador o vuelve al inicio.</p>
      <p><a routerLink="/" class="btn btn-primary">Ir al inicio</a></p>
    </div>
  `,
})
export class NotFound {}
