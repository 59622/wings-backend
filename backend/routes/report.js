import React, { useEffect, useState } from "react";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch reports");
        return res.json();
      })
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        // ✅ Friendly error message instead of old popup
        setError("Unable to fetch reports. Please try again later.");
        setLoading(false);
      });
  }, []);

  const totalSold = reports.reduce((sum, r) => sum + r.sold, 0);
  const totalRemaining = reports.reduce((sum, r) => sum + r.remaining, 0);
  const totalRevenue = reports.reduce((sum, r) => sum + r.revenue, 0);

  if (loading) {
    return (
      <section className="p-6 text-center text-blue-600 font-semibold">
        Reports loading. Please wait...
      </section>
    );
  }

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Sales Reports</h2>

      {/* Inline error message */}
      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      {reports.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Sold</th>
                <th className="p-3 border">Remaining</th>
                <th className="p-3 border">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, index) => (
                <tr key={r.productId} className="text-center hover:bg-gray-100">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border font-medium">{r.name}</td>
                  <td className="p-2 border">{r.category}</td>
                  <td className="p-2 border">M {r.price.toFixed(2)}</td>
                  <td className="p-2 border text-blue-600">{r.sold}</td>
                  <td className="p-2 border text-orange-600">{r.remaining}</td>
                  <td className="p-2 border font-semibold text-green-600">
                    M {r.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Totals row */}
              <tr className="font-bold bg-gray-100 text-center">
                <td className="p-2 border" colSpan="4">
                  Totals
                </td>
                <td className="p-2 border text-blue-700">{totalSold}</td>
                <td className="p-2 border text-orange-700">{totalRemaining}</td>
                <td className="p-2 border text-green-700">
                  M {totalRevenue.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
