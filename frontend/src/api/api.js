// API utility for backend communication
const API_BASE = "http://localhost:8000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
};

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

// Authentication APIs
export const register = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

// Course APIs
export const getCourses = async (token, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE}/courses${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const getCourseById = async (courseId, token) => {
  const response = await fetch(`${API_BASE}/courses/${courseId}`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const createCourse = async (courseData, token) => {
  const response = await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(courseData),
  });
  return handleResponse(response);
};

export const updateCourse = async (courseId, courseData, token) => {
  const response = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(courseData),
  });
  return handleResponse(response);
};

export const deleteCourse = async (courseId, token) => {
  const response = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const enrollInCourse = async (courseId, token) => {
  const response = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
    method: "POST",
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const unenrollFromCourse = async (courseId, token) => {
  const response = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

// Lesson APIs
export const addLesson = async (courseId, lessonData, token) => {
  const response = await fetch(`${API_BASE}/courses/${courseId}/lessons`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(lessonData),
  });
  return handleResponse(response);
};

export const updateLesson = async (courseId, lessonId, lessonData, token) => {
  const response = await fetch(
    `${API_BASE}/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(lessonData),
    }
  );
  return handleResponse(response);
};

export const deleteLesson = async (courseId, lessonId, token) => {
  const response = await fetch(
    `${API_BASE}/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    }
  );
  return handleResponse(response);
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE}/health`);
  return handleResponse(response);
};
