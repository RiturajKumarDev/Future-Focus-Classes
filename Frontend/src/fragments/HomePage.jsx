import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './homePage.css';
import { getCoursesToServer } from '../services/courseService';
import { getTechersToServer } from '../services/teacherService';
import { getStudentResultsToServer } from '../services/resultService';
import {
    FaGraduationCap, FaChalkboardTeacher, FaBookOpen, FaTrophy,
    FaUsers, FaStar, FaQuoteLeft, FaPhoneAlt, FaEnvelope,
    FaMapMarkerAlt, FaClock, FaLaptopCode, FaRegLightbulb, FaHeadset,
    FaArrowRight, FaInstagram, FaTwitter, FaLinkedin, FaFacebook,
    FaBars, FaTimes, FaCheckCircle, FaPlay, FaFireAlt, FaMedal
} from 'react-icons/fa';

const HomePage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [counterValues, setCounterValues] = useState({ students: 0, courses: 0, teachers: 0, placements: 0 });

    const stats = { students: 15000, courses: 120, teachers: 45, placements: 2500 };

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || "null");
        if (user) {
            if (user.userType === 'student') navigate("/student-dashboard");
            else if (user.userType === 'teacher') navigate("/teacher-dashboard");
        }
    }, [navigate]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const counters = setInterval(() => {
            setCounterValues(prev => {
                const newValues = {};
                let allComplete = true;
                for (let key in stats) {
                    if (prev[key] < stats[key]) {
                        newValues[key] = Math.min(prev[key] + Math.ceil(stats[key] / 60), stats[key]);
                        allComplete = false;
                    } else {
                        newValues[key] = stats[key];
                    }
                }
                if (allComplete) clearInterval(counters);
                return { ...prev, ...newValues };
            });
        }, 25);
        return () => clearInterval(counters);
    }, []);

    const [courses, setCourseData] = useState([
        { _id: 1, title: 'Mathematics Advanced', category: 'Academic', instructor: 'Prof. Sunil Kumar', totalDuration: '48 hours', totalLectures: 48, students: 1250, rating: 4.8, price: '9,999', level: 'Advanced', thumbnailUrl: '', shortDescription: 'Master advanced mathematics — calculus, algebra, and trigonometry for JEE & Board exams.' },
        { _id: 2, title: 'Physics for JEE', category: 'Competitive', instructor: 'Dr. Arvind Sharma', totalDuration: '60 hours', totalLectures: 60, students: 980, rating: 4.9, price: '11,999', level: 'Advanced', thumbnailUrl: '', shortDescription: 'Conceptual physics mastery with problem-solving strategies for JEE Main & Advanced.' },
        { _id: 3, title: 'Biology (NEET)', category: 'Medical', instructor: 'Dr. Priya Singh', totalDuration: '52 hours', totalLectures: 52, students: 870, rating: 4.7, price: '10,499', level: 'Intermediate', thumbnailUrl: '', shortDescription: 'Comprehensive NEET biology preparation with NCERT-focused notes and mock tests.' },
    ]);

    useEffect(() => {
        getCoursesToServer().then(r => { if (r.ok) r.json().then(d => setCourseData(d)); }).catch(() => { });
    }, []);

    const [teachers, setTeachersData] = useState([
        { _id: 1, fullName: "Prof. Sunil Kumar", teachingSubjects: ["Mathematics"], experience: "15+ yrs", students: "5,000+", rating: 4.9, image: "", qualification: "Ph.D. Mathematics", bio: "Expert in making complex math concepts simple and engaging for all competitive exams." },
        { _id: 2, fullName: "Dr. Arvind Sharma", teachingSubjects: ["Physics"], experience: "12+ yrs", students: "3,800+", rating: 4.8, image: "", qualification: "M.Tech, IIT Delhi", bio: "Former IIT faculty with a passion for conceptual learning and exam strategy." },
    ]);

    useEffect(() => {
        getTechersToServer().then(r => { if (r.ok) r.json().then(d => setTeachersData(d)).catch(() => { }); }).catch(() => { });
    }, []);

    const [studentResults, setStudentResults] = useState([
        { _id: 1, name: "Rahul Sharma", achievement: "JEE Advanced AIR 245", course: "JEE Main & Advanced", before: "85%", after: "98.5%", testimonial: "Future Focus transformed my approach to mathematics. The faculty's guidance was truly instrumental in cracking JEE.", year: "2024" },
        { _id: 2, name: "Priya Patel", achievement: "NEET AIR 189", course: "NEET Preparation", before: "82%", after: "97%", testimonial: "The structured curriculum and regular mock tests helped me crack NEET with an excellent rank. Life-changing experience!", year: "2024" },
        { _id: 3, name: "Arjun Mehta", achievement: "Board Topper 98.4%", course: "Class 12 Science", before: "79%", after: "98.4%", testimonial: "The dedicated mentorship and doubt-clearing sessions made all the difference in my Board exam preparation.", year: "2024" },
    ]);

    useEffect(() => {
        getStudentResultsToServer().then(r => { if (r.ok) r.json().then(d => { if (d && d.length > 0) setStudentResults(d); }).catch(() => { }); }).catch(() => { });
    }, []);

    const [testimonials, setTestimonials] = useState([
        { _id: 1, name: "Rahul Sharma", role: "JEE Advanced AIR 245", testimonial: "The teaching methodology at Future Focus is exceptional. The faculty's dedication and the comprehensive study material helped me achieve my dream rank.", rating: 5 },
        { _id: 2, name: "Priya Patel", role: "NEET AIR 189", testimonial: "Future Focus Classes gave me the confidence and tools to crack NEET. The biology sessions were particularly outstanding.", rating: 5 },
    ]);

    useEffect(() => {
        getStudentResultsToServer().then(r => { if (r.ok) r.json().then(d => { if (d && d.length > 0) setTestimonials(d); }).catch(() => { }); }).catch(() => { });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const features = [
        { icon: <FaChalkboardTeacher />, title: "Expert Faculty", description: "Learn from industry experts and IIT/AIIMS-qualified educators with decades of teaching experience." },
        { icon: <FaLaptopCode />, title: "Flexible Learning", description: "Choose between online and offline classes with recorded sessions available 24/7 for revision." },
        { icon: <FaBookOpen />, title: "Premium Content", description: "Comprehensive study material, HD video lectures, and 10,000+ practice questions." },
        { icon: <FaRegLightbulb />, title: "Smart Assessments", description: "Weekly tests, AI-driven performance tracking, and personalised improvement plans." },
        { icon: <FaHeadset />, title: "Doubt Resolution", description: "24/7 doubt clearing support through live sessions and dedicated Telegram groups." },
        { icon: <FaTrophy />, title: "Proven Results", description: "95% success rate — thousands of students have cracked JEE, NEET, and Board exams." },
    ];

    return (
        <div className="homepage">

            {/* ===== NAVBAR ===== */}
            <header className={`navbar ${scrolled || isMobileMenuOpen ? 'navbar-scrolled' : ''}`}>
                <div className="container nav-container">
                    <div className="nav-logo" onClick={() => navigate('/')}>
                        <img className="logo-image" src="/future focus classes logo.png" alt="Future Focus Logo" />
                        <div className="logo-text">FUTURE FOCUS</div>
                    </div>
                    <button className="mobile-menu-toggle" type="button" onClick={() => setIsMobileMenuOpen(p => !p)}>
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
                        <nav className="nav-links">
                            {['/', '/courses', '/about', '/contact'].map((path, i) => (
                                <a key={path} onClick={() => { setIsMobileMenuOpen(false); navigate(path); }}>
                                    {['Home', 'Courses', 'About', 'Contact'][i]}
                                </a>
                            ))}
                        </nav>
                        <div className="nav-buttons">
                            <button type="button" className="btn-nav-login" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>Login</button>
                            <button type="button" className="btn-primary btn-nav-register" onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}>Register Free</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <section className="hero-section">
                <div className="hero-bg-glow"></div>
                <div className="hero-dots-overlay"></div>
                <div className="hero-container-full">
                    <div className="hero-content">
                        {/* Badge */}
                        <div className="hero-badge">
                            <FaFireAlt className="badge-icon" />
                            <span>India's #1 Coaching Institute — 2024</span>
                        </div>
                        {/* Sanskrit */}
                        <div className="sanskrit-text">तमसो मा ज्योतिर्गमय</div>
                        {/* Headline */}
                        <h1>
                            Shape Your <span className="gold-text">Future</span><br />
                            With Expert Guidance
                        </h1>
                        <p className="hero-description">
                            India's premier institute for academic excellence & competitive exam preparation.
                            Join <strong>15,000+</strong> students who achieved their dream ranks with us.
                        </p>
                        {/* Trust badges */}
                        <div className="hero-trust">
                            <span><FaCheckCircle className="check-icon" /> JEE • NEET • Boards</span>
                            <span><FaCheckCircle className="check-icon" /> Online & Offline</span>
                            <span><FaCheckCircle className="check-icon" /> Free Demo Available</span>
                        </div>
                        {/* Buttons */}
                        <div className="hero-buttons">
                            <button type="button" className="btn-primary" onClick={() => navigate('/courses')}>
                                Explore Courses <FaArrowRight />
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/register')}>
                                <FaPlay className="play-icon" /> Free Demo Class
                            </button>
                        </div>
                        {/* Mini stats */}
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="stat-number">15k+</span>
                                <span className="stat-label">Students</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="stat-number">95%</span>
                                <span className="stat-label">Success Rate</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="stat-number">120+</span>
                                <span className="stat-label">Courses</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Scroll indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-dot"></div>
                </div>
            </section>

            {/* ===== BANNER IMAGE STRIP ===== */}
            <div className="banner-strip">
                <img
                    src="/img/future_focus_banner.png"
                    alt="Future Focus Classes"
                    className="banner-strip-img"
                    onError={e => e.target.style.display = 'none'}
                />
            </div>

            {/* ===== STATS COUNTER ===== */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {[
                            { icon: <FaUsers />, value: `${counterValues.students.toLocaleString()}+`, label: "Students Enrolled" },
                            { icon: <FaBookOpen />, value: `${counterValues.courses}+`, label: "Expert Courses" },
                            { icon: <FaChalkboardTeacher />, value: `${counterValues.teachers}+`, label: "Expert Teachers" },
                            { icon: <FaTrophy />, value: `${counterValues.placements.toLocaleString()}+`, label: "Success Stories" },
                        ].map((s, i) => (
                            <div key={i} className="stat-item">
                                <div className="stat-icon">{s.icon}</div>
                                <div className="stat-number">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Why Choose Us</div>
                        <h2>Everything You Need to <span className="gold-text">Succeed</span></h2>
                        <p>A complete learning ecosystem designed to help you crack every exam</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon-wrapper">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COURSES ===== */}
            <section className="courses-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Our Courses</div>
                        <h2>Popular <span className="gold-text">Courses</span></h2>
                        <p>Expert-designed programs for JEE, NEET, Boards & more</p>
                    </div>
                    <div className="courses-grid">
                        {courses.map(course => (
                            <div key={course._id} className="course-card">
                                <div className="course-card-header">
                                    {course.thumbnailUrl
                                        ? <img className="course-thumbnail" src={course.thumbnailUrl} alt={course.title} />
                                        : <div className="course-icon-placeholder"><FaBookOpen /></div>
                                    }
                                    <div className="course-category-badge">{course.category}</div>
                                    {course.level && <div className="course-level-badge">{course.level}</div>}
                                </div>
                                <div className="course-card-body">
                                    <h3>{course.title}</h3>
                                    <div className="course-instructor"><FaChalkboardTeacher /> {course.instructor}</div>
                                    <p className="course-description">{course.shortDescription}</p>
                                    <div className="course-meta">
                                        <div className="meta-item"><FaClock /> {course.totalDuration}</div>
                                        <div className="meta-item"><FaUsers /> {course.students}+</div>
                                        <div className="meta-item"><FaStar className="star-icon" /> {course.rating}</div>
                                    </div>
                                    <div className="course-footer">
                                        <div className="course-price">₹{course.price}</div>
                                        <button className="btn-view-course" onClick={() => navigate(`/course/${course._id}`)}>
                                            Enroll Now <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="section-cta">
                        <button className="btn-outline-gold" onClick={() => navigate('/courses')}>
                            View All Courses <FaArrowRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== SUCCESS STORIES ===== */}
            <section className="results-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Student Results</div>
                        <h2>Real Results, Real <span className="gold-text">Success</span></h2>
                        <p>Our students consistently achieve top ranks across all competitive exams</p>
                    </div>
                    <div className="results-grid">
                        {studentResults.map(result => (
                            <div key={result._id} className="result-card">
                                <div className="result-medal"><FaMedal /></div>
                                <div className="result-header">
                                    <div className="result-avatar">
                                        <FaGraduationCap />
                                    </div>
                                    <div className="result-info">
                                        <h3>{result.name}</h3>
                                        <div className="result-achievement">{result.achievement}</div>
                                        {result.year && <div className="result-year">{result.year}</div>}
                                    </div>
                                </div>
                                <div className="result-course-tag">📚 {result.course}</div>
                                <div className="result-progress-container">
                                    <div className="progress-labels">
                                        <span className="label-before">Before: {result.before}</span>
                                        <span className="label-after">After: {result.after}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-fill" style={{ width: '95%' }}></div>
                                    </div>
                                </div>
                                <div className="result-quote">
                                    <FaQuoteLeft className="quote-icon" />
                                    <p>{result.testimonial}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FACULTY ===== */}
            <section className="teachers-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Our Faculty</div>
                        <h2>Learn from the <span className="gold-text">Best</span></h2>
                        <p>Experienced educators who are passionate about your success</p>
                    </div>
                    <div className="teachers-grid">
                        {teachers.map(teacher => (
                            <div key={teacher._id} className="teacher-card">
                                <div className="teacher-image">
                                    {teacher.image
                                        ? <img src={teacher.image} alt={teacher.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <FaChalkboardTeacher className="teacher-avatar" color="var(--accent-primary)" />
                                    }
                                </div>
                                <div className="teacher-info">
                                    <h3>{teacher.fullName}</h3>
                                    <div className="teacher-subject">{teacher.teachingSubjects?.join(', ')}</div>
                                    <div className="teacher-qualification">{teacher.qualification}</div>
                                    <div className="teacher-stats">
                                        <div className="teacher-stat"><FaBookOpen /><span>{teacher.experience}</span></div>
                                        <div className="teacher-stat"><FaUsers /><span>{teacher.students}</span></div>
                                        <div className="teacher-stat"><FaStar style={{ color: '#fbbf24' }} /><span>{teacher.rating}</span></div>
                                    </div>
                                    <p className="teacher-bio">{teacher.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Testimonials</div>
                        <h2>What Our Students <span className="gold-text">Say</span></h2>
                        <p>Thousands of lives transformed — here are a few stories</p>
                    </div>
                    <div className="testimonials-slider">
                        {testimonials.length > 0 && (
                            <div className="testimonial-card">
                                <div className="testimonial-rating">
                                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                                </div>
                                <p className="testimonial-text">"{testimonials[activeTestimonial].testimonial}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar"><FaGraduationCap /></div>
                                    <div>
                                        <div className="testimonial-name">{testimonials[activeTestimonial].name}</div>
                                        <div className="testimonial-role">{testimonials[activeTestimonial].achievement || testimonials[activeTestimonial].role}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="testimonial-dots">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`dot ${activeTestimonial === index ? 'active' : ''}`}
                                    onClick={() => setActiveTestimonial(index)}
                                    aria-label={`Testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-container">
                        <div className="cta-glow"></div>
                        <div className="cta-content">
                            <div className="section-badge" style={{ display: 'inline-block', marginBottom: '20px' }}>Limited Seats</div>
                            <h2>Ready to Start Your <span className="gold-text">Success Journey?</span></h2>
                            <p>Join thousands of students who have transformed their lives with Future Focus Classes</p>
                            <div className="cta-buttons">
                                <button type="button" className="cta-primary" onClick={() => navigate('/register')}>
                                    Enroll Now <FaArrowRight />
                                </button>
                                <button type="button" className="cta-secondary" onClick={() => navigate('/contact')}>
                                    Talk to an Advisor
                                </button>
                            </div>
                            <div className="cta-trust">
                                <span>✓ No Registration Fee</span>
                                <span>✓ Free Demo Class</span>
                                <span>✓ Expert Counselling</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-about">
                            <div className="footer-logo">
                                <img className="logo-image" src="/future focus classes logo.png" alt="Future Focus Logo" />
                                <div className="logo-text">FUTURE FOCUS</div>
                            </div>
                            <p>Empowering students to achieve their dreams through quality education and expert guidance since 2015.</p>
                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="Facebook"><FaFacebook /></a>
                                <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
                                <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
                                <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedin /></a>
                            </div>
                        </div>
                        <div className="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a onClick={() => navigate('/')}>Home</a></li>
                                <li><a onClick={() => navigate('/courses')}>Courses</a></li>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="#">Study Material</a></li>
                                <li><a href="#">Success Stories</a></li>
                                <li><a href="#">FAQs</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="footer-contact">
                            <h4>Contact Us</h4>
                            <div className="contact-item"><FaMapMarkerAlt /> 123, Education Hub, New Delhi, India</div>
                            <div className="contact-item"><FaPhoneAlt /> +91 98765 43210</div>
                            <div className="contact-item"><FaEnvelope /> info@futurefocusclasses.com</div>
                            <div className="contact-item"><FaClock /> Mon–Sat: 9 AM – 8 PM</div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2024 Future Focus Classes. All rights reserved.</p>
                        <p className="sanskrit-footer" style={{ fontFamily: 'Times New Roman, serif', color: 'var(--accent-primary)' }}>तमसो मा ज्योतिर्गमय</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;