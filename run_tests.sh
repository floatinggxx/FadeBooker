#!/bin/bash

# 🎭 FadeBooker - Test Runner Centralizado
# Ejecuta pruebas unitarias de Backend y Frontend para detectar errores

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧪 Iniciando ejecución de pruebas unitarias - FadeBooker${NC}"

# 1. Pruebas de Backend (todas: unit + integration)
echo -e "\n${YELLOW}📦 [BACKEND] Ejecutando todas las pruebas (unit + integration)...${NC}"
cd Producto/back-fadebooker
if [ -d "node_modules" ]; then
    npm run test -- --colors
    BACKEND_EXIT=$?
else
    echo -e "${RED}⚠️  node_modules no encontrado en backend. Ejecute 'npm install' en Producto/back-fadebooker primero.${NC}"
    BACKEND_EXIT=1
fi

if [ $BACKEND_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Backend: Pruebas exitosas.${NC}"
else
    echo -e "${RED}❌ Backend: Fallaron algunas pruebas.${NC}"
fi

# 2. Pruebas de Frontend
echo -e "\n${YELLOW}🎨 [FRONTEND] Ejecutando pruebas unitarias...${NC}"
cd ../front-fadebooker
if [ -d "node_modules" ]; then
    npm test
else
    echo -e "${RED}⚠️  node_modules no encontrado en frontend. Ejecute 'npm install' primero.${NC}"
    FRONTEND_EXIT=1
fi
FRONTEND_EXIT=$?

if [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend: Pruebas exitosas.${NC}"
else
    echo -e "${RED}❌ Frontend: Fallaron algunas pruebas.${NC}"
fi

# Resumen Final
echo -e "\n${BLUE}=======================================${NC}"
if [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "${GREEN}🚀 RESULTADO GLOBAL: TODO OK${NC}"
else
    echo -e "${RED}🚨 RESULTADO GLOBAL: SE ENCONTRARON ERRORES${NC}"
fi
echo -e "${BLUE}=======================================${NC}"

exit $((BACKEND_EXIT + FRONTEND_EXIT))
