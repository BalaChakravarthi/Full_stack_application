import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 
                       text-gray-700 dark:text-gray-300
                       mt-16 border-t 
                       border-gray-200 dark:border-gray-700">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto 
                      px-4 sm:px-6 lg:px-8
                      py-10
                      grid grid-cols-1 
                      sm:grid-cols-2 
                      lg:grid-cols-4 
                      gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold 
                         text-blue-600 dark:text-blue-400">
            LuxStay
          </h2>
          <p className="mt-4 text-sm leading-relaxed">
            Premium hotel booking platform offering 
            luxury stays at affordable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/home" className="hover:text-blue-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/bookings" className="hover:text-blue-500 transition">
                Bookings
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-blue-500 transition">
                Profile
              </Link>
            </li>
            <li>
              <span className="hover:text-blue-500 cursor-pointer transition">
                Contact Us
              </span>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-500 cursor-pointer transition">
              Help Center
            </li>
            <li className="hover:text-blue-500 cursor-pointer transition">
              Cancellation Policy
            </li>
            <li className="hover:text-blue-500 cursor-pointer transition">
              Privacy Policy
            </li>
            <li className="hover:text-blue-500 cursor-pointer transition">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Contact
          </h3>
          <div className="space-y-2 text-sm">
            <p>📍 Hyderabad, India</p>
            <p>📞 +91 8790756997</p>
            <p className="break-all">
              ✉ balachakarvarthi05@gmail.com
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700
                      text-center py-4 text-sm
                      px-4">
        © {new Date().getFullYear()} LuxStay. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;