import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Setup multer for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get all products
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Add product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    const image = req.file ? req.file.filename : null;
    const result = await db.query(
      "INSERT INTO products (name, category, price, quantity, image) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, category, price, quantity, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    let query, values;

    if (req.file) {
      query = `UPDATE products SET name=$1, category=$2, price=$3, quantity=$4, image=$5 WHERE id=$6 RETURNING *`;
      values = [name, category, price, quantity, req.file.filename, id];
    } else {
      query = `UPDATE products SET name=$1, category=$2, price=$3, quantity=$4 WHERE id=$5 RETURNING *`;
      values = [name, category, price, quantity, id];
    }

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id=$1", [req.params.id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
