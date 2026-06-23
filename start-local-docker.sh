#!/bin/bash

# start-local-docker.sh
# Script para levantar localmente el frontend y backend de FadeBooker usando Docker Compose.

# Colores para salida de terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

echo -e "${BLUE}=== Iniciando Entorno Docker Local de FadeBooker ===${NC}"

# 1. Verificar si Docker está instalado
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}Error: Docker no está instalado en este sistema.${NC}" >&2
  exit 1
fi

# 2. Verificar si Docker Compose está disponible (como comando o plugin)
DOCKER_COMPOSE_CMD=""
if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker-compose"
else
  echo -e "${RED}Error: Docker Compose no está instalado ni disponible como plugin.${NC}" >&2
  exit 1
fi

echo -e "${GREEN}Docker y Compose detectados correctamente. Usando: $DOCKER_COMPOSE_CMD${NC}"

# 3. Limpiar contenedores previos
echo -e "${BLUE}Limpiando contenedores antiguos si existen...${NC}"
$DOCKER_COMPOSE_CMD down

# 4. Construir y levantar
echo -e "${BLUE}Compilando imágenes y levantando servicios...${NC}"
$DOCKER_COMPOSE_CMD up --build -d

if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}=== ¡Entorno listo e iniciado con éxito! ===${NC}"
  echo -e "Acceso al Frontend: ${BLUE}http://localhost:8080${NC}"
  echo -e "Acceso al Backend:  ${BLUE}http://localhost:3000${NC}"
  echo -e "\nPara ver los logs en tiempo real, ejecuta:"
  echo -e "   ${BLUE}$DOCKER_COMPOSE_CMD logs -f${NC}"
  echo -e "\nPara apagar el entorno, ejecuta:"
  echo -e "   ${BLUE}$DOCKER_COMPOSE_CMD down${NC}\n"
else
  echo -e "${RED}Hubo un problema al levantar los contenedores de Docker.${NC}"
  exit 1
fi
