import clsx from "clsx";

export default function Button({ children, loading, variant = "primary", ...props }) {
  const base = "w-full py-2 rounded-lg text-sm font-medium transition";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "bg-slate-200 text-slate-700 hover:bg-slate-300"
  };

  return (
    <button
      {...props}
      disabled={loading}
      className={clsx(base, variants[variant], loading && "opacity-70")}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
