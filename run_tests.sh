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
DB_SETUP_SUCCESS=true
if [ "$DOCKER_TEST_DB" = "true" ]; then
    # check docker
    if ! command -v docker >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Docker no encontrado. Saltando creación de DB dockerizada.${NC}"
        DB_SETUP_SUCCESS=false
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
        max=45; i=0
        while ! nc -z 127.0.0.1 ${TEST_DB_PORT} >/dev/null 2>&1; do
            sleep 1
            i=$((i+1))
            if [ $i -ge $max ]; then
                echo -e "${RED}❌ Timeout esperando la DB de prueba. Revisa logs de Docker.${NC}"
                DB_SETUP_SUCCESS=false
                break
            fi
        done

        if [ "$DB_SETUP_SUCCESS" = "true" ]; then
            # Create test database if not exists using a mssql-tools container (sqlcmd)
            echo -e "${BLUE}🔧 Asegurando existencia de la BD de pruebas: ${TEST_DB_NAME}${NC}"
            docker run --rm --network container:${TEST_DB_CONTAINER_NAME} mcr.microsoft.com/mssql-tools \
                /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "${TEST_DB_SA_PASSWORD}" -Q "IF DB_ID(N'${TEST_DB_NAME}') IS NULL CREATE DATABASE [${TEST_DB_NAME}];" >/dev/null 2>&1 || DB_SETUP_SUCCESS=false
        fi

        # Si falló la conexión por clave vieja o corrupción, recrear el contenedor
        if [ "$DB_SETUP_SUCCESS" = "false" ]; then
            echo -e "${YELLOW}⚠️  Fallo de conexión o verificación con base de datos de pruebas. Recreando contenedor ${TEST_DB_CONTAINER_NAME} con nueva configuración...${NC}"
            docker rm -f ${TEST_DB_CONTAINER_NAME} >/dev/null 2>&1 || true
            docker run -e 'ACCEPT_EULA=Y' -e "SA_PASSWORD=${TEST_DB_SA_PASSWORD}" \
                -p ${TEST_DB_PORT}:1433 --name ${TEST_DB_CONTAINER_NAME} -d mcr.microsoft.com/mssql/server:2019-latest >/dev/null
            STARTED_TEST_DB=true
            DB_SETUP_SUCCESS=true

            # esperar de nuevo
            echo -e "${BLUE}⏳ Esperando a que el nuevo contenedor esté listo...${NC}"
            max=45; i=0
            while ! nc -z 127.0.0.1 ${TEST_DB_PORT} >/dev/null 2>&1; do
                sleep 1
                i=$((i+1))
                if [ $i -ge $max ]; then
                    DB_SETUP_SUCCESS=false
                    break
                fi
            done

            if [ "$DB_SETUP_SUCCESS" = "true" ]; then
                docker run --rm --network container:${TEST_DB_CONTAINER_NAME} mcr.microsoft.com/mssql-tools \
                    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "${TEST_DB_SA_PASSWORD}" -Q "IF DB_ID(N'${TEST_DB_NAME}') IS NULL CREATE DATABASE [${TEST_DB_NAME}];" >/dev/null 2>&1 || DB_SETUP_SUCCESS=false
            fi
        fi

        if [ "$DB_SETUP_SUCCESS" = "true" ]; then
            # Export env vars to point the app to the test DB
            export DB_HOST=127.0.0.1
            export DB_PORT=${TEST_DB_PORT}
            export DB_USER=sa
            export DB_PASSWORD=${TEST_DB_SA_PASSWORD}
            export DB_DATABASE=${TEST_DB_NAME}
            echo -e "${GREEN}✅ Test DB disponible en 127.0.0.1:${TEST_DB_PORT} (DB: ${TEST_DB_NAME})${NC}"
        else
            echo -e "${RED}❌ No se pudo inicializar la base de datos de pruebas. Desactivando pruebas de carga.${NC}"
            RUN_LOAD_TESTS=false
        fi
    fi
fi
if [ -d "node_modules" ]; then
    npm run test -- --colors 2>&1 | tee "${REPO_ROOT}/backend-test.log"
    BACKEND_EXIT=${PIPESTATUS[0]}
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
    npm test 2>&1 | tee "${REPO_ROOT}/frontend-test.log"
    FRONTEND_EXIT=${PIPESTATUS[0]}
else
    echo -e "${RED}⚠️  node_modules no encontrado en frontend. Ejecute 'npm install' primero.${NC}"
    FRONTEND_EXIT=1
fi

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
        SEED_DB_NAME=${DB_DATABASE:-${DB_NAME:-FadeBooker_Test}}

        if [ "$LOAD_SEED_COUNT" -gt 0 ]; then
            echo -e "${BLUE}Sembrando $LOAD_SEED_COUNT usuarios de prueba...${NC}"
            # Prefer the DB we created for tests (DB_DATABASE). If caller passed DB_NAME, override and warn.
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

                # Import schema SQL
                echo -e "${BLUE}🚀 Cargando esquema base en ${SEED_DB_NAME}...${NC}"
                docker run --rm -i --network container:${TEST_DB_CONTAINER_NAME} mcr.microsoft.com/mssql-tools \
                    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "${TEST_DB_SA_PASSWORD}" -d "${SEED_DB_NAME}" < "${REPO_ROOT}/Documentación/Documentos/fadebooker_test_schema.sql" >/dev/null 2>&1 || true

                # Import additional tables (e.g. Subscription)
                if [ -f "${REPO_ROOT}/Producto/back-fadebooker/Documentación/20260611_Create_Subscription_Table.sql" ]; then
                    echo -e "${BLUE}🚀 Cargando tabla de subscripción (Subscription) en ${SEED_DB_NAME}...${NC}"
                    docker run --rm -i --network container:${TEST_DB_CONTAINER_NAME} mcr.microsoft.com/mssql-tools \
                        /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "${TEST_DB_SA_PASSWORD}" -d "${SEED_DB_NAME}" < "${REPO_ROOT}/Producto/back-fadebooker/Documentación/20260611_Create_Subscription_Table.sql" >/dev/null 2>&1 || true
                fi

                # Run database migrations to create tables before seeding
                echo -e "${BLUE}🚀 Ejecutando migraciones de Knex en la BD de pruebas (${SEED_DB_NAME})...${NC}"
                cd "${REPO_ROOT}/Producto/back-fadebooker"
                DB_SERVER=127.0.0.1 DB_HOST=127.0.0.1 DB_PORT=${TEST_DB_PORT} DB_USER=sa DB_PASSWORD="${TEST_DB_SA_PASSWORD}" DB_DATABASE="${SEED_DB_NAME}" FORCE_LOCAL_DB=true npx knex migrate:latest --knexfile src/config/knexfile.js --migrations-directory ../db/migrations >/dev/null
                cd "${TOOLS_DIR}"

            FIXED_EMAILS=true DB_HOST=${DB_HOST:-127.0.0.1} DB_PORT=${DB_PORT:-${TEST_DB_PORT}} DB_USER=${DB_USER:-sa} DB_PASSWORD=${DB_PASSWORD:-${TEST_DB_SA_PASSWORD}} DB_NAME=${SEED_DB_NAME} node seed_users.js --count=${LOAD_SEED_COUNT}
        else
            echo -e "${YELLOW}Omitiendo seed de usuarios (LOAD_SEED_COUNT not set or 0).${NC}"
        fi

        # Kill any process already listening on port 3001 to prevent conflicts
        TEST_PORT=3001
        if lsof -t -i:${TEST_PORT} >/dev/null 2>&1; then
            echo -e "${YELLOW}⚠️  Puerto ${TEST_PORT} ocupado. Liberándolo...${NC}"
            kill -9 $(lsof -t -i:${TEST_PORT}) >/dev/null 2>&1 || true
            sleep 1
        elif fuser -n tcp ${TEST_PORT} >/dev/null 2>&1; then
            echo -e "${YELLOW}⚠️  Puerto ${TEST_PORT} ocupado. Liberándolo...${NC}"
            fuser -k -n tcp ${TEST_PORT} >/dev/null 2>&1 || true
            sleep 1
        fi

        # Start backend in the background on port 3001 to avoid conflicts
        BACKEND_PID=""
        if ! nc -z 127.0.0.1 ${TEST_PORT} >/dev/null 2>&1; then
            echo -e "${BLUE}Starting backend application on port ${TEST_PORT} for load testing...${NC}"
            cd "${REPO_ROOT}/Producto/back-fadebooker"
            PORT=${TEST_PORT} NODE_ENV=development DB_SERVER=127.0.0.1 DB_HOST=127.0.0.1 DB_PORT=${TEST_DB_PORT} DB_USER=sa DB_PASSWORD="${TEST_DB_SA_PASSWORD}" DB_DATABASE="${SEED_DB_NAME}" FORCE_LOCAL_DB=true node src/index.js > "${REPO_ROOT}/backend-test-run.log" 2>&1 &
            BACKEND_PID=$!
            cd "${TOOLS_DIR}"
            
            # Wait for backend to be ready
            echo -e "${BLUE}⏳ Esperando a que el Backend responda en http://127.0.0.1:${TEST_PORT}...${NC}"
            max=30; k=0
            while ! curl -s http://127.0.0.1:${TEST_PORT}/ >/dev/null 2>&1; do
                sleep 1
                k=$((k+1))
                if [ $k -ge $max ]; then
                    echo -e "${RED}❌ Timeout esperando al Backend en puerto ${TEST_PORT}. Mostrando últimas líneas de backend-test-run.log:${NC}"
                    tail -n 30 "${REPO_ROOT}/backend-test-run.log"
                    break
                fi
            done
        else
            echo -e "${RED}❌ El puerto ${TEST_PORT} sigue ocupado. No se puede iniciar el backend de prueba.${NC}"
            exit 1
        fi

        # Run k6 if available, or fall back to docker
        if command -v k6 >/dev/null 2>&1; then
            echo -e "${BLUE}Ejecutando k6 load test local...${NC}"
            mkdir -p logs
            K6_LOG="logs/k6-$(date +%Y%m%d-%H%M%S).log"
            echo -e "${BLUE}Guardando salida k6 en: ${K6_LOG}${NC}"
            BASE_URL=${BASE_URL:-http://localhost:3001} TARGET_VUS=${TARGET_VUS:-100} SEED_COUNT=${LOAD_SEED_COUNT:-1000} k6 run k6/loadtest.js 2>&1 | tee "${K6_LOG}"
        elif command -v docker >/dev/null 2>&1; then
            echo -e "${BLUE}Ejecutando k6 load test via Docker (grafana/k6)...${NC}"
            mkdir -p logs
            K6_LOG="logs/k6-$(date +%Y%m%d-%H%M%S).log"
            echo -e "${BLUE}Guardando salida k6 en: ${K6_LOG}${NC}"
            docker run --rm --network host -i -v "$(pwd):/workspace" -w /workspace grafana/k6:latest run --env BASE_URL=${BASE_URL:-http://localhost:3001} --env TARGET_VUS=${TARGET_VUS:-100} --env SEED_COUNT=${LOAD_SEED_COUNT:-1000} k6/loadtest.js 2>&1 | tee "${K6_LOG}"
        else
            echo -e "${YELLOW}Ni k6 ni Docker encontrados en PATH. Saltando pruebas de carga.${NC}"
        fi

        # Kill backend if started by this script
        if [ -n "$BACKEND_PID" ]; then
            echo -e "${BLUE}🛑 Deteniendo backend (PID: ${BACKEND_PID})...${NC}"
            kill $BACKEND_PID >/dev/null 2>&1 || true
            wait $BACKEND_PID >/dev/null 2>&1 || true
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

# ======================================================================
# 📊 REPORTE DE RESULTADOS DETALLADOS EN ESPAÑOL
# ======================================================================
echo -e "\n${BLUE}======================================================================${NC}"
echo -e "${GREEN}📊 RESUMEN DETALLADO DE EJECUCIÓN DE PRUEBAS - FADEBOOKER${NC}"
echo -e "${BLUE}======================================================================${NC}"

if [ -f "${REPO_ROOT}/backend-test.log" ]; then
    echo -e "\n${YELLOW}🧪 [BACKEND JEST] Pruebas Unitarias y de Integración:${NC}"
    grep -E "Test Suites:|Tests:|Time:" "${REPO_ROOT}/backend-test.log" || echo "No se pudo extraer el resumen de backend-test.log"
fi

if [ -f "${REPO_ROOT}/frontend-test.log" ]; then
    echo -e "\n${YELLOW}🎨 [FRONTEND VITEST] Pruebas Unitarias:${NC}"
    grep -E "Test Files|Tests|Duration" "${REPO_ROOT}/frontend-test.log" || echo "No se pudo extraer el resumen de frontend-test.log"
fi

if [ "$RUN_LOAD_TESTS" = "true" ] && [ -f "${K6_LOG}" ]; then
    echo -e "\n${YELLOW}⚡ [PRUEBAS DE CARGA K6] Métricas Clave y Resultados:${NC}"
    grep -E "checks_succeeded|checks_failed|http_req_duration|http_req_failed|vus_max" "${K6_LOG}" || true
    echo -e "\n${BLUE}Detalle de Casos de Prueba (k6):${NC}"
    grep -A 1 -E "login status 200|barberos 200|register 201" "${K6_LOG}" || true
fi
echo -e "${BLUE}======================================================================${NC}"

exit $((BACKEND_EXIT + FRONTEND_EXIT))
