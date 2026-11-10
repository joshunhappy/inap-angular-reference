import { CAROUSEL_CLASSES } from '../../content/componentes/sitio-home';

const ALL_POS = [...new Set(Object.values(CAROUSEL_CLASSES.pos).join(' ').split(' '))];
const INTERVAL = 6000;
const MOVE: KeyframeAnimationOptions = { duration: 500, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' };

/**
 * Comportamiento de demostración del carrusel en la vista previa (`[data-carousel]`).
 * En la plataforma se usa p-carousel de PrimeNG; esto solo hace funcionar el ejemplo.
 * Devuelve una función que detiene el temporizador y quita los eventos.
 */
export function initCarouselDemo(root: HTMLElement): () => void {
  const track = root.querySelector<HTMLElement>('[data-carousel-track]')!;
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')]
    .sort((a, b) => +a.dataset['slide']! - +b.dataset['slide']!);
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]')];
  const toggle = root.querySelector<HTMLButtonElement>('[data-carousel-toggle]')!;
  const n = slides.length;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let userPaused = reduced;
  let hold = false; // cursor o foco dentro del carrusel
  let timer: ReturnType<typeof setInterval> | undefined;

  const render = () => {
    const order: [number, keyof typeof CAROUSEL_CLASSES.pos][] = [
      [(active - 1 + n) % n, 'prev'], [active, 'current'], [(active + 1) % n, 'second'], [(active + 2) % n, 'next'],
    ];
    const placed = new Set(order.map(([i]) => i));
    slides.forEach((_, i) => { if (!placed.has(i)) order.push([i, 'rest']); });
    for (const [i, pos] of order) {
      const el = slides[i];
      el.classList.remove(...ALL_POS);
      el.classList.add(...CAROUSEL_CLASSES.pos[pos].split(' '));
      el.inert = pos !== 'current' && pos !== 'second';
      track.append(el);
    }
    dots.forEach((d, i) => {
      const on = i === active;
      d.classList.toggle('md:w-8', on);
      on ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current');
      d.firstElementChild!.className = on ? CAROUSEL_CLASSES.dotOn : CAROUSEL_CLASSES.dotOff;
    });
  };

  /**
   * Desliza con FLIP: mide cada diapositiva antes y después de reordenar y anima la diferencia.
   * La que entra llega desde el lado; la que sale se va con una copia que se desvanece.
   */
  const viewport = track.parentElement!;
  const go = (i: number, dir = i > active ? 1 : -1) => {
    const next = (i + n) % n;
    if (next === active) return;
    viewport.querySelectorAll('[data-slide-ghost]').forEach(g => g.remove());
    const before = slides.map(el => (el.offsetParent ? el.getBoundingClientRect() : null));
    const shown = before.filter((r): r is DOMRect => !!r).sort((a, b) => a.left - b.left);
    const step = shown.length > 1 ? shown[1].left - shown[0].left : track.clientWidth;
    slides.forEach(el => el.getAnimations().forEach(a => a.cancel()));

    active = next;
    render();
    if (reduced) return;

    const box = viewport.getBoundingClientRect();
    slides.forEach((el, k) => {
      const from = before[k];
      const to = el.offsetParent ? el.getBoundingClientRect() : null;
      if (from && to) {
        el.animate([{ transform: `translateX(${from.left - to.left}px)` }, { transform: 'none' }], MOVE);
      } else if (to) {
        el.animate([{ transform: `translateX(${dir * step}px)`, opacity: 0 }, { transform: 'none' }], MOVE);
      } else if (from) {
        const ghost = el.cloneNode(true) as HTMLElement;
        ghost.removeAttribute('data-slide');
        ghost.setAttribute('data-slide-ghost', '');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.inert = true;
        ghost.classList.remove('hidden');
        ghost.classList.add('flex');
        Object.assign(ghost.style, { position: 'absolute', margin: '0', left: `${from.left - box.left}px`, top: `${from.top - box.top}px`, width: `${from.width}px`, height: `${from.height}px` });
        viewport.append(ghost);
        ghost.animate([{ transform: 'none' }, { transform: `translateX(${-dir * step}px)`, opacity: 0 }], MOVE).finished
          .then(() => ghost.remove(), () => ghost.remove());
      }
    });
  };

  const sync = () => {
    clearInterval(timer);
    timer = undefined;
    const rotating = !userPaused && !hold;
    if (rotating) timer = setInterval(() => go(active + 1, 1), INTERVAL);
    track.setAttribute('aria-live', userPaused ? 'polite' : 'off');
    toggle.setAttribute('aria-label', userPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
    toggle.querySelector('use')?.setAttribute('href', `assets/lucide/sprite.svg#${userPaused ? 'play' : 'pause'}`);
  };

  let touchX: number | null = null;
  const on: [EventTarget, string, EventListener][] = [
    [root.querySelector('[data-carousel-prev]')!, 'click', () => go(active - 1, -1)],
    [root.querySelector('[data-carousel-next]')!, 'click', () => go(active + 1, 1)],
    [toggle, 'click', () => { userPaused = !userPaused; sync(); }],
    [root, 'mouseenter', () => { hold = true; sync(); }],
    [root, 'mouseleave', () => { hold = root.contains(document.activeElement); sync(); }],
    [root, 'focusin', () => { hold = true; sync(); }],
    [root, 'focusout', (e) => { hold = root.contains((e as FocusEvent).relatedTarget as Node) || root.matches(':hover'); sync(); }],
    [track, 'touchstart', (e) => { touchX = (e as TouchEvent).touches[0].clientX; hold = true; sync(); }],
    [track, 'touchend', (e) => {
      const dx = (e as TouchEvent).changedTouches[0].clientX - (touchX ?? 0);
      if (touchX !== null && Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      touchX = null; hold = false; sync();
    }],
    ...dots.map((d, i) => [d, 'click', () => go(i)] as [EventTarget, string, EventListener]),
  ];
  on.forEach(([t, type, fn]) => t.addEventListener(type, fn));
  // Los enlaces de ejemplo no navegan.
  const noNav = (e: Event) => { if ((e.target as Element).closest('a[href="#"]')) e.preventDefault(); };
  root.addEventListener('click', noNav);

  render();
  sync();
  return () => {
    clearInterval(timer);
    on.forEach(([t, type, fn]) => t.removeEventListener(type, fn));
    root.removeEventListener('click', noNav);
  };
}
