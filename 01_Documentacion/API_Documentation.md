# Quality App - Documentación de la API

## Tabla de Contenidos
- [Introducción](#introducción)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Error](#códigos-de-error)
- [Ejemplos de Uso](#ejemplos-de-uso)

## Introducción

La API de Quality App es una API REST que permite gestionar evaluaciones de calidad de software. Está construida con Flask y utiliza autenticación JWT.

**Base URL**: `http://localhost:5000`

## Autenticación

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**Respuesta exitosa:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### Uso del Token
Incluir el token en el header de todas las peticiones:
```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Endpoints

### Software

#### Listar Software
```http
GET /software/software
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Sistema de Gestión",
    "company_name": "TechCorp",
    "city": "Madrid",
    "test_date": "2024-01-15T10:30:00Z"
  }
]
```

#### Crear Software
```http
POST /software/software
Content-Type: application/json

{
  "name": "Nuevo Sistema",
  "company_name": "Mi Empresa",
  "city": "Barcelona",
  "description": "Descripción del software"
}
```

#### Obtener Software por ID
```http
GET /software/software/{id}
```

#### Actualizar Software
```http
PUT /software/software/{id}
Content-Type: application/json

{
  "name": "Sistema Actualizado",
  "description": "Nueva descripción"
}
```

#### Eliminar Software
```http
DELETE /software/software/{id}
```

### Estándares

#### Listar Estándares
```http
GET /standard/standards
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "ISO 25010",
    "version": "2011",
    "description": "Estándar de calidad de software",
    "status": true
  }
]
```

#### Crear Estándar
```http
POST /standard/standards
Content-Type: application/json

{
  "name": "ISO 9126",
  "version": "2001",
  "description": "Estándar de calidad de software",
  "status": true
}
```

### Parámetros

#### Obtener Parámetros por Estándar
```http
GET /parameter/parameters/standard/{standard_id}
```

**Respuesta:**
```json
{
  "standard": {
    "id": 1,
    "name": "ISO 25010"
  },
  "parameters": [
    {
      "id": 1,
      "name": "Funcionalidad",
      "description": "Capacidad del software para proporcionar funciones",
      "weight": 0.25,
      "parent_id": null
    }
  ]
}
```

### Evaluaciones

#### Listar Evaluaciones
```http
GET /assessment/assessments
```

#### Crear Evaluación
```http
POST /assessment/assessments
Content-Type: application/json

{
  "software_id": 1,
  "standard_id": 1,
  "param_id": 1,
  "score": 85.5,
  "classification_id": 4
}
```

#### Obtener Evaluaciones por Software
```http
GET /assessment/assessments/software/{software_id}
```

### Clasificaciones

#### Listar Clasificaciones
```http
GET /classification/classifications
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "range_min": 0,
    "range_max": 20,
    "level": "Muy Deficiente"
  },
  {
    "id": 2,
    "range_min": 21,
    "range_max": 40,
    "level": "Deficiente"
  }
]
```

#### Obtener Clasificación por Puntuación
```http
GET /classification/classifications/score/{score}
```

### Reportes

#### Generar Reporte de Evaluación
```http
GET /report/reports/assessment/{assessment_id}
```
**Respuesta:** Archivo PDF

#### Generar Reporte de Software
```http
GET /report/reports/software/{software_id}
```
**Respuesta:** Archivo PDF

## Modelos de Datos

### Software
```typescript
interface Software {
  id: number;
  name: string;
  company_name: string;
  city: string;
  description?: string;
  test_date?: string;
  date_create?: string;
  date_update?: string;
}
```

### Standard
```typescript
interface Standard {
  id: number;
  name: string;
  version: string;
  description?: string;
  status: boolean;
  date_create?: string;
  date_update?: string;
}
```

### Parameter
```typescript
interface Parameter {
  id: number;
  name: string;
  description?: string;
  weight: number;
  standard_id: number;
  parent_id?: number;
  date_create?: string;
  date_update?: string;
}
```

### Assessment
```typescript
interface Assessment {
  id: number;
  software_id: number;
  standard_id: number;
  param_id: number;
  score?: number;
  classification_id?: number;
  date_create?: string;
  date_update?: string;
}
```

### Classification
```typescript
interface Classification {
  id: number;
  range_min: number;
  range_max: number;
  level: string;
  date_create?: string;
  date_update?: string;
}
```

## Códigos de Error

| Código | Descripción | Ejemplo |
|--------|-------------|---------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | Token inválido o faltante |
| 403 | Forbidden | Sin permisos |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto de datos |
| 500 | Internal Server Error | Error del servidor |

### Formato de Error
```json
{
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "details": {
    "field": "Campo específico con error"
  }
}
```

## Ejemplos de Uso

### Flujo Completo de Evaluación

1. **Autenticarse**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

2. **Crear Software**
```bash
curl -X POST http://localhost:5000/software/software \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi App", "company_name": "Mi Empresa", "city": "Madrid"}'
```

3. **Obtener Estándares**
```bash
curl -X GET http://localhost:5000/standard/standards \
  -H "Authorization: Bearer TOKEN"
```

4. **Obtener Parámetros**
```bash
curl -X GET http://localhost:5000/parameter/parameters/standard/1 \
  -H "Authorization: Bearer TOKEN"
```

5. **Crear Evaluación**
```bash
curl -X POST http://localhost:5000/assessment/assessments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"software_id": 1, "standard_id": 1, "param_id": 1, "score": 85}'
```

6. **Generar Reporte**
```bash
curl -X GET http://localhost:5000/report/reports/assessment/1 \
  -H "Authorization: Bearer TOKEN" \
  -o reporte.pdf
```

### Validaciones Comunes

#### Validación de Puntuación
- Rango: 0-100
- Tipo: Número decimal
- Opcional en creación

#### Validación de Clasificación
- Se asigna automáticamente basada en la puntuación
- Rangos configurables en la tabla de clasificaciones

#### Validación de Relaciones
- software_id debe existir en ge_software
- standard_id debe existir en ge_standards
- param_id debe existir en ge_parameters y pertenecer al estándar especificado
