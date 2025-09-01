import express from "express";
import { body, param } from "express-validator";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { adminOnly, roleAuth } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Validation rules
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("role")
    .optional()
    .isIn(["user", "manager"])
    .withMessage("Role must be either 'user' or 'manager'"),
];

const loginValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username or email is required"),

  body("password").notEmpty().withMessage("Password is required"),
];

const profileUpdateValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters"),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
];

const passwordChangeValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
];

const roleUpdateValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID"),

  body("role")
    .isIn(["user", "manager", "admin"])
    .withMessage("Role must be 'user', 'manager', or 'admin'"),
];

// Public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Protected routes (require authentication)
router.use(verifyToken); // All routes below require authentication

// User profile routes
router.get("/profile", getProfile);
router.put("/profile", profileUpdateValidation, updateProfile);
router.put("/change-password", passwordChangeValidation, changePassword);

// Admin routes
router.get("/users", adminOnly, getAllUsers);
router.put(
  "/users/:userId/role",
  adminOnly,
  roleUpdateValidation,
  updateUserRole
);
router.put(
  "/users/:userId/toggle-status",
  adminOnly,
  param("userId").isMongoId().withMessage("Invalid user ID"),
  toggleUserStatus
);
router.delete(
  "/users/:userId",
  adminOnly,
  param("userId").isMongoId().withMessage("Invalid user ID"),
  deleteUser
);

export default router;
