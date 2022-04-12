const express = require("express");
const farmerAuth = require("../middleware/farmerAuth");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = new express.Router();

// new product
router.post("/", farmerAuth, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      remainingQuantity: req.body.quantity,
      farmerId: req.farmer._id,
      farmerName: req.farmer.name,
    });
    await product.save();
    res.send({
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.send({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update product
router.patch("/:id", farmerAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedupdates = ["name", "quantity", "price", "category"];
  const operation = updates.every((update) => allowedupdates.includes(update));
  if (!operation) {
    return res.status(400).send({
      error: "Invalid updates!",
    });
  }
  try {
    const product = await Product.findOne({
      farmerId: req.farmer._id,
      _id: req.params.id,
    });
    if (!product) {
      return res.status(404).send({
        error: "Product Not Found!",
      });
    }
    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    res.send({ product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete product
router.delete("/:id", farmerAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      farmerId: req.farmer._id,
      _id: req.params.id,
    });
    await product.remove();
    res.send({
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get all orders
router.get("/:id", farmerAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      farmerId: req.farmer._id,
    });
    if (!product) {
      return res.status(404).send({
        error: "Product Not Found!",
      });
    }
    const orders = await Order.find({
      productId: req.params.id,
    });
    res.send({
      product,
      orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Change

module.exports = router;
