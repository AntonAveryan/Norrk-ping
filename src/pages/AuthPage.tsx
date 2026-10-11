import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { GraduationCap, Building2, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

type Step = 'role' | 'demo';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<'student' | 'company' | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'student' || roleParam === 'company') {
      setSelectedRole(roleParam);
      setStep('demo');
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'student' ? '/student' : '/company', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleContinueDemo = () => {
    if (!selectedRole) return;
    login(selectedRole);
    navigate(selectedRole === 'student' ? '/student' : '/company', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-main)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=60)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(8px) saturate(0.4)', opacity: 0.18,
        transform: 'scale(1.05)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>NK</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Norrköping</span>
          </Link>

          {step === 'role' ? (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 10, letterSpacing: '-0.015em' }}>Welcome to Norrköping.</h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Choose how you want to explore the platform.</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 10, letterSpacing: '-0.015em' }}>
                {selectedRole === 'student' ? 'Student Portal' : 'Company Portal'}
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                {selectedRole === 'student' ? 'Continue with the demo student account.' : 'Continue with the demo company account.'}
              </p>
            </>
          )}
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-2xl)',
          padding: 32,
          boxShadow: '0 20px 60px rgba(20,30,45,0.12)',
        }}>
          {/* Demo notice */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '12px 16px', borderRadius: 'var(--radius-md)',
            background: 'rgba(217,164,91,0.1)', border: '1px solid rgba(217,164,91,0.25)',
            marginBottom: 24,
          }}>
            <Info size={15} color="var(--color-accent-amber)" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: '0.82rem', color: 'var(--color-accent-amber)', lineHeight: 1.5, fontWeight: 500 }}>
              <strong>DEMO ENVIRONMENT</strong> — Sample data and local-only actions. No real accounts or data are created.
            </p>
          </div>

          {step === 'role' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                {
                  role: 'student' as const,
                  Icon: GraduationCap,
                  title: 'I am a student',
                  desc: 'Discover opportunities, explore the city, and find your community.',
                  color: 'var(--color-accent-blue)',
                },
                {
                  role: 'company' as const,
                  Icon: Building2,
                  title: 'I represent a company',
                  desc: 'Connect with students and share opportunities in Norrköping.',
                  color: 'var(--color-accent-teal)',
                },
              ].map(({ role, Icon, title, desc, color }) => (
                <button
                  key={role}
                  onClick={() => { setSelectedRole(role); setStep('demo'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 18,
                    padding: '20px 22px', borderRadius: 'var(--radius-lg)',
                    background: selectedRole === role ? `${color}0f` : 'var(--color-bg-main)',
                    border: `1.5px solid ${selectedRole === role ? color : 'var(--border-neutral)'}`,
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all var(--transition-base)',
                    fontFamily: 'var(--font-stack)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}0f`; }}
                  onMouseLeave={e => { if (selectedRole !== role) { e.currentTarget.style.borderColor = 'var(--border-neutral)'; e.currentTarget.style.background = 'var(--color-bg-main)'; } }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={24} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                  <ArrowRight size={18} color="var(--color-text-muted)" />
                </button>
              ))}
            </div>
          )}

          {step === 'demo' && selectedRole && (
            <div>
              <div style={{ marginBottom: 24, padding: '16px 20px', background: 'var(--color-bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-neutral)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Demo account</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 3 }}>Name</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {selectedRole === 'student' ? 'Alex Lindqvist' : 'Sara Bergström'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 3 }}>Email</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {selectedRole === 'student' ? 'alex@student-demo.se' : 'sara@kopparhuset-demo.se'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 3 }}>Role</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {selectedRole === 'student' ? 'Student — MSc Interaction & Design' : 'Company — Kopparhuset Tech'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 3 }}>Password</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>N/A — demo mode</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={handleContinueDemo} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '13px 24px', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-accent-blue)', color: '#fff',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
                  fontFamily: 'var(--font-stack)',
                  boxShadow: '0 4px 16px rgba(79,121,232,0.3)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Continue as demo {selectedRole} <ArrowRight size={18} />
                </button>

                <button onClick={() => { setStep('role'); setSelectedRole(null); }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 24px', borderRadius: 'var(--radius-md)',
                  background: 'transparent', border: '1px solid var(--border-neutral)',
                  color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.88rem', cursor: 'pointer',
                  fontFamily: 'var(--font-stack)',
                }}>
                  <ArrowLeft size={15} /> Back
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>← Back to homepage</Link>
        </div>
      </div>
    </div>
  );
}
