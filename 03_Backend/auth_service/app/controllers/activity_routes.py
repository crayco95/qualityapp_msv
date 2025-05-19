from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.db import get_db_connection

activity_bp = Blueprint("activity", __name__)

# 🔹 Consultar el historial de actividad
@activity_bp.route("/logs", methods=["GET"])
@jwt_required()
def get_activity_logs():
    claims = get_jwt()

    # Validar que solo los administradores pueden ver los logs
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden ver el historial"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT usrlog_id, usrlog_usr_id, usrlog_action, usrlog_description, usrlog_timestamp, usrlog_ip_address
        FROM au_user_act_log
        ORDER BY usrlog_timestamp DESC
    """)
    logs = cursor.fetchall()
    conn.close()

    return jsonify({"logs": [
        {"id": l[0], "user_id": l[1], "action": l[2], "description": l[3], "timestamp": l[4], "ip": l[5]}
        for l in logs
    ]})
