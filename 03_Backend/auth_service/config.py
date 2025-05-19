import os

class Config:
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "clave_secreta_segura")
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:admin@192.168.1.2/QUALITYAPP_BD")