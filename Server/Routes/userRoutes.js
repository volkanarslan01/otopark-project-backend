const express = require("express");
const userDB = require("../model/userModel.js");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { name, surname, plate, email, password } = req.body;
  const emailValid = await userDB.findOne({ email });
  if (emailValid) {
    return res.json({ msg: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 15);
  const newUser = await new userDB({
    name: name,
    surname: surname,
    plate: plate,
    email: email,
    password: hashedPassword,
  });
  newUser.save();
  res.json({ msg: "User saved successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const emailValid = await userDB.findOne({ email });
  if (!emailValid) {
    return res.json({ msg: "User not found" });
  }

  const isValid = await bcrypt.compare(password, emailValid.password);
  if (!isValid) {
    return res.json({ message: "Username or password is incorrect" });
  }

  const token = jwt.sign({ id: emailValid._id }, "secret");
  res.json({ token: token, user_ID: emailValid._id });
  console.log(token);
});

module.exports = router;
