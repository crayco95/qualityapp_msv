from flask import Blueprint, request, jsonify
from app.services.subcategory_service import SubcategoryService

subcategory_bp = Blueprint('subcategory', __name__)

@subcategory_bp.route('/subcategories/parameter/<int:param_id>', methods=['GET'])
def get_subcategories_by_parameter(param_id):
    try:
        subcategories = SubcategoryService.get_subcategories_by_parameter(param_id)
        return jsonify([subcategory.to_dict() for subcategory in subcategories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subcategory_bp.route('/subcategories/<int:subcategory_id>', methods=['GET'])
def get_subcategory_by_id(subcategory_id):
    try:
        subcategory = SubcategoryService.get_subcategory_by_id(subcategory_id)
        if subcategory:
            return jsonify(subcategory.to_dict())
        return jsonify({'error': 'Subcategoría no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subcategory_bp.route('/subcategories', methods=['POST'])
def create_subcategory():
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

@subcategory_bp.route('/subcategories/<int:subcategory_id>', methods=['PUT'])
def update_subcategory(subcategory_id):
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

@subcategory_bp.route('/subcategories/<int:subcategory_id>', methods=['DELETE'])
def delete_subcategory(subcategory_id):
    try:
        if SubcategoryService.delete_subcategory(subcategory_id):
            return jsonify({'message': 'Subcategoría eliminada exitosamente'})
        return jsonify({'error': 'Subcategoría no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500