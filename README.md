## :pushpin: MindMood  
&emsp;MindMood is a mood-based activity tracker that helps users monitor and reflect on their daily emotions and activities.  
Users can log activities by mood category (Calm, Neutral, Stressed), edit and delete entries, and visualize their mood trends over time.  
This project aims to promote mindfulness and improve personal well-being through mood awareness.

---

## :rocket: Getting Started

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/your-username/MindMood.git
   cd MindMood
:hammer: Frontend - React
:wrench: Tech Stack
React

Axios

React Router DOM

Tailwind CSS

:rocket: Getting Started - React Client
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

:wrench: Backend - Hono
:hammer_and_wrench: Tech Stack
Hono

SQLite

Prisma

:electric_plug: API Endpoints
User
Method	Endpoint	Description
POST	/user/createUser	Create an account for a user
GET	/user/getUsername/:userId	Get username of a user based on given user id
PATCH	/user/updateProfile	Update user profile information

Activity
Method	Endpoint	Description
POST	/activity/createActivity	Create a new activity entry
GET	/activity/getActivities/:userId	Get all activities logged by a user
PATCH	/activity/updateActivity/:id	Update an existing activity entry
DELETE	/activity/deleteActivity/:id	Delete an activity entry

Mood
Method	Endpoint	Description
GET	/mood/getMoodStats/:userId	Get mood summary and statistics for a user

:rocket: Getting Started - Backend Server
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

ini
Copy
Edit
DATABASE_URL="file:./dev.db"
Start the development server:

bash
Copy
Edit
npm run dev
The server will be running on http://localhost:8000

vbnet
Copy
Edit
