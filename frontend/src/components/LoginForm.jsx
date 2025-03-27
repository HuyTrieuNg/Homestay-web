import { useContext, useState } from "react";
// import { Await, Link } from "react-router-dom";
// import AuthContext from "../context/AuthContext";
import AuthContext from "@context/AuthContext";
import { PropTypes } from "prop-types";

function LoginForm({ fullWidth = false }) {
  const { loginUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (username.length > 0) {
      // loginUser(username, password);
      const errorMsg = loginUser(username, password);

      if (errorMsg !== true) {
        setLoginError(errorMsg);
      }
    }
  };

  return (
    // Điều chỉnh css theo nơi sử dụng là Login page hay booking page
    <div
      className={`p-6 bg-white  ${
        fullWidth
          ? "w-full max-w-lg"
          : "w-full sm:max-w-sm rounded-lg shadow-md"
      }`}
    >
      <h2 className="text-2xl font-semibold text-center text-gray-700">
        Đăng nhập
      </h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {loginError && (
          <div className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded-md text-center">
            {loginError}
          </div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-[#FF385C] rounded-md"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <a
          href="/forgot-password"
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot password?
        </a>
        <p className="mt-2 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  fullWidth: PropTypes.bool,
};

export default LoginForm;
