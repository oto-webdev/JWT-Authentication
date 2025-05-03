import { Request, Response } from "express";
import { generateToken, generateRefreshToken } from "../utils/token";
import transporter from "../config/nodemailer";
import { User } from "../models/user.model";
import { hashPassword, verifyPassword } from "../utils/argon2id";
import { generateOTP } from "../utils/otp"; 

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        if(password.length < 8) {
            res.status(400).json({ message: "Password must be at least 8 charachters long" });
            return;
        }

        const nameExists = await User.findOne({ username });
        if (nameExists) {
            res.status(409).json({ message: "Username is taken" });
            return;
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            res.status(409).json({ message: "Email address is taken" });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 3 * 60 * 1000); 

        const user = new User({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires
        });

        await user.save();

        await transporter.sendMail({
            from: `"Your App" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Verify your account - OTP",
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p><p>This code will expire in 3 minutes.</p>`
        });

        res.status(201).json({ message: "Signup successful. Please verify OTP sent to your email." });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 3 * 60 * 1000);
        await user.save();

        await transporter.sendMail({
            from: `"Your App" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Login OTP Verification",
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p><p>This code will expire in 3 minutes.</p>`
        });

        res.status(200).json({ message: "OTP sent to your email for verification" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("jwt");
        res.clearCookie("refresh_jwt");

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ message: "Email and OTP are required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        user.otp = "";
        user.otpExpires = new Date(0);
        await user.save();

        generateToken(user._id.toString(), res);
        generateRefreshToken(user._id.toString(), res);

        res.status(200).json({ message: "Account verified and logged in successfully." });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};