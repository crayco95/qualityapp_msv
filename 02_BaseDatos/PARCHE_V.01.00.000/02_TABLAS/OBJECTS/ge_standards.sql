-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla ge_standards de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE ge_standards (
    strnd_id 					SERIAL 			NOT NULL,
    strnd_name 					VARCHAR(100)    NOT NULL,
    strnd_description 			TEXT    		NOT NULL,
	strnd_version 				VARCHAR(50) 	NOT NULL,
	strnd_status 				BOOLEAN 	DEFAULT TRUE,
	strnd_date_create 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP				,
	strnd_date_update 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP				
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE ge_standards
    
    
COMMENT ON TABLE ge_standards
    IS 'TABLA DE DEFINICION DE LAS NORMAS DE EVALUACION';

COMMENT ON COLUMN ge_standards.strnd_id
    IS 'ID DE LA NORMA';
    
 COMMENT ON COLUMN ge_standards.strnd_name
    IS 'NOMBRE DE LA NORMA';


COMMENT ON COLUMN ge_standards.strnd_description
    IS 'DESCRIPCION DE LA NORMA';


    
