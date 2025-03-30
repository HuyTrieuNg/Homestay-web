import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
// import HomestayPage from "./pages/HomestayPage";
// import BookingPage from "./pages/BookingPage";
import HostBookingPage from "./pages/Host/BookingPage";
import HostCalendarPage from "./pages/Host/CalenderPage";
import HostMyHomestaysPage from "./pages/Host/MyHomestaysPage";
import HostCreateHomestayPage from "./pages/Host/CreateHomestayPage";
// import HostDashboard from "./pages/HostDashboard";
import HomestayForm from "./pages/AddNewHomestay";
import HomestayPage from "./pages/HomestayPage";
import BookingPage from "./pages/BookingPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import BookingHistoryDetailPage from "./pages/BookingHistoryDetailPage";
import UnauthorizedPage from "./pages/UnAuthorizedPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homestays/:id" element={<HomestayPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookinghistory" element={<BookingHistoryPage />} />
            <Route
              path="/booking/:bookingId"
              element={<BookingHistoryDetailPage />}
            />
          </Route>
          <Route element={<PrivateRoute requiredRole="host" />}>
            <Route path="/host" element={<HostMyHomestaysPage />} />
            <Route
              path="/host/newHomestay"
              element={<HostCreateHomestayPage />}
            />
            <Route path="/host/booking" element={<HostBookingPage />} />
            <Route path="/host/calendar" element={<HostCalendarPage />} />
            {/* <Route path="/host" element={<HostDashboard />} /> */}
            <Route path="/host/newHomestay" element={<HomestayForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
