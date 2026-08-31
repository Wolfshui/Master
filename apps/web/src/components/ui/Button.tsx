
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  loading?: boolean;
  tone?: 'primary' | 'secondary' | 'danger';
}

const toneClasses: Record<NonNullable<ButtonProps['tone']>, string> = {
  primary: 'bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-primary-hover)]',
  secondary: 'bg-white text-[var(--color-text-default)] border border-slate-300 hover:bg-slate-50',
  danger: 'bg-[var(--color-feedback-danger)] text-[var(--color-text-inverse)] hover:opacity-90',
};

export function Button({ children, className = '', disabled, loading = false, tone = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses[tone]} ${className}`.trim()}
    >
      {loading ? <span aria-hidden="true">⏳</span> : null}
      <span>{loading ? 'Working…' : children}</span>
    </button>
  );
}
