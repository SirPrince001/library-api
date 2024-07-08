const Mongoose = require("mongoose");
const userSchema = new Mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      eum: ["user", "librarian"],
      default: "user",
    },
  },
  { timestamps: true }
);
module.exports = Mongoose.model("User", userSchema);
