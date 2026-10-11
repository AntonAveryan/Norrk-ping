import { useToast } from '../../hooks/useToast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: { bg: 'rgba(38,134,107,0.12)', border: 'rgba(38,134,107,0.3)', icon: '#26866B', text: '#1a5c4a' },
  error: { bg: 'rgba(200,84,84,0.12)', border: 'rgba(200,84,84,0.3)', icon: '#C85454', text: '#8b2c2c' },
  warning: { bg: 'rgba(185,128,45,0.12)', border: 'rgba(185,128,45,0.3)', icon: '#B9802D', text: '#7a5218' },
  info: { bg: 'rgba(79,121,232,0.12)', border: 'rgba(79,121,232,0.3)', icon: '#4F79E8', text: '#2c4fa8' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
    }}>
      {toasts.map(toast => {
        const Icon = icons[toast.type];
        const c = colors[toast.type];
        return (
          <div key={toast.id} className="animate-toast-in" style={{
            pointerEvents: 'all',
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${c.border}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(20,30,45,0.12)',
            minWidth: 260, maxWidth: 380,
            fontSize: '0.9rem', color: c.text, fontWeight: 500,
          }}>
            <Icon size={16} color={c.icon} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-muted)', padding: 2, borderRadius: 4, flexShrink: 0,
            }}>
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
