# Consideraciones de desarrollo: plataforma de cursos (Angular) y sitio institucional (WordPress)

Documento de referencia para el equipo de desarrollo. Reúne las reglas que aplican a todo el rediseño y no a una sola pantalla. Se actualiza a medida que se toman decisiones.

Estado de cada punto:

- **Decidido:** acordado, se implementa así.
- **Propuesta:** recomendación de diseño, pendiente de confirmar.
- **Pendiente:** falta información o una decisión.

## Índice

1. [Plataformas y alcance](#1-plataformas-y-alcance)
2. [Encabezado y pie de página](#2-encabezado-y-pie-de-página)
3. [Inicio de sesión y registro](#3-inicio-de-sesión-y-registro)
4. [Búsqueda](#4-búsqueda)
5. [Tema claro y oscuro](#5-tema-claro-y-oscuro)
6. [Enlaces entre sitios y Aula Virtual](#6-enlaces-entre-sitios-y-aula-virtual)
7. [Migas de pan](#7-migas-de-pan)
8. [Tokens y estilos compartidos](#8-tokens-y-estilos-compartidos)
9. [Contenido editable](#9-contenido-editable)
10. [Accesibilidad común](#10-accesibilidad-común)
11. [Notas por pantalla](#11-notas-por-pantalla)

---

## 1. Plataformas y alcance

**Decidido**

| Plataforma | Contenido | Implementa |
|---|---|---|
| **Angular** (plataforma de cursos) | Home, catálogo, búsqueda, detalle de curso, inicio de sesión y registro, cuenta y perfil, módulos de administración, perfil institucional | Equipo de desarrollo |
| **WordPress** (sitio institucional) | Fortalecimiento institucional, Recursos, Institución, Noticias, Eventos, Transparencia, Contacto. Una landing propia se diseñará más adelante | Josh De La Cruz |
| **Moodle** (Aula Virtual) | Aula virtual de los cursos | Sin cambios |

- Todo lo diseñado hasta ahora en Figma corresponde a Angular.
- Los cursos se sirven desde Angular. Si WordPress muestra cursos, enlaza a Angular.

## 2. Encabezado y pie de página

**Decidido**

- Cada plataforma implementa su propio encabezado y pie. No hay un componente compartido entre ambas.
- **El diseño es el mismo en las dos:** colores, tipografía, medidas, espaciado y comportamiento. El usuario no debe notar el cambio de plataforma.
- **El contenido del menú es propio de cada plataforma.** Fortalecimiento, Recursos e Institución pertenecen a WordPress y no van en el menú de Angular. El menú de WordPress se administra desde WordPress, sin tocar Angular.
- Solo Angular tiene la versión con sesión iniciada: botón de usuario y menú desplegable de cuenta.
- En Figma, los componentes Navbar y Mobile Menu tienen la propiedad **Platform** (`WordPress` / `Angular`). Las pantallas de Home, Curso y Cuenta usan `Angular`.

**Contenido del menú de Angular** (sigue la oferta actual de https://inap.gob.gt/app/)

| Zona | Opciones |
|---|---|
| Barra superior | Portal institucional (enlace a WordPress), Ayuda · Aula virtual, Modo oscuro |
| Barra principal | **Cursos** (desplegable), Áreas de formación, Programas, Cómo inscribirse · buscador · Iniciar sesión / Regístrate o botón de usuario |
| Desplegable «Cursos» (Mega Menu `Menu=Cursos`) | Agenda académica: Cursos con opción a certificación, Cursos y diplomados, Estudios de posgrado, Investigación y asesoría técnica. Empieza aquí: Para servidores públicos, Para gobiernos locales. Destacado: Oferta Académica (PDF) |
| Celular | Cursos (se expande con las mismas opciones), Áreas de formación, Programas, Cómo inscribirse. Bloque azul oscuro: Aula Virtual, Portal institucional, Ayuda. Al final: Modo oscuro e Iniciar sesión / Regístrate o «Mi cuenta» |

**Barra y menú en celular, con sesión iniciada** (Decidido)

- La barra muestra tres botones: lupa, avatar y menú.
  - **Lupa:** abre la búsqueda a pantalla completa con búsquedas recientes, populares y tipos de curso. Al escribir, muestra sugerencias de cursos.
  - **Avatar:** abre «Mi cuenta» a pantalla completa, con las opciones que corresponden al rol del usuario.
  - **Menú:** abre el menú principal.
- **Barra superior siempre visible:** al abrir cualquiera de los tres (búsqueda, «Mi cuenta» o menú), la barra con el logo de INAP y el botón de cerrar se queda arriba. El usuario siempre sabe dónde está y cómo salir.
- **Búsqueda:** el campo de búsqueda va debajo de esa barra, con el mismo patrón que «Mi cuenta» y el menú.
- **Menú principal:** el encabezado (logo y cerrar) queda fijo arriba y el pie (Modo oscuro y la fila de cuenta) queda fijo abajo. Solo la lista del medio se desplaza. La lista lleva un relleno inferior igual a la altura del pie, para que al llegar al final ninguna opción quede detrás del pie.
**Barra y menú en celular, sin sesión iniciada** (Decidido)

- La barra muestra la lupa, el botón **«Regístrate»** y el menú. Es el patrón de la mayoría de sitios y deja a la vista la acción principal para un usuario nuevo.
- En el menú principal, «Iniciar sesión» y «Regístrate» van en el pie fijo, con el mismo comportamiento de encabezado y pie fijos que con sesión iniciada.

**«Mi cuenta» con sesión iniciada**

- **«Mi cuenta» del administrador:** la sección «Administración» empieza cerrada. Es un botón con `aria-expanded` que muestra u oculta los módulos. Mi aprendizaje, Aula Virtual, Configuración y Cerrar sesión siempre están visibles.

## 3. Inicio de sesión y registro

**Decidido**

- La sesión existe solo en Angular. WordPress no sabe si el usuario inició sesión.
- WordPress muestra siempre «Iniciar sesión» y «Regístrate». Enlazan a las páginas de inicio de sesión y registro de Angular (`/login` y `/registro`).
- **Usuario con sesión ya iniciada:** si entra a `/login` o `/registro` (por ejemplo, desde WordPress), Angular no muestra el formulario. Lo lleva directamente a la plataforma con su sesión. Así el usuario no cree que perdió la sesión al ver «Iniciar sesión» en WordPress.

- El destino de esa redirección es el **Home** de Angular, igual que después de iniciar sesión. El sistema ya lo valida (confirmado por Pablo, 29 oct 2026).

## 4. Búsqueda

**Decidido**

- Cada plataforma tiene su propia búsqueda, con el mismo diseño del buscador.
- **Angular:** busca cursos. Muestra sugerencias mientras se escribe y lleva a `/busqueda`.
- **WordPress:** busca noticias y páginas del sitio institucional, como se muestra en el diseño.
- **Sugerencias:** ninguna plataforma muestra resultados de la otra. Las dos usan la misma estructura (componente Search Suggest, propiedad `Platform`):
  - **Sin escribir:** búsquedas recientes, populares (chips) y un grupo para explorar.
  - **Al escribir:** sugerencias de texto con la coincidencia en negrita, resultados agrupados por tipo (ícono, título y una línea de detalle) y «Ver todos los resultados para “…”».

| Grupo | Angular | WordPress |
|---|---|---|
| Explorar (sin escribir) | Explora por tipo: tipos de curso | Explora por sección: Noticias, Transparencia |
| Resultados (al escribir) | Cursos y programas · Área de formación | Noticias y eventos · Páginas |
| Línea de detalle | Tipo · área · edición | Tipo · fecha, o sección · tipo de documento |
- **Enlace a la plataforma de cursos (solo WordPress):** al final de las sugerencias, en los dos estados, va «¿Buscas cursos? Ir a la plataforma de cursos». Lleva a la búsqueda de Angular (`/busqueda`); si ya hay texto escrito, lo envía como `?q=…`. Es un enlace entre sitios: abre en la misma pestaña y no lleva ícono de enlace externo (ver punto 6). No muestra resultados de Angular.
- **Buscador de la barra en el Home de Angular:** empieza oculto, porque el Home ya tiene el buscador principal en el hero. Aparece cuando el buscador del hero sale de la vista al desplazarse, y se oculta de nuevo al regresar arriba (por ejemplo, con `IntersectionObserver`). En las demás páginas, el buscador de la barra siempre está visible. En los diseños, las pantallas del Home ya muestran el buscador de la barra oculto (opacidad 0 %); solo las pantallas de Curso lo muestran visible.
- **Placeholder del buscador:** Angular «Busca cursos, diplomados o temas»; WordPress «Busca noticias, eventos o páginas».

## 5. Tema claro y oscuro

**Propuesta**

- Ambas plataformas siguen por defecto la preferencia del dispositivo (`prefers-color-scheme`).
- El botón «Modo oscuro» guarda la elección del usuario en cada plataforma por separado (por ejemplo, en `localStorage`). Un usuario que lo cambie en una puede tener que cambiarlo de nuevo en la otra.
- Los dos temas usan los tokens de `inap-theme.css` (ver punto 8).

## 6. Enlaces entre sitios y Aula Virtual

**Propuesta**

- Los enlaces entre Angular y WordPress abren en la misma pestaña y no llevan ícono de enlace externo: para el usuario es un solo sitio. Usan URL absolutas.
- **Aula Virtual (Moodle)** es el único destino externo. Abre en otra pestaña, lleva el ícono `arrow-up-right` y un texto para lectores de pantalla: `<span class="sr-only">(se abre en una pestaña nueva)</span>`.

**Decidido**

- **Escritorio:** Aula Virtual va en la barra superior, en todas las páginas, con o sin sesión. En Angular también va en el menú de usuario.
- **Celular:** en el menú principal va en el bloque azul oscuro con la apariencia de la barra superior de escritorio. En Angular también va en «Mi cuenta».

## 7. Migas de pan

**Decidido**

- Cada plataforma tiene sus propias migas de pan y nunca cruzan a la otra.
- En Angular, la primera miga es «Inicio» y lleva al Home de Angular.
- En celular no se muestran migas de pan, solo el enlace para regresar.

**Pendiente**

- Destino del logo de INAP en WordPress: Home de Angular o la futura landing de WordPress.

## 8. Tokens y estilos compartidos

**Decidido**

- La fuente de verdad de colores, tipografía y espaciado son las variables de Figma, exportadas a `src/styles/theme/inap-theme.css`.
- Angular usa los tokens con Tailwind 4.1.4 y daisyUI 5.5.19. WordPress carga el CSS compilado de este repositorio, `dist/wordpress/inap.css` (`npm run build:css`), con los mismos tokens y ajustes.
- Cualquier cambio de token se hace en Figma y en `inap-theme.css`, y se aplica en las dos plataformas.
- Íconos: Lucide (`lucide-static` v0.469.0) en ambas.
- Ajustes de accesibilidad de componentes daisyUI: `src/styles/theme/inap-components.css`, importado al final de `tailwind.css`.
- Cómo aplicar el diseño en Angular (instalación, tokens, componentes y patrones): `docs/guia-implementacion-angular.md`.

## 9. Contenido editable

**Decidido**

- Por ahora, lo único editable del diseño son los cursos, que se administran en Angular.
- El Home solo muestra contenido de la plataforma, no contenido de WordPress (noticias o eventos).

**Propuesta**

- El carrusel del Home se alimenta de los cursos, con una opción «Destacado» en la administración de cursos. Así no se necesita un desarrollador para cambiarlo.

**Pendiente**

- Estadísticas y testimonios del Home: son contenido provisional hasta que Comunicación Social lo entregue. Se definirá entonces si son editables o fijos.

## 10. Accesibilidad común

**Decidido.** Requisito: WCAG 2.1 AA en ambas plataformas.

- **Contraste:** 4.5:1 para texto y 3:1 para bordes, íconos y anillo de foco. Usar los tokens `-text` cuando un color de marca no alcance el contraste.
- **Enlace para saltar al contenido:** primer elemento enfocable de cada página: «Saltar al contenido principal».
- **Regiones:** `<header>`, `<nav>` con `aria-label`, `<main>` y `<footer>`.
- **Títulos:** un solo `<h1>` por página. El tamaño visual no cambia el nivel del encabezado.
- **Foco:** anillo de foco visible en todos los elementos interactivos (`focus-visible`).
- **Áreas táctiles:** mínimo 44 × 44 px en celular.
- **Movimiento:** respetar `prefers-reduced-motion` en carruseles, desplazamientos y animaciones.
- **Enlaces que abren otra pestaña:** se anuncian a los lectores de pantalla (ver punto 6).
- **Badges y alertas:** en soft, outline y dash, el texto usa el token `-text` del color. El fondo soft es opaco (el color al 8 % mezclado con `base-100`), no translúcido, para que el contraste no cambie dentro de tarjetas. Los colores de categoría (garbo, royal, deep, danger) solo se usan en soft. El texto del badge o el título de la alerta dice el significado; el color no basta por sí solo.
- **Alertas:** `role="status"` para confirmaciones y avisos; `role="alert"` solo para errores urgentes. Icono con `aria-hidden="true"`. El botón de cerrar lleva `aria-label="Cerrar aviso"`. Una alerta con acciones no se oculta sola.

## 11. Notas por pantalla

- Home: correo «Home — título oculto (H1), carrusel destacado y colores de marca fijos» (correo del 26 oct. 2026)
- Home en celular (Figma: `Home / Mobile`, pantallas `Mobile • Light • Person` e `Institution`):
  - **Lupa de la barra:** sigue la regla del punto 4. Empieza oculta y aparece cuando el buscador del hero sale de la vista.
  - **Carrusel, Cursos destacados, filtros y testimonios:** se desplazan en horizontal con el dedo y dejan ver parte de la siguiente tarjeta. El carrusel no lleva flechas, pero conserva los indicadores y el botón de pausa.
  - **Populares:** mismos enlaces de texto subrayados que en escritorio, no chips. La etiqueta «Populares:» va arriba y los enlaces pasan a la siguiente línea cuando no caben.
  - **Áreas táctiles:** indicadores, pausa, chips y enlaces de texto tienen 44 px de alto o de área táctil.
  - **Botones:** todos usan el tamaño `lg` (48 px) en celular, incluido «Regístrate» de la barra.
  - **Placeholder del buscador del Home (celular y escritorio):** cambia con el selector. «Para ti»: «¿Qué quieres aprender hoy?». «Para tu institución»: «¿Qué necesita aprender tu equipo?».
  - **Tipos de curso, áreas de formación y pasos:** se apilan en una columna. Los tipos de curso quedan apilados por decisión de diseño.
- Detalle de curso: correo «Detalle de curso: tabs fijas con scroll spy, tarjeta de inscripción y barra inferior» (correo del 27 oct. 2026)
- Catálogo de cursos (Figma: `Catalog / Desktop`, `Catalog / Mobile`, `Catalog Filters / Mobile`; pantallas «Catálogo • …» en Desktop Light y Mobile Light). **Decidido** (aprobado 2026-11-03):
  - **Una sola página de catálogo con filtros.** Hoy hay una página por tipo (`/categoria/...`) y otra por área (`/area-formacion/...`). Esos enlaces abren el catálogo con el filtro ya aplicado; el título y la descripción cambian al del tipo o área, y las migas muestran «Catálogo de cursos › {tipo o área}».
  - **Filtros en la URL** (por ejemplo `?tipo=certificacion&inscripcion=abierta`), para que se puedan compartir y el botón Atrás funcione.
  - **Grupos de filtros:** Tipo de formación, Nivel de certificación, Área de formación, Modalidad e Inscripción (Abierta / Próximamente). Las opciones y los conteos vienen de los datos, nunca fijos en el código. Área muestra 5 y «Ver las N áreas».
  - **Escritorio:** los filtros se aplican al marcarlos. Los filtros activos aparecen como etiquetas con «Quitar filtro: {nombre}» y un enlace «Limpiar filtros». El conteo de resultados se anuncia con `aria-live="polite"`.
  - **Celular:** el botón «Filtros (N)» abre una hoja a pantalla completa (`role="dialog"`, `aria-modal="true"`) con pie fijo «Limpiar» / «Ver N cursos». Los cambios se aplican al tocar «Ver N cursos»; al cerrar, el foco regresa al botón «Filtros». Las etiquetas activas se desplazan en horizontal.
  - **Orden:** «Próximos a iniciar» por defecto. En celular la etiqueta «Ordenar por» queda oculta visualmente (`sr-only`), pero el control la conserva.
  - **Paginación:** `<nav aria-label="Paginación">`, página actual con `aria-current="page"`, áreas táctiles de 44 px. 9 cursos por página en escritorio.
  - **Sin resultados:** mensaje con «Limpiar filtros».
  - **Pendiente:** confirmar con el equipo de desarrollo qué datos existen para filtrar (nivel de certificación, modalidad, estado de inscripción) y si la plataforma ya da los conteos por opción. Consulta enviada a Pablo: «Rediseño: datos para los filtros del catálogo de cursos» (correo del 3 nov. 2026).
