import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,

      signup: async (formSignup) => {
        try {
          const res = await axiosInstance.post("/signup", formSignup);
          return res.data;
        } catch (error) {
          console.error("Signup failed", error);
          throw error;
        }
      },

      login: async (formLogin) => {
        try {
          const res = await axiosInstance.post("/login", formLogin);
          set({ authUser: res.data.user });
          return res.data;
        } catch (error) {
          console.error("Login failed", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          const res = await axiosInstance.post("/logout");
          set({ authUser: null });
          return res.data;
        } catch (error) {
          console.error("Logout failed", error);
          throw error;
        }
      },

      verifyOtp: async (formVerifyOtp) => {
        try {
          const res = await axiosInstance.post("/verify-otp", formVerifyOtp);
          set({ authUser: res.data.user });
          return res.data;
        } catch (error) {
          console.error("OTP verification failed", error);
          throw error;
        }
      }
    }),
    {
      name: "auth-storage", 
      partialize: (state) => ({ authUser: state.authUser }), 
    }
  )
);
