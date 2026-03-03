import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../auth.slice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../../components/layouts/AuthLayout";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginLoading, loginError, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("All fields required");
      return;
    }

    dispatch(loginUser(form));
  };

  // ERROR HANDLING
  useEffect(() => {
    if (loginError) {
      toast.error(loginError);
    }
  }, [loginError]);

  // SUCCESS REDIRECT
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Welcome back!");
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <AuthLayout>
      <div className="w-full max-w-md text-white">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold">
            Welcome back
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Log in to continue your streak
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400"
            >
              👁
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            disabled={loginLoading}
            className="w-full py-3 rounded-lg font-semibold
              bg-gradient-to-r from-blue-600 to-indigo-600
              disabled:opacity-50"
          >
            {loginLoading ? "Logging in..." : "Log In"}
          </button>

          {/* LINKS */}
          <div className="text-center text-sm text-gray-400">
            <span
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer text-blue-400"
            >
              Forgot password?
            </span>

            <div className="mt-2">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="cursor-pointer text-blue-400"
              >
                Sign up
              </span>
            </div>
          </div>

        </form>
      </div>
    </AuthLayout>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-1 text-sm text-gray-400">
        {label}
      </label>

      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg bg-[#020617]/70
          border border-white/10 text-white"
      />
    </div>
  );
}
