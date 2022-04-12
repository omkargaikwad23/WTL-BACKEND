const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const RetailorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 50
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    mobile: {
      type: String,
      max: 10,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      max: 50,
      required: true
    },
    address: {
      type: String,
      max: 50,
      required: true
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

RetailorSchema.methods.toJSON = function () {
  const retailor = this;
  const retailorObject = retailor.toObject();
  delete retailorObject.password;
  delete retailorObject.tokens;
  return retailorObject;
};

RetailorSchema.methods.generateAuthToken = async function () {
  const retailor = this;
  const token = await jwt.sign(
    { _id: retailor._id.toString() },
    process.env.JWT_SECRET
  );
  retailor.tokens = retailor.tokens.concat({ token });
  await retailor.save();
  return token;
};

RetailorSchema.statics.findByCredentials = async (email, password) => {
  const retailor = await Retailor.findOne({ email });
  if (!retailor) {
    throw new Error("Unable to login");
  }
  const ismatch = await bcrypt.compare(password, retailor.password);
  if (!ismatch) {
    throw new Error("Unale to login");
  }
  return retailor;
};

RetailorSchema.pre("save", async function (next) {
  const retailor = this;
  if (retailor.isModified("password")) {
    retailor.password = await bcrypt.hash(retailor.password, 8);
  }
  next();
});

const Retailor = mongoose.model("Retailor", RetailorSchema);
module.exports = Retailor
