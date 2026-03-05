import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await API.post("accounts/login/", form);

      // 🔥 Clear old data first
      localStorage.clear();

      // ✅ Save all required data
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem(
        "profile_image",
        res.data.user.profile_image || ""
      );

      navigate("/home");

    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    px-4 sm:px-6
                    bg-gradient-to-br from-blue-500 to-purple-600
                    dark:from-gray-900 dark:via-gray-800 dark:to-black
                    transition duration-300">

      <div className="w-full max-w-md
                      bg-white dark:bg-gray-800
                      p-6 sm:p-8 md:p-10
                      rounded-2xl shadow-2xl
                      transition">

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6
                       text-gray-800 dark:text-white">
          Welcome Back
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            autoComplete="off"
            required
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="w-full p-3 rounded-lg border
                       border-gray-300 dark:border-gray-600
                       bg-gray-100 dark:bg-gray-700
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition"
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="off"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full p-3 rounded-lg border
                       border-gray-300 dark:border-gray-600
                       bg-gray-100 dark:bg-gray-700
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg
                       bg-indigo-500 hover:bg-indigo-600
                       text-white font-medium
                       transition duration-300
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-sm mt-6
                      text-gray-700 dark:text-gray-300">
          New user?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 dark:text-blue-400
                       cursor-pointer hover:underline">
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;