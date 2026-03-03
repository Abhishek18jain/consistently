/* 📅 Format date to YYYY-MM-DD */
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

/* ⬅️ Previous day */
export function getPreviousDate(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
}

/* ➡️ Next day */
export function getNextDate(date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
}

/* 🚫 Prevent navigating into future */
export function isFutureDate(date) {
  const today = new Date();
  const d = new Date(date);

  return d > today;
}

/* 📆 Today helper */
export function getToday() {
  return new Date();
}