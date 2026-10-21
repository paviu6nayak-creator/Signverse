import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("signverse_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try once to refresh the access token before giving up and
// forcing a logout — keeps the user signed in across short access-token
// expiries without needing to log in again every hour.
let isRefreshing = false;
let pendingRequests = [];

const resolvePending = (newToken) => {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("signverse_refresh_token");
    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
      localStorage.setItem("signverse_access_token", data.access_token);
      localStorage.setItem("signverse_refresh_token", data.refresh_token);
      resolvePending(data.access_token);
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("signverse_access_token");
      localStorage.removeItem("signverse_refresh_token");
      localStorage.removeItem("signverse_user");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/** Extracts a human-readable message from a FastAPI error response. */
export function getErrorMessage(error) {
  const detail = error?.response?.data?.message || error?.response?.data?.detail;
  if (Array.isArray(error?.response?.data?.errors) && error.response.data.errors.length) {
    return error.response.data.errors.map((e) => e.message).join(", ");
  }
  return detail || "Something went wrong. Please try again.";
}

export default api;
