const express = require("express");
const parkDb = require("../model/mongodb_handler.js");
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
  res.json({ msg: "New Park" });
});
module.exports = router;
