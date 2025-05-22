from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.classification_service import ClassificationService

classification_bp = Blueprint('classification', __name__)

@classification_bp.route('/classifications', methods=['POST'])
@jwt_required()
def create_classification():
    claims = get_jwt()
    
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden crear clasificaciones"}), 403
        
    try:
        data = request.get_json()
        range_min = data.get('range_min')
        range_max = data.get('range_max')
        level = data.get('level')

        if not all([range_min is not None, range_max is not None, level]):
            return jsonify({'error': 'Se requieren range_min, range_max y level'}), 400

        classification = ClassificationService.create_classification(range_min, range_max, level)
        return jsonify(classification.to_dict()), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@classification_bp.route('/classifications', methods=['GET'])
@jwt_required()
def get_all_classifications():
    try:
        classifications = ClassificationService.get_all_classifications()
        return jsonify([c.to_dict() for c in classifications])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@classification_bp.route('/classifications/<int:classification_id>', methods=['GET'])
@jwt_required()
def get_classification(classification_id):
    try:
        classification = ClassificationService.get_classification_by_id(classification_id)
        if classification:
            return jsonify(classification.to_dict())
        return jsonify({'error': 'Clasificación no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@classification_bp.route('/classifications/score/<int:score>', methods=['GET'])
@jwt_required()
def get_classification_by_score(score):
    try:
        classification = ClassificationService.get_classification_by_score(score)
        if classification:
            return jsonify(classification.to_dict())
        return jsonify({'error': 'No se encontró clasificación para este puntaje'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@classification_bp.route('/classifications/<int:classification_id>', methods=['PUT'])
@jwt_required()
def update_classification(classification_id):
    claims = get_jwt()
    
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden actualizar clasificaciones"}), 403
        
    try:
        data = request.get_json()
        range_min = data.get('range_min')
        range_max = data.get('range_max')
        level = data.get('level')

        if not any([range_min is not None, range_max is not None, level]):
            return jsonify({'error': 'Se requiere al menos un campo para actualizar'}), 400

        classification = ClassificationService.update_classification(
            classification_id, range_min, range_max, level)
        if classification:
            return jsonify(classification.to_dict())
        return jsonify({'error': 'Clasificación no encontrada'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@classification_bp.route('/classifications/<int:classification_id>', methods=['DELETE'])
@jwt_required()
def delete_classification(classification_id):
    claims = get_jwt()
    
    if claims.get("role") != "admin":
        return jsonify({"error": "Solo los administradores pueden eliminar clasificaciones"}), 403
        
    try:
        if ClassificationService.delete_classification(classification_id):
            return jsonify({'message': 'Clasificación eliminada exitosamente'})
        return jsonify({'error': 'Clasificación no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500