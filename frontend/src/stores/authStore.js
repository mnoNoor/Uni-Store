import { create } from "zustand";
import instance from "../lib/axios";
import axios from "axios";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await instance.post("/auth/signup", {
        email,
        password,
        username,
      });
      set({ user: response.data.user });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 409
          ? "User already exists"
          : "Signup failed");

      set({ error: message });

      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await instance.post("/auth/login", { email, password });
      set({ user: response.data.user, token: response.data.token });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, token: null });
  },
}));
