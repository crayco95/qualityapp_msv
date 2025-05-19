import psycopg2

def get_db_connection():
    """Establece una conexión con la base de datos PostgreSQL instalada localmente"""
    return psycopg2.connect(
        dbname="QUALITYAPP_BD",
        user="qualityapp_us",
        password="qualityapp_us",
        host="192.168.1.2"  # Reemplaza con tu dirección IPv4 local
    )