import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
      padding: 24, textAlign: 'center',
      background: 'var(--color-bg-main)',
    }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--color-bg-secondary)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Page not found</h1>
      <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: 360 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 20px', borderRadius: 'var(--radius-md)',
        background: 'var(--color-accent-blue)', color: '#fff',
        fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
      }}>
        <ArrowLeft size={16} /> Back to home
      </Link>
    </div>
  );
}
