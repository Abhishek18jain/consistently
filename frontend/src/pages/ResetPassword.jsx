import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../features/auth/auth.slice";
import AuthLayout from "../components/layouts/AuthLayout";
import Input from "../components/ui/input";
import Button from "../components/ui/button";

export default function ResetPassword() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, passwordResetSuccess } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(resetPassword({ token, password }));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  return (
    <AuthLayout title="Set new password">
      <form onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button loading={loading}>Reset Password</Button>
      </form>
    </AuthLayout>
  );
}
