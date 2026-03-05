import { useEffect, useState } from "react";
import API from "../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("bookings/calendar/")
      .then(res => setEvents(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading calendar...
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
                     text-blue-600 dark:text-blue-400">
        Booking Calendar
      </h1>

      <div className="bg-white dark:bg-gray-800
                      p-4 sm:p-6
                      rounded-2xl shadow-lg
                      overflow-x-auto">

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
          }}
        />

      </div>
    </div>
  );
}

export default CalendarView;