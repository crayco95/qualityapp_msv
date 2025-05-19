import requests

BASE_URL = "http://127.0.0.1:5000/auth"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "supersegura123"

def get_token():
    """Obtener el token de un usuario admin"""
    response = requests.post(f"{BASE_URL}/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert response.status_code == 200
    return response.json()["access_token"]

def test_get_users():
    """Probar que el admin puede ver la lista de usuarios"""
    token = get_token()
    response = requests.get(f"{BASE_URL}/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "users" in response.json()

def test_create_user():
    """Probar la creación de un usuario"""
    token = get_token()
    user_data = {"nombre": "UsuarioPrueba", "email": "prueba@example.com", "password": "segura123", "rol": "user"}
    response = requests.post(f"{BASE_URL}/register", json=user_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "user" in response.json()

def test_update_user():
    """Probar la actualización de un usuario"""
    token = get_token()
    updated_data = {"nombre": "Modificado", "email": "modificado@example.com", "rol": "tester"}
    response = requests.put(f"{BASE_URL}/users/2", json=updated_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["message"] == "Usuario actualizado exitosamente"

def test_delete_user():
    """Probar eliminación de usuario"""
    token = get_token()
    response = requests.delete(f"{BASE_URL}/users/2", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["message"] == "Usuario eliminado exitosamente"