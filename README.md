# INAP Design System — referencia para Angular

Sitio de referencia del sistema de diseño del INAP (Instituto Nacional de Administración Pública, Guatemala): fundamentos, tokens, componentes, patrones y plantillas, con código listo para copiar.

- **Stack:** Angular 22 · Tailwind CSS 4.1.4 · daisyUI 5.5.19 · Lucide (`lucide-static` 0.469.0)
- **Diseño:** Figma «INAP Design System» — https://www.figma.com/design/IntROaQkiRlnkFUci5PbDu
- **Accesibilidad:** WCAG 2.1 AA

## Requisitos

Node 24 (ver `.nvmrc`).

```bash
nvm use
npm install
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor local en http://localhost:4200 |
| `npm run build` | Sitio estático en `dist/inap/browser` + CSS para WordPress |
| `npm run build:css` | Solo el CSS para WordPress: `dist/wordpress/inap.css` |
| `npm test` | Pruebas unitarias (Vitest) |

## Estilos

| Archivo | Uso |
|---|---|
| `src/styles/theme/inap-theme.css` | Tokens de color y tipografía de los temas `inap` y `dark` |
| `src/styles/theme/inap-components.css` | Ajustes de accesibilidad de los componentes daisyUI |
| `src/styles/site.css` | Entrada del sitio Angular (fuente + tema + ajustes) |
| `src/styles/wordpress.css` | Entrada del CSS para WordPress |

Los colores de marca son fijos: primario `#215AA8`, secundario `#002350`, acento `#00B3E6`.
