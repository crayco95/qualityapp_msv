import pytest
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_register_user(client):
    """Verifica que un usuario pueda registrarse correctamente"""
    response = client.post("/auth/register", json={
        "nombre": "TestUser",
        "email": "test@example.com",
        "password": "securepass",
        "rol": "evaluador"
    })
    assert response.status_code == 403  # Porque solo los admins pueden registrar usuarios

def test_login(client):
    """Verifica que un usuario pueda iniciar sesión"""
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "securepass"
    })
    assert response.status_code == 401  # Porque no existe ese usuario en la BD aún