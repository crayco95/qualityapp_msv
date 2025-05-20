from flask import Flask
from flask_jwt_extended import JWTManager

from app.controllers.software_routes import software_bp


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "clave_secreta_segura"
    JWTManager(app)

    app.register_blueprint(software_bp, url_prefix="/software")

    return app