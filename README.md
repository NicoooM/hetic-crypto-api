# Monolith

> All in one wallet tracker.

## Projet API - HETIC

Janvier 2025. Projet scolaire pour récupérer, visualiser et analyser les données de ses portefeuilles de cryptomonnaies via les APIs de Cryptocompare et Etherscan.

## Routes

### API

_Préfixé par `/api/v1`_

#### Authentification

- **POST** `/auth/register` : Se créer un compte
- **GET** `/auth/verify-email/<token>` : Route pour vérifier son e-mail
- **POST** `/auth/login` : Se connecter
- **POST** `/auth/logout` : Se déconnecter
- **POST** `/auth/refresh-access-token` : Route de rafraîchissement de son token

#### Wallet

- **POST** `/` : Créer un nouveau wallet
- **GET** `/` : Récupérer la liste des wallets
- **DELETE** `/wallet/<walletId>` : Supprimer un wallet
- **GET** `/history/<walletId>` : Récupérer l'historique d'un wallet
- **GET** `/portfolio/<walletId>` : Récupérer les statistiques d'un wallet

#### Profile

- **GET** `/` : Obtenir ses informations
- **PATCH** `/` : Modifier ses informations
- **PATCH** `/password` : Réinitialiser son mot de passe

### Client

- `/` : Menu d'accueil
- `/login` : Se connecter
- `/register` : Se créer un compte
- `/verify-email/<token>` : Page pour vérifier son e-mail
- `/dashboard` : Tableau de bord
- `/profile` : Son compte utilisateur
- `/fiscalite` : Espace fiscalité avec génération de PDF (non connecté à l'API)
- `/graph` : Graphique des transactions (non connecté à l'API)
