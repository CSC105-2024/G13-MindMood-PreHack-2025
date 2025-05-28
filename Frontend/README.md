MindMood
A full-stack mood-based activity tracker that helps users log and reflect on their daily moods through activities. Built using React, Hono, Prisma, and SQLite.

🚀 Getting Started
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/MindMood.git
cd MindMood
🔮 Frontend - React
🔧 Tech Stack
React

Axios

React Router DOM

Tailwind CSS

Vite

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
The client will be running on:
👉 http://localhost:5173

🧠 Backend - Hono
🔧 Tech Stack
Hono (Web Framework)

Prisma (ORM)

SQLite (Database)

JWT (Authentication)

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
Create a .env file and configure the following variables:

env
Copy
Edit
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
Run Prisma migrations:

bash
Copy
Edit
npx prisma migrate dev --name init
Start the development server:

bash
Copy
Edit
npm run dev
The server will be running on:
👉 http://localhost:8000

🔌 API Endpoints
👤 User
Method	Endpoint	Description
POST	/auth/signup	Create a new user
POST	/auth/login	Log in and get JWT token
GET	/auth/me	Get current authenticated user info

✅ Activities
Method	Endpoint	Description
POST	/api/activities	Create an activity
GET	/api/activities?week=&day=	Get activities for a specific week and day
PUT	/api/activities/:id	Update an activity (name, mood, completed)
DELETE	/api/activities/:id	Delete a specific activity
POST	/api/activities/clear-day	Clear all activities for a given day
DELETE	/api/activities/clear-all	Delete all activities and submissions

📊 Submission
Method	Endpoint	Description
POST	/api/submit	Submit a day's activities and generate mood summary







You said:
activity shouldbe like this


ChatGPT said:
Got it! Here's an updated version of the README.md with the Activities section formatted just like your example — grouped with endpoint methods, paths, and clean descriptions in a table style:

🔌 API Endpoints
👤 User
Method	Endpoint	Description
POST	/auth/signup	Create a new user account
POST	/auth/login	Log in and receive a JWT token
GET	/auth/me	Get authenticated user information

📅 Activity
Method	Endpoint	Description
POST	/api/activities	Create a new activity
GET	/api/activities?week=&day=	Get activities for a specific week and day
PUT	/api/activities/:activityId	Update an activity's name, mood, or completion status
DELETE	/api/activities/:activityId	Delete a specific activity
POST	/api/activities/clear-day	Clear all activities for a specific day (requires date & week)
DELETE	/api/activities/clear-all	Delete all activities and submissions for the user

🧾 Submission
Method	Endpoint	Description
POST	/api/submit	Submit all activities for a day and generate summary
GET	/api/submissions	Get all submissions for the logged-in user