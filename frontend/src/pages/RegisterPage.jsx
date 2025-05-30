import { useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import AuthContext from "../context/AuthContext";
// import "../assets/styles.css";
import AuthContext from "@context/AuthContext";

function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  // const [registerError, setRegisterError] = useState({});
  const { registerUser } = useContext(AuthContext);
  const [errors, setErrors] = useState({}); // Lưu lỗi theo từng field

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (password !== password2) {
      setErrors({ password2: ["Mật khẩu không trùng khớp"] });
      return;
    }
    // registerUser(phone, username, password, password2);
    const result = await registerUser(phone, username, password, password2);
    if (!result.success) {
      setErrors(result.errors);
      console.log(result.errors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-600"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.phone && (
              <div className="mt-4 text-sm text-red-500 bg-red-100 p-2 rounded-md text-center">{errors.phone.join(" ")}</div>
            )}
          </div>

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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.username && (
              <div className="mt-4 text-sm text-red-500 bg-red-100 p-2 rounded-md text-center">
                {errors.username.join(" ")}
              </div>
            )}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.password && (
              <div className="mt-4 text-sm text-red-500 bg-red-100 p-2 rounded-md text-center">
                {errors.password.join(" ")}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password2"
              className="block text-sm font-medium text-gray-600"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.password2 && (
              <div className="mt-4 text-sm text-red-500 bg-red-100 p-2 rounded-md text-center">
                {errors.password2.join(" ")}
              </div>
            )}
          </div>
          {/* {registerError && (
            <div className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded-md text-center">
              {registerError}
            </div>
          )} */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#FF385C] rounded-md hover:bg-[#FF384C] focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#FF385C] hover:underline">
              Login Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
