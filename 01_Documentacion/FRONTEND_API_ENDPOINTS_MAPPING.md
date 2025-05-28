# 📋 Mapeo de Endpoints Frontend ↔ Backend

## 🔄 Resumen de Cambios Realizados

Se ha actualizado completamente el archivo `04_Frontend/qualityapp_front/src/services/api.ts` para que todos los endpoints del frontend coincidan exactamente con los endpoints implementados en el backend.

---

## 🔐 AUTH SERVICE ENDPOINTS (Puerto 5000)

### **authService**
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario (Solo Admin)
- `GET /auth/profile` - Obtener perfil del usuario autenticado
- `GET /auth/health` - Health check del servicio

### **userService**
- `GET /users/all` - Obtener todos los usuarios (Solo Admin)
- `GET /users/{id}` - Obtener usuario por ID (Solo Admin)
- `POST /auth/register` - Crear usuario (Solo Admin)
- `PUT /users/{id}` - Actualizar usuario (Solo Admin)
- `DELETE /users/{id}` - Eliminar usuario (Solo Admin)

### **activityService**
- `GET /activity/logs` - Obtener logs de actividad (Solo Admin)

---

## ⚡ QUALITY SERVICE ENDPOINTS (Puerto 5001)

### **softwareService**
- `GET /software/list` - Listar software (Admin/Tester)
- `GET /software/{id}` - Obtener software por ID (Admin/Tester)
- `POST /software/register` - Registrar software (Admin/Tester)
- `PUT /software/{id}` - Actualizar software (Admin/Tester)
- `DELETE /software/{id}` - Eliminar software (Admin/Tester)

### **standardService**
- `GET /standard/list` - Listar normas
- `GET /standard/{id}` - Obtener norma por ID
- `POST /standard/create` - Crear norma (Solo Admin)
- `PUT /standard/{id}` - Actualizar norma (Solo Admin)
- `DELETE /standard/{id}` - Eliminar norma (Solo Admin)

### **parameterService**
- `POST /parameter/create` - Crear parámetro (Solo Admin)
- `GET /parameter/standard/{standardId}` - Obtener parámetros por norma
- `GET /parameter/{id}` - Obtener parámetro por ID
- `PUT /parameter/{id}` - Actualizar parámetro (Solo Admin)
- `DELETE /parameter/{id}` - Eliminar parámetro (Solo Admin)

### **subcategoryService**
- `GET /subcategory/subcategories/parameter/{parameterId}` - Obtener subcategorías por parámetro
- `GET /subcategory/subcategories/{id}` - Obtener subcategoría por ID
- `POST /subcategory/subcategories` - Crear subcategoría
- `PUT /subcategory/subcategories/{id}` - Actualizar subcategoría
- `DELETE /subcategory/subcategories/{id}` - Eliminar subcategoría

### **participantService**
- `GET /participant/list` - Listar participantes
- `GET /participant/{id}` - Obtener participante por ID
- `POST /participant/register` - Registrar participante (Admin/Tester)
- `PUT /participant/{id}` - Actualizar participante (Admin/Tester)
- `DELETE /participant/{id}` - Eliminar participante (Admin/Tester)

### **assessmentService**
- `POST /assessment/assessments` - Crear evaluación
- `GET /assessment/assessments/{id}` - Obtener evaluación por ID
- `PUT /assessment/assessments/{id}` - Actualizar evaluación
- `DELETE /assessment/assessments/{id}` - Eliminar evaluación
- `GET /assessment/assessments/software/{softwareId}` - Obtener evaluaciones por software
- `GET /assessment/assessments/standard/{standardId}` - Obtener evaluaciones por norma
- `GET /assessment/assessments/software/{softwareId}/summary` - Resumen de evaluaciones por software

### **classificationService**
- `GET /classification/classifications` - Listar clasificaciones
- `GET /classification/classifications/{id}` - Obtener clasificación por ID
- `GET /classification/classifications/score/{score}` - Obtener clasificación por puntaje
- `POST /classification/classifications` - Crear clasificación (Solo Admin)
- `PUT /classification/classifications/{id}` - Actualizar clasificación (Solo Admin)
- `DELETE /classification/classifications/{id}` - Eliminar clasificación (Solo Admin)

### **resultService**
- `POST /result/results` - Crear resultado
- `GET /result/results/{id}` - Obtener resultado por ID
- `PUT /result/results/{id}` - Actualizar resultado
- `DELETE /result/results/{id}` - Eliminar resultado
- `GET /result/results/assessment/{assessmentId}` - Obtener resultados por evaluación

### **reportService**
- `GET /report/reports/assessment/{assessmentId}` - Generar reporte de evaluación (PDF)
- `GET /report/reports/software/{softwareId}` - Generar reporte de software (PDF)

---

## 🔧 Características Técnicas

### **Configuración de Axios**
- **Auth Service**: `http://localhost:5000` (configurable via `VITE_AUTH_SERVICE_URL`)
- **Quality Service**: `http://localhost:5001` (configurable via `VITE_QUALITY_SERVICE_URL`)

### **Interceptores Implementados**
- **Request Interceptor**: Añade automáticamente el token JWT a todas las peticiones
- **Response Interceptor**: Maneja errores 401 y redirige al login automáticamente

### **Manejo de Archivos**
- Los endpoints de reportes incluyen `responseType: 'blob'` para descargar PDFs

### **Compatibilidad**
- Se mantiene `evaluationService` como alias de `assessmentService` para compatibilidad hacia atrás

---

## ✅ Validaciones Realizadas

1. ✅ Todos los endpoints coinciden exactamente con el backend
2. ✅ Métodos HTTP correctos (GET, POST, PUT, DELETE)
3. ✅ Rutas con prefijos correctos (/auth, /users, /software, etc.)
4. ✅ Parámetros de ruta correctos ({id}, {standardId}, etc.)
5. ✅ Configuración correcta para descarga de archivos PDF
6. ✅ Interceptores de autenticación funcionando
7. ✅ Separación correcta entre servicios de Auth y Quality

---

## 🚀 Próximos Pasos

1. **Actualizar componentes Vue** para usar los nuevos servicios
2. **Implementar manejo de errores** específico por servicio
3. **Añadir tipos TypeScript** para las respuestas de la API
4. **Crear composables** para lógica de negocio reutilizable
5. **Implementar cache** para datos que no cambian frecuentemente

---

*Documento generado automáticamente - Fecha: $(date)*
