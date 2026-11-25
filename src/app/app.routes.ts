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
  // Plantillas a pantalla completa, sin la navegación del sitio (se muestran en un iframe).
  { path: 'vista/home', loadComponent: () => import('./pages/plantillas/home-vista').then((m) => m.HomeVistaPage), title: 'Home · vista completa' },
  { path: 'vista/catalogo', loadComponent: () => import('./pages/plantillas/catalogo-vista').then((m) => m.CatalogoVistaPage), title: 'Catálogo · vista completa' },
  { path: '**', component: NotFound, title: 'Página no encontrada' },
];
