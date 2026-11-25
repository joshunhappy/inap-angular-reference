import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../core/theme.service';

/**
 * Comportamiento común de las vistas completas de plantillas (/vista/…): tema por ?tema=,
 * enlaces de ejemplo que no salen de la vista, formularios que no se envían y el botón
 * «Modo oscuro» de la barra. Devuelve la función que quita los listeners.
 */
export function wireVista(root: HTMLElement, doc: Document, theme: ThemeService, route: ActivatedRoute): () => void {
  const tema = route.snapshot.queryParamMap.get('tema');
  if (tema === 'dark' || tema === 'inap') theme.theme.set(tema);

  // Con <base href="/">, «#id» iría al inicio del sitio: se enfoca el destino en su lugar.
  const onClick = (e: Event) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[href="/"]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('href')!.slice(1);
    const target = id && id !== '/' ? doc.getElementById(id) : null;
    if (!target) return;
    // Respeta scroll-margin-top del destino (p. ej. bajo tabs fijas).
    target.scrollIntoView({ block: 'start' });
    target.focus({ preventScroll: true });
  };
  const onSubmit = (e: Event) => e.preventDefault();

  const darkButton = [...root.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')]
    .find((b) => b.textContent?.includes('Modo oscuro'));
  const syncDark = () => darkButton?.setAttribute('aria-pressed', String(doc.documentElement.getAttribute('data-theme') === 'dark'));
  const onDark = () => {
    theme.toggle();
    setTimeout(syncDark);
  };
  syncDark();

  root.addEventListener('click', onClick);
  root.addEventListener('submit', onSubmit);
  darkButton?.addEventListener('click', onDark);
  return () => {
    root.removeEventListener('click', onClick);
    root.removeEventListener('submit', onSubmit);
    darkButton?.removeEventListener('click', onDark);
  };
}
