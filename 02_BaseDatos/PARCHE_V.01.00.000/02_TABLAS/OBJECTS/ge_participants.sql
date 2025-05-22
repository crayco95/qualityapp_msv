-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla ge_participants de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE ge_participants (
    prcnt_id 					SERIAL 			NOT NULL,
    prcnt_soft_id 				INT 		    NOT NULL,
	prcnt_usr_id 				INT 		    NOT NULL,
    prcnt_name 					VARCHAR(100)    NOT NULL,
    prcnt_position 				VARCHAR(100),
    prcnt_signature 			TEXT,
	prcnt_date_create			TIMESTAMP DEFAULT CURRENT_TIMESTAMP				,
	prcnt_date_update			TIMESTAMP DEFAULT CURRENT_TIMESTAMP				
	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE ge_participants
    
    
COMMENT ON TABLE ge_participants
    IS 'TABLA DE REGISTRO DE PARTICIPANTES';

COMMENT ON COLUMN ge_participants.prcnt_id
    IS 'ID DEL PARTICIPANTE';
    
COMMENT ON COLUMN ge_participants.prcnt_soft_id
    IS 'ID DEL SOFTWARE AL QUE REFERENCIA EL PARTICIPANTE';
	
COMMENT ON COLUMN ge_participants.prcnt_usr_id
    IS 'ID DEL USUARIO REFERENCIADO';

COMMENT ON COLUMN ge_participants.prcnt_name
    IS 'NOMBRE DEL PARTICIPANTE';

COMMENT ON COLUMN ge_participants.prcnt_position
    IS 'CARGO DEL PARTICIPANTE';

COMMENT ON COLUMN ge_participants.prcnt_signature
    IS 'FIRMA DEL PARTICIPANTE';

    
