# Usa la imagen oficial de Node.js versión 20 (LTS) como base
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de definición de paquetes
COPY package*.json ./

# Instala las dependencias de producción
# Usamos install temporalmente en lugar de ci para mayor resiliencia mientras se estabilizan las versiones
RUN npm install --omit=dev

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto 3000 (puerto estándar que definimos para FadeBooker)
EXPOSE 3000

# Variables de entorno para asegurar que el server escuche correctamente
ENV PORT=3000
ENV WEBSITES_PORT=3000
ENV NODE_ENV=production

# Comando para arrancar la aplicación usando la ruta correcta
CMD ["node", "src/index.js"]
