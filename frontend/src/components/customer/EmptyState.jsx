import Link from 'next/link';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-[#F0F4FF] flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-[#2554F0]" />
        </div>
      )}
      <h3 className="text-sm font-bold text-[#0F172A] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#0F172A]/60 max-w-xs mb-5">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
