# Deploying Blood Bank Spring Boot Backend to Koyeb

This backend is pre-configured for one-click or Git-based deployment on **[Koyeb](https://www.koyeb.com)**.

---

## 1. Prerequisites
You will need a cloud MySQL database. You can obtain a free MySQL instance from:
- **Aiven for MySQL** (Free tier available)
- **Clever Cloud** (Free MySQL addon)
- **PlanetScale** / **Railway** / **Amazon RDS**

Note down your MySQL credentials:
- **Host**: e.g., `mysql-your-host.aivencloud.com`
- **Port**: e.g., `12345` (default `3306`)
- **Database**: e.g., `defaultdb` or `bloodbank_db`
- **User**: e.g., `avnadmin` or `root`
- **Password**: your database password

---

## 2. Deploying via Koyeb Console

1. Log into your **[Koyeb Dashboard](https://app.koyeb.com)**.
2. Click **Create Service** -> Select **GitHub**.
3. Choose your repository containing this project.
4. Under **Builder**, select **Dockerfile**.
   - **Root Directory**: Set to `/backend` (or `/` if you pushed the `backend` folder as its own repo).
   - **Dockerfile location**: `Dockerfile`
5. Under **Environment variables**, add:
   | Variable | Value | Notes |
   |---|---|---|
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<host>:<port>/<database>?createDatabaseIfNotExist=true&useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC` | Replace with your MySQL host, port, db |
   | `SPRING_DATASOURCE_USERNAME` | `<username>` | Your MySQL user |
   | `SPRING_DATASOURCE_PASSWORD` | `<password>` | Your MySQL password |
   | `CORS_ALLOWED_ORIGINS` | `*` (or your frontend domain, e.g. `https://your-frontend.vercel.app`) | Allows frontend API calls |
6. Under **Exposed Ports**:
   - Koyeb automatically routes public HTTPS traffic to port `8080`.
7. Click **Deploy**.

---

## 3. Verifying Your Deployment
Once deployed, Koyeb provides a public URL (e.g., `https://blood-bank-api-yourname.koyeb.app`).
You can test the endpoints:
- **Health/Stats**: `GET https://<your-app>.koyeb.app/api/dashboard/stats`
- **Donors list**: `GET https://<your-app>.koyeb.app/api/donors`
- **Inventory**: `GET https://<your-app>.koyeb.app/api/inventory`

---

## 4. Connecting Your React Frontend
In your frontend, update `.env`:
```env
REACT_APP_API_BASE_URL=https://<your-app>.koyeb.app/api
```
The React frontend will immediately route all requests to your live Koyeb Spring Boot backend!
