import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BookingHistory from "./pages/BookingHistory";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import RoomDetails from "./pages/RoomDetails";
import CalendarView from "./pages/CalendarView";

function App() {
  return (
    <BrowserRouter>
      {/* Global Layout */}
      <div className="min-h-screen flex flex-col
                      bg-gray-100 dark:bg-gray-900
                      transition duration-300">

        {/* Fixed Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow pt-16">
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/room/:id"
              element={
                <ProtectedRoute>
                  <RoomDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute adminOnly>
                  <CalendarView />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </main>

        {/* Footer Always at Bottom */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;