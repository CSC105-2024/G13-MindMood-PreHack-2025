## CRUD
### Create
  -Add picture profile
  
  -Activity name
  
  -Register
  ### Read
  -Calculate mood
  
  -User ID
  
  -SigninUser
  ### Update
  -ResetUserpassword
  
  -Edit Activity

  -Edit Activity Status
  ### Delete
  -Delete Activity

## How to run
### Frontend

cd Frontend
npm i
npm run dev

## How to run
### Backend

cd Backend
npm i
npm run dev

`POST /auth/signup`
{
  "username": "example",
  "email": "example@example.com",
  "password": "yourpassword"
}
```POST /auth/forgot-password`
```json
{
  "email": "example@example.com"
}
```POST /auth/login`
```json
{
  "email": "example@example.com",
  "password": "yourpassword"
}
```POST /auth/reset-password/:token`
```json
{
  "password": "yournewpassword"
}
```GET /auth/user/:id`

**Response:**
```json
{
  "status": true,
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}

### Add Activity
`POST /activity`

{
  "name": "Read a book",
  "mood": "Calm",
  "week": 1,
  "day": 1
}

**Response:**
```json
{
  "message": "Activity created successfully",
  "activity": {
    "id": 1,
    "name": "Read a book",
    "mood": "Calm",
    "week": 1,
    "day": 1,
    "userId": 1
  }
}
```
### Get Activity by Date
`GET /activity`

**Response:**
```json
{
  "activity": [
    {
      "id": 1,
      "name": "Read a book",
      "mood": "Calm",
      "completed": false,
      "week": 2,
      "day": 3
    }
  ]
}
```
### Update Activity
`PUT activity/:id`

{
  "name": "Yoga",
  "mood": "Calm",
  "completed": true
}

**Response:**
```json
{
  "message": "Activity updated successfully",
  "activity": {
    "id": 1,
    "name": "Yoga",
    "mood": "Calm",
    "completed": true
  }
}
```

 `DELETE activity/:id`

**Submit Day**

`POST /activity/submit`
{
  "week": 2,
  "day": 3
}
**Response:**
```json
{
  "message": "Day submitted successfully",
  "summary": {
    "week": 2,
    "day": 3,
    "totalActivities": 3,
    "moodCounts": {
      "calm": 2,
      "neutral": 1,
      "stressed": 0
    },
    "moodPercentages": {
      "calm": 67,
      "neutral": 33,
      "stressed": 0
    },
    "overallMood": "Calm",
    "overallMessage": "Great job! You had a mostly calm and peaceful day.",
    "activities": [
      {
        "name": "Yoga",
        "mood": "Calm",
        "completed": true
      },
      ...
    ]
  }
}
 
**Get Submission**
`GET activity/submission`

**Response:**
```json
{
  "submission": {
    "week": 2,
    "day": 3,
    "overallMood": "Calm",
    "overallMessage": "...",
    "totalActivities": 3,
    ...
  }
}

**Clear Day**
`POST activity/clear-day`

{
  "week": 2,
  "day": 3
}

**Response:**
```json
{
  "message": "Cleared 3 activities for Week 2, Day 3",
  "deletedActivities": 3,
  "submissionCleared": true
}

**Clear All Data**
`DELETE activity/clear-all`

**Response:**
```json
{
  "message": "All activities and submissions cleared successfully",
  "deletedActivities": 21,
  "deletedSubmissions": 7
}