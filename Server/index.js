const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
//! import hash
const bcrypt = require("bcrypt");
const saltRounds = 10;

//? jsonwebtoken

const jwt = require("jsonwebtoken");

// ! Modules

// ? use express
const app = express();

// ? mysql page connect
const db = require("./Middleware/mysqlHandler.js");
const db2 = require("./Middleware/mysql2Handler.js");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // ??

app.use(
  session({
    key: "userId ",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 60 * 60 * 24 },
  })
);

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

// ? login
let email = "";
app.post("/login", (req, res) => {
  email += req.body.email;
  const password = req.body.password;
  db.query("SELECT * FROM user WHERE email = ?", email, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      //? hash parse
      console.log(result);
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesful");
          res.send(response);
        }
      });
    }
  });
});

// ? last get
app.get("/last", (req, res) => {
  let sql = "SELECT * FROM last_reservation where email = ?";
  db.query(sql, [email], (err, rows) => {
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

// ? users get
app.get("/users", (req, res) => {
  let sql = "Select * from user where email = ? ";
  db.query(sql, [email], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

// * park controller
app.get("/lastPark", (req, res) => {
  let sql = "SELECT * FROM otopark";
  db2.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
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

// ?  port listen listen all finally
app.listen(3004, () => {
  console.log("server running on 3004");
});
