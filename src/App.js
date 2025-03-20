// src\App.js

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import GuestLayout from "./resources/js/views/layouts/GuestLayout";
import AppLayout from "./resources/js/views/layouts/AppLayout";

import Login from "./resources/js/views/auth/Login";
import Register from "./resources/js/views/auth/Register";
import Dashboard from "./resources/js/views/Dashboard";
import Profile from "./pages/Profile";
import Chamberos from "./pages/Chamberos";
import Quotations from "./pages/Quotations";
import CreateQuotation from "./pages/CreateQuotation";
import Counteroffer from "./pages/Counteroffer";
import Jobs from "./pages/Jobs";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicRoute />}>
            <Route
              path="/login"
              element={
                <GuestLayout>
                  <Login />
                </GuestLayout>
              }
            />
            <Route
              path="/register"
              element={
                <GuestLayout>
                  <Register />
                </GuestLayout>
              }
            />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <AppLayout>
                  <Profile />
                </AppLayout>
              }
            />
            <Route
              path="/chamberos"
              element={
                <AppLayout>
                  <Chamberos />
                </AppLayout>
              }
            />
            <Route
              path="/quotations"
              element={
                <AppLayout>
                  <Quotations />
                </AppLayout>
              }
            />
            <Route
              path="/quotations/create/:chamberoId"
              element={
                <AppLayout>
                  <CreateQuotation />
                </AppLayout>
              }
            />
            <Route
              path="/quotations/:id/counteroffer"
              element={
                <AppLayout>
                  <Counteroffer />
                </AppLayout>
              }
            />
            <Route
              path="/jobs"
              element={
                <AppLayout>
                  <Jobs />
                </AppLayout>
              }
            />
            <Route
              path="/reviews/:userId"
              element={
                <AppLayout>
                  <Reviews />
                </AppLayout>
              }
            />
          </Route>

          {/* Redirección y página 404 */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
