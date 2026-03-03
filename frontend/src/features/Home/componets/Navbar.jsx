// components/Navbar.jsx
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../auth/auth.slice";

export default function Navbar() {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-lg font-semibold tracking-tight">
          Consistency Coach
        </div>

        {/* Middle Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          <a href="#problem" className="hover:text-white">Why</a>
          <a href="#engine" className="hover:text-white">Engine</a>
          <a href="#profile" className="hover:text-white">Profile</a>
          <a href="#how" className="hover:text-white">How</a>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm text-zinc-300 hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-500 text-sm px-4 py-2 rounded-lg font-medium"
              >
                Start Free
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/contact"
                className="text-sm text-zinc-300 hover:text-white"
              >
                Contact Us
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-sm px-4 py-2 rounded-lg font-medium"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </nav>
    </header>
  );
}