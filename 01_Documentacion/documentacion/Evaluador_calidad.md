Especificación de Requisitos Descripción del Diseño







EVALUADOR DE CALIDAD DE SOFTWARE
**Versión 1.0**
27/05/2025







**Presentado por:**

- Jhon Santiago Gutiérrez Mosquera — *20202193073*  
- Kevin Santiago Quimbaya Andrade — *20202193482*  
- Cesar Alberto Medina Gutiérrez — *20141125314*  
- Carlos Andrés Mosquera López — *20201186119*


Tabla de contenido
1. Introducción	4
1.1 Propósito del documento	4
1.2 Alcance del sistema	4
1.3 Definiciones, acrónimos y abreviaturas	4
1.4 Referencias	4
1.5 Visión general del documento	5
2. Descripción general del sistema	6
2.1 Perspectiva del producto	6
2.2 Funcionalidad general	6
2.3 Características del usuario	6
2.4 Suposiciones y dependencias	6
2.5 Restricciones del sistema	6
3. Requisitos funcionales	6
4. Requisitos no funcionales	7
4.1 Rendimiento	7
4.2 Usabilidad	7
4.3 Seguridad	7
4.4 Confiabilidad	7
4.5 Portabilidad	7
4.6 Mantenibilidad	7
5. Interfaces del sistema	7
5.1 Interfaces de usuario	7
5.2 Interfaces de hardware	7
5.3 Interfaces de software	7
5.4 Interfaces de comunicación	7
6. Arquitectura del sistema	7
6.1 Diagrama general de arquitectura	7
6.2 Tecnologías utilizadas	7
6.3 Módulos principales y relaciones	7
7. Casos de uso	7
7.1 Identificación del actor	7
7.2 Descripción de escenarios	7
7.3 Flujo básico y alternativo	7
7.4 Diagramas UML si es posible	8
8. Modelo de datos	8
8.1 Modelo entidad-relación (ERD)	8
8.2 Descripción de entidades y relaciones 8.3 Diccionario de datos	8
9. Plan de pruebas (testing)	8
9.1 Estrategia general de pruebas	8
9.2 Casos de prueba	8
9.3 Criterios de aceptación	8
9.4 Tipos de prueba: unitarias, integración, sistema, aceptación	8
10. Plan de gestión del proyecto	8
10.1 Cronograma (Gantt)	8
10.2 Roles y responsabilidades	8
10.3 Control de versiones	8
10.4 Gestión de riesgos	8
11. Mantenimiento y soporte	8
11.1 Política de actualizaciones	8
11.2 Reporte y gestión de incidencias	8
11.3 Soporte al usuario	9
12. Anexos	9
12.1Glosario	9
12.2 Manual de usuario (si aplica)	9


1. Introducción
1.1 Propósito del documento
El propósito de este documento es proporcionar una descripción detallada del sistema de evaluación de matrices de riesgo desarrollado por el equipo. Este documento está dirigido a desarrolladores, analistas, testers, usuarios finales y cualquier otra parte interesada que requiera comprender el funcionamiento, propósito y alcance del software. Sirve como base para el desarrollo, mantenimiento, pruebas y futura evolución del sistema.
1.2 Alcance del sistema
El sistema permite la identificación, evaluación y gestión de riesgos mediante la construcción y análisis de matrices de riesgo. Estas matrices ayudan a visualizar el nivel de riesgo en función de la probabilidad de ocurrencia y el impacto asociado a cada evento identificado. El software está diseñado para ser utilizado por organizaciones que buscan fortalecer sus procesos de gestión de riesgos en entornos laborales, industriales, corporativos o institucionales. Entre sus funcionalidades principales se incluyen:
Registro y categorización de riesgos.
Asignación de niveles de probabilidad e impacto.
Generación automática de matrices de riesgo.
Reportes e indicadores visuales.
Gestión de planes de acción y mitigación.

1.3 Definiciones, acrónimos y abreviaturas
Termino/ Acronimo
Definicion
Riesgo
Posibilidad de que ocurra un evento que tenga un impacto negativo
Impacto
Consecuencia o efecto resultante de la materialización de un riesgo.
Probabilidad
Posibilidad de que un evento ocurra.
Matriz de riesgo
Herramienta gráfica para representar el nivel de riesgo según su probabilidad e impacto
UI
Interfaz de Usuario (User Interface).
CRUD
Crear, Leer, Actualizar y Eliminar (operaciones básicas sobre datos).


1.4 Referencias
ISO 31000: Gestión del Riesgo – Principios y directrices.
Manual de Gestión de Riesgos de la organización [Nombre de la empresa].
Documentación técnica del sistema (Anexos A y B).
Requisitos del usuario, versión 1.0.
1.5 Visión general del documento
Sección 1: Introducción – Presenta el propósito, alcance, definiciones clave y referencias utilizadas en la elaboración del documento.

Sección 2: Descripción general del sistema – Ofrece una visión global del producto, sus funcionalidades, usuarios previstos, suposiciones, dependencias y restricciones.

Sección 3: Requisitos funcionales – Detalla las funcionalidades específicas que el sistema debe cumplir.

Sección 4: Requisitos no funcionales – Establece atributos de calidad como rendimiento, usabilidad, seguridad y mantenibilidad.

Sección 5: Interfaces del sistema – Describe las interfaces de usuario, hardware, software y comunicación.

Sección 6: Arquitectura del sistema – Incluye diagramas, tecnologías utilizadas y los módulos que componen el sistema.

Sección 7: Casos de uso – Define los actores, escenarios y flujos de interacción con el sistema, incluyendo diagramas UML.

Sección 8: Modelo de datos – Presenta el modelo entidad-relación, la descripción de entidades y relaciones, y el diccionario de datos.

Sección 9: Plan de pruebas (testing) – Describe la estrategia de pruebas, casos de prueba, criterios de aceptación y tipos de pruebas.

Sección 10: Plan de gestión del proyecto – Incluye el cronograma, asignación de roles, control de versiones y gestión de riesgos.

Sección 11: Mantenimiento y soporte – Establece las políticas de actualización, gestión de incidencias y soporte al usuario.

Sección 12: Anexos – Contiene el glosario de términos y, si aplica, el manual de usuario. 
2. Descripción general del sistema

2.1 Perspectiva del producto
El sistema de evaluación de matrices de riesgo es una aplicación web (o de escritorio/móvil, según corresponda) desarrollada para facilitar la gestión integral de riesgos en diferentes contextos organizacionales. Funciona como una herramienta independiente, aunque puede integrarse con otros sistemas de gestión existentes como software de salud ocupacional, seguridad industrial o cumplimiento normativo.
Su arquitectura está basada en una estructura modular, lo que permite su escalabilidad, mantenimiento y futura ampliación. El sistema está diseñado para múltiples perfiles de usuario y permite operaciones seguras y trazables.

2.2 Funcionalidad general
Entre las principales funcionalidades del sistema se incluyen:
Registro y actualización de riesgos por categoría, área o proceso.
Asignación de valores de probabilidad e impacto con criterios personalizables.
Generación automática de matrices de riesgo en formato visual (colores por nivel de riesgo).
Clasificación de riesgos en niveles: bajo, moderado, alto, crítico.
Propuesta y seguimiento de medidas de control y mitigación.
Control de versiones de evaluaciones realizadas.
Exportación de informes y reportes en formatos PDF y Excel.
Gestión de usuarios con diferentes niveles de acceso.
2.3 Características del usuario
El sistema está orientado a los siguientes tipos de usuarios:
Administrador del sistema: Configura parámetros globales, gestiona usuarios y supervisa el uso del sistema.
Analista de riesgos: Encargado de registrar, evaluar y analizar los riesgos identificados.
Responsables de procesos: Consultan evaluaciones y participan en el seguimiento de planes de acción.
Auditores o consultores externos: Acceden a reportes y registros para fines de auditoría y cumplimiento.

2.4 Suposiciones y dependencias
El sistema requiere conexión a una base de datos segura para almacenar la información.
Debe ejecutarse en un entorno compatible con navegadores web modernos (o entorno operativo si es una app de escritorio/móvil).
Los usuarios deben estar previamente registrados y autenticados para acceder al sistema.
La organización debe proporcionar lineamientos internos de evaluación que alimentan los parámetros del sistema (ej. escalas de impacto/probabilidad).
2.5 Restricciones del sistema
El sistema no sustituye la evaluación cualitativa del juicio experto; es una herramienta de apoyo.
No está diseñado para evaluar riesgos financieros ni realizar cálculos actuariales complejos.
No incluye mecanismos automáticos de identificación de riesgos; estos deben ser ingresados por los usuarios.
3. Requisitos funcionales
Describen las funciones específicas que debe realizar el sistema:
Identificados como RQF-001, RQF-002, etc.
Redactados en formato de historia de usuario o casos de uso si se desea.







Historias de usuario




Plantilla de requerimientos




4. Requisitos no funcionales
4.1 Rendimiento
4.2 Usabilidad
4.3 Seguridad
4.4 Confiabilidad
4.5 Portabilidad
4.6 Mantenibilidad
5. Interfaces del sistema
5.1 Interfaces de usuario
5.2 Interfaces de hardware
5.3 Interfaces de software
5.4 Interfaces de comunicación
6. Arquitectura del sistema
6.1 Diagrama general de arquitectura
6.2 Tecnologías utilizadas
6.3 Módulos principales y relaciones
7. Casos de uso
7.1 Identificación del actor
7.2 Descripción de escenarios
7.3 Flujo básico y alternativo
7.4 Diagramas UML si es posible
8. Modelo de datos
8.1 Modelo entidad-relación (ERD)
8.2 Descripción de entidades y relaciones
8.3 Diccionario de datos



9. Plan de pruebas (testing)
9.1 Estrategia general de pruebas
9.2 Casos de prueba
9.3 Criterios de aceptación
9.4 Tipos de prueba: unitarias, integración, sistema, aceptación
10. Plan de gestión del proyecto
10.1 Cronograma (Gantt)
10.2 Roles y responsabilidades
10.3 Control de versiones
10.4 Gestión de riesgos
11. Mantenimiento y soporte
11.1 Política de actualizaciones
11.2 Reporte y gestión de incidencias
11.3 Soporte al usuario
12. Anexos
12.1Glosario
12.2 Manual de usuario (si aplica)

