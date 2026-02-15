import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/auth/auth.slice";
import AuthLayout from "../components/layouts/AuthLayout";
import Input from "../components/ui/input";
import Button from "../components/ui/button";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(forgotPassword({ email }));
    if (res.meta.requestStatus === "fulfilled") {
      setSent(true);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll send you a secure reset link."
    >
      {sent ? (
        <p className="text-sm text-emerald-600">
          Reset link sent. Check your email.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button loading={loading}>Send Reset Link</Button>
        </form>
      )}
    </AuthLayout>
  );
}
