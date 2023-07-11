const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const parkRoute = require("./Routes/parkRoutes.js");
const userRoute = require("./Routes/userRoutes.js");
const feedbackRoutes = require("./Routes/feedbackRoutes.js");
const reservationsRoute = require("./Routes/reservationRoutes.js");
// ? cors page content
const cors = require("./config/corsOptions");
// ! middleware
app.use(cors);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", parkRoute);
app.use("/api", userRoute);
app.use("/api", feedbackRoutes);  
app.use("/api", reservationsRoute);
// * Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    // ? listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`connected to db & listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
