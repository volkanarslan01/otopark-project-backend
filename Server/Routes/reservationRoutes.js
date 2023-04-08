const express = require("express");
const reservationsModel = require("../model/reservationsModel.js");
const router = express.Router();

router.post("/reservation", async (req, res) => {
  const {
    park_name,
    park_place,
    time,
    time_,
    name,
    surname,
    pay,
    state,
    email,
  } = req.body;

  const newReservation = await new reservationsModel({
    park_name: park_name,
    park_place: park_place,
    time: time,
    time_: time_,
    name: name,
    surname: surname,
    pay: pay,
    state: state,
    email: email,
  });
  newReservation.save();

  res.json({ msg: "Reservations saved successfully" });
});
module.exports = router;
