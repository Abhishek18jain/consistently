import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../auth/auth.slice";
import { useState } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          ConsistIQ
        </Link>

        {/* Middle Links (section anchors) */}
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          <a href="#problem" className="hover:text-white transition-colors">Why</a>
          <a href="#engine" className="hover:text-white transition-colors">Engine</a>
          <a href="#profile" className="hover:text-white transition-colors">Profile</a>
          <a href="#how" className="hover:text-white transition-colors">How</a>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* When logged in — go to dashboard */}
              <Link
                to="/dashboard"
                className="hidden sm:block text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>

              <Link
                to="/workspace"
                className="bg-emerald-600 hover:bg-emerald-500 text-sm px-4 py-2
                           rounded-lg font-medium text-white transition-colors"
              >
                Go to Workspace
              </Link>

              <button
                onClick={handleLogout}
                className="hidden sm:block text-sm text-zinc-400 hover:text-red-400 transition-colors"
              >
                Logout
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center
                           text-zinc-300 hover:bg-zinc-800"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-500 text-sm px-4 py-2
                           rounded-lg font-medium text-white transition-colors"
              >
                Start Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-4 space-y-2">
          <a href="#problem" onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 py-2">Why</a>
          <a href="#engine" onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 py-2">Engine</a>
          <a href="#profile" onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 py-2">Profile</a>
          <a href="#how" onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-zinc-300 py-2">How</a>

          {isAuthenticated && (
            <>
              <hr className="border-zinc-800" />
              <Link to="/dashboard" className="block text-sm text-white py-2 font-medium">
                📊 Dashboard
              </Link>
              <Link to="/workspace" className="block text-sm text-white py-2 font-medium">
                🏠 Workspace
              </Link>
              <Link to="/journals" className="block text-sm text-white py-2 font-medium">
                📓 Journals
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block text-sm text-red-400 py-2 font-medium"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}