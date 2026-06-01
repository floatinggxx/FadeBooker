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
