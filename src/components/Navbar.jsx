
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import defaultUser from "../assets/user.png";
import {
  ArrowUpRight,
  UserRound,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Lost & Found", to: "/items" },
  { label: "How it works", to: "/#how-it-works" },
];

function Navbar() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Check Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Logged-in user:", currentUser);
      console.log("Profile picture URL:", currentUser?.photoURL);

      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sign Out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="text-2xl font-black tracking-tight text-slate-950">
            Back<span className="text-lime-500">2U</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <motion.div
              key={link.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18 }}
            >
              <Link
                to={link.to}
                className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-950"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">

          {/* Explore Button */}
          <motion.a
            href="#item-board"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-lime-300 hover:text-slate-950 sm:inline-flex"
          >
            Explore Items
            <ArrowUpRight size={16} />
          </motion.a>

          {/* Authentication Section */}
          {!authLoading && (
            <>
              {!user ? (
                /* User is NOT logged in */
                <div className="flex items-center gap-2">
                  <Link
                    to="/signin"
                    className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-lime-600"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="rounded-full bg-lime-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-lime-500 hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                /* User IS logged in */
                <div className="relative">

                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 transition-all hover:border-lime-400 hover:bg-lime-50"
                  >
                    <img
                      src={user.photoURL || defaultUser}
                      alt="User Profile"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultUser;
                      }}
                      className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                    />

                    <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-700 sm:block">
                      {user.displayName || user.email?.split("@")[0]}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`text-slate-500 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
                      >
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-lime-50 hover:text-slate-950"
                        >
                          <UserRound size={18} />
                          Your Profile
                        </Link>

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut size={18} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
