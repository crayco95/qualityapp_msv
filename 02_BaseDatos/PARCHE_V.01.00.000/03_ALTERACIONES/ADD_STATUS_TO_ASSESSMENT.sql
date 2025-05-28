-- =========================================================================================================================================================================
-- Agregar campo status a la tabla rp_assessment
-- =========================================================================================================================================================================

-- Agregar columna status
ALTER TABLE rp_assessment 
ADD COLUMN assmt_status VARCHAR(20) DEFAULT 'pending';

-- Agregar comentario
COMMENT ON COLUMN rp_assessment.assmt_status
    IS 'ESTADO DE LA EVALUACION (pending, in_progress, completed)';

-- Actualizar registros existentes
UPDATE rp_assessment 
SET assmt_status = 'pending' 
WHERE assmt_status IS NULL;
