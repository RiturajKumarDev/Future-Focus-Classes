import React, { useState, useEffect } from 'react';
import './coursePage.css';
import { getCoursesToServer } from '../services/courseService';
import { useNavigate } from 'react-router-dom';

const CoursePage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // Course categories
    const categories = [
        { id: 'all', name: 'All Courses', icon: '📚' },
        { id: 'academic', name: 'Academic', icon: '📖' },
        { id: 'competitive', name: 'Competitive Exams', icon: '🏆' },
        { id: 'coding', name: 'Coding & Tech', icon: '💻' },
        { id: 'language', name: 'Languages', icon: '🗣️' },
        { id: 'skill', name: 'Skill Development', icon: '🎯' }
    ];

    // Courses data
    const [courses, setCourseData] = useState([
        // Academic Courses
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
                alert("Error", error);
                navigation("/");
            });
    }, []);

    // Filter courses based on category and search term
    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleEnroll = (course) => {
        if (!enrolledCourses.includes(course.id)) {
            setEnrolledCourses([...enrolledCourses, course._id]);
            alert(`Successfully enrolled in ${course.title}!`);
        } else {
            alert(`You are already enrolled in ${course.title}`);
        }
    };

    const handleViewDetails = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const getRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {'⭐'.repeat(fullStars)}
                {halfStar && '½'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    // Get unique instructors for stats
    const uniqueInstructors = [...new Set(courses.map(c => c.instructor))];
    const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);

    return (
        <div className="course-page">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <a href="/">⬅️</a>
                    <h1>Explore Our Courses</h1>
                    <p>Discover the perfect course to achieve your learning goals</p>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">{courses.length}+</span>
                            <span className="stat-label">Courses</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{uniqueInstructors.length}+</span>
                            <span className="stat-label">Expert Instructors</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">
                                {/* {Math.floor(totalStudents / 1000)} */}
                                12k+</span>
                            <span className="stat-label">Happy Students</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">4.8</span>
                            <span className="stat-label">Avg Rating</span>
                        </div>
                    </div>
                </div>
                <div className="hero-particles">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="filter-section">
                <div className="container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search courses by name or instructor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button>🔍 Search</button>
                    </div>

                    <div className="categories">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="courses-section">
                <div className="container">
                    <div className="section-header">
                        <h2>
                            {selectedCategory === 'all' ? 'All Courses' : categories.find(c => c.id === selectedCategory)?.name}
                        </h2>
                        <p>{filteredCourses.length} courses found</p>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <div className="no-results">
                            <span className="no-results-icon">🔍</span>
                            <h3>No courses found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {filteredCourses.map(course => (
                                <div key={course._id} className="course-card">
                                    <div className="course-card-header" style={{ background: course.color }}>
                                        <div className="course-icon">
                                            <img className="course-thumbnail" src={course.thumbnailUrl} alt="course_thumbnailUrl" />
                                        </div>
                                        <div className="course-level">{course.level}</div>
                                    </div>
                                    <div className="course-card-body">
                                        <h3>{course.title}</h3>
                                        <p className="instructor">👨‍🏫 {course.instructor}</p>
                                        <div className="course-meta">
                                            <span>⏱️ {course.totalDuration}</span>
                                            <span>📹 {course.totalLectures} lectures</span>
                                        </div>
                                        <div className="course-rating">
                                            <span className="stars">{getRatingStars(course.rating)}</span>
                                            <span className="rating-value">{course.rating}</span>
                                            <span className="students">({course.students} students)</span>
                                        </div>
                                        <div className="course-footer">
                                            <div className="price">₹{course.price}</div>
                                            <div className="course-actions">
                                                <button
                                                    className="btn-details"
                                                    onClick={() => handleViewDetails(course)}
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    className={`btn-enroll ${enrolledCourses.includes(course._id) ? 'enrolled' : ''}`}
                                                    onClick={() => handleEnroll(course)}
                                                    disabled={enrolledCourses.includes(course._id)}
                                                >
                                                    {enrolledCourses.includes(course.id) ? 'Enrolled ✓' : 'Enroll Now'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Course Details Modal */}
            {showModal && selectedCourse && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>×</button>

                        <div className="modal-header">
                            <div className="modal-icon">
                                <img className="modal-thumbnail" src={selectedCourse.thumbnailUrl} alt="thumbnailUrl" />
                            </div>
                            <h2>{selectedCourse.title}</h2>
                            <p>by {selectedCourse.instructor}</p>
                        </div>

                        <div className="modal-body">
                            <div className="modal-section">
                                <h3>About this Course</h3>
                                <p>{selectedCourse.shortDescription}</p>
                            </div>

                            <div className="modal-section">
                                <h3>Course Syllabus</h3>
                                <ul className="syllabus-list">
                                    {selectedCourse.learningObjectives.map((item, index) => (
                                        <li key={index}>✓ {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="modal-section">
                                <h3>Course Features</h3>
                                <div className="features-grid">
                                    {selectedCourse.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <span className="feature-check">✓</span>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Course Details</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Duration:</span>
                                        <span className="detail-value">{selectedCourse.totalDuration}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Total Lectures:</span>
                                        <span className="detail-value">{selectedCourse.totalLectures}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Level:</span>
                                        <span className="detail-value">{selectedCourse.level}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Rating:</span>
                                        <span className="detail-value">{getRatingStars(selectedCourse.rating)} {selectedCourse.rating}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Total Students:</span>
                                        <span className="detail-value">{selectedCourse.students}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Language:</span>
                                        <span className="detail-value">{selectedCourse.language}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="modal-price">₹{selectedCourse.price}</div>
                            <button
                                className={`modal-enroll-btn ${enrolledCourses.includes(selectedCourse._id) ? 'enrolled' : ''}`}
                                onClick={() => {
                                    handleEnroll(selectedCourse);
                                    setShowModal(false);
                                }}
                                disabled={enrolledCourses.includes(selectedCourse._id)}
                            >
                                {enrolledCourses.includes(selectedCourse._id) ? 'Already Enrolled ✓' : 'Enroll Now →'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Section */}
            <div className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Future Focus Classes?</h2>
                        <p>What makes our courses special</p>
                    </div>
                    <div className="features-grid-large">
                        <div className="feature-card">
                            <div className="feature-icon">🎓</div>
                            <h3>Expert Instructors</h3>
                            <p>Learn from industry experts and experienced educators</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Flexible Learning</h3>
                            <p>Online & Offline classes with recorded sessions</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💎</div>
                            <h3>Quality Content</h3>
                            <p>Comprehensive study material and resources</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Regular Assessments</h3>
                            <p>Weekly tests and performance tracking</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤝</div>
                            <h3>Doubt Clearing</h3>
                            <p>24/7 doubt resolution support</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h3>Certification</h3>
                            <p>Get certified upon course completion</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Learning Journey?</h2>
                        <p>Join thousands of students who are achieving their goals with Future Focus Classes</p>
                        <button className="cta-button">Get Started Now →</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
