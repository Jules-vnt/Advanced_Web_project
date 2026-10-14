# Waste & Recycling Management

## Members
- Jules Venot
- Amadeo Berthelot
- Hadi Daccache

## Topic
A database and web application to manage household waste collection and recycling.

## Repository
- `data/` – MySQL script (`recycling.sql`: drop + create + insert), fake JSON data (one file per table) and the ER / table diagrams (`recycling_diagrams.pdf`)
- `docs/diagrams/` – use case diagram and planned Gantt
- `webapp_clientside/` – Vue.js frontend (pages: waste types, collection points, collections, treatment centers)

## Run the frontend
```
cd webapp_clientside
npm install
npm run serve
```

## Database
```
mysql -u root -p < data/recycling.sql
```
Test accounts (table `app_user`): every account uses the password `password123` (stored as a bcrypt hash).
Managers: `jvenot`, `aberthelot`, `hdaccache` – drivers: `mdupont`, `cvasseur`, ...
