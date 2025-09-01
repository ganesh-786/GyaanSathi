import express from "express";
import { body, param } from "express-validator";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  addLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/courseController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { adminOrManager } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Validation rules
const courseValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Description must be between 1 and 1000 characters"),
  body("imageUrl").isURL().withMessage("Image URL must be a valid URL"),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters"),
  body("difficulty")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Difficulty must be Beginner, Intermediate, or Advanced"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("estimatedDuration")
    .optional()
    .isNumeric()
    .withMessage("Estimated duration must be a number"),
];

const lessonValidation = [
  body("id").trim().notEmpty().withMessage("Lesson ID is required"),
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("materials")
    .isArray({ min: 1 })
    .withMessage("Materials must be an array with at least one item"),
  body("topics")
    .isArray({ min: 1 })
    .withMessage("Topics must be an array with at least one item"),
  body("subjectCategory")
    .trim()
    .notEmpty()
    .withMessage("Subject category is required"),
  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),
  body("videoUrl")
    .optional()
    .isURL()
    .withMessage("Video URL must be a valid URL"),
];

// Course routes
router.post("/", adminOrManager, courseValidation, createCourse);
router.get("/", getAllCourses);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid course ID"),
  getCourseById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Invalid course ID"),
  courseValidation,
  updateCourse
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid course ID"),
  deleteCourse
);

// Course enrollment routes
router.post(
  "/:courseId/enroll",
  param("courseId").isMongoId().withMessage("Invalid course ID"),
  enrollInCourse
);

router.delete(
  "/:courseId/enroll",
  param("courseId").isMongoId().withMessage("Invalid course ID"),
  unenrollFromCourse
);

// Lesson routes
router.post(
  "/:courseId/lessons",
  param("courseId").isMongoId().withMessage("Invalid course ID"),
  lessonValidation,
  addLesson
);

router.put(
  "/:courseId/lessons/:lessonId",
  param("courseId").isMongoId().withMessage("Invalid course ID"),
  lessonValidation,
  updateLesson
);

router.delete(
  "/:courseId/lessons/:lessonId",
  param("courseId").isMongoId().withMessage("Invalid course ID"),
  deleteLesson
);

export default router;
