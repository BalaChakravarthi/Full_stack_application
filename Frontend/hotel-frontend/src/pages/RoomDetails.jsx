import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { differenceInDays } from "date-fns";

function RoomDetails() {
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  // =============================
  // Fetch Room
  // =============================
  useEffect(() => {
    API.get(`rooms/${id}/`)
      .then((res) => setRoom(res.data))
      .catch(() => setError("Failed to load room details"))
      .finally(() => setLoading(false));
  }, [id]);

  // =============================
  // Calculate Total
  // =============================
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const days = differenceInDays(
        new Date(checkOut),
        new Date(checkIn)
      );

      if (days > 0) {
        setTotalPrice(days * room.price);
        setError("");
      } else {
        setTotalPrice(0);
        setError("Check-out must be after check-in.");
      }
    }
  }, [checkIn, checkOut, room]);

  // =============================
  // Loading UI
  // =============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">
          Loading room details...
        </p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen
                    bg-gray-100 dark:bg-gray-900
                    px-4 sm:px-6 md:px-8 lg:px-10
                    py-6 sm:py-8 md:py-10">

      <div className="grid gap-8
                      grid-cols-1
                      md:grid-cols-2">

        {/* ROOM IMAGE */}
        <div>
          <img
            src={
              room.image
                ? room.image.startsWith("http")
                  ? room.image
                  : `http://127.0.0.1:8000${room.image}`
                : "https://via.placeholder.com/600x400"
            }
            alt={room.room_type}
            className="w-full
                       h-64 sm:h-80 md:h-full
                       object-cover
                       rounded-2xl shadow-lg"
          />
        </div>

        {/* BOOKING CARD */}
        <div className="bg-white dark:bg-gray-800
                        rounded-2xl shadow-xl
                        p-6 sm:p-8
                        text-gray-800 dark:text-gray-200">

          <h2 className="text-2xl sm:text-3xl md:text-4xl
                         font-bold mb-4 capitalize">
            {room.room_type}
          </h2>

          <p className="text-xl sm:text-2xl mb-6 font-semibold">
            ₹ {room.price} / night
          </p>

          {/* DATE INPUTS */}
          <div className="space-y-4">

            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-3 rounded-lg border
                         border-gray-300 dark:border-gray-600
                         bg-gray-100 dark:bg-gray-700
                         text-gray-800 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-3 rounded-lg border
                         border-gray-300 dark:border-gray-600
                         bg-gray-100 dark:bg-gray-700
                         text-gray-800 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="mt-4 text-red-500 text-sm">
              {error}
            </p>
          )}

          {/* TOTAL PRICE */}
          {totalPrice > 0 && (
            <div className="mt-6 text-lg sm:text-xl font-semibold">
              Total: ₹ {totalPrice}
            </div>
          )}

          {/* BOOK BUTTON (Optional Ready) */}
          <button
            disabled={totalPrice <= 0}
            className="mt-6 w-full py-3 rounded-lg
                       bg-blue-600 hover:bg-blue-700
                       text-white font-medium
                       transition
                       disabled:bg-gray-400 disabled:cursor-not-allowed">
            Confirm Booking
          </button>

        </div>
      </div>
    </div>
  );
}

export default RoomDetails;