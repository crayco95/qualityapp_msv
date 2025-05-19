from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from security import hash_password, verify_password, generate_token
from db import get_db_connection
from log_manager import log_event
from middleware import limit_login_attempts


auth_bp = Blueprint('auth', __name__)

### 🔹 Registrar usuarios (Solo Administradores)
@auth_bp.route('/register', methods=['POST'])
@jwt_required()
def register():
    claims = get_jwt()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si el usuario es admin
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden crear usuarios"}), 403

    data = request.json

    # Validar que todos los campos requeridos estén presentes
    required_fields = ['nombre', 'email', 'password', 'rol']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo {field} es requerido"}), 422
            
    # Validar que el email tenga un formato válido
    if not '@' in data['email'] or not '.' in data['email']:
        return jsonify({"error": "Formato de email inválido"}), 422
        
    # Validar que el rol sea válido
    roles_validos = ['admin', 'user', 'evaluador']  # Ajusta esto según tus roles permitidos
    if data['rol'] not in roles_validos:
        return jsonify({"error": "Rol no válido"}), 422
        
    # Validar longitud mínima de la contraseña
    if len(data['password']) < 6:
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 422
    

    # Verificar si el usuario ya existe
    cursor.execute("SELECT usr_id, usr_password, usr_rol FROM au_users WHERE usr_email = %s;", (data['email'],))
    if cursor.fetchone():
        return jsonify({"error": "Email ya registrado"}), 400

    hashed_password = hash_password(data['password'])
   

    # Insertar nuevo usuario en la tabla actualizada
    cursor.execute("""
                   INSERT INTO au_users (usr_name, usr_email, usr_password, usr_rol)
                   VALUES (%s, %s, %s, %s) RETURNING usr_id;
                   """, (data['nombre'], data['email'], hashed_password, data['rol']))

    conn.commit()
    user_id = cursor.fetchone()[0]
    conn.close()

    return jsonify({"message": "Usuario registrado exitosamente", "user_id": user_id})

### 🔹 Ingreso al aplicativo por login
@auth_bp.route('/login', methods=['POST'])
@limit_login_attempts
def login():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT usr_id, usr_password, usr_rol, usr_name, usr_email FROM au_users WHERE usr_email = %s;", (data['email'],))
    user = cursor.fetchone()

    conn.close()

    if not user or not verify_password(data['password'], user[1]):
        log_event(f"Intento fallido de login: {data['email']}")
        return jsonify({"error": "Credenciales incorrectas"}), 401

    log_event(f"Usuario {user[3]} ha iniciado sesión")
    token = generate_token(user[0], user[2], user[3], user[4])
    return jsonify({"access_token": token})


### 🔹 Obtener información de usuario por token
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    identity = get_jwt_identity()
    claims = get_jwt()  # Obtener datos adicionales (name, role, email)

    return jsonify({
        "message": "Acceso permitido",
        "user": {
            "id": identity,
            "name": claims.get("name"),  # Aquí va el nombre, no el ID
            "role": claims.get("role"),
            "email": claims.get("email")
        }
    })
### 🔹 Obtener todos los usuarios (Solo Administradores)
@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden ver la lista de usuarios"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT usr_id, usr_name, usr_email, usr_rol FROM au_users;")
    users = cursor.fetchall()
    conn.close()

    return jsonify({"users": [{"id": u[0], "nombre": u[1], "email": u[2], "role": u[3]} for u in users]})

### 🔹 Obtener usuario por ID (Solo Administradores)
@auth_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden ver usuarios"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT usr_id, usr_name, usr_email, usr_rol FROM au_users WHERE usr_id = %s;", (user_id,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({"user": {"id": user[0], "nombre": user[1], "email": user[2], "role": user[3]}})

### 🔹 Actualizar usuario (Solo Administradores)
@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden actualizar usuarios"}), 403

    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT usr_password FROM au_users WHERE usr_id = %s;", (user_id,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Mantener la contraseña actual si no se envía una nueva
    hashed_password = user[0]  # Hash de la BD
    if "password" in data and data["password"]:
        hashed_password = hash_password(data["password"])

    cursor.execute("""
        UPDATE au_users SET usr_name = %s, usr_email = %s, usr_password = %s, usr_rol = %s
        WHERE usr_id = %s;
    """, (data.get("nombre"), data.get("email"), hashed_password, data.get("rol"), user_id))

    conn.commit()
    conn.close()

    return jsonify({"message": "Usuario actualizado exitosamente"})

### 🔹 Eliminar usuario (Solo Administradores)
@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden eliminar usuarios"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT usr_id FROM au_users WHERE usr_id = %s;", (user_id,))
    if not cursor.fetchone():
        return jsonify({"error": "Usuario no encontrado"}), 404

    cursor.execute("DELETE FROM au_users WHERE usr_id = %s;", (user_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Usuario eliminado exitosamente"})
