const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const park_db = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: { type: String, required: true },
    plate: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("park_db", park_db);
