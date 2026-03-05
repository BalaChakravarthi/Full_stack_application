import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    profile_image: null,
    old_password: "",
    new_password: "",
  });

  const [preview, setPreview] = useState(null);

  // =========================
  // Fetch Profile
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("accounts/profile/");

        setUser(res.data);

        setForm({
          username: res.data.username,
          email: res.data.email,
          profile_image: null,
          old_password: "",
          new_password: "",
        });

        // 🔥 Save image for navbar
        localStorage.setItem(
          "profile_image",
          res.data.profile_image || ""
        );

      } catch (error) {
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // Handle Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("email", form.email);

      if (form.profile_image) {
        formData.append("profile_image", form.profile_image);
      }

      await API.put("accounts/profile/update/", formData);

      // Change Password
      if (form.old_password && form.new_password) {
        await API.post("accounts/change-password/", {
          old_password: form.old_password,
          new_password: form.new_password,
        });
      }

      // 🔄 Get updated profile
      const updated = await API.get("accounts/profile/");
      setUser(updated.data);

      // 🔥 Update navbar image
      localStorage.setItem(
        "profile_image",
        updated.data.profile_image || ""
      );

      // 🔥 Force Navbar refresh
      window.dispatchEvent(new Event("storage"));

      alert("Profile Updated Successfully!");

      setForm((prev) => ({
        ...prev,
        profile_image: null,
        old_password: "",
        new_password: "",
      }));

      setPreview(null);

    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.error || "Update Failed!");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gray-100 dark:bg-gray-900 dark:text-white transition">

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md mx-auto">

        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          My Profile
        </h2>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <img
            src={
              preview
                ? preview
                : user?.profile_image
                ? `http://127.0.0.1:8000${user.profile_image}`
                : "https://via.placeholder.com/120"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
        </div>

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <input
            type="text"
            value={form.username}
            className="w-full p-3 border rounded mb-3 dark:bg-gray-700"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          {/* Email */}
          <input
            type="email"
            value={form.email}
            className="w-full p-3 border rounded mb-3 dark:bg-gray-700"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* Profile Image */}
          <input
            type="file"
            className="mb-4"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setForm({ ...form, profile_image: file });
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {/* Change Password */}
          <h3 className="font-semibold mb-2">
            Change Password
          </h3>

          <input
            type="password"
            placeholder="Old Password"
            value={form.old_password}
            className="w-full p-3 border rounded mb-2 dark:bg-gray-700"
            onChange={(e) =>
              setForm({ ...form, old_password: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            value={form.new_password}
            className="w-full p-3 border rounded mb-4 dark:bg-gray-700"
            onChange={(e) =>
              setForm({ ...form, new_password: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded transition"
          >
            Update Profile
          </button>

        </form>
      </div>
    </div>
  );
}

export default Profile;