const router = require("express").Router();
const farmerAuth = require("../middleware/farmerAuth");
const Farmer = require("../models/Farmer");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // generate encrypted password
    const farmer = new Farmer(req.body);
    await farmer.save();
    const token = await farmer.generateAuthToken();
    res.status(200).json({ farmer, token });
  } catch (err) {
    console.log(err);
    if(err?.keyPattern?.email) {
      return res.status(400).send({
        error: "Email Already Exists!"
      })
    }
    if(err?.keyPattern?.mobile) {
      return res.status(400).send({
        error: "Mobile Already Exists!"
      })
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const farmer = await Farmer.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await farmer.generateAuthToken();
    res.status(200).json({ farmer, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to login!" });
  }
});

// get farmers
router.get("/me", farmerAuth, (req, res) => {
  try {
    res.send(req.farmer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to login!" });
  }
});

// logout farmers
router.post("/logout", farmerAuth, async (req, res) => {
  try {
    req.farmer.tokens = req.farmer.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.farmer.save();
    res.send({ msg: "Logged Out" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
