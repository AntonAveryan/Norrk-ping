import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, FileText, MessageSquare, Globe, BookOpen, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { StudentNav } from '../components/navigation/StudentNav';

const sections = [
  {
    id: 'cv', icon: FileText, title: 'Preparing a Swedish-style CV',
    summary: 'Swedish CVs are concise, honest, and often include a photo.',
    content: `A Swedish CV typically runs one to two pages. Include a professional photo (this is standard practice in Sweden), your contact details, education in reverse chronological order, relevant work experience, key skills, and languages. Avoid lengthy descriptions — bullet points work well. Honesty is essential, as references are routinely checked and the professional culture values straightforwardness.

**Key points:**
- One to two pages maximum
- Professional photo is normal and expected
- Education: most recent first
- Experience: specific, results-oriented bullet points
- Skills section: programming languages, tools, certifications
- Languages: specify proficiency level (e.g., Swedish: B2, English: C1)
- Include your LinkedIn profile

**What to avoid:**
- Generic objective statements
- Exaggerating or inflating responsibilities
- Photographs that are casual or low quality
- Unexplained employment gaps (address them briefly in the cover letter)`,
  },
  {
    id: 'cover', icon: MessageSquare, title: 'Writing a strong cover letter',
    summary: 'One specific page explaining why this company, why this role.',
    content: `A Swedish cover letter should be targeted, specific, and sincere. Generic cover letters are immediately recognizable and are generally ignored. Research the company before writing. Address why you want this particular role at this particular company — not just the generic benefits of working in the field.

**Structure:**
1. Opening: mention the specific role and why you are genuinely interested
2. Middle: two to three focused paragraphs on what you bring to this specific role
3. Closing: what you are looking for and your next steps

**Tone:** Professional but human. Avoid corporate buzzwords. Write as you would speak to an experienced professional you respect.

**Length:** One page maximum. If your cover letter runs beyond one page, cut it.

**Common mistake:** Writing about what the company can do for your career rather than what you can contribute to them.`,
  },
  {
    id: 'interview', icon: MessageSquare, title: 'Interview preparation',
    summary: 'Swedish interviews are conversational. Competency questions are common.',
    content: `Swedish job interviews tend to be relatively relaxed in tone compared to some other cultures, but they are thorough. Expect competency-based questions: "Tell me about a time when you..."

**Before the interview:**
- Research the company's products, mission, and recent news
- Prepare examples from your experience for common competency areas: problem-solving, teamwork, dealing with challenges, initiative
- Prepare genuine questions to ask the interviewer — not asking questions is seen as a lack of interest

**On the day:**
- Arrive on time — not early, not late. Swedish professional culture values punctuality
- Dress professionally unless you have clear signals that the company is very casual
- Be direct and honest — if you don't know something, say so

**Common questions:**
- Why do you want to work here?
- Tell me about a challenging project you worked on
- How do you handle disagreement in a team?
- Where do you see yourself in three years?

**After the interview:**
A brief follow-up email the same day is appreciated but not mandatory. One follow-up call after two to three weeks is acceptable if you have not heard back.`,
  },
  {
    id: 'market', icon: Globe, title: 'Understanding the Swedish job market',
    summary: 'Flat hierarchies, strong labour rights, and a culture of direct communication.',
    content: `The Swedish job market has several characteristics that are useful to understand before starting your search.

**Key features:**
- Strong union presence: many industries have collective bargaining agreements that set minimum wages and conditions
- Flat organizational structures: employees are expected to contribute ideas regardless of level
- Work-life balance is taken seriously: long working hours are not a sign of commitment in most sectors
- Annual holiday: Swedish employees are entitled to 25 days minimum
- Annual salary review: most employers conduct a formal salary review once a year

**Application timelines:**
The hiring process can be slow — three to six weeks between application and first contact is not unusual. Be patient.

**Networking:**
Informal professional relationships matter. LinkedIn is widely used. Industry events and student association contacts can be valuable channels.

**Language:**
Many technology, engineering, and international companies operate in English. Customer-facing roles typically require Swedish. Check job listings carefully.

**Employment types:**
- Tillsvidareanställning: permanent employment (most common goal)
- Tidsbegränsad anställning: fixed-term contract
- Provanställning: probationary employment (usually six months before becoming permanent)`,
  },
  {
    id: 'networking', icon: Users, title: 'Networking in Norrköping',
    summary: 'Build local connections through events, LinkedIn, and campus activities.',
    content: `Building professional connections in Norrköping is easier than in a larger city — the community is smaller and more connected.

**Campus events:**
Career fairs, company presentations, and alumni panels are your first opportunity. Attend even when you are not actively job-searching. The relationships you build in year one can matter in year three.

**LinkedIn:**
Create a professional LinkedIn profile and connect with professionals you meet at events. A personal message referencing where you met goes a long way.

**Informationsintervju (information interview):**
Reaching out to professionals for a 30-minute informational conversation about their career path is accepted practice in Sweden. Send a polite message via LinkedIn explaining that you are a student and would value their perspective. Many professionals respond positively.

**Company events:**
Many local companies host open days, workshops, and hackathons. Attend these and treat them as professional environments even if they feel informal.

**Student association network:**
Your programme association may already have company contacts established. Ask your association's career coordinator.`,
  },
  {
    id: 'thesis', icon: GraduationCap, title: 'Finding a thesis project',
    summary: 'How to identify and approach companies for thesis collaboration.',
    content: `Finding a good thesis project with a company can significantly shape your career. Norrköping has several companies active in thesis supervision.

**Where to look:**
- This platform lists thesis project postings from local companies
- Your university's thesis coordinator often maintains a list of approved partner companies
- Directly approaching a company you are interested in is common and often effective

**Approaching companies directly:**
Write a clear, specific email to the relevant contact (usually HR or a team leader in your subject area). Explain your background, the approximate thesis scope you have in mind, and why you want to work with them specifically. Attach a one-page academic profile.

**What companies look for:**
- A motivated student who understands the business problem
- Alignment between the student's research interest and the company's operational challenge
- Reliability and ability to work with some autonomy

**The supervisor arrangement:**
A typical thesis project has two supervisors — one academic (from your university) and one industrial (from the company). The academic supervisor takes responsibility for academic quality; the industrial supervisor provides access and practical guidance.

**Timing:**
Many thesis positions are filled six to twelve months before the start date. Start your search early.`,
  },
  {
    id: 'international', icon: BookOpen, title: 'Job search for international students',
    summary: 'Specific guidance for non-Swedish students entering the job market.',
    content: `As an international student, you may face some additional considerations when job searching in Sweden.

**Work permit:**
If you are a non-EU student, your student visa generally allows you to work in Sweden. After graduation, you can apply for a one-year job-seeker permit. Check the Migration Agency (Migrationsverket) for current rules and conditions — these can change.

**Language:**
Even for English-language positions, some conversational Swedish is often valued. Demonstrate that you are learning, even if not yet fluent.

**Equivalence of qualifications:**
If your degree is from outside the EU/EEA, you may need to have it assessed by the Swedish Council for Higher Education (UHR). This is more relevant for regulated professions but can be helpful in general as a credential verification.

**Cultural adaptation:**
Swedish professional culture values modesty (jantelagen) — avoid presenting yourself as exceptional without evidence. Instead, let your accomplishments speak directly and concisely.

**Support resources:**
Your university's international office typically maintains guidance on work rights and transition support. EURES (the European Job Mobility Portal) can also provide guidance.

Note: Immigration law is complex and changes frequently. Always consult official sources (migrationsverket.se) for current requirements.`,
  },
];

export function JobInformationPage() {
  const [openSection, setOpenSection] = useState<string | null>('cv');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)' }}>
      <StudentNav />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 900 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-blue)', marginBottom: 12 }}>CAREER RESOURCES</div>
          <h1 className="text-page-heading" style={{ marginBottom: 14 }}>Job search guide for students in Norrköping.</h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: 580, lineHeight: 1.65 }}>
            Practical guidance on CVs, interviews, the Swedish job market, and finding opportunities as a student — including specific advice for international students.
          </p>
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(185,128,45,0.08)', border: '1px solid rgba(185,128,45,0.2)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-warning)', fontWeight: 500 }}>General guidance only — not official legal, immigration, or employment advice.</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sections.map(section => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} style={{
                background: 'var(--surface-elevated)',
                border: `1px solid ${isOpen ? 'rgba(79,121,232,0.2)' : 'var(--border-neutral)'}`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: isOpen ? 'var(--shadow-2)' : 'var(--shadow-1)',
                transition: 'all var(--transition-base)',
              }}>
                <button onClick={() => setOpenSection(isOpen ? null : section.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                  padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'var(--font-stack)',
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: isOpen ? 'rgba(79,121,232,0.12)' : 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background var(--transition-fast)' }}>
                    <section.icon size={18} color={isOpen ? 'var(--color-accent-blue)' : 'var(--color-text-muted)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.98rem', color: isOpen ? 'var(--color-accent-blue)' : 'var(--color-text-primary)', transition: 'color var(--transition-fast)' }}>{section.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{section.summary}</div>
                  </div>
                  {isOpen ? <ChevronUp size={18} color="var(--color-text-muted)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border-divider)' }}>
                    <div style={{ paddingTop: 20 }}>
                      {section.content.split('\n\n').map((para, i) => {
                        if (para.startsWith('**') && para.endsWith('**')) {
                          return <h4 key={i} style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '16px 0 8px' }}>{para.replace(/\*\*/g, '')}</h4>;
                        }
                        if (para.includes('**')) {
                          const parts = para.split(/(\*\*[^*]+\*\*)/g);
                          return <p key={i} style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>{parts.map((p, j) => p.startsWith('**') ? <strong key={j}>{p.replace(/\*\*/g, '')}</strong> : p)}</p>;
                        }
                        if (para.startsWith('- ')) {
                          const items = para.split('\n').filter(l => l.startsWith('- '));
                          return <ul key={i} style={{ paddingLeft: 18, marginBottom: 10 }}>{items.map((item, j) => <li key={j} style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>{item.slice(2)}</li>)}</ul>;
                        }
                        if (para.match(/^\d+\./)) {
                          const items = para.split('\n').filter(l => l.match(/^\d+\./));
                          return <ol key={i} style={{ paddingLeft: 18, marginBottom: 10 }}>{items.map((item, j) => <li key={j} style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 4 }}>{item.replace(/^\d+\.\s/, '')}</li>)}</ol>;
                        }
                        return <p key={i} style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>{para}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 40, padding: '28px', background: 'linear-gradient(135deg, rgba(79,121,232,0.08) 0%, rgba(60,158,150,0.06) 100%)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(79,121,232,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-text-primary)', marginBottom: 6 }}>Ready to find your next opportunity?</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>Browse jobs, internships, and thesis projects in Norrköping.</p>
          </div>
          <Link to="/student/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-blue)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            Browse jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
