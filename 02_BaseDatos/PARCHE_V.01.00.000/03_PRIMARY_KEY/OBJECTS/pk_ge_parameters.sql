-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             18/05/2025      Cesar           se crea llave primaria de tabla ge_parameters
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

--
-- Name: ge_parameters pk_ge_parameters; Type: CONSTRAINT;
--

 ALTER TABLE ONLY ge_parameters
    ADD CONSTRAINT pk_ge_parameters PRIMARY KEY (param_id);