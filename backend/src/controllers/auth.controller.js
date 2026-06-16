const Agent = require("../models/Agent.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_EXPIRES_IN = "7d";

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const agent = await Agent.findOne({ email: email.toLowerCase().trim() });

    if (!agent) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!agent.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const matchPassword = await bcrypt.compare(password, agent.password);

    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { agentId: agent._id, role: agent.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const safeAgent = agent.toObject();
    delete safeAgent.password;

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        agent: safeAgent,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.me = async (req, res) => {
  res.json({
    success: true,
    data: req.agent,
  });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const agent = await Agent.findById(req.agent._id);

    if (!agent?.password) {
      return res.status(400).json({
        success: false,
        message: "Password change is not available for this account",
      });
    }

    const matchPassword = await bcrypt.compare(currentPassword, agent.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    agent.password = await bcrypt.hash(newPassword, 10);
    await agent.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
