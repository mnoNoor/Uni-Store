import axios from "axios";

const BASE_URL =
  import.meta.env.NODE_ENV === "development" ? "http://localhost:5000" : "/api";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default instance;
