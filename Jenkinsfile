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
                dir('frontend') {
                    sh 'echo Frontend repo present'
                }
                sh 'docker compose config'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build'
            }
        }
    }
}