import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./resources/js/Pages/Auth/Register.jsx";
import Login from "./resources/js/Pages/Auth/Login.jsx";
import Dashboard from "./resources/js/Pages/Dashboard.jsx";

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
