import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    materials: [
      {
        type: String,
        required: true,
      },
    ],
    topics: [
      {
        type: String,
        required: true,
      },
    ],
    subjectCategory: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    videoUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Video URL must be a valid URL",
      },
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: "Image URL must be a valid URL",
    },
  },
  lessons: [lessonSchema],

  // User-related fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  enrolledUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
      progress: {
        completedLessons: [
          {
            lessonId: String,
            completedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        completionPercentage: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    },
  ],

  // Course metadata
  category: {
    type: String,
    trim: true,
    default: "General",
  },

  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },

  isPublished: {
    type: Boolean,
    default: false,
  },

  tags: [
    {
      type: String,
      trim: true,
    },
  ],

  price: {
    type: Number,
    default: 0,
    min: 0,
  },

  estimatedDuration: {
    type: Number, // in hours
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better performance
courseSchema.index({ createdBy: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ "enrolledUsers.user": 1 });

// Update the updatedAt field before saving
courseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for enrolled user count
courseSchema.virtual("enrolledCount").get(function () {
  return this.enrolledUsers.length;
});

// Method to check if user is enrolled
courseSchema.methods.isUserEnrolled = function (userId) {
  return (
    Array.isArray(this.enrolledUsers) &&
    this.enrolledUsers.some(
      (enrollment) => enrollment.user.toString() === userId.toString()
    )
  );
};

// Method to enroll user
courseSchema.methods.enrollUser = function (userId) {
  if (!this.isUserEnrolled(userId)) {
    this.enrolledUsers.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to unenroll user
courseSchema.methods.unenrollUser = function (userId) {
  this.enrolledUsers = this.enrolledUsers.filter(
    (enrollment) => enrollment.user.toString() !== userId.toString()
  );
  return this.save();
};

export default mongoose.model("Course", courseSchema);
