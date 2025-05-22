from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.result_service import ResultService

result_bp = Blueprint('result', __name__)

@result_bp.route('/results', methods=['POST'])
@jwt_required()
def create_result():
    try:
        data = request.get_json()
        assessment_id = data.get('assessment_id')
        score = data.get('score')
        classification_id = data.get('classification_id')

        if not all([assessment_id, score is not None, classification_id]):
            return jsonify({'error': 'Se requieren assessment_id, score y classification_id'}), 400

        result = ResultService.create_result(assessment_id, score, classification_id)
        return jsonify(result.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@result_bp.route('/results/assessment/<int:assessment_id>', methods=['GET'])
@jwt_required()
def get_results_by_assessment(assessment_id):
    try:
        results = ResultService.get_results_by_assessment(assessment_id)
        return jsonify([r.to_dict() for r in results])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@result_bp.route('/results/<int:result_id>', methods=['GET'])
@jwt_required()
def get_result(result_id):
    try:
        result = ResultService.get_result_by_id(result_id)
        if result:
            return jsonify(result.to_dict())
        return jsonify({'error': 'Resultado no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@result_bp.route('/results/<int:result_id>', methods=['PUT'])
@jwt_required()
def update_result(result_id):
    try:
        data = request.get_json()
        score = data.get('score')
        classification_id = data.get('classification_id')

        if not any([score is not None, classification_id is not None]):
            return jsonify({'error': 'Se requiere al menos score o classification_id para actualizar'}), 400

        result = ResultService.update_result(result_id, score, classification_id)
        if result:
            return jsonify(result.to_dict())
        return jsonify({'error': 'Resultado no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@result_bp.route('/results/<int:result_id>', methods=['DELETE'])
@jwt_required()
def delete_result(result_id):
    try:
        if ResultService.delete_result(result_id):
            return jsonify({'message': 'Resultado eliminado exitosamente'})
        return jsonify({'error': 'Resultado no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500