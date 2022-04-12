require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

const port = process.env.PORT || 5000;

const farmerAuthRoute = require("./routes/farmerAuth");
const retailorAuthRoute = require("./routes/retailorAuth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const publicRoute = require("./routes/public");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(helmet()); //helps in securing HTTP headers. It sets up various HTTP headers to prevent attacks like Cross-Site-Scripting(XSS), clickjacking, etc
app.use(morgan("common"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS, PATCH"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hii");
});

app.use("/farmers", farmerAuthRoute);
app.use("/retailors", retailorAuthRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/public", publicRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
