import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../Store/authSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validate = () => {
    let tempErrors = {};
    if (!userData.username.trim()) tempErrors.username = "Username is required";
    if (!userData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!userData.password) {
      tempErrors.password = "Password is required";
    } else if (userData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(signupUser(userData)).then(() => navigate("/home"));
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 m-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 m-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 m-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 m-2 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition duration-300"
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
            Do you have an account? <a href="/" className="text-blue-500 hover:underline">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
