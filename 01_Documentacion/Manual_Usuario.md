# Quality App - Manual de Usuario

## Tabla de Contenidos
- [Introducción](#introducción)
- [Acceso al Sistema](#acceso-al-sistema)
- [Navegación](#navegación)
- [Gestión de Software](#gestión-de-software)
- [Gestión de Estándares](#gestión-de-estándares)
- [Proceso de Evaluación](#proceso-de-evaluación)
- [Generación de Reportes](#generación-de-reportes)
- [Administración](#administración)
- [Preguntas Frecuentes](#preguntas-frecuentes)

## Introducción

Quality App es un sistema integral para la evaluación de calidad de software basado en estándares internacionales como ISO 25010. Este manual le guiará a través de todas las funcionalidades del sistema.

### Roles de Usuario

- **Administrador**: Acceso completo al sistema, gestión de usuarios y configuraciones
- **Evaluador**: Puede realizar evaluaciones y generar reportes
- **Usuario**: Solo puede visualizar evaluaciones y reportes

## Acceso al Sistema

### Inicio de Sesión

1. Abra su navegador web y vaya a la URL del sistema
2. Ingrese su nombre de usuario y contraseña
3. Haga clic en "Iniciar Sesión"

![Login Screen](images/login.png)

### Primer Acceso

Si es su primer acceso:
1. Use las credenciales proporcionadas por el administrador
2. Se le solicitará cambiar su contraseña
3. Complete su perfil de usuario

## Navegación

### Menú Principal

El sistema cuenta con un menú lateral que incluye:

- **📊 Dashboard**: Vista general del sistema
- **💻 Software**: Gestión de productos de software
- **📋 Normas**: Gestión de estándares de evaluación
- **🎯 Evaluaciones**: Proceso de evaluación y resultados
- **🏆 Clasificaciones**: Rangos de calidad (solo administradores)
- **👥 Usuarios**: Gestión de usuarios (solo administradores)

### Dashboard

El dashboard muestra:
- Total de software registrado
- Total de evaluaciones realizadas
- Evaluaciones pendientes y completadas
- Gráficos de tendencias

## Gestión de Software

### Registrar Nuevo Software

1. Vaya a **Software** en el menú lateral
2. Haga clic en **"Nuevo Software"**
3. Complete el formulario:
   - **Nombre**: Nombre del producto
   - **Empresa**: Empresa desarrolladora
   - **Ciudad**: Ubicación de desarrollo
   - **Descripción**: Descripción detallada (opcional)
4. Haga clic en **"Guardar"**

### Editar Software

1. En la lista de software, haga clic en el ícono de edición (✏️)
2. Modifique los campos necesarios
3. Haga clic en **"Actualizar"**

### Eliminar Software

1. Haga clic en el ícono de eliminación (🗑️)
2. Confirme la eliminación
   - **Nota**: No se puede eliminar software con evaluaciones asociadas

## Gestión de Estándares

### Crear Nuevo Estándar

1. Vaya a **Normas** → **Estándares**
2. Haga clic en **"Nuevo Estándar"**
3. Complete:
   - **Nombre**: Nombre del estándar (ej: "ISO 25010")
   - **Versión**: Versión del estándar
   - **Descripción**: Descripción detallada
   - **Estado**: Activo/Inactivo
4. Guarde los cambios

### Gestionar Parámetros

1. Seleccione un estándar
2. Vaya a la pestaña **"Parámetros"**
3. Agregue parámetros de evaluación:
   - **Nombre**: Nombre del parámetro
   - **Descripción**: Descripción detallada
   - **Peso**: Importancia en la evaluación (0.0-1.0)
   - **Parámetro Padre**: Para crear jerarquías (opcional)

### Ejemplo: ISO 25010

Parámetros principales:
- **Funcionalidad** (Peso: 0.25)
  - Completitud funcional
  - Corrección funcional
  - Pertinencia funcional
- **Fiabilidad** (Peso: 0.20)
  - Madurez
  - Disponibilidad
  - Tolerancia a fallos
- **Usabilidad** (Peso: 0.15)
- **Eficiencia** (Peso: 0.15)
- **Mantenibilidad** (Peso: 0.15)
- **Portabilidad** (Peso: 0.10)

## Proceso de Evaluación

### Evaluación Guiada (Recomendado)

1. Vaya a **Evaluaciones**
2. Haga clic en **"Iniciar Evaluación"**
3. Seleccione:
   - **Software a evaluar**
   - **Norma de evaluación**
4. Haga clic en **"Iniciar Evaluación"**

### Proceso Paso a Paso

1. **Navegación por Parámetros**:
   - El sistema le guiará parámetro por parámetro
   - Vea la descripción de cada parámetro
   - Observe el peso del parámetro en la evaluación

2. **Asignación de Puntuación**:
   - Ingrese una puntuación de 0 a 100
   - El sistema asignará automáticamente la clasificación
   - Vea la clasificación en tiempo real

3. **Navegación**:
   - Use **"Anterior"** y **"Siguiente"** para navegar
   - Use **"Guardar y Continuar"** para guardar el progreso
   - Use **"Guardar Todo"** para guardar todas las evaluaciones

4. **Finalización**:
   - Complete todos los parámetros
   - Revise el resumen final
   - Confirme la evaluación

### Evaluación Manual

1. Vaya a **Evaluaciones**
2. Haga clic en **"Nueva Evaluación"**
3. Complete el formulario:
   - **Software**: Seleccione el software
   - **Norma**: Seleccione el estándar
   - **Parámetro**: Seleccione el parámetro específico
   - **Puntuación**: Ingrese la puntuación (0-100)
4. El sistema asignará automáticamente la clasificación

### Clasificaciones Automáticas

El sistema asigna automáticamente clasificaciones basadas en la puntuación:

| Rango | Clasificación |
|-------|---------------|
| 0-20 | Muy Deficiente |
| 21-40 | Deficiente |
| 41-60 | Regular |
| 61-80 | Bueno |
| 81-100 | Excelente |

## Generación de Reportes

### Reporte Individual

1. En la lista de evaluaciones, haga clic en el ícono de descarga (📥)
2. El sistema generará un PDF con:
   - Información del software
   - Detalles del estándar utilizado
   - Parámetro evaluado
   - Puntuación y clasificación obtenida
   - Conclusiones y recomendaciones

### Reporte Consolidado

1. Vaya a **Software**
2. Seleccione un software específico
3. Haga clic en **"Generar Reporte Consolidado"**
4. El reporte incluirá:
   - Todas las evaluaciones del software
   - Estadísticas generales
   - Gráficos de rendimiento
   - Análisis comparativo

### Contenido de los Reportes

Los reportes PDF incluyen:
- **Portada**: Logo y título del reporte
- **Información General**: Datos del software y empresa
- **Metodología**: Estándar utilizado y descripción
- **Resultados**: Puntuaciones y clasificaciones
- **Análisis**: Interpretación de resultados
- **Recomendaciones**: Sugerencias de mejora
- **Anexos**: Detalles técnicos

## Administración

### Gestión de Usuarios (Solo Administradores)

#### Crear Usuario
1. Vaya a **Usuarios**
2. Haga clic en **"Nuevo Usuario"**
3. Complete:
   - **Nombre de usuario**: Único en el sistema
   - **Contraseña**: Contraseña segura
   - **Rol**: admin/evaluator/user
   - **Nombre completo**
   - **Email**

#### Modificar Permisos
1. Seleccione un usuario
2. Modifique el rol según necesidades:
   - **admin**: Acceso completo
   - **evaluator**: Puede evaluar y generar reportes
   - **user**: Solo visualización

### Gestión de Clasificaciones

1. Vaya a **Clasificaciones**
2. Configure rangos de calidad:
   - **Rango Mínimo**: Puntuación mínima
   - **Rango Máximo**: Puntuación máxima
   - **Nivel**: Descripción del nivel

#### Ejemplo de Configuración
```
Rango: 0-20    → Nivel: Muy Deficiente
Rango: 21-40   → Nivel: Deficiente
Rango: 41-60   → Nivel: Regular
Rango: 61-80   → Nivel: Bueno
Rango: 81-100  → Nivel: Excelente
```

### Respaldo y Mantenimiento

#### Respaldo de Datos
- Los administradores pueden exportar datos
- Se recomienda respaldo semanal
- Incluir base de datos y archivos de configuración

#### Mantenimiento
- Revisar logs del sistema regularmente
- Monitorear rendimiento de la base de datos
- Actualizar clasificaciones según necesidades

## Preguntas Frecuentes

### ¿Puedo modificar una evaluación después de guardarla?
Sí, los usuarios con permisos de evaluador o administrador pueden editar evaluaciones existentes.

### ¿Qué pasa si no completo una evaluación?
El sistema guarda el progreso automáticamente. Puede continuar desde donde se quedó.

### ¿Puedo evaluar el mismo software con diferentes estándares?
Sí, puede evaluar un software con múltiples estándares para comparar resultados.

### ¿Cómo se calculan las clasificaciones?
Las clasificaciones se asignan automáticamente basadas en rangos configurables por el administrador.

### ¿Puedo personalizar los reportes?
Los reportes siguen un formato estándar, pero incluyen toda la información relevante de la evaluación.

### ¿Qué navegadores son compatibles?
El sistema es compatible con Chrome, Firefox, Safari y Edge en sus versiones más recientes.

### ¿Cómo recupero mi contraseña?
Contacte al administrador del sistema para restablecer su contraseña.

### ¿Puedo exportar datos a Excel?
Actualmente el sistema genera reportes en PDF. Para exportar datos, contacte al administrador.

## Soporte Técnico

Para soporte técnico o preguntas adicionales:
- **Email**: soporte@qualityapp.com
- **Documentación**: Consulte la documentación técnica
- **Administrador del Sistema**: Contacte a su administrador local

---

**Versión del Manual**: 1.0  
**Fecha de Actualización**: Enero 2024  
**Sistema**: Quality App v1.0.0
