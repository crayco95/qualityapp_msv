-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             18/05/2025      Cesar           se crea llave primaria de tabla ge_software
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================

--
-- Name: ge_software pk_ge_software; Type: CONSTRAINT;
--

 ALTER TABLE ONLY ge_software
    ADD CONSTRAINT pk_ge_software PRIMARY KEY (soft_id);