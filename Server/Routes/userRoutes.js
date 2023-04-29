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
  emailValid = await userDB.findOne({ email });
  if (!emailValid) {
    return res.json({ msg: "User not found" });
  }
  const isValid = await bcrypt.compare(password, emailValid.password);
  if (!isValid) {
    return res.send({ msg: "Password is incorrect" });
  }

  const token = jwt.sign({ id: emailValid._id }, "secret");
  res.json({ token: token, user_ID: emailValid._id });

  router.get("/users", async (req, res) => {
    const user = await userDB.findById(emailValid._id);
    res.send(user);
  });
});

router.post("/validate", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  emailValid = await userDB.findOne({ email });
  const isValid = await bcrypt.compare(password, emailValid.password);
  if (!isValid) {
    return res.send({ msg: "Does not match your old password" });
  }
  return res.send(emailValid._id);
});
router.put("/update", async (req, res) => {
  const { name, surname, plate, email, password, _id } = req.body;
  console.log(name, surname, plate, email, password);
  const emailValid = await userDB.findOne({ _id });
  const find = await userDB.find({ __v: 0 });
  const hashedPassword = await bcrypt.hash(password, 15);
  const users = await userDB.findById(_id);
  find.forEach(async (user) => {
    if (user.email === email) {
      return;
    } else if (emailValid.email == email || user.email != email) {
      return userDB.updateOne(
        { email: users.email },
        {
          $set: {
            name: name,
            surname: surname,
            plate: plate,
            email: email,
            password: hashedPassword,
          },
        }
      );
    }
  });
});
module.exports = router;
