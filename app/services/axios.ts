import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_CATS_API_KEY;
const baseURL = process.env.EXPO_PUBLIC_CATS_API_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
