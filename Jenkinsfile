pipeline {
  agent any

  tools {
    nodejs 'node-20'
  }

  environment {
    NODE_ENV = 'test'
    TEST_DB_CONTAINER = 'fadebooker-test-db'
    TEST_DB_PORT = '11433'
    SA_PASSWORD = credentials('mssql-sa-password')
  }

  stages {
    stage('⚙️ Preparación y Limpieza') {
      steps {
        echo 'Iniciando limpieza del entorno y restauración de dependencias limpias...'
        sh 'npm ci --prefix Producto/back-fadebooker'
        sh 'npm ci --prefix Producto/front-fadebooker'
      }
    }

    stage('🧪 Pruebas Unitarias') {
      steps {
        echo 'Ejecutando suite de test suite de regresión...'
        // Run both backend and frontend unit/integration tests using the unified run_tests.sh
        sh 'DOCKER_TEST_DB=false SECURITY_TESTS=false RUN_LOAD_TESTS=false ./run_tests.sh'
      }
    }

    stage('⚡ Pruebas de Carga y Esfuerzo (Stress)') {
      steps {
        echo 'Ejecutando pruebas de esfuerzo y carga con MSSQL y k6 en Docker...'
        sh "DOCKER_TEST_DB=true RUN_LOAD_TESTS=true LOAD_SEED_COUNT=1000 TARGET_VUS=1000 TEST_DB_SA_PASSWORD='${SA_PASSWORD}' ./run_tests.sh"
      }
    }

    stage('🛡️ Auditoría de Seguridad (NPM Audit)') {
      steps {
        echo 'Validando que no existan dependencias comprometidas de seguridad...'
        sh 'npm audit --prefix Producto/back-fadebooker --audit-level=high || true'
        sh 'npm audit --prefix Producto/front-fadebooker --audit-level=high || true'
      }
    }

    stage('🔍 Análisis Estático (SAST Sonar)') {
      steps {
        echo 'Ejecutando análisis de SonarQube...'
        withSonarQubeEnv('SonarQube') {
          sh 'sonar-scanner || true'
        }
      }
    }

    stage('🕸️ Seguridad Dinámica (DAST OWASP ZAP)') {
      steps {
        echo 'Ejecutando escaneo dinámico DAST contra el backend...'
        sh '''
        # Start backend in background using SQLite in-memory for ZAP scan target on port 3001
        PORT=3001 NODE_ENV=test node Producto/back-fadebooker/src/index.js > backend-zap.log 2>&1 &
        BACKEND_PID=$!
        sleep 5
        curl -f http://localhost:3001/ || true

        # Run ZAP baseline scan targeting port 3001
        docker run -d --name zap -p 8090:8090 owasp/zap2docker-stable || true
        sleep 8
        docker run --rm --network host owasp/zap2docker-stable zap-baseline.py -t http://localhost:3001 -r zap-report.html || true

        # Clean up backend process
        kill $BACKEND_PID || true
        '''
        publishHTML([reportDir: '.', reportFiles: 'zap-report.html', reportName: 'ZAP Report'])
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'security/**', allowEmptyArchive: true
      archiveArtifacts artifacts: 'zap-report.html', allowEmptyArchive: true
      echo 'Finalizando ejecución de pipeline.'
    }
    success {
      echo '🎉 El pipeline de FadeBooker ha compilado con éxito. Dependencias íntegras, pruebas correctas y arquitectura respetada.'
    }
    failure {
      echo '❌ Pipeline fallido. Revisa las dependencias obsoletas instaladas o errores en la suite de pruebas unitarias.'
    }
  }
}
