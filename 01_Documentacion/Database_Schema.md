# Quality App - Esquema de Base de Datos

## Tabla de Contenidos
- [Introducción](#introducción)
- [Diagrama ER](#diagrama-er)
- [Tablas Principales](#tablas-principales)
- [Relaciones](#relaciones)
- [Índices](#índices)
- [Triggers y Funciones](#triggers-y-funciones)
- [Scripts de Migración](#scripts-de-migración)
- [Datos Iniciales](#datos-iniciales)

## Introducción

La base de datos de Quality App utiliza PostgreSQL 14+ y está diseñada siguiendo principios de normalización para garantizar la integridad de los datos y optimizar el rendimiento.

## Diagrama ER

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ge_software   │    │  rp_assessment  │    │  ge_standards   │
│                 │    │                 │    │                 │
│ soft_id (PK)    │◄──►│ assmt_id (PK)   │◄──►│ strnd_id (PK)   │
│ soft_name       │    │ assmt_software_id│    │ strnd_name      │
│ soft_company    │    │ assmt_standard_id│    │ strnd_version   │
│ soft_city       │    │ assmt_param_id  │    │ strnd_description│
│ soft_description│    │ assmt_score     │    │ strnd_status    │
│ soft_test_date  │    │ assmt_classification_id│ strnd_date_create│
│ soft_date_create│    │ assmt_date_create│    │ strnd_date_update│
│ soft_date_update│    │ assmt_date_update│    └─────────────────┘
└─────────────────┘    └─────────────────┘              │
                                │                        │
                                │                        ▼
                                │              ┌─────────────────┐
                                │              │  ge_parameters  │
                                │              │                 │
                                │              │ param_id (PK)   │
                                │              │ param_name      │
                                │              │ param_description│
                                │              │ param_weight    │
                                │              │ param_standard_id│
                                │              │ param_parent_id │
                                │              │ param_date_create│
                                │              │ param_date_update│
                                │              └─────────────────┘
                                │                        ▲
                                └────────────────────────┘
                                
┌─────────────────┐    ┌─────────────────┐
│ge_clasification │    │ ge_participants │
│                 │    │                 │
│ clsf_id (PK)    │    │ part_id (PK)    │
│ clsf_range_min  │    │ part_username   │
│ clsf_range_max  │    │ part_password   │
│ clsf_level      │    │ part_role       │
│ clsf_date_create│    │ part_name       │
│ clsf_date_update│    │ part_email      │
└─────────────────┘    │ part_date_create│
         ▲              │ part_date_update│
         │              └─────────────────┘
         │
         └──────────────────┐
                           │
                    ┌─────────────────┐
                    │  rp_assessment  │
                    │                 │
                    │ assmt_classification_id (FK)
                    └─────────────────┘
```

## Tablas Principales

### ge_software
Almacena información de los productos de software a evaluar.

```sql
CREATE TABLE ge_software (
    soft_id SERIAL PRIMARY KEY,
    soft_name VARCHAR(255) NOT NULL,
    soft_company VARCHAR(255) NOT NULL,
    soft_city VARCHAR(100),
    soft_description TEXT,
    soft_test_date DATE,
    soft_date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    soft_date_update TIMESTAMP
);
```

**Campos:**
- `soft_id`: Identificador único del software
- `soft_name`: Nombre del producto de software
- `soft_company`: Empresa desarrolladora
- `soft_city`: Ciudad de desarrollo
- `soft_description`: Descripción detallada
- `soft_test_date`: Fecha de prueba/evaluación
- `soft_date_create`: Fecha de creación del registro
- `soft_date_update`: Fecha de última actualización

### ge_standards
Define los estándares de evaluación (ISO 25010, etc.).

```sql
CREATE TABLE ge_standards (
    strnd_id SERIAL PRIMARY KEY,
    strnd_name VARCHAR(255) NOT NULL,
    strnd_version VARCHAR(50),
    strnd_description TEXT,
    strnd_status BOOLEAN DEFAULT TRUE,
    strnd_date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    strnd_date_update TIMESTAMP
);
```

**Campos:**
- `strnd_id`: Identificador único del estándar
- `strnd_name`: Nombre del estándar (ej: "ISO 25010")
- `strnd_version`: Versión del estándar
- `strnd_description`: Descripción del estándar
- `strnd_status`: Estado activo/inactivo
- `strnd_date_create`: Fecha de creación
- `strnd_date_update`: Fecha de actualización

### ge_parameters
Parámetros de evaluación asociados a cada estándar.

```sql
CREATE TABLE ge_parameters (
    param_id SERIAL PRIMARY KEY,
    param_name VARCHAR(255) NOT NULL,
    param_description TEXT,
    param_weight DECIMAL(5,4) DEFAULT 0.0000,
    param_standard_id INTEGER NOT NULL,
    param_parent_id INTEGER,
    param_date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    param_date_update TIMESTAMP,
    
    CONSTRAINT fk_param_standard 
        FOREIGN KEY (param_standard_id) REFERENCES ge_standards(strnd_id),
    CONSTRAINT fk_param_parent 
        FOREIGN KEY (param_parent_id) REFERENCES ge_parameters(param_id)
);
```

**Campos:**
- `param_id`: Identificador único del parámetro
- `param_name`: Nombre del parámetro (ej: "Funcionalidad")
- `param_description`: Descripción detallada
- `param_weight`: Peso del parámetro en la evaluación (0.0-1.0)
- `param_standard_id`: Referencia al estándar
- `param_parent_id`: Referencia a parámetro padre (para jerarquías)

### ge_clasification
Rangos de clasificación de calidad.

```sql
CREATE TABLE ge_clasification (
    clsf_id SERIAL PRIMARY KEY,
    clsf_range_min INTEGER NOT NULL,
    clsf_range_max INTEGER NOT NULL,
    clsf_level VARCHAR(100) NOT NULL,
    clsf_date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    clsf_date_update TIMESTAMP,
    
    CONSTRAINT chk_range_valid 
        CHECK (clsf_range_min <= clsf_range_max),
    CONSTRAINT chk_range_bounds 
        CHECK (clsf_range_min >= 0 AND clsf_range_max <= 100)
);
```

**Campos:**
- `clsf_id`: Identificador único de la clasificación
- `clsf_range_min`: Puntuación mínima del rango
- `clsf_range_max`: Puntuación máxima del rango
- `clsf_level`: Nivel de calidad (ej: "Excelente", "Bueno")

### rp_assessment
Evaluaciones realizadas (tabla principal de resultados).

```sql
CREATE TABLE rp_assessment (
    assmt_id SERIAL PRIMARY KEY,
    assmt_software_id INTEGER NOT NULL,
    assmt_standard_id INTEGER NOT NULL,
    assmt_param_id INTEGER NOT NULL,
    assmt_score DECIMAL(5,2),
    assmt_classification_id INTEGER,
    assmt_date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assmt_date_update TIMESTAMP,
    
    CONSTRAINT fk_assmt_software 
        FOREIGN KEY (assmt_software_id) REFERENCES ge_software(soft_id),
    CONSTRAINT fk_assmt_standard 
        FOREIGN KEY (assmt_standard_id) REFERENCES ge_standards(strnd_id),
    CONSTRAINT fk_assmt_param 
        FOREIGN KEY (assmt_param_id) REFERENCES ge_parameters(param_id),
    CONSTRAINT fk_assmt_classification 
        FOREIGN KEY (assmt_classification_id) REFERENCES ge_clasification(clsf_id),
    CONSTRAINT chk_score_range 
        CHECK (assmt_score >= 0 AND assmt_score <= 100)
);
```

**Campos:**
- `assmt_id`: Identificador único de la evaluación
- `assmt_software_id`: Referencia al software evaluado
- `assmt_standard_id`: Referencia al estándar utilizado
- `assmt_param_id`: Referencia al parámetro evaluado
- `assmt_score`: Puntuación obtenida (0-100)
- `assmt_classification_id`: Clasificación asignada automáticamente

### ge_participants
Usuarios del sistema.

```sql
CREATE TABLE ge_participants (
    part_id SERIAL PRIMARY KEY,
    part_username VARCHAR(100) UNIQUE NOT NULL,
    part_password VARCHAR(255) NOT NULL,
    part_role VARCHAR(50) DEFAULT 'user',
    part_name VARCHAR(255),
    part_email VARCHAR(255),
    part_date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    part_date_update TIMESTAMP,
    
    CONSTRAINT chk_role_valid 
        CHECK (part_role IN ('admin', 'evaluator', 'user'))
);
```

## Relaciones

### Relaciones Principales

1. **Software → Evaluaciones** (1:N)
   - Un software puede tener múltiples evaluaciones
   - Cada evaluación pertenece a un software específico

2. **Estándar → Parámetros** (1:N)
   - Un estándar define múltiples parámetros
   - Cada parámetro pertenece a un estándar

3. **Parámetro → Evaluaciones** (1:N)
   - Un parámetro puede ser evaluado múltiples veces
   - Cada evaluación evalúa un parámetro específico

4. **Clasificación → Evaluaciones** (1:N)
   - Una clasificación puede aplicar a múltiples evaluaciones
   - Cada evaluación puede tener una clasificación

5. **Parámetro → Subparámetros** (1:N) - Autoreferencial
   - Un parámetro puede tener subparámetros
   - Permite jerarquías de parámetros

### Restricciones de Integridad

```sql
-- Restricción única: Una evaluación por software-estándar-parámetro
ALTER TABLE rp_assessment 
ADD CONSTRAINT uk_assessment_unique 
UNIQUE (assmt_software_id, assmt_standard_id, assmt_param_id);

-- Restricción: El parámetro debe pertenecer al estándar especificado
ALTER TABLE rp_assessment 
ADD CONSTRAINT chk_param_belongs_to_standard 
CHECK (
    EXISTS (
        SELECT 1 FROM ge_parameters p 
        WHERE p.param_id = assmt_param_id 
        AND p.param_standard_id = assmt_standard_id
    )
);
```

## Índices

### Índices de Rendimiento

```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_assessment_software ON rp_assessment(assmt_software_id);
CREATE INDEX idx_assessment_standard ON rp_assessment(assmt_standard_id);
CREATE INDEX idx_assessment_param ON rp_assessment(assmt_param_id);
CREATE INDEX idx_assessment_date ON rp_assessment(assmt_date_create);

-- Índices para parámetros
CREATE INDEX idx_param_standard ON ge_parameters(param_standard_id);
CREATE INDEX idx_param_parent ON ge_parameters(param_parent_id);

-- Índices para clasificaciones
CREATE INDEX idx_classification_range ON ge_clasification(clsf_range_min, clsf_range_max);

-- Índices para usuarios
CREATE INDEX idx_participant_username ON ge_participants(part_username);
CREATE INDEX idx_participant_role ON ge_participants(part_role);
```

## Triggers y Funciones

### Trigger para Actualizar Fecha de Modificación

```sql
-- Función para actualizar fecha de modificación
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_update = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas principales
CREATE TRIGGER update_software_modtime 
    BEFORE UPDATE ON ge_software 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_standards_modtime 
    BEFORE UPDATE ON ge_standards 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_parameters_modtime 
    BEFORE UPDATE ON ge_parameters 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_assessment_modtime 
    BEFORE UPDATE ON rp_assessment 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_classification_modtime 
    BEFORE UPDATE ON ge_clasification 
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
```

### Función para Asignar Clasificación Automática

```sql
-- Función para asignar clasificación basada en puntuación
CREATE OR REPLACE FUNCTION assign_classification()
RETURNS TRIGGER AS $$
DECLARE
    classification_id INTEGER;
BEGIN
    IF NEW.assmt_score IS NOT NULL THEN
        SELECT clsf_id INTO classification_id
        FROM ge_clasification
        WHERE NEW.assmt_score >= clsf_range_min 
        AND NEW.assmt_score <= clsf_range_max;
        
        NEW.assmt_classification_id = classification_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para asignación automática
CREATE TRIGGER auto_assign_classification
    BEFORE INSERT OR UPDATE ON rp_assessment
    FOR EACH ROW EXECUTE FUNCTION assign_classification();
```

## Scripts de Migración

### Orden de Ejecución

1. **01_ESQUEMAS**: Creación de esquemas
2. **02_TABLAS**: Definición de tablas
3. **03_FOREIGN_KEY**: Claves foráneas
4. **04_INDEX**: Índices de rendimiento
5. **05_FUNCTIONS**: Funciones almacenadas
6. **06_TRIGGERS**: Triggers automáticos
7. **07_DATOS**: Datos iniciales

### Script de Migración Completa

```bash
#!/bin/bash
# migrate.sh - Script para ejecutar todas las migraciones

DB_HOST="192.168.1.2"
DB_NAME="QUALITYAPP_BD"
DB_USER="qualityapp_us"

echo "Iniciando migración de base de datos..."

# Ejecutar scripts en orden
for dir in 01_ESQUEMAS 02_TABLAS 03_FOREIGN_KEY 04_INDEX 05_FUNCTIONS 06_TRIGGERS 07_DATOS; do
    echo "Ejecutando scripts de $dir..."
    for file in 02_BaseDatos/PARCHE_V.01.00.000/$dir/OBJECTS/*.sql; do
        if [ -f "$file" ]; then
            echo "  - Ejecutando $file"
            psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f "$file"
        fi
    done
done

echo "Migración completada."
```

## Datos Iniciales

### Clasificaciones Estándar

```sql
INSERT INTO ge_clasification (clsf_range_min, clsf_range_max, clsf_level) VALUES
(0, 20, 'Muy Deficiente'),
(21, 40, 'Deficiente'),
(41, 60, 'Regular'),
(61, 80, 'Bueno'),
(81, 100, 'Excelente');
```

### Estándar ISO 25010

```sql
INSERT INTO ge_standards (strnd_name, strnd_version, strnd_description) VALUES
('ISO 25010', '2011', 'Estándar internacional para la evaluación de calidad de software');

-- Parámetros principales
INSERT INTO ge_parameters (param_standard_id, param_name, param_description, param_weight) VALUES
(1, 'Funcionalidad', 'Capacidad del software para proporcionar funciones que satisfacen las necesidades', 0.25),
(1, 'Fiabilidad', 'Capacidad del software para mantener un nivel específico de funcionamiento', 0.20),
(1, 'Usabilidad', 'Capacidad del software para ser entendido, aprendido y usado', 0.15),
(1, 'Eficiencia', 'Capacidad del software para proporcionar un rendimiento adecuado', 0.15),
(1, 'Mantenibilidad', 'Facilidad con la que el software puede ser modificado', 0.15),
(1, 'Portabilidad', 'Facilidad con la que el software puede ser transferido', 0.10);
```

### Usuario Administrador

```sql
INSERT INTO ge_participants (part_username, part_password, part_role, part_name, part_email) VALUES
('admin', '$2b$12$hashed_password_here', 'admin', 'Administrador del Sistema', 'admin@qualityapp.com');
```
