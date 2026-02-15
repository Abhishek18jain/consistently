import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/auth.slice";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/input";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [errors, setErrors] = useState({});

  /* ---------------- Password Strength ---------------- */

  const getStrength = (password) => {
    if (!password) return "";

    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < 8) return "Weak";
    if (hasUpper && hasNumber) return "Strong";
    return "Medium";
  };

  const strength = getStrength(form.password);

  /* ---------------- Validation ---------------- */

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim())
      newErrors.name = "Name is required";

    if (!form.email.includes("@"))
      newErrors.email = "Valid email required";

    if (form.password.length < 8)
      newErrors.password =
        "Minimum 8 characters required";

    if (!/[A-Z]/.test(form.password))
      newErrors.password =
        "Must include uppercase letter";

    if (!/\d/.test(form.password))
      newErrors.password =
        "Must include a number";

    if (form.password !== form.confirm)
      newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const res = await dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      setForm({
        name: "",
        email: "",
        password: "",
        confirm: ""
      });

      navigate("/verify-email");
    }
  };

  /* Clear errors on input change */
  useEffect(() => {
    setErrors({});
  }, [form]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-xl p-8">

        <h1 className="text-2xl font-semibold text-white">
          Create your account
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          Start tracking your consistency today.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-6"
        >
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            showToggle
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            error={errors.password}
          />

          {/* Strength indicator */}
          {form.password && (
            <div className="text-xs">
              <span className="text-slate-400">
                Strength:{" "}
              </span>
              <span
                className={
                  strength === "Strong"
                    ? "text-emerald-400"
                    : strength === "Medium"
                    ? "text-yellow-400"
                    : "text-rose-400"
                }
              >
                {strength}
              </span>
            </div>
          )}

          <Input
            label="Confirm Password"
            type="password"
            showToggle
            value={form.confirm}
            onChange={(e) =>
              setForm({
                ...form,
                confirm: e.target.value
              })
            }
            error={errors.confirm}
          />

          {/* Backend error */}
          {error && (
            <p className="text-sm text-rose-400">
              {error === "Email exists"
                ? "Email already registered"
                : error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white py-2 rounded-lg font-medium transition flex justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-sm text-center text-slate-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
