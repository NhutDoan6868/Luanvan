const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const hostname = "localhost";
const userRoutes = require("./src/routes/user.route");
const productRoutes = require("./src/routes/product.route");
const reviewRoutes = require("./src/routes/review.route");
const favoriteRoutes = require("./src/routes/favorite.route");
const promotionRoutes = require("./src/routes/promotion.route");
const priceRoutes = require("./src/routes/price.route");
const paymentRoutes = require("./src/routes/payment.route");
const orderRoutes = require("./src/routes/order.route");
const cartRoutes = require("./src/routes/card.route");
const categoryRoutes = require("./src/routes/category.route");
const addressRoutes = require("./src/routes/address.route");
const orderItemRoutes = require("./src/routes/orderItem.route");
const subcategoryRoutes = require("./src/routes/subcategory.route");
const connection = require("./src/config/database");

app.use(express.json()); // Thêm middleware để parse JSON
app.use(express.urlencoded({ extended: true })); // Thêm middleware để parse form-data

app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/nani", (req, res) => {
  res.render("sample.ejs");
});
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/promotion", promotionRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orderItem", orderItemRoutes);
app.use("/api/subcategory", subcategoryRoutes);

(async () => {
  try {
    await connection();

    app.listen(port, hostname, () => {
      console.log(`Server is running at http://${hostname}:${port}`);
    });
    console.log("Kết nối đến cơ sở dữ liệu thành công");
  } catch (error) {
    console.error("Lỗi kết nối đến cơ sở dữ liệu:", error);
  }
})();
