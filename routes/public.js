const express = require("express");
const Retailor = require("../models/Retailor");

const router = new express.Router();

router.get("/retailors/:id", async (req, res) => {
  try {
    const retailor = await Retailor.findOne({ _id: req.params.id });
    res.send({ retailor });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
