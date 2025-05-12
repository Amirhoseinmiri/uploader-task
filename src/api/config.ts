// src/config/axiosConfig.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central error handling
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
