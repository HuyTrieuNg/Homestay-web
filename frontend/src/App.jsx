import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import HostDashboard from "./pages/HostDashboard";
import CreateHomestay from "./pages/CreateHomestay";
import HomestayPage from "./pages/HomestayPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homestays/:id" element={<HomestayPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/host/newHomestay" element={<CreateHomestay />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
