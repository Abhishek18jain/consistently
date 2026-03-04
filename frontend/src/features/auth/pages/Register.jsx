import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "../auth.slice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../../components/layouts/AuthLayout";
import PasswordStrength from "../components/PasswordStrength";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(registerUser(form));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (registerSuccess) {
      toast.success("OTP sent to your email");
      navigate(`/verify-email?email=${form.email}`);
    }
  }, [registerSuccess, form.email, navigate]);

  return (
    <AuthLayout>
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Start building consistency today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input label="Name" name="name" onChange={handleChange} />
          <Input label="Email" name="email" type="email" onChange={handleChange} />

          {/* PASSWORD */}
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
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600
                         transition-colors"
            >
              {showPassword ? "🙈" : "👁"}
            </button>

            <PasswordStrength password={form.password} />
          </div>

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
          />

          {/* CTA BUTTON */}
          <button
            disabled={loading}
            className="
              w-full py-3 rounded-xl font-semibold
              bg-gray-900 hover:bg-gray-800 text-white
              transition-all duration-200 active:scale-[0.98]
              disabled:opacity-50
              flex items-center justify-center
            "
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* DIVIDER */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium
                           transition-colors"
              >
                Log in
              </span>
            </p>
          </div>

        </form>
      </div>
    </AuthLayout>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="
          w-full px-4 py-2.5 rounded-xl
          bg-gray-50 border border-gray-200
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
        "
      />
    </div>
  );
}
