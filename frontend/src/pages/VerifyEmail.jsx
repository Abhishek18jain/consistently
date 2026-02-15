import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";

export default function VerifyEmail() {
  const { token } = useParams();

  useEffect(() => {
    // call backend verify endpoint here
  }, [token]);

  return (
    <AuthLayout
      title="Verifying Email"
      subtitle="Please wait while we confirm your email."
    >
      <p className="text-sm text-slate-500">
        Verification in progress...
      </p>
    </AuthLayout>
  );
}
