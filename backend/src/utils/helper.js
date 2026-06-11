function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanPhone(phone = "") {
  return String(phone).replace(/\D/g, "").slice(-10);
}

function makeUniqueKey({ phone, name, address }) {
  const cleanedPhone = cleanPhone(phone);

  if (cleanedPhone.length === 10) {
    return `PHONE_${cleanedPhone}`;
  }

  return `NAME_ADDR_${String(name || "")
    .toLowerCase()
    .trim()}_${String(address || "")
    .toLowerCase()
    .trim()}`;
}

function getCategoryFromQuery(query) {
  return query.split(" in ")[0] || "";
}

function getCityFromQuery(query) {
  return query.split(" in ")[1] || "";
}

module.exports = {
  sleep,
  cleanPhone,
  makeUniqueKey,
  getCategoryFromQuery,
  getCityFromQuery,
};
