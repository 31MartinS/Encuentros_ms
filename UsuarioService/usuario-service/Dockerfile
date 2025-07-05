# 1. Imagen base con Node.js + npm
FROM node:20

# 2. Crear directorio de trabajo
WORKDIR /app

# 3. Copiar dependencias
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el resto del proyecto
COPY . .

# 6. Compilar TypeScript (opcional si usas ts-node-dev directamente)
# RUN npm run build

# 7. Puerto expuesto
EXPOSE 3001

# 8. Comando para arrancar la app
CMD ["npm", "run", "dev"]
