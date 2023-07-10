const express = require("express");
const reservationsModels = require("../model/reservationsModel.js");
const reservationsModel = require("../model/reservationsModel.js");
const router = express.Router();
router.post("/reservations", async (req, res) => {
  let { _email } = req.body;
  const r = await reservationsModel.find({ email: _email });
  if (r != []) {
    res.send({ result: r });
  }
});
module.exports = router;
