import React, { useEffect, useState } from "react";
const API = "http://localhost:5000/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    costPrice: "",
    price: "",
    quantity: "",
    image: null,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    loadProducts();
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null) data.append(k, v);
    });
    const url = editingId ? `${API}/products/${editingId}` : `${API}/products`;
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, body: data });
    setFormData({
      name: "",
      category: "",
      costPrice: "",
      price: "",
      quantity: "",
      image: null,
    });
    setEditingId(null);
    setShowForm(false);
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      costPrice: product.costPrice || "",
      price: product.price,
      quantity: product.quantity,
      image: null,
    });
    setShowForm(true);
  };

  return (
    <div className="products-page" style={{ padding: "20px" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "white",
        }}
      >
        Products Dashboard
      </h2>

      {/* Product Cards Grid */}
      <div
        className="products-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {products.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No products available
          </p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="product-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
                width: "250px",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {p.image ? (
                <img
                  src={`http://localhost:5000${p.image}`}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    backgroundColor: "#f0f0f0",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    color: "#999",
                  }}
                >
                  No Image
                </div>
              )}

              <div style={{ marginTop: "10px", flexGrow: 1 }}>
                <h3>{p.name}</h3>
                <p>
                  <strong>Category:</strong> {p.category}
                </p>
                <p>
                  <strong>Cost Price:</strong> M{p.costPrice}
                </p>
                <p>
                  <strong>Selling Price:</strong> M{p.price}
                </p>
                <p>
                  <strong>Available:</strong> {p.quantity}
                </p>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toggle Form */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ marginTop: "30px" }}
      >
        {showForm ? "Hide Form" : "Add New Product"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "400px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="costPrice"
            placeholder="Cost Price"
            value={formData.costPrice}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Selling Price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
          />
          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}
    </div>
  );
}
