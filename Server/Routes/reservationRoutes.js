const express = require("express");
const reservationsModel = require("../model/reservationsModel.js");
const router = express.Router();

router.post("/reservations", async (req, res) => {
  let { userID } = req.body;
  if (userID != "" || userID != undefined || userID != null) {
    res.send(true);
    await router.get("/reservations", async (req, res) => {
      const getReservations = await reservationsModel.findById(
        "646dd1840b4457223e5ee9b1"
      );
      res.send(getReservations);
    });
  }
});

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
