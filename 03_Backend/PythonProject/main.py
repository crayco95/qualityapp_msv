import bcrypt

password = "supersegura123"
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

print(f"Contraseña original: {password}")
print(f"Hash generado: {hashed_password}")