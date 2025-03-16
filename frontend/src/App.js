import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import Home from "./views/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
