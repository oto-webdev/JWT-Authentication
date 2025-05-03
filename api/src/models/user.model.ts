import mongoose from "mongoose";

type IUser = {
    username: string,
    email: string,
    password: string,
    refreshToken?: string,
    otp: string,
    otpExpires: Date
}

const userSchema = new mongoose.Schema<IUser>({

    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    refreshToken: { 
        type: String 
    },

    otp: {
        type: String
    },

    otpExpires: {
        type: Date
    }

}, {
    timestamps: true
})

const User = mongoose.model<IUser>("User", userSchema)

export {
    User
}