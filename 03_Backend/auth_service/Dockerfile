# Usa Python 3.10 como base para el contenedor
FROM python:3.10

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todos los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias especificadas en requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Comando que ejecutará Flask cuando el contenedor se inicie
CMD ["python", "app.py"]