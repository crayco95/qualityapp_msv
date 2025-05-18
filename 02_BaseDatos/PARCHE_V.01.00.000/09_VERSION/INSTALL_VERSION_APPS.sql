-- ***************************************************
-- **          Actualizacion de Version             **
-- **                                               ** 
-- ***************************************************
update ge_application
set app_vers = '1.0.0', app_factu = CURRENT_TIMESTAMP
where app_app = 'SIRE-APP-REPORT-ADMIN';

update ge_application
set app_vers = '1.0.0', app_factu = CURRENT_TIMESTAMP
where app_app = 'SIRE-APP-REPORT-GENERATOR';

/*

version mayor (a) = cambios que cambian la manera de funcionar el app. Siguiente consecutivo que se tiene la version actual
nueva_funcionalidad (b) = agrega nuevas funciones al app. Siguiente consecutivo que se tiene la version actual 
correccion_errores (c) = ajuste a funciones existentes. Siguiente consecutivo que se tiene la version actual 


*/
