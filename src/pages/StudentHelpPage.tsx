import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { StudentNav } from '../components/navigation/StudentNav';
import { DEMO_HELP } from '../data/help';

const CATEGORIES = [
  { id: 'all', label: 'All topics' },
  { id: 'Housing', label: 'Housing' },
  { id: 'Public Transport', label: 'Transport' },
  { id: 'Student Life', label: 'Student Life' },
  { id: 'International', label: 'International' },
  { id: 'Career', label: 'Career' },
  { id: 'Health', label: 'Health & Wellbeing' },
  { id: 'Libraries', label: 'Libraries' },
  { id: 'Sports', label: 'Sports & Recreation' },
  { id: 'City', label: 'City Services' },
  { id: 'Everyday', label: 'Everyday Life' },
];

function matchCategory(articleCategory: string, filterCat: string): boolean {
  if (filterCat === 'all') return true;
  return articleCategory.toLowerCase().includes(filterCat.toLowerCase()) ||
    filterCat.toLowerCase().includes(articleCategory.toLowerCase().split(' ')[0]);
}

export function StudentHelpPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return DEMO_HELP.filter(article => {
      const matchesQuery = !query ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase());
      const matchesCat = activeCategory === 'all' || matchCategory(article.category, activeCategory);
      return matchesQuery && matchesCat;
    });
  }, [query, activeCategory]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <StudentNav />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 900 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-teal)', marginBottom: 12 }}>CITY GUIDE & HELP</div>
          <h1 className="text-page-heading" style={{ marginBottom: 12 }}>Living in Norrköping.</h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: 560, lineHeight: 1.65 }}>
            Guides on housing, transport, student life, healthcare, and everyday practicalities in Norrköping — collected from common student questions.
          </p>
          <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(79,121,232,0.07)', border: '1px solid rgba(79,121,232,0.14)' }}>
            <Info size={13} color="var(--color-accent-blue)" />
            <span style={{ fontSize: '0.76rem', color: 'var(--color-accent-blue)', fontWeight: 500 }}>General guidance only — always verify with official sources for critical decisions.</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 22 }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search guides..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 42px',
              borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-neutral)',
              background: 'var(--surface-elevated)', color: 'var(--color-text-primary)',
              fontSize: '0.93rem', fontFamily: 'var(--font-stack)',
              boxShadow: 'var(--shadow-1)', outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent-teal)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-neutral)'}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-pill)',
                border: `1px solid ${activeCategory === cat.id ? 'var(--color-accent-teal)' : 'var(--border-neutral)'}`,
                background: activeCategory === cat.id ? 'rgba(60,158,150,0.1)' : 'var(--surface-elevated)',
                color: activeCategory === cat.id ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)',
                fontWeight: activeCategory === cat.id ? 600 : 400,
                fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-stack)',
                transition: 'all var(--transition-base)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 18, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}{query ? ` for "${query}"` : ''}
        </div>

        {/* Articles */}
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>🔍</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>No articles found</div>
            <button onClick={() => { setQuery(''); setActiveCategory('all'); }} style={{ fontSize: '0.84rem', color: 'var(--color-accent-teal)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-stack)' }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(article => {
              const isOpen = openArticle === article.id;
              return (
                <div key={article.id} style={{
                  background: 'var(--surface-elevated)',
                  border: `1px solid ${isOpen ? 'rgba(60,158,150,0.22)' : 'var(--border-neutral)'}`,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: isOpen ? 'var(--shadow-2)' : 'var(--shadow-1)',
                  transition: 'all var(--transition-base)',
                }}>
                  <button
                    onClick={() => setOpenArticle(isOpen ? null : article.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16,
                      padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'var(--font-stack)',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-teal)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'rgba(60,158,150,0.1)' }}>
                          {article.category}
                        </span>
                        <span className="demo-badge">DEMO</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.96rem', color: isOpen ? 'var(--color-accent-teal)' : 'var(--color-text-primary)', transition: 'color var(--transition-fast)' }}>
                        {article.title}
                      </div>
                      {!isOpen && (
                        <div style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                          {article.summary}
                        </div>
                      )}
                    </div>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      {isOpen ? <ChevronUp size={17} color="var(--color-text-muted)" /> : <ChevronDown size={17} color="var(--color-text-muted)" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 22px 22px', borderTop: '1px solid var(--border-divider)' }}>
                      <div style={{ paddingTop: 18 }}>
                        <div style={{ marginBottom: 14, fontSize: '0.87rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                          {article.content}
                        </div>
                        {article.tags && article.tags.length > 0 && (
                          <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 8 }}>TAGS</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {article.tags.map((tag, i) => (
                                <span key={i} style={{ fontSize: '0.78rem', padding: '2px 10px', borderRadius: 999, background: 'rgba(60,158,150,0.1)', color: 'var(--color-accent-teal)', fontWeight: 500 }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div style={{ marginTop: 14, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(185,128,45,0.07)', border: '1px solid rgba(185,128,45,0.15)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)' }}>This is demo content for illustration purposes. Verify all information through official sources.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
