pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    stages {
        stage('Clone Repository') {
            steps {
                dir('/debian/jenkins_home/workspace/the-tiptop-api') {
                    echo "Clonnage du repo dans /debian/jenkins_home/workspace/the-tiptop-api"
                    checkout([$class: 'GitSCM',
                        branches: [[name: '*/main']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[$class: 'CleanCheckout']],
                        submoduleCfg: [],
                        userRemoteConfigs: [[credentialsId: 'the-tiptop-api-repo-token', url: 'http://51.254.97.98:81/dev/the-tiptop-api']]
                    ])
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo "Analyse SonarQube pour API"
                dir("${WORKSPACE}") {
                    withCredentials([string(credentialsId: 'SonarQubeApi', variable: 'SONAR_TOKEN')]) {
                        // Afficher la valeur de WORKSPACE
                        echo "WORKSPACE est : ${WORKSPACE}"

                        // Utilisez withSonarQubeEnv avec le nom de votre configuration SonarQube
                        withSonarQubeEnv('SonarQube') {
                            // Afficher les informations de l'outil SonarQube
                            def scannerHome = tool name: 'SonarQubeApi'
                            echo "scannerHome est : ${scannerHome}"

                            // Afficher le chemin d'accès de Sonar
                            echo "PATH+SONAR est : ${scannerHome}/bin"

                            withEnv(["PATH+SONAR=${scannerHome}/bin"]) {
                                sh "sonar-scanner \
                                    -Dsonar.host.url=http://sonarqube.dsp-archiwebo22b-ji-rw-ah.fr:8082/ \
                                    -Dsonar.login=${SONAR_TOKEN}"
                            }
                        }
                    }
                }
            }
        }


        stage('Build and Deploy') {
            steps {
                script {
                    // Récupérer l'ID de l'image actuellement utilisée par le conteneur
                    echo "----==>>> Récupérer l'ID de l'image actuellement utilisée par le conteneur"
                    def currentImageId = sh(script: "docker ps -a --filter 'name=TheTiptop_Api' --format '{{.Image}}'", returnStdout: true).trim()

                    if (currentImageId) {
                        // Supprimer l'image
                        echo "----==>>> Suppréssion de l'image"
                        sh "docker rmi ${currentImageId} -f"
                    }

                    // Construire et démarrer le conteneur avec docker-compose tout en créant une nouvelle image
                    echo "----==>>> Démarrage du container avec le chemin '/usr/local/bin/docker-compose' tout en créant une nouvelle image"
                    sh '/usr/local/bin/docker-compose -f /home/debian/docker-compose.yml up -d --build'
                }
            }
        }

        stage('Succès') {
            steps {
                echo "Réussi"
            }
        }
        // ... autres stages, comme le déploiement, l'optimisation des assets, le backup, etc.
    }
}

// test 9
