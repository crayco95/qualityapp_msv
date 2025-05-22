-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla ge_parameters de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE ge_parameters (
    param_id 					SERIAL 			NOT NULL,
    param_standard_id 			INT    			NOT NULL,
    param_name 					VARCHAR(100)   	NOT NULL,
	param_description			TEXT,
	param_weight				DECIMAL(5,2),
	param_date_create			TIMESTAMP DEFAULT CURRENT_TIMESTAMP				,
	param_date_update			TIMESTAMP DEFAULT CURRENT_TIMESTAMP				
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE ge_parameters
    
    
COMMENT ON TABLE ge_parameters
    IS 'TABLA DE DEFINICION DE CRITERIOS DE EVALUACION DE CADA NORMA';

COMMENT ON COLUMN ge_parameters.param_id
    IS 'ID DEL CRITERIO';
    
 COMMENT ON COLUMN ge_parameters.param_standard_id
    IS 'ID DE LA NORMA REFERENCIADA';


COMMENT ON COLUMN ge_parameters.param_name
    IS 'NOMBRE DEL CRITERIO';

COMMENT ON COLUMN ge_parameters.param_description
    IS 'DESCRIPCION DEL CRITERIO';
	
COMMENT ON COLUMN ge_parameters.param_weight
    IS 'PESO DEL CRITERIO';


    
