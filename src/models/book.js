const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    match: /^\d{13}$/,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  quantity:{
    type: Number,
    required: true,
    default: 1,
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Book", bookSchema);
