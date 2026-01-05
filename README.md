# Expense Tracker 

## Aperçu
Expense Tracker est une application mobile de suivi des dépenses, simple, fiable et **offline-first**. Elle permet l’ajout rapide de dépenses, la consultation d’un historique mensuel, des statistiques (totaux, moyenne, tendance) et une **sauvegarde/restauration par utilisateur** via Firebase.

## Fonctionnalités
- Authentification (Inscription/Connexion/Déconnexion) avec persistance de session.
- CRUD des dépenses (ajout, suppression), catégorisation et tri par date.
- Historique mensuel avec regroupement et totaux par section.
- Statistiques utiles (totaux, moyenne, prédiction simple, alerte au-dessus de la moyenne).
- Sauvegarde/Restaurer au cloud **par utilisateur** (Firebase Realtime Database).
- UX cohérente: safe areas, navigation par onglets, expérience fluide.

## Architecture (haut niveau)
- **Navigation**: `AuthNavigator` pour l’accès invité (Login/Register) et `AppNavigator` pour les écrans applicatifs (Dashboard, Add, History, Settings).
- **Services**: 
  - `authService` (authentification, écoute d’état),
  - `expenseService` (CRUD SQLite, migration `userId`),
  - `backupService` (backup/restore par utilisateur),
  - `historyService` (groupements, sections),
  - `calculations` (somme, moyenne, prédiction, alertes).
- **Données locales**: SQLite via Expo (`expo-sqlite`), filtrage systématique par `userId`.
- **Cloud**: Firebase Authentication + Realtime Database (RTDB) avec séparation stricte par `uid`.

## Pile technologique
- React Native + Expo
- React Navigation (stacks & tabs)
- SQLite (`expo-sqlite`)
- Firebase Auth + Realtime Database
- AsyncStorage (persistance d’auth)
- `react-native-safe-area-context`

## Prérequis
- Node.js LTS (16+ recommandé)
- npm ou yarn
- Expo CLI (optionnel en global)

## Installation
Exécuter depuis le dossier du projet mobile.

```powershell
cd ExpenseTracker
npm install
```

## Configuration Firebase
Renseigner les clés Firebase dans `ExpenseTracker/src/config/firebaseConfig.js`.

Exemple de structure :

```javascript
export const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  databaseURL: "https://<PROJECT_ID>-default-rtdb.firebaseio.com",
  projectId: "<PROJECT_ID>",
  storageBucket: "<PROJECT_ID>.appspot.com",
  messagingSenderId: "<SENDER_ID>",
  appId: "<APP_ID>"
};
```

- Auth: utiliser `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })`.
- RTDB: sauvegarde/restauration sous `backup/<uid>`.

## Base locale (SQLite)
- Table `expenses`: `id`, `amount`, `category`, `description`, `createdAt`, `userId`.
- Migration automatique: `ensureUserScopedSchemaAndBackfill(userId)` ajoute la colonne `userId` si absente et rétro-écrit les lignes sans propriétaire.
- Toutes les requêtes sont **filtrées par `userId`** pour l’isolation multi-utilisateur.

## Démarrage
Pour lancer l’application en mode développement (Expo):

```powershell
cd ExpenseTracker
npx expo start
```

## Structure du projet

```
ExpenseTracker/
  App.js
  app.json
  index.js
  package.json
  assets/
  src/
    components/
      ExpenseInput.js
      ExpenseItem.js
      MonthlyChart.js
      StatsCard.js
    config/
      firebaseConfig.js
    database/
      database.js
      database.web.js
    navigation/
      AppNavigator.js
      AuthNavigator.js
    screens/
      DashboardScreen.js
      ExpenseScreen.js
      HistoryScreen.js
      LoginScreen.js
      RegisterScreen.js
      SettingsScreen.js
    services/
      authService.js
      backupService.js
      expenseService.js
      historyService.js
    utils/
      calculations.js
```

## Navigation et écrans
- `AuthNavigator`: `LoginScreen`, `RegisterScreen`.
- `AppNavigator`: `DashboardScreen`, `ExpenseScreen` (ajout/liste), `HistoryScreen` (groupements mensuels), `SettingsScreen` (backup/restore/déconnexion).

## Flux métier (résumé)
- **Authentification**: écoute `onAuthStateChanged` pour router vers Auth/App; persistance via AsyncStorage.
- **Dépenses**: insertion/lecture/suppression dans SQLite avec `userId` ; rafraîchissement à la focalisation.
- **Sauvegarde/Restaurer**: export/import des dépenses de l’utilisateur vers/depuis RTDB `backup/<uid>`.
- **Statistiques**: calculs (somme, moyenne, prédiction, alerte) via `utils/calculations.js`.

