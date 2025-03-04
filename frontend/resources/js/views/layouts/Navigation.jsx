// resources/js/layouts/Navigation.jsx
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { auth } = usePage().props;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      {/* Primary Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href={route('dashboard')}>
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
              <ResponsiveNavLink 
                href={route('dashboard')} 
                active={route().current('dashboard')}
              >
                Dashboard
              </ResponsiveNavLink>
              <ResponsiveNavLink 
                href={route('quotations')} 
                active={route().current('quotations')}
              >
                Cotizaciones
              </ResponsiveNavLink>
              <ResponsiveNavLink 
                href={route('jobs')} 
                active={route().current('jobs')}
              >
                Trabajos
              </ResponsiveNavLink>
            </div>
          </div>

          {/* Settings Dropdown */}
          <div className="hidden sm:flex sm:items-center sm:ms-6">
            <Dropdown>
              <Dropdown.Trigger>
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                  <div>{auth.user.name}</div>
                  <div className="ms-1">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </button>
              </Dropdown.Trigger>

              <Dropdown.Content>
                <Dropdown.Link href={route('profile.edit')}>
                  Perfil
                </Dropdown.Link>
                <Dropdown.Link href={route('logout')} method="post" as="button">
                  Cerrar Sesión
                </Dropdown.Link>
              </Dropdown.Content>
            </Dropdown>
          </div>

          {/* Hamburger Menu */}
          <div className="-me-2 flex items-center sm:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {!open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Navigation */}
      <div className={`${open ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <ResponsiveNavLink 
            href={route('dashboard')} 
            active={route().current('dashboard')}
          >
            Dashboard
          </ResponsiveNavLink>
        </div>

        {/* Responsive Settings */}
        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
          <div className="px-4">
            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
              {auth.user.name}
            </div>
            <div className="font-medium text-sm text-gray-500">
              {auth.user.email}
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <ResponsiveNavLink href={route('profile.edit')}>
              Perfil
            </ResponsiveNavLink>
            <ResponsiveNavLink 
              href={route('logout')} 
              method="post" 
              as="button"
            >
              Cerrar Sesión
            </ResponsiveNavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}