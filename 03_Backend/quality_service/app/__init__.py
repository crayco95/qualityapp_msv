from flask import Flask
from flask_jwt_extended import JWTManager
from app.services.middleware import cors_middleware

# Importación de blueprints
from app.controllers.software_routes import software_bp
from app.controllers.participant_routes import participant_bp
from app.controllers.standard_routes import standard_bp
from app.controllers.assessment_routes import assessment_bp
from app.controllers.classification_routes import classification_bp
from app.controllers.result_routes import result_bp
from app.controllers.report_routes import report_bp

# Importación de modelos
from app.models.software import Software
from app.models.participant import Participant
from app.models.standard import Standard
from app.models.result import Result


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "clave_secreta_segura"
    JWTManager(app)

    # Aplicar el middleware CORS globalmente
    app.before_request(lambda: None)  # Necesario para que funcione el after_request
    app.after_request(lambda response: cors_middleware(lambda: response)())

    app.register_blueprint(software_bp, url_prefix="/software")
    app.register_blueprint(participant_bp, url_prefix="/participant")
    app.register_blueprint(standard_bp, url_prefix="/standard")
    app.register_blueprint(assessment_bp, url_prefix="/assessment")
    app.register_blueprint(classification_bp, url_prefix="/classification")
    app.register_blueprint(result_bp, url_prefix="/result")
    app.register_blueprint(report_bp, url_prefix="/report")

    return app

# Exportar los modelos y componentes principales
__all__ = ['create_app', 'Software', 'Participant', 'Standard', 'Parameter', 'Classification', 'Assessment', 'Result']