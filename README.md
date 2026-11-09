# Job Tracker (MERN)

Track job applications: login, add/edit/delete jobs, status (Applied / Interview / Offer / Rejected), search, filter and dashboard counts.

**Stack:** React (Vite), Node.js, Express, MongoDB (Mongoose), JWT, bcrypt

## Features
- Register / Login with JWT authentication (passwords hashed with bcrypt)
- Each user sees only their own jobs
- Full CRUD for job applications
- Change status directly from the list
- Status counts that work as filters, plus search by company or role

## Run locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env   # then fill MONGO_URI and JWT_SECRET
npm run dev
```
You should see "DB connected".

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

## API
| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns token |
| GET | /api/jobs | List my jobs (?status=&search=) |
| GET | /api/jobs/stats | Counts per status |
| POST | /api/jobs | Add job |
| PUT | /api/jobs/:id | Edit job |
| DELETE | /api/jobs/:id | Delete job |

## Deploy
- Backend: Render (set MONGO_URI, JWT_SECRET)
- Frontend: Vercel (set VITE_API_URL to your Render URL + /api)
