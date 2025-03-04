import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../assets/styles.css";

function LoginPage() {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (username.length > 0) {
      loginUser(username, password);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <p className="auth-title">Sign in</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <p>
            Don&apos;t have an account? <Link to="/register">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
