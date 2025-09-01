# FinallMS - Learning Management System

A comprehensive Learning Management System (LMS) with user authentication, role-based access control, and course management capabilities.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)

## 🚀 Features

### 🔐 Authentication & Authorization

- **User Registration & Login** with JWT tokens
- **Role-based Access Control** (Admin, Manager, User)
- **Secure Password Hashing** with bcrypt
- **Profile Management** and password changes
- **User Management Dashboard** for administrators

### 📚 Course Management

- **Create, Read, Update, Delete** courses
- **Lesson Management** within courses
- **Course Enrollment System** for students
- **Progress Tracking** for enrolled users
- **Role-based Course Access** control
- **Course Categories & Difficulty Levels**

### 👥 User Roles & Permissions

| Role        | Permissions                                       |
| ----------- | ------------------------------------------------- |
| **Admin**   | Full system access, user management, all courses  |
| **Manager** | Create/manage own courses, view published courses |
| **User**    | Enroll in published courses, track progress       |

### 🛡️ Security Features

- JWT token authentication with expiration
- Input validation and sanitization
- Password strength requirements
- CORS configuration
- Helmet security headers
- Error handling without information leakage

## 📋 Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finallms.git
cd finallms/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/finallms

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random-123456789
JWT_EXPIRES_IN=24h

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB installation
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Or standard start
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── courseController.js   # Course management logic
├── middleware/
│   └── errorHandler.js       # Global error handling
├── middlewares/
│   ├── authMiddleware.js     # JWT verification
│   └── roleMiddleware.js     # Role-based access control
├── models/
│   ├── User.js              # User data model
│   └── Course.js            # Course data model
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   └── courseRoutes.js      # Course management endpoints
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js               # Main application file
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint                   | Description         | Access     |
| ------ | -------------------------- | ------------------- | ---------- |
| POST   | `/register`                | Register new user   | Public     |
| POST   | `/login`                   | User login          | Public     |
| GET    | `/profile`                 | Get user profile    | Protected  |
| PUT    | `/profile`                 | Update user profile | Protected  |
| PUT    | `/change-password`         | Change password     | Protected  |
| GET    | `/users`                   | Get all users       | Admin Only |
| PUT    | `/users/:id/role`          | Update user role    | Admin Only |
| PUT    | `/users/:id/toggle-status` | Toggle user status  | Admin Only |
| DELETE | `/users/:id`               | Delete user         | Admin Only |

### Course Routes (`/api/courses`)

| Method | Endpoint                 | Description          | Access        |
| ------ | ------------------------ | -------------------- | ------------- |
| POST   | `/`                      | Create new course    | Admin/Manager |
| GET    | `/`                      | Get all courses      | Protected     |
| GET    | `/:id`                   | Get specific course  | Protected     |
| PUT    | `/:id`                   | Update course        | Owner/Admin   |
| DELETE | `/:id`                   | Delete course        | Owner/Admin   |
| POST   | `/:id/enroll`            | Enroll in course     | Protected     |
| DELETE | `/:id/enroll`            | Unenroll from course | Protected     |
| POST   | `/:id/lessons`           | Add lesson to course | Owner/Admin   |
| PUT    | `/:id/lessons/:lessonId` | Update lesson        | Owner/Admin   |
| DELETE | `/:id/lessons/:lessonId` | Delete lesson        | Owner/Admin   |

## 🧪 API Testing

### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "user"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

### 3. Access Protected Route

```bash
curl -X GET http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Create a Course (Admin/Manager)

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Introduction to Web Development",
    "description": "Learn the fundamentals of web development",
    "imageUrl": "https://example.com/course-image.jpg",
    "category": "Programming",
    "difficulty": "Beginner"
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description               | Default        | Required |
| ---------------- | ------------------------- | -------------- | -------- |
| `NODE_ENV`       | Environment mode          | development    | No       |
| `PORT`           | Server port               | 5000           | No       |
| `MONGO_URI`      | MongoDB connection string | -              | Yes      |
| `JWT_SECRET`     | JWT signing secret        | -              | Yes      |
| `JWT_EXPIRES_IN` | JWT expiration time       | 24h            | No       |
| `CLIENT_URL`     | Frontend URL for CORS     | localhost:3000 | No       |

### Database Schema

#### User Collection

```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: Enum ['admin', 'manager', 'user'],
  isActive: Boolean,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  enrolledCourses: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### Course Collection

```javascript
{
  title: String,
  description: String,
  imageUrl: String,
  category: String,
  difficulty: Enum ['Beginner', 'Intermediate', 'Advanced'],
  createdBy: ObjectId (User),
  enrolledUsers: [{
    user: ObjectId (User),
    enrolledAt: Date,
    progress: {
      completedLessons: [String],
      completionPercentage: Number
    }
  }],
  lessons: [{
    id: String,
    title: String,
    materials: [String],
    topics: [String],
    subjectCategory: String,
    duration: Number,
    videoUrl: String
  }],
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚦 Getting Started Guide

### 1. First-Time Setup

1. **Install and start the server** following the installation steps above
2. **Create an admin user** (temporarily modify registration or use MongoDB directly):

```javascript
// In MongoDB shell or using a database GUI
db.users.insertOne({
  username: "admin",
  email: "admin@finallms.com",
  password: "$2a$12$...", // Use bcrypt to hash your password
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

3. **Login as admin** and start creating courses
4. **Register regular users** and managers through the API

### 2. Development Workflow

1. **Start the server** in development mode: `npm run dev`
2. **Test API endpoints** using Postman, curl, or your frontend
3. **Monitor logs** for debugging information
4. **Use MongoDB Compass** or similar tools to inspect the database

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start server in production mode
npm run dev        # Start server with auto-restart (development)
npm run prod       # Start server in production mode
npm test           # Run tests (when implemented)
```

### Code Style & Standards

- **ES6+ Modules** - Using import/export syntax
- **Async/Await** - For asynchronous operations
- **Error Handling** - Comprehensive error catching and user-friendly messages
- **Input Validation** - Using express-validator for request validation
- **Security** - Following OWASP security practices

## 🔒 Security Considerations

- **JWT Tokens** - Secure with strong secret and reasonable expiration
- **Password Hashing** - Using bcrypt with salt rounds
- **Input Validation** - All inputs validated and sanitized
- **CORS** - Properly configured for your frontend domain
- **Environment Variables** - Sensitive data stored in .env
- **Error Messages** - No sensitive information leaked in errors

## 🚀 Deployment

### Production Environment

1. **Set production environment variables**:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finallms
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

2. **Build and start**:

```bash
npm run prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "run", "prod"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**1. Database Connection Error**

```
Solution: Check if MongoDB is running and MONGO_URI is correct
```

**2. JWT Token Invalid**

```
Solution: Ensure JWT_SECRET is set and tokens haven't expired
```

**3. CORS Issues**

```
Solution: Update CLIENT_URL in .env to match your frontend URL
```

**4. Port Already in Use**

```
Solution: Change PORT in .env or kill the process using the port
```

### Debug Mode

Enable debug logging by adding to your .env:

```env
DEBUG=finallms:*
```

## 📞 Support

For support, email support@finallms.com or create an issue on GitHub.

## 🙏 Acknowledgments

- Express.js team for the robust web framework
- MongoDB team for the flexible database solution
- JWT.io for authentication standards
- All contributors who helped build this project

---

**Built with ❤️ for the learning community**
