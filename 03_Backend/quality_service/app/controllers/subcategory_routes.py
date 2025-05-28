from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.subcategory_service import SubcategoryService

subcategory_bp = Blueprint('subcategory', __name__)

@subcategory_bp.route('/list', methods=['GET'])
@jwt_required()
def get_all_subcategories():
    try:
        # Esta función necesita ser implementada en el servicio
        return jsonify({
            "message": "Función no implementada aún"
        }), 501
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subcategory_bp.route('/parameter/<int:param_id>', methods=['GET'])
@jwt_required()
def get_subcategories_by_parameter(param_id):
    try:
        subcategories = SubcategoryService.get_subcategories_by_parameter(param_id)
        return jsonify([subcategory.to_dict() for subcategory in subcategories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subcategory_bp.route('/<int:subcategory_id>', methods=['GET'])
@jwt_required()
def get_subcategory_by_id(subcategory_id):
    try:
        subcategory = SubcategoryService.get_subcategory_by_id(subcategory_id)
        if subcategory:
            return jsonify(subcategory.to_dict())
        return jsonify({'error': 'Subcategoría no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subcategory_bp.route('/create', methods=['POST'])
@jwt_required()
def create_subcategory():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden crear subcategorías"}), 403
    try:
        data = request.get_json()
        param_id = data.get('param_id')
        name = data.get('name')
        description = data.get('description')

        if not all([param_id, name]):
            return jsonify({'error': 'Se requieren param_id y name'}), 400

        subcategory = SubcategoryService.create_subcategory(param_id, name, description)
        return jsonify(subcategory.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subcategory_bp.route('/<int:subcategory_id>', methods=['PUT'])
@jwt_required()
def update_subcategory(subcategory_id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden actualizar subcategorías"}), 403
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')

        if not any([name, description]):
            return jsonify({'error': 'Se requiere al menos un campo para actualizar'}), 400

        subcategory = SubcategoryService.update_subcategory(subcategory_id, name, description)
        if subcategory:
            return jsonify(subcategory.to_dict())
        return jsonify({'error': 'Subcategoría no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subcategory_bp.route('/<int:subcategory_id>', methods=['DELETE'])
@jwt_required()
def delete_subcategory(subcategory_id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden eliminar subcategorías"}), 403
    try:
        if SubcategoryService.delete_subcategory(subcategory_id):
            return jsonify({'message': 'Subcategoría eliminada exitosamente'})
        return jsonify({'error': 'Subcategoría no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500