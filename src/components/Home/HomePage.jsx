import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, TrendingUp, Trophy, Star, BookOpen, Target, FlaskConical, Video, BarChart, Handshake, Smartphone, PenTool, PartyPopper, MapPin, Phone, Mail, Clock, Map, Rocket } from 'lucide-react';
import { studentService } from '../../services/studentService';
import './HomePage.css';

/* ── School-Focused Static Data ─────────────────────────────────── */
const teachers = [
  {
    _id: 1,
    fullName: 'Prof. Anil Sharma',
    subject: 'English Grammar & Literature (Classes 5-12)',
    experience: '12 Years Experience',
    avatar: 'AS',
    color: '#f5a623',
    quals: ['M.A. English Literature – BHU', 'B.Ed & CTET Qualified', 'Ex-DAV School Faculty'],
    bio: 'Specializes in making English grammar easy and developing reading skills for young students.',
  },
  {
    _id: 2,
    fullName: 'Prof. Ravi Verma',
    subject: 'Mathematics (Classes 8-12 / NTSE)',
    experience: '10 Years Experience',
    avatar: 'RV',
    color: '#3b82f6',
    quals: ['M.Sc Mathematics – IIT Kanpur', 'NTSE & Olympiad Coach', 'Ex-FIITJEE Faculty'],
    bio: 'Expert in simplifying complex algebraic equations, geometry proofs, and calculation shortcuts.',
  },
  {
    _id: 3,
    fullName: 'Prof. Pankaj Singh',
    subject: 'Physics & Chemistry (Classes 9-12)',
    experience: '8 Years Experience',
    avatar: 'PS',
    color: '#22c55e',
    quals: ['B.Tech – NIT Allahabad', 'School Board Specialist', 'Ex-Akash Faculty'],
    bio: 'Focuses on visual conceptual learning of Science experiments and mechanics.',
  },
  {
    _id: 4,
    fullName: 'Prof. Neha Gupta',
    subject: 'Biology & Social Sciences (Classes 5-10)',
    experience: '6 Years Experience',
    avatar: 'NG',
    color: '#8b5cf6',
    quals: ['M.Sc Biotechnology', 'B.Ed & TET Qualified', 'Ex-DPS Teacher'],
    bio: 'Creates engaging diagrams, stories, and memory maps to learn social studies and biology.',
  },
];

const topResults = [
  { _id: 1, studentName: 'Priya Sharma', rollNumber: 'FFC1001', batch: 'Class 10th (CBSE)', schoolName: 'ABES Public School', score: '98.6% Marks', icon: '🥇' },
  { _id: 2, studentName: 'Arjun Mehta', rollNumber: 'FFC1002', batch: 'Class 12th (CBSE)', schoolName: 'DPS Ghaziabad', score: '97.8% Marks', icon: '🥈' },
  { _id: 3, studentName: 'Sneha Yadav', rollNumber: 'FFC1003', batch: 'Class 10th (ICSE)', schoolName: 'St. Mary\'s School', score: '97.2% Marks', icon: '🥉' },
  { _id: 4, studentName: 'Rahul Gupta', rollNumber: 'FFC1004', batch: 'Class 8th (Olympiad)', schoolName: 'Science Olympiad', score: 'State Rank 4', icon: '🏅' },
  { _id: 5, studentName: 'Anjali Singh', rollNumber: 'FFC1005', batch: 'Class 12th (UP Board)', schoolName: 'Model Inter College', score: '95.4% Marks', icon: '🏅' },
  { _id: 6, studentName: 'Vivek Kumar', rollNumber: 'FFC1006', batch: 'Class 9th (NTSE)', schoolName: 'NTSE Stage 1', score: 'Qualified', icon: '🏅' },
  { _id: 7, studentName: 'Pooja Agarwal', rollNumber: 'FFC1007', batch: 'Class 10th (CBSE)', schoolName: 'Bal Bharti School', score: '96.2% Marks', icon: '🏅' },
  { _id: 8, studentName: 'Saurabh Tiwari', rollNumber: 'FFC1008', batch: 'Class 12th (CBSE)', schoolName: 'Khaitan Public School', score: '95.8% Marks', icon: '🏅' },
];

const stats = [
  { value: '1000+', label: 'Happy Students', icon: <Users size={28} /> },
  { value: '95%+', label: 'Board Exam Score', icon: <TrendingUp size={28} /> },
  { value: '50+', label: 'Olympiad Rankers', icon: <Trophy size={28} /> },
  { value: '8+', label: 'Years of Excellence', icon: <Star size={28} /> },
];

const features = [
  { icon: <BookOpen size={24} />, title: 'CBSE / ICSE Syllabus', desc: 'Strictly aligned with NCERT & board exam guidelines for Class 5 to 12.' },
  { icon: <Target size={24} />, title: 'Concept-First Approach', desc: 'Building strong foundations in Mathematics and Science from early stages.' },
  { icon: <FlaskConical size={24} />, title: 'Chapter Tests & Quizzes', desc: 'Regular class tests, revision sheets, and board pattern mock exams.' },
  { icon: <Video size={24} />, title: 'LMS Portal & App', desc: 'Students can watch recorded revision classes and download worksheets.' },
  { icon: <BarChart size={24} />, title: 'Progress Report Card', desc: 'Monthly updates to parents regarding attendance, tests, and homework.' },
  { icon: <Handshake size={24} />, title: 'Doubt Clearing Sessions', desc: 'Dedicated one-on-one time after class hours for solving difficult doubts.' },
];

/* ── Component ─────────────────────────────────────── */
const HomePage = () => {
  const { goToLogin } = useApp();
  const [tick, setTick] = useState(0);
  const [toppers, setToppers] = useState(topResults); // Fallback to static initial
  const [faculty, setFaculty] = useState(teachers); // Fallback to static initial

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => (t + 1) % 4), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const topData = await studentService.getTopResults();
      if (topData && topData.length > 0) {
        setToppers(topData);
      }

      const facultyData = await studentService.getTeachers();
      if (facultyData && facultyData.length > 0) {
        setFaculty(facultyData);
      }
    };
    loadData();
  }, []);

  return (
    <div className="hp-root">

      {/* ══ NAVBAR ══════════════════════════════════════ */}
      <nav className="hp-nav">
        <div className="hp-nav-brand">
          <img src="/logo.png" alt="FFC Logo" className="hp-nav-logo" />
          <div>
            <span className="hp-nav-name">Future Focus Classes</span>
            <span className="hp-nav-sub">तमसो माँ ज्योतिर्गमय</span>
          </div>
        </div>
        <div className="hp-nav-links">
          <a href="#about" className="hp-nav-link">About</a>
          <a href="#faculty" className="hp-nav-link">Teachers</a>
          <a href="#results" className="hp-nav-link">Toppers</a>
          <a href="#contact" className="hp-nav-link">Contact</a>
          <button id="home-login-btn" className="hp-btn-primary" onClick={goToLogin}>
            🚀 Student Portal Login
          </button>
        </div>
        <button className="hp-nav-hamburger" onClick={goToLogin} title="Login">
          🚀 Portal
        </button>
      </nav>

      {/* ══ HERO ════════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero-glow hp-hero-glow-1" />
        <div className="hp-hero-glow hp-hero-glow-2" />
        <div className="hp-hero-content animate-fadeIn">
          <div className="hp-hero-badge">🎒 School (5th-12th) & Competitive Exams</div>
          <h1 className="hp-hero-title">
            Strengthen Your Foundations<br />
            <span className="hp-text-gradient">For Boards & Competitive Exams</span>
          </h1>
          <p className="hp-hero-desc">
            Future Focus Classes offers premium, concept-driven offline and online coaching
            for school students (Classes 5-12) as well as preparation for all competitive exams like IIT, ITI, Diploma, BPSC, SSC, Railway, and more.
          </p>
          <div className="hp-hero-actions">
            <button id="hero-login-btn" className="hp-btn-primary hp-btn-lg" onClick={goToLogin}>
              🚀 Access Student Portal
            </button>
            <a href="#about" className="hp-btn-outline hp-btn-lg">
              Explore Courses ↓
            </a>
          </div>
          <div className="hp-exam-tags">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><BookOpen size={16} /> CBSE & State Boards &nbsp;·&nbsp;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Trophy size={16} /> IIT, ITI & Diploma &nbsp;·&nbsp;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Trophy size={16} /> BPSC & SSC &nbsp;·&nbsp;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Trophy size={16} /> Railway & Others</span>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═══════════════════════════════════ */}
      <section className="hp-stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="hp-stat-item">
            <span className="hp-stat-icon">{s.icon}</span>
            <span className="hp-stat-value">{s.value}</span>
            <span className="hp-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ══ ABOUT ═══════════════════════════════════════ */}
      <section id="about" className="hp-section">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-section-pill">About FFC</span>
            <h2 className="hp-section-title">Class 5th to 12th Coaching</h2>
            <p className="hp-section-sub">Empowering young minds with logical reasoning, deep concepts and board success</p>
          </div>

          <div className="hp-about-grid">
            <div className="hp-about-text">
              <p>
                At <strong>Future Focus Classes</strong>, we believe that education in classes 5 to 12 forms
                the critical base for any child\'s future engineering, medical, or management dreams.
                Our coaching methods avoid plain memorization and focus on "Why" and "How" concepts.
              </p>
              <p>
                We cover the entire school syllabus of <strong>Mathematics, Physics, Chemistry, Biology,
                  English Grammar, and Social Studies</strong>. We prepare students for school unit tests,
                term exams, and board examinations with top preparation materials.
              </p>
              <p>
                We also prepare students for all major competitive exams like <strong>IIT, ITI, Diploma, BPSC, SSC, Railway, NTSE, and Olympiads</strong>, providing them with the best guidance to succeed.
              </p>
              <div className="hp-about-highlights">
                <div className="hp-hl-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><BookOpen size={18} /> Interactive Science & Maths Prep</div>
                <div className="hp-hl-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><PenTool size={18} /> Regular Weekly Homework & Tests</div>
                <div className="hp-hl-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Smartphone size={18} /> Complete LMS Portal Access</div>
                <div className="hp-hl-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={18} /> Regular Parent-Teacher Meets</div>
              </div>
            </div>
            <div className="hp-about-features">
              {features.map((f, i) => (
                <div key={i} className="hp-feature-card">
                  <span className="hp-feature-icon">{f.icon}</span>
                  <div>
                    <p className="hp-feature-title">{f.title}</p>
                    <p className="hp-feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FACULTY ═════════════════════════════════════ */}
      <section id="faculty" className="hp-section hp-section-alt">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-section-pill">Our Mentors</span>
            <h2 className="hp-section-title">Meet Our Teachers</h2>
            <p className="hp-section-sub">Experienced mentors dedicated to building high academic performance & clarity</p>
          </div>
          <div className="hp-faculty-grid">
            {faculty.map((t, index) => {
              const facultyColors = ['#f5a623', '#3b82f6', '#22c55e', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];
              const themeColor = t.color || facultyColors[index % facultyColors.length];
              return (
              <div key={t._id || index} className="hp-teacher-card">
                <div className="hp-teacher-top">
                  <div className="hp-teacher-avatar" style={{ background: `${themeColor}22`, border: `2px solid ${themeColor}55` }}>
                    <span style={{ color: themeColor }}>{t.avatar}</span>
                  </div>
                  <div>
                    <p className="hp-teacher-name">{t.fullName}</p>
                    <p className="hp-teacher-subject" style={{ color: themeColor }}>{t.subject}</p>
                    <span className="hp-teacher-exp">{t.experience}</span>
                  </div>
                </div>
                <p className="hp-teacher-bio">{t.bio}</p>
                <div className="hp-teacher-quals">
                  {t.quals.map((q, i) => (
                    <span key={i} className="hp-qual-badge">✓ {q}</span>
                  ))}
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ RESULTS ═════════════════════════════════════ */}
      <section id="results" className="hp-section">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-section-pill">Top Performers</span>
            <h2 className="hp-section-title">Our School Board Toppers</h2>
            <p className="hp-section-sub">Our students who excelled in school exams and board results</p>
          </div>

          <div className="hp-results-table-wrap">
            <table className="hp-results-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Class / Batch</th>
                  <th>School Name</th>
                  <th>Result Score</th>
                </tr>
              </thead>
              <tbody>
                {toppers.map((r, i) => (
                  <tr key={r._id || i} className={(r._id || i + 1) <= 3 ? 'hp-top-row' : ''}>
                    <td><span className="hp-rank-icon">{r.icon}</span></td>
                    <td className="hp-student-name">{r.studentName}</td>
                    <td className="hp-student-roll">{r.rollNumber || '-'}</td>
                    <td className="hp-student-batch">{r.batch}</td>
                    <td><span className="hp-company-badge" style={{ background: 'rgba(245, 166, 35, 0.08)', color: 'var(--accent-gold)', borderColor: 'rgba(245, 166, 35, 0.2)' }}>{r.schoolName}</span></td>
                    <td><span className="hp-package">{r.score}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="hp-results-cta">
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><PartyPopper size={20} /> Over 92% of our batch scored above 90% in CBSE 10th & 12th Board Examinations!</p>
            <button className="hp-btn-primary" onClick={goToLogin}>Begin Your Success Journey →</button>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═════════════════════════════════════ */}
      <section id="contact" className="hp-section hp-section-alt">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-section-pill">Find Us</span>
            <h2 className="hp-section-title">Contact & Address</h2>
            <p className="hp-section-sub">अभी जुड़ें और अपनी पढ़ाई को एक नई ऊंचाई पर ले जाएं!</p>
          </div>

          <div className="hp-contact-grid">
            {/* Info Cards */}
            <div className="hp-contact-info">
              <div className="hp-contact-card">
                <span className="hp-contact-icon"><MapPin size={24} /></span>
                <div>
                  <p className="hp-contact-label">Address</p>
                  <p className="hp-contact-value">
                    Rampur Road, Bazar Samiti,<br />
                    Main Gate, Patna - 06
                  </p>
                </div>
              </div>
              <div className="hp-contact-card">
                <span className="hp-contact-icon"><Phone size={24} /></span>
                <div>
                  <p className="hp-contact-label">Phone / WhatsApp</p>
                  <p className="hp-contact-value">+91 8603497015</p>
                </div>
              </div>
              <div className="hp-contact-card">
                <span className="hp-contact-icon"><Mail size={24} /></span>
                <div>
                  <p className="hp-contact-label">Email Address</p>
                  <p className="hp-contact-value">info@futurefocusclasses.com</p>
                </div>
              </div>
              <div className="hp-contact-card">
                <span className="hp-contact-icon"><Clock size={24} /></span>
                <div>
                  <p className="hp-contact-label">Class Schedule</p>
                  <p className="hp-contact-value">Regular Batches  : 4:00 PM – 7:30 PM (Mon-Fri)</p>
                  <p className="hp-contact-value">Weekend Batches  : 10:00 AM – 2:00 PM (Sat-Sun)</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="hp-map-card">
              <div className="hp-map-placeholder">
                <span className="hp-map-pin"><MapPin size={48} /></span>
                <p className="hp-map-text">Future Focus Classes</p>
                <p className="hp-map-addr">Rampur Road, Bazar Samiti, Patna</p>
                <a
                  href="https://maps.google.com/?q=Rampur+Road,+Bazar+Samiti,+Patna"
                  target="_blank"
                  rel="noreferrer"
                  className="hp-btn-primary"
                  style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Map size={18} /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════ */}
      <section className="hp-cta-banner">
        <div className="hp-cta-glow" />
        <h2 className="hp-cta-title">Register Your Child For Better Scores</h2>
        <p className="hp-cta-sub">Get access to daily practice worksheets, revision videos, and live reports.</p>
        <button id="cta-login-btn" className="hp-btn-white hp-btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }} onClick={goToLogin}>
          <Rocket size={20} /> Login to Student Portal
        </button>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════ */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-brand">
            <img src="/logo.png" alt="FFC" className="hp-footer-logo" />
            <div>
              <p className="hp-footer-name">Future Focus Classes</p>
              <p className="hp-footer-tagline">तमसो माँ ज्योतिर्गमय</p>
            </div>
          </div>
          <p className="hp-footer-copy">© 2026 Future Focus Classes, Patna. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
