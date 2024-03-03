# CinéGest - Gestionnaire de Collection de Films

Bienvenue dans CinéGest, le gestionnaire de collection de films qui rend la gestion de votre collection aussi agréable que de regarder vos films préférés. Connectez-vous, ajoutez vos films en favoris , organisez-les et restez informé des dernières mises à jour.

## Fonctionnalités

### Films Favoris
Marquez vos films préférés en tant que favoris pour un accès rapide. Gérez cette liste spéciale selon vos goûts.

### Notifications Personnalisées
Restez informé des changements importants dans votre collection. Recevez des notifications par e-mail pour les mises à jour de vos films favoris, mais également lors de inscirption et quand un nouveau film est ajouté !

## Technologies Utilisées

- Backend : Node.js avec Hapi.js
- Base de Données : MySQL
- Messagerie : nodeMailer et RabbitMQ pour la gestion des tâches asynchrones
- Authentification : JWT (JSON Web Tokens)

## Comment utiliser l'application ?

### Modules nécessaires
- nodeJS et npm : [Installation](https://nodejs.org/en/download/)
- docker : [Installation](https://docs.docker.com/desktop/install/)

### Installation 
Clonez le répertoire git afin de récupérer le projet : 
``` git clone https://github.com/Paulloooo/iut-project-r605 ```

Allez dans le projet en faisant dans le terminal la commande 
``` cd iut-project-r605 ```

Par la suite, il faudra instaurer la base de données afin de pouvoir gérer nos films. On utilisera alors docker et on lancera cette commande : 

```docker run --name hapi-mysql -e MYSQL_USER=temmie -e MYSQL_PASSWORD=hapi -e MYSQL_ROOT_PASSWORD= hapi -e MYSQL_DATABASE=user -d -p 3308:3306 mysql:8 mysqld --default-authentication-plugin=mysql_native_password```

Une fois le conteneur instancié, il faudra également lancer le message broker RabbitMQ, qui servira pour les administrateurs de l’application. Dans un autre terminal, mettez la commande :*

```docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management```

On peut désormais lancer notre application ! Ouvrez un dernier terminal et lancer les commandes suivantes : 
``` 
cd {chemin de votre projet}
npm start
```

Vous devriez voir affiché : 
``` 
> iut-project@1.0.0 start
> node server

Debug: start 
    Server started at http://localhost:3000
``` 

### Connexion
Pour ouvrir le panel de l’application, ouvrez votre navigateur et dirigez vous vers l’URL (http://localhost:3000/documentation) ! Vous devriez voir affiché toutes les routes.

Pour vous connecter en administrateur et effectuer toutes les actions (créer un utilisateur notamment), il y a un compte inséré de base dans la base de données. Placez vous donc sur la route POST /user/login et insérez le body suivant : 
``` 
{
  "email": "admin@example.com",
  "password": "admin"
}
``` 
La sortie de la requête est un token, qu’il faudra par la suite copier (en rajoutant au début de celui-ci « Bearer : ») et coller dans la section « Authorize » en haut de la page. Une fois connecté, l’application est à vous ! Amusez vous bien 😉

