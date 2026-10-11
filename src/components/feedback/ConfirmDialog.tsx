import { AlertTriangle } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger = true }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      background: 'rgba(12,18,26,0.48)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }} onClick={onCancel}>
      <div className="animate-modal-in" style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(24px)',
        borderRadius: 20,
        padding: 28,
        maxWidth: 420, width: '100%',
        boxShadow: '0 24px 72px rgba(10,18,30,0.2)',
        border: '1px solid rgba(255,255,255,0.8)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          {danger && <AlertTriangle size={20} color="var(--color-error)" style={{ marginTop: 2, flexShrink: 0 }} />}
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-text-primary)', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{message}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '9px 18px', borderRadius: 12, border: '1px solid var(--border-neutral)',
            background: 'transparent', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text-secondary)',
          }}>{cancelLabel}</button>
          <button onClick={onConfirm} style={{
            padding: '9px 18px', borderRadius: 12, border: 'none',
            background: danger ? 'var(--color-error)' : 'var(--color-accent-blue)',
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#fff',
          }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
