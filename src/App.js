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
import ChamberoRegister from "./resources/js/views/auth/ChamberoRegister";
import VerifyEmail from "./resources/js/views/auth/VerifyEmail";
import ResendVerification from "./resources/js/views/auth/ResendVerification";
import AuthCallback from "./resources/js/views/auth/AuthCallback";
import Dashboard from "./resources/js/views/Dashboard";
import EditProfile from "./resources/js/views/profile/EditProfile";
import ViewProfile from "./resources/js/views/profile/ViewProfile";
import Quotations from "./resources/js/views/quotations/Quotations";
import CreateQuotation from "./resources/js/views/quotations/CreateQuotation";
import Counteroffer from "./resources/js/views/quotations/Counteroffer";
import Jobs from "./resources/js/views/jobs/Jobs";
import Reviews from "./resources/js/views/reviews/CreateReview";
import NotFound from "./resources/js/views/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
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
            <Route
              path="/chambero-register"
              element={
                <GuestLayout>
                  <ChamberoRegister />
                </GuestLayout>
              }
            />
            <Route
              path="/verify-email"
              element={
                <GuestLayout>
                  <VerifyEmail />
                </GuestLayout>
              }
            />
            <Route
              path="/resend-verification"
              element={
                <GuestLayout>
                  <ResendVerification />
                </GuestLayout>
              }
            />
            <Route
              path="/auth/callback"
              element={
                <GuestLayout>
                  <AuthCallback />
                </GuestLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <AppLayout>
                  <ViewProfile />
                </AppLayout>
              }
            />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/edit"
              element={
                <AppLayout>
                  <EditProfile />
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
      </AuthProvider>
    </Router>
  );
}

export default App;
