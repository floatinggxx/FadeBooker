#!/bin/bash

# 🎭 FadeBooker - Test Runner Centralizado
# Ejecuta pruebas unitarias de Backend y Frontend para detectar errores

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧪 Iniciando ejecución de pruebas unitarias - FadeBooker${NC}"

# Resolve repository root (script directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}"

# 1. Pruebas de Backend (todas: unit + integration)
echo -e "\n${YELLOW}📦 [BACKEND] Ejecutando todas las pruebas (unit + integration)...${NC}"
cd Producto/back-fadebooker
# Ensure tests do not send real emails
export SKIP_EMAILS=${SKIP_EMAILS:-true}

# Optionally spin up a local test DB in Docker for integration tests
# Set DOCKER_TEST_DB=true to enable. You can override TEST_DB_PORT and TEST_DB_SA_PASSWORD.
DOCKER_TEST_DB=${DOCKER_TEST_DB:-true}
TEST_DB_NAME=${TEST_DB_NAME:-FadeBooker_Test}
TEST_DB_CONTAINER_NAME=${TEST_DB_CONTAINER_NAME:-fadebooker-test-db}
TEST_DB_SA_PASSWORD=${TEST_DB_SA_PASSWORD:-Your_password123}
TEST_DB_PORT=${TEST_DB_PORT:-11433}

STARTED_TEST_DB=false
if [ "$DOCKER_TEST_DB" = "true" ]; then
    # check docker
    if ! command -v docker >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Docker no encontrado. Saltando creación de DB dockerizada.${NC}"
    else
        # If container exists, reuse; otherwise create
        if docker ps -a --format '{{.Names}}' | grep -q "^${TEST_DB_CONTAINER_NAME}$"; then
            echo -e "${BLUE}ℹ️  Contenedor ${TEST_DB_CONTAINER_NAME} ya existe. Usando el existente.${NC}"
            # start if not running
            if [ "$(docker inspect -f '{{.State.Running}}' ${TEST_DB_CONTAINER_NAME})" != "true" ]; then
                docker start ${TEST_DB_CONTAINER_NAME} >/dev/null
            fi
        else
            echo -e "${BLUE}🛠️  Creando contenedor Docker para MSSQL: ${TEST_DB_CONTAINER_NAME}${NC}"
            docker run -e 'ACCEPT_EULA=Y' -e "SA_PASSWORD=${TEST_DB_SA_PASSWORD}" \
                -p ${TEST_DB_PORT}:1433 --name ${TEST_DB_CONTAINER_NAME} -d mcr.microsoft.com/mssql/server:2019-latest >/dev/null
            STARTED_TEST_DB=true
        fi

        # wait for SQL Server to accept connections (retry loop)
        echo -e "${BLUE}⏳ Esperando a que la DB de prueba esté lista en 127.0.0.1:${TEST_DB_PORT}...${NC}"
        max=60; i=0
        while ! nc -z 127.0.0.1 ${TEST_DB_PORT} >/dev/null 2>&1; do
            sleep 1
            i=$((i+1))
            if [ $i -ge $max ]; then
                echo -e "${RED}❌ Timeout esperando la DB de prueba. Revisa logs de Docker.${NC}"
                docker logs ${TEST_DB_CONTAINER_NAME} | sed -n '1,200p'
                break
            fi
        done

        # Create test database if not exists using a mssql-tools container (sqlcmd)
        echo -e "${BLUE}🔧 Asegurando existencia de la BD de pruebas: ${TEST_DB_NAME}${NC}"
        docker run --rm --network container:${TEST_DB_CONTAINER_NAME} mcr.microsoft.com/mssql-tools \
            /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "${TEST_DB_SA_PASSWORD}" -Q "IF DB_ID(N'${TEST_DB_NAME}') IS NULL CREATE DATABASE [${TEST_DB_NAME}];" >/dev/null 2>&1 || true

        # Export env vars to point the app to the test DB
        export DB_HOST=127.0.0.1
        export DB_PORT=${TEST_DB_PORT}
        export DB_USER=sa
        export DB_PASSWORD=${TEST_DB_SA_PASSWORD}
        export DB_DATABASE=${TEST_DB_NAME}
        echo -e "${GREEN}✅ Test DB disponible en 127.0.0.1:${TEST_DB_PORT} (DB: ${TEST_DB_NAME})${NC}"
    fi
fi
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

# Optional: Security tests (SAST/SCA/DAST) - enable with SECURITY_TESTS=true
SECURITY_TESTS=${SECURITY_TESTS:-false}
if [ "$SECURITY_TESTS" = "true" ]; then
    echo -e "\n${YELLOW}🔐 Ejecutando pruebas de seguridad (SECURITY_TESTS=true)...${NC}"
    cd Producto/back-fadebooker
    # Prefer a scripted npm script if present
    if npm run | grep -q "test:security"; then
        npm run test:security || echo -e "${RED}⚠️  test:security falló.${NC}"
    elif command -v snyk >/dev/null 2>&1; then
        echo -e "${BLUE}Ejecutando snyk test...${NC}"
        snyk test || echo -e "${RED}⚠️  snyk test falló o reportó vulnerabilidades.${NC}"
    elif command -v docker >/dev/null 2>&1; then
        echo -e "${BLUE}snyk no está en PATH, ejecutando imagen Docker oficial de snyk...${NC}"
        docker run --rm -v "${PWD}:/project" -w /project snyk/snyk:latest test || echo -e "${RED}⚠️  snyk (docker) falló o reportó vulnerabilidades.${NC}"
    else
        echo -e "${YELLOW}⚠️  No se encontró script de seguridad ni snyk. Añade 'test:security' o instala snyk (o Docker).${NC}"
    fi
    # return to repo root
    cd "${REPO_ROOT}"
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

# Decide cleanup timing: if load tests will run, defer cleanup until after them
CLEANUP_NOW=true
if [ "$RUN_LOAD_TESTS" = "true" ] && [ "$STARTED_TEST_DB" = "true" ]; then
    CLEANUP_NOW=false
    CLEANUP_AFTER_LOAD=true
fi

if [ "$CLEANUP_NOW" = "true" ] && [ "$DOCKER_TEST_DB" = "true" ] && [ "$STARTED_TEST_DB" = "true" ]; then
        echo -e "${BLUE}🧹 Limpiando contenedor de test ${TEST_DB_CONTAINER_NAME}...${NC}"
        docker stop ${TEST_DB_CONTAINER_NAME} >/dev/null 2>&1 || true
        docker rm ${TEST_DB_CONTAINER_NAME} >/dev/null 2>&1 || true
        echo -e "${GREEN}✅ Contenedor de test eliminado.${NC}"
fi

# 3. Load tests (optional)
# To enable, set RUN_LOAD_TESTS=true and provide DB env vars for seeder.
if [ "$RUN_LOAD_TESTS" = "true" ]; then
    echo -e "\n${YELLOW}⚡ [LOAD TESTS] Preparando y ejecutando pruebas de carga...${NC}"
    TOOLS_DIR="${REPO_ROOT}/tools/load-tests"
    echo -e "${BLUE}Using tools dir: ${TOOLS_DIR}${NC}"
    if [ -d "${TOOLS_DIR}" ]; then
        cd "${TOOLS_DIR}"
        # Install seeder deps if needed
        if [ ! -d "node_modules" ]; then
            echo -e "${BLUE}Instalando dependencias para load-tests...${NC}"
            npm install knex mssql bcrypt minimist --no-audit --no-fund
        fi

        # Seed users if requested (default 0 to skip)
        if [ -z "$LOAD_SEED_COUNT" ]; then
            LOAD_SEED_COUNT=0
        fi
        if [ "$LOAD_SEED_COUNT" -gt 0 ]; then
            echo -e "${BLUE}Sembrando $LOAD_SEED_COUNT usuarios de prueba...${NC}"
            # Prefer the DB we created for tests (DB_DATABASE). If caller passed DB_NAME, override and warn.
            SEED_DB_NAME=${DB_DATABASE:-${DB_NAME:-FadeBooker}}
            if [ -n "$DB_NAME" ] && [ "$DB_NAME" != "$SEED_DB_NAME" ]; then
                echo -e "${YELLOW}⚠️  Advertencia: sobrescribiendo DB_NAME=${DB_NAME} con DB_DATABASE=${SEED_DB_NAME} para el seeder.${NC}"
            fi
                # Wait until SQL Server accepts connections to the target DB using mssql-tools container
                echo -e "${BLUE}⏳ Verificando accesibilidad de la BD ${SEED_DB_NAME} en ${DB_HOST:-127.0.0.1}:${DB_PORT:-${TEST_DB_PORT}}...${NC}"
                max=60; j=0
                until docker run --rm --network container:${TEST_DB_CONTAINER_NAME} mcr.microsoft.com/mssql-tools /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "${TEST_DB_SA_PASSWORD}" -Q "IF DB_ID(N'${SEED_DB_NAME}') IS NOT NULL SELECT 1;" >/dev/null 2>&1; do
                    sleep 1
                    j=$((j+1))
                    if [ $j -ge $max ]; then
                        echo -e "${RED}❌ La BD ${SEED_DB_NAME} no está accesible para semillas después de ${max}s.${NC}"
                        break
                    fi
                done
            DB_HOST=${DB_HOST:-127.0.0.1} DB_PORT=${DB_PORT:-${TEST_DB_PORT}} DB_USER=${DB_USER:-sa} DB_PASSWORD=${DB_PASSWORD:-${TEST_DB_SA_PASSWORD}} DB_NAME=${SEED_DB_NAME} node seed_users.js --count=${LOAD_SEED_COUNT}
        else
            echo -e "${YELLOW}Omitiendo seed de usuarios (LOAD_SEED_COUNT not set or 0).${NC}"
        fi

        # Run k6 if available
        if command -v k6 >/dev/null 2>&1; then
            echo -e "${BLUE}Ejecutando k6 load test...${NC}"
            mkdir -p logs
            K6_LOG="logs/k6-$(date +%Y%m%d-%H%M%S).log"
            echo -e "${BLUE}Guardando salida k6 en: ${K6_LOG}${NC}"
            # default envs can be overridden by caller
            BASE_URL=${BASE_URL:-http://localhost:3000} TARGET_VUS=${TARGET_VUS:-100} SEED_COUNT=${LOAD_SEED_COUNT:-1000} k6 run k6/loadtest.js 2>&1 | tee "${K6_LOG}"
        else
            echo -e "${YELLOW}k6 no encontrado en PATH. Instala k6 para ejecutar pruebas de carga.${NC}"
        fi
    else
        echo -e "${RED}No se encontró la carpeta tools/load-tests. Saltando load tests.${NC}"
    fi
fi

# If we deferred cleanup until after load tests, perform it now
if [ "$CLEANUP_AFTER_LOAD" = "true" ] && [ "$DOCKER_TEST_DB" = "true" ] && [ "$STARTED_TEST_DB" = "true" ]; then
    echo -e "${BLUE}🧹 (post-load) Limpiando contenedor de test ${TEST_DB_CONTAINER_NAME}...${NC}"
    docker stop ${TEST_DB_CONTAINER_NAME} >/dev/null 2>&1 || true
    docker rm ${TEST_DB_CONTAINER_NAME} >/dev/null 2>&1 || true
    echo -e "${GREEN}✅ Contenedor de test eliminado.${NC}"
fi

exit $((BACKEND_EXIT + FRONTEND_EXIT))
