# Usar una imagen de Node para compilar
FROM node:20-alpine AS build

WORKDIR /app

# Argumentos de construcción para inyectar variables de entorno de Vite
# Se definen valores por defecto apuntando a producción
ARG VITE_API_URL=https://fadebooker-backend-ok.azurewebsites.net/api
ARG VITE_API_BASE_URL=https://fadebooker-backend-ok.azurewebsites.net/api

# Establecer variables de entorno para el proceso de compilación
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del frontend
COPY . .

# Construir la aplicación (Vite genera la carpeta 'dist')
RUN npm run build

# --- ETAPA DE SERVIDO ---
# Usar Nginx para servir el contenido estático
FROM nginx:stable-alpine

# Copiar el build desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx (opcional, para manejo de rutas de React/SPA)
# Si no existe, se usa la por defecto, pero para SPAs es mejor una personalizada.
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
