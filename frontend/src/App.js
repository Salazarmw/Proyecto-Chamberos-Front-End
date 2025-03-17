import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./resources/js/views/auth/Register.jsx";
import Login from "./resources/js/views/auth/Login.jsx";
import Dashboard from "./resources/js/views/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
