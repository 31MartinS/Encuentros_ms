# Imagen base
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY . .

# Instalar dependencias
RUN npm install

# Exponer puerto
EXPOSE 3004

# Ejecutar servicio
CMD ["npm", "start"]
