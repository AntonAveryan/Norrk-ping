import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', children, loading, disabled, style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-stack)',
    fontWeight: 600, cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.55 : 1,
    transition: 'all var(--transition-base)',
    border: 'none', outline: 'none',
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '7px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' },
    md: { padding: '10px 20px', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' },
    lg: { padding: '13px 28px', fontSize: '1rem', borderRadius: 'var(--radius-lg)' },
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--color-accent-blue)', color: '#fff', boxShadow: '0 2px 12px rgba(79,121,232,0.25)' },
    secondary: { background: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--border-neutral)' },
    ghost: { background: 'transparent', color: 'var(--color-text-secondary)' },
    danger: { background: 'var(--color-error)', color: '#fff' },
    glass: {
      background: 'rgba(255,255,255,0.46)',
      backdropFilter: 'blur(16px)',
      color: 'var(--color-text-primary)',
      border: '1px solid rgba(255,255,255,0.7)',
      boxShadow: '0 4px 14px rgba(20,30,45,0.07)',
    },
  };

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}
