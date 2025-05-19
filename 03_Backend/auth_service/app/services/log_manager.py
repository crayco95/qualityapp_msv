import logging

# Configuración básica de logging
logging.basicConfig(
    filename='auth_service.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def log_event(message):
    """Registra eventos importantes en el servicio"""
    logging.info(message)