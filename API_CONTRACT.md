# Dualo — REST API Contract v1.0

This document defines the HTTP API routes, JSON request bodies, and response schemas expected by the React TypeScript client (`client/`).

* **Base URL:** `https://api.dualo.app/api/v1`
* **Content-Type:** `application/json`
* **Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication & Security Gate

### 1.1 Request OTP / Dispatch Code
`POST /auth/request-otp`

Dispatches a 6-digit OTP code to a mobile phone number or email address.

**Request Body:**
```json
{
  "method": "PHONE", // "PHONE" | "EMAIL"
  "target": "+15550001122" // E.164 phone string or email address
}
Response (200 OK):

JSON
{
  "success": true,
  "message": "OTP verification code dispatched.",
  "expiresInSeconds": 300
}
1.2 Verify OTP Code
POST /auth/verify-otp

Validates 6-digit OTP code and returns a user session token.

Request Body:

JSON
{
  "target": "+15550001122",
  "otpCode": "123456"
}
Response (200 OK):

JSON
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_9912",
    "fullName": "Alex Johnson",
    "handle": "@alex_swapper",
    "isPhoneVerified": true
  }
}
2. Member Profile & Skill Matrix
2.1 Fetch Current User Profile
GET /profile/me

Response (200 OK):

JSON
{
  "id": "usr_me",
  "fullName": "Alex Johnson",
  "handle": "@alex_swapper",
  "headline": "Frontend Lead & Creative Technologist",
  "bio": "Building Dualo in Swiss Modern style.",
  "location": "San Francisco, CA",
  "phoneNumber": "+1 (555) 019-2834",
  "isPhoneVerified": true,
  "streakDays": 7,
  "totalSwaps": 12,
  "skillsOffered": ["React / Next.js", "TypeScript", "Tailwind CSS"],
  "skillsWanted": ["Node.js & APIs", "PostgreSQL", "Docker & DevOps"]
}
2.2 Update Profile & Skill Matrix
PATCH /profile/me

Request Body:

JSON
{
  "fullName": "Alex Johnson",
  "headline": "Senior Frontend Developer",
  "bio": "Updated bio pitch text here.",
  "location": "San Francisco, CA",
  "skillsOffered": ["React / Next.js", "TypeScript", "GraphQL"],
  "skillsWanted": ["Node.js & APIs", "PostgreSQL"]
}
Response (200 OK):

JSON
{
  "success": true,
  "message": "Profile matrix updated successfully."
}
3. Discovery Deck & Swiping
3.1 Fetch Feed Card Deck
GET /feed/cards?limit=10

Response (200 OK):

JSON
{
  "remainingSwipes": 10,
  "maxSwipes": 10,
  "profiles": [
    {
      "id": "usr_102",
      "fullName": "Elena Rostova",
      "headline": "UI/UX Designer & Systems Architect",
      "bio": "Building minimalist interfaces. Looking to learn backend API architecture.",
      "skillsOffered": ["Figma / UI Design", "Design Systems"],
      "skillsWanted": ["Node.js & APIs", "PostgreSQL"],
      "location": "Berlin, DE",
      "streakDays": 7
    }
  ]
}
3.2 Submit Swipe Action
POST /swipes

Request Body:

JSON
{
  "targetUserId": "usr_102",
  "direction": "right" // "left" | "right"
}
Response (200 OK):

JSON
{
  "success": true,
  "isMatch": true, // true if target user previously swiped right
  "remainingSwipes": 9,
  "swapSession": {
    "swapId": "swap_101",
    "partnerName": "Elena Rostova"
  }
}
4. Blog & Daily Streak Engine
4.1 Fetch Community Logs
GET /blogs?page=1&limit=10

Response (200 OK):

JSON
{
  "posts": [
    {
      "id": "blog_01",
      "authorName": "Elena Rostova",
      "authorHandle": "@elena_design",
      "skillLearned": "Node.js & APIs",
      "title": "Mastered Express Middleware & JWT Auth",
      "content": "Exchanged 1:1 sessions with Marcus today...",
      "createdAt": "2 HOURS AGO",
      "streakCount": 7,
      "likes": 14,
      "hasLiked": false
    }
  ]
}
4.2 Submit Daily Learning Log
POST /blogs

Increments user streak counter and awards +5 bonus swipes.

Request Body:

JSON
{
  "skillLearned": "React / Next.js",
  "title": "Mastered React Custom Hooks in 1 Hour",
  "content": "Briefly explaining what was learned during today's skill swap..."
}
Response (201 Created):

JSON
{
  "success": true,
  "streakCount": 8,
  "bonusSwipesAwarded": 5,
  "newTotalSwipes": 14
}
5. 1:1 Barter Chat
5.1 Fetch Chat Messages
GET /chat/:swapId/messages

Note: Requires isPhoneVerified: true on user account, otherwise returns 403 Forbidden.

Response (200 OK):

JSON
{
  "swapId": "swap_101",
  "partnerName": "Elena Rostova",
  "partnerLocation": "Berlin, DE",
  "offeredSkill": "Figma / UI Design",
  "wantedSkill": "Node.js & APIs",
  "isPhoneVerified": true,
  "messages": [
    {
      "id": "msg_01",
      "senderId": "partner",
      "text": "Hey! Saw your Node.js profile on Dualo. Ready to swap for Figma UI Design?",
      "timestamp": "10:14 AM",
      "isMe": false
    }
  ]
}
5.2 Send Chat Message
POST /chat/:swapId/messages

Request Body:

JSON
{
  "text": "Sounds great! Let's schedule our first 1:1 session."
}
Response (201 Created):

JSON
{
  "id": "msg_02",
  "timestamp": "10:15 AM",
  "status": "SENT"
}

---

### Save and Push to GitHub

Once you've created `API_CONTRACT.md` in your project root, push it to GitHub: