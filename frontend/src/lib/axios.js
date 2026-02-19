import axios from "axios";

const BASE_URL = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default instance;
