from flask import request, jsonify

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