import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail,  } from "../auth.slice";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { verifyLoading, verifyError, verified } = useSelector(
    (state) => state.auth
  );

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [redirectTimer, setRedirectTimer] = useState(3);
const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  /* ===== TIMER ===== */

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ===== VERIFY SUCCESS ===== */

  useEffect(() => {
    if (verified) {
      toast.success("Email verified successfully");
        setShowSuccessPopup(true);
    }
  }, [verified]);
  useEffect(() => {
  if (!showSuccessPopup) return;

  if (redirectTimer === 0) {
    navigate("/login");
    return;
  }

  const interval = setInterval(() => {
    setRedirectTimer((t) => t - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [showSuccessPopup, redirectTimer]);


  useEffect(() => {
    if (verifyError) {
      toast.error(verifyError);
    }
  }, [verifyError]);

  /* ===== OTP INPUT ===== */

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  /* ===== SUBMIT ===== */

  const handleSubmit = (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Enter complete code");
      return;
    }

    dispatch(
      verifyEmail({
        email,
        otp: code
      })
    );
  };

  /* ===== RESEND ===== */

//   const handleResend = () => {
//     dispatch(resendOtp(userId));
//     toast.success("OTP resent");
//     setTimer(60);
//   };

  return (
    <AuthLayout>
      <div className="w-full max-w-md text-white">

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold">
            Verify your email
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* OTP INPUT */}
          <div className="flex justify-between gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                maxLength="1"
                className="
                w-12 h-12 text-center text-lg rounded-lg
                bg-[#020617]/70 border border-white/10
                focus:outline-none
                focus:ring-2 focus:ring-blue-500/40
                "
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button
            disabled={verifyLoading}
            className="
            w-full py-3 rounded-lg font-semibold
            bg-gradient-to-r from-blue-600 to-indigo-600
            disabled:opacity-50
            "
          >
            {verifyLoading ? "Verifying..." : "Verify Email"}
          </button>

          {/* RESEND */}
          {/* <div className="text-center text-sm text-gray-400">
            {timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              <span
                onClick={handleResend}
                className="text-blue-400 cursor-pointer"
              >
                Resend Code
              </span>
            )}
          </div> */}
              {/* BACK */}
          <p
            onClick={() => navigate("/register")}
            className="text-center text-sm text-gray-500 cursor-pointer hover:text-gray-300"
          >
            ← Back to registration
          </p>

        </form>
        {showSuccessPopup && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    
    <div className="bg-[#020617] p-8 rounded-2xl shadow-2xl text-center w-80 border border-green-500/30">
      
      <div className="text-green-400 text-3xl mb-3">✔</div>

      <h3 className="text-lg font-semibold mb-2">
        Email Verified Successfully
      </h3>

      <p className="text-gray-400 text-sm">
        Redirecting to login in{" "}
        <span className="text-green-400 font-semibold">
          {redirectTimer}
        </span>{" "}
        seconds...
      </p>

    </div>

  </div>
)}

      </div>
    </AuthLayout>
  );
}
