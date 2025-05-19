from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.security import hash_password, verify_password, generate_token
from app.db import get_db_connection
from app.services.middleware import limit_login_attempts


user_bp = Blueprint('users', __name__)

### 🔹 Obtener todos los usuarios (Solo Administradores)
@user_bp.route('/all', methods=['GET'])
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
@user_bp.route('/<int:user_id>', methods=['GET'])
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
@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    claims = get_jwt()
    identity = get_jwt_identity()
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

    # Registrar actividad de actualización
    cursor.execute("INSERT INTO au_user_act_log (usrlog_usr_id, usrlog_action, usrlog_description, usrlog_ip_address) VALUES (%s, %s, %s, %s);",
                   (identity, "UPDATE_USER", f"Usuario {user_id} actualizado por {claims.get('name')}",
                    request.remote_addr))


    conn.commit()
    conn.close()

    return jsonify({"message": "Usuario actualizado exitosamente"})

### 🔹 Eliminar usuario (Solo Administradores)
@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    claims = get_jwt()
    identity = get_jwt_identity()
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden eliminar usuarios"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT usr_id FROM au_users WHERE usr_id = %s;", (user_id,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    cursor.execute("DELETE FROM au_users WHERE usr_id = %s;", (user_id,))

    # Registrar actividad de eliminación
    cursor.execute("INSERT INTO au_user_act_log (usrlog_usr_id, usrlog_action, usrlog_description, usrlog_ip_address) VALUES (%s, %s, %s, %s);",
                   (identity, "DELETE_USER", f"Usuario {user[0]} eliminado por {claims.get('name')}",
                    request.remote_addr))
    conn.commit()
    conn.close()

    return jsonify({"message": "Usuario eliminado exitosamente"})