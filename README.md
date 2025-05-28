# 🧠 MindMood

Track your daily activities with moods, visualize progress, and stay mindful.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/your-username/mindmood.git
cd mindmood

🚀 Getting Started
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/MindMood.git
cd MindMood
💻 Frontend - React
🛠️ Tech Stack
React

Axios

React Router DOM

Tailwind CSS


🚀 Getting Started - React Client
Navigate to the frontend directory:

bash
Copy
Edit
cd Frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm run dev
The client will be running on http://localhost:5173

⚙️ Backend - Hono
🧰 Tech Stack
Hono

SQLite (via Prisma)

JWT

Bcrypt

🔌 API Routes
All backend routes are organized and mounted as follows:

Health Check
GET /health
Description: Checks if the server is running.

Example URL: http://localhost:3000/health

Authentication Routes
Base Path: /auth

POST /auth/signup
Description: User registration.

Example URL: http://localhost:3000/auth/signup

POST /auth/login
Description: User login.

Example URL: http://localhost:3000/auth/login

POST /auth/forgot-password
Description: Request a password reset.

Example URL: http://localhost:3000/auth/forgot-password

POST /auth/reset-password/:token
Description: Reset password using a token.

Example URL: http://localhost:3000/auth/reset-password/YOUR_RESET_TOKEN

GET /auth/profile
Description: Get user profile information. (Requires authentication)

Example URL: http://localhost:3000/auth/profile

PUT /auth/update-profile
Description: Update user profile information. (Requires authentication)

Example URL: http://localhost:3000/auth/update-profile

GET /auth/verify-token
Description: Verify an authentication token. (Requires authentication)

Example URL: http://localhost:3000/auth/verify-token

Activity Routes
Base Path: /api/activities

POST /api/activities/
Description: Create a new activity.

Example URL: http://localhost:3000/api/activities/

GET /api/activities/
Description: Get activities by date. (Likely expects query parameters for the date)

Example URL: http://localhost:3000/api/activities/?date=YYYY-MM-DD

GET /api/activities/all
Description: Get all activities.

Example URL: http://localhost:3000/api/activities/all

PUT /api/activities/:id
Description: Update an existing activity by its ID.

Example URL: http://localhost:3000/api/activities/ACTIVITY_ID

DELETE /api/activities/:id
Description: Delete an activity by its ID.

Example URL: http://localhost:3000/api/activities/ACTIVITY_ID

POST /api/activities/submit
Description: Submit activities for a day.

Example URL: http://localhost:3000/api/activities/submit

GET /api/activities/submission
Description: Get submission by date. (Likely expects query parameters for the date)

Example URL: http://localhost:3000/api/activities/submission?date=YYYY-MM-DD

GET /api/activities/submissions/all
Description: Get all submissions.

Example URL: http://localhost:3000/api/activities/submissions/all

POST /api/activities/clear-day
Description: Clear all activities for a specific day.

Example URL: http://localhost:3000/api/activities/clear-day

POST /api/activities/clear-all
Description: Clear all activities and submissions for a user.

Example URL: http://localhost:3000/api/activities/clear-all

🚀 Getting Started - Node.js Server
Navigate to the backend directory:

bash
Copy
Edit
cd backend
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file and configure the environment:

env
Copy
Edit
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret"
Apply Prisma migrations:

bash
Copy
Edit
npx prisma migrate dev --name init
Start the backend server:

bash
Copy
Edit
npm run dev
The server will be available at http://localhost:3000

