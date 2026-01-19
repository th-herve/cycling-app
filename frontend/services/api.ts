import axios from "axios";

const BASE_URL = process.env.BACKEND_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return error.data;
  },
);
