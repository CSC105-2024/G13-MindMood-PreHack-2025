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

Zustand

🚀 Getting Started - React Client
Navigate to the frontend directory:

bash
Copy
Edit
cd frontend
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

ts
Copy
Edit
app.route('/api/auth', authRoutes);
app.route('/api/activities', activityRoutes);
app.route('/api/moods', moodRoutes);
✨ Note: Each route module handles the respective logic for user authentication, activity CRUD, and mood stats.

🧭 Auth (/api/auth)
POST /signup - Register a new user

POST /login - Authenticate and receive token

GET /me - Get current user info (requires auth)

🗂️ Activities (/api/activities)
POST /create - Create a new activity

GET /all/:userId - Fetch all user activities

PATCH /update/:id - Update an activity

DELETE /delete/:id - Delete an activity

📊 Mood Stats (/api/moods)
GET /stats/:userId - Get mood stats summary for a user

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
The server will be available at http://localhost:8000

