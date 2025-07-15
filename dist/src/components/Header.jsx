import {
  FaHome,
  FaInfoCircle,
  FaBuilding,
  FaEnvelope,
  FaUser,
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const isActive = (path) => location.pathname === path;

  return (
    <section className="bg-white dark:bg-slate-900 shadow-md dark:shadow-slate-800 sticky top-0 z-50 transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight"
        >
          <span className="text-blue-600">AM</span> Estate
        </Link>

        {/* Center: Desktop nav */}
        <ul className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-700 dark:text-gray-200">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive('/')
                ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                : 'hover:text-blue-600'
            } transition`}
          >
            <FaHome className="text-blue-600" /> Home
          </Link>
          <Link
            to="/about"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive('/about')
                ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white'
                : 'hover:text-blue-600'
            } transition`}
          >
            <FaInfoCircle className="text-pink-600" /> About
          </Link>
          <Link
            to="/properties"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive('/properties')
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                : 'hover:text-blue-600'
            } transition`}
          >
            <FaBuilding className="text-green-600" /> Properties
          </Link>
          <Link
            to="/contact2"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive('/contact2')
                ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                : 'hover:text-blue-600'
            } transition`}
          >
            <FaEnvelope className="text-purple-600" /> Contact
          </Link>
          <Link
            to="/profile"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive('/profile') || isActive('/signin')
                ? 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white'
                : 'hover:text-blue-600'
            } transition`}
          >
            {currentUser ? (
              <>
                <img
                  className="rounded-full h-6 w-6 object-cover border"
                  src={currentUser.avatar}
                  alt="profile"
                />
                <span>Profile</span>
              </>
            ) : (
              <>
                <FaUser className="text-indigo-600" />
                Sign in
              </>
            )}
          </Link>
        </ul>

        {/* Right: Light/Dark Toggle + Mobile Menu Icon */}
        <div className="flex items-center gap-4">
          {/* Light/Dark Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-200 hover:scale-110 transition"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-700 dark:text-gray-200 relative w-10 h-10 flex items-center justify-center group"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu
              size={26}
              className={`absolute transition-all duration-300 transform ${
                menuOpen ? 'opacity-0 scale-75 -rotate-90' : 'opacity-100 scale-100 rotate-0'
              }`}
            />
            <X
              size={26}
              className={`absolute transition-all duration-300 transform ${
                menuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-90'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-md dark:shadow-slate-800 px-4 py-4 space-y-3 text-slate-700 dark:text-gray-200 font-medium transition-all duration-300">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive('/')
                ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                : 'bg-blue-50 dark:bg-slate-700 hover:bg-blue-100'
            }`}
          >
            <FaHome /> Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive('/about')
                ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white'
                : 'bg-blue-50 dark:bg-slate-700 hover:bg-blue-100'
            }`}
          >
            <FaInfoCircle /> About
          </Link>
          <Link
            to="/properties"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive('/properties')
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                : 'bg-blue-50 dark:bg-slate-700 hover:bg-blue-100'
            }`}
          >
            <FaBuilding /> Properties
          </Link>
          <Link
            to="/contact2"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive('/contact2')
                ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                : 'bg-blue-50 dark:bg-slate-700 hover:bg-blue-100'
            }`}
          >
            <FaEnvelope /> Contact
          </Link>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive('/profile') || isActive('/signin')
                ? 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white'
                : 'bg-blue-50 dark:bg-slate-700 hover:bg-blue-100'
            }`}
          >
            {currentUser ? (
              <>
                <img
                  className="rounded-full h-6 w-6 object-cover border"
                  src={currentUser.avatar}
                  alt="profile"
                />
                <span>Profile</span>
              </>
            ) : (
              <>
                <FaUser />
                <span>Sign in</span>
              </>
            )}
          </Link>
        </div>
      )}
    </section>
  );
}
