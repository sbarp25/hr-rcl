import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8090/api/",
  baseURL: "http://192.168.1.147:8090/api/",
  //   baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: url,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json", // Change this to 'application/json'
  },
});

export default axiosInstance;
