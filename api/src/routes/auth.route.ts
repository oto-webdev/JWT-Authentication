import express from "express"
import { login, logout, signup, verifyOTP } from "../controllers/auth.controller"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/verify-otp", verifyOTP)

export default router;