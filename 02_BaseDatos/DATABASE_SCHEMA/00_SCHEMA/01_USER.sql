-- ***************************************************
-- **          PROYECTO WEB BASE                    **
-- **          REV:17\05\2025                       ** 
-- ***************************************************

-- USUARIO DEL APLICATIVO 
-- User: qualityapp_us

CREATE USER qualityapp_us WITH
  LOGIN
  ENCRYPTED PASSWORD 'qualityapp_us'
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

