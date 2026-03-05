import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await API.post("accounts/register/", form);

      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
                 px-4 sm:px-6
                 transition duration-300
                 bg-gradient-to-br from-blue-500 to-purple-600
                 dark:from-gray-900 dark:via-gray-800 dark:to-black"
    >
      <div
        className="w-full max-w-md
                   bg-white dark:bg-gray-800
                   p-6 sm:p-8 md:p-10
                   rounded-2xl shadow-2xl
                   transition"
      >
        {/* Title */}
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-6
                     text-gray-800 dark:text-white"
        >
          Create Account
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            required
            autoComplete="off"
            value={form.username}
            className="w-full p-3 rounded-lg border
                       border-gray-300 dark:border-gray-600
                       bg-gray-100 dark:bg-gray-700
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            className="w-full p-3 rounded-lg border
                       border-gray-300 dark:border-gray-600
                       bg-gray-100 dark:bg-gray-700
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            required
            autoComplete="new-password"
            value={form.password}
            className="w-full p-3 rounded-lg border
                       border-gray-300 dark:border-gray-600
                       bg-gray-100 dark:bg-gray-700
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg
                       bg-indigo-500 hover:bg-indigo-600
                       text-white font-medium
                       transition duration-300
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p
          className="text-center text-sm mt-6
                     text-gray-700 dark:text-gray-300"
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 dark:text-blue-400
                       cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;