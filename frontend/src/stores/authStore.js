import { create } from "zustand";
import instance from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    set({ isLoading: true });

    try {
      const res = await instance.get("/auth/user-auth");
      set({ user: res.data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const res = await instance.post("/auth/signup", {
        email,
        password,
        username,
      });

      set({ user: res.data.user });
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await instance.post("/auth/login", {
        email,
        password,
      });

      set({ user: res.data.user });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid email or password";

      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await instance.post("/auth/logout");
    set({ user: null });
  },
}));
