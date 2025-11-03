# Role-Based Authentication System

A production-ready Next.js application with role-based access control (RBAC), featuring user authentication, role-specific dashboards, and secure API endpoints.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start Guide](#quick-start-guide)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Project Setup](#project-setup)
- [Running the Application](#running-the-application)
- [Features](#features)
- [User Roles](#user-roles)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.x or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- A **MongoDB Atlas account** (free tier available)

## Quick Start Guide

1. **Clone or download the project**
2. **Set up MongoDB Atlas** (see detailed instructions below)
3. **Install dependencies**: `npm install`
4. **Configure environment variables** in `.env.local`
5. **Start the development server**: `npm run dev`
6. **Open your browser**: `http://localhost:3000`

---

## MongoDB Atlas Setup

MongoDB Atlas is a cloud-hosted MongoDB service that offers a free tier perfect for development and testing.

### Step 1: Create a MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with your email address or use Google/GitHub authentication
4. Verify your email address if required

### Step 2: Create a New Cluster

1. After logging in, you'll see the **Atlas Dashboard**
2. Click **"Build a Database"** or **"Create"** → **"Create Deployment"**
3. Choose the **FREE (M0)** tier (Free Forever option)
4. Select a **Cloud Provider** (AWS, Google Cloud, or Azure) and a **Region** closest to you
5. Click **"Create Deployment"**
6. Wait 3-5 minutes for the cluster to be created

### Step 3: Create Database User

1. You'll be prompted to create a database user
2. Enter a **Username** (e.g., `db_user`)
3. Enter a strong **Password** (save this - you'll need it!)
   - Click **"Autogenerate Secure Password"** if you want Atlas to create one
4. Select **"Database User"** privileges
5. Click **"Create Database User"**
6. **Important**: Save the username and password securely!

### Step 4: Configure Network Access

1. You'll be prompted to add your IP address
2. For development, you can:
   - **Option A**: Click **"Add My Current IP Address"** (recommended for testing)
   - **Option B**: Click **"Allow Access from Anywhere"** and enter `0.0.0.0/0`
     - ⚠️ **Warning**: This is less secure but allows access from any location
     - Only use this for development/testing
3. Click **"Add Access List Entry"** or **"Finish and Close"**

### Step 5: Get Your Connection String

1. Click **"Connect"** button on your cluster
2. Select **"Connect your application"**
3. Choose **"Driver"** as `Node.js` and **"Version"** as `5.5 or later`
4. Copy the connection string - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace the placeholders**:
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Remove any `< >` brackets

**Example:**
```
mongodb+srv://db_user:MySecurePassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Save this connection string - you'll use it in the next step!

### Step 6: Optional - Create a Database

- MongoDB Atlas will automatically create the database when you first connect
- The database name will be `role_auth` as configured in `.env.local`
- You don't need to create it manually

---

## Project Setup

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages. Wait for it to complete (may take 2-5 minutes).

### Step 2: Create Environment Variables File

1. Locate the `.env.local` file in the root directory
2. If it doesn't exist, create a new file named `.env.local`

### Step 3: Configure Environment Variables

Open `.env.local` and add the following configuration:

```env
# MongoDB Atlas Connection String
# Replace with your actual MongoDB Atlas connection string from Step 5
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Database Name (can be changed if needed)
MONGODB_DB=role_auth

# JWT Secret - Generate a secure random string
# Generate one using: openssl rand -base64 32
# Or use an online generator: https://randomkeygen.com/
JWT_SECRET=your-secure-random-string-here-minimum-32-characters

# App URL (for local development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Configuration Steps:**

1. **MONGODB_URI**: 
   - Paste your MongoDB Atlas connection string from Step 5
   - Make sure username and password are correct
   - The connection string should not have `< >` brackets

2. **JWT_SECRET**:
   - Generate a secure random string
   - **Option A** (Command Line): Run `openssl rand -base64 32`
   - **Option B** (Online): Visit [https://randomkeygen.com/](https://randomkeygen.com/) and copy a long random string
   - Minimum 32 characters recommended
   - **Never share this secret** - it's used for encryption

3. **MONGODB_DB**: 
   - Leave as `role_auth` (or change to your preferred database name)

4. **NEXT_PUBLIC_APP_URL**: 
   - Leave as is for local development
   - Change when deploying to production

**Example `.env.local` file:**
```env
MONGODB_URI=mongodb+srv://db_user:MyPassword123@cluster0.yght980.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=role_auth
JWT_SECRET=aB3$kL9mN2pQ5rS8tU1vW4xY7zA0cD6eF9gH2jK5mN8pQ1rS4tU7vW0xY3zA6
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Running the Application

### Start Development Server

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

### Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the application homepage

### First-Time Setup

1. **Sign Up**: Click "Sign Up" or navigate to `/signup`
2. **Create an Account**: 
   - Enter your name, email, and password
   - Select a role (Client, HR, or Admin)
   - Click "Create Account"
3. **Login**: After signing up, you'll be redirected to login
4. **Access Dashboard**: Once logged in, you'll see your role-specific dashboard

---

## Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt
- Session management

### 👥 Role-Based Access Control
- Three user roles: **Client**, **HR**, and **Admin**
- Role-specific dashboards and permissions
- Protected routes with middleware
- Automatic redirects based on user role

### 📊 Dashboards
- **Client Dashboard**: View available HR personnel, contact HR members
- **HR Dashboard**: View clients who have contacted you
- **Admin Dashboard**: Full access to view all users and contacts

### 🔗 Contact System
- Clients can contact HR members
- One-to-one contact relationships (unique pairs)
- Contact history tracking

---

## User Roles

### Client
- Can view list of available HR personnel
- Can contact HR members (one contact per HR)
- Can view their own contact history
- Access: `/dashboard/client`

### HR (Human Resources)
- Can view list of clients who have contacted them
- Can see contact requests
- Access: `/dashboard/hr`

### Admin
- Full system access
- Can view all users (clients, HR, and other admins)
- Can view all contacts
- Can access all dashboards
- Access: `/dashboard/admin`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

---

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: bad auth"**
- Check your username and password in the connection string
- Verify the database user credentials in MongoDB Atlas
- Make sure there are no spaces or special characters encoded incorrectly

**Error: "MongooseServerSelectionError: getaddrinfo ENOTFOUND"**
- Check your internet connection
- Verify the cluster name in the connection string is correct
- Check if your IP address is whitelisted in MongoDB Atlas Network Access

**Error: "Connection timeout"**
- Add `0.0.0.0/0` to Network Access in MongoDB Atlas (for development only)
- Check firewall settings
- Verify your MongoDB Atlas cluster is running (green status in dashboard)

### Application Won't Start

**Error: "Missing environment variable: JWT_SECRET"**
- Make sure `.env.local` file exists in the root directory
- Verify all environment variables are set
- Check for typos in variable names (must be exact: `MONGODB_URI`, `JWT_SECRET`, etc.)

**Error: "Port 3000 is already in use"**
- Stop any other application using port 3000
- Or change the port: `npm run dev -- -p 3001`

### Login/Signup Issues

**Cannot create account**
- Verify MongoDB connection is working
- Check browser console for errors
- Ensure all required fields are filled
- Password must be at least 6 characters

**Cannot login after signup**
- Check MongoDB connection
- Verify user was created in MongoDB Atlas (check Collections)
- Clear browser cookies and try again

### Database/Collection Issues

**Collections not appearing**
- Collections are created automatically when you first use them
- After signup/login, check MongoDB Atlas → Collections
- You should see `users` and `contacts` collections

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` |
| `MONGODB_DB` | ❌ No | Database name (default: `role_auth`) | `role_auth` |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT signing (min 32 chars) | `aB3$kL9mN2pQ5rS8tU1vW4xY7zA0cD6eF9gH2jK5mN` |
| `NEXT_PUBLIC_APP_URL` | ❌ No | Base URL for the app | `http://localhost:3000` |

---

## Project Structure

```
nextjs-rbac-auth-system-main/
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Role-specific dashboards
│   │   ├── login/            # Login page
│   │   └── signup/           # Signup page
│   ├── components/           # React components
│   ├── lib/                  # Utility functions (auth, db)
│   ├── models/               # MongoDB models
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── .env.local                # Environment variables (create this)
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit `.env.local`** to version control (it's in `.gitignore`)
2. **Keep JWT_SECRET secure** - don't share it publicly
3. **Use strong passwords** for MongoDB Atlas database users
4. **Restrict Network Access** in production (only allow specific IPs)
5. **Use environment variables** for all sensitive configuration
6. **Change default secrets** before deploying to production

---

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Verify your MongoDB Atlas setup matches the instructions
3. Check the browser console for errors (F12)
4. Check terminal output for server errors
5. Verify all environment variables are set correctly

---

## Next Steps

After setting up the application:

1. ✅ Create your first account (sign up)
2. ✅ Test login functionality
3. ✅ Explore role-specific dashboards
4. ✅ Test the contact system (as a Client, contact an HR)
5. ✅ Try different user roles to see different views

---

**Happy coding! 🚀**
