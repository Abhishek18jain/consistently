import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-lg font-semibold text-zinc-100">
          ConsistIQ
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-6 text-sm">
          <Link to="/" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            Home
          </Link>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
