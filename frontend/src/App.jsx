import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import ProductsPage from "./components/Products";
import SalesForm from "./components/SalesForm";
import Report from "./components/Report";
import StockOverview from "./components/Stock"; 
import "./styles.css";

const API = "http://localhost:5000/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("dashboard");
  const [report, setReport] = useState([]);

  // Load products
  async function loadProducts() {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Cannot load products. Is the backend running?");
    }
  }

  // Load reports (includes sold, remaining, revenue)
  async function loadReport() {
    try {
      const res = await fetch(`${API}/reports`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error loading report:", err);
      alert("Cannot load reports. Is the backend running?");
    }
  }

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Wings Cafe Inventory</h1>
        <nav>
          <button onClick={() => setView("dashboard")}>Dashboard</button>
          <button onClick={() => setView("products")}>Products</button>
          <button onClick={() => setView("sales")}>Record Sale</button>
          <button
            onClick={() => {
              loadReport();
              setView("report");
            }}
          >
            Reports
          </button>
          <button
            onClick={() => {
              loadReport(); // make sure stock view has latest sales
              setView("stock");
            }}
          >
            Stock Overview
          </button>
        </nav>
      </header>

      <div className="content">
        <main>
          {view === "dashboard" && <Dashboard products={products} />}
          {view === "products" && (
            <ProductsPage products={products} reload={loadProducts} />
          )}
          {view === "sales" && (
            <SalesForm products={products} onSaved={loadProducts} />
          )}
          {view === "report" && <Report data={report} />}
          {view === "stock" && (
            // Only pass report; StockOverview uses sold/remaining from it
            <StockOverview report={report} />
          )}
        </main>
      </div>

      <footer>© Wings Cafe Inventory</footer>
    </div>
  );
}
