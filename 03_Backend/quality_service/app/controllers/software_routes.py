from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.db import get_db_connection

software_bp = Blueprint("software", __name__)


# 🔹 Registrar nuevo software (solo Admins y Testers)
@software_bp.route("/register", methods=["POST"])
@jwt_required()
def register_software():
    claims = get_jwt()

    # Permitir acceso solo a Admins y Testers
    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Acceso denegado: Solo administradores y testers pueden registrar software"}), 403

    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
                   INSERT INTO ge_software (soft_name, soft_ge_objct, soft_spfc_objct, soft_company, soft_city,
                                            soft_phone, soft_test_date)
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING soft_id;
                   """, (data["name"], data["general_objectives"], data["specific_objectives"], data["company"],
                         data["city"], data["phone"], data["test_date"]))

    soft_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()

    return jsonify({"message": "Software registrado exitosamente", "software_id": soft_id}), 201


# 🔹 Listar todos los softwares registrados (solo Admins y Testers)
@software_bp.route("/list", methods=["GET"])
@jwt_required()
def list_softwares():
    claims = get_jwt()

    # Solo admins y testers pueden ver la lista de software
    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Acceso denegado: Solo administradores y testers pueden listar software"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT soft_id, soft_name, soft_company, soft_city, soft_test_date FROM ge_software ORDER BY soft_test_date DESC;")
    softwares = cursor.fetchall()
    conn.close()

    return jsonify({"softwares": [
        {"id": s[0], "name": s[1], "company": s[2], "city": s[3], "test_date": s[4]}
        for s in softwares
    ]})


# 🔹 Obtener detalles de un software específico (solo Admins y Testers)
@software_bp.route("/<int:soft_id>", methods=["GET"])
@jwt_required()
def get_software(soft_id):
    claims = get_jwt()

    # Solo admins y testers pueden acceder a los detalles de software
    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Acceso denegado: Solo administradores y testers pueden consultar software"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM ge_software WHERE soft_id = %s;", (soft_id,))
    software = cursor.fetchone()
    conn.close()

    if not software:
        return jsonify({"error": "Software no encontrado"}), 404

    return jsonify({
        "id": software[0],
        "name": software[1],
        "general_objectives": software[2],
        "specific_objectives": software[3],
        "company": software[4],
        "city": software[5],
        "phone": software[6],
        "test_date": software[7]
    })