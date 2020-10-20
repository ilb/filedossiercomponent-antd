pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '3'))
    }
    stages {
        stage ('Build') {
            steps {
                nodejs('node10') {
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'npm publish'
               }
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
