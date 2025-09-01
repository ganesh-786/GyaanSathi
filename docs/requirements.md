# 📝 GyaanSathi – Your Friendly Learning Companion

_"Unlock knowledge, with GyaanSathi."_

**Category:** Education / Productivity

---

## 🌍 Overview

GyaanSathi is a platform where educators can publish study materials, and students can access them with optional AI-generated study notes.

**Users can:**

- ✅ Access organized courses and lessons
- ✅ Track lesson completion

---

## 🧩 Tier 1: Basic Learning Management System (React + Node.js + Express)

### 🔹 Features:

- Educators can create, edit, and delete courses and lessons
- Lesson content form: titles, materials, topics, subject categories
- Homepage displaying all courses and lessons
- Individual lesson view with structured content
- Basic responsive design

### 🔹 Optional Enhancements:

- Smart Study Notes Generator: AI generates concise notes from lesson content
- Study Buddy Chat: Interactive AI tutor answering questions and providing tips
- API integration for extra study content
- Dark/light mode toggle
- Mobile-friendly responsive design

### 🔹 Tech Stack:

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** In-memory store

### 🔹 Backend Routes (Postman-Testable):

- `POST /courses` → Create course
- `GET /courses` → Fetch all courses
- `GET /lessons/:id` → Fetch lesson content
- `PUT /courses/:id` → Update course
- `DELETE /courses/:id` → Delete course

### 🔹 Result:

Functional platform to create and view lessons, with optional AI notes and extra features.

---

## 📍 Tier 2: Database Integration (MongoDB + Mongoose)

### 🔹 Features:

- Persistent storage for courses and lessons using MongoDB + Mongoose
- Filter lessons by category or topic

### 🔹 Optional Enhancements:

- Subject categories (Math, Science, History, Literature, Languages, Business)
- Featured courses and recently added materials
- Interactive quizzes with instant feedback
- Study progress tracking and completion certificates
- Personal study planner and deadline reminders
- Collaborative study groups and discussion forums
- Sort lessons by date or category

### 🔹 Backend Routes (Postman-Testable):

- CRUD routes for courses and lessons using MongoDB

### 🔹 UI/UX Enhancements:

- Modern, clean educational design
- Enhanced content display with responsive layout
- Visual progress analytics

### 🔹 Result:

Persistent platform with database support and optional advanced learning features.

---

## 🤖 Tier 3: AI-Powered Suggestions (Simplified)

### 🔹 Features:

- Dashboard showing completed lessons
- Simple suggestions for next lessons based on progress

### 🔹 Optional Enhancements:

- Quick AI-generated notes for completed lessons
- Flashcards for revision
- Focus mode for distraction-free learning
- Progress visualization (simple charts)
- Offline access for lessons
- Export notes as PDF
- Adaptive reminders for next lessons

### 🔹 Result:

A smarter learning platform with optional AI enhancements for guidance and revision.

---

## 🔐 Tier 4: User Authentication & Access Control

### 🔹 Features:

- User registration & login (Educator and Student roles)
- JWT-based authentication for secure sessions
- Protected routes for courses and lessons
- Profile management (update name, email, password)

### 🔹 Optional Enhancements:

- Role-based dashboards (Educator vs Student)
- Email verification and password reset
- Social login (Google, Facebook)

### 🔹 Tech Stack:

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB (Users collection)
- **Authentication:** JWT + bcrypt

### 🔹 Backend Routes (Postman-Testable):

- `POST /auth/register` → Register user
- `POST /auth/login` → Login user
- `GET /auth/me` → Get current user info
- Protected CRUD routes for courses and lessons

### 🔹 Result:

Secure platform where authenticated users can access personalized courses and track progress, with optional enhancements for security and roles.
