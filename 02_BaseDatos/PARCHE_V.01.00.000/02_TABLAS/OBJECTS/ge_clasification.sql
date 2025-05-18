-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla ge_clasification de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE ge_clasification (
    clsf_id 					SERIAL 			NOT NULL,
    clsf_range_min 				INT    			NOT NULL,
    clsf_range_max 				INT   			NOT NULL,
	clsf_level 					VARCHAR(50)   	NOT NULL
	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE ge_clasification
    
    
COMMENT ON TABLE ge_clasification
    IS 'TABLA DE DEFINICION DE LOS RANGOS DE CLASIFICACION DEL SOFTWARE';

COMMENT ON COLUMN ge_clasification.clsf_id
    IS 'ID DE LA CLASIFICACION';
    
COMMENT ON COLUMN ge_clasification.clsf_range_min
    IS 'RANGO MINIMO';

COMMENT ON COLUMN ge_clasification.clsf_range_max
    IS 'RANGO MAXIMO';
	
COMMENT ON COLUMN ge_clasification.clsf_level
    IS 'NIVEL DE CLASIFICACION';



    
