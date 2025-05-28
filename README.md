# Quality App - Sistema de Evaluación de Calidad de Software

<div align="center">

![Quality App Logo](https://img.shields.io/badge/Quality-App-blue?style=for-the-badge&logo=quality&logoColor=white)

**Sistema integral para la evaluación de calidad de software basado en estándares internacionales**

[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-20+-2496ED?style=flat-square&logo=docker)](https://docker.com)

</div>

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🎯 Descripción

Quality App es un sistema integral diseñado para evaluar la calidad de software utilizando estándares internacionales como ISO 25010. La aplicación permite a las organizaciones realizar evaluaciones sistemáticas, generar reportes detallados y mantener un seguimiento continuo de la calidad de sus productos de software.

### Objetivos Principales

- **Evaluación Sistemática**: Implementar procesos estandarizados para la evaluación de calidad
- **Trazabilidad**: Mantener un historial completo de evaluaciones y mejoras
- **Reportes Automatizados**: Generar documentación profesional en formato PDF
- **Gestión Centralizada**: Administrar software, estándares, parámetros y clasificaciones desde una interfaz unificada

## ✨ Características

### 🔐 Gestión de Usuarios y Roles
- Sistema de autenticación JWT
- Roles diferenciados (Administrador, Evaluador, Usuario)
- Control de acceso basado en permisos

### 📊 Evaluación de Calidad
- **Proceso Guiado**: Evaluación paso a paso por parámetros
- **Clasificación Automática**: Asignación automática de niveles de calidad
- **Múltiples Estándares**: Soporte para ISO 25010 y otros estándares
- **Puntuación Ponderada**: Sistema de pesos por parámetro

### 📈 Dashboard y Métricas
- Estadísticas en tiempo real
- Indicadores de rendimiento (KPIs)
- Gráficos y visualizaciones
- Resúmenes ejecutivos

### 📄 Generación de Reportes
- **Reportes Individuales**: Por evaluación específica
- **Reportes Consolidados**: Por software o proyecto
- **Formato PDF**: Documentos profesionales descargables
- **Personalización**: Plantillas adaptables

### 🏢 Gestión de Entidades
- **Software**: Registro y administración de productos
- **Estándares**: Configuración de normas de evaluación
- **Parámetros**: Definición de criterios de calidad
- **Clasificaciones**: Rangos y niveles de calidad

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (React/TS)    │◄──►│   (Flask/Python)│◄──►│   Datos         │
│                 │    │                 │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   Docker        │◄─────────────┘
                        │   Containers    │
                        └─────────────────┘
```

### Componentes Principales

- **Frontend**: Aplicación React con TypeScript para la interfaz de usuario
- **Backend**: API REST desarrollada en Flask (Python)
- **Base de Datos**: PostgreSQL para persistencia de datos
- **Contenedores**: Docker para despliegue y desarrollo
- **Reportes**: ReportLab para generación de PDFs

## 🛠️ Tecnologías

### Frontend
- **React 18+**: Framework de interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de estilos utilitarios
- **React Router**: Navegación y enrutamiento
- **Axios**: Cliente HTTP para API calls
- **React Hook Form**: Gestión de formularios
- **Lucide React**: Iconografía moderna
- **React Toastify**: Notificaciones de usuario

### Backend
- **Python 3.9+**: Lenguaje de programación principal
- **Flask**: Framework web minimalista
- **Flask-JWT-Extended**: Autenticación JWT
- **psycopg2**: Conector PostgreSQL
- **ReportLab**: Generación de documentos PDF
- **python-dotenv**: Gestión de variables de entorno

### Base de Datos
- **PostgreSQL 14+**: Sistema de gestión de base de datos
- **Esquemas estructurados**: Diseño normalizado
- **Triggers y funciones**: Lógica de negocio en BD
- **Índices optimizados**: Rendimiento de consultas

### DevOps y Herramientas
- **Docker & Docker Compose**: Contenedorización
- **Git**: Control de versiones
- **VSCode**: Editor recomendado
- **Postman**: Testing de APIs

## 🚀 Instalación

### Prerrequisitos

- **Docker** y **Docker Compose** instalados
- **Git** para clonar el repositorio
- **Node.js 18+** (para desarrollo local del frontend)
- **Python 3.9+** (para desarrollo local del backend)

### Instalación con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/qualityapp_msv.git
cd qualityapp_msv
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Construir y ejecutar los contenedores**
```bash
docker-compose up --build
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Instalación Manual

#### Backend
```bash
cd 03_Backend/quality_service
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

#### Frontend
```bash
cd 04_Frontend/qualityapp_front
npm install
npm start
```

#### Base de Datos
```bash
# Ejecutar scripts de la base de datos en orden:
psql -U postgres -d qualityapp_db -f 02_BaseDatos/PARCHE_V.01.00.000/01_ESQUEMAS/OBJECTS/esquema.sql
psql -U postgres -d qualityapp_db -f 02_BaseDatos/PARCHE_V.01.00.000/02_TABLAS/OBJECTS/*.sql
# ... continuar con el resto de scripts
```

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_HOST=192.168.1.2
DB_PORT=5432
DB_NAME=QUALITYAPP_BD
DB_USER=qualityapp_us
DB_PASSWORD=tu_password

# JWT
JWT_SECRET_KEY=tu_clave_secreta_muy_segura

# API
API_BASE_URL=http://localhost:5000

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

### Configuración de Base de Datos

1. **Crear la base de datos**
```sql
CREATE DATABASE QUALITYAPP_BD;
CREATE USER qualityapp_us WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE QUALITYAPP_BD TO qualityapp_us;
```

2. **Ejecutar scripts de migración**
```bash
# Navegar a la carpeta de base de datos
cd 02_BaseDatos/PARCHE_V.01.00.000

# Ejecutar en orden:
# 1. Esquemas
# 2. Tablas
# 3. Claves foráneas
# 4. Índices
# 5. Funciones
# 6. Triggers
# 7. Datos iniciales
```

### Configuración de Docker

El archivo `docker-compose.yml` incluye:
- **quality_service**: Backend Flask
- **qualityapp_frontend**: Frontend React
- Configuración de red y volúmenes
- Variables de entorno automáticas

## 📖 Uso

### Acceso al Sistema

1. **Iniciar sesión**
   - Acceder a http://localhost:3000
   - Usar credenciales de administrador por defecto
   - Cambiar contraseña en el primer acceso

2. **Navegación Principal**
   - **Dashboard**: Vista general y métricas
   - **Software**: Gestión de productos a evaluar
   - **Normas**: Configuración de estándares
   - **Evaluaciones**: Proceso de evaluación y resultados
   - **Clasificaciones**: Rangos de calidad (solo admin)

### Flujo de Trabajo Típico

#### 1. Configuración Inicial (Administrador)
```
1. Crear/configurar estándares de evaluación
2. Definir parámetros y sus pesos
3. Establecer clasificaciones de calidad
4. Registrar software a evaluar
5. Crear usuarios evaluadores
```

#### 2. Proceso de Evaluación
```
1. Seleccionar software y estándar
2. Iniciar proceso de evaluación guiado
3. Evaluar cada parámetro (0-100 puntos)
4. Sistema asigna clasificación automáticamente
5. Guardar evaluación completa
```

#### 3. Generación de Reportes
```
1. Acceder a gestión de evaluaciones
2. Seleccionar evaluación específica
3. Descargar reporte PDF individual
4. O generar reporte consolidado por software
```

### Roles y Permisos

| Funcionalidad | Admin | Evaluador | Usuario |
|---------------|-------|-----------|---------|
| Dashboard | ✅ | ✅ | ✅ |
| Ver evaluaciones | ✅ | ✅ | ✅ |
| Crear evaluaciones | ✅ | ✅ | ❌ |
| Gestionar software | ✅ | ❌ | ❌ |
| Gestionar estándares | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Configurar clasificaciones | ✅ | ❌ | ❌ |

## 📚 API Documentation

### Autenticación

Todas las rutas requieren autenticación JWT excepto el login.

```bash
# Login
POST /auth/login
Content-Type: application/json
{
  "username": "admin",
  "password": "password"
}

# Respuesta
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### Endpoints Principales

#### Software
```bash
GET    /software/software           # Listar software
POST   /software/software           # Crear software
GET    /software/software/{id}      # Obtener software por ID
PUT    /software/software/{id}      # Actualizar software
DELETE /software/software/{id}      # Eliminar software
```

#### Estándares
```bash
GET    /standard/standards          # Listar estándares
POST   /standard/standards          # Crear estándar
GET    /standard/standards/{id}     # Obtener estándar por ID
PUT    /standard/standards/{id}     # Actualizar estándar
DELETE /standard/standards/{id}     # Eliminar estándar
```

#### Evaluaciones
```bash
GET    /assessment/assessments      # Listar evaluaciones
POST   /assessment/assessments      # Crear evaluación
GET    /assessment/assessments/{id} # Obtener evaluación por ID
PUT    /assessment/assessments/{id} # Actualizar evaluación
DELETE /assessment/assessments/{id} # Eliminar evaluación
```

#### Clasificaciones
```bash
GET    /classification/classifications           # Listar clasificaciones
POST   /classification/classifications           # Crear clasificación
GET    /classification/classifications/{id}      # Obtener por ID
GET    /classification/classifications/score/{score} # Obtener por puntuación
PUT    /classification/classifications/{id}      # Actualizar clasificación
DELETE /classification/classifications/{id}      # Eliminar clasificación
```

#### Reportes
```bash
GET    /report/reports/assessment/{id}  # Reporte de evaluación (PDF)
GET    /report/reports/software/{id}    # Reporte de software (PDF)
```

### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

## 📁 Estructura del Proyecto

```
qualityapp_msv/
├── 📁 01_Documentacion/           # Documentación del proyecto
│   ├── 📄 Especificaciones.md
│   ├── 📄 Manual_Usuario.pdf
│   └── 📄 Arquitectura.md
│
├── 📁 02_BaseDatos/              # Scripts de base de datos
│   └── 📁 PARCHE_V.01.00.000/
│       ├── 📁 01_ESQUEMAS/       # Esquemas de BD
│       ├── 📁 02_TABLAS/         # Definición de tablas
│       ├── 📁 03_FOREIGN_KEY/    # Claves foráneas
│       ├── 📁 04_INDEX/          # Índices
│       ├── 📁 05_FUNCTIONS/      # Funciones de BD
│       ├── 📁 06_TRIGGERS/       # Triggers
│       └── 📁 07_DATOS/          # Datos iniciales
│
├── 📁 03_Backend/                # Backend Flask
│   └── 📁 quality_service/
│       ├── 📁 app/
│       │   ├── 📁 controllers/   # Rutas y controladores
│       │   │   ├── 📄 assessment_routes.py
│       │   │   ├── 📄 classification_routes.py
│       │   │   ├── 📄 parameter_routes.py
│       │   │   ├── 📄 report_routes.py
│       │   │   ├── 📄 software_routes.py
│       │   │   └── 📄 standard_routes.py
│       │   │
│       │   ├── 📁 models/        # Modelos de datos
│       │   │   ├── 📄 assessment.py
│       │   │   ├── 📄 classification.py
│       │   │   ├── 📄 parameter.py
│       │   │   ├── 📄 software.py
│       │   │   └── 📄 standard.py
│       │   │
│       │   ├── 📁 services/      # Lógica de negocio
│       │   │   ├── 📄 assessment_service.py
│       │   │   ├── 📄 classification_service.py
│       │   │   ├── 📄 parameter_service.py
│       │   │   ├── 📄 report_service.py
│       │   │   ├── 📄 software_service.py
│       │   │   └── 📄 standard_service.py
│       │   │
│       │   ├── 📄 __init__.py    # Configuración de la app
│       │   └── 📄 db.py          # Conexión a BD
│       │
│       ├── 📄 requirements.txt   # Dependencias Python
│       ├── 📄 Dockerfile         # Imagen Docker
│       └── 📄 run.py            # Punto de entrada
│
├── 📁 04_Frontend/               # Frontend React
│   └── 📁 qualityapp_front/
│       ├── 📁 public/           # Archivos públicos
│       ├── 📁 src/
│       │   ├── 📁 components/   # Componentes reutilizables
│       │   │   ├── 📁 Layout/   # Layout y navegación
│       │   │   ├── 📁 Modal/    # Componentes de modal
│       │   │   └── 📁 Forms/    # Formularios
│       │   │
│       │   ├── 📁 contexts/     # Contextos React
│       │   │   └── 📄 AuthContext.tsx
│       │   │
│       │   ├── 📁 pages/        # Páginas principales
│       │   │   ├── 📄 Dashboard.tsx
│       │   │   ├── 📄 EvaluationManagement.tsx
│       │   │   ├── 📄 EvaluationProcess.tsx
│       │   │   ├── 📄 ClassificationManagement.tsx
│       │   │   ├── 📄 SoftwareManagement.tsx
│       │   │   └── 📄 StandardManagement.tsx
│       │   │
│       │   ├── 📁 services/     # Servicios API
│       │   │   └── 📄 api.ts
│       │   │
│       │   ├── 📁 types/        # Tipos TypeScript
│       │   │   └── 📄 standard.ts
│       │   │
│       │   ├── 📁 utils/        # Utilidades
│       │   │   └── 📄 dateUtils.ts
│       │   │
│       │   └── 📄 App.tsx       # Componente principal
│       │
│       ├── 📄 package.json      # Dependencias Node.js
│       ├── 📄 Dockerfile        # Imagen Docker
│       └── 📄 tailwind.config.js # Configuración Tailwind
│
├── 📄 docker-compose.yml        # Orquestación Docker
├── 📄 .env.example             # Variables de entorno ejemplo
├── 📄 .gitignore               # Archivos ignorados por Git
└── 📄 README.md                # Este archivo
```

## 🗄️ Base de Datos

### Esquema Principal

La base de datos utiliza PostgreSQL con el siguiente esquema:

#### Tablas Principales

| Tabla | Descripción | Campos Principales |
|-------|-------------|-------------------|
| `ge_software` | Software a evaluar | `soft_id`, `soft_name`, `soft_company` |
| `ge_standards` | Estándares de evaluación | `strnd_id`, `strnd_name`, `strnd_version` |
| `ge_parameters` | Parámetros de evaluación | `param_id`, `param_name`, `param_weight` |
| `ge_clasification` | Clasificaciones de calidad | `clsf_id`, `clsf_range_min`, `clsf_range_max`, `clsf_level` |
| `rp_assessment` | Evaluaciones realizadas | `assmt_id`, `assmt_software_id`, `assmt_score` |
| `ge_participants` | Usuarios del sistema | `part_id`, `part_username`, `part_role` |

#### Relaciones Principales

```sql
-- Software puede tener múltiples evaluaciones
ge_software (1) ←→ (N) rp_assessment

-- Estándar puede tener múltiples parámetros
ge_standards (1) ←→ (N) ge_parameters

-- Parámetro puede tener múltiples evaluaciones
ge_parameters (1) ←→ (N) rp_assessment

-- Clasificación puede aplicar a múltiples evaluaciones
ge_clasification (1) ←→ (N) rp_assessment
```

### Scripts de Migración

Los scripts están organizados en orden de ejecución:

1. **01_ESQUEMAS**: Creación de esquemas de base de datos
2. **02_TABLAS**: Definición de todas las tablas
3. **03_FOREIGN_KEY**: Claves foráneas y relaciones
4. **04_INDEX**: Índices para optimización
5. **05_FUNCTIONS**: Funciones almacenadas
6. **06_TRIGGERS**: Triggers para lógica automática
7. **07_DATOS**: Datos iniciales y de prueba

### Datos Iniciales

El sistema incluye datos de ejemplo:

- **Clasificaciones estándar**: Muy Deficiente (0-20), Deficiente (21-40), Regular (41-60), Bueno (61-80), Excelente (81-100)
- **Estándar ISO 25010**: Con parámetros principales de calidad
- **Usuario administrador**: Para configuración inicial

## 🔧 Desarrollo

### Configuración del Entorno de Desarrollo

#### Prerrequisitos para Desarrollo
```bash
# Instalar dependencias globales
npm install -g typescript
pip install virtualenv
```

#### Backend (Flask)
```bash
cd 03_Backend/quality_service

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Variables de entorno para desarrollo
cp .env.example .env

# Ejecutar en modo desarrollo
export FLASK_ENV=development
python run.py
```

#### Frontend (React)
```bash
cd 04_Frontend/qualityapp_front

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Ejecutar tests
npm test

# Build para producción
npm run build
```

### Estructura de Desarrollo

#### Patrones de Código

**Backend (Flask)**
- **MVC Pattern**: Separación clara entre modelos, vistas y controladores
- **Service Layer**: Lógica de negocio en servicios separados
- **Repository Pattern**: Acceso a datos centralizado

**Frontend (React)**
- **Component-Based**: Componentes reutilizables y modulares
- **Custom Hooks**: Lógica compartida en hooks personalizados
- **Context API**: Estado global con React Context
- **TypeScript**: Tipado estático para mejor mantenibilidad

#### Convenciones de Nomenclatura

```bash
# Backend
- Archivos: snake_case (assessment_service.py)
- Clases: PascalCase (AssessmentService)
- Funciones: snake_case (get_all_assessments)
- Variables: snake_case (assessment_data)

# Frontend
- Archivos: PascalCase para componentes (EvaluationForm.tsx)
- Componentes: PascalCase (EvaluationForm)
- Funciones: camelCase (handleSubmit)
- Variables: camelCase (assessmentData)
```

### Testing

#### Backend Tests
```bash
cd 03_Backend/quality_service
python -m pytest tests/
```

#### Frontend Tests
```bash
cd 04_Frontend/qualityapp_front
npm test
```

### Debugging

#### Backend
```python
# Activar modo debug en run.py
app.run(debug=True, host='0.0.0.0', port=5000)
```

#### Frontend
```bash
# React Developer Tools
# Redux DevTools (si se usa Redux)
# Browser DevTools para debugging
```

## 🤝 Contribución

### Cómo Contribuir

1. **Fork del repositorio**
```bash
git clone https://github.com/tu-usuario/qualityapp_msv.git
cd qualityapp_msv
```

2. **Crear rama de feature**
```bash
git checkout -b feature/nueva-funcionalidad
```

3. **Realizar cambios**
```bash
# Hacer cambios en el código
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

4. **Push y Pull Request**
```bash
git push origin feature/nueva-funcionalidad
# Crear Pull Request en GitHub
```

### Estándares de Código

#### Commits
Usar [Conventional Commits](https://www.conventionalcommits.org/):
```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

#### Code Review
- Todos los PRs requieren revisión
- Tests deben pasar
- Documentación debe estar actualizada
- Seguir estándares de código establecidos

### Reportar Issues

Al reportar un bug, incluir:
- **Descripción clara** del problema
- **Pasos para reproducir** el error
- **Comportamiento esperado** vs actual
- **Screenshots** si es aplicable
- **Información del entorno** (OS, navegador, versión)

### Solicitar Features

Para nuevas funcionalidades:
- **Descripción detallada** de la funcionalidad
- **Justificación** del por qué es necesaria
- **Casos de uso** específicos
- **Mockups o wireframes** si es aplicable

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

### MIT License

```
Copyright (c) 2024 Quality App Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Soporte y Contacto

### Documentación Adicional
- **Wiki del Proyecto**: [GitHub Wiki](https://github.com/tu-usuario/qualityapp_msv/wiki)
- **API Documentation**: [Postman Collection](docs/api-collection.json)
- **Manual de Usuario**: [PDF](01_Documentacion/Manual_Usuario.pdf)

### Comunidad
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/qualityapp_msv/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/qualityapp_msv/discussions)
- **Email**: qualityapp@empresa.com

### Mantenedores
- **Lead Developer**: [@tu-usuario](https://github.com/tu-usuario)
- **Backend Team**: [@backend-team](https://github.com/backend-team)
- **Frontend Team**: [@frontend-team](https://github.com/frontend-team)

---

<div align="center">

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub ⭐**

[![GitHub stars](https://img.shields.io/github/stars/tu-usuario/qualityapp_msv?style=social)](https://github.com/tu-usuario/qualityapp_msv/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/tu-usuario/qualityapp_msv?style=social)](https://github.com/tu-usuario/qualityapp_msv/network/members)

**Desarrollado con ❤️ por el equipo de Quality App**

</div>
