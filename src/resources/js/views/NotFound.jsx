import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <div className="bg-blue-600 h-1 w-36 mx-auto my-4"></div>
        <h2 className="text-4xl font-light text-white mb-6">
          Página no encontrada
        </h2>
        <p className="text-gray-300 text-xl mb-8">
          Lo sentimos, la página que buscas no existe o no está disponible.
        </p>
        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out inline-flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
