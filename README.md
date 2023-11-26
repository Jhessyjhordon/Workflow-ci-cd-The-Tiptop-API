# The-Tiptop-API
The Thé Tiptop API

Cette Api a été mis en place, par un groupe d'étudiant, dans le cadre d'un projet de fin d'année pour validation du Diplome de Master 2 Architecte Web, il offre des points de terminaison pour le siteweb Jeux Concours Thé Tiptop.
## Lancer The-Tiptop-API en mode développement
- Clonner premièrement le projet avec la commande suivante: 
    
 		git clone http://51.254.97.98:81/dev/the-tiptop-api.git

- Acceder au repertoire `the-tiptop-api` dans votre terminal

- Executer la commande suivante:

		sudo docker compose -f docker-compose.api.dev.yml up
		# If you are Root on your Laptop, run the following
		docker compose -f docker-compose.api.dev.yml up

Il y a un utilisateur administrateur créé spécialement pour vous à des fins de test, voici ses identifiants
	
	
	
		name : Antipas
		firstname : Fidele
		email : fidele.antipas@gmail.com
		passwod: password

Votre serveur d'api sera disponible sur : **[http://localhost:4000/](http://localhost:4000/)** :flame: :flame:

La documentation :page_with_curl: de l'api est disponible **[ici](http://localhost:4000/api-docs/)** avec amour :grin:

Enjoye Code :blush: 
