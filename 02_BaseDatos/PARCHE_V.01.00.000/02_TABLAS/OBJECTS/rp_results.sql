-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla rp_results de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE rp_results (
    rslt_id 					SERIAL 			NOT NULL,
    rslt_assmt_id 				INT    			NOT NULL,
    rslt_param_id 				INT   			NOT NULL,
	rslt_subctg_id 				INT   			NOT NULL,
	rslt_score					DECIMAL(5,2),
	rslt_observations			TEXT
	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE rp_results
    
    
COMMENT ON TABLE rp_results
    IS 'TABLA DE REGISTRO DE PUNTAJES OBTENIDOS POR CADA PARAMETRO Y SUBCATEGORIA';

COMMENT ON COLUMN rp_results.rslt_id
    IS 'ID DEL RESULTADO';
    
COMMENT ON COLUMN rp_results.rslt_assmt_id
    IS 'ID DE LA EVALUACION REFERENCIADA';

COMMENT ON COLUMN rp_results.rslt_param_id
    IS 'ID DEL PARAMETRO REFERENCIADO';
	
COMMENT ON COLUMN rp_results.rslt_subctg_id
    IS 'ID DE LA SUBCATEGORIA REFERENCIADA';

COMMENT ON COLUMN rp_results.rslt_score
    IS 'VALOR DE PUNTAJE';

COMMENT ON COLUMN rp_results.rslt_observations
    IS 'OBSERVACIONES';



    
