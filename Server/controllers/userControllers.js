const { otopark_Api } = require("../model/mongodb_handler");
const mongoose = require("mongoose");

const createOtopark = async (req, res) => {
  const { name, place, hourly_pay, block } = req.body;
  try {
    const createPark = await otopark_Api.create({
      name,
      place,
      hourly_pay,
      block,
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  createOtopark,
};
