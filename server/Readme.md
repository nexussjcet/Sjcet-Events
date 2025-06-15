📘 SJCET Events API

A Node.js + Supabase powered backend for managing event registrations, user authentication, and admin functionalities.


---

🔐 Authentication

🔹 POST /api/auth/register

Register a new user (default role is user, unless explicitly set to admin).

Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "admin" // optional, defaults to "user"
}


---

🔹 POST /api/auth/login

Login and receive a JWT token.

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

Use this token in the Authorization header for protected routes:

Authorization: Bearer JWT_TOKEN_HERE


---

👤 Admin Routes (Protected, Role: admin)

🔹 GET /api/admin/data

Gives admin data

🔹 POST /api/admin/organizers

Add an organizer using name and email


🔹 DELETE /api/admin/organizers

Delete a organizer by ID.

🔹 GET /api/admin/users
Get all users info

🔹 DELETE /api/admin/users/:id
Deletes user by id

---

👥 Organizer/Admin Event Management (Protected, Roles: admin, organizer)

🔹 POST /api/events

Create a new event.

🔹 PUT /api/events/update/:id

Update an existing event.

🔹 DELETE /api/events/delete/:id

Delete an event.


---

📅 Public Event Routes

🔹 GET /api/events

Fetch all events ordered by start time.

🔹 GET /api/events/details/:id

Fetch details of a specific event by ID.


---

📝 Event Registration

🔹 POST /api/registrations/register

Protected — Requires authentication.

Registers the authenticated user for an event.

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

JWT secret is stored in .env.

Role-based access control is enforced using middleware.



---
