import bcrypt
from flask_jwt_extended import create_access_token

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_token(usr_id, usr_rol):
    return create_access_token(identity={"id": usr_id, "role": usr_rol})