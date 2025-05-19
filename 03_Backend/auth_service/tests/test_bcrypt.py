import bcrypt

password = "supersegura123"
hash_guardado  = "$2b$12$2xI85Oe6.qvoxsu9cC9P.eegl9U4eGLWJXPAy5RMN9wR9tdsyjnm6"

if bcrypt.checkpw(password.encode('utf-8'), hash_guardado.encode()):
    print("✅ La contraseña es válida.")
else:
    print("❌ Error de encriptación: el hash no coincide.")
