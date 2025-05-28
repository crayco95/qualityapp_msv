from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.controllers.auth_routes import auth_bp
from app.controllers.user_routes import user_bp
from app.controllers.activity_routes import activity_bp
from app.services.middleware import cors_middleware

def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "clave_secreta_segura"
    JWTManager(app)

    # Aplicar el middleware CORS globalmente
    app.before_request(lambda: None)  # Necesario para que funcione el after_request
    app.after_request(lambda response: cors_middleware(lambda: response)())

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(activity_bp, url_prefix="/activity")

    return app
