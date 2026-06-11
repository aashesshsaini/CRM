const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

function exportLeadsToExcel(leads, fileName = "leads.xlsx") {
  const exportDir = path.join(__dirname, "../../exports");

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  const formattedLeads = leads.map((lead) => ({
    ID: lead._id.toString(),
    Name: lead.name || "",
    Phone: lead.phone || "",
    Category: lead.category || "",
    City: lead.city || "",
    Address: lead.address || "",
    Website: lead.website || "",
    MapLink: lead.mapLink || "",
    Status: lead.status || "",
    AssignedTo: lead.assignedTo?.name || "",
    Remarks: lead.remarks || "",
    FollowUpDate: lead.followUpDate || "",
    DealAmount: lead.dealAmount || 0,
    CommissionAmount: lead.commissionAmount || 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedLeads);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  const filePath = path.join(exportDir, fileName);

  XLSX.writeFile(workbook, filePath);

  return filePath;
}

module.exports = {
  exportLeadsToExcel,
};
