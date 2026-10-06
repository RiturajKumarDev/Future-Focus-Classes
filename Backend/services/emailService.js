const nodemailer = require("nodemailer");

// Create transport or fallback logger
const createTransporter = () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return null;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`📧 [MOCK EMAIL SERVICE] To: ${to} | Subject: ${subject}`);
      return { success: true, mode: "mock" };
    }

    const info = await transporter.sendMail({
      from: `"LearnX LMS" <${process.env.EMAIL_USER || "no-reply@learnx.com"}>`,
      to,
      subject,
      text: text || subject,
      html,
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Email service error:", error.message);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: "Welcome to LearnX - Start Your Learning Journey!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Welcome to LearnX, ${user.fullName}! 👋</h2>
        <p>We are thrilled to have you join our world-class learning community.</p>
        <p>Explore thousands of courses, master new skills, take interactive quizzes, and earn verifiable industry certificates.</p>
        <a href="${process.env.CLIENT_URL || "http://localhost:5173"}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Explore Courses</a>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  return sendEmail({
    to: user.email,
    subject: "LearnX - Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Password Reset Request</h2>
        <p>Hello ${user.fullName},</p>
        <p>You requested a password reset for your LearnX account. Click the button below to reset your password. This link is valid for 30 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Reset Password</a>
        <p style="color: #64748b; font-size: 13px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
