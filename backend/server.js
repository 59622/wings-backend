import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// Serve uploaded images
app.use("/uploads", express.static(UPLOAD_DIR));

const DB_PATH = path.join(__dirname, "db.json");
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const writeDB = (data) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ---------------- PRODUCTS ----------------

// GET all products
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// POST add product
app.post("/api/products", upload.single("image"), (req, res) => {
  try {
    const db = readDB();
    const { name, category, price, quantity, costPrice } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = {
      id: db.products.length ? db.products[db.products.length - 1].id + 1 : 1,
      name,
      category,
      price: Number(price),
      costPrice: Number(costPrice), // ✅ cost price
      quantity: Number(quantity),
      image,
    };

    db.products.push(newProduct);
    writeDB(db);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save product" });
  }
});

// PUT update product
app.put("/api/products/:id", upload.single("image"), (req, res) => {
  try {
    const db = readDB();
    const product = db.products.find((p) => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, category, price, quantity, costPrice } = req.body;
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = Number(price);
    if (quantity) product.quantity = Number(quantity);
    if (costPrice) product.costPrice = Number(costPrice); // ✅ allow update
    if (req.file) product.image = `/uploads/${req.file.filename}`;

    writeDB(db);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE product
app.delete("/api/products/:id", (req, res) => {
  try {
    const db = readDB();
    const index = db.products.findIndex((p) => p.id === Number(req.params.id));
    if (index === -1)
      return res.status(404).json({ message: "Product not found" });

    db.products.splice(index, 1);
    writeDB(db);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// ---------------- SALES ----------------

// POST record multiple sales
app.post("/api/sales", (req, res) => {
  try {
    const db = readDB();
    const { items } = req.body; // items = [{ productId, quantity }, ...]

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "No items provided" });

    // Check all products exist and have enough stock
    for (let item of items) {
      const product = db.products.find(
        (p) => String(p.id) === String(item.productId)
      );
      if (!product)
        return res
          .status(404)
          .json({ message: `Product not found: ID ${item.productId}` });
      if (item.quantity > product.quantity)
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
    }

    // Deduct stock and create sales
    const newSales = items.map((item) => {
      const product = db.products.find(
        (p) => String(p.id) === String(item.productId)
      );
      product.quantity -= Number(item.quantity);

      return {
        id: db.sales.length ? db.sales[db.sales.length - 1].id + 1 : 1,
        productId: product.id,
        quantity: Number(item.quantity),
        date: new Date().toISOString(),
      };
    });

    // Add sales to db
    db.sales.push(...newSales);
    writeDB(db);

    res.status(201).json(newSales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to record sales" });
  }
});

// ---------------- REPORTS ----------------

// GET reports
app.get("/api/reports", (req, res) => {
  try {
    const db = readDB();

    const reports = db.products.map((product) => {
      const sold = db.sales
        .filter((s) => s.productId === product.id)
        .reduce((sum, s) => sum + s.quantity, 0);

      const remaining = product.quantity;
      const revenue = sold * product.price;
      const profit = sold * (product.price - product.costPrice); // ✅ new profit

      return {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice,
        sold,
        remaining,
        revenue,
        profit,
      };
    });

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load reports" });
  }
});

// ---------------- SERVER ----------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
