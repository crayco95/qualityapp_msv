import bcrypt
from datetime import timedelta
from flask_jwt_extended import create_access_token

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_token(user_id, role, name, email):
    expires_delta = timedelta(hours=1)
    return create_access_token(
        identity=str(user_id), 
        additional_claims={"name": name, "role": role,  "email": email},
        expires_delta=expires_delta)

