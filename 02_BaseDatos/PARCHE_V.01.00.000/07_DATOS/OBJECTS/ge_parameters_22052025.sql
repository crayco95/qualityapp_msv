-- Insertar parámetros principales para ISO 25010
INSERT INTO ge_parameters (param_stdr_id, param_name, param_description, param_weight)
VALUES 
(1, 'Funcionalidad', 'Capacidad del software para proporcionar funciones que satisfacen las necesidades declaradas e implícitas', 0.25),
(1, 'Fiabilidad', 'Capacidad del software para mantener un nivel específico de funcionamiento cuando se usa bajo condiciones especificadas', 0.20),
(1, 'Usabilidad', 'Capacidad del software para ser entendido, aprendido, usado y resultar atractivo para el usuario', 0.15),
(1, 'Eficiencia', 'Capacidad del software para proporcionar un rendimiento adecuado', 0.15);

-- Insertar subparámetros para Funcionalidad
INSERT INTO ge_parameters (param_stdr_id, param_name, param_description, param_weight, param_parent_id)
VALUES 
(1, 'Completitud funcional', 'Grado en el cual el conjunto de funcionalidades cubre todas las tareas y objetivos especificados', 0.35, 1),
(1, 'Corrección funcional', 'Capacidad del producto para proveer resultados correctos con el nivel de precisión requerido', 0.35, 1),
(1, 'Pertinencia funcional', 'Capacidad del producto para proporcionar un conjunto apropiado de funciones para tareas y objetivos específicos', 0.30, 1);

-- Insertar subparámetros para Fiabilidad
INSERT INTO ge_parameters (param_stdr_id, param_name, param_description, param_weight, param_parent_id)
VALUES 
(1, 'Madurez', 'Capacidad del sistema para satisfacer las necesidades de fiabilidad en condiciones normales', 0.30, 2),
(1, 'Disponibilidad', 'Capacidad del sistema o componente de estar operativo y accesible cuando se requiere su uso', 0.35, 2),
(1, 'Tolerancia a fallos', 'Capacidad del sistema para operar según lo previsto en presencia de fallos', 0.35, 2);

-- Insertar subparámetros para Usabilidad
INSERT INTO ge_parameters (param_stdr_id, param_name, param_description, param_weight, param_parent_id)
VALUES 
(1, 'Capacidad de aprendizaje', 'Capacidad del producto que permite al usuario aprender su aplicación', 0.25, 3),
(1, 'Operabilidad', 'Capacidad del producto que permite al usuario operarlo y controlarlo con facilidad', 0.40, 3),
(1, 'Protección contra errores', 'Capacidad del sistema para proteger a los usuarios de cometer errores', 0.35, 3);

-- Insertar subparámetros para Eficiencia
INSERT INTO ge_parameters (param_stdr_id, param_name, param_description, param_weight, param_parent_id)
VALUES 
(1, 'Comportamiento temporal', 'Capacidad del sistema para proporcionar tiempos de respuesta apropiados', 0.50, 4),
(1, 'Utilización de recursos', 'Capacidad del sistema para usar las cantidades y tipos de recursos adecuados', 0.50, 4);