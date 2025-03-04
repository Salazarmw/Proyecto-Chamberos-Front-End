import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../resources/js/views/Home";
import About from "../resources/js/views/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
