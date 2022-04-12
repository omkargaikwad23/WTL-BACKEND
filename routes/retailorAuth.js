const router = require("express").Router();
const Retailor = require("../models/Retailor");
const bcrypt = require("bcrypt");
const retailorAuth = require("../middleware/retailorAuth");

router.get("/", (req, res) => {
  res.send("Welcome to retailor auth");
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // generate encrypted password
    const retailor = new Retailor(req.body);
    await retailor.save();
    const token = await retailor.generateAuthToken();
    res.status(200).json({ retailor, token });
  } catch (err) {
    console.log(err);
    if (err?.keyPattern?.email) {
      return res.status(400).send({
        error: "Email Already Exists!",
      });
    }
    if (err?.keyPattern?.mobile) {
      return res.status(400).send({
        error: "Mobile Already Exists!",
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const retailor = await Retailor.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await retailor.generateAuthToken();
    res.status(200).json({ retailor, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to login!" });
  }
});

// Get Retailor
router.get("/me", retailorAuth, async (req, res) => {
  try {
    res.send(req.retailor);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Logout Retailor
router.post("/logout", retailorAuth, async (req, res) => {
  try {
    req.retailor.tokens = req.retailor.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.retailor.save();
    res.send({ msg: "Logged Out" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
