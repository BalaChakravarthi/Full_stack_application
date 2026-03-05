import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profile_image")
  );

  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  /* DARK MODE */
  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* PROFILE IMAGE UPDATE */
  useEffect(() => {
    const updateImage = () => {
      setProfileImage(localStorage.getItem("profile_image"));
    };

    window.addEventListener("storage", updateImage);
    updateImage();

    return () => window.removeEventListener("storage", updateImage);
  }, [location]);

  /* CLOSE DROPDOWN OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowMenu(false);
    setMobileMenu(false);
  }, [location]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = (path) =>
    `block transition ${
      location.pathname === path
        ? "text-blue-600 dark:text-blue-400 font-semibold"
        : "text-gray-700 dark:text-gray-300 hover:text-blue-500"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50
                    bg-white/90 dark:bg-gray-900/90
                    backdrop-blur-md
                    border-b border-gray-200 dark:border-gray-700
                    shadow-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <h1
          className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
          onClick={() => navigate(token ? "/home" : "/")}
        >
          LuxStay
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          {!token ? (
            <>
              <Link to="/" className={linkStyle("/")}>Login</Link>
              <Link to="/register" className={linkStyle("/register")}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/home" className={linkStyle("/home")}>Home</Link>
              <Link to="/bookings" className={linkStyle("/bookings")}>Bookings</Link>

              {role === "admin" && (
                <>
                  <Link to="/admin" className={linkStyle("/admin")}>Admin</Link>
                  <Link to="/calendar" className={linkStyle("/calendar")}>Calendar</Link>
                </>
              )}
            </>
          )}

          {/* DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 border rounded-md
                       border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* PROFILE */}
          {token && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500"
              >
                {profileImage ? (
                  <img
                    src={
                      profileImage.startsWith("http")
                        ? profileImage
                        : `http://127.0.0.1:8000${profileImage}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10
                     border border-gray-300 dark:border-gray-600
                     rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <span className="w-6 h-0.5 bg-gray-700 dark:bg-white mb-1"></span>
          <span className="w-6 h-0.5 bg-gray-700 dark:bg-white mb-1"></span>
          <span className="w-6 h-0.5 bg-gray-700 dark:bg-white"></span>
        </button>

      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4">

          {!token ? (
            <>
              <Link to="/" className={linkStyle("/")}>Login</Link>
              <Link to="/register" className={linkStyle("/register")}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/home" className={linkStyle("/home")}>Home</Link>
              <Link to="/bookings" className={linkStyle("/bookings")}>Bookings</Link>

              <Link to="/profile" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500">
                  {profileImage ? (
                    <img
                      src={
                        profileImage.startsWith("http")
                          ? profileImage
                          : `http://127.0.0.1:8000${profileImage}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-sm font-bold">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                Profile
              </Link>
            </>
          )}

          {/* DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-2 border rounded-md
                       border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {token && (
            <button
              onClick={logout}
              className="block text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;