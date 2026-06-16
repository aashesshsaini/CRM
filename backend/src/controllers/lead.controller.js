const Lead = require("../models/Lead.model");
const Agent = require("../models/Agent.model");
const { exportLeadsToExcel } = require("../services/excel.service");
const { buildLeadFilters } = require("../utils/leadFilters");

exports.getLeads = async (req, res) => {
  try {
    const {
      status,
      city,
      category,
      assignedTo,
      search,
      limit = 25,
      page = 1,
    } = req.query;

    const filter = buildLeadFilters({ status, city, category, assignedTo });

    if (req.agent.role === "CALLER") {
      filter.assignedTo = req.agent._id;
    }

    if (search) {
      const pattern = new RegExp(
        String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
      filter.$or = [{ name: pattern }, { phone: pattern }];
    }

    const numericLimit = Math.min(Number(limit) || 25, 100);
    const numericPage = Math.max(Number(page) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate("assignedTo", "name phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      count: leads.length,
      data: leads,
      totalPages: Math.ceil(total / numericLimit),
      page: numericPage,
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

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: "agentId is required",
      });
    }

    const agent = await Agent.findById(agentId);

    if (!agent || !agent.isActive) {
      return res.status(404).json({
        success: false,
        message: "Agent not found or inactive",
      });
    }

    const baseFilter = {
      status: "NEW",
      assignedTo: null,
      ...buildLeadFilters({ city, category }),
    };

    const batchSize = Math.min(Number(limit) || 100, 500);
    const assignedLeads = [];

    for (let i = 0; i < batchSize; i++) {
      const lead = await Lead.findOneAndUpdate(
        baseFilter,
        {
          $set: {
            assignedTo: agentId,
            assignedDate: new Date(),
            status: "ASSIGNED",
          },
        },
        { sort: { createdAt: 1 }, new: true },
      );

      if (!lead) break;
      assignedLeads.push(lead);
    }

    res.json({
      success: true,
      message: `${assignedLeads.length} leads assigned to ${agent.name}`,
      assignedCount: assignedLeads.length,
      assigned: assignedLeads.length,
      data: assignedLeads,
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

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      req.agent.role === "CALLER" &&
      String(lead.assignedTo) !== String(req.agent._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update leads assigned to you",
      });
    }

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

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    ).populate("assignedTo", "name phone");

    res.json({
      success: true,
      message: "Lead updated",
      data: updatedLead,
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

    const filter = buildLeadFilters({ status, assignedTo: agentId });

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name phone")
      .sort({ createdAt: 1 })
      .limit(10000);

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
          interested: {
            $sum: {
              $cond: [{ $eq: ["$status", "INTERESTED"] }, 1, 0],
            },
          },
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

    const byStatus = {};
    let total = 0;

    for (const item of statusStats) {
      byStatus[item._id] = item.count;
      total += item.count;
    }

    const totals = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalDealAmount: { $sum: "$dealAmount" },
          totalCommission: { $sum: "$commissionAmount" },
        },
      },
    ]);

    const agentPerformance = agentStats.map((item) => ({
      _id: item._id,
      name: item.agent?.name || "Unknown",
      assigned: item.totalLeads,
      interested: item.interested,
      converted: item.converted,
      dealAmount: item.totalDealAmount,
    }));

    res.json({
      success: true,
      data: {
        total,
        byStatus,
        totalDealAmount: totals[0]?.totalDealAmount || 0,
        totalCommission: totals[0]?.totalCommission || 0,
        agentPerformance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
