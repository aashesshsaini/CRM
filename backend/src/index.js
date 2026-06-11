require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5005;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server is listen on PORT ${PORT}`);
  });
})();
