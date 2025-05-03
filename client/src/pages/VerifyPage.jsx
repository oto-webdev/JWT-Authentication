import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

const VerifyPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: "",
    otp: "" 
  });

  const { verifyOtp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.email || !formData.otp) {
        setError("Both email and OTP are required");
        return;
      }

      await verifyOtp(formData);
      toast.success("Account verified and logged in successfully");
      navigate("/"); 
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Failed to verify OTP. Try again.";
      toast.error(errMsg);
      setError(errMsg);
    }
  };

  return (
    <div className="sm:w-[400px] w-full bg-[#111] text-white p-6 rounded-xl shadow-lg mx-auto mt-20">
      <h2 className="text-2xl font-semibold mb-6 text-center">Verify Your Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm block mb-1">Email Address</label>
          <input
            type="email"
            className="w-full px-3 py-2 border text-sm border-green-500 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-green-600 placeholder:text-green-400"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">OTP Code</label>
          <input
            type="text"
            className="w-full px-3 py-2 border text-sm border-green-500 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-green-600 placeholder:text-green-400"
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            placeholder="Enter OTP code"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
        >
          Verify Account
        </button>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>
    </div>
  );
};

export default VerifyPage;
