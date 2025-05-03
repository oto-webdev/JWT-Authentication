import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import csurf from "csurf";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.route"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

/*
app.use(csurf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }
}));

app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
*/

app.use("/api/auth", authRoutes)

connectDB()

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
