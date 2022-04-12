const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    retailorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Retailor",
    },
    retailorName: {
        type: String,
        required: true
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: "String",
      required: true,
      default: "In Process",
      enum: ["Accepted", "Rejected", "In Process"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
