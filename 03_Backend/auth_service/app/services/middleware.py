from flask import request, jsonify, make_response
from functools import wraps


login_attempts = {}

def limit_login_attempts(fn):
    """Evita múltiples intentos de login en poco tiempo"""
    def wrapper(*args, **kwargs):
        email = request.json.get("email")
        if email:
            login_attempts[email] = login_attempts.get(email, 0) + 1
            if login_attempts[email] > 5:
                return jsonify({"error": "Demasiados intentos de login. Espera unos minutos"}), 429

        return fn(*args, **kwargs)
    return wrapper
def cors_middleware(fn):
    """Middleware global para manejar CORS"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5003')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response

        response = make_response(fn(*args, **kwargs))
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5003')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    return wrapper