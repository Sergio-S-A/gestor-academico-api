# 1. Usar imagen base de Node (versión compatible con tu package.json)
FROM node:22-alpine

# 2. Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar archivos de dependencias
COPY package.json package-lock.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el código fuente
COPY . .

# 6. Exponer el puerto
EXPOSE 3000

# 7. Comando para iniciar en desarrollo (con hot-reload)
CMD ["npm", "run", "start:dev"]