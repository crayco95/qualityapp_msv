# Usa Python 3.10 como base
FROM python:3.10

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo el archivo de dependencias primero (mejora eficiencia en caché)
COPY requirements.txt .

# Instala dependencias antes de copiar el resto del código
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código de la aplicación
COPY . .

# Establece las variables de entorno dentro del contenedor
ENV FLASK_APP=run.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Expone el puerto en el contenedor
EXPOSE 5000

# Define el comando de ejecución del contenedor
CMD ["flask", "run"]