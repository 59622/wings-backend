import React, { useEffect, useState } from "react";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports");
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();

        // Ensure numeric values are numbers
        const formatted = data.map((r) => ({
          ...r,
          sold: Number(r.sold),
          remaining: Number(r.remaining),
          price: Number(r.price),
          revenue: Number(r.revenue),
        }));

        setReports(formatted);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
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

  if (error) {
    return (
      <section className="p-6 text-center text-red-600 font-semibold">
        {error}
      </section>
    );
  }

  if (reports.length === 0) {
    return (
      <section className="p-6 text-center text-gray-600 font-medium">
        No sales records found.
      </section>
    );
  }

  return (
    <section className="p-6">
      <h2 style={{ color: "white", textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "16px" }}>
  Sales Reports
</h2>


      <div className="overflow-x-auto mt-4">
        <table
  className="w-full border border-gray-300 rounded-lg shadow-md"
  style={{ backgroundColor: "white" }}
>


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
    </section>
  );
}
