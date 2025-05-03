import React from 'react'
import { useAuthStore } from "../store/useAuthStore"
import { NavLink } from "react-router"

const HomePage = () => {
  const { logout, authUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      {
        authUser 
        ? (
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        ) 
        : (
          <NavLink 
            to="/auth/login" 
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Sign In
          </NavLink>
        )
      }
    </div>
  )
}

export default HomePage;
