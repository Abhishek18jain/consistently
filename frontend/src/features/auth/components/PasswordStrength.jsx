export default function PasswordStrength({ password }) {

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const strength =
    score === 3 ? "Strong" :
    score === 2 ? "Medium" :
    "Weak";

  const width = (score / 3) * 100;

  return (
    <div className="mt-2 space-y-2 text-sm">

      <Checklist text="At least 8 characters" ok={checks.length} />
      <Checklist text="One uppercase letter" ok={checks.uppercase} />
      <Checklist text="One number" ok={checks.number} />

      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <span className="text-gray-300">{strength}</span>

        <div className="flex-1 h-2 bg-gray-800 rounded">
          <div
            className="h-2 bg-emerald-400 rounded"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Checklist({ text, ok }) {
  return (
    <div className="flex items-center gap-2">
      <span className={ok ? "text-emerald-400" : "text-gray-500"}>
        ✔
      </span>
      <span>{text}</span>
    </div>
  );
}
