const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "LearnX_Super_Secret_JWT_Key_2026",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  // Convert mongoose doc to object and sanitize password
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    token,
    user: userObj,
  });
};

module.exports = {
  generateToken,
  sendTokenResponse,
};
