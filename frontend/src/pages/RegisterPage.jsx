import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../assets/styles.css";

function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(phone, username, password, password2);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <p className="auth-title">Sign Up</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Register
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
