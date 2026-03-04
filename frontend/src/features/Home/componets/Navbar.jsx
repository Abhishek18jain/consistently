import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../auth/auth.slice";
import { useState } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => dispatch(logout());

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-black">C</span>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Consistently</span>
        </Link>

        {/* Middle Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#how" className="hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#templates" className="hover:text-gray-900 transition-colors">Templates</a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link to="/workspace" className="bg-gray-900 hover:bg-gray-800 text-sm px-4 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95">
                Go to Workspace
              </Link>
              <button onClick={handleLogout} className="hidden sm:block text-sm text-gray-400 hover:text-red-500 transition-colors font-medium">
                Logout
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100">
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="bg-gray-900 hover:bg-gray-800 text-sm px-5 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95">
                Start Free →
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-1">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-600 py-2.5 font-medium">Features</a>
          <a href="#how" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-600 py-2.5 font-medium">How It Works</a>
          <a href="#templates" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-600 py-2.5 font-medium">Templates</a>
          {isAuthenticated && (
            <>
              <hr className="border-gray-200 my-2" />
              <Link to="/dashboard" className="block text-sm text-gray-900 py-2.5 font-bold">📊 Dashboard</Link>
              <Link to="/workspace" className="block text-sm text-gray-900 py-2.5 font-bold">🏠 Workspace</Link>
              <Link to="/journals" className="block text-sm text-gray-900 py-2.5 font-bold">📓 Journals</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block text-sm text-red-500 py-2.5 font-bold w-full text-left">🚪 Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}