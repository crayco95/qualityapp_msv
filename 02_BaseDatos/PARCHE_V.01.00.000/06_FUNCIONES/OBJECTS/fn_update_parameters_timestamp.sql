-- =========================================================================================================================================================================
-- #version:0000001000
-- =========================================================================================================================================================================
-- historial de cambios
--
-- versión        gap                solicitud        fecha        realizó            descripción
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- 1000                                             22/05/2025      Cesar           Se crea función para activar trigger de update para la tabla ge_parameters
-- -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
-- =========================================================================================================================================================================


CREATE OR REPLACE FUNCTION fn_update_parameters_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.param_date_update = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_parameters_timestamp
    BEFORE UPDATE ON ge_parameters
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_parameters_timestamp();