import { acordeon } from './acordeon';
import { alerta } from './alerta';
import { avatar } from './avatar';
import { badge } from './badge';
import { boton } from './boton';
import { campos } from './campos';
import { dialogo } from './dialogo';
import { menuDesplegable } from './menu-desplegable';
import { breadcrumb } from './breadcrumb';
import { paginacion } from './paginacion';
import { seleccion } from './seleccion';
import { buscador, sugerencias } from './sitio-busqueda';
import { barraDeNavegacion, megaMenu, menuDeUsuario, menuMovil, pieDePagina } from './sitio-navegacion';
import { estadoVacio, filtros } from './sitio-catalogo';
import { chip, etiquetasYEstados, miniaturaDeCurso, tarjetaDeCurso } from './sitio-cursos';
import { barraDeAdministracion, datosDelCurso, docente, ediciones, tarjetaDeInscripcion } from './sitio-detalle-curso';
import { carrusel, encabezadoDeSeccion, estadistica, selectorDeAudiencia, tarjetaDeArea, tarjetaTipoDeCurso, testimonio } from './sitio-home';
import { tabs } from './tabs';
import { ComponentDoc } from './types';

/** Contenido por slug de página (navigation.ts). */
export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  boton,
  campos,
  seleccion,
  badge,
  alerta,
  tabs,
  'breadcrumb': breadcrumb,
  paginacion,
  acordeon,
  avatar,
  dialogo,
  'menu-desplegable': menuDesplegable,
  'tarjeta-de-curso': tarjetaDeCurso,
  'miniatura-de-curso': miniaturaDeCurso,
  'etiquetas-y-estados': etiquetasYEstados,
  chip,
  filtros,
  'estado-vacio': estadoVacio,
  'tarjeta-de-inscripcion': tarjetaDeInscripcion,
  'datos-del-curso': datosDelCurso,
  docente,
  ediciones,
  'barra-de-administracion': barraDeAdministracion,
  carrusel,
  'selector-de-audiencia': selectorDeAudiencia,
  'encabezado-de-seccion': encabezadoDeSeccion,
  'tarjeta-tipo-de-curso': tarjetaTipoDeCurso,
  'tarjeta-de-area': tarjetaDeArea,
  estadistica,
  testimonio,
  buscador,
  sugerencias,
  'barra-de-navegacion': barraDeNavegacion,
  'mega-menu': megaMenu,
  'menu-movil': menuMovil,
  'menu-de-usuario': menuDeUsuario,
  'pie-de-pagina': pieDePagina,
};
