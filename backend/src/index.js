require("dotenv").config();
const app = require("./app");
const Agent = require("./models/Agent.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 5005;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await Agent.findOne({
      email: "admin@crm.com",
    });

    if (!admin) {
      await Agent.create({
        name: "Aashessh Saini",
        email: "admin@crm.com",
        password: await bcrypt.hash("12345678", 10),
        role: "ADMIN",
        phone: "9053916095",
      });
    }
    console.log("MongoDB connectedddddd");
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server is listen on PORT ${PORT}`);
  });
})();
