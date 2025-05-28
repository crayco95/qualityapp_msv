from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.assessment_service import AssessmentService

assessment_bp = Blueprint('assessment', __name__)

@assessment_bp.route('/assessments', methods=['GET'])
@jwt_required()
def get_all_assessments():
    try:
        assessments = AssessmentService.get_all_assessments()
        return jsonify([a.to_dict() for a in assessments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/assessments', methods=['POST'])
@jwt_required()
def create_assessment():
    try:
        data = request.get_json()
        software_id = data.get('software_id')
        standard_id = data.get('standard_id')
        param_id = data.get('param_id')
        score = data.get('score')
        classification_id = data.get('classification_id')

        if not all([software_id, standard_id, param_id]):
            return jsonify({'error': 'Se requieren software_id, standard_id y param_id'}), 400

        assessment = AssessmentService.create_assessment(
            software_id, standard_id, param_id, score, classification_id)
        return jsonify(assessment.to_dict()), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/assessments/software/<int:software_id>', methods=['GET'])
@jwt_required()
def get_assessments_by_software(software_id):
    try:
        assessments = AssessmentService.get_assessments_by_software(software_id)
        return jsonify([a.to_dict() for a in assessments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/assessments/standard/<int:standard_id>', methods=['GET'])
@jwt_required()
def get_assessments_by_standard(standard_id):
    try:
        assessments = AssessmentService.get_assessments_by_standard(standard_id)
        return jsonify([a.to_dict() for a in assessments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/assessments/<int:assessment_id>', methods=['GET'])
@jwt_required()
def get_assessment(assessment_id):
    try:
        assessment = AssessmentService.get_assessment_by_id(assessment_id)
        if assessment:
            return jsonify(assessment.to_dict())
        return jsonify({'error': 'Evaluación no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/assessments/<int:assessment_id>', methods=['PUT'])
@jwt_required()
def update_assessment(assessment_id):
    try:
        data = request.get_json()
        score = data.get('score')
        classification_id = data.get('classification_id')

        if not any([score is not None, classification_id is not None]):
            return jsonify({'error': 'Se requiere al menos score o classification_id para actualizar'}), 400

        assessment = AssessmentService.update_assessment(
            assessment_id, score, classification_id)
        if assessment:
            return jsonify(assessment.to_dict())
        return jsonify({'error': 'Evaluación no encontrada'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/assessments/<int:assessment_id>', methods=['DELETE'])
@jwt_required()
def delete_assessment(assessment_id):
    try:
        if AssessmentService.delete_assessment(assessment_id):
            return jsonify({'message': 'Evaluación eliminada exitosamente'})
        return jsonify({'error': 'Evaluación no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@assessment_bp.route('/assessments/software/<int:software_id>/summary', methods=['GET'])
@jwt_required()
def get_software_assessment_summary(software_id):
    try:
        summary = AssessmentService.get_software_summary(software_id)
        return jsonify(summary)
    except Exception as e:
        return jsonify({'error': str(e)}), 500