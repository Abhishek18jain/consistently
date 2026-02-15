import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/auth.slice";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import Input from "../components/ui/input";
import Button from "../components/ui/button";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue tracking your consistency."
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {error && (
          <p className="text-sm text-rose-500 mb-3">{error}</p>
        )}

        <Button loading={loading}>Login</Button>

        <div className="flex justify-between text-sm mt-4">
          <Link to="/forgot-password" className="text-indigo-600">
            Forgot password?
          </Link>
          <Link to="/register" className="text-indigo-600">
            Create account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
