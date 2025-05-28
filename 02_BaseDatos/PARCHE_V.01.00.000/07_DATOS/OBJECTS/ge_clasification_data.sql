-- Insertar clasificaciones estándar para evaluación de calidad de software
INSERT INTO ge_clasification (clsf_range_min, clsf_range_max, clsf_level)
VALUES 
(0, 20, 'Muy Deficiente'),
(21, 40, 'Deficiente'),
(41, 60, 'Regular'),
(61, 80, 'Bueno'),
(81, 100, 'Excelente');

-- Verificar que los datos se insertaron correctamente
SELECT clsf_id, clsf_range_min, clsf_range_max, clsf_level FROM ge_clasification ORDER BY clsf_range_min;
