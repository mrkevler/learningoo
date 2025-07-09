import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleTheme } from "../store/uiSlice";
import { logout } from "../store/authSlice";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import useIdleLogout from "../hooks/useIdleLogout";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const theme = useAppSelector((s) => s.ui.theme);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  useIdleLogout(Boolean(user));

  return (
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
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
          <span className="material-symbols-outlined">menu</span>
        </button>
        <ul
          className={`${
            open ? "block" : "hidden"
          } sm:flex sm:items-center sm:gap-6 font-medium`}
        >
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
              }
            >
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
              }
            >
              Pricing
            </NavLink>
          </li>
          {!user && (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
                }
              >
                Login
              </NavLink>
            </li>
          )}
          {!user && (
            <li>
              <Link
                to="/signup"
                className="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark"
              >
                Sign Up
              </Link>
            </li>
          )}
          {user && (
            <>
              <li className="text-accent-pink font-semibold">
                ${user.balance ?? 0}
              </li>
              <li>
                <Link
                  to="/profile"
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-accent-pink text-white font-bold hover:opacity-90"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
              </li>
            </>
          )}
          {user?.role === "tutor" && (
            <li>
              <NavLink
                to="/my-courses"
                className={({ isActive }) =>
                  `hover:text-accent-purple ${isActive ? "text-accent-purple" : ""}`
                }
              >
                My Courses
              </NavLink>
            </li>
          )}
          <li>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="text-white hover:text-accent-purple"
            >
              {theme === "light" ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
          </li>
          {user && (
            <li>
              <button
                onClick={() => dispatch(logout())}
                className="hover:text-accent-purple"
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
