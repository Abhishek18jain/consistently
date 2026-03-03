import AuthPreview from "../../features/auth/components/AuthPreview";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">

      {/* ===== BACKGROUND GLOW ===== */}
      <div className="absolute w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 blur-[160px] rounded-full bottom-0 right-0" />

      {/* ===== MAIN CARD ===== */}
      <div className="relative z-10 w-full max-w-6xl p-6">
        <div
          className="
          flex rounded-2xl overflow-hidden
          bg-gradient-to-br from-[#0b1220]/80 to-[#020617]/80
          backdrop-blur-xl
          border border-white/10
          shadow-[0_0_60px_rgba(59,130,246,0.15)]
          "
        >

          {/* ===== LEFT PANEL ===== */}
          <div className="hidden lg:flex w-1/2 p-14 text-white bg-gradient-to-br from-[#0b1220] via-[#020617] to-black">

            <div className="max-w-md">

              {/* BRAND */}
              <h2 className="text-2xl font-semibold mb-10 tracking-wide">
                Consistency Coach
              </h2>

              {/* HEADLINE */}
              <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
                Build consistency.
                <br />
                Track your life.
              </h1>

              {/* FEATURES */}
              <ul className="space-y-3 text-gray-400 mb-12">
                <li>✔ Daily journaling</li>
                <li>✔ Habit streak tracking</li>
                <li>✔ Personal insights</li>
              </ul>

              {/* ===== VISUAL MODULE ===== */}
              <div className="bg-[#020617]/70 p-6 rounded-xl border border-white/10 shadow-inner">
                <AuthPreview />
              </div>

            </div>
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div className="w-full lg:w-1/2 p-12 flex items-center justify-center bg-[#020617]/40">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
