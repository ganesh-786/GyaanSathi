import Course from "../models/Course.js";
import { User } from "../models/User.js";
import { validationResult } from "express-validator";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      title,
      description,
      imageUrl,
      category,
      difficulty,
      tags,
      price,
      estimatedDuration,
    } = req.body;

    // Check if course with same title already exists for this user
    const existingCourse = await Course.findOne({
      title,
      createdBy: req.user._id,
    });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "You already have a course with this title",
      });
    }

    const newCourse = new Course({
      title,
      description,
      imageUrl,
      category: category || "General",
      difficulty: difficulty || "Beginner",
      tags: tags || [],
      price: price || 0,
      estimatedDuration: estimatedDuration || 0,
      lessons: [], // Initialize with empty lessons array
      createdBy: req.user._id,
      isPublished:
        req.user.role === "admin" || req.user.role === "manager" ? true : false, // Auto-publish for admin/manager
    });

    const savedCourse = await newCourse.save();

    // Populate creator info
    await savedCourse.populate("createdBy", "username email role");

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all courses with role-based filtering
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const category = req.query.category;
    const difficulty = req.query.difficulty;
    const published = req.query.published;

    // Build query based on user role
    let query = {};

    // Role-based filtering
    if (req.user.role === "user") {
      // Regular users only see published courses or their enrolled courses
      const mongoose = (await import("mongoose")).default;
      const userObjectId = mongoose.Types.ObjectId.isValid(req.user._id)
        ? new mongoose.Types.ObjectId(req.user._id)
        : req.user._id;
      query.$or = [
        { isPublished: true },
        { "enrolledUsers.user": userObjectId },
      ];
    } else if (req.user.role === "manager") {
      // Managers see published courses and courses they created
      query.$or = [{ isPublished: true }, { createdBy: req.user._id }];
    }
    // Admins see all courses (no additional filtering)

    // Apply filters
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category && category !== "all") {
      query.category = category;
    }
    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }
    if (published !== undefined) {
      query.isPublished = published === "true";
    }

    // Admin and manager get full course data including lessons
    const selectFields =
      req.user.role === "admin" || req.user.role === "manager"
        ? "title description imageUrl category difficulty tags price estimatedDuration isPublished createdAt updatedAt enrolledCount lessons"
        : "title description imageUrl category difficulty tags price estimatedDuration isPublished createdAt updatedAt enrolledCount";

    const courses = await Course.find(query)
      .select(selectFields)
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Process courses based on user role
    const coursesWithEnrollment = courses.map((course) => {
      const courseObj = course.toObject();
      const isEnrolled = course.isUserEnrolled(req.user._id);
      const isCreator =
        course.createdBy._id?.toString() === req.user._id.toString();

      courseObj.isEnrolled = isEnrolled;
      courseObj.canEdit = req.user.role === "admin" || isCreator;

      // For regular users, only include lessons if enrolled
      if (req.user.role === "user") {
        if (isEnrolled && course.lessons) {
          courseObj.lessons = course.lessons;
        } else {
          courseObj.lessons = [];
        }
      }
      // Admin and manager already have lessons from the query

      return courseObj;
    });

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: coursesWithEnrollment,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get a specific course with lessons
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("createdBy", "username email role profile")
      .populate("enrolledUsers.user", "username profile");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isAdminOrManager =
      req.user.role === "admin" || req.user.role === "manager";
    const isCreator =
      course.createdBy._id.toString() === req.user._id.toString();
    const isEnrolled = course.isUserEnrolled(req.user._id);

    // Access control: Admin/Manager can access everything, Creator can access their courses, Users need enrollment for unpublished courses
    const canAccess =
      isAdminOrManager || isCreator || course.isPublished || isEnrolled;

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Course is not published and you are not enrolled.",
      });
    }

    // Prepare course data
    const courseData = course.toObject();
    courseData.isEnrolled = isEnrolled;
    courseData.canEdit = isAdminOrManager || isCreator;

    // Lesson access control
    if (req.user.role === "user" && !isEnrolled && !course.isPublished) {
      // Regular users can't see lessons of unpublished courses they're not enrolled in
      courseData.lessons = [];
    }
    // Admin, Manager, Creator, and enrolled users get full lesson access

    // Get user's progress if enrolled
    if (isEnrolled) {
      const enrollment = course.enrolledUsers.find(
        (enrollment) =>
          enrollment.user._id.toString() === req.user._id.toString()
      );
      courseData.userProgress = enrollment ? enrollment.progress : null;
    }

    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: courseData,
    });
  } catch (error) {
    console.error("Get course error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const {
      title,
      description,
      imageUrl,
      category,
      difficulty,
      tags,
      price,
      estimatedDuration,
      isPublished,
    } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only edit your own courses.",
      });
    }

    // Check if another course with same title exists (excluding current course)
    if (title && title !== course.title) {
      const existingCourse = await Course.findOne({
        title,
        createdBy: req.user._id,
        _id: { $ne: id },
      });
      if (existingCourse) {
        return res.status(409).json({
          success: false,
          message: "You already have another course with this title",
        });
      }
    }

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (imageUrl) course.imageUrl = imageUrl;
    if (category) course.category = category;
    if (difficulty) course.difficulty = difficulty;
    if (tags) course.tags = tags;
    if (price !== undefined) course.price = price;
    if (estimatedDuration !== undefined)
      course.estimatedDuration = estimatedDuration;

    // Only admins and managers can publish/unpublish courses
    if (
      isPublished !== undefined &&
      (req.user.role === "admin" || req.user.role === "manager")
    ) {
      course.isPublished = isPublished;
    }

    const updatedCourse = await course.save();
    await updatedCourse.populate("createdBy", "username email role");

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own courses.",
      });
    }

    // Remove course from enrolled users
    await User.updateMany(
      { enrolledCourses: id },
      { $pull: { enrolledCourses: id } }
    );

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Enroll in a course
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Cannot enroll in unpublished course",
      });
    }

    if (course.isUserEnrolled(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    await course.enrollUser(req.user._id);

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: courseId },
    });

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    console.error("Enroll in course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Unenroll from a course
export const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.isUserEnrolled(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Not enrolled in this course",
      });
    }

    await course.unenrollUser(req.user._id);

    // Remove course from user's enrolled courses
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledCourses: courseId },
    });

    res.status(200).json({
      success: true,
      message: "Successfully unenrolled from course",
    });
  } catch (error) {
    console.error("Unenroll from course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Add lesson to a course
export const addLesson = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { courseId } = req.params;
    const {
      id,
      title,
      content,
      materials,
      topics,
      subjectCategory,
      duration,
      videoUrl,
    } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only add lessons to your own courses.",
      });
    }

    // Check if lesson with same id already exists in this course
    const existingLesson = course.lessons.find((lesson) => lesson.id === id);
    if (existingLesson) {
      return res.status(409).json({
        success: false,
        message: "Lesson with this ID already exists in the course",
      });
    }

    // Create new lesson object
    const newLesson = {
      id,
      title,
      content: content || "",
      materials: materials || [],
      topics: topics || [],
      subjectCategory: subjectCategory || "",
      duration: duration || 0,
      videoUrl: videoUrl || "",
    };

    // Add lesson to course
    course.lessons.push(newLesson);

    // Update estimated duration
    course.estimatedDuration =
      course.lessons.reduce(
        (total, lesson) => total + (lesson.duration || 0),
        0
      ) / 60; // Convert to hours

    // Save the updated course
    const updatedCourse = await course.save();
    await updatedCourse.populate("createdBy", "username email role");

    res.status(200).json({
      success: true,
      message: "Lesson added successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Add lesson error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update a specific lesson
export const updateLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { courseId, lessonId } = req.params;
    const {
      title,
      content,
      materials,
      topics,
      subjectCategory,
      duration,
      videoUrl,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only edit lessons in your own courses.",
      });
    }

    const lessonIndex = course.lessons.findIndex(
      (lesson) => lesson.id === lessonId
    );
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Update lesson fields
    if (title) course.lessons[lessonIndex].title = title;
    if (content !== undefined) course.lessons[lessonIndex].content = content;
    if (materials) course.lessons[lessonIndex].materials = materials;
    if (topics) course.lessons[lessonIndex].topics = topics;
    if (subjectCategory)
      course.lessons[lessonIndex].subjectCategory = subjectCategory;
    if (duration !== undefined) course.lessons[lessonIndex].duration = duration;
    if (videoUrl !== undefined) course.lessons[lessonIndex].videoUrl = videoUrl;

    // Update estimated duration
    course.estimatedDuration =
      course.lessons.reduce(
        (total, lesson) => total + (lesson.duration || 0),
        0
      ) / 60;

    const updatedCourse = await course.save();
    await updatedCourse.populate("createdBy", "username email role");

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Update lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete a specific lesson
export const deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only delete lessons from your own courses.",
      });
    }

    const lessonIndex = course.lessons.findIndex(
      (lesson) => lesson.id === lessonId
    );
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    course.lessons.splice(lessonIndex, 1);

    // Update estimated duration
    course.estimatedDuration =
      course.lessons.reduce(
        (total, lesson) => total + (lesson.duration || 0),
        0
      ) / 60;

    const updatedCourse = await course.save();
    await updatedCourse.populate("createdBy", "username email role");

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Delete lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Utility endpoint to publish all courses created by admin/manager (for migration)
export const publishAllAdminManagerCourses = async (req, res) => {
  try {
    // Only allow admin to run this utility
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can run this utility.",
      });
    }
    // Find all users with admin or manager role
    const adminManagers = await User.find(
      { role: { $in: ["admin", "manager"] } },
      { _id: 1 }
    );
    const adminManagerIds = adminManagers.map((u) => u._id);
    // Update all their courses to published
    const result = await Course.updateMany(
      { createdBy: { $in: adminManagerIds } },
      { $set: { isPublished: true } }
    );
    res.status(200).json({
      success: true,
      message: `Published ${result.modifiedCount} courses created by admin/manager.`,
    });
  } catch (error) {
    console.error("Publish migration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
