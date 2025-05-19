-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             19/05/2025      Cesar           se crea tabla au_user_act_log de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE au_user_act_log (
    usrlog_id 					SERIAL 									NOT NULL,
    usrlog_usr_id 				INT    									NOT NULL,
    usrlog_action 				VARCHAR(50)   							NOT NULL,
	usrlog_description			TEXT   									,
	usrlog_timestamp			TIMESTAMP DEFAULT CURRENT_TIMESTAMP		,
	usrlog_ip_address			VARCHAR(45)								NOT NULL
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE au_user_act_log
    
    
COMMENT ON TABLE au_user_act_log
    IS 'TABLA DE REGISTRO DE USUARIOS';

COMMENT ON COLUMN au_user_act_log.usrlog_id
    IS 'ID DEL EVENTO';
    
COMMENT ON COLUMN au_user_act_log.usrlog_usr_id
    IS 'ID DEL USUARIO DEL EVENTO';

COMMENT ON COLUMN au_user_act_log.usrlog_action
    IS 'EVENTO';
	
COMMENT ON COLUMN au_user_act_log.usrlog_description
    IS 'DESCRIPCION DEL EVENTO';

COMMENT ON COLUMN au_user_act_log.usrlog_timestamp
    IS 'FECHA Y HORA DEL EVENTO';

COMMENT ON COLUMN au_user_act_log.usrlog_ip_address
    IS 'DIRECCION IP DONDE SE EJECUTA EL EVENTO';



    
