const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reservationsModels = new Schema(
  {
    park_name: { type: String, required: true },
    park_place: { type: String, required: true },
    block: { type: String, required: true },
    No: { type: String, required: true },
    time: { type: Number, required: true },
    time_: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    pay: { type: Number, required: true },
    state: { type: Boolean, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reservations", reservationsModels);
