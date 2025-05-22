from flask import Blueprint, send_file
from flask_jwt_extended import jwt_required
from io import BytesIO
from app.services.report_service import ReportService

report_bp = Blueprint('report', __name__)

@report_bp.route('/reports/assessment/<int:assessment_id>', methods=['GET'])
@jwt_required()
def get_assessment_report(assessment_id):
    try:
        pdf = ReportService.generate_assessment_report(assessment_id)
        return send_file(
            BytesIO(pdf),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'assessment_report_{assessment_id}.pdf'
        )
    except Exception as e:
        return {'error': str(e)}, 500

@report_bp.route('/reports/software/<int:software_id>', methods=['GET'])
@jwt_required()
def get_software_report(software_id):
    try:
        pdf = ReportService.generate_software_summary_report(software_id)
        return send_file(
            BytesIO(pdf),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'software_report_{software_id}.pdf'
        )
    except Exception as e:
        return {'error': str(e)}, 500