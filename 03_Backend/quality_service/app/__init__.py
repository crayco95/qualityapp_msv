from flask import Flask
from flask_jwt_extended import JWTManager

# Importación de blueprints
from app.controllers.software_routes import software_bp
from app.controllers.participant_routes import participant_bp
from app.controllers.standard_routes import standard_bp

# Importación de modelos
from app.models.software import Software
from app.models.participant import Participant
from app.models.standard import Standard


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "clave_secreta_segura"
    JWTManager(app)

    app.register_blueprint(software_bp, url_prefix="/software")
    app.register_blueprint(participant_bp, url_prefix="/participant")
    app.register_blueprint(standard_bp, url_prefix="/standard")

    return app

# Exportar los modelos y componentes principales
__all__ = ['create_app', 'Software', 'Participant', 'Standard']