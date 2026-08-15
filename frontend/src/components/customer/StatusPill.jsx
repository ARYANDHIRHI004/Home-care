// Color mapping per the blueprint's shared list-item pattern:
// amber = pending action needed, blue = in progress, green = completed/paid,
// gray = cancelled/expired, red = rejected.
const STYLES = {
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  gray: 'bg-slate-100 text-slate-600 border-slate-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
};

// Maps a raw status string to which color bucket it belongs in — centralized
// here so every page's status pill agrees with every other page's, instead of
// each page inventing its own color logic.
export function statusColor(status) {
  const s = (status || '').toLowerCase();
  if (['active', 'in progress', 'on route'].some((k) => s.includes(k))) return 'blue';
  if (['completed', 'paid', 'verified', 'approved'].some((k) => s.includes(k))) return 'green';
  if (['pending', 'unpaid', 'under verification', 'upcoming', 'scheduled'].some((k) => s.includes(k))) return 'amber';
  if (['cancelled', 'expired'].some((k) => s.includes(k))) return 'gray';
  if (['rejected'].some((k) => s.includes(k))) return 'red';
  return 'gray';
}

export default function StatusPill({ status, color }) {
  const c = color || statusColor(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STYLES[c]}`}>
      {status}
    </span>
  );
}
