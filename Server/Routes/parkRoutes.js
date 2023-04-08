const express = require("express");
const parkDb = require("../model/park_apiModelsjs");
const router = express.Router();
// router.post("/", createOtopark);
router.post("/park", async (req, res) => {
  const { name, place, hourly_pay, block } = req.body;
  const newPark = await new parkDb({
    name: name,
    place: place,
    hourly_pay: hourly_pay,
    block: block,
  });
  newPark.save();
});
module.exports = router;
