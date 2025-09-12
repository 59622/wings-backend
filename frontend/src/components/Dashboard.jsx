import React from "react";

export default function Dashboard({ products }) {
  return (
    <div className="dashboard">
     <h2 style={{ color: "white", textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "16px" }}>
  Inventory Overview
</h2>

      <div
        className="card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {products.length === 0 ? (
          <p style={{ fontSize: "0.75rem" }}>No products available</p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "6px",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
              }}
            >
              {p.image ? (
                <img
                  src={`http://localhost:5000${p.image}`}
                  alt={p.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    color: "#999"
                  }}
                >
                  No Image
                </div>
              )}
              <h3 style={{ fontSize: "0.9rem", margin: "4px 0" }}>{p.name}</h3>
              <p style={{ fontSize: "0.75rem", margin: "2px 0" }}><strong>Category:</strong> {p.category}</p>
              <p style={{ fontSize: "0.75rem", margin: "2px 0" }}><strong>Price:</strong> M{p.price}</p>
              <p style={{ fontSize: "0.75rem", margin: "2px 0" }}><strong>Available:</strong> {p.quantity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
