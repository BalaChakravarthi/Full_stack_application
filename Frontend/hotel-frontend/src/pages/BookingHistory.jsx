import { useEffect, useState } from "react";
import API from "../services/api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("bookings/my/");
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // 🔥 Auto refresh every 5 seconds
    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const submitRating = async (id, rating) => {
    try {
      await API.post(`bookings/rate/${id}/`, { rating });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, rating } : b
        )
      );
    } catch (err) {
      alert("Rating failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen
                    bg-gray-100 dark:bg-gray-900
                    p-4 sm:p-6 md:p-8 lg:p-10">

      <h1 className="text-2xl sm:text-3xl md:text-4xl
                     font-bold mb-8
                     text-gray-800 dark:text-white">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-gray-800
                         rounded-2xl shadow-md
                         p-5 sm:p-6
                         flex flex-col
                         sm:flex-row sm:justify-between sm:items-center
                         gap-4 transition hover:shadow-lg">

              {/* LEFT SIDE */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold capitalize text-gray-800 dark:text-white">
                  {b.room_type}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {b.check_in} → {b.check_out}
                </p>

                <p className="mt-1 font-semibold">
                  ₹ {b.total_price}
                </p>

                {/* Status */}
                <p
                  className={`mt-2 font-medium ${
                    b.status === "approved"
                      ? "text-green-500"
                      : b.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {b.status}
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col items-start sm:items-end">

                {b.rating ? (
                  <p className="text-yellow-500 font-medium">
                    ⭐ {b.rating}/5
                  </p>
                ) : (
                  b.status === "approved" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => submitRating(b.id, star)}
                          className="bg-yellow-400 hover:bg-yellow-500
                                     text-black px-3 py-1 rounded-lg
                                     text-sm transition">
                          {star} ⭐
                        </button>
                      ))}
                    </div>
                  )
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;