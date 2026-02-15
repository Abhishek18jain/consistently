import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  error,
  showToggle = false,
  rightElement,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const inputType =
    type === "password" && visible ? "text" : type;

  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-300 font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          {...props}
          className={`w-full rounded-lg bg-slate-800 border px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 transition
          ${
            error
              ? "border-rose-500 focus:ring-rose-500"
              : "border-slate-700 focus:ring-indigo-500"
          }`}
        />

        {/* Password toggle */}
        {showToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Extra element (strength meter etc.) */}
        {rightElement && (
          <div className="absolute right-10 top-2.5">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
