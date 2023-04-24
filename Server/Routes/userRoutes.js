const express = require("express");
const app = express();
const userDB = require("../model/userModel.js");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
let emailValid;
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let emailValid = await userDB.findOne({ email });
  if (!emailValid) {
    return res.json({ msg: "User not found" });
  }
  const isValid = await bcrypt.compare(password, emailValid.password);
  if (!isValid) {
    return res.json({ message: "Username or password is incorrect" });
  }

  const token = jwt.sign({ id: emailValid._id }, "secret");
  res.json({ token: token, user_ID: emailValid._id });
});

module.exports = router;
console.log(emailValid);
router.get("/users", async (req, res) => {
  const user = await userDB.findById(emailValid);
  res.send(user);
});

// router.put("/update", async (req, res) => {
//   const { name } = req.body;
//   const email = await userDB.findById("642fde6a5015b05ace09f3c5");
//   console.log(email);
//   userDB.updateOne({ email: email.email }, { $set: { name: name } });
//   res.send({ msg: "Updated Succesful" });
// });
