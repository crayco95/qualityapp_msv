# Quality App - Arquitectura del Backend

## Tabla de Contenidos
- [Introducción](#introducción)
- [Tecnologías](#tecnologías)
- [Arquitectura General](#arquitectura-general)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Patrones de Diseño](#patrones-de-diseño)
- [Modelos de Datos](#modelos-de-datos)
- [Servicios](#servicios)
- [Controladores](#controladores)
- [Base de Datos](#base-de-datos)
- [Seguridad](#seguridad)

## Introducción

El backend de Quality App está construido con Flask siguiendo una arquitectura en capas que separa claramente las responsabilidades. Utiliza el patrón MVC (Model-View-Controller) adaptado para APIs REST.

## Tecnologías

### Core
- **Python 3.9+**: Lenguaje principal
- **Flask 2.3+**: Framework web
- **Flask-JWT-Extended**: Autenticación JWT
- **psycopg2**: Driver PostgreSQL

### Librerías Adicionales
- **ReportLab**: Generación de PDFs
- **python-dotenv**: Variables de entorno
- **Werkzeug**: Utilidades WSGI

## Arquitectura General

```
┌─────────────────┐
│   Controllers   │ ← Rutas HTTP y validación de entrada
│   (Routes)      │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│    Services     │ ← Lógica de negocio
│                 │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│     Models      │ ← Representación de datos
│                 │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Database      │ ← Persistencia de datos
│   (PostgreSQL)  │
└─────────────────┘
```

## Estructura de Carpetas

```
03_Backend/quality_service/
├── app/
│   ├── __init__.py              # Configuración de la aplicación Flask
│   ├── db.py                    # Conexión a base de datos
│   │
│   ├── controllers/             # Controladores (Rutas HTTP)
│   │   ├── __init__.py
│   │   ├── auth_routes.py       # Autenticación
│   │   ├── assessment_routes.py # Evaluaciones
│   │   ├── classification_routes.py # Clasificaciones
│   │   ├── parameter_routes.py  # Parámetros
│   │   ├── report_routes.py     # Reportes
│   │   ├── software_routes.py   # Software
│   │   └── standard_routes.py   # Estándares
│   │
│   ├── models/                  # Modelos de datos
│   │   ├── __init__.py
│   │   ├── assessment.py        # Modelo de evaluación
│   │   ├── classification.py    # Modelo de clasificación
│   │   ├── parameter.py         # Modelo de parámetro
│   │   ├── software.py          # Modelo de software
│   │   ├── standard.py          # Modelo de estándar
│   │   └── user.py              # Modelo de usuario
│   │
│   └── services/                # Servicios (Lógica de negocio)
│       ├── __init__.py
│       ├── assessment_service.py
│       ├── classification_service.py
│       ├── parameter_service.py
│       ├── report_service.py
│       ├── software_service.py
│       └── standard_service.py
│
├── requirements.txt             # Dependencias Python
├── Dockerfile                   # Imagen Docker
└── run.py                      # Punto de entrada
```

## Patrones de Diseño

### 1. Model-View-Controller (MVC)

#### Models
```python
class Assessment:
    """Modelo que representa una evaluación"""
    def __init__(self, id=None, software_id=None, standard_id=None, 
                 param_id=None, score=None, classification_id=None,
                 date_create=None, date_update=None):
        self.id = id
        self.software_id = software_id
        self.standard_id = standard_id
        self.param_id = param_id
        self.score = score
        self.classification_id = classification_id
        self.date_create = date_create
        self.date_update = date_update

    @classmethod
    def from_db_row(cls, row):
        """Crear instancia desde fila de BD"""
        if not row:
            return None
        return cls(*row)

    def to_dict(self):
        """Convertir a diccionario para JSON"""
        return {
            'id': self.id,
            'software_id': self.software_id,
            'standard_id': self.standard_id,
            'param_id': self.param_id,
            'score': self.score,
            'classification_id': self.classification_id,
            'date_create': self.date_create.isoformat() if self.date_create else None,
            'date_update': self.date_update.isoformat() if self.date_update else None
        }
```

#### Services (Business Logic)
```python
class AssessmentService:
    """Servicio para lógica de negocio de evaluaciones"""
    
    @staticmethod
    def create_assessment(software_id, standard_id, param_id, score=None):
        """Crear nueva evaluación con validaciones"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Validar software existe
            cursor.execute("SELECT soft_id FROM ge_software WHERE soft_id = %s", (software_id,))
            if not cursor.fetchone():
                raise ValueError("El software especificado no existe")
            
            # Validar estándar existe
            cursor.execute("SELECT strnd_id FROM ge_standards WHERE strnd_id = %s", (standard_id,))
            if not cursor.fetchone():
                raise ValueError("El estándar especificado no existe")
            
            # Validar parámetro existe y pertenece al estándar
            cursor.execute("""
                SELECT param_id FROM ge_parameters 
                WHERE param_id = %s AND param_standard_id = %s
            """, (param_id, standard_id))
            if not cursor.fetchone():
                raise ValueError("El parámetro no existe o no pertenece al estándar especificado")
            
            # Determinar clasificación si hay score
            classification_id = None
            if score is not None:
                classification = ClassificationService.get_classification_by_score(score)
                if classification:
                    classification_id = classification.id
            
            # Insertar evaluación
            cursor.execute("""
                INSERT INTO rp_assessment 
                (assmt_software_id, assmt_standard_id, assmt_param_id, assmt_score, 
                 assmt_classification_id, assmt_date_create)
                VALUES (%s, %s, %s, %s, %s, NOW())
                RETURNING assmt_id
            """, (software_id, standard_id, param_id, score, classification_id))
            
            assessment_id = cursor.fetchone()[0]
            conn.commit()
            
            return AssessmentService.get_assessment_by_id(assessment_id)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
```

#### Controllers (Routes)
```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

assessment_bp = Blueprint('assessment', __name__)

@assessment_bp.route('/assessments', methods=['POST'])
@jwt_required()
def create_assessment():
    """Endpoint para crear evaluación"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['software_id', 'standard_id', 'param_id']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        # Validar tipos de datos
        try:
            software_id = int(data['software_id'])
            standard_id = int(data['standard_id'])
            param_id = int(data['param_id'])
            score = float(data.get('score')) if data.get('score') is not None else None
        except (ValueError, TypeError):
            return jsonify({'error': 'Tipos de datos inválidos'}), 400
        
        # Validar rango de score
        if score is not None and (score < 0 or score > 100):
            return jsonify({'error': 'La puntuación debe estar entre 0 y 100'}), 400
        
        # Crear evaluación
        assessment = AssessmentService.create_assessment(
            software_id, standard_id, param_id, score
        )
        
        return jsonify(assessment.to_dict()), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500
```

### 2. Repository Pattern

```python
class BaseRepository:
    """Repositorio base con operaciones CRUD comunes"""
    
    def __init__(self, table_name, model_class):
        self.table_name = table_name
        self.model_class = model_class
    
    def get_all(self):
        """Obtener todos los registros"""
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(f"SELECT * FROM {self.table_name}")
            return [self.model_class.from_db_row(row) for row in cursor.fetchall()]
        finally:
            conn.close()
    
    def get_by_id(self, id):
        """Obtener registro por ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(f"SELECT * FROM {self.table_name} WHERE id = %s", (id,))
            row = cursor.fetchone()
            return self.model_class.from_db_row(row) if row else None
        finally:
            conn.close()
```

### 3. Factory Pattern

```python
class ServiceFactory:
    """Factory para crear servicios"""
    
    _services = {
        'assessment': AssessmentService,
        'software': SoftwareService,
        'standard': StandardService,
        'classification': ClassificationService,
        'parameter': ParameterService,
        'report': ReportService
    }
    
    @classmethod
    def get_service(cls, service_name):
        """Obtener instancia de servicio"""
        service_class = cls._services.get(service_name)
        if not service_class:
            raise ValueError(f"Servicio '{service_name}' no encontrado")
        return service_class()
```

## Modelos de Datos

### Modelo Base
```python
from datetime import datetime
from abc import ABC, abstractmethod

class BaseModel(ABC):
    """Modelo base con funcionalidad común"""
    
    def __init__(self):
        self.date_create = None
        self.date_update = None
    
    @classmethod
    @abstractmethod
    def from_db_row(cls, row):
        """Crear instancia desde fila de BD"""
        pass
    
    @abstractmethod
    def to_dict(self):
        """Convertir a diccionario"""
        pass
    
    def __repr__(self):
        return f"<{self.__class__.__name__}(id={getattr(self, 'id', None)})>"
```

### Validaciones
```python
class ValidationMixin:
    """Mixin para validaciones comunes"""
    
    @staticmethod
    def validate_required_fields(data, required_fields):
        """Validar campos requeridos"""
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ValueError(f"Campos requeridos faltantes: {', '.join(missing_fields)}")
    
    @staticmethod
    def validate_score(score):
        """Validar puntuación"""
        if score is not None:
            if not isinstance(score, (int, float)):
                raise ValueError("La puntuación debe ser un número")
            if score < 0 or score > 100:
                raise ValueError("La puntuación debe estar entre 0 y 100")
```

## Servicios

### Estructura de Servicio
```python
class BaseService:
    """Servicio base con operaciones comunes"""
    
    @staticmethod
    def get_db_connection():
        """Obtener conexión a BD"""
        return get_db_connection()
    
    @classmethod
    def handle_db_operation(cls, operation):
        """Manejar operación de BD con transacción"""
        conn = cls.get_db_connection()
        try:
            result = operation(conn)
            conn.commit()
            return result
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
```

### Servicio de Reportes
```python
class ReportService:
    """Servicio para generación de reportes"""
    
    @staticmethod
    def generate_assessment_report(assessment_id):
        """Generar reporte PDF de evaluación"""
        # Obtener datos de la evaluación
        assessment_data = AssessmentService.get_assessment_with_details(assessment_id)
        
        # Generar PDF con ReportLab
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        
        # Construir contenido del reporte
        story = ReportService._build_assessment_story(assessment_data)
        
        # Generar PDF
        doc.build(story)
        return buffer.getvalue()
    
    @staticmethod
    def _build_assessment_story(data):
        """Construir contenido del reporte"""
        styles = getSampleStyleSheet()
        story = []
        
        # Título
        story.append(Paragraph(f"Reporte de Evaluación - {data['software_name']}", 
                              styles['Heading1']))
        
        # Contenido detallado...
        return story
```

## Base de Datos

### Conexión
```python
import psycopg2
from psycopg2.extras import RealDictCursor
import os

def get_db_connection():
    """Obtener conexión a PostgreSQL"""
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            cursor_factory=RealDictCursor
        )
        return conn
    except psycopg2.Error as e:
        raise Exception(f"Error conectando a la base de datos: {e}")
```

### Pool de Conexiones
```python
from psycopg2 import pool

class DatabasePool:
    """Pool de conexiones a la base de datos"""
    
    _instance = None
    _pool = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def initialize_pool(self, minconn=1, maxconn=20):
        """Inicializar pool de conexiones"""
        self._pool = psycopg2.pool.ThreadedConnectionPool(
            minconn, maxconn,
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
    
    def get_connection(self):
        """Obtener conexión del pool"""
        return self._pool.getconn()
    
    def put_connection(self, conn):
        """Devolver conexión al pool"""
        self._pool.putconn(conn)
```

## Seguridad

### Autenticación JWT
```python
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

def configure_jwt(app):
    """Configurar JWT"""
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    
    jwt = JWTManager(app)
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token expirado'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Token inválido'}), 401
```

### Validación de Entrada
```python
from functools import wraps

def validate_json(*required_fields):
    """Decorador para validar JSON de entrada"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({'error': 'Content-Type debe ser application/json'}), 400
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'JSON inválido'}), 400
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return jsonify({
                    'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
                }), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Uso del decorador
@assessment_bp.route('/assessments', methods=['POST'])
@jwt_required()
@validate_json('software_id', 'standard_id', 'param_id')
def create_assessment():
    # Implementación...
```

### Sanitización de Datos
```python
import bleach
from html import escape

class DataSanitizer:
    """Sanitizador de datos de entrada"""
    
    @staticmethod
    def sanitize_string(value, max_length=None):
        """Sanitizar string"""
        if not isinstance(value, str):
            return value
        
        # Escapar HTML
        sanitized = escape(value.strip())
        
        # Limitar longitud
        if max_length and len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized
    
    @staticmethod
    def sanitize_number(value, min_val=None, max_val=None):
        """Sanitizar número"""
        try:
            num = float(value)
            if min_val is not None and num < min_val:
                raise ValueError(f"Valor debe ser mayor o igual a {min_val}")
            if max_val is not None and num > max_val:
                raise ValueError(f"Valor debe ser menor o igual a {max_val}")
            return num
        except (ValueError, TypeError):
            raise ValueError("Valor numérico inválido")
```
