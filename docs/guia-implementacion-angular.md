# Guía de implementación: diseño INAP en Angular + daisyUI

Guía para el equipo de desarrollo de la plataforma de cursos (Angular + Tailwind 4.1.4 + daisyUI 5.5.19). Explica cómo instalar el tema, cómo leer los diseños de Figma y cómo pasar cada componente a código.

- **Plataforma:** Angular. WordPress usa los mismos tokens (ver `consideraciones-desarrollo.md`, punto 8), pero esta guía no lo cubre.
- **Reglas entre plataformas** (encabezado, búsqueda, sesión, breadcrumb, tema): `docs/consideraciones-desarrollo.md`. Esta guía no las repite.
- **Requisito:** WCAG 2.1 AA. 4.5:1 para texto; 3:1 para bordes, íconos y foco.

Estado de cada punto, igual que en `consideraciones-desarrollo.md`: **Decidido**, **Propuesta** o **Pendiente**.

## Índice

1. [Fuentes de verdad](#1-fuentes-de-verdad)
2. [Instalación del tema](#2-instalación-del-tema)
3. [Tema claro y oscuro en Angular](#3-tema-claro-y-oscuro-en-angular)
4. [Cómo leer Figma](#4-cómo-leer-figma)
5. [Color: qué token usar](#5-color-qué-token-usar)
6. [Tipografía](#6-tipografía)
7. [Tamaños, espaciado, radios y sombras](#7-tamaños-espaciado-radios-y-sombras)
8. [Íconos](#8-íconos)
9. [Componentes: de Figma a daisyUI](#9-componentes-de-figma-a-daisyui)
10. [Patrones de Angular](#10-patrones-de-angular)
11. [Revisión antes de entregar una pantalla](#11-revisión-antes-de-entregar-una-pantalla)
12. [Cuando cambia el diseño](#12-cuando-cambia-el-diseño)

---

## 1. Fuentes de verdad

**Decidido**

| Qué | Dónde |
|---|---|
| Diseños, componentes y variables | Figma «INAP Design System»: https://www.figma.com/design/IntROaQkiRlnkFUci5PbDu |
| Tokens de color y tipografía (código) | `src/styles/theme/inap-theme.css` |
| Ajustes de accesibilidad de componentes daisyUI | `src/styles/theme/inap-components.css` |
| Mapa del sitio | FigJam «INAP — Sitemap propuesto» |
| Manual de marca | PDF del INAP (no se incluye en este repositorio por su tamaño) |

Si Figma y el código no coinciden, manda Figma. Avísenme para corregir el archivo de tokens.

## 2. Instalación del tema

**Decidido**

### 2.1 Tokens

`inap-theme.css` reemplaza el inicio de `tailwind.css`, desde `@import 'tailwindcss';` hasta el cierre de `@layer base { ... }`, justo antes de `.text-md`. El resto del archivo se queda igual.

El archivo desactiva los temas integrados de daisyUI (`themes: false`). Solo existen los temas `inap` (predeterminado) y `dark`. Los temas de color que hoy ofrece «Cambiar tema» (cupcake, retro, etc.) dejan de existir; ver la sección 3.

### 2.2 Ajustes de componentes

Copiar `inap-components.css` e `inap-safelist.css` junto a `tailwind.css` e importarlos **al final**, después de todos los estilos de componentes:

```css
/* últimas líneas de tailwind.css */
@import './inap-components.css';
@import './inap-safelist.css';
```

`inap-components.css` va al final para que sus reglas ganen por orden a las de `tailwind.css` con la misma especificidad. Cubre botones (incluidos contorno y suave), campos, `ng-select`, checkbox, radio, toggle, badges, alertas y tabs. El detalle de cada contraste está en la sección 9.

`inap-safelist.css` obliga a Tailwind a generar todos los colores y tamaños de los componentes de daisyUI. Tailwind solo genera las clases que encuentra escritas tal cual en el código: si una plantilla arma la clase (`'btn-' + color`), sin esta lista esa clase no existe y el componente sale sin color.

### 2.3 Fuente

`--font-sans` ya define Montserrat, con los dos nombres posibles: `"Montserrat Variable"` (el que registra `@fontsource-variable/montserrat`) y `"Montserrat"` (`@fontsource/montserrat` o Google Fonts). Si su `inap-theme.css` solo tiene `"Montserrat"`, el paquete variable no se aplica y se ve la fuente del sistema. Tailwind 4 la usa como fuente por defecto, así que no hay que tocar `html` ni `body`. Solo hay que cargarla:

```bash
npm i @fontsource-variable/montserrat
```

```css
/* inicio de tailwind.css, antes de @import 'tailwindcss' */
@import '@fontsource-variable/montserrat';
```

Si prefieren pesos fijos: `@fontsource/montserrat` con los pesos 400, 500, 600 y 700, que son los que usa el diseño. Si la fuente no carga, se usa la fuente del sistema y la interfaz sigue funcionando.

Dancing Script (`font-script`) es solo para acentos puntuales. No se carga si una pantalla no la usa.

### 2.4 Atributo de tema

`<html>` lleva `data-theme="inap"` o `data-theme="dark"`. El tema `inap` es el predeterminado. Ver la sección 3.

## 3. Tema claro y oscuro en Angular

**Propuesta** (la regla general está en `consideraciones-desarrollo.md`, punto 5)

- Sin elección guardada, se sigue `prefers-color-scheme`.
- El botón «Modo oscuro» guarda la elección en `localStorage`.
- La variante `dark:` de Tailwind ya está ligada a `[data-theme=dark]`. No usar la clase `.dark`.

Para evitar un parpadeo blanco al cargar, poner el tema antes de que arranque Angular, en `index.html`:

```html
<script>
  try {
    var t = localStorage.getItem('inap-tema');
    if (t !== 'inap' && t !== 'dark') {
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'inap';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'inap');
  }
</script>
```

Servicio (Angular 17+; adaptar si usan una versión anterior):

```ts
import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type InapTheme = 'inap' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly key = 'inap-tema';

  readonly theme = signal<InapTheme>(
    (this.doc.documentElement.getAttribute('data-theme') as InapTheme) ?? 'inap'
  );

  constructor() {
    effect(() => this.doc.documentElement.setAttribute('data-theme', this.theme()));
  }

  toggle(): void {
    const next: InapTheme = this.theme() === 'dark' ? 'inap' : 'dark';
    this.theme.set(next);
    try { localStorage.setItem(this.key, next); } catch { /* modo privado */ }
  }
}
```

El botón usa `aria-pressed`, para que el lector de pantalla anuncie si el modo oscuro está activo:

```html
<button type="button" class="btn btn-ghost" [attr.aria-pressed]="theme.theme() === 'dark'" (click)="theme.toggle()">
  <inap-icon name="moon" /> Modo oscuro
</button>
```

«Cambiar tema» (temas de color de daisyUI) queda fuera del rediseño.

## 4. Cómo leer Figma

**Decidido**

### 4.1 Páginas y pantallas

- Componentes: páginas «Web Components» y una página por familia (Button, Form Fields, Selection Controls, Badge, Alert, Brand).
- Pantallas: páginas **Desktop Light, Desktop Dark, Mobile Light y Mobile Dark**. Las pantallas de Light son componentes; las de Dark son instancias con el modo de color `dark`. Por eso Dark no se diseña aparte: es el mismo HTML con `data-theme="dark"`. Si algo se ve distinto en Dark, es un token, no una regla CSS nueva.
- Nombre de los frames: `{Pantalla} • {Desktop|Mobile} • {Light|Dark} • {estado}`. Por ejemplo, `Curso • Desktop • Light • Cupo lleno`. Cada estado es un frame; implementen todos.

### 4.2 Variables = clases de Tailwind

En Dev Mode, cada variable muestra su nombre de código (code syntax), que es la variable CSS de `inap-theme.css`:

| Figma muestra | Clase de Tailwind |
|---|---|
| `var(--color-primary-text)` | `text-primary-text`, `border-primary-text`, `outline-primary-text` |
| `var(--color-surface-subtle)` | `bg-surface-subtle` |
| `color-mix(in oklab, var(--color-base-content) 60%, transparent)` | `text-base-content/60` |
| `color-mix(in oklab, var(--color-primary) 8%, var(--color-base-100))` | fondo soft de daisyUI (`badge-soft`, `alert-soft`); no hace falta escribirlo |
| `calc(var(--spacing) * 6)` | `p-6`, `gap-6`, etc. (24 px) |
| `var(--radius-box)` | `rounded-box` |
| `var(--text-sm)` + `var(--text-sm--line-height)` | `text-sm` |
| `Shadow/md` | `shadow-md` |

Reglas:

- **No copiar hex.** Si Dev Mode muestra un hex sin variable, pregúntenme: probablemente falta enlazarlo.
- **No usar el CSS que genera Figma tal cual.** Sirve para ver valores, no como código final. El código final usa clases de daisyUI y Tailwind.

### 4.3 Sufijos en nombres de capa

| Sufijo | Significa | En código |
|---|---|---|
| `• sr-only` | No se ve, pero debe estar en el HTML para lectores de pantalla | Clase `sr-only`. Nunca `hidden`, `display: none` ni `visibility: hidden` |
| `hotspot/*` | Zona de clic del prototipo | No se implementa |

### 4.4 Contenido provisional

Estadísticas, testimonios, conteos de cursos y los módulos de ejemplo del programa son **provisionales** hasta que Comunicación Social o DIFOGI entreguen el contenido real. Tampoco se fijan en el código áreas, tipos de curso ni opciones de filtro: siempre vienen de los datos.

## 5. Color: qué token usar

**Decidido**

Los colores de marca son exactos: primary `#215AA8`, secondary `#002350`, accent `#00B3E6`. Cuando uno no alcanza el contraste en un uso, se usa su token `-text`, no otro tono.

| Necesito… | Uso | No uso |
|---|---|---|
| Fondo de botón o elemento sólido | `bg-primary text-primary-content` (igual con cada color) | — |
| Texto, ícono o borde de color sobre fondo claro u oscuro | `text-primary-text`, `border-accent-text`… | `text-primary`, `text-accent`: accent da 2.44:1 sobre blanco y primary no pasa en dark |
| Anillo de foco | `outline-{color}-text` (2 px + 2 px de separación) | `outline-{color}` |
| Texto principal | `text-base-content` | negro o gris fijo |
| Texto secundario (descripciones, metadatos) | `text-neutral-text` | `text-base-content/60` sobre `surface-subtle` (no pasa) |
| Placeholder y ayuda de campos | `text-base-content/60` | `/50` (3.43:1) |
| Borde de campos y controles | `border-base-border` | `border-base-200`, `border-base-300`, `base-content/20` (1.3–1.5:1) |
| Divisor decorativo (no identifica un control) | `border-base-200` | — |
| Fondo de página | `bg-base-100` | — |
| Tarjetas | `bg-base-2` (dark: `#2b3440`) | — |
| Campos en dark, tarjetas internas | `bg-base-3` | — |
| Sección alterna (estadísticas, áreas, testimonios) | `bg-surface-subtle` | `bg-base-200` |
| Barra del breadcrumb / enlace «Regresar» | `bg-surface-muted` | — |
| Superficie navy (barra superior, sección institucional, footer) | `bg-brand-surface text-brand-surface-content`; secundario `text-brand-surface-muted`; divisores `border-brand-surface-line` | `bg-secondary`: en dark `secondary` es `#a4bad9` |
| Color que **no** cambia con el tema (degradado sobre foto, flechas del carrusel, ondas) | `inap-brand-navy`, `inap-brand-blue`, `inap-brand-cyan`; trazos de las ondas `inap-blue-100`; hover del botón blanco y de las flechas `inap-neutral-100` | `secondary`, `primary`, `primary-100`, `neutral-100` (estas rampas se invierten en dark) |
| Logo | Variante Auto: `logo-primary` / `logo-accent` (marca en claro, blanco en oscuro) | — |
| Brillo decorativo del CTA | `glow-primary`, `glow-accent` | — |
| Estados (inscripción abierta, cupo lleno…) | `badge-soft badge-{success\|info\|warning\|error\|neutral}` | colores de categoría |
| Categorías (garbo, royal, deep, danger) | solo `badge-soft` | `badge-outline` ni sólido |

Las rampas `primary-50 … primary-900` (y las demás) **invierten su orden en dark**. Sirven para matices dentro de un componente, no para superficies que deben adaptarse al tema: para eso están los tokens semánticos de la tabla.

**Decidido:** `inap-blue-100` (`#e0edfe`) e `inap-neutral-100` (`#eaeff3`) están en el bloque `@theme` de `inap-theme.css` como colores fijos. Son los únicos primitivos de Figma que se usan directo en componentes, además de los tres de marca. Ejemplo: `stroke-inap-blue-100` en las ondas, `hover:bg-inap-neutral-100` en el botón blanco.

## 6. Tipografía

**Decidido.** Todos los estilos de texto de Figma usan la escala por defecto de Tailwind, así que no hay tamaños nuevos que configurar.

| Estilo de Figma | Tamaño / interlineado | Clases |
|---|---|---|
| Display/Hero | 56 / 64, Bold | `text-[3.5rem]/16 font-bold` |
| Heading/H2 | 36 / 40, Bold | `text-4xl font-bold` |
| Heading/H3 | 30 / 36, SemiBold | `text-3xl font-semibold` |
| Heading/H4 | 24 / 32, SemiBold | `text-2xl font-semibold` |
| Heading/H5 | 20 / 28, SemiBold | `text-xl font-semibold` |
| Heading/H6 | 18 / 28, SemiBold | `text-lg font-semibold` |
| Heading/Card | 16 / 24, SemiBold | `text-base font-semibold` |
| Body/Large | 18 / 28 | `text-lg` |
| Body/Base | 16 / 24 | `text-base` |
| Body/Small | 14 / 20 | `text-sm` |
| Body/Small Medium | 14 / 20, Medium | `text-sm font-medium` |
| Body/XSmall | 12 / 16 | `text-xs` |
| Label/Large | 18 / 28, SemiBold | `text-lg font-semibold` |
| Label/Base | 14 / 20, SemiBold | `text-sm font-semibold` |
| Label/Small | 12 / 16, SemiBold | `text-xs font-semibold` |

- **El estilo no es el nivel.** «Heading/H4» es un tamaño; la etiqueta (`<h1>`…`<h6>`) la da la estructura de la página. Un solo `<h1>` por página y sin saltar niveles. Ejemplo: en Información del curso, los subtítulos se ven como H5 pero son `<h2>`.
- **Celular:** cuando el frame Mobile usa un estilo más pequeño, se aplica con prefijos (`text-3xl md:text-4xl`).
- No hay títulos pequeños en mayúsculas encima de los títulos (eyebrows) en el diseño. No los agreguen.

## 7. Tamaños, espaciado, radios y sombras

**Decidido**

### 7.1 Tamaño de controles

En Figma, el tamaño de botones, campos y controles no es una variante: es el modo de la colección **Control size** (xs, sm, md, lg, xl) aplicado a la instancia. Corresponde 1:1 con las clases de tamaño de daisyUI:

| Modo en Figma | Altura | Botón | Campo | Uso |
|---|---|---|---|---|
| xs | 24 px | `btn-xs` | `input-xs` | — |
| sm | 32 px | `btn-sm` | `input-sm` | Acciones secundarias en tablas |
| **md** (por defecto) | 40 px | `btn` | `input` | Escritorio |
| lg | 48 px | `btn-lg` | `input-lg` | **Todos los botones en celular**, hero |
| xl | 56 px | `btn-xl` | `input-xl` | — |

Igual para `select-*`, `checkbox-*`, `radio-*`, `toggle-*` y `badge-*`. En celular, todo lo interactivo tiene un área táctil mínima de 44 × 44 px. Si el elemento es más pequeño (indicadores del carrusel, enlaces de texto), la zona de clic se amplía con padding.

### 7.2 Espaciado

Figma usa la escala de Tailwind (`--spacing` = 4 px). `calc(var(--spacing) * N)` = `p-N`, `gap-N`, `m-N`. No usar valores arbitrarios (`p-[13px]`). Si un valor no cae en la escala, pregúntenme.

Contenedor de página: ancho máximo y márgenes laterales según el frame (escritorio 1440 de ancho de diseño). Usar el mismo contenedor en navbar, breadcrumb y contenido para que todo quede alineado.

### 7.3 Radios

| Token | Valor | Clase | Uso |
|---|---|---|---|
| `--radius-field` | 4 px | `rounded-field` | Botones, campos y checkbox (daisyUI lo aplica solo; el checkbox, por `inap-components.css`) |
| `--radius-box` | 12 px | `rounded-box` | Tarjetas, alertas, menús, hojas |
| `--radius-selector` | 16 px | `rounded-selector` | Toggle, badge (daisyUI lo aplica solo) |
| — | 8 / 16 px | `rounded-lg`, `rounded-2xl` | Imágenes y miniaturas, según el frame |
| — | completo | `rounded-full` | Avatar, chips, indicadores, flechas del carrusel |

### 7.4 Sombras

`Shadow/sm`, `Shadow/md` y `Shadow/lg` de Figma = `shadow-sm`, `shadow-md` y `shadow-lg`.

## 8. Íconos

**Decidido.** Lucide, `lucide-static` **v0.469.0**. En Figma, los componentes se llaman `Icon/{nombre exacto de lucide.dev}`; ese es el nombre que se usa en código.

```bash
npm i lucide-static@0.469.0
```

`angular.json` → `assets`:

```json
{ "glob": "sprite.svg", "input": "node_modules/lucide-static", "output": "assets/lucide" }
```

Componente:

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'inap-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true" focusable="false"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <use [attr.href]="'assets/lucide/sprite.svg#' + name()" />
    </svg>`,
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input(20);
}
```

- `viewBox="0 0 24 24"` es obligatorio: los símbolos del sprite de Lucide no lo traen, y sin él los íconos de 16 y 20 px se ven recortados.
- El ícono toma el color del texto (`currentColor`). Para cambiarlo, usen la clase de color en el elemento padre (`text-primary-text`).
- Tamaños: 16 en filas de datos (Fact Row), 20 por defecto, 24 en navegación.
- Los íconos son decorativos (`aria-hidden`). Un botón que **solo** tiene ícono necesita `aria-label`: `<button class="btn btn-ghost btn-square" aria-label="Buscar">`.
- Lucide no tiene versión rellena. Los íconos rellenos del diseño (pausa y reproducción del carrusel) se exportan desde Figma como SVG.

## 9. Componentes: de Figma a daisyUI

### 9.1 Base: componentes de daisyUI

**Decidido.** Los ajustes de accesibilidad ya están en `inap-components.css` (sección 2.2). Con ese archivo importado, las clases de daisyUI se usan tal cual.

| Componente en Figma | Clases | Notas |
|---|---|---|
| **Button** (Color × State) | `btn btn-{color}` | Foco: `outline-{color}-text`, ya en el archivo |
| **Button Outline** | `btn btn-outline btn-{color}` | En reposo, texto y borde en `{color}-text` (con el color base, accent da 2.44 en claro y primary 2.46 en dark). Ya en el archivo |
| **Button Soft** | `btn btn-soft btn-{color}` | Texto en `{color}-text`, ya en el archivo. `btn-primary-light` y `btn-secondary-light` siguen existiendo; el hover pasa a `bg-primary` / `bg-secondary` (4.25 → 6.79) |
| **Button Ghost** | `btn btn-ghost` | Foco en `base-content` |
| Button `Color=White` | `btn border-white bg-white text-inap-brand-navy hover:bg-inap-neutral-100` | Solo sobre fotos. Igual en los dos temas |
| **Input / Select / Textarea** | `input`, `select`, `textarea` (+ `floating-label-*` existentes) | Borde `base-border`, foco `primary-text` + halo, error `-error`. Mensaje de ayuda: `text-base-content/60`; error: `text-error-text` |
| **Field** (etiqueta + campo + ayuda + error) | `<label for>` + `input` + `<p>` de ayuda | Etiqueta siempre visible arriba (`Label/Base`). Ayuda `text-base-content/60`, enlazada con `aria-describedby`. `State=Error`: `input-error`, `aria-invalid="true"`, mensaje con ícono `circle-alert` en `text-error-text`. Enlace opcional a la derecha de la etiqueta |
| Input con ícono (`Show icon`) | `label.input` con el ícono dentro | Para mostrar la contraseña, el ícono es un `<button type="button">` con `aria-label` y `aria-pressed` |
| Campo `Style=Ghost` | `input-ghost` | Solo donde el campo ya se identifica (buscador con ícono). En formularios, la variante normal |
| **Checkbox / Radio / Toggle** | `checkbox`, `radio`, `toggle` + `-{color}` | Sin marcar: borde `base-border`. Radio y toggle marcados usan `-text`. Checkbox cuadrado (`--radius-field`) |
| **Badge** / **Badge Soft** / **Badge Outline** | `badge badge-{color}`, `badge-soft`, `badge-outline` | Los badges no son interactivos. Si quitan un filtro, son botones (Filter Tag). Soft y outline: texto en `{color}-text`, ya en el archivo |
| **Alert** / **Alert Soft** / **Alert Outline** | `alert alert-{color}`, `alert-soft`, `alert-outline`, `alert-dash` | Layout Vertical: `alert-vertical sm:alert-horizontal` |

Accesibilidad de alertas: `role="status"` para confirmaciones y avisos; `role="alert"` solo para errores urgentes. Ícono con `aria-hidden="true"`. Botón de cerrar con `aria-label="Cerrar aviso"`. Una alerta con acciones no se oculta sola.

Tamaño: ver 7.1. Estado deshabilitado: atributo `disabled` (daisyUI lo pinta); en enlaces con estilo de botón, `btn-disabled` + `aria-disabled="true"` + `tabindex="-1"`.

### 9.2 Componentes del sitio

**Propuesta.** Base de daisyUI sugerida para cada componente de «Web Components». Medidas, espaciado y texto: del frame en Figma.

| Componente en Figma | Base sugerida | Notas de comportamiento |
|---|---|---|
| Navbar (Platform=Angular, Session) | `navbar` en `<header>` | Escritorio 92 px, celular 84 px. Barra superior `bg-brand-surface`. Buscador del Home oculto hasta que el del hero sale de vista (10.3) |
| Mega Menu `Menu=Cursos` | `dropdown` + panel | Botón con `aria-expanded`; Esc cierra y devuelve el foco al botón |
| Mobile Menu, «Mi cuenta», búsqueda en celular | `<dialog class="modal">` a pantalla completa | Encabezado y pie fijos, solo el centro se desplaza. Ver `consideraciones-desarrollo.md` §2 |
| User Button + User Menu | `dropdown dropdown-end` + `menu` | Botón con `aria-haspopup="menu"` y `aria-expanded` |
| Menu Item `State=Current` | `menu` + `aria-current="page"` | |
| Avatar (S/M/L) | `avatar avatar-placeholder` | Iniciales `bg-primary text-primary-content` |
| Logo (`Variant=Auto`) | SVG en línea con `fill="var(--color-logo-primary)"` y `var(--color-logo-accent)` | 109 px de ancho mínimo (manual de marca). `<a href="/" aria-label="INAP, inicio">` |
| Audience Toggle | `join` de dos botones o `<fieldset>` con radios | Es una selección única: `role="radiogroup"` o radios reales. Seleccionado: `bg-base-2`, borde 2 px y texto `primary-text` |
| Hero Search, Nav Search | `input` con ícono (`label.input`) | `<form role="search">`, `aria-label` en el campo |
| Search Suggest | `menu` en panel | Patrón combobox: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` |
| Carousel (Control, Indicator, Autoplay) | `p-carousel` de PrimeNG + botón de pausa propio | Ver el correo «Home — título oculto (H1), carrusel destacado y colores de marca fijos» (correo del 26 oct. 2026) |
| Course Card, Course Type Card, Area Card | `card` (`bg-base-2 rounded-box`) | Toda la tarjeta es clicable con un solo enlace en el título y `after:absolute after:inset-0`; no anidar enlaces |
| Course Thumbnail | `<img>` con `aspect-video object-cover` | `alt=""` si el título del curso está al lado |
| Tag | `badge badge-soft badge-{primary\|accent}` (Neutral: `badge badge-soft`) + `text-xs font-semibold` | |
| Status Badge | `badge badge-soft` (fondo neutro) + punto `size-2 rounded-full bg-{tono}-text` | El texto dice el estado; el punto es decorativo (`aria-hidden`) |
| Chip | `<button>` o `<a>` con `h-9 rounded-full border-base-border px-4 text-sm font-medium` | Si filtra, `aria-pressed`; seleccionado con `aria-pressed:bg-secondary aria-pressed:text-secondary-content` e ícono `check` |
| Section Header | `<h2>` + texto `text-neutral-text` + enlace | Sin eyebrow |
| Stat, Testimonial Card | `stat`, `card` | Contenido provisional |
| FAQ Item | `collapse collapse-arrow` con `<details>`/`<summary>` | Teclado nativo, sin JS |
| Breadcrumb | `breadcrumbs` en `<nav aria-label="Breadcrumb">` | Último elemento con `aria-current="page"`. Solo escritorio |
| Tabs del curso | `tabs tabs-border` como **enlaces** | No son pestañas ARIA. Ver 10.4. Tab inactiva en `neutral-text` (daisyUI usa `base-content/50`, 3.45), ya en `inap-components.css` |
| Enrollment Card / Enrollment Bar | `<section aria-label="Inscripción">` `rounded-2xl bg-base-2 p-6` / barra `sticky bottom-0 lg:hidden` | Un componente con entrada `state` (Próximamente, Abierta, Último día, Cerrada, Cupo lleno, En curso (provisional), Inscrito, Saldo pendiente, Aprobado). Acción principal `btn-primary` o `btn-outline btn-primary`, nunca deshabilitada. La barra aparece cuando la tarjeta sale de vista (10.3) y respeta `env(safe-area-inset-bottom)` |
| Fact Row, Checklist Item, Module Row | `<dl>` (ícono dentro del `<dt>`) / `<ul>` / `<h3><button aria-expanded aria-controls>` | Íconos `aria-hidden`: 16 px en Fact Row y temas, 24 px `circle-check` en `success-text`. Número del módulo decorativo, «Módulo n:» en `sr-only` |
| Instructor | foto `size-22 rounded-full` + texto | Sin foto: ícono `user-round` sobre `surface-subtle`. Nombre en `<h3>`, `alt=""`. Cargo y reseña son campos nuevos propuestos |
| Edition Alert, Edition Row | `rounded-xl bg-surface-subtle p-4` + enlace / fila con Status Badge | El aviso es contenido con enlace, sin `role="alert"` ni `role="status"`. Reemplaza la lista de ediciones en el detalle público |
| Admin Bar | `bg-brand-surface` + `<nav aria-label="Administración del curso">` con enlaces `text-xs font-semibold`; en celular `dropdown` | Solo para usuarios con permisos; cada acción según su permiso. Foco `outline-brand-surface-content`. Botón «Acciones» de 44 px en celular |
| Filter Option, Filter Group Header | `checkbox` + `<label>`; grupo con `<fieldset>` + `<legend>` o `collapse` | Conteo dentro de la etiqueta |
| Filter Tag | `<button class="badge …">` | `aria-label="Quitar filtro: {nombre}"` |
| Pagination | `join` de botones en `<nav aria-label="Paginación">` | Página actual con `aria-current="page"` |
| Catalog Empty State | texto + `btn` «Limpiar filtros» | |
| Password Rule (Pending / Met / Unmet) | `<ul>` enlazada al campo con `aria-describedby` | Ícono 16 px `aria-hidden`; el estado se dice con texto `sr-only` («cumple», «no cumple»). Met en `success-text`, Unmet en `error-text` |
| Auth / Desktop, Auth / Mobile | plantilla de `/login`, `/registro`, `/recuperar-contrasena` | Ver `consideraciones-desarrollo.md` §3. En celular, campos y botones en tamaño `lg` |

Para cualquier componente que no esté aquí, usen la base de daisyUI más cercana y respeten los tokens de la sección 5. Si no hay una base clara, pregúntenme antes de crear una clase nueva.

### 9.3 Clases personalizadas

- Las clases propias van en `tailwind.css`, con `@apply` y los tokens. Nada de hex ni de tonos `-300`/`-500` para texto o bordes.
- Prefijo para clases nuevas: `inap-` (por ejemplo, `.inap-course-card`), para distinguirlas de las de daisyUI.
- Antes de agregar un color nuevo, revisen si existe un token. Si no existe, se agrega primero en Figma.

## 10. Patrones de Angular

**Propuesta**

### 10.1 Estructura de cada página

```html
<a href="#contenido" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn btn-primary">
  Saltar al contenido principal
</a>
<header> … <nav aria-label="Principal"> … </nav> </header>
<main id="contenido" tabindex="-1" class="outline-none">
  <h1>…</h1>
  …
</main>
<footer> … </footer>
```

`href="#contenido"` funciona aquí porque el enlace solo lleva el foco. Para la navegación con anclas, ver 10.4.

### 10.2 Título y foco al cambiar de ruta

Angular no anuncia el cambio de página. Cada ruta lleva `title` (por ejemplo, `'Catálogo de cursos | INAP'`). Al terminar la navegación, el foco pasa a `<main>`:

```ts
// app.component.ts
private readonly router = inject(Router);
private readonly doc = inject(DOCUMENT);

constructor() {
  this.router.events
    .pipe(filter((e) => e instanceof NavigationEnd), skip(1), takeUntilDestroyed())
    .subscribe(() => setTimeout(() => this.doc.getElementById('contenido')?.focus({ preventScroll: true })));
}
```

`skip(1)` evita mover el foco en la primera carga.

### 10.3 Mostrar u ocultar según lo que está en pantalla

Tres comportamientos dependen de si un elemento está a la vista: buscador de la barra en el Home, Enrollment Bar en celular y scroll spy de las tabs. Una directiva sirve para los tres:

```ts
import { Directive, ElementRef, afterNextRender, inject, input, output, DestroyRef } from '@angular/core';

@Directive({ selector: '[inapInView]', standalone: true })
export class InViewDirective {
  readonly inapInView = output<boolean>();
  readonly rootMargin = input('0px');

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const io = new IntersectionObserver(([entry]) => this.inapInView.emit(entry.isIntersecting), {
        rootMargin: this.rootMargin(),
      });
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
```

```html
<!-- Home: el buscador de la barra aparece cuando el del hero sale de vista -->
<form role="search" (inapInView)="heroSearchVisible.set($event)">…</form>
```

Lo que se oculta se quita del orden de tabulación: `@if`, o `inert` + `invisible`. Ocultarlo solo con `opacity-0` no basta.

### 10.4 Anclas (tabs del curso)

La app tiene `<base href="/frontend/webinap/">`, así que `href="#programa"` llevaría a la raíz y no a la sección. Usar `routerLink` con `fragment`:

```ts
// app.config.ts
provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }))
```

```html
<nav aria-label="Secciones del curso" class="tabs tabs-border sticky top-0 z-10 bg-base-100">
  @for (s of secciones; track s.id) {
    <a class="tab" [routerLink]="[]" [fragment]="s.id"
       [class.tab-active]="activa() === s.id"
       [attr.aria-current]="activa() === s.id ? 'true' : null">{{ s.label }}</a>
  }
</nav>
<section id="programa" class="scroll-mt-16" (inapInView)="$event && activa.set('programa')">…</section>
```

Detalle completo: correo «Detalle de curso: tabs fijas con scroll spy, tarjeta de inscripción y barra inferior» (correo del 27 oct. 2026).

### 10.5 Movimiento

- Desplazamiento suave solo con `motion-safe:scroll-smooth`.
- Transiciones y animaciones (carrusel, `shine-hover`, `text-rotate`) con `motion-safe:` o desactivadas bajo `prefers-reduced-motion: reduce`.
- Autoplay del carrusel: no arranca con movimiento reducido; se detiene con hover o foco y con el botón de pausa.

### 10.6 Diálogos

Menú móvil, «Mi cuenta», búsqueda móvil y filtros del catálogo usan `<dialog>` con `showModal()`. Así se obtiene gratis el foco atrapado, Esc para cerrar y el fondo inerte. Al cerrar, el foco regresa al botón que lo abrió.

### 10.7 Enlaces

- Entre Angular y WordPress: misma pestaña, sin ícono externo.
- Aula Virtual: `target="_blank" rel="noopener"`, ícono `arrow-up-right` y `<span class="sr-only">(se abre en una pestaña nueva)</span>`.

## 11. Revisión antes de entregar una pantalla

- [ ] Coincide con los frames de Figma en **escritorio y celular**, en **claro y oscuro**, y en **todos los estados**.
- [ ] No hay hex, tonos `-300`/`-500` para texto o bordes, ni `secondary` como navy fijo.
- [ ] Texto de color con tokens `-text`. Bordes de campos con `base-border`.
- [ ] Un solo `<h1>`. Niveles de título en orden. Capas `• sr-only` presentes con `sr-only`.
- [ ] Todo funciona con teclado: orden lógico, foco visible en cada elemento, Esc cierra menús y diálogos.
- [ ] Áreas táctiles de 44 px en celular; botones `btn-lg`.
- [ ] Botones de solo ícono con `aria-label`. Imágenes con `alt` correcto (vacío si son decorativas).
- [ ] Con `prefers-reduced-motion: reduce` no hay animaciones automáticas.
- [ ] Zoom al 200 % y ancho de 320 px sin scroll horizontal.
- [ ] Sin errores en la auditoría de accesibilidad de Lighthouse o axe DevTools.
- [ ] El contenido provisional está marcado; ninguna lista de áreas o tipos está fija en el código.

## 12. Cuando cambia el diseño

**Decidido**

1. Cualquier cambio de token se hace primero en Figma y después en `inap-theme.css`. Los dos archivos se mantienen iguales.
2. Los cambios de componentes llegan por correo y, si aplican a toda la plataforma, se agregan a `inap-components.css`.
3. Las reglas entre plataformas se agregan a `consideraciones-desarrollo.md`.
4. Si encuentran algo en Figma que no se puede implementar, o un caso que el diseño no cubre, escríbanme antes de resolverlo por su cuenta.

Contacto: Josh De La Cruz, Diseñador UX/UI, asesor.ucosip@inap.gob.gt
