import { useState, useEffect } from "react";
import API from "../services/api";
import { QRCodeCanvas } from "qrcode.react";

function RoomCard({ room }) {
  const [showModal, setShowModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(120);
  const [expired, setExpired] = useState(false);

  const [form, setForm] = useState({
    check_in: "",
    check_out: "",
  });

  const today = new Date().toISOString().split("T")[0];

  // TIMER
  useEffect(() => {
    if (!paymentData) return;

    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData, timeLeft]);

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const calculateDays = () => {
    if (!form.check_in || !form.check_out) return 0;

    const inDate = new Date(form.check_in);
    const outDate = new Date(form.check_out);

    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);

    return diff > 0 ? diff : 0;
  };

  const nights = calculateDays();
  const totalAmount = nights * room.price;

  const bookRoom = async () => {
    if (!form.check_in || !form.check_out) {
      alert("Please select dates");
      return;
    }

    if (nights <= 0) {
      alert("Checkout must be after check-in");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("bookings/create/", {
        room_id: room.id,
        check_in: form.check_in,
        check_out: form.check_out,
      });

      setPaymentData(res.data);

      setTimeLeft(120);
      setExpired(false);

    } catch (error) {
      alert(error.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async () => {
    if (expired) {
      alert("QR expired. Please generate again.");
      return;
    }

    try {
      await API.post(`bookings/paid/${paymentData.booking_id}/`);

      alert("Payment marked as paid!");

      setShowModal(false);
      setPaymentData(null);
      setForm({
        check_in: "",
        check_out: "",
      });

    } catch {
      alert("Failed to mark as paid");
    }
  };

  return (
    <>
      {/* ROOM CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl hover:-translate-y-1">

        <img
          src={
            room.image
              ? room.image.startsWith("http")
                ? room.image
                : `https://hotel-booking-app-9j4r.onrender.com/${room.image}`
              : "https://via.placeholder.com/400x250"
          }
          alt={room.room_type}
          className="w-full h-48 sm:h-56 md:h-60 object-cover"
        />

        <div className="p-4 sm:p-5">
          <h2 className="text-lg sm:text-xl font-semibold capitalize text-gray-800 dark:text-white">
            {room.room_type}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            ₹ {room.price} / night
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">

          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl shadow-2xl">

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-8">

              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
                Select Dates
              </h2>

              <div className="space-y-4">

                {/* CHECK IN */}
                <input
                  type="date"
                  min={today}
                  className="w-full p-3 rounded-lg border border-gray-300
                  dark:border-gray-600
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.check_in}
                  onChange={(e) =>
                    setForm({ ...form, check_in: e.target.value })
                  }
                />

                {/* CHECK OUT */}
                <input
                  type="date"
                  min={form.check_in || today}
                  className="w-full p-3 rounded-lg border border-gray-300
                  dark:border-gray-600
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.check_out}
                  onChange={(e) =>
                    setForm({ ...form, check_out: e.target.value })
                  }
                />

              </div>

              {nights > 0 && (
                <div className="mt-5 text-center">
                  <p className="font-semibold">{nights} Nights</p>
                  <p className="text-green-600 font-bold text-lg">
                    Total: ₹ {totalAmount}
                  </p>
                </div>
              )}

              {/* BUTTONS */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setPaymentData(null);
                  }}
                  className="w-full bg-gray-400 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={bookRoom}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
              </div>

              {/* QR PAYMENT */}
              {paymentData && (
                <div className="mt-8 text-center">

                  <h3 className="font-bold mb-2 text-lg">
                    Pay ₹ {paymentData.amount}
                  </h3>

                  {!expired && (
                    <p className="text-red-500 font-semibold mb-3">
                      ⏳ QR Expires in {formatTime(timeLeft)}
                    </p>
                  )}

                  {expired ? (
                    <p className="text-red-600 font-bold">
                      QR Code Expired
                    </p>
                  ) : (
                    <div className="flex justify-center">
                      <QRCodeCanvas
                        value={paymentData.upi_link}
                        size={180}
                      />
                    </div>
                  )}

                  <p className="text-sm mt-3 text-gray-500 dark:text-gray-400">
                    Scan with any UPI app
                  </p>

                </div>
              )}

            </div>

            {/* STICKY PAYMENT BUTTON */}
            {paymentData && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  disabled={expired}
                  onClick={markAsPaid}
                  className={`w-full py-3 rounded-lg text-white font-semibold ${
                    expired
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  I Have Paid
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default RoomCard;