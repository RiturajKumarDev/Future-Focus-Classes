const { AuditLog } = require("../models");

const logAuditEvent = async ({
  user,
  action,
  targetType,
  targetId,
  details = {},
  ipAddress = "",
}) => {
  try {
    if (!user) return null;
    return await AuditLog.create({
      user: user._id || user,
      action,
      targetType,
      targetId: String(targetId || ""),
      details,
      ipAddress,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err.message);
    return null;
  }
};

module.exports = {
  logAuditEvent,
};
