const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Agent = require("../models/Agent.model");
const Lead = require("../models/Lead.model");

exports.createAgent = async (req, res) => {
  try {
    const { name, phone, email, role = "CALLER", password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, email, and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingAgent = await Agent.findOne({
      $or: [{ phone }, { email: normalizedEmail }],
    });

    if (existingAgent) {
      return res.status(409).json({
        success: false,
        message: "An agent with this phone or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = await Agent.create({
      name,
      phone,
      email: normalizedEmail,
      role,
      password: hashedPassword,
    });

    const safeAgent = agent.toObject();
    delete safeAgent.password;

    res.status(201).json({
      success: true,
      message: "Agent created",
      data: safeAgent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}, { password: 0 }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid agent id",
      });
    }

    if (String(req.agent._id) === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const [assignedReset, otherReset] = await Promise.all([
      Lead.updateMany(
        { assignedTo: id, status: "ASSIGNED" },
        { $set: { assignedTo: null, assignedDate: null, status: "NEW" } },
      ),
      Lead.updateMany(
        { assignedTo: id, status: { $ne: "ASSIGNED" } },
        { $set: { assignedTo: null, assignedDate: null } },
      ),
    ]);

    const unassignedLeads =
      assignedReset.modifiedCount + otherReset.modifiedCount;

    await Agent.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Agent "${agent.name}" deleted`,
      unassignedLeads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
