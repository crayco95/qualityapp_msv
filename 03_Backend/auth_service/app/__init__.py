from flask import Flask
from flask_jwt_extended import JWTManager
from app.controllers.auth_routes import auth_bp
from app.controllers.user_routes import user_bp
from app.controllers.activity_routes import activity_bp

def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "clave_secreta_segura"
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(activity_bp, url_prefix="/activity")

    return app