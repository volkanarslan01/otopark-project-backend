const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reservations = new Schema(
  {
    park_name: { type: String, required: true },
    park_place: { type: String, required: true },
    block: { type: String, required: true },
    no: { type: Number, required: true },
    time: { type: Number, required: true },
    time_: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    pay: { type: String, required: true },
    state: { type: Boolean, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reservations", reservations);
