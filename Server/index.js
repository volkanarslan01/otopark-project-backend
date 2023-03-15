const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
// ? use express
const app = express();

// ? mysql page connect

mongoose.connect(process.env.MONGO_DB).then(() => {});

const db = require("./model/mysqlHandler.js");
const db2 = require("./model/mysql2Handler.js");

// ? cors page content

const cors = require("./config/corsOptions");

// ! middleware

app.use(cors);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // ??
app.use("/api/user", userRoutes);

// ! lastReservation Process
app.post("/lastReservations", (req, res) => {
  const time_1 = req.body.time_1;
  const time_2 = req.body.time_2;
  const parkName = req.body.parkName;
  const place = req.body.place;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const pay = req.body.pay;
  const state = req.body.state;
  const email = req.body.email;
  const now = req.body.date;
  let sql =
    "INSERT INTO last_reservation (parkName,place,time_1,firstName,lastName,pay,state,email,time_2) Values (?,?,?,?,?,?,?,?,?)";

  db.query(
    sql,
    [parkName, place, time_1, firstName, lastName, pay, state, email, time_2],
    (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.send(rows);
        console.log(rows);
      }
    }
  );
});

// ! register
app.post("/register", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const plate = req.body.plate;
  const password = req.body.password;
  const sql =
    "INSERT INTO user (first_name,last_name,plate,email,password) VALUES (?,?,?,?,?)";
  // ? use hash password
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      console.log(hash);
    }
    db.query(sql, [firstName, lastName, plate, email, hash], (err, result) => {
      if (err) {
        res.send(err);
      } else {
        console.log(result);
      }
    });
  });
});

// app.get("/posts", (req, res) => {
//   // authenticateToken;
//   res.json(posts.filter((post) => post.username === req.user.name));
// });

let _email;
// ? login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = { email: email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      //? hash parse
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) {
          console.log(err);
        } else if (response === false) {
          res.send({ message: "email and password combination does not" });
        } else if (response === true) {
          res.send({ message: "Succesful" });
          _email = req.body.email;
        }
      });
    } else {
      res.send({ message: "User doesnt exits" });
    }
  });
});

app.get("/users", (req, result) => {
  let sql = "Select * from user where email = ? ";
  db.query(sql, [_email], (err, rows) => {
    if (err) {
      result.send(err);
    }
    result.send(rows);
    // ? last get
  });
});

app.get("/last", (req, res) => {
  let sql = "SELECT * FROM last_reservation where email = ?";
  db.query(sql, [_email], (err, rows) => {
    if (err) {
      res.send(err);
    }
    res.send(rows);
  });
});

// ? otopark get
app.get("/otopark", (req, res) => {
  let sql = "Select * from otopark ";
  db2.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

// ! update process
app.put("/update", (req, res) => {
  const kat = req.body.kat_state;
  const parkName = req.body.park_name;
  let sql = "UPDATE otopark SET kat_state = ?  WHERE parkName = ? ";
  console.log(kat, parkName);
  db2.query(sql, [kat, parkName], (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.send(rows);
    }
  });
});

// ? date later update
app.put("/update_state", (req, res) => {
  const parkName = req.body.parkName;
  const state = req.body.state;
  const kat_state = req.body.kat_state;
  const sql = "UPDATE last_reservation SET state = ?";
  const sql_2 = "UPDATE otopark SET kat_state = ? where parkName = ?";
  db.query(sql, [state], (err, result) => {
    if (err) {
      res.send(err);
    }
    db2.query(sql_2, [kat_state, parkName], (err, result) => {
      if (err) {
        res.send(err);
      }
    });
  });
});

// ! booking cancellation
app.delete("/cancel", (req, res) => {
  const id = req.body.id;
  const parkName = req.body.parkName;
  const kat_state = req.body.kat_state;
  console.log(id, parkName, kat_state);
  const sql = `DELETE FROM last_reservation WHERE id = ?`;
  const sql_2 = `UPDATE otopark SET kat_state = ? WHERE parkName = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.send(err);
    }
    db2.query(sql_2, [kat_state, parkName], (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        res.send(result);
      }
    });
  });
});

// ? feedback

app.post("/feedback", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const feedback = req.body.feedback;
  let sql = `INSERT INTO feedback (name,surname,email,content) VALUES (?,?,?,?)`;
  db.query(sql, [name, surname, email, feedback], (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

// * all process
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.send("404");
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// ?  port listen listen all finally
app.listen(3004, () => {
  console.log("server running on 3004");
});
