-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla ge_software de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE ge_software (
    soft_id 							SERIAL		 NOT NULL,
    soft_name    						VARCHAR(255) NOT NULL,
    soft_ge_objct 						TEXT,
    soft_spfc_objct 					TEXT,
    soft_company 						VARCHAR(255),
    soft_city 							VARCHAR(100),
    soft_phone 							VARCHAR(20),
    soft_test_date	 					TIMESTAMP    NOT NULL
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE ge_software
    
    
COMMENT ON TABLE ge_software
    IS 'GUARDA LA INFORMACIÓN DEL SOFTWARE EVALUADO';

COMMENT ON COLUMN ge_software.soft_id
    IS 'ID DEL SOFTWARE';
    
 COMMENT ON COLUMN ge_software.soft_name
    IS 'NOMBRE DEL SOFTWARE A EVALUAR';


COMMENT ON COLUMN ge_software.soft_ge_objct
    IS 'OBJETIVOS GENERALES DEL SOFTWARE A EVALUAR';

COMMENT ON COLUMN ge_software.soft_spfc_objct
    IS 'OBJETIVOS ESPECIFICOS DEL SOFTWARE A EVALUAR';

COMMENT ON COLUMN ge_software.soft_company
    IS 'EMPRESA A LA CUAL PERTENECE EL SOFTWARE';

COMMENT ON COLUMN ge_software.soft_city
    IS 'CIUDAD DEL SOFTWARE';
    
COMMENT ON COLUMN ge_software.soft_phone
    IS 'TELEFONO DE CONTACTO';
    
COMMENT ON COLUMN ge_software.soft_test_date
    IS 'FECHA DE LA EVALUACIÓN';
    
