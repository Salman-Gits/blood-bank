import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar({ isAdmin }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-red-600 tracking-wide">
          BloodDonation
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-lg font-medium">
          {/* PUBLIC LINKS */}
          {!isAdmin && (
            <>
              <Link to="/" className="hover:text-red-600 transition">Home</Link>
              <Link to="/find-donor" className="hover:text-red-600 transition">Find Donor</Link>
              <Link to="/request-blood" className="hover:text-red-600 transition">Request Blood</Link>
              <Link
                to="/admin/login"
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Admin Login
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" className="hover:text-red-600 transition">Dashboard</Link>
              <Link to="/admin/donors" className="hover:text-red-600 transition">Donor List</Link>
              <Link to="/admin/add-donor" className="hover:text-red-600 transition">Add Donor</Link>
              <Link to="/admin/requests" className="hover:text-red-600 transition">Requests</Link>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-black"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200 px-6 py-4 space-y-4 text-lg">

          {/* PUBLIC LINKS */}
          {!isAdmin && (
            <>
              <Link to="/" onClick={() => setOpen(false)} className="block hover:text-red-600">Home</Link>
              <Link to="/find-donor" onClick={() => setOpen(false)} className="block hover:text-red-600">Find Donor</Link>
              <Link to="/request-blood" onClick={() => setOpen(false)} className="block hover:text-red-600">Request Blood</Link>
              
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Admin Login
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="block hover:text-red-600">Dashboard</Link>
              <Link to="/admin/donors" onClick={() => setOpen(false)} className="block hover:text-red-600">Donor List</Link>
              <Link to="/admin/add-donor" onClick={() => setOpen(false)} className="block hover:text-red-600">Add Donor</Link>
              <Link to="/admin/requests" onClick={() => setOpen(false)} className="block hover:text-red-600">Requests</Link>

              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-black"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}