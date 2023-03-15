const { user } = require("../model/mongodb_handler");
const mongoose = require("mongoose");

const createUser = async (req, res) => {
  const { name, surname, plate, email, password } = req.body;
  try {
    const users = await user.create({
      name,
      surname,
      plate,
      email,
      password,
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  createUser,
};
