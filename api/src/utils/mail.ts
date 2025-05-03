import transporter from "../config/nodemailer";

async function sendEmail() {
  const info = await transporter.sendMail({
    from: `"Your Name" <${process.env.MAIL_USER}>`,
    to: "recipient@example.com",
    subject: "Test Email via Gmail",
    text: "Hello from Gmail + Nodemailer + TypeScript!",
    html: "<b>Hello from Gmail + Nodemailer + TypeScript!</b>",
  });
}

sendEmail().catch(console.error);
