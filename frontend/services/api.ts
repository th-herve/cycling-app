import axios from "axios";

// TODO .env
const BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return error.data;
  },
);
