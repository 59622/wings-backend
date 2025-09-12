import React, { useEffect, useState } from "react";

export default function StockOverview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports");
        if (!res.ok) throw new Error("Failed to fetch stock overview");
        const data = await res.json();

        // Ensure numeric fields
        const formatted = data.map((p) => ({
          ...p,
          price: Number(p.price),
          costPrice: Number(p.costPrice || 0),
          sold: Number(p.sold),
          remaining: Number(p.remaining),
          revenue: Number(p.revenue),
        }));

        // Sort by sold descending (most sold first)
        formatted.sort((a, b) => b.sold - a.sold);

        setProducts(formatted);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch stock overview.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const totalRemaining = products.reduce((sum, p) => sum + p.remaining, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = products.reduce(
    (sum, p) => sum + (p.price - p.costPrice) * p.sold,
    0
  );

  if (loading)
    return (
      <section className="p-6 text-blue-600 font-semibold text-center">
        Loading stock overview...
      </section>
    );

  if (error)
    return (
      <section className="p-6 text-red-600 font-semibold text-center">
        {error}
      </section>
    );

  if (products.length === 0)
    return (
      <section className="p-6 text-gray-600 font-medium text-center">
        No stock data available.
      </section>
    );

  return (
    <section className="p-6">
      <h2
        style={{
          color: "white",
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Stock Overview
      </h2>

      <div className="overflow-x-auto mt-4">
        <table
          className="w-full border border-gray-300 rounded-lg shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <thead
            style={{
              backgroundColor: "#e2e8f0",
              color: "#4a5568",
            }}
          >
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Product</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Cost Price</th>
              <th className="p-3 border">Selling Price</th>
              <th className="p-3 border">Sold</th>
              <th className="p-3 border">Remaining</th>
              <th className="p-3 border">Revenue</th>
              <th className="p-3 border">Profit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => {
              const profit = (p.price - p.costPrice) * p.sold;
              const isLowStock = p.remaining <= 10;

              return (
                <tr
                  key={p.productId}
                  className="text-center"
                  style={{
                    backgroundColor: isLowStock
                      ? "rgba(255, 200, 200, 0.3)"
                      : "white",
                  }}
                >
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border font-medium">{p.name}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">M {p.costPrice.toFixed(2)}</td>
                  <td className="p-2 border">M {p.price.toFixed(2)}</td>
                  <td className="p-2 border">{p.sold}</td>
                  <td className="p-2 border font-semibold">
                    {p.remaining}
                    {isLowStock && (
                      <span
                        style={{
                          marginLeft: "5px",
                          fontSize: "0.7rem",
                          backgroundColor: "rgba(255, 0, 0, 0.2)",
                          color: "red",
                          padding: "1px 4px",
                          borderRadius: "3px",
                        }}
                      >
                        Low
                      </span>
                    )}
                  </td>
                  <td className="p-2 border text-green-600 font-semibold">
                    M {p.revenue.toFixed(2)}
                  </td>
                  <td className="p-2 border text-purple-600 font-semibold">
                    M {profit.toFixed(2)}
                  </td>
                </tr>
              );
            })}

            {/* Totals row */}
            <tr className="font-bold bg-gray-100 text-center">
              <td className="p-2 border" colSpan="5">
                Totals
              </td>
              <td className="p-2 border text-blue-700">{totalSold}</td>
              <td className="p-2 border text-orange-700">{totalRemaining}</td>
              <td className="p-2 border text-green-700">
                M {totalRevenue.toFixed(2)}
              </td>
              <td className="p-2 border text-purple-700">
                M {totalProfit.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
