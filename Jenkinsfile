pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Compose') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'echo Frontend repo present'
                        sh 'docker compose config'
                    } else {
                        bat 'echo Frontend repo present'
                        bat 'docker compose config'
                    }
                }
            }
        }

        stage('Build Images') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker compose build'
                    } else {
                        bat 'docker compose build'
                    }
                }
            }
        }
    }
}