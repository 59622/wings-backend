import React, { useState } from "react";

export default function SalesForm({ products, onSaved }) {
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Filter products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add product to selected list
  const addProduct = (product) => {
    if (selectedProducts.find((p) => p.productId === product.id)) return;

    setSelectedProducts([
      ...selectedProducts,
      { productId: product.id, name: product.name, quantity: 1, price: product.price },
    ]);
    setSearch("");
  };

  // Update quantity for a selected product
  const updateQuantity = (productId, qty) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, quantity: Number(qty) } : p
      )
    );
  };

  // Remove product from selected list
  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
  };

  // Compute total for each product and grand total
  const productTotal = (p) => p.quantity * p.price;
  const grandTotal = selectedProducts.reduce((sum, p) => sum + productTotal(p), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProducts.length) {
      alert("Select at least one product");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedProducts }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Could not record sale");
      } else {
        alert("Sale recorded successfully!");
        setSelectedProducts([]);
        setSearch("");
        onSaved(); // refresh products
      }
    } catch (err) {
      console.error("Error recording sale:", err);
      alert("Could not record sale");
    }
  };

  return (
    <form className="sales-form" onSubmit={handleSubmit} style={{ maxWidth: "700px", margin: "auto" }}>
      <div className="form-group">
        <label>Search Product:</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to search products..."
        />
        {search && filteredProducts.length > 0 && (
          <ul style={{ border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto", margin: 0, padding: "5px", listStyle: "none" }}>
            {filteredProducts.map((p) => (
              <li
                key={p.id}
                onClick={() => addProduct(p)}
                style={{ padding: "5px", cursor: "pointer" }}
              >
                {p.name} (Available: {p.quantity}, Price: M{p.price})
              </li>
            ))}
          </ul>
        )}
        {search && filteredProducts.length === 0 && (
          <p style={{ color: "red" }}>No product found</p>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <h4>Selected Products:</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Product</th>
                <th style={{ borderBottom: "1px solid #ccc" }}>Price</th>
                <th style={{ borderBottom: "1px solid #ccc" }}>Quantity</th>
                <th style={{ borderBottom: "1px solid #ccc" }}>Total</th>
                <th style={{ borderBottom: "1px solid #ccc" }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((p) => (
                <tr key={p.productId}>
                  <td>{p.name}</td>
                  <td>M{p.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={p.quantity}
                      onChange={(e) => updateQuantity(p.productId, e.target.value)}
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>M{productTotal(p)}</td>
                  <td>
                    <button type="button" onClick={() => removeProduct(p.productId)}>
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>Grand Total:</td>
                <td colSpan="2" style={{ fontWeight: "bold" }}>M{grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <button type="submit" style={{ marginTop: "15px", padding: "10px 20px" }}>
        Record Sale
      </button>
    </form>
  );
}
