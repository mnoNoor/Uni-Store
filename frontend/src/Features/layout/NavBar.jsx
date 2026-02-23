import { NavLink } from "react-router-dom";

export default function NavBar() {
  const base = "px-3 py-2 rounded-md text-sm";
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-4 justify-center py-3">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${base} ${isActive ? "bg-green-50 text-green-700" : "text-gray-700 hover:text-green-600"}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${base} ${isActive ? "bg-green-50 text-green-700" : "text-gray-700 hover:text-green-600"}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${base} ${isActive ? "bg-green-50 text-green-700" : "text-gray-700 hover:text-green-600"}`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
