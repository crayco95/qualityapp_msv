from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.services.software_service import SoftwareService

software_bp = Blueprint("software", __name__)

# 🔹 Registrar nuevo software (solo Admins y Testers)
@software_bp.route("/register", methods=["POST"])
@jwt_required()
def register_software():
    claims = get_jwt()

    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Acceso denegado: Solo administradores y testers pueden registrar software"}), 403

    try:
        data = request.json
        software = SoftwareService.create_software(
            name=data["name"],
            general_objectives=data["general_objectives"],
            specific_objectives=data["specific_objectives"],
            company=data["company"],
            city=data["city"],
            phone=data["phone"],
            test_date=data["test_date"]
        )
        
        return jsonify({
            "message": "Software registrado exitosamente",
            "software": software.to_dict()
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔹 Listar todos los softwares registrados
@software_bp.route("/list", methods=["GET"])
@jwt_required()
def list_softwares():
    claims = get_jwt()

    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Acceso denegado: Solo administradores y testers pueden listar software"}), 403

    try:
        softwares = SoftwareService.get_all_software()
        return jsonify({
            "softwares": [s.to_dict() for s in softwares]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔹 Obtener detalles de un software específico
@software_bp.route("/<int:soft_id>", methods=["GET"])
@jwt_required()
def get_software(soft_id):
    claims = get_jwt()

    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Acceso denegado: Solo administradores y testers pueden consultar software"}), 403

    try:
        software = SoftwareService.get_software_by_id(soft_id)
        if not software:
            return jsonify({"error": "Software no encontrado"}), 404
            
        return jsonify(software.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔹 Actualizar detalles de un software
@software_bp.route("/<int:soft_id>", methods=["PUT"])
@jwt_required()
def update_software(soft_id):
    claims = get_jwt()
    
    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Solo administradores y testers pueden actualizar software"}), 403
        
    try:
        data = request.get_json()
        software = SoftwareService.update_software(
            software_id=soft_id,
            name=data.get("name"),
            general_objectives=data.get("general_objectives"),
            specific_objectives=data.get("specific_objectives"),
            company=data.get("company"),
            city=data.get("city"),
            phone=data.get("phone"),
            test_date=data.get("test_date")
        )
        
        if not software:
            return jsonify({"error": "Software no encontrado o no se proporcionaron cambios"}), 404
            
        return jsonify({
            "message": "Software actualizado exitosamente",
            "software": software.to_dict()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# 🔹 Eliminar un software
@software_bp.route("/<int:soft_id>", methods=["DELETE"])
@jwt_required()
def delete_software(soft_id):
    claims = get_jwt()
    
    if claims.get("role") not in ["admin", "tester"]:
        return jsonify({"error": "Solo administradores y testers pueden eliminar software"}), 403
        
    try:
        success = SoftwareService.delete_software(soft_id)
        
        if not success:
            return jsonify({"error": "Software no encontrado"}), 404
            
        return jsonify({
            "message": "Software eliminado exitosamente"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500