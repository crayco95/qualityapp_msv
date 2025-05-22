-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla rp_assessment de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE rp_assessment (
    assmt_id 					SERIAL 			NOT NULL,
    assmt_software_id 			INT    			NOT NULL,
    assmt_standard_id 			INT   			NOT NULL,
	assmt_param_id 				INT   			NOT NULL,
	assmt_score					DECIMAL(5,2),
	assmt_classification_id		INT,
	assmt_date_create 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	assmt_date_update			TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE rp_assessment
    
    
COMMENT ON TABLE rp_assessment
    IS 'TABLA DE REGISTRO DE CADA EVALUACION REALIZADA';

COMMENT ON COLUMN rp_assessment.assmt_id
    IS 'ID DE LA EVALUACION';
    
COMMENT ON COLUMN rp_assessment.assmt_software_id
    IS 'ID DEL SOFTWARE REFERENCIADO';

COMMENT ON COLUMN rp_assessment.assmt_standard_id
    IS 'ID DE LA NORMA REFERENCIADA';
	
COMMENT ON COLUMN rp_assessment.assmt_param_id
    IS 'ID DEL PARTICIPANTE EVALUADOR';

COMMENT ON COLUMN rp_assessment.assmt_date_create
    IS 'FECHA DE CREACION DEL REGISTRO';

COMMENT ON COLUMN rp_assessment.assmt_score
    IS 'PUNTUACION GLOBAL DE LA EVALUACION';
	
COMMENT ON COLUMN rp_assessment.assmt_classification_id
    IS 'CLASIFICACION GLOBAL DE LA EVALUACION';


    
