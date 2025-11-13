pipeline {
    agent any

    environment {
        GCP_PROJECT_ID = 'c1exchange'
        GCP_SA_KEY = credentials('jenkins-sa-key-json-id')
        DOCKER_IMAGE_NAME = 'locality-campaign-builder-api'
        DOCKER_IMAGE_TAG = "v${env.BUILD_ID}"
        ARTIFACT_REGISTRY_REGION = 'us-west1'
        ARTIFACT_REGISTRY_REPO = 'locality-campaign-builder-api'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def dockerfile = 'Dockerfile'
                    def dockerImage = docker.build("${env.ARTIFACT_REGISTRY_REGION}-docker.pkg.dev/${env.GCP_PROJECT_ID}/${env.ARTIFACT_REGISTRY_REPO}/${env.DOCKER_IMAGE_NAME}:${env.DOCKER_IMAGE_TAG}", "-f ${dockerfile} .")
                }
            }
        }

        stage('Push to Artifact Registry') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'jenkins-sa-key-json-id', variable: 'GCP_SA_KEY')]) {
                        sh '''
                            gcloud auth activate-service-account --key-file=$GCP_SA_KEY
                            gcloud auth configure-docker "${ARTIFACT_REGISTRY_REGION}-docker.pkg.dev"
                            docker push "${ARTIFACT_REGISTRY_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                        '''
                    }
                }
            }
        }

        stage('Docker Cleanup') {
            steps {
                script {
                    sh '''
                        docker image rm "${ARTIFACT_REGISTRY_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    '''
                }
            }
        }

        stage('Deploy Docker Image to adinte-server') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'jenkins-sa-key-json-id', variable: 'GCP_SA_KEY')]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i /var/lib/jenkins/.ssh/adinte-formbricks-survey-prod.pem ubuntu@35.197.126.176 << EOF
                                docker stop locality-campaign-builder-api || true
                                docker rm locality-campaign-builder-api || true
                                docker image prune -a -f ||true
                                docker pull ${ARTIFACT_REGISTRY_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                                docker run -d --name locality-campaign-builder-api --env-file /home/ubuntu/locality-campaign-builder-api.env/.env -p 4001:4001 \\
                                    ${ARTIFACT_REGISTRY_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
EOF
                        """
                    }
                }
            }
        }
    }
}