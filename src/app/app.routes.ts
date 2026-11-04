import { Routes } from '@angular/router';
import { SECTIONS, sectionPages } from './core/navigation';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { SectionPage } from './pages/section/section';

const placeholder = () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder);

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  ...SECTIONS.flatMap((s): Routes => [
    { path: s.slug, component: SectionPage, title: s.title, data: { section: s.slug } },
    ...sectionPages(s).map((p) => ({
      path: p.path.slice(1),
      loadComponent: p.load ?? placeholder,
      title: p.title,
      data: { section: s.slug, page: p.slug },
    })),
  ]),
  { path: '**', component: NotFound, title: 'Página no encontrada' },
];
