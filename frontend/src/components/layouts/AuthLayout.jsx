import { motion } from "framer-motion";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white shadow-sm rounded-xl p-8"
      >
        <h1 className="text-2xl font-semibold text-slate-800">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm text-slate-500 mt-2">
            {subtitle}
          </p>
        )}

        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
}
