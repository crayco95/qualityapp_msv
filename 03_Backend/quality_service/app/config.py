import os
from dotenv import load_dotenv, find_dotenv


# Cargar variables desde el archivo .env
load_dotenv(find_dotenv())

class Config:
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")
    DB_HOST = os.getenv("DB_HOST")

