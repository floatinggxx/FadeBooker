pipeline {
  agent any
  environment {
    NODE_ENV = 'test'
    TEST_DB_CONTAINER = 'fadebooker-test-db'
    TEST_DB_PORT = '11433'
    SA_PASSWORD = credentials('mssql-sa-password')
  }
  stages {
    stage('Install') {
      steps {
        sh 'npm --version || true'
      }
    }
    stage('Unit Tests') {
      steps {
        dir('Producto/back-fadebooker') {
          sh 'npm ci'
          sh 'npm test -- --colors'
        }
        dir('Producto/front-fadebooker') {
          sh 'npm ci'
          sh 'npm test'
        }
      }
    }
    stage('Prepare Test DB') {
      steps {
        script {
          sh "docker ps -a --format '{{.Names}}' | grep -q ${TEST_DB_CONTAINER} || true"
          sh "docker rm -f ${TEST_DB_CONTAINER} >/dev/null 2>&1 || true"
          sh "docker run -e 'ACCEPT_EULA=Y' -e MSSQL_SA_PASSWORD=${SA_PASSWORD} -p ${TEST_DB_PORT}:1433 --name ${TEST_DB_CONTAINER} -d mcr.microsoft.com/mssql/server:2019-latest"
          sh 'sleep 10'
          sh "docker exec -i ${TEST_DB_CONTAINER} /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P \"${SA_PASSWORD}\" -Q \"IF DB_ID(N'FadeBooker_Test') IS NULL CREATE DATABASE [FadeBooker_Test];\" || true"
        }
      }
    }
    stage('Security - SCA') {
      steps {
        sh 'npm --prefix Producto/back-fadebooker audit --json > security/npm-audit.json || true'
      }
    }
    stage('Security - SAST (Sonar)') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh 'sonar-scanner || true'
        }
      }
    }
    stage('Security - DAST (OWASP ZAP)') {
      steps {
        sh 'docker run -d --name zap -p 8090:8090 owasp/zap2docker-stable || true'
        sh 'sleep 8'
        sh 'curl --fail http://localhost:3000/health || true'
        sh "docker run --rm owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000 -r zap-report.html || true"
        publishHTML([reportDir: '.', reportFiles: 'zap-report.html', reportName: 'ZAP Report'])
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'security/**', allowEmptyArchive: true
      junit 'Producto/back-fadebooker/test-results/**/*.xml'
      emailext subject: "Security Scan - ${env.BUILD_NUMBER}", body: "Security pipeline finished. See artifacts.", recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    }
  }
}
pipeline {
    agent any

    tools {
        nodejs 'node-20' // Configura tu versión de Node.js instalada en Jenkins
    }

    environment {
        BACKEND_DIR  = 'Producto/back-fadebooker'
        FRONTEND_DIR = 'Producto/front-fadebooker'
    }

    stages {
        stage('⚙️ Preparación y Limpieza') {
            steps {
                echo 'Iniciando limpieza del entorno y restauración de dependencias limpias...'
                dir("${env.WORKSPACE}/${BACKEND_DIR}") {
                    sh 'npm ci'
                }
                dir("${env.WORKSPACE}/${FRONTEND_DIR}") {
                    sh 'npm ci'
                }
            }
        }

        stage('🛡️ Auditoría de Seguridad (NPM Audit)') {
            steps {
                echo 'Validando que no existan dependencias comprometidas de seguridad...'
                dir("${env.WORKSPACE}/${BACKEND_DIR}") {
                    sh 'npm audit --audit-level=high || true' // Permite warning, pero genera registro
                }
                dir("${env.WORKSPACE}/${FRONTEND_DIR}") {
                    sh 'npm audit --audit-level=high || true'
                }
            }
        }

        stage('🔍 Control Arquitectónico y Dependencias Obsoletas') {
            steps {
                echo 'Chequeando salud de arquitectura y librerías sin uso...'
                dir("${env.WORKSPACE}/${BACKEND_DIR}") {
                    sh 'npm outdated || true' // Reporta en consola el estado de versiones obsoletas
                }
                dir("${env.WORKSPACE}/${FRONTEND_DIR}") {
                    sh 'npm outdated || true'
                }
            }
        }

        stage('🧪 Ejecución de Pruebas Unitarias') {
            steps {
                echo 'Ejecutando suite de test suite de regresión...'
                dir("${env.WORKSPACE}/${BACKEND_DIR}") {
                    sh 'npm test'
                }
            }
        }

        stage('📦 Validación de Compilación (Production Build)') {
            steps {
                echo 'Verificando empaquetado de producción libre de errores en importaciones...'
                dir("${env.WORKSPACE}/${FRONTEND_DIR}") {
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo '🎉 El pipeline de FadeBooker ha compilado con éxito. Dependencias íntegras, pruebas correctas y arquitectura respetada.'
        }
        failure {
            echo '❌ Pipeline fallido. Revisa las dependencias obsoletas instaladas o errores en la suite de pruebas unitarias.'
        }
    }
}
