#!/usr/bin/env bash
# Helper to run k6 using the official Docker image and capture logs
# Usage: ./run_k6_docker.sh --vus 50 --duration 30s --script k6/loadtest.js
set -euo pipefail
SCRIPT=${1:-k6/loadtest.js}
shift || true
LOG_DIR="$(pwd)/logs"
mkdir -p "${LOG_DIR}"
K6_LOG="${LOG_DIR}/k6-docker-$(date +%Y%m%d-%H%M%S).log"
# mount project and run k6
echo "Ejecutando k6 docker con script=${SCRIPT}. Guardando en ${K6_LOG}"
# allow passing additional k6 args via env K6_ARGS
docker run --rm -i -v "$(pwd):/workspace" -w /workspace loadimpact/k6:latest run ${SCRIPT} "$@" 2>&1 | tee "${K6_LOG}"
exit ${PIPESTATUS[0]}
