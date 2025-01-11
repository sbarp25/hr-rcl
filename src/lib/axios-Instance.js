import axios from "axios";

const axiosInstance = axios.create({
  // sunil bhai ko ip
  // baseURL: "http://192.168.1.147:8091/",
  // baseURL: "http://192.168.1.147:8090/",

  // Korash dai ko ip
  // baseURL: "http://192.168.1.173:8091/",
  // baseURL: "http://192.168.1.173:8090/",
// 
  //   baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: url,s
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
