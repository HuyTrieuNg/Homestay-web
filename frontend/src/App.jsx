import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginTemp from "./pages/LoginTemp";
import HostDashboard from "./pages/HostDashboard";
import HomestayForm from "./pages/AddNewHomestay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginTemp />} />
        <Route path="/host" element={<HostDashboard />} />
        <Route path="/host/newHomestay" element={<HomestayForm />} />
      </Routes>
    </Router>
  );
}

export default App;
