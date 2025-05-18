-- ***************************************************
-- **          PROYECTO WEB BASE                    **
-- **          REV:17\05\2025                       ** 
-- ***************************************************

--
-- PostgreSQL database dump
--

-- Database: QUALITYAPP_BD

CREATE DATABASE "QUALITYAPP_BD"
    WITH 
    OWNER = qualityapp_us    
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
	
	
grant all privileges on database "QUALITYAPP_BD" TO qualityapp_us;

--Se ajusta path para creacion en el schema
ALTER DATABASE "QUALITYAPP_BD" SET search_path TO qualityapp_schema,public;
SET search_path TO qualityapp_schema,public;

	
-- Cambio de base de datos
\c "QUALITYAPP_BD" 



create extension pgcrypto;
create extension "uuid-ossp";
create extension pg_trgm;

--
-- Name: name_ext; Type: SCHEMA; Schema: -; Owner: qualityapp_us
--

CREATE SCHEMA qualityapp_schema;

ALTER SCHEMA qualityapp_schema OWNER TO qualityapp_us;

