-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             17/05/2025      Cesar           se crea tabla au_users de la app
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

CREATE TABLE au_users (
    usr_id 					SERIAL 									NOT NULL,
    usr_name 				VARCHAR(100)    						NOT NULL,
    usr_email 				VARCHAR(100)   							UNIQUE	NOT NULL,
	usr_password			TEXT   									NOT NULL,
	usr_rol					VARCHAR(100) 							NOT NULL,
	usr_date_create			TIMESTAMP DEFAULT CURRENT_TIMESTAMP				,
	usr_date_update			TIMESTAMP DEFAULT CURRENT_TIMESTAMP				
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


--ALTER TABLE au_users
    
    
COMMENT ON TABLE au_users
    IS 'TABLA DE REGISTRO DE USUARIOS';

COMMENT ON COLUMN au_users.usr_id
    IS 'ID DEL USUARIO';
    
COMMENT ON COLUMN au_users.usr_name
    IS 'NOMBRE DEL USUARIO';

COMMENT ON COLUMN au_users.usr_email
    IS 'CORREO DEL USUARIO';
	
COMMENT ON COLUMN au_users.usr_password
    IS 'CONTRASEÑA DEL USUARIO';

COMMENT ON COLUMN au_users.usr_rol
    IS 'ROL DEL USUARIO';

COMMENT ON COLUMN au_users.usr_date_create
    IS 'FECHA DE CREACION DEL USUARIO';



    
