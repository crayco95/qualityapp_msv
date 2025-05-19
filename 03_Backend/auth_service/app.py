from flask import Flask
from flask_jwt_extended import JWTManager
from routes import auth_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'clave_secreta_segura'
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/auth")

if __name__ == '__main__':
    app.run(debug=True, port=5000)