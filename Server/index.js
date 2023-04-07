const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const parkRoute = require("./Routes/parkRoutes.js");
const userRoute = require("./Routes/userRoutes.js");
// ? cors page content
const cors = require("./config/corsOptions");
// ! middleware
app.use(cors);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", parkRoute);
app.use("/api", userRoute);
// * Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    // ? listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
