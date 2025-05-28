## :brain: MindMood  
&emsp;MindMood is a mood-based activity tracker that helps users monitor and reflect on their daily emotions and activities.  
Users can log activities by mood category (Calm, Neutral, Stressed), edit and delete entries, and visualize their mood trends over time.  
This project aims to promote mindfulness and improve personal well-being through mood awareness.

---

## :point_right: Getting Started

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/your-username/G13_MindMood.git
   cd G13_MindMood

##:robot: Frontend - React

React

Axios

React Router DOM

Tailwind CSS

Getting Started - React Client
1.Navigate to the frontend directory:
 ```bash
cd frontend
   ```
2.Navigate to the frontend directory:
 ```bash
npm install
   ```
3.Create a .env file and configure the following variables:
 ```bash
DATABASE_URL="file:./dev.db"
 ```
4.Start the development server:
 ```bash
npm run dev
 ```
5.The server will be running on:
 ```bash
(http://localhost:5173)
 ```

### :wrench: Backend - Hono
### :hammer_and_wrench: 
Tech Stack
Hono
SQLite
Prisma

### :electric_plug: API Endpoints
### User
| Method      |	     Endpoint             |	     Description                           |
|-------------|-----------------------------|----------------------------------------------|
|POST         |	/user/createUser	        |Create an account for a user                  |
|GET          |	/user/getUsername/:userId |Get username of a user based on given user id |
|PATCH        |	/user/updateProfile	     |Update user profile information               |

Activity
Method	Endpoint	Description
POST	/activity/createActivity	Create a new activity entry
GET	/activity/getActivities/:userId	Get all activities logged by a user
PATCH	/activity/updateActivity/:id	Update an existing activity entry
DELETE	/activity/deleteActivity/:id	Delete an activity entry

Mood
Method	Endpoint	Description
GET	/mood/getMoodStats/:userId	Get mood summary and statistics for a user

