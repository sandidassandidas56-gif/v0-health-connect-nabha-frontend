# HealthConnect Nabha frontend

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/xpressotaku-3360s-projects/v0-health-connect-nabha-frontend)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/fapf7AzoFDu)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/xpressotaku-3360s-projects/v0-health-connect-nabha-frontend](https://vercel.com/xpressotaku-3360s-projects/v0-health-connect-nabha-frontend)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/fapf7AzoFDu](https://v0.app/chat/projects/fapf7AzoFDu)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

# Project Setup: Frontend & Backend

## Folder Structure
- `frontend/` — Next.js app (UI, pages, API calls)
- `backend/` — Node.js/Express/MongoDB API, models, signaling server

## How to Run

### 1. Backend
- Go to the backend folder:
  ```
  cd backend
  ```
- Install dependencies (if package.json exists):
  ```
  npm install
  ```
- Start the backend server (adjust command as needed):
  ```
  node signaling-server.js
  # or
  npm start
  ```

### 2. Frontend
- Open a new terminal and go to the frontend folder:
  ```
  cd frontend
  ```
- Install dependencies:
  ```
  npm install
  ```
- Start the Next.js dev server:
  ```
  npm run dev
  ```

## API URLs
- Update your frontend API calls to use the backend base URL (e.g., `http://localhost:3001/api/...`).
- You can set this in a `.env.local` file in `frontend/`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3001
  ```
- In your frontend code, use `process.env.NEXT_PUBLIC_API_URL` for API requests.

## Notes
- Make sure both servers are running for full functionality.
- Adjust ports as needed in your backend and frontend configs.
- For WebRTC/signaling, ensure the signaling server URL matches in both frontend and backend code.

---
For further help, see README files in each folder or ask for specific integration help.
