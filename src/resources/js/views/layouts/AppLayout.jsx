import React from "react";
import Navigation from "../layouts/Navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AppLayout({ header, children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <ToastContainer />
      <Navigation />

      {header && (
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}
