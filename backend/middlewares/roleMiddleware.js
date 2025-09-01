// Role-based access control middleware
export const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User not authenticated.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

// Specific role middlewares for common use cases
export const adminOnly = roleAuth("admin");
export const adminOrManager = roleAuth("admin", "manager");
export const allRoles = roleAuth("admin", "manager", "user");

// Check if user owns resource or has admin/manager privileges
export const ownerOrAdmin = (resourceUserField = "createdBy") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User not authenticated.",
      });
    }

    // Admin and manager can access any resource
    if (req.user.role === "admin" || req.user.role === "manager") {
      return next();
    }

    // For regular users, we need to check ownership
    // This will be validated later in the route handler when we have the resource
    req.checkOwnership = {
      userId: req.user._id,
      userField: resourceUserField,
    };

    next();
  };
};

// Middleware to check course enrollment or ownership
export const courseAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied. User not authenticated.",
    });
  }

  // Admin and manager have full access
  if (req.user.role === "admin" || req.user.role === "manager") {
    return next();
  }

  // For regular users, check will be done in the controller
  // where we have access to the course data
  next();
};
