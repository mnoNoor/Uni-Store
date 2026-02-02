import { create } from "zustand";
import instance from "../lib/axios";
import axios from "axios";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  signup: async (email, password, userName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await instance.post("/auth/signup", {
        email,
        password,
        userName,
      });
      set({ user: response.data.user, token: response.data.token });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
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
