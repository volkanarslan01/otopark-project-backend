const express = require("express");
const reservationsModels = require("../model/reservationsModel.js");
const reservationsModel = require("../model/reservationsModel.js");
const router = express.Router();
router.post("/reservations", async (req, res) => {
  let { _email } = req.body;
  const r = await reservationsModel.find({ email: _email });
  res.send({ result: r });
});

router.post("/reservations/create", async (req, res) => {
  const {
    park_name,
    park_place,
    block,
    No,
    time,
    time_,
    name,
    surname,
    pay,
    state,
    email,
  } = req.body;
  console.log(park_name, block, name, surname, pay, state, email);
  const newReservations = await new reservationsModels({
    park_name: park_name,
    park_place: park_place,
    block: block,
    No: No,
    time: time,
    time_: time_,
    name: name,
    surname: surname,
    pay: pay,
    state: state,
    email: email,
  });
  newReservations.save();
  res.send({ msg: "Reservations saved succesful" });
});
module.exports = router;
