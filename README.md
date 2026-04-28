# ecommerce-app

This repository contains a simple multi-container ecommerce demo with three services:

- frontend: React app served by nginx (port 3000 on host)
- backend: Node/Express API (port 5000 on host)
- mongo: MongoDB (27017 on host)

Top-level files:

- `docker-compose.yml` - Compose file to run all services
- `backend/` - Node/Express backend (server.js, config, models, routes)
- `frontend/` - React frontend (create-react-app structure)

Run locally (from repo root):

```bash
docker-compose up --build
```

Service endpoints after startup:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017 (data persisted in Docker volume)

Notes:
- Backend uses `MONGO_URI` environment variable; Compose sets it to `mongodb://mongo:27017/relationshipDB`.
- To push this repository to GitHub, create a remote and run `git push -u origin main`.
