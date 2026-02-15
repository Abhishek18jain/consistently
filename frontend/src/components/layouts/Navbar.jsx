import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold text-slate-800">
          ConsistIQ
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-6 text-sm">
          <Link to="/" className="text-slate-600 hover:text-slate-900">
            Home
          </Link>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-600 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
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
