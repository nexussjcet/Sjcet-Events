# 📘 SJCET Events API

A Node.js + Supabase-powered backend for managing user authentication, event creation, and registrations, with full admin control and role-based access.

---

## 🔐 Authentication

### 🔸 POST `/api/auth/register`
Registers a new user.  
Default role is `"user"` unless explicitly set to `"admin"`.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "admin" // optional
}


---

🔸 POST /api/auth/login

Logs in a user and returns a JWT token.

Body:

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:

{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE"
}

Use the token in headers for protected routes:

Authorization: Bearer JWT_TOKEN_HERE


---

👤 Admin Routes (Protected — Requires Role: admin)

🔸 GET /api/admin/data

Returns basic admin info for authentication testing.

🔸 POST /api/admin/organizers

Add an organizer by name and email.

🔸 DELETE /api/admin/organizers/:id

Delete an organizer by ID.

🔸 GET /api/admin/users

Fetch all registered users.

🔸 DELETE /api/admin/users/:id

Delete a user by their ID.


---

👥 Event Management (Protected — Roles: admin, organizer)

🔸 POST /api/events

Create a new event.

🔸 PUT /api/events/update/:id

Update an existing event by ID.

🔸 DELETE /api/events/delete/:id

Delete an event by ID.


---

📅 Public Event Routes

🔸 GET /api/events

Fetch all events, ordered by start time.

🔸 GET /api/events/details/:id

Fetch detailed info about a specific event by its ID.


---

📝 Event Registration (Protected — Requires Login)

🔸 POST /api/registrations/register

Register the authenticated user for an event.

Body:

{
  "event_id": "event-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}


---

🛡️ Notes

Passwords are hashed using bcryptjs.

JWT token is signed using the JWT_SECRET from your .env.

Role-based access control is handled via middleware (auth.middleware.js and role.middleware.js).

Supabase is used for all database and auth operations.



---

🚀 To Run the Project

npm install
npm start

Ensure your .env contains:

SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_or_service_key
JWT_SECRET=your_random_secret


---

📂 Folder Structure (Optional)

.
├── controllers/
├── middlewares/
├── routes/
├── config/
├── server.js
└── .env


---

🧑‍💻 Built With

Node.js + Express.js

Supabase (DB + Auth)

bcryptjs

JSON Web Tokens (JWT)



---
