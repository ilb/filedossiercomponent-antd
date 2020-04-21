pipeline {
    agent any
    environment {
        PATH = "/opt/nodejs8/bin/:$PATH"
    }
    stages {
        stage ('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'npm publish'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
