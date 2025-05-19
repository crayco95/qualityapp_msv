import psycopg2
from psycopg2 import OperationalError
from app.config import Config

def get_db_connection():
    """Establece una conexión segura con la base de datos PostgreSQL"""
    try:
        conn = psycopg2.connect(
            dbname=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASS,
            host=Config.DB_HOST
        )
        return conn
    except OperationalError as e:
        print(f"Error al conectar con la base de datos: {e}")
        return None