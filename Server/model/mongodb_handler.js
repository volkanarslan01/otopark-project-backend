const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otopark_Api = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    place: { type: String, required: true },
    hourly_pay: { type: Number, required: true },
    block: {
      A: { type: Array, required: true },
      B: { type: Array, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otopark_Api", otopark_Api);
