import { useEffect, useState } from "react";
import API from "../services/api";
import RoomCard from "../components/RoomCard";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("rooms/")
      .then((res) => {
        setRooms(res.data.results || res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-100 dark:bg-gray-900 transition">
        <h2 className="text-lg sm:text-xl font-semibold
                       text-gray-700 dark:text-gray-300">
          Loading rooms...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen
                    bg-gray-100 dark:bg-gray-900
                    transition
                    px-4 sm:px-6 md:px-8 lg:px-10
                    py-6 sm:py-8 md:py-10">

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl
                     font-bold mb-8 sm:mb-10
                     text-gray-900 dark:text-white">
        Available Rooms
      </h1>

      {/* EMPTY STATE */}
      {rooms.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No rooms available at the moment.
        </div>
      ) : (
        /* RESPONSIVE GRID */
        <div className="grid gap-8
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Home;