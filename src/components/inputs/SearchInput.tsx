import React, { type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

export function SearchInput({ value, onChange, onClear, placeholder = 'Search…', style, ...props }: Props) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', ...(style as React.CSSProperties) }}>
      <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 14, pointerEvents: 'none', flexShrink: 0 }} />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 40px 10px 40px',
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border-neutral)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem', color: 'var(--color-text-primary)',
          outline: 'none',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          fontFamily: 'var(--font-stack)',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,121,232,0.12)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-neutral)'; e.currentTarget.style.boxShadow = 'none'; }}
        {...props}
      />
      {value && onClear && (
        <button onClick={onClear} style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
