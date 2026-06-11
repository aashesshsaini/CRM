const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    category: String,
    city: String,
    address: String,
    website: String,
    mapLink: String,
    rating: String,
    reviews: String,

    source: {
      type: String,
      default: "GOOGLE_MAPS",
    },

    status: {
      type: String,
      enum: [
        "NEW",
        "ASSIGNED",
        "CALLED",
        "INTERESTED",
        "NOT_INTERESTED",
        "FOLLOW_UP",
        "WRONG_NUMBER",
        "CONVERTED",
      ],
      default: "NEW",
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },

    assignedDate: Date,
    lastCallDate: Date,
    followUpDate: Date,

    remarks: String,

    dealAmount: {
      type: Number,
      default: 0,
    },

    commissionPercent: {
      type: Number,
      default: 20,
    },

    commissionAmount: {
      type: Number,
      default: 0,
    },

    uniqueKey: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lead", leadSchema);
