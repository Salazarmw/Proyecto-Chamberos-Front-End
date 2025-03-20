// resources/js/views/layouts/Navigation.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ApplicationLogo from "../components/ApplicationLogo";
import Dropdown from "../components/Dropdown";
import ResponsiveNavLink from "../components/ResponsiveNavLink";

export default function Navigation({ auth }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Función para reemplazar route().current()
  const isCurrentRoute = (routePath) => {
    return location.pathname === routePath;
  };

  // Función para reemplazar route()
  const getRoute = (routeName) => {
    const routes = {
      dashboard: "/",
      quotations: "/quotations",
      jobs: "/jobs",
      "profile.edit": "/profile/edit",
      logout: "/logout",
    };
    return routes[routeName] || "/";
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      {/* Primary Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link to={getRoute("dashboard")}>
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
              <ResponsiveNavLink
                to={getRoute("dashboard")}
                active={isCurrentRoute(getRoute("dashboard"))}
              >
                Dashboard
              </ResponsiveNavLink>
              <ResponsiveNavLink
                to={getRoute("quotations")}
                active={isCurrentRoute(getRoute("quotations"))}
              >
                Cotizaciones
              </ResponsiveNavLink>
              <ResponsiveNavLink
                to={getRoute("jobs")}
                active={isCurrentRoute(getRoute("jobs"))}
              >
                Trabajos
              </ResponsiveNavLink>
            </div>
          </div>

          {/* Settings Dropdown */}
          <div className="hidden sm:flex sm:items-center sm:ms-6">
            <Dropdown
              align="right"
              width="48"
              trigger={
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                  <div>{auth?.user?.name || "Usuario"}</div>
                  <div className="ms-1">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </div>
                </button>
              }
            >
              <div className="py-2">
                <Link
                  to={getRoute("profile.edit")}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Perfil
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // logout();
                    navigate("/");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            </Dropdown>
          </div>

          {/* Hamburger Menu */}
          <div className="-me-2 flex items-center sm:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {!open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Navigation */}
      <div className={`${open ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <ResponsiveNavLink
            to={getRoute("dashboard")}
            active={isCurrentRoute(getRoute("dashboard"))}
          >
            Dashboard
          </ResponsiveNavLink>
          <ResponsiveNavLink
            to={getRoute("quotations")}
            active={isCurrentRoute(getRoute("quotations"))}
          >
            Cotizaciones
          </ResponsiveNavLink>
          <ResponsiveNavLink
            to={getRoute("jobs")}
            active={isCurrentRoute(getRoute("jobs"))}
          >
            Trabajos
          </ResponsiveNavLink>
        </div>

        {/* Responsive Settings */}
        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
          <div className="px-4">
            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
              {auth?.user?.name || "Usuario"}
            </div>
            <div className="font-medium text-sm text-gray-500">
              {auth?.user?.email || "usuario@ejemplo.com"}
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <ResponsiveNavLink to={getRoute("profile.edit")}>
              Perfil
            </ResponsiveNavLink>
            <ResponsiveNavLink
              to={getRoute("logout")}
              onClick={(e) => {
                e.preventDefault();
                // logout();
                navigate("/");
              }}
            >
              Cerrar Sesión
            </ResponsiveNavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
