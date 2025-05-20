from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.security import hash_password, verify_password, generate_token
from app.db import get_db_connection
from app.services.middleware import limit_login_attempts

auth_bp = Blueprint('auth', __name__)
### 🔹 Ingreso al aplicativo por login
@auth_bp.route('/login', methods=['POST'])
@limit_login_attempts
def login():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT usr_id, usr_password, usr_rol, usr_name, usr_email FROM au_users WHERE usr_email = %s;", (data['email'],))
    user = cursor.fetchone()

    if not user or not verify_password(data['password'], user[1]):
        cursor.execute("INSERT INTO au_user_act_log (usrlog_usr_id, usrlog_action, usrlog_description, usrlog_ip_address) VALUES (%s, %s, %s, %s);",
                       (None, "FAILED_LOGIN", f"Intento de acceso fallido para {data['email']}", request.remote_addr))
        conn.commit()
        conn.close()
        return jsonify({"error": "Credenciales incorrectas"}), 401

    cursor.execute("INSERT INTO au_user_act_log (usrlog_usr_id, usrlog_action, usrlog_description, usrlog_ip_address) VALUES (%s, %s, %s, %s);",
                   (user[0], "LOGIN", f"Usuario {user[3]} inició sesión", request.remote_addr))

    conn.commit()
    conn.close()

    token = generate_token(user[0], user[2], user[3], user[4])
    return jsonify({"access_token": token})


### 🔹 Registrar usuarios (Solo Administradores)
@auth_bp.route('/register', methods=['POST'])
@jwt_required()
def register():
    claims = get_jwt()
    user_id = get_jwt_identity()
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
    roles_validos = ['admin', 'user', 'tester']  # Ajusta esto según tus roles permitidos
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

    # Registrar actividad de creación de usuario
    cursor.execute(
        "INSERT INTO au_user_act_log (usrlog_usr_id, usrlog_action, usrlog_description, usrlog_ip_address) VALUES (%s, %s, %s, %s);",
        (user_id, "CREATE_USER", f"Usuario {data['nombre']} registrado por {claims.get('name')}",
         request.remote_addr))

    conn.commit()
    conn.close()

    return jsonify({"message": "Usuario registrado exitosamente", "user": claims.get('name')})

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
@auth_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200
