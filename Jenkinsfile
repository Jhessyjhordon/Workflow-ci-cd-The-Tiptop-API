pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    stages {
        stage('Clone Repository') {
            steps {
                    
                // Cloner le référentiel GitLab pour l'application Angular dans le sous-dossier 'angular'
                dir("${WORKSPACE}/") {
                    script {
                        if (!fileExists('the-tiptop-api-dev')) {
                            sh "mkdir the-tiptop-api-dev"
                            echo "Workspace : ${WORKSPACE}/the-tiptop-api-dev"
                            dir("${WORKSPACE}/the-tiptop-api-dev") {
                                checkout([$class: 'GitSCM',
                                    branches: [[name: '*/dev']],
                                    doGenerateSubmoduleConfigurations: false,
                                    extensions: [[$class: 'CleanCheckout']],
                                    submoduleCfg: [],
                                    userRemoteConfigs: [[credentialsId: 'the-tiptop-api-repo-token', url: 'https://gitlab.dsp-archiwebo22b-ji-rw-ah.fr/dev/the-tiptop-api']]])
                            }
                        } else {
                            echo "Le dossier 'the-tiptop-api-dev' existe déjà."
                            dir("${WORKSPACE}/the-tiptop-api-dev") {
                                checkout([$class: 'GitSCM',
                                    branches: [[name: '*/dev']],
                                    doGenerateSubmoduleConfigurations: false,
                                    extensions: [[$class: 'CleanCheckout']],
                                    submoduleCfg: [],
                                    userRemoteConfigs: [[credentialsId: 'the-tiptop-api-repo-token', url: 'https://gitlab.dsp-archiwebo22b-ji-rw-ah.fr/dev/the-tiptop-api']]])
                            }
                        }
                    }
                }

            }
        }

        stage('Run tests with Mocha & Chai') {
            steps {
                echo "Installation des dépendances"
                dir("${WORKSPACE}/the-tiptop-api-dev") {
                    sh "npm install" // Installation des dépendances npm
                }
                echo "Lancement des tests avec Mocha & Chai"
                dir("${WORKSPACE}/the-tiptop-api-dev") {
                    sh "npm test" // Exécution des tests mocha pour l'API dans le workdir
                }
            }
        }


        stage('SonarQube Analysis') {
            steps {
                echo "Analyse SonarQube pour API"
                dir("${WORKSPACE}/the-tiptop-api-dev") {
                    withCredentials([string(credentialsId: 'SonarQubeApi', variable: 'SONAR_TOKEN')]) {
                        // Afficher la valeur de WORKSPACE
                        echo "WORKSPACE est : ${WORKSPACE}"

                        withSonarQubeEnv('SonarQube') {
                            script {
                                def scannerHome = tool name: 'SonarQubeApi'
                                echo "scannerHome est : ${scannerHome}"
                                // Afficher le chemin d'accès de Sonar
                                echo "PATH+SONAR est : ${scannerHome}/bin"
                                withEnv(["PATH+SONAR=${scannerHome}/bin"]) {
                                    sh "sonar-scanner \
                                        -Dsonar.host.url=http://sonarqube.dsp-archiwebo22b-ji-rw-ah.fr/ \
                                        -Dsonar.login=${SONAR_TOKEN}"
                                }
                            }
                        }
                    }
                }
            }
        }


        stage('Build and Deploy') {
            steps {
                script {
                    // Supprimer l'ancien conteneur, s'il existe
                    def TheTiptopApiDevContainerExists = sh(script: "docker ps -a | grep -w TheTiptop_Api-dev", returnStatus: true) == 0
                    if (TheTiptopApiDevContainerExists) {
                        sh "docker stop TheTiptop_Api-dev"
                        sh "docker rm TheTiptop_Api-dev"
                    }

                    // Récupérer l'ID de l'image actuellement utilisée par le conteneur
                    echo "----==>>> Récupérer l'ID de l'image actuellement utilisée par le conteneur"
                    def currentImageId = sh(script: "docker ps -a --filter 'name=TheTiptop_Api-dev' --format '{{.Image}}'", returnStdout: true).trim()

                    if (currentImageId) {
                        // Supprimer l'image
                        echo "----==>>> Suppréssion de l'image"
                        sh "docker rmi ${currentImageId} -f"
                    }

                    // Construire et démarrer le conteneur avec docker-compose tout en créant une nouvelle image
                    echo "----==>>> Démarrage du container avec le chemin '/usr/local/bin/docker-compose' tout en créant une nouvelle image"
                    sh 'WORKSPACE_PATH=${WORKSPACE} /usr/local/bin/docker-compose -f /home/debian/docker-compose.yml up -d api-dev --build'
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
