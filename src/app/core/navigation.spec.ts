import { ALL_PAGES, SECTIONS, findPage, findSection } from './navigation';

describe('navigation', () => {
  it('no repite rutas', () => {
    const paths = [...SECTIONS.map((s) => `/${s.slug}`), ...ALL_PAGES.map((p) => p.path)];
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('usa slugs en minúsculas, sin acentos ni espacios', () => {
    for (const p of ALL_PAGES) expect(p.path).toMatch(/^\/[a-z0-9-]+\/[a-z0-9-]+$/);
  });

  it('encuentra secciones y páginas', () => {
    expect(findSection('componentes')?.title).toBe('Componentes');
    expect(findPage('componentes', 'boton')?.title).toBe('Botón');
    expect(findPage('componentes', 'no-existe')).toBeUndefined();
  });
});
