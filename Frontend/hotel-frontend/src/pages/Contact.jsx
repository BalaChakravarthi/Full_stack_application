import { useState } from "react";
import API from "../services/api";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      await API.post("contact/", form);
      setFeedback({ type: "success", text: "Your message has been sent successfully." });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setFeedback({ type: "error", text: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10
                 bg-gray-100 dark:bg-gray-900"
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg
                   p-6 sm:p-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium
                       transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {feedback.text && (
          <p
            className={`mt-4 text-center text-sm ${
              feedback.type === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {feedback.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default Contact;
