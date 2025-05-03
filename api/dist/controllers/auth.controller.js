"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.logout = exports.login = exports.signup = void 0;
const token_1 = require("../utils/token");
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const user_model_1 = require("../models/user.model");
const argon2id_1 = require("../utils/argon2id");
const otp_1 = require("../utils/otp");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({ message: "Password must be at least 8 charachters long" });
            return;
        }
        const nameExists = yield user_model_1.User.findOne({ username });
        if (nameExists) {
            res.status(409).json({ message: "Username is taken" });
            return;
        }
        const emailExists = yield user_model_1.User.findOne({ email });
        if (emailExists) {
            res.status(409).json({ message: "Email address is taken" });
            return;
        }
        const hashedPassword = yield (0, argon2id_1.hashPassword)(password);
        const otp = (0, otp_1.generateOTP)();
        const otpExpires = new Date(Date.now() + 3 * 60 * 1000);
        const user = new user_model_1.User({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires
        });
        yield user.save();
        yield nodemailer_1.default.sendMail({
            from: `"Your App" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Verify your account - OTP",
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p><p>This code will expire in 3 minutes.</p>`
        });
        res.status(201).json({ message: "Signup successful. Please verify OTP sent to your email." });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isPasswordValid = yield (0, argon2id_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const otp = (0, otp_1.generateOTP)();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 3 * 60 * 1000);
        yield user.save();
        yield nodemailer_1.default.sendMail({
            from: `"Your App" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Login OTP Verification",
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <b>${otp}</b></p><p>This code will expire in 3 minutes.</p>`
        });
        res.status(200).json({ message: "OTP sent to your email for verification" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("jwt");
        res.clearCookie("refresh_jwt");
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.logout = logout;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ message: "Email and OTP are required" });
            return;
        }
        const user = yield user_model_1.User.findOne({ email });
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
        yield user.save();
        (0, token_1.generateToken)(user._id.toString(), res);
        (0, token_1.generateRefreshToken)(user._id.toString(), res);
        res.status(200).json({ message: "Account verified and logged in successfully." });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.verifyOTP = verifyOTP;
