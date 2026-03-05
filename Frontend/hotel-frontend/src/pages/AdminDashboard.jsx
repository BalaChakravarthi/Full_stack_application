import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const bookingsRes = await API.get("bookings/all/");
    const statsRes = await API.get("bookings/analytics/");

    setBookings(bookingsRes.data);
    setStats(statsRes.data);
  };

  const updateStatus = async (id, status) => {
    await API.post(`bookings/update/${id}/`, { status });
    fetchData();
  };

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
  ];

  const COLORS = ["#facc15", "#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen
                    bg-gray-100 dark:bg-gray-900
                    p-4 sm:p-6 md:p-8 lg:p-10">

      <h1 className="text-2xl sm:text-3xl md:text-4xl
                     font-bold mb-8
                     text-blue-700 dark:text-blue-400">
        Admin Dashboard
      </h1>

      {/* 📊 STAT CARDS */}
      <div className="grid gap-6
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-4
                      mb-10">

        <StatCard title="Total Bookings" value={stats.total_bookings} />
        <StatCard title="Total Revenue" value={`₹ ${stats.revenue}`} green />
        <StatCard title="Average Rating" value={`⭐ ${stats.avg_rating}`} yellow />
        <StatCard title="Pending" value={stats.pending} yellow />
      </div>

      {/* 📊 PIE CHART */}
      <div className="bg-white dark:bg-gray-800
                      p-6 rounded-2xl shadow-lg mb-10">

        <h2 className="text-lg sm:text-xl font-semibold mb-4
                       text-gray-800 dark:text-white">
          Booking Status Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📋 BOOKINGS LIST */}
      <h2 className="text-lg sm:text-xl font-semibold mb-4
                     text-gray-800 dark:text-white">
        All Bookings
      </h2>

      <div className="space-y-5">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-gray-800
                       p-5 rounded-2xl shadow-md
                       flex flex-col gap-4
                       sm:flex-row sm:justify-between sm:items-center">

            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {b.room_type}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                User: {b.user}
              </p>
              <p className="text-sm">₹ {b.total_price}</p>
              <p className="text-sm">
                Rating: {b.rating ? `⭐ ${b.rating}/5` : "Not rated"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => updateStatus(b.id, "approved")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg
                           hover:bg-green-700 transition">
                Approve
              </button>

              <button
                onClick={() => updateStatus(b.id, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg
                           hover:bg-red-700 transition">
                Reject
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

/* 🔹 Reusable Stat Card */
function StatCard({ title, value, green, yellow }) {
  return (
    <div className="bg-white dark:bg-gray-800
                    p-6 rounded-2xl shadow-md
                    text-center">

      <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">
        {title}
      </h3>

      <p className={`text-2xl font-bold
        ${green ? "text-green-600" : ""}
        ${yellow ? "text-yellow-500" : ""}
        ${!green && !yellow ? "text-gray-800 dark:text-white" : ""}
      `}>
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;