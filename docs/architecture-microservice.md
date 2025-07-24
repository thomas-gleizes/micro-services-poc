# Documentation d'Architecture Microservice

## Aperçu

Ce document décrit l'architecture interne de nos microservices. Il fournit un modèle pour construire des microservices pilotés par le domaine, basés sur l'event sourcing, en utilisant une architecture en couches avec une séparation claire des préoccupations.

## Principes Architecturaux

Nos microservices suivent ces principes architecturaux clés :

- **Domain-Driven Design (DDD)** : Concentration sur le domaine central et la logique de domaine
- **Command Query Responsibility Segregation (CQRS)** : Séparation des opérations de lecture et d'écriture
- **Event Sourcing** : Stockage de tous les changements d'état de l'application sous forme d'une séquence d'événements
- **Architecture Hexagonale** : Isolation du cœur du domaine des préoccupations externes
- **Architecture Propre** : Garantir que les règles métier ne dépendent pas de frameworks ou d'outils externes

## Architecture en Couches

Le microservice est organisé en couches suivantes :

### 1. Couche de Domaine

La couche de domaine est le cœur de l'application, contenant la logique métier et les règles.

#### Composants :

- **Entités** : Objets de domaine avec identité et cycle de vie
- **Agrégats** : Groupes d'objets de domaine traités comme une unité unique
- **Objets de Valeur** : Objets immuables sans identité
- **Événements de Domaine** : Enregistrements immuables de quelque chose qui s'est produit dans le domaine
- **Interfaces de Dépôt** : Abstractions pour l'accès aux données
- **Services de Domaine** : Opérations qui ne s'intègrent pas naturellement dans une entité ou un objet de valeur
- **Exceptions de Domaine** : Exceptions personnalisées spécifiques aux règles de domaine

### 2. Couche d'Application

La couche d'application orchestre le flux de données vers et depuis la couche de domaine et coordonne la logique métier.

#### Composants :

- **Commandes** : Structures de données immuables représentant une intention de changer l'état du système
- **Gestionnaires de Commandes** : Traitent les commandes et appliquent la logique métier
- **Requêtes** : Structures de données immuables représentant une demande d'information
- **Gestionnaires de Requêtes** : Traitent les requêtes et renvoient des données
- **Services d'Application** : Coordonnent des opérations complexes à travers plusieurs agrégats

### 3. Couche d'Infrastructure

La couche d'infrastructure fournit des implémentations pour les interfaces définies dans la couche de domaine.

#### Composants :

- **Implémentations de Dépôts** : Implémentations concrètes des interfaces de dépôt
- **Intégrations de Services Externes** : Adaptateurs pour services externes
- **Mécanismes de Persistance** : Code d'accès à la base de données
- **Courtiers de Messages** : Implémentation de la publication et de l'abonnement aux événements

### 4. Couche de Présentation

La couche de présentation gère les requêtes et réponses HTTP.

#### Composants :

- **Contrôleurs** : Gèrent les requêtes HTTP et délèguent à la couche d'application
- **DTOs (Objets de Transfert de Données)** : Structures pour l'échange de données avec les clients
- **Validateurs** : Valident les données entrantes
- **Filtres** : Traitent les requêtes et les réponses

## Flux de Contrôle

### Flux de Commande (Opérations d'Écriture)

1. Le client envoie une requête à un contrôleur
2. Le contrôleur crée une commande et l'envoie au bus de commande
3. Le bus de commande route la commande vers le gestionnaire de commande approprié
4. Le gestionnaire de commande :
   - Récupère l'agrégat du dépôt (si mise à jour)
   - Crée un nouvel agrégat (si création)
   - Applique la logique métier
   - Applique les événements de domaine à l'agrégat
   - Sauvegarde l'agrégat dans le dépôt
5. Les événements de domaine sont publiés sur le bus d'événements
6. Les gestionnaires d'événements traitent les événements (par exemple, mise à jour des modèles de lecture, déclenchement d'effets secondaires)

### Flux de Requête (Opérations de Lecture)

1. Le client envoie une requête à un contrôleur
2. Le contrôleur crée une requête et l'envoie au bus de requête
3. Le bus de requête route la requête vers le gestionnaire de requête approprié
4. Le gestionnaire de requête récupère les données du dépôt ou du modèle de lecture
5. Les données sont renvoyées au client

## Event Sourcing

Nos microservices utilisent l'event sourcing pour maintenir un historique complet de tous les changements d'état de l'application.

### Concepts Clés :

- **Magasin d'Événements** : Stockage persistant pour les événements de domaine
- **Flux d'Événements** : Séquence d'événements pour un agrégat spécifique
- **Relecture d'Événements** : Reconstruction de l'état actuel en rejouant les événements
- **Instantanés** : Captures périodiques de l'état de l'agrégat pour optimiser le chargement

### Flux d'Événements :

1. Les événements de domaine sont appliqués aux agrégats
2. Les événements sont persistés dans le magasin d'événements
3. Les événements sont publiés sur le bus d'événements
4. Les gestionnaires d'événements traitent les événements pour mettre à jour les modèles de lecture ou déclencher des effets secondaires
5. D'autres microservices peuvent s'abonner aux événements pour maintenir leur propre état

## Structure des Dossiers

```
src/
├── applications/
│   ├── commands/
│   │   └── [command-name]/
│   │       ├── [command-name].command.ts
│   │       └── [command-name].handler.ts
│   └── queries/
│       └── [query-name]/
│           ├── [query-name].query.ts
│           └── [query-name].handler.ts
├── domain/
│   ├── aggregates/
│   │   └── [aggregate-name].aggregate.ts
│   ├── entities/
│   │   └── [entity-name].entity.ts
│   ├── events/
│   │   └── [event-name]/
│   │       └── [event-name].event.ts
│   ├── exceptions/
│   │   └── [exception-name].exception.ts
│   ├── repositories/
│   │   └── [repository-name].repository.ts
│   └── services/
│       └── [service-name].service.ts
├── infrastructure/
│   ├── repositories/
│   │   └── [repository-name]-[implementation].repository.ts
│   ├── schemas/
│   │   └── schema.prisma
│   └── services/
│       └── [service-name].service.ts
├── presentation/
│   ├── controllers/
│   │   └── [controller-name].controller.ts
│   └── dtos/
│       └── [dto-name].dto.ts
└── shared/
    ├── modules/
    │   └── [module-name].module.ts
    └── utils/
        └── [utility-name].util.ts
```

## Modèles de Conception

### Modèle de Dépôt

Le modèle de dépôt fournit une interface de type collection pour accéder aux agrégats de domaine :

- **Interface** : Définie dans la couche de domaine
- **Implémentation** : Fournie dans la couche d'infrastructure
- **Objectif** : Abstraire les détails d'accès aux données de la couche de domaine

### Modèle de Fabrique

Le modèle de fabrique est utilisé pour créer des objets de domaine complexes :

- **Méthodes de Fabrique Statiques** : Méthodes comme `create()` sur les entités et les agrégats
- **Objectif** : Encapsuler la logique de création et assurer un état d'objet valide

### Modèle d'Agrégat

Le modèle d'agrégat définit les limites de cohérence :

- **Racine d'Agrégat** : Le point d'entrée de l'agrégat
- **Invariants** : Règles métier qui doivent être maintenues
- **Objectif** : Assurer la cohérence transactionnelle

### Modèle de Commande

Le modèle de commande encapsule une demande sous forme d'objet :

- **Commande** : Structure de données représentant une intention
- **Gestionnaire de Commande** : Traite la commande
- **Objectif** : Découpler la demande de l'exécution

### Modèle de Requête

Le modèle de requête encapsule une demande de données :

- **Requête** : Structure de données représentant une demande d'information
- **Gestionnaire de Requête** : Traite la requête
- **Objectif** : Découpler la récupération de données de la présentation

## Meilleures Pratiques

### Couche de Domaine

- Garder la couche de domaine libre des préoccupations d'infrastructure
- Utiliser des modèles de domaine riches avec comportement
- Encapsuler les règles métier dans les entités et les agrégats
- Utiliser des objets de valeur pour les concepts sans identité
- Définir des limites d'agrégat claires

### Couche d'Application

- Garder les gestionnaires de commandes concentrés sur une seule responsabilité
- Utiliser le bus de commande pour les opérations d'écriture
- Utiliser le bus de requête pour les opérations de lecture
- Valider les commandes avant traitement
- Retourner des DTOs, pas des objets de domaine

### Couche d'Infrastructure

- Implémenter les dépôts en utilisant l'ORM ou la technologie d'accès aux données de votre choix
- Utiliser l'injection de dépendances pour fournir des implémentations
- Gérer les exceptions spécifiques à l'infrastructure et les traduire en exceptions de domaine
- Implémenter un contrôle de concurrence optimiste pour les mises à jour

### Couche de Présentation

- Garder les contrôleurs minces, en déléguant à la couche d'application
- Utiliser des DTOs pour l'échange de données avec les clients
- Valider les données entrantes
- Gérer les exceptions et renvoyer des codes d'état HTTP appropriés

## Conclusion

Cette architecture fournit une base solide pour construire des microservices évolutifs, maintenables et testables. En suivant ces modèles et pratiques, nous pouvons créer des microservices qui sont :

- **Ciblés** : Chaque microservice a une responsabilité claire
- **Indépendants** : Les microservices peuvent être développés, déployés et mis à l'échelle indépendamment
- **Résilients** : Les défaillances sont isolées aux microservices individuels
- **Évolutifs** : Les microservices peuvent être mis à l'échelle en fonction de leurs besoins spécifiques
- **Maintenables** : Une séparation claire des préoccupations rend le code plus facile à comprendre et à modifier
