import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-white p-4">
      <ul className="flex space-x-4 justify-center">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" className="hover:underline">
            Products
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
