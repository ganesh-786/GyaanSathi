# Course Management Backend API

A robust REST API for managing courses and lessons built with Node.js, Express, and MongoDB.

## Features

- ✅ Create, read, update, and delete courses
- ✅ Add, update, and delete lessons within courses
- ✅ Input validation and error handling
- ✅ RESTful API design
- ✅ MongoDB integration with Mongoose
- ✅ Professional folder structure
- ✅ Comprehensive error handling
- ✅ Pagination support

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:

   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/coursemanagement
   ```

4. Start the server:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Courses

- `POST /api/courses` - Create a new course
- `GET /api/courses` - Get all courses (with pagination)
- `GET /api/courses/:id` - Get a specific course with lessons
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

### Lessons

- `POST /api/courses/:courseId/lessons` - Add a lesson to a course
- `PUT /api/courses/:courseId/lessons/:lessonId` - Update a specific lesson
- `DELETE /api/courses/:courseId/lessons/:lessonId` - Delete a specific lesson

### Health Check

- `GET /api/health` - API health status

## Request Examples

### Create Course

```json
POST /api/courses
{
  "title": "Introduction to Web Development",
  "description": "Learn the fundamentals of web development, including HTML, CSS, and JavaScript.",
  "imageUrl": "https://placehold.co/400x250/06B6D4/FFFFFF?text=Web+Dev"
}
```

### Add Lesson

```json
POST /api/courses/:courseId/lessons
{
  "id": "l1.1",
  "title": "HTML Basics",
  "materials": [
    "https://www.w3schools.com/html/default.asp",
    "HTML_Cheatsheet.pdf"
  ],
  "topics": ["HTML Structure", "Tags", "Elements", "Attributes"],
  "subjectCategory": "Web Development"
}
```

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Project dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
├── models/
│   └── Course.js         # Course data model
├── controllers/
│   └── courseController.js # Business logic
├── routes/
│   └── courseRoutes.js   # API routes
└── middleware/
    └── errorHandler.js   # Error handling middleware
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and descriptive error messages.

## Security Features

- Helmet.js for security headers
- Input validation and sanitization
- CORS configuration
- Request size limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
