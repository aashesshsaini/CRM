const jwt = require("jsonwebtoken");
const Agent = require("../models/Agent.model");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const agent = await Agent.findById(decoded.agentId).select("-password");

    if (!agent || !agent.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive account",
      });
    }

    req.agent = agent;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.agent.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission for this action",
      });
    }
    next();
  };
