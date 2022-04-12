const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const FarmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 50,
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
      required: true,
      max: 50,
    },
    address: {
      type: String,
      required: true,
      max: 50,
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

FarmerSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "farmerId",
});

FarmerSchema.methods.toJSON = function () {
  const farmer = this;
  const farmerObject = farmer.toObject();
  delete farmerObject.password;
  delete farmerObject.tokens;
  return farmerObject;
};

FarmerSchema.methods.generateAuthToken = async function () {
  const farmer = this;
  const token = await jwt.sign(
    { _id: farmer._id.toString() },
    process.env.JWT_SECRET
  );
  farmer.tokens = farmer.tokens.concat({ token });
  await farmer.save();
  return token;
};

FarmerSchema.statics.findByCredentials = async (email, password) => {
  const farmer = await Farmer.findOne({ email });
  if (!farmer) {
    throw new Error("Unable to login");
  }
  const ismatch = await bcrypt.compare(password, farmer.password);
  if (!ismatch) {
    throw new Error("Unale to login");
  }
  return farmer;
};

FarmerSchema.pre("save", async function (next) {
  const farmer = this;
  if (farmer.isModified("password")) {
    farmer.password = await bcrypt.hash(farmer.password, 8);
  }
  next();
});

const Farmer = mongoose.model("Farmer", FarmerSchema);
module.exports = Farmer;
