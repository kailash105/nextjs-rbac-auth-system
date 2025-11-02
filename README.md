## Role-Based Auth System (MERN + Next.js)

Production-ready authentication and authorization platform using Next.js App Router, MongoDB (Mongoose), JWT (httpOnly cookies), and ShadCN UI components.

### Features
- Role-specific dashboards (`client`, `hr`, `admin`) with middleware enforcement
- JWT authentication stored in secure httpOnly cookies and verified on server/middleware
- MongoDB models for `User` and `Contact` interactions with unique client ↔ HR pairs
- ShadCN-inspired UI components (Button, Card, Badge, etc.) for consistent styling
- RESTful API routes for signup/login, user discovery, and contact tracking
- SSR redirects for protected routes with reusable `withAuth` helper

### Tech Stack
- Next.js 16 (App Router, TypeScript)
- MongoDB + Mongoose
- JWT via `jsonwebtoken`/`jose`
- Tailwind CSS + ShadCN component patterns
- Deployment ready for Vercel (frontend) and Render/Atlas (database)

### Local Setup
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in values.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`.

### Environment Variables
| Name | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name (defaults to `role_auth`) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `NEXT_PUBLIC_APP_URL` | Base URL for the app (used in deployment guides) |

### Demo Accounts
Use these seeds for quick testing after signup:
- Client: `client@example.com` / password of your choice
- HR: `hr@example.com`
- Admin: `admin@example.com`

> Tip: create accounts via `/signup` selecting the role needed.

### Deployment

**Frontend (Vercel)**
1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Add the environment variables from `.env.example` (use production MongoDB + secret).
4. Deploy; Next.js API routes run serverless on Vercel.

**Database (MongoDB Atlas or Render)**
1. Create a MongoDB Atlas cluster (or Render managed Mongo instance).
2. Whitelist Vercel IP ranges or set `0.0.0.0/0` (for testing only).
3. Create database user credentials and update `MONGODB_URI`.

**Optional Backend Worker (Render)**
- If you prefer isolating API routes, deploy the Next.js app on Render (Node build) and point Vercel frontend to it via `NEXT_PUBLIC_APP_URL`.

### Testing Checklist
- ✅ Signup + login flows per role (client/hr/admin)
- ✅ Middleware redirects unauthorized access
- ✅ Client can contact HR once, HR sees inbound clients, Admin sees all
- ✅ Logout clears httpOnly session cookie

### Scripts
- `npm run dev` – start Next.js in development
- `npm run build` – create production build
- `npm run start` – start production server
- `npm run lint` – run ESLint checks

### Project Structure
```
src/
 ├─ app/
 │   ├─ login/
 │   ├─ signup/
 │   ├─ dashboard/{client,hr,admin}/
 │   └─ api/
 ├─ components/
 ├─ lib/
 ├─ models/
 └─ types/
```

### Support
For improvements or issues, open a PR or create an issue in your repository fork.
