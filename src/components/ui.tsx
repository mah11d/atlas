import type { ReactNode } from 'react';

export function Section({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2.5">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

export function StatGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 p-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">{item.label}</div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function ChipList({ items, color = 'brand' }: { items: string[]; color?: 'brand' | 'accent' | 'amber' }) {
  const colors: Record<string, string> = {
    brand: 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border-brand-500/20',
    accent: 'bg-accent-500/15 text-accent-600 dark:text-accent-400 border-accent-500/20',
    amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20',
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[color]}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/20 dark:border-white/5 last:border-0">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-right">{value}</span>
    </div>
  );
}

export function EmptyState({ icon, title, message }: { icon: ReactNode; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-4 text-brand-500">
        {icon}
      </div>
      <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-2">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{message}</p>
    </div>
  );
}
