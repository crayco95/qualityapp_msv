from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from security import hash_password, verify_password, generate_token
from db import get_db_connection
from logging import log_event
from middleware import limit_login_attempts


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
@jwt_required()
def register():
    identity = request.user
    if identity['role'] != 'admin':
        return jsonify({"error": "Solo los administradores pueden crear usuarios"}), 403

    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar si el usuario ya existe
    cursor.execute("SELECT usr_id FROM au_users WHERE usr_email = %s;", (data['email'],))
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


@auth_bp.route('/login', methods=['POST'])
@limit_login_attempts
def login():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT usr_id, usr_password, usr_rol FROM au_users WHERE usr_email = %s;", (data['email'],))
    user = cursor.fetchone()

    conn.close()

    if not user or not verify_password(data['password'], user[1]):
        log_event(f"Intento fallido de login: {data['email']}")
        return jsonify({"error": "Credenciales incorrectas"}), 401

    log_event(f"Usuario {user[0]} ha iniciado sesión")
    token = generate_token(user[0], user[2])
    return jsonify({"access_token": token})



@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    identity = request.user
    return jsonify({"message": "Acceso permitido", "user": identity})