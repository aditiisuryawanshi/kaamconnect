# RozgaarSetu - A Bridge to Employment

> **Mumbai Region, Maharashtra, India**  
> *Rozgaar Ka Naya Raasta — Real People. Real Work. Better Opportunities.*

RozgaarSetu is a production-oriented, full-stack web marketplace engineered to connect service professionals, gig seekers, household consumers, and employers across the Mumbai Metropolitan Region.

Unlike single-domain platforms, RozgaarSetu provides three distinct, strictly separated marketplace products on one unified engine:
1. **Task & Hourly Services**: Direct household and commercial services (Electricians, Plumbers, Cleaning, Appliance Repair, Cooking).
2. **Shift & Gig Work**: Temporary, shift-based opportunities with fixed hourly or daily payouts (Event crew, loaders, stage hands, delivery aides).
3. **Long-Term Employment**: Permanent and contract career opportunities with monthly salary ranges (Facility technicians, maintenance managers, drivers).
4. **Safety & Moderation Operations**: Role-based access control, incident reporting, audit logging, and administrative account moderation.

---

## Visual Identity & Design System

The platform features a dignified, vibrant, and accessible Indian marketplace design system:
- **Navy (`#123F73`) & Deep Navy (`#0B2F57`)**: Trust, institutional credibility, and stability.
- **Vibrant Orange (`#FF851B`) & Soft Orange (`#FFF1E5`)**: Energy, optimism, purposeful action highlights, and active states.
- **Clean White (`#FFFFFF`) & Light Grey (`#F5F7FA`)**: Accessible, welcoming background hierarchy.
- **Charcoal (`#253247`) & Slate (`#667085`)**: High-contrast, readable typography.
- **Success Green (`#16845B`)**: Verified status, confirmed bookings, and successful applications.
- **Typography**: Plus Jakarta Sans for headings and brand typography, Inter for body/interface, and Noto Sans Devanagari for Hindi and Marathi localization.
- **Curated Mumbai Context**: 13 initial launch localities spanning Western Suburbs, Central Suburbs, South Central, Thane, and Navi Mumbai.

---

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Tooling**: Vite with strict TypeScript compilation (`tsc -b`)
- **Routing**: React Router 7 with role-based layout guards (`PublicLayout`, `WorkerLayout`, `CustomerLayout`, `EmployerLayout`, `AdminLayout`)
- **State Management**: TanStack Query (React Query) for robust server-state caching and synchronization
- **Forms & Validation**: React Hook Form with Zod schemas
- **Localization**: Multi-language support (English, Hindi हिन्दी, Marathi मराठी) with instant switcher
- **Icons**: Lucide React
- **Design System**: Global design tokens (`tokens.css`) and modular responsive styling (`global.css`)
- **Testing**: Vitest & React Testing Library

### Backend
- **Language & Framework**: Python 3.14 with Flask modular Blueprints (`/api/v1`)
- **Architecture**: Service-layer pattern separating controllers, business validation, and data persistence
- **Security & Auth**: PyJWT for stateless bearer authentication, Werkzeug security for scrypt password hashing, fine-grained RBAC decorators (`@auth_required`, `@roles_required`)
- **Validation**: Pydantic schemas and custom sanitizers (E.164 phone & lowercase email normalizers)
- **Database Access**: PyMongo with MongoDB replica set / Atlas compatibility
- **Testing**: Pytest with unit, integration, and full 8-stage end-to-end user journeys

### Database (MongoDB)
- **Collections**: `users`, `worker_profiles`, `employer_profiles`, `localities`, `service_categories`, `service_listings`, `bookings`, `gigs`, `jobs`, `applications`, `saved_listings`, `reports`, `audit_logs`
- **Indexing**: Unique and compound indexes for fast lookups and atomic constraints (e.g. `[("worker_id", 1), ("listing_type", 1), ("listing_id", 1)]` unique application guarantee).

---

## Quick Launch Scripts (Windows)

Convenient one-click launcher scripts are located in the project root:
- **`start_all.bat`**: Launches both Backend (Port 5000) and Frontend (Port 5173) in dedicated console windows.
- **`start_backend.bat`**: Activates Python virtualenv and starts Flask server.
- **`start_frontend.bat`**: Starts Vite development server with hot module reload.

---

## Local Setup & Development

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)
- **MongoDB** (Local instance on `mongodb://localhost:27017` or MongoDB Atlas URI)

---

### 2. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Environment variables (`backend/.env`):
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DATABASE=rozgaarsetu
   SECRET_KEY=rozgaarsetu-dev-super-secret-key-2026-mumbai
   JWT_SECRET_KEY=rozgaarsetu-dev-super-secret-key-2026-mumbai
   FRONTEND_ORIGIN=http://localhost:5173
   FLASK_ENV=development
   PORT=5000
   ```

5. Seed database with Mumbai localities, service categories, and demo accounts:
   ```bash
   python seed.py
   ```

6. Start the Flask backend server:
   ```bash
   python run.py
   ```
   *The backend will be live at `http://127.0.0.1:5000` with health check at `http://127.0.0.1:5000/api/health`.*

---

### 3. Frontend Setup

1. Open a separate terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will launch at `http://localhost:5173`. API requests to `/api` are automatically proxied to `http://127.0.0.1:5000`.*

---

## Pre-Seeded Demo Accounts

All demo accounts share the password: **`DemoPassword123`**

| Role | Email | Name | Capabilities |
| :--- | :--- | :--- | :--- |
| **Worker** | `worker@demo.rozgaarsetu.in` | Ramesh Shinde | Offer services, view incoming bookings, apply to gigs & jobs, profile wizard |
| **Worker 2** | `worker2@demo.rozgaarsetu.in` | Sunita Kamble | Deep cleaning specialist, view services and shift schedules |
| **Customer** | `customer@demo.rozgaarsetu.in` | Pooja Sharma | Search Mumbai services, book professionals, track bookings, file safety reports |
| **Employer** | `employer@demo.rozgaarsetu.in` | Vikram Sethi | Post shift gigs, post long-term jobs, manage applicants, shortlist & select candidates |
| **Admin** | `admin@demo.rozgaarsetu.in` | Admin RozgaarSetu | Moderation queue, user suspension/reactivation, safety reports, system audit logs |

---

## Mumbai Localities & Categories

### Supported Launch Localities
1. **Andheri** (Western Suburbs)
2. **Bandra** (Western Suburbs)
3. **Borivali** (Western Suburbs)
4. **Dahisar** (Western Suburbs)
5. **Goregaon** (Western Suburbs)
6. **Malad** (Western Suburbs)
7. **Kandivali** (Western Suburbs)
8. **Kurla** (Central Suburbs)
9. **Powai** (Central Suburbs)
10. **Ghatkopar** (Central Suburbs)
11. **Dadar** (South Central)
12. **Thane** (Thane Region)
13. **Navi Mumbai** (Navi Mumbai Region)

### Service Categories
1. **Home Cleaning** (Deep cleaning, sanitization)
2. **Plumbing** (Pipe repairs, fixtures, drainage)
3. **Electrical Work** (Wiring, MCB, inverter setups)
4. **Appliance Repair** (AC, refrigerators, washing machines)
5. **Cooking Help** (Daily meals, Maharashtrian, North/South Indian)
6. **Beauty & Personal Care** (Home salon, grooming)
7. **Moving & Loading** (Shifting labor, carton packing)
8. **Other Services** (Carpentry, handyman work)

---

## Automated Verification & Testing

### 1. Backend Test Suite
Run unit, integration, and RBAC tests:
```bash
cd backend
python -m pytest tests
```
*Status: 10/10 tests passing.*

### 2. End-to-End User Journeys
Execute the automated end-to-end journey script against the live server:
```bash
cd backend
python tests/test_e2e_journeys.py
```
This executes the 8 complete platform journeys:
- **Journey 1 & 2**: Worker posts service -> Customer discovers service in Powai -> Customer books appointment -> Worker accepts -> Worker starts -> Worker completes booking.
- **Journey 3**: Worker completes multi-step profile onboarding wizard (attains 80%+ profile score).
- **Journey 4**: Employer posts shift gig with 1 opening -> Worker applies -> Employer reviews applicants -> Employer shortlists -> Employer selects worker -> **Openings atomically decrement to 0**.
- **Journey 5 & 6**: Employer posts full-time job -> Worker applies with cover note -> Employer records confidential internal interview notes -> **Privacy check verifies notes are never leaked to applicant**.
- **Journey 7**: Security boundary enforcement -> Customer attempting employer actions receives `403 Forbidden` -> User attempting to access another user's private booking receives `403 Forbidden`.
- **Journey 8**: Customer submits safety report -> Admin reviews dashboard analytics -> Admin resolves report -> Action logged in persistent audit trail.

### 3. Frontend Tests & Build
```bash
cd frontend
# Unit & component tests
npm test

# TypeScript validation & production bundle
npm run build
```

---

## Production Deployment Guide

### Frontend (Vercel)
1. Push repository to GitHub.
2. In Vercel, import the repository and select `frontend/` as Root Directory.
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: Production backend URL (e.g., `https://api.rozgaarsetu.in`)

### Backend (Render or Railway)
1. Select `backend/` as Root Directory.
2. Configure runtime:
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT run:app`
3. Set Environment Variables:
   - `MONGODB_URI`: Production MongoDB Atlas connection URI (`mongodb+srv://<user>:<password>@cluster0.mongodb.net/rozgaarsetu?retryWrites=true&w=majority`)
   - `JWT_SECRET_KEY`: High-entropy 256-bit secret string
   - `FLASK_ENV`: `production`

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster in `ap-south-1` (Mumbai).
2. Configure Network Access to allow Render/Railway IP ranges.
3. Create database user credentials.
4. Run index initialization by running `seed.py` once against the Atlas URI.

---

## License & Ownership

Developed with pride for the Mumbai workforce and households. All rights reserved.
