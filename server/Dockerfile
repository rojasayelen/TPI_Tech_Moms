# Imagen base de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Exponer el puerto del servidor
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "index.js"]




