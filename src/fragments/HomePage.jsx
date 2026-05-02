import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './homePage.css';
import { getCoursesToServer } from '../services/courseService';
import { getTechersToServer } from '../services/teacherService';
import { getStudentResultsToServer } from '../services/resultService';

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            if (user.userType == 'student')
                navigate("/student-dashboard");
            else if (user.userType == 'teacher')
                navigate("/teacher-dashboard");
        }
    }, []);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [counterValues, setCounterValues] = useState({
        students: 0,
        courses: 0,
        teachers: 0,
        placements: 0
    });

    // Statistics data
    const stats = {
        students: 15000,
        courses: 120,
        teachers: 45,
        placements: 2500
    };

    // Counter animation
    useEffect(() => {
        const counters = setInterval(() => {
            setCounterValues(prev => {
                const newValues = {};
                let allComplete = true;

                for (let key in stats) {
                    if (prev[key] < stats[key]) {
                        newValues[key] = Math.min(prev[key] + Math.ceil(stats[key] / 50), stats[key]);
                        allComplete = false;
                    } else {
                        newValues[key] = stats[key];
                    }
                }

                if (allComplete) clearInterval(counters);
                return { ...prev, ...newValues };
            });
        }, 30);

        return () => clearInterval(counters);
    }, []);

    // Courses data
    const [courses, setCourseData] = useState([
        {
            _id: 1,
            title: 'Mathematics Advanced',
            category: 'academic',
            instructor: 'Prof. Sunil Kumar',
            totalDuration: '48 hours',
            totalLectures: 48,
            students: 1250,
            rating: 4.8,
            price: '₹9,999',
            level: 'Advanced',
            thumbnailUrl: '📐',
            color: '#FF6B35',
            shortDescription: 'Master advanced mathematics concepts including calculus, algebra, and trigonometry. Perfect for Class 11-12 and competitive exam preparation.',
            learningObjectives: [
                'Quadratic Equations & Inequalities',
                'Sequence & Series',
                'Trigonometry',
                'Calculus - Limits & Derivatives',
                'Probability & Statistics'
            ],
            features: ['Live Classes', 'Recorded Sessions', 'Study Material', 'Doubt Clearing']
        },
    ]);

    useEffect(() => {
        getCoursesToServer()
            .then((response) => {
                if (response.ok) {
                    response.json().then((courses) => {
                        setCourseData(courses);
                    })
                } else
                    navigation("/");
            })
            .catch((error) => {
                navigation("/");
            });
    }, []);

    // Teachers data
    const [teachers, setTeachersData] = useState([
        {
            _id: 1,
            fullName: "Prof. Sunil Kumar",
            teachingSubjects: ["Mathematics"],
            experience: "15+ years",
            students: "5000+",
            rating: 4.9,
            image: "👨‍🏫",
            color: "#FF6B35",
            qualification: "Ph.D. Mathematics",
            bio: "Expert in making complex math concepts simple and engaging."
        },
    ]);

    useEffect(() => {
        getTechersToServer()
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((data) => {
                            setTeachersData(data);
                        }).catch((error) => {
                        })
                }
            }).catch((errors) => {
            });
    }, []);

    // Student results / success stories
    const [studentResults, setStudentResults] = useState([
        {
            _id: 1,
            name: "Rahul Sharma",
            achievement: "JEE Advanced AIR 245",
            course: "JEE Main & Advanced",
            before: "85%",
            after: "98.5%",
            image: "👨‍🎓",
            testimonial: "Future Focus Classes transformed my approach to mathematics. The faculty's guidance was instrumental in achieving my JEE rank.",
            year: "2024"
        },
        {
            _id: 2,
            name: "Priya Patel",
            achievement: "NEET AIR 189",
            course: "NEET Preparation",
            before: "82%",
            after: "97%",
            image: "👩‍🎓",
            testimonial: "The structured curriculum and regular mock tests helped me crack NEET with an excellent rank. Thank you Future Focus!",
            year: "2024"
        },
    ]);

    useEffect(() => {
        getStudentResultsToServer()
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((data) => {
                            setStudentResults(data);
                        }).catch((error) => {
                        })
                }
            }).catch((errors) => {
            });
    }, []);

    // Features data
    const features = [
        {
            icon: "🎓",
            title: "Expert Faculty",
            description: "Learn from industry experts and experienced educators with years of teaching experience."
        },
        {
            icon: "📱",
            title: "Flexible Learning",
            description: "Choose between online and offline classes with recorded sessions for revision."
        },
        {
            icon: "💎",
            title: "Quality Content",
            description: "Comprehensive study material, video lectures, and practice tests."
        },
        {
            icon: "🎯",
            title: "Regular Assessments",
            description: "Weekly tests, assignments, and performance tracking."
        },
        {
            icon: "🤝",
            title: "Doubt Clearing",
            description: "24/7 doubt resolution support through dedicated sessions."
        },
        {
            icon: "🏆",
            title: "Proven Results",
            description: "95% success rate with thousands of successful students."
        }
    ];

    const [testimonials, setTestimonials] = useState([
        {
            _id: 1,
            name: "Rahul Sharma",
            role: "JEE Advanced Rank 245",
            testimonial: "The teaching methodology at Future Focus is exceptional. The faculty's dedication and the comprehensive study material helped me achieve my dream rank.",
            rating: 5,
            image: "👨‍🎓"
        },
    ]);

    useEffect(() => {
        getStudentResultsToServer()
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((data) => {
                            setTestimonials(data);
                        }).catch((error) => {
                        })
                }
            }).catch((errors) => {
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <div className="sanskrit-text">तमसो मा ज्योतिर्गमय</div>
                            <h1>Future Focus Classes</h1>
                            <p className="hero-subtitle">Lead Me From Darkness To Light</p>
                            <p className="hero-description">
                                India's premier institute for academic excellence, competitive exam preparation,
                                and skill development. Join over 15,000+ successful students who achieved their dreams with us.
                            </p>
                            <div className="hero-buttons">
                                <button className="btn-primary" onClick={() => navigate('/courses')}>
                                    Explore Courses →
                                </button>
                                <button className="btn-secondary" onClick={() => navigate('/register')}>
                                    Start Free Trial
                                </button>
                            </div>
                            <div className="hero-stats">
                                <div className="hero-stat">
                                    <span className="stat-number">15k+</span>
                                    <span className="stat-label">Happy Students</span>
                                </div>
                                <div className="hero-stat">
                                    <span className="stat-number">120+</span>
                                    <span className="stat-label">Expert Courses</span>
                                </div>
                                <div className="hero-stat">
                                    <span className="stat-number">45+</span>
                                    <span className="stat-label">Expert Teachers</span>
                                </div>
                                <div className="hero-stat">
                                    <span className="stat-number">95%</span>
                                    <span className="stat-label">Success Rate</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image">
                            <div className="floating-cards">
                                <div className="float-card card-1">🏆 Top Results</div>
                                <div className="float-card card-2">⭐ 4.9 Rating</div>
                                <div className="float-card card-3">📚 Live Classes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Counter Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-icon">👨‍🎓</div>
                            <div className="stat-number">{counterValues.students.toLocaleString()}+</div>
                            <div className="stat-label">Students Enrolled</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">📚</div>
                            <div className="stat-number">{counterValues.courses}+</div>
                            <div className="stat-label">Expert Courses</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">👨‍🏫</div>
                            <div className="stat-number">{counterValues.teachers}+</div>
                            <div className="stat-label">Expert Teachers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-number">{counterValues.placements.toLocaleString()}+</div>
                            <div className="stat-label">Success Placements</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Institute Section */}
            <section className="about-section">
                <div className="container">
                    <div className="section-header">
                        <h2>About Future Focus Classes</h2>
                        <p>Excellence in Education Since 2015</p>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <h3>Your Gateway to Success</h3>
                            <p>
                                Future Focus Classes was founded with a vision to provide quality education that transforms lives.
                                With over 9 years of experience, we have become a trusted name in academic coaching and competitive
                                exam preparation across India.
                            </p>
                            <p>
                                Our unique teaching methodology combines traditional classroom learning with modern technology,
                                ensuring that every student receives personalized attention and achieves their full potential.
                            </p>
                            <div className="about-features">
                                <div className="about-feature">
                                    <span>✓</span>
                                    <span>Online & Offline Classes</span>
                                </div>
                                <div className="about-feature">
                                    <span>✓</span>
                                    <span>Recorded Lectures for Revision</span>
                                </div>
                                <div className="about-feature">
                                    <span>✓</span>
                                    <span>Doubt Clearing Sessions</span>
                                </div>
                                <div className="about-feature">
                                    <span>✓</span>
                                    <span>Regular Mock Tests</span>
                                </div>
                            </div>
                            <button className="btn-learn-more" onClick={() => navigate('/about')}>
                                Learn More About Us →
                            </button>
                        </div>
                        <div className="about-image">
                            <div className="about-stats-card">
                                <div className="stat-circle">
                                    <span className="circle-number">9+</span>
                                    <span className="circle-label">Years of Excellence</span>
                                </div>
                                <div className="stat-circle">
                                    <span className="circle-number">15k+</span>
                                    <span className="circle-label">Students Trained</span>
                                </div>
                                <div className="stat-circle">
                                    <span className="circle-number">45+</span>
                                    <span className="circle-label">Expert Faculty</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Us?</h2>
                        <p>What makes Future Focus Classes the best choice for your learning journey</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Courses Section */}
            <section className="courses-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Popular Courses</h2>
                        <p>Choose from 120+ expert-designed courses to achieve your goals</p>
                    </div>
                    <div className="courses-grid">
                        {courses.map(course => (
                            <div key={course._id} className="course-card">
                                <div className="course-card-header" style={{ background: course.color }}>
                                    <div className="course-icon">
                                        <img className="course-thumbnail" src={course.thumbnailUrl} alt="course_thumbnailUrl" />
                                    </div>
                                    <div className="course-category-badge">{course.category}</div>
                                </div>
                                <div className="course-card-body">
                                    <h3>{course.title}</h3>
                                    <p className="course-instructor">👨‍🏫 {course.instructor}</p>
                                    <p className="course-description">{course.shortDescription}</p>
                                    <div className="course-meta">
                                        <span>⏱️ {course.totalDuration}</span>
                                        <span>👥 {course.students}+</span>
                                        <span>⭐ {course.rating}</span>
                                    </div>
                                    <div className="course-footer">
                                        <div className="course-price">₹{course.price}</div>
                                        <button
                                            className="btn-view-course"
                                            onClick={() => navigate(`/course/${course._id}`)}
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="view-all-container">
                        <button className="btn-view-all" onClick={() => navigate('/courses')}>
                            View All Courses →
                        </button>
                    </div>
                </div>
            </section>

            {/* Student Results Section */}
            <section className="results-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Success Stories</h2>
                        <p>Inspiring results achieved by our students</p>
                    </div>
                    <div className="results-grid">
                        {studentResults.map(result => (
                            <div key={result._id} className="result-card">
                                <div className="result-icon">{result.image}</div>
                                <h3>{result.name}</h3>
                                <div className="result-achievement">{result.achievement}</div>
                                <div className="result-course">{result.course}</div>
                                <div className="result-progress">
                                    <div className="progress-label">
                                        <span>Before: {result.before}</span>
                                        <span>After: {result.after}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '95%' }}></div>
                                    </div>
                                </div>
                                <p className="result-testimonial">"{result.testimonial}"</p>
                                <div className="result-year">🎓 {result.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Teachers Section */}
            <section className="teachers-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Meet Our Expert Faculty</h2>
                        <p>Learn from the best educators in the industry</p>
                    </div>
                    <div className="teachers-grid">
                        {teachers.map(teacher => (
                            <div key={teacher._id} className="teacher-card">
                                <div className="teacher-image" style={{ background: teacher.color }}>
                                    <div className="teacher-avatar">{teacher.image}</div>
                                </div>
                                <h3>{teacher.fullName}</h3>
                                {(teacher.teachingSubjects).map((subject) => {
                                    <p className="teacher-subject">{subject}</p>
                                })}
                                <div className="teacher-stats">
                                    <span>📚 {teacher.experience}</span>
                                    <span>👥 {teacher.students}</span>
                                    <span>⭐ {teacher.rating}</span>
                                </div>
                                <p className="teacher-bio">{teacher.bio}</p>
                                <div className="teacher-qualification">{teacher.qualification}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2>What Our Students Say</h2>
                        <p>Real stories from real students</p>
                    </div>
                    <div className="testimonials-slider">
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <div className="testimonial-image">{testimonials[activeTestimonial].image}</div>
                                <div className="testimonial-text">
                                    <p>"{testimonials[activeTestimonial].testimonial}"</p>
                                    <div className="testimonial-rating">
                                        {'⭐'.repeat(5)}
                                    </div>
                                    <h4>{testimonials[activeTestimonial].name}</h4>
                                    <p className="testimonial-role">{testimonials[activeTestimonial].achievement}</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-dots">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${activeTestimonial === index ? 'active' : ''}`}
                                    onClick={() => setActiveTestimonial(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Success Journey?</h2>
                        <p>Join thousands of students who have transformed their lives with Future Focus Classes</p>
                        <div className="cta-buttons">
                            <button className="cta-primary" onClick={() => navigate('/register')}>
                                Enroll Now →
                            </button>
                            <button className="cta-secondary" onClick={() => navigate('/contact')}>
                                Talk to Advisor
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-about">
                            <div className="footer-logo">
                                <span className="logo-icon">FF</span>
                                <span className="logo-text">FUTURE FOCUS CLASSES</span>
                            </div>
                            <p>Empowering students to achieve their dreams through quality education and expert guidance since 2015.</p>
                            <div className="social-links">
                                <a href="#">📘</a>
                                <a href="#">📸</a>
                                <a href="#">🐦</a>
                                <a href="#">💼</a>
                            </div>
                        </div>
                        <div className="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/courses">Courses</a></li>
                                <li><a href="/about">About Us</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Success Stories</a></li>
                                <li><a href="#">FAQs</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="footer-contact">
                            <h4>Contact Us</h4>
                            <p>📍 123, Education Hub, New Delhi, India</p>
                            <p>📞 +91 98765 43210</p>
                            <p>✉️ info@futurefocusclasses.com</p>
                            <p>⏰ Mon-Sat: 9 AM - 8 PM</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Future Focus Classes. All rights reserved.</p>
                        <p className="sanskrit-footer">तमसो मा ज्योतिर्गमय</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;