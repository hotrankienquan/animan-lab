const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("connect success!");
  } catch (e) {
    console.log("connect failed: " + e.message);
  }
}

module.exports = { connect };