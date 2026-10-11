import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Users, ChevronDown, Star, Building2, BookOpen, Heart, Zap, Globe } from 'lucide-react';
import { DEMO_JOBS } from '../data/jobs';
import { DEMO_EVENTS } from '../data/events';
import { formatDateShort, formatTime } from '../lib/dates';

const categoryColors: Record<string, string> = {
  music: '#E27E72', culture: '#8C7ADB', career: '#4F79E8',
  sports: '#26866B', food: '#D9A45B', workshop: '#3C9E96',
  social: '#6D7480', outdoor: '#26866B',
};

const categoryLabels: Record<string, string> = {
  music: 'Music', culture: 'Culture', career: 'Career',
  sports: 'Sports', food: 'Food & Drink', workshop: 'Workshop',
  social: 'Social', outdoor: 'Outdoor',
  'student-job': 'Student Job', internship: 'Internship', graduate: 'Graduate',
  'part-time': 'Part-time', thesis: 'Thesis', research: 'Research', 'full-time': 'Full-time',
};

const featuredJobs = DEMO_JOBS.slice(0, 3);
const featuredEvents = DEMO_EVENTS.slice(0, 4);

export function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroScale = 1 + scrollY * 0.00008;
  const heroOpacity = Math.max(0, 1 - scrollY / 600);

  return (
    <div style={{ background: 'var(--color-bg-main)' }}>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px',
        background: scrollY > 80 ? 'rgba(244,245,247,0.88)' : 'transparent',
        backdropFilter: scrollY > 80 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 80 ? '1px solid var(--border-neutral)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: scrollY > 80 ? 'var(--color-accent-blue)' : '#fff', fontSize: '0.72rem', fontWeight: 800 }}>NK</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: scrollY > 80 ? 'var(--color-text-primary)' : '#fff', letterSpacing: '-0.01em', transition: 'color 0.3s' }}>Norrköping</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/auth?role=student')} style={{
            padding: '8px 18px', borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.38)',
            color: scrollY > 80 ? 'var(--color-text-primary)' : '#fff',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
            transition: 'all var(--transition-base)',
            fontFamily: 'var(--font-stack)',
          }}>
            Sign in
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section ref={heroRef} style={{
        position: 'relative', height: '96vh', minHeight: 600,
        display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
        {/* Background image with parallax */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          transform: `scale(${heroScale})`,
          transition: 'transform 0.1s linear',
          filter: 'saturate(0.9)',
        }} />

        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,14,22,0.18) 0%, rgba(8,14,22,0.08) 40%, rgba(8,14,22,0.72) 80%, rgba(8,14,22,0.92) 100%)',
        }} />

        {/* Hero content */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%',
          padding: '0 clamp(20px, 6vw, 80px)',
          paddingBottom: '80px',
          opacity: heroOpacity,
          transition: 'opacity 0.1s linear',
        }}>
          <div style={{ maxWidth: 820 }}>
            <div style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.6)', marginBottom: 24,
              textTransform: 'uppercase',
            }}>
              STUDY · LIVE · WORK · BELONG
            </div>
            <h1 style={{
              fontSize: 'clamp(3.2rem, 7vw, 7.2rem)', lineHeight: 1.0,
              fontWeight: 600, color: '#fff', letterSpacing: '-0.03em',
              marginBottom: 28,
            }}>
              Norrköping,<br />
              <span style={{ opacity: 0.92 }}>the city you</span><br />
              <em style={{ fontStyle: 'italic', fontWeight: 400, opacity: 0.86 }}>stay for.</em>
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
              color: 'rgba(255,255,255,0.78)', maxWidth: 520,
              lineHeight: 1.65, marginBottom: 40,
            }}>
              Discover local opportunities, student life, and the people shaping your next chapter.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/auth?role=student')} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '14px 28px', borderRadius: 'var(--radius-lg)',
                background: '#fff', color: 'var(--color-text-primary)',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                border: 'none', fontFamily: 'var(--font-stack)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Explore Norrköping <ArrowRight size={18} />
              </button>
              <button onClick={() => document.getElementById('featured-jobs')?.scrollIntoView({ behavior: 'smooth' })} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '14px 28px', borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
                color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.35)', fontFamily: 'var(--font-stack)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
                Join the community
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          opacity: Math.max(0, 1 - scrollY / 200),
          transition: 'opacity 0.2s',
        }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Scroll</span>
          <ChevronDown size={18} color="rgba(255,255,255,0.5)" />
        </div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section id="featured-jobs" style={{ padding: 'var(--space-30) 0', background: 'var(--color-bg-main)' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-blue)', marginBottom: 12 }}>OPPORTUNITIES</div>
            <h2 className="text-editorial" style={{ marginBottom: 16, maxWidth: 560 }}>Your next chapter starts here.</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', maxWidth: 520, lineHeight: 1.65 }}>
              Find the people, companies, and opportunities that can turn your studies into a future in Norrköping.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, position: 'relative' }}>
            {featuredJobs.map((job, i) => {
              const initials = job.companyName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
              const isLocked = i === 2;
              return (
                <div key={job.id} style={{ position: 'relative' }}>
                  <div style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-neutral)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-2)',
                    transition: 'all var(--transition-base)',
                    filter: isLocked ? 'blur(3px)' : 'none',
                    pointerEvents: isLocked ? 'none' : 'auto',
                    userSelect: isLocked ? 'none' : 'auto',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 700, color: '#fff', opacity: 0.88 }}>{initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>{job.companyName}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>{job.city}</div>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8, lineHeight: 1.3 }}>{job.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
                      <span style={{ fontSize: '0.72rem', padding: '3px 9px', background: 'rgba(79,121,232,0.1)', color: 'var(--color-accent-blue)', borderRadius: 999, fontWeight: 600 }}>
                        {categoryLabels[job.category]}
                      </span>
                      <span style={{ fontSize: '0.72rem', padding: '3px 9px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', borderRadius: 999 }}>
                        {job.workArrangement}
                      </span>
                      <span className="demo-badge">Demo</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                        <MapPin size={12} /> {job.city}
                      </div>
                    </div>
                  </div>

                  {isLocked && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 16,
                      background: 'rgba(244,245,247,0.7)',
                      backdropFilter: 'blur(2px)',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--border-neutral)',
                    }}>
                      <div style={{ textAlign: 'center', padding: '0 24px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🔒</div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: 8 }}>More opportunities await</div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>Join to discover all jobs and internships in Norrköping.</p>
                        <button onClick={() => navigate('/auth?role=student')} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '10px 20px', borderRadius: 'var(--radius-md)',
                          background: 'var(--color-accent-blue)', color: '#fff',
                          fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', border: 'none',
                          fontFamily: 'var(--font-stack)',
                        }}>
                          Sign up free <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 36, textAlign: 'center' }}>
            <button onClick={() => navigate('/auth?role=student')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-neutral)', background: 'transparent',
              color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
              fontFamily: 'var(--font-stack)',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent-blue)'; e.currentTarget.style.color = 'var(--color-accent-blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-neutral)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
              View all opportunities <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section style={{ padding: 'var(--space-30) 0', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-teal)', marginBottom: 12 }}>CITY LIFE</div>
            <h2 className="text-editorial" style={{ marginBottom: 16, maxWidth: 560 }}>There is more to the city.</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', maxWidth: 520, lineHeight: 1.65 }}>
              Concerts, workshops, outdoor adventures, career events, and community gatherings — Norrköping has more going on than you think.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {featuredEvents.slice(0, 2).map(event => (
              <div key={event.id} style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-neutral)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-2)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}>
                <div style={{
                  height: 180,
                  background: `linear-gradient(135deg, ${categoryColors[event.category] || '#4F79E8'} 0%, ${(categoryColors[event.category] || '#315FC9') + '99'} 100%)`,
                  position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '16px',
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)' }}>
                    {categoryLabels[event.category]}
                  </span>
                  {event.isFree && (
                    <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', background: 'rgba(38,134,107,0.85)', color: '#fff', borderRadius: 999 }}>Free</span>
                  )}
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 8, lineHeight: 1.3 }}>{event.title}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <Calendar size={13} /> {formatDateShort(event.startDateTime)} · {formatTime(event.startDateTime)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <MapPin size={13} /> {event.venue}
                    </div>
                  </div>
                  <span className="demo-badge" style={{ marginTop: 12, display: 'inline-flex' }}>Demo</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 20 }}>
            {featuredEvents.slice(2, 4).map(event => (
              <div key={event.id} style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-neutral)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 22px',
                display: 'flex', gap: 16, alignItems: 'flex-start',
                boxShadow: 'var(--shadow-1)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-2)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-1)'}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${categoryColors[event.category] || '#4F79E8'} 0%, ${(categoryColors[event.category] || '#315FC9') + '99'} 100%)`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{event.title}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{formatDateShort(event.startDateTime)} · {formatTime(event.startDateTime)}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{event.venue}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: categoryColors[event.category] || 'var(--color-accent-blue)' }}>{categoryLabels[event.category]}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, textAlign: 'center' }}>
            <button onClick={() => navigate('/auth?role=student')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-neutral)', background: 'transparent',
              color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
              fontFamily: 'var(--font-stack)',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent-teal)'; e.currentTarget.style.color = 'var(--color-accent-teal)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-neutral)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
              Discover all events <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* CITY COMMUNITY SECTION */}
      <section style={{ padding: 'var(--space-30) 0', background: 'var(--color-bg-main)' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-violet)', marginBottom: 12 }}>ECOSYSTEM</div>
            <h2 className="text-editorial" style={{ maxWidth: 560 }}>A city built around possibility.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: Users, title: 'Students & Associations', desc: 'Thousands of students from Linköping University, active associations, and a connected campus community in the heart of Norrköping.', color: 'var(--color-accent-blue)' },
              { icon: Building2, title: 'Local Companies', desc: 'Tech companies, industrial leaders, creative studios, and sustainability innovators — all based in Norrköping and looking for talent.', color: 'var(--color-accent-teal)' },
              { icon: Globe, title: 'Municipality & Services', desc: 'City administration, public services, and a municipality committed to making Norrköping one of the most livable cities in Sweden.', color: 'var(--color-accent-violet)' },
              { icon: Star, title: 'Cultural Institutions', desc: 'Museums, the symphony orchestra, theaters, galleries, and a cultural scene that punches above its weight.', color: 'var(--color-accent-coral)' },
              { icon: Zap, title: 'Innovation & Startups', desc: 'Coworking spaces, startup programs, and an entrepreneurship ecosystem that is building the next generation of Norrköping companies.', color: 'var(--color-accent-amber)' },
              { icon: Heart, title: 'Community Spaces', desc: 'Sports clubs, student neighborhoods, community organizations, and a waterfront that brings people together naturally.', color: 'var(--color-success)' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-neutral)',
                borderRadius: 'var(--radius-xl)',
                padding: '26px',
                boxShadow: 'var(--shadow-1)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-2)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-1)'}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <item.icon size={22} color={item.color} />
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY STAY SECTION */}
      <section style={{ padding: 'var(--space-30) 0', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-amber)', marginBottom: 12 }}>WHY NORRKÖPING</div>
            <h2 className="text-editorial" style={{ maxWidth: 560 }}>Five reasons students stay.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { n: '01', title: 'Career opportunities close to your studies', body: 'Real employers in technology, engineering, consulting, and creative industries — five minutes from campus.' },
              { n: '02', title: 'A cultural scene with room to explore', body: 'Museums, live music, art exhibitions, and waterfront events that fill the city year-round.' },
              { n: '03', title: 'Communities where people know one another', body: 'Small enough to build real relationships. Large enough to keep discovering new ones.' },
              { n: '04', title: 'Accessible urban life and waterfront spaces', body: 'Motala Ström, the industrial landscape, and green parks make Norrköping genuinely beautiful to live in.' },
            ].map(item => (
              <div key={item.n} style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                padding: '24px',
                background: 'var(--surface-elevated)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-neutral)',
                boxShadow: 'var(--shadow-1)',
              }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-bg-tertiary)', lineHeight: 1, flexShrink: 0, letterSpacing: '-0.04em' }}>{item.n}</div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 8, lineHeight: 1.35 }}>{item.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        padding: 'var(--space-30) 0',
        background: 'var(--color-text-primary)',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Your life in Norrköping<br />is just beginning.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', marginBottom: 40, lineHeight: 1.6 }}>
              Whether you're exploring career options, looking for your community, or just getting started — this platform is for you.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/auth?role=student')} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '14px 28px', borderRadius: 'var(--radius-lg)',
                background: '#fff', color: 'var(--color-text-primary)',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
                fontFamily: 'var(--font-stack)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <BookOpen size={18} /> I'm a student
              </button>
              <button onClick={() => navigate('/auth?role=company')} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '14px 28px', borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
                color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.25)', fontFamily: 'var(--font-stack)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                <Building2 size={18} /> I represent a company
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0f1621', padding: 'var(--space-16) 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: '0.68rem', fontWeight: 800 }}>NK</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Norrköping</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 280 }}>
                Connecting students, companies, and the city of Norrköping in one platform.
              </p>
              <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 999, background: 'rgba(217,164,91,0.12)', border: '1px solid rgba(217,164,91,0.25)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-accent-amber)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>DEMO ENVIRONMENT</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 16 }}>Platform</div>
              {[
                { label: 'Student Portal', to: '/auth?role=student' },
                { label: 'Company Portal', to: '/auth?role=company' },
                { label: 'Jobs', to: '/auth?role=student' },
                { label: 'Events', to: '/auth?role=student' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 10, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 16 }}>Resources</div>
              {['About', 'Help', 'Contact', 'Privacy (Placeholder)', 'Terms (Placeholder)'].map(l => (
                <span key={l} style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 10, cursor: 'default' }}>{l}</span>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 16 }}>Language</div>
              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(79,121,232,0.18)', border: '1px solid rgba(79,121,232,0.35)', color: 'var(--color-accent-blue)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-stack)' }}>🇬🇧 English</button>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-stack)' }}>🇸🇪 Svenska</button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>© 2025 Norrköping — The City You Stay For. Demo environment.</span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>Sample data only — no real opportunities or events listed.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
