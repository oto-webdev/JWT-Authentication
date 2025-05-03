import React from 'react'
import { Routes, Route } from "react-router"
import AuthLayout from "./components/AuthLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import VerifyPage from "./pages/VerifyPage"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/auth' element={<AuthLayout />}>
          <Route path='signup' element={<SignUpPage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='verify' element={<VerifyPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;