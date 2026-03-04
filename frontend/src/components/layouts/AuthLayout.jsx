import AuthPreview from "../../features/auth/components/AuthPreview";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden
                    bg-gradient-to-br from-gray-100 via-gray-50 to-white">

      {/* Background decoration */}
      <div className="absolute w-[500px] h-[500px] bg-blue-100/60 blur-[120px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-purple-100/40 blur-[120px] rounded-full bottom-0 right-0" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl p-4 sm:p-6">
        <div
          className="
          flex rounded-2xl overflow-hidden
          bg-white/80 backdrop-blur-xl
          border border-gray-200
          shadow-2xl shadow-gray-200/50
          "
        >

          {/* LEFT PANEL */}
          <div className="hidden lg:flex w-1/2 p-12 bg-gray-900 text-white">
            <div className="max-w-md">

              {/* BRAND */}
              <h2 className="text-xl font-semibold mb-8 tracking-wide text-gray-300">
                ConsistIQ
              </h2>

              {/* HEADLINE */}
              <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
                Build consistency.
                <br />
                Track your life.
              </h1>

              {/* FEATURES */}
              <ul className="space-y-3 text-gray-400 mb-10">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✔</span> Daily journaling
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✔</span> Habit streak tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✔</span> Personal insights
                </li>
              </ul>

              {/* VISUAL MODULE */}
              <div className="bg-gray-800/60 p-5 rounded-xl border border-gray-700/50">
                <AuthPreview />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 flex items-center justify-center bg-white">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
