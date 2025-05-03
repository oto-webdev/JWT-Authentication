import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast"
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [togglePassword, setTogglePassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      if(!formData.username || !formData.email || !formData.password) {
        setError("All fields are required")
        return;
      }

      if(formData.username.length < 3) {
        setError("username must be 3 charcachters at least")
        return;
      }

      if(formData.password.length < 8) {
        setError("Password must be at least 8 charachters long")
        return;
      }

      await signup(formData)
      toast.success("Verification code sent to your email")
      navigate("/auth/verify")
    }catch(error) {
      toast.error("Something went wrong", error)
      setError("Invalid credentials", error);
    }
  }

  return (
    <div>
      <div className="sm:w-[400px] w-full bg-[#111] text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create a new account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="text-sm block mb-1">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border text-sm border-green-500 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-green-600 placeholder:text-green-400"
              name="name"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Username"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm block mb-1">Email Address</label>
            <input
              type="text"
              className="w-full px-3 py-2 border text-sm border-green-500 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-green-600 placeholder:text-green-400"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm block mb-1">Password</label>
            <div className="relative">
              <input
                type={togglePassword ? "text" : "password"}
                className="w-full px-3 py-2 border text-sm border-green-500 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-green-600 placeholder:text-green-400"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
              />
              <div
                className="absolute right-3 top-2.5 cursor-pointer text-green-400"
                onClick={() => setTogglePassword(!togglePassword)}
              >
                {togglePassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition">
            Sign Up
          </button>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <div className="flex items-center gap-2 my-4">
            <div className="h-px bg-gray-700 flex-1"></div>
            <span className="text-sm text-gray-400">or continue with</span>
            <div className="h-px bg-gray-700 flex-1"></div>
          </div>

          <div className="flex gap-3">
            <button type="button" className="flex items-center justify-center gap-2 w-full py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition">
              <FcGoogle size={20} /> Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 w-full py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition">
              <FaGithub size={20} /> GitHub
            </button>
          </div>

          <p className="text-sm text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <NavLink to="/auth/login" className="text-green-500 hover:underline">
              Sign In
            </NavLink>
          </p>

        </form>
      </div>
    </div>
  )
}

export default SignUpPage;