import config from "@/utils/config";
import axios from "axios";

// Create Axios instance
const axiosClient = axios.create({
  baseURL: config.backendURL,
});

axiosClient.interceptors.request.use((config) => {
  return config;
}, (error) => {
  if (error.response && error.response.status === 401) {
    console.error(error);
  }
  throw new Error(error);
});

export default axiosClient;