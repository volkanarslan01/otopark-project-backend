const express = require("express");
const feedbackModels = require("../model/feedbackModels.js");
const router = express.Router();

router.post("/feedback", async (req, res) => {
  const { name, surname, email, content } = req.body;

  const newFeedbacks = await new feedbackModels({
    name: name,
    surname: surname,
    email: email,
    content: content,
  });

  newFeedbacks.save();

  res.json({ msg: "feedback saved succesful" });
});

module.exports = router;
