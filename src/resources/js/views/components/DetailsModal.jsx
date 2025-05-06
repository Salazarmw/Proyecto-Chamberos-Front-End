import React from "react";

export default function DetailsModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none"
          aria-label="Cerrar"
        >
          &times;
        </button>
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
            {title}
          </h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
} 