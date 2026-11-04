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
};
