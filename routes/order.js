const express = require("express");
const farmerAuth = require("../middleware/farmerAuth");
const retailorAuth = require("../middleware/retailorAuth");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = new express.Router();

// Place order
router.post("/", retailorAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.body.productId,
    });
    if (!product) {
      return res.status(404).send({
        error: "Product Not Found!",
      });
    }
    if (product.remainingQuantity < req.body.quantity) {
      return res.status().send({
        error: "Quantity not available. Please look for some different farmer!",
      });
    }
    const order = new Order({
      ...req.body,
      status: "In Process",
      retailorId: req.retailor._id,
      retailorName: req.retailor.name,
      name: product.name,
      price: product.price,
    });
    await order.save();
    res.send({
      order,
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", retailorAuth, async (req, res) => {
  try {
    const orders = await Order.find({ retailorId: req.retailor._id });
    res.send({ orders });
  } catch (e) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id", farmerAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) {
      return res.status(404).send({
        error: "Order Not Found!",
      });
    }
    const product = await Product.findOne({
      _id: order.productId,
      farmerId: req.farmer._id,
    });
    if (!product) {
      return res.status(404).send({
        error: "Product Not Found!",
      });
    }
    if (order.status === "Accepted" || order.status === "Rejected") {
      return res.status(400).send({
        error: "Order Already Processed",
      });
    }
    if (product.remainingQuantity < req.body.quantity) {
      return res.status().send({
        error: "Quantity not available.",
      });
    }
    order.status = req.body.status;
    await order.save();
    if (order.status === "Accepted") {
      product.remainingQuantity = product.remainingQuantity - order.quantity;
      await product.save();
    }
    res.send({ order, product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
