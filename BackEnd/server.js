const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const hostname = "localhost";
const userRoutes = require("./src/routes/user.route");
const productRoutes = require("./src/routes/product.route");
const reviewRoutes = require("./src/routes/review.route");
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
