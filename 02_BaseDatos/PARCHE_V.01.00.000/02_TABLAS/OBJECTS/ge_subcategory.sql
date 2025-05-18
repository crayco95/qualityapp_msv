-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla ge_subcategory de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE ge_subcategory (
    subctg_id 					SERIAL 			NOT NULL,
    subctg_param_id 			INT    			NOT NULL,
    subctg_name 				VARCHAR(100)   	NOT NULL,
	subctg_description			TEXT
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE ge_subcategory
    
    
COMMENT ON TABLE ge_subcategory
    IS 'TABLA DE DEFINICION DE SUBCATEGORIAS EN CADA CRITERIO DE EVALUACION';

COMMENT ON COLUMN ge_subcategory.subctg_id
    IS 'ID DE LA SUBCATEGORIA';
    
COMMENT ON COLUMN ge_subcategory.subctg_param_id
    IS 'ID DEL PARAMETRO REFERENCIADO';

COMMENT ON COLUMN ge_subcategory.subctg_name
    IS 'NOMBRE DE LA SUBCATEGORIA';

COMMENT ON COLUMN ge_subcategory.subctg_description
    IS 'DESCRIPCION DE LA SUBCATEGORIA';


    
