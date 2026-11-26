# Waste & Recycling Management

## Members
- Jules Venot
- Amadeo Berthelot
- Hadi Daccache

## Topic
A database and web application to manage household waste collection and recycling.

## Repository
- `data/` – MySQL script (`recycling.sql`: drop + create + insert), fake JSON data (one file per table) and the ER / table diagrams (`recycling_diagrams.pdf`)
- `docs/project_documents.pdf` – all documents in one PDF (use case diagrams, database diagrams, Gantt, member diagrams, component diagrams, class diagram)
- `docs/diagrams/` – each diagram on its own (rebuild the global PDF with `python3 docs/build_documents.py`)
- `webapp_clientside/` – Vue.js frontend (pages: waste types, collection points, collections, treatment centers)
- `webapp_serverside/` – Node.js / Express server (REST API on top of the MySQL database)
  - `server.js` – entry point, mounts the routes
  - `utils/db.js` – MySQL connection pool (`mysql2/promise`)
  - `repositories/` – SQL queries, one file per table
  - `controllers/` – Express routes, one file per entity

## Database
```
mysql -u root -p < data/recycling.sql
```
Test accounts (table `app_user`): every account uses the password `password123` (stored as a bcrypt hash).
Managers: `jvenot`, `aberthelot`, `hdaccache` – drivers: `mdupont`, `cvasseur`, ...

## Run the server
```
cd webapp_serverside
npm install
cp .env.example .env     # then put your MySQL user and password in .env
npm start
```
Check: http://localhost:9000/static/ping.txt and http://localhost:9000/api/treatment-centers

REST API (JSON):
| Resource | Routes |
|---|---|
| `/api/treatment-centers` | `GET /`, `GET /:id`, `GET /:id/collection-points`, `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/collection-points` | `GET /`, `GET /:id`, `GET /:id/collections`, `POST /`, `PUT /:id`, `DELETE /:id` |

Errors come back as `{ "error": "..." }`: 400 invalid data, 404 unknown id, 409 delete refused by a foreign key
(e.g. a treatment center that still has collections).

## Run the frontend
```
cd webapp_clientside
npm install
cp .env.example .env     # VUE_APP_API_URL = address of the server
npm run serve
```
The treatment centers and collection points pages (lists, datasheets, new/edit forms, delete) use the server (MySQL). The waste types and collections pages still use the JSON files of `data/`.
