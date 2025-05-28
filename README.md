## :brain: MindMood  
MindMood is a mood-based activity tracker that helps users monitor and reflect on their daily emotions and activities.  
Users can log activities by mood category (Calm, Neutral, Stressed), edit and delete entries, and visualize their mood trends over time.  
This project aims to promote mindfulness and improve personal well-being through mood awareness.

---

## :point_right: Getting Started

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/your-username/G13_MindMood.git
   cd G13-MindMood-PreHack-2025


## :robot: Frontend - React

React

Axios

React Router DOM

Tailwind CSS

Getting Started - React Client
1.Navigate to the frontend directory:
 ```bash
cd Frontend
   ```
2.Navigate to the frontend directory:
 ```bash
npm install
   ```

3.Start the development server:
 ```bash
npm run dev
 ```
4.The server will be running on:
 ```bash
(http://localhost:5173)
 ```

### :wrench: Backend - Hono
### :hammer_and_wrench: 
Tech Stack
Hono
SQLite
Prisma

### :robot: API Endpoints
### User
| Method | Endpoint               | Description                               |
|--------|------------------------|-------------------------------------------|
| POST   | /user/createUser       | Create a new user account                  |
| GET    | /user/getUsername/:userId | Retrieve username by user ID               |
| PATCH  | /user/updateProfile    | Update user profile information            |

### Activity
| Method | Endpoint                      | Description                                 |
|--------|-------------------------------|---------------------------------------------|
| POST   | /activity/                    | Create a new activity                        |
| GET    | /activity/                    | Get activities by week and day (query params: week, day) |
| GET    | /activity/all                 | Get all activities for the authenticated user |
| PUT    | /activity/:id                 | Update an activity by ID                     |
| DELETE | /activity/:id                 | Delete an activity by ID                     |
| POST   | /activity/clear-day           | Clear all activities for a specific week and day (body: week, day) |
| POST   | /activity/clear-all           | Clear all activities and submissions for the authenticated user |

### Submission (Mood Summary)
| Method | Endpoint                       | Description                                |
|--------|-------------------------------|--------------------------------------------|
| POST   | /activity/submit               | Submit the day and generate mood summary (body: week, day) |
| GET    | /activity/submission           | Get submission (mood summary) for a specific day (query params: week, day) |
| GET    | /activity/submissions/all      | Get all mood submissions for the authenticated user |


## :robot: Backend Server Setup
Node.js
Hono Framework
Prisma ORM
SQLite Database

Getting Started - React Client
1.Navigate to the backend directory:
 ```bash
cd Backend
   ```
2.Navigate to the backend directory:
 ```bash
npm install
   ```
3.Create a .env file and configure the following variables:
 ```bash
DATABASE_URL={Your database connection string}
SHADOW_DATABASE_URL={Your shadow database connection string}
 ```
4.Run database migrations (if applicable):
 ```bash
npx prisma migrate dev
 ```
5.Generate Prisma client:
 ```bash
npx prisma generate
 ```
6.Start the development server:
 ```bash
npm run dev
 ```
7.The server will be running on::
 ```bash
(http://localhost:3000)
 ```
