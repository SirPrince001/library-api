require("dotenv").config();
const Mongoose = require("mongoose");
module.exports = {
  connectDB: () => {
    Mongoose.connect(process.env.MONGODB_URL);
    const dbConnection = Mongoose.connection;
    dbConnection.once("open", () => {
      console.log("DB Connected");
    });
    dbConnection.on("error", (err) => {
      console.log(err);
    });
  },
};
