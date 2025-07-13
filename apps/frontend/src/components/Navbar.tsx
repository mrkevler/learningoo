import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleTheme } from "../store/uiSlice";
import { logout } from "../store/authSlice";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import useIdleLogout from "../hooks/useIdleLogout";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const theme = useAppSelector((s) => s.ui.theme);
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const adminToken = (() => {
    if (!token) return false;
    try {
      const role = JSON.parse(atob(token.split(".")[1])).role;
      return role === "admin";
    } catch {
      return false;
    }
  })();
  const dispatch = useAppDispatch();

  useIdleLogout(Boolean(user));

  return (
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 relative">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img
            src="/logo/learningoo-128.png"
            alt="Learningoo"
            className="h-10 w-10"
          />
          <span className="sr-only">Learningoo</span>
        </Link>
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <ul
          className={`${
            open ? "block" : "hidden"
          } sm:flex sm:items-center sm:gap-6 font-medium absolute sm:relative top-full sm:top-auto right-0 sm:left-auto w-max sm:w-auto bg-gray-900 sm:bg-transparent py-4 sm:py-0 px-6 sm:px-0 space-y-4 sm:space-y-0 border sm:border-0 border-gray-700 rounded-lg sm:rounded-none shadow-lg sm:shadow-none z-50`}
        >
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 sm:py-0 hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `block py-2 sm:py-0 hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `block py-2 sm:py-0 hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              Pricing
            </NavLink>
          </li>
          {!user && (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block py-2 sm:py-0 hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
                }
                onClick={() => setOpen(false)}
              >
                Login
              </NavLink>
            </li>
          )}
          {!user && (
            <li>
              <Link
                to="/signup"
                className="block bg-brand text-white px-4 py-3 sm:py-2 rounded-md hover:bg-brand-dark text-center"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </li>
          )}
          {user && (
            <>
              <li className="text-accent-pink font-semibold py-2 sm:py-0">
                ${user.balance ?? 0}
              </li>
              <li className="flex items-center py-2 sm:py-0">
                <Link
                  to="/profile"
                  className="flex items-center justify-center h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-accent-pink text-white font-bold hover:opacity-90"
                  onClick={() => setOpen(false)}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <span className="ml-3 sm:hidden text-white">Profile</span>
              </li>
            </>
          )}
          {user && (
            <li>
              <NavLink
                to="/my-courses"
                className={({ isActive }) =>
                  `block py-2 sm:py-0 hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
                }
                onClick={() => setOpen(false)}
              >
                My Courses
              </NavLink>
            </li>
          )}
          {(user?.role === "admin" || adminToken) && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `block py-2 sm:py-0 hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
                }
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
          )}
          <li className="flex items-center py-2 sm:py-0">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="flex items-center text-white hover:text-accent-purple p-2 sm:p-0"
            >
              {theme === "light" ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
              <span className="ml-3 sm:hidden">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </button>
          </li>
          {user && (
            <li>
              <button
                onClick={() => {
                  dispatch(logout());
                  setOpen(false);
                }}
                className="block w-full text-left py-2 sm:py-0 hover:text-accent-purple"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
