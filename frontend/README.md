# Blood Bank - Modern Frontend Application

A full-featured modern React healthcare web app for voluntary blood donors, hospital emergency requests, and blood inventory management.

---

## 🚀 Quick Start (Local Development)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000`.

---

## 🌐 Deploy to Vercel / Netlify / Koyeb

### Option A: Deploy to Vercel or Netlify (Recommended for Frontend)
1. Push this `frontend` folder to GitHub.
2. In Vercel or Netlify, import the repository.
3. Build command: `npm run build`
4. Output directory: `build`
5. Environment Variable:
   ```env
   REACT_APP_API_BASE_URL=https://<your-koyeb-backend-url>.koyeb.app/api
   ```

### Option B: Deploy to Koyeb using Docker
1. In Koyeb, create a service from GitHub.
2. Set root directory to `/frontend`.
3. Koyeb will automatically detect `frontend/Dockerfile` and deploy the Nginx production build on port 80.
4. Set environment variable `REACT_APP_API_BASE_URL` to your backend URL.
