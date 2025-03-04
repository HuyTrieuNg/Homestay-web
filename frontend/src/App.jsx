import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HomestayPage from "./pages/HomestayPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homestays/:id" element={<HomestayPage />} />
      </Routes>
    </Router>
  );
}

export default App;
