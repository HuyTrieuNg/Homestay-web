import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import LoginTemp from "./pages/LoginTemp";
import HostDashboard from "./pages/HostDashboard";
import HomestayForm from "./pages/AddNewHomestay";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/homestays/:id"
            element={<h1>Homestay Detail Page</h1>}
          />
          {/* Sử dụng LoginPage cho route "/login" theo nhánh login-register-feature */}
          <Route path="/login" element={<LoginPage />} />
          {/* Thêm route cho LoginTemp nếu cần */}
          <Route path="/login-temp" element={<LoginTemp />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/host/newHomestay" element={<HomestayForm />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
