import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

// Componente de Navegación
const Navigation = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-gray-800 dark:text-gray-200 text-lg font-bold">
          Mi Aplicación
        </Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Dashboard</Link>
          <Link to="/quotations" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cotizaciones</Link>
          <Link to="/jobs" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Trabajos</Link>
        </div>
      </div>
    </nav>
  );
};

// Layout Principal
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans antialiased">
      <Navigation />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

// Layout de Invitado
const GuestLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

// Aplicación Principal
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GuestLayout><h2>Bienvenido</h2></GuestLayout>} />
        <Route path="/dashboard" element={<Layout><h2>Dashboard</h2></Layout>} />
        <Route path="/quotations" element={<Layout><h2>Cotizaciones</h2></Layout>} />
        <Route path="/jobs" element={<Layout><h2>Trabajos</h2></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
