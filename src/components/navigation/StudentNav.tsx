import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Calendar, HelpCircle, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

const navItems = [
  { to: '/student', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/student/jobs', label: 'Job Offers', icon: Briefcase, end: false },
  { to: '/student/events', label: 'Parties & Events', icon: Calendar, end: false },
  { to: '/student/help', label: 'Help', icon: HelpCircle, end: false },
];

export function StudentNav() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = currentUser?.displayName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'A';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(244,245,247,0.82)',
      backdropFilter: 'blur(20px) saturate(150%)',
      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
      borderBottom: '1px solid var(--border-neutral)',
      boxShadow: '0 1px 0 rgba(35,42,54,0.06)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 58, gap: 24 }}>
        <NavLink to="/student" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>NK</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>Norrköping</span>
        </NavLink>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }} className="desktop-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 12px', borderRadius: 'var(--radius-md)',
              fontSize: '0.86rem', fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
              background: isActive ? 'rgba(79,121,232,0.09)' : 'transparent',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
            })}>
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setProfileOpen(!profileOpen)} style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 10px', borderRadius: 12,
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>{initials}</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }} className="hide-mobile">{currentUser?.displayName}</span>
              <ChevronDown size={14} color="var(--color-text-muted)" />
            </button>
            {profileOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 6,
                background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-neutral)', borderRadius: 14,
                padding: 6, minWidth: 180,
                boxShadow: 'var(--shadow-3)', zIndex: 200,
              }}>
                <NavLink to="/student/profile" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, fontSize: '0.88rem', color: 'var(--color-text-primary)', fontWeight: 500, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-secondary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <User size={15} /> My Profile
                </NavLink>
                <div style={{ height: 1, background: 'var(--border-divider)', margin: '4px 0' }} />
                <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, fontSize: '0.88rem', color: 'var(--color-error)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,84,84,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <LogOut size={15} /> Log out
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }} className="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border-neutral)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem', fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-accent-blue)' : 'var(--color-text-primary)',
              background: isActive ? 'rgba(79,121,232,0.09)' : 'transparent',
              textDecoration: 'none',
            })}>
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
          <div style={{ height: 1, background: 'var(--border-divider)', margin: '8px 0' }} />
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-error)', fontWeight: 500 }}>
            <LogOut size={18} /> Log out
          </button>
        </div>
      )}
    </nav>
  );
}
