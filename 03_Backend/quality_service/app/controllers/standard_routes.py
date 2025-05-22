from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.standard_service import StandardService

standard_bp = Blueprint("standard", __name__)

@standard_bp.route("/create", methods=["POST"])
@jwt_required()
def create_standard():
    claims = get_jwt()
    
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden crear normas"}), 403
        
    try:
        data = request.get_json()
        standard = StandardService.create_standard(
            name=data["name"],
            description=data["description"],
            version=data["version"],
            status=data.get("status", True)
        )
        
        return jsonify({
            "message": "Norma creada exitosamente",
            "standard": standard.to_dict()
        }), 201
        
    except KeyError as e:
        return jsonify({"error": f"Campo requerido faltante: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@standard_bp.route("/list", methods=["GET"])
@jwt_required()
def get_standards():
    try:
        standards = StandardService.get_all_standards()
        return jsonify({
            "standards": [s.to_dict() for s in standards]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@standard_bp.route("/<int:standard_id>", methods=["GET"])
@jwt_required()
def get_standard(standard_id):
    try:
        standard = StandardService.get_standard_by_id(standard_id)
        
        if not standard:
            return jsonify({"error": "Norma no encontrada"}), 404
            
        return jsonify(standard.to_dict())
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@standard_bp.route("/<int:standard_id>", methods=["PUT"])
@jwt_required()
def update_standard(standard_id):
    claims = get_jwt()
    
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden actualizar normas"}), 403
        
    try:
        data = request.get_json()
        standard = StandardService.update_standard(
            standard_id=standard_id,
            name=data.get("name"),
            description=data.get("description"),
            version=data.get("version"),
            status=data.get("status")
        )
        
        if not standard:
            return jsonify({"error": "Norma no encontrada o no se proporcionaron cambios"}), 404
            
        return jsonify({
            "message": "Norma actualizada exitosamente",
            "standard": standard.to_dict()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@standard_bp.route("/<int:standard_id>", methods=["DELETE"])
@jwt_required()
def delete_standard(standard_id):
    claims = get_jwt()
    
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden eliminar normas"}), 403
        
    try:
        success = StandardService.delete_standard(standard_id)
        
        if not success:
            return jsonify({"error": "Norma no encontrada"}), 404
            
        return jsonify({
            "message": "Norma eliminada exitosamente"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500