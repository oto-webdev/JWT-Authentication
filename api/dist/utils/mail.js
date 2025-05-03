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
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
function sendEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield nodemailer_1.default.sendMail({
            from: `"Your Name" <${process.env.MAIL_USER}>`,
            to: "recipient@example.com",
            subject: "Test Email via Gmail",
            text: "Hello from Gmail + Nodemailer + TypeScript!",
            html: "<b>Hello from Gmail + Nodemailer + TypeScript!</b>",
        });
    });
}
sendEmail().catch(console.error);
