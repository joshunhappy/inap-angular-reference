/** Pantallas diseñadas en Figma: capturas del estado principal y lista de los demás estados. */

export type Device = 'escritorio' | 'celular';

export interface ScreenImage {
  /** Nombre de la pestaña. */
  label: string;
  device: Device;
  /** Archivo en public/capturas/. */
  file: string;
  width: number;
  height: number;
  /** Frame de Figma (node-id con dos puntos). */
  node: string;
  alt: string;
  /** Nota que acompaña al frame en Figma. */
  caption: string;
}

export interface ScreenState {
  label: string;
  escritorio?: string;
  celular?: string;
}

export interface ScreenDoc {
  /** Párrafo de introducción (HTML escrito en este archivo). */
  intro: string;
  /** Ruta de la pantalla en la plataforma, si ya está definida. */
  route?: string;
  images: ScreenImage[];
  /** Otros estados del mismo flujo (solo en Figma por ahora). */
  states: ScreenState[];
  /** Slugs de páginas de /componentes. */
  components: string[];
  /** Plantilla en código, cuando exista: /plantillas/... */
  template?: string;
  /** La pantalla muestra cifras, fotos o testimonios de ejemplo. */
  sampleContent?: boolean;
}

/** Fecha en que se exportaron las capturas. */
export const EXPORTED = '16 de noviembre de 2026';

const D = (file: string, node: string, height: number, alt: string, caption: string, label = 'Escritorio'): ScreenImage =>
  ({ label, device: 'escritorio', file: `${file}-escritorio.webp`, width: 1440, height, node, alt, caption });
const M = (file: string, node: string, height: number, alt: string, caption: string, label = 'Celular'): ScreenImage =>
  ({ label, device: 'celular', file: `${file}-celular.webp`, width: 390, height, node, alt, caption });

export const SCREEN_DOCS: Record<string, ScreenDoc> = {
  home: {
    intro:
      'Página de inicio de la plataforma de cursos. El selector «Para ti» / «Para tu institución» cambia solo el hero; el resto de la página es igual en las dos versiones.',
    route: '/',
    images: [
      D('home', '161:3891', 5632, 'Captura del Home en escritorio, versión «Para ti».', 'Home · «Para ti», la versión que se muestra al entrar.'),
      M('home', '477:10257', 7552, 'Captura del Home en celular, versión «Para ti».', 'Home móvil · «Para ti».'),
    ],
    states: [{ label: 'Para tu institución (cambia solo el hero)', escritorio: '190:4393', celular: '478:14207' }],
    components: [
      'barra-de-navegacion', 'buscador', 'selector-de-audiencia', 'carrusel', 'encabezado-de-seccion',
      'tarjeta-tipo-de-curso', 'tarjeta-de-curso', 'tarjeta-de-area', 'estadistica', 'testimonio', 'pie-de-pagina',
    ],
    template: '/plantillas/home',
    sampleContent: true,
  },

  catalogo: {
    intro:
      'Todos los cursos, con filtros. En escritorio los filtros están a la izquierda; en celular se abren en una hoja a pantalla completa. Los filtros elegidos van en la URL.',
    images: [
      D('catalogo', '518:16304', 2210, 'Captura del catálogo en escritorio, sin filtros.', 'Catálogo · todos los cursos (sin filtros).'),
      M('catalogo', '521:11743', 3597, 'Captura del catálogo en celular, sin filtros.', 'Catálogo · todos los cursos.'),
    ],
    states: [
      { label: 'Filtrado: llega desde «Cursos con opción a certificación» y agrega «Inscripción abierta»', escritorio: '520:16775', celular: '522:12013' },
      { label: 'Sin resultados para los filtros elegidos', escritorio: '520:20007', celular: '522:12346' },
      { label: 'Filtros abiertos (hoja a pantalla completa, pie fijo)', celular: '522:12658' },
    ],
    components: ['barra-de-navegacion', 'filtros', 'chip', 'tarjeta-de-curso', 'paginacion', 'estado-vacio', 'pie-de-pagina'],
    template: '/plantillas/catalogo',
    sampleContent: true,
  },

  busqueda: {
    intro:
      'Resultados de la búsqueda de cursos. Usa el mismo diseño del catálogo: la búsqueda coincide con el nombre o el área del curso.',
    route: '/busqueda',
    images: [
      D('busqueda', '568:18526', 1807, 'Captura de los resultados de búsqueda en escritorio.', 'Búsqueda · resultados para «gestión» (coincide en nombre o área del curso).'),
      M('busqueda', '568:34909', 2693, 'Captura de los resultados de búsqueda en celular.', 'Búsqueda · resultados para «gestión».'),
    ],
    states: [
      { label: 'Sin resultados (error de escritura): sugerencias y salida al catálogo', escritorio: '568:21650', celular: '568:35221' },
      { label: 'Sugerencias al escribir en la barra', escritorio: '214:22754', celular: '439:17829' },
      { label: 'Búsquedas recientes', escritorio: '554:55632' },
      { label: 'Buscador abierto al tocar la lupa', celular: '439:17756' },
    ],
    components: ['buscador', 'sugerencias', 'filtros', 'tarjeta-de-curso', 'paginacion', 'estado-vacio'],
    sampleContent: true,
  },

  'detalle-de-curso': {
    intro:
      'Información de un curso: datos clave, programa, docente y preguntas frecuentes. La tarjeta de inscripción cambia según el estado de la edición y del participante.',
    images: [
      D('detalle-de-curso', '289:7477', 4149, 'Captura del detalle de curso en escritorio, con inscripción abierta.', 'Curso · inscripción abierta.'),
      M('detalle-de-curso', '290:1102', 5683, 'Captura del detalle de curso en celular, con inscripción abierta.', 'Curso · inscripción abierta.'),
    ],
    states: [
      { label: 'Próximamente', escritorio: '291:19345', celular: '291:944' },
      { label: 'Último día', escritorio: '291:19899', celular: '291:1482' },
      { label: 'Cerrada', escritorio: '291:20453', celular: '291:2020' },
      { label: 'Cupo lleno', escritorio: '291:21007', celular: '291:2558' },
      { label: 'En curso', escritorio: '291:21561', celular: '291:3096' },
      { label: 'Inscrito', escritorio: '291:22115', celular: '291:3634' },
      { label: 'Saldo pendiente', escritorio: '301:33637', celular: '301:36131' },
      { label: 'Aprobado', escritorio: '301:34230', celular: '301:36668' },
      { label: 'Vista de administración', escritorio: '291:22669', celular: '291:4172' },
      { label: 'Al desplazar: tabs fijas arriba y scroll spy', escritorio: '338:32223', celular: '339:36008' },
    ],
    components: [
      'barra-de-navegacion', 'breadcrumb', 'miniatura-de-curso', 'etiquetas-y-estados', 'tarjeta-de-inscripcion', 'tabs',
      'datos-del-curso', 'docente', 'ediciones', 'acordeon', 'barra-de-administracion', 'pie-de-pagina',
    ],
    template: '/plantillas/detalle-de-curso',
    sampleContent: true,
  },

  acceso: {
    intro:
      'Iniciar sesión, registrarse y recuperar la contraseña. Misma plantilla sin encabezado ni pie: en escritorio, panel de marca a la izquierda y formulario a la derecha; en celular, el logo arriba del formulario.',
    route: '/login',
    images: [
      D('acceso', '596:21706', 960, 'Captura de «Inicia sesión» en escritorio.', 'Acceso · iniciar sesión (/login).'),
      M('acceso', '598:13142', 844, 'Captura de «Inicia sesión» en celular.', 'Acceso · iniciar sesión.'),
    ],
    states: [
      { label: 'Correo o contraseña incorrectos (mensaje general, no dice cuál falló)', escritorio: '596:21708', celular: '598:13144' },
      { label: 'Cuenta deshabilitada', escritorio: '611:23590', celular: '611:38415' },
      { label: 'Contraseña actualizada', escritorio: '596:22901', celular: '598:13424' },
      { label: 'Registro con DPI (/registro)', escritorio: '596:24094', celular: '598:13704' },
      { label: 'Registro con pasaporte', escritorio: '596:25287', celular: '598:13984' },
      { label: 'Registro con errores', escritorio: '596:26480', celular: '598:14264' },
      { label: 'Recuperar contraseña (/recuperar-contrasena)', escritorio: '596:27673', celular: '598:14544' },
      { label: 'Enlace enviado (no confirma si el correo existe)', escritorio: '596:28866', celular: '598:14824' },
      { label: 'Nueva contraseña', escritorio: '596:30059', celular: '598:15104' },
    ],
    components: ['campos', 'boton', 'alerta'],
  },

  'completar-perfil': {
    intro:
      'Datos que se piden al inscribirse en el primer curso, en dos pasos. No bloquea el uso de la plataforma: después del registro solo se muestra un aviso.',
    route: '/perfil/completar',
    images: [
      D('completar-perfil', '622:21120', 1610, 'Captura del paso 1 de «Completar perfil» en escritorio.', 'Perfil · paso 1 al inscribirse (/perfil/completar?curso=…).'),
      M('completar-perfil', '625:13700', 2117, 'Captura del paso 1 de «Completar perfil» en celular.', 'Perfil · paso 1.'),
    ],
    states: [
      { label: 'Inicio después del registro: aviso, sin bloquear (/perfil)', escritorio: '623:21902', celular: '625:13525' },
      { label: 'Paso 1 con errores', escritorio: '622:21487', celular: '625:14025' },
      { label: 'Paso 2 · Estudios y trabajo', escritorio: '622:21889', celular: '625:14385' },
      { label: 'De vuelta al curso para confirmar la inscripción', escritorio: '623:22125', celular: '625:14715' },
      { label: 'Revisión cada 6 meses', escritorio: '623:24514', celular: '625:15229' },
    ],
    components: ['barra-de-navegacion', 'campos', 'seleccion', 'boton', 'alerta', 'pie-de-pagina'],
  },

  'mi-cuenta': {
    intro:
      'Menú de la cuenta con sesión iniciada. Las opciones cambian según el rol: Participante, Representante institucional, DIFOGI y Administrador. En celular se abre a pantalla completa.',
    images: [
      D('mi-cuenta', '329:39501', 960, 'Captura del menú de la cuenta abierto en escritorio, rol Participante.', 'Cuenta · menú abierto · Participante (clic en el botón de usuario; Esc cierra).'),
      M('mi-cuenta', '329:44531', 844, 'Captura de «Mi cuenta» en celular, rol Participante.', '«Mi cuenta» · Participante (hoja a pantalla completa).'),
    ],
    states: [
      { label: 'Sesión iniciada, menú cerrado', escritorio: '329:36797', celular: '329:43913' },
      { label: 'Representante institucional', escritorio: '329:40502', celular: '329:44611' },
      { label: 'DIFOGI', escritorio: '329:41514', celular: '329:44702' },
      { label: 'Administrador', escritorio: '329:42526', celular: '329:44793' },
      { label: 'Administrador con «Administración» abierta', celular: '439:18057' },
      { label: 'Menú de celular con sesión iniciada', celular: '329:44408' },
    ],
    components: ['barra-de-navegacion', 'menu-de-usuario', 'avatar', 'menu-desplegable'],
  },

  navegacion: {
    intro:
      'Menús de la barra de navegación abiertos. Angular y WordPress comparten el diseño; cambia el contenido del menú.',
    images: [
      D('navegacion', '214:22750', 960, 'Captura del mega menú «Cursos» abierto en escritorio.', 'Navegación · «Cursos» abierto (hover o clic; Esc cierra).', 'Angular'),
      { ...D('navegacion', '375:39868', 960, 'Captura del mega menú «Formación» abierto en el sitio de WordPress.', 'WordPress · «Formación» abierto (hover o clic; Esc cierra).', 'WordPress'), file: 'navegacion-wordpress.webp' },
      M('navegacion', '87:4469', 844, 'Captura del menú en celular con «Cursos» abierto.', 'Menú en celular · «Cursos» abierto.'),
    ],
    states: [
      { label: 'WordPress · «Fortalecimiento» abierto', escritorio: '375:39871' },
      { label: 'WordPress · «Recursos» abierto', escritorio: '375:39874' },
      { label: 'WordPress · «Institución» abierto', escritorio: '375:39877' },
      { label: 'WordPress · búsqueda con sugerencias', escritorio: '375:39880' },
    ],
    components: ['barra-de-navegacion', 'mega-menu', 'menu-movil', 'buscador', 'sugerencias'],
  },

  transparencia: {
    intro:
      'Información pública de oficio (Ley de Acceso a la Información Pública). Vive en WordPress; la solicitud de información se llena en la misma página.',
    route: '/transparencia',
    images: [
      D('transparencia', '722:25074', 1968, 'Captura del inicio de Transparencia en escritorio, con el formulario de solicitud.', 'Transparencia · inicio con formulario (/transparencia#solicitud).'),
      M('transparencia', '816:41472', 3831, 'Captura del inicio de Transparencia en celular.', 'Transparencia · en celular, el formulario de solicitud va al final.'),
    ],
    states: [
      { label: 'Información pública de oficio: 29 numerales, año y búsqueda', escritorio: '697:22831', celular: '699:14974' },
      { label: 'Numeral con documentos', escritorio: '697:23366', celular: '699:15318' },
      { label: 'Numeral con apartados', escritorio: '741:25476', celular: '811:16431' },
      { label: 'Numeral sin información en el año', escritorio: '698:26212', celular: '699:15638' },
      { label: 'Numeral con documentos en SharePoint (alternativa)', escritorio: '698:26721' },
      { label: 'Búsqueda sin resultados', escritorio: '698:27349' },
    ],
    components: ['barra-de-navegacion', 'breadcrumb', 'campos', 'boton', 'pie-de-pagina'],
  },
};
