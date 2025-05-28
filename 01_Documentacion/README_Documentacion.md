# Quality App - Índice de Documentación

## 📚 Documentación Completa del Sistema

Este directorio contiene toda la documentación técnica y de usuario para Quality App - Sistema de Evaluación de Calidad de Software.

## 📋 Índice de Documentos

### 📖 Documentación de Usuario
- **[Manual de Usuario](Manual_Usuario.md)** - Guía completa para usuarios finales
  - Proceso de evaluación paso a paso
  - Gestión de software y estándares
  - Generación de reportes
  - Preguntas frecuentes

### 🏗️ Documentación Técnica

#### Backend
- **[Arquitectura del Backend](Backend_Architecture.md)** - Documentación técnica del servidor
  - Patrones de diseño utilizados
  - Estructura de servicios y controladores
  - Modelos de datos
  - Seguridad y autenticación

#### Frontend
- **[Arquitectura del Frontend](Frontend_Architecture.md)** - Documentación de la interfaz
  - Componentes React y TypeScript
  - Gestión de estado
  - Routing y navegación
  - Patrones de desarrollo

#### Base de Datos
- **[Esquema de Base de Datos](Database_Schema.md)** - Documentación de la BD
  - Diagrama entidad-relación
  - Definición de tablas
  - Índices y triggers
  - Scripts de migración

#### API
- **[Documentación de la API](API_Documentation.md)** - Referencia completa de la API REST
  - Endpoints disponibles
  - Modelos de datos
  - Ejemplos de uso
  - Códigos de error

## 🚀 Guías de Inicio Rápido

### Para Desarrolladores

1. **Configuración del Entorno**
   ```bash
   # Clonar repositorio
   git clone https://github.com/tu-usuario/qualityapp_msv.git
   cd qualityapp_msv
   
   # Configurar variables de entorno
   cp .env.example .env
   # Editar .env con tus configuraciones
   
   # Ejecutar con Docker
   docker-compose up --build
   ```

2. **Estructura del Proyecto**
   - `01_Documentacion/` - Documentación completa
   - `02_BaseDatos/` - Scripts de base de datos
   - `03_Backend/` - API Flask (Python)
   - `04_Frontend/` - Aplicación React (TypeScript)

3. **Tecnologías Principales**
   - **Backend**: Python 3.9+, Flask, PostgreSQL
   - **Frontend**: React 18+, TypeScript, Tailwind CSS
   - **DevOps**: Docker, Docker Compose

### Para Administradores

1. **Instalación en Producción**
   - Revisar [README.md](../README.md) principal
   - Configurar variables de entorno de producción
   - Ejecutar scripts de migración de BD
   - Configurar usuarios iniciales

2. **Configuración Inicial**
   - Crear estándares de evaluación
   - Definir clasificaciones de calidad
   - Registrar usuarios del sistema
   - Configurar software a evaluar

3. **Mantenimiento**
   - Respaldos regulares de la base de datos
   - Monitoreo de logs del sistema
   - Actualización de clasificaciones según necesidades

### Para Usuarios Finales

1. **Acceso al Sistema**
   - Obtener credenciales del administrador
   - Acceder a la URL del sistema
   - Cambiar contraseña en primer acceso

2. **Flujo de Trabajo Típico**
   - Registrar software a evaluar
   - Seleccionar estándar de evaluación
   - Realizar evaluación guiada
   - Generar reportes PDF

## 📊 Diagramas y Esquemas

### Arquitectura General
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (React/TS)    │◄──►│   (Flask/Python)│◄──►│   Datos         │
│                 │    │                 │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flujo de Evaluación
```
Seleccionar Software → Elegir Estándar → Evaluar Parámetros → Generar Reporte
```

### Roles y Permisos
```
Administrador → Gestión completa del sistema
     ↓
Evaluador → Realizar evaluaciones y generar reportes
     ↓
Usuario → Solo visualización de evaluaciones
```

## 🔧 Herramientas de Desarrollo

### IDEs Recomendados
- **Visual Studio Code** con extensiones:
  - Python
  - TypeScript
  - React
  - PostgreSQL

### Herramientas de Testing
- **Backend**: pytest, Postman
- **Frontend**: Jest, React Testing Library
- **Base de Datos**: pgAdmin, DBeaver

### Herramientas de Debugging
- **Backend**: Flask Debug Mode, Python Debugger
- **Frontend**: React Developer Tools, Browser DevTools
- **API**: Postman, curl

## 📝 Convenciones de Código

### Backend (Python)
```python
# Nombres de archivos: snake_case
assessment_service.py

# Clases: PascalCase
class AssessmentService:

# Funciones y variables: snake_case
def get_all_assessments():
    assessment_data = []
```

### Frontend (TypeScript)
```typescript
// Archivos de componentes: PascalCase
EvaluationForm.tsx

// Componentes: PascalCase
const EvaluationForm: React.FC = () => {

// Funciones y variables: camelCase
const handleSubmit = (assessmentData: AssessmentFormData) => {
```

### Base de Datos (SQL)
```sql
-- Tablas: snake_case con prefijo
ge_software, rp_assessment

-- Columnas: snake_case con prefijo de tabla
soft_id, soft_name, assmt_score
```

## 🐛 Resolución de Problemas

### Problemas Comunes

1. **Error de Conexión a BD**
   - Verificar variables de entorno
   - Confirmar que PostgreSQL esté ejecutándose
   - Revisar permisos de usuario de BD

2. **Error 401 en API**
   - Verificar token JWT válido
   - Confirmar que el usuario tenga permisos
   - Revisar configuración de CORS

3. **Componentes no se renderizan**
   - Verificar imports de TypeScript
   - Revisar errores en consola del navegador
   - Confirmar que las dependencias estén instaladas

### Logs del Sistema

- **Backend**: Logs en consola de Flask
- **Frontend**: Consola del navegador
- **Base de Datos**: Logs de PostgreSQL
- **Docker**: `docker-compose logs`

## 📈 Métricas y Monitoreo

### KPIs del Sistema
- Número de evaluaciones realizadas
- Tiempo promedio de evaluación
- Distribución de clasificaciones
- Usuarios activos

### Monitoreo de Rendimiento
- Tiempo de respuesta de API
- Uso de memoria y CPU
- Conexiones a base de datos
- Errores del sistema

## 🔄 Proceso de Actualización

### Versionado
- Seguir [Semantic Versioning](https://semver.org/)
- Formato: MAJOR.MINOR.PATCH
- Ejemplo: 1.2.3

### Despliegue
1. Probar en entorno de desarrollo
2. Ejecutar tests automatizados
3. Crear backup de producción
4. Desplegar nueva versión
5. Verificar funcionamiento

## 📞 Contacto y Soporte

### Equipo de Desarrollo
- **Lead Developer**: Responsable de arquitectura general
- **Backend Team**: Desarrollo de API y servicios
- **Frontend Team**: Desarrollo de interfaz de usuario
- **DevOps Team**: Infraestructura y despliegue

### Canales de Comunicación
- **Issues**: GitHub Issues para bugs y features
- **Discussions**: GitHub Discussions para preguntas
- **Email**: Para soporte directo
- **Wiki**: Documentación adicional

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver [LICENSE](../LICENSE) para más detalles.

## 🙏 Contribuciones

Las contribuciones son bienvenidas. Por favor, lee las [guías de contribución](../README.md#contribución) antes de enviar un Pull Request.

---

**Última actualización**: Enero 2024  
**Versión de la documentación**: 1.0  
**Sistema**: Quality App v1.0.0
