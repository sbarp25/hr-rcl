import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.147:8091/api/",
  // baseURL: "http://192.168.1.147:8090/api",
  // baseURL: "http://192.168.1.147:8091/",
  // baseURL: "http://192.168.1.147:8090/",
  //   baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    {
      const accessToken = localStorage.getItem("accessToken");
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    delete config.headers.includeUrn;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
