const Lead = require("../models/Lead.model");
const Agent = require("../models/Agent.model");
const { exportLeadsToExcel } = require("../services/excel.service");

exports.getLeads = async (req, res) => {
  try {
    const {
      status,
      city,
      category,
      assignedTo,
      limit = 100,
      page = 1,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, "i");
    if (category) filter.category = new RegExp(category, "i");
    if (assignedTo) filter.assignedTo = assignedTo;

    const skip = (Number(page) - 1) * Number(limit);

    console.log(filter, "folter......");

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name phone")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Lead.countDocuments(filter);

    console.log(leads.length, "total..........");

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      total,
      count: leads.length,
      data: leads,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.assignLeads = async (req, res) => {
  try {
    const { agentId, limit = 100, city, category } = req.body;

    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const filter = {
      status: "NEW",
      assignedTo: null,
    };

    if (city) filter.city = new RegExp(city, "i");
    if (category) filter.category = new RegExp(category, "i");

    const leads = await Lead.find(filter)
      .sort({ createdAt: 1 })
      .limit(Number(limit));

    const leadIds = leads.map((lead) => lead._id);

    await Lead.updateMany(
      { _id: { $in: leadIds } },
      {
        $set: {
          assignedTo: agentId,
          assignedDate: new Date(),
          status: "ASSIGNED",
        },
      },
    );

    res.json({
      success: true,
      message: `${leadIds.length} leads assigned to ${agent.name}`,
      assignedCount: leadIds.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const { status, remarks, followUpDate, dealAmount = 0 } = req.body;

    const updateData = {
      status,
      remarks,
      lastCallDate: new Date(),
    };

    if (followUpDate) {
      updateData.followUpDate = new Date(followUpDate);
    }

    if (status === "CONVERTED") {
      updateData.dealAmount = Number(dealAmount);
      updateData.commissionAmount = Number(dealAmount) * 0.2;
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("assignedTo", "name phone");

    res.json({
      success: true,
      message: "Lead updated",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.exportAssignedLeads = async (req, res) => {
  try {
    const { agentId, status } = req.query;

    const filter = {};

    if (agentId) filter.assignedTo = agentId;
    if (status) filter.status = status;

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name phone")
      .sort({ createdAt: 1 });

    const fileName = `leads-${Date.now()}.xlsx`;
    const filePath = exportLeadsToExcel(leads, fileName);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const statusStats = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const agentStats = await Lead.aggregate([
      {
        $match: {
          assignedTo: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          totalLeads: { $sum: 1 },
          converted: {
            $sum: {
              $cond: [{ $eq: ["$status", "CONVERTED"] }, 1, 0],
            },
          },
          totalDealAmount: { $sum: "$dealAmount" },
          totalCommission: { $sum: "$commissionAmount" },
        },
      },
      {
        $lookup: {
          from: "agents",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
    ]);

    res.json({
      success: true,
      data: {
        statusStats,
        agentStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
