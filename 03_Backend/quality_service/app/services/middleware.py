from flask import request, jsonify, make_response
from functools import wraps

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
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    return wrapper