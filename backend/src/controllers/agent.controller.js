const Agent = require("../models/Agent.model");

exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);

    res.json({
      success: true,
      message: "Agent created",
      data: agent,
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
    const agents = await Agent.find().sort({ createdAt: -1 });

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
