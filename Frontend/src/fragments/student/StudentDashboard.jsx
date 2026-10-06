import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './studentDashboard.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [showNotification, setShowNotification] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Mock student data
    const [studentData, setStudentData] = useState({
        _id: 'FFS2024001',
        fullName: 'Rahul Sharma',
        classTh: 'Class 10',
        email: 'rahul.sharma@example.com',
        mobile: '+91 98765 43210',
        joinDate: 'January 2024',
        enrolledCourses: 3,
        completedCourses: 2,
        totalHours: 48,
        attendance: 92,
        rank: 15,
        totalStudents: 245
    });

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user != null) {
            setStudentData(user);
            if (user.userType != 'student')
                navigate("/login");
        } else {
            navigate("/login");
            return;
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove("userData");
        navigate("/login");
    }
    // Courses data
    const [courses] = useState([
        {
            id: 1,
            name: 'Mathematics Advanced',
            instructor: 'Prof. Sunil Kumar',
            progress: 75,
            nextClass: 'Today, 4:00 PM',
            duration: '1.5 hours',
            assignments: 3,
            completed: 2,
            image: '📐',
            color: '#FF6B35'
        },
        {
            id: 2,
            name: 'Science (Physics & Chemistry)',
            instructor: 'Dr. Priya Singh',
            progress: 60,
            nextClass: 'Tomorrow, 5:30 PM',
            duration: '2 hours',
            assignments: 4,
            completed: 2,
            image: '🔬',
            color: '#00B4D8'
        },
        {
            id: 3,
            name: 'English Communication',
            instructor: 'Ms. Anjali Verma',
            progress: 90,
            nextClass: 'Wed, 3:00 PM',
            duration: '1 hour',
            assignments: 2,
            completed: 2,
            image: '📚',
            color: '#6C63FF'
        },
        {
            id: 4,
            name: 'Coding Fundamentals',
            instructor: 'Mr. Amit Patel',
            progress: 40,
            nextClass: 'Thu, 6:00 PM',
            duration: '1.5 hours',
            assignments: 5,
            completed: 2,
            image: '💻',
            color: '#28A745'
        }
    ]);

    // Upcoming classes
    const [upcomingClasses] = useState([
        { id: 1, course: 'Mathematics Advanced', time: 'Today, 4:00 PM', duration: '1.5 hrs', topic: 'Quadratic Equations', meetingLink: 'https://meet.google.com/xyz' },
        { id: 2, course: 'Science', time: 'Tomorrow, 5:30 PM', duration: '2 hrs', topic: 'Chemical Reactions', meetingLink: 'https://meet.google.com/abc' },
        { id: 3, course: 'Coding Fundamentals', time: 'Thu, 6:00 PM', duration: '1.5 hrs', topic: 'JavaScript Arrays', meetingLink: 'https://meet.google.com/def' }
    ]);

    // Recent achievements
    const [achievements] = useState([
        { id: 1, title: 'Quiz Master', description: 'Scored 95% in Mathematics Quiz', date: '2 days ago', icon: '🏆' },
        { id: 2, title: 'Perfect Attendance', description: 'Attended all classes this week', date: '5 days ago', icon: '⭐' },
        { id: 3, title: 'Fast Learner', description: 'Completed Coding module early', date: '1 week ago', icon: '🚀' }
    ]);

    // Notifications
    const [notifications] = useState([
        { id: 1, message: 'New assignment posted in Mathematics', time: '2 hours ago', read: false },
        { id: 2, message: 'Your test results are available', time: '1 day ago', read: false },
        { id: 3, message: 'Reminder: Parent-Teacher meeting tomorrow', time: '2 days ago', read: true }
    ]);

    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const getProgressColor = (progress) => {
        if (progress >= 75) return 'progress-high';
        if (progress >= 50) return 'progress-medium';
        return 'progress-low';
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">FF</span>
                        <span className="logo-text">FUTURE FOCUS</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Overview</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        <span className="nav-icon">📚</span>
                        <span>My Courses</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        <span className="nav-icon">📅</span>
                        <span>Schedule</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assignments')}
                    >
                        <span className="nav-icon">📝</span>
                        <span>Assignments</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('achievements')}
                    >
                        <span className="nav-icon">🏅</span>
                        <span>Achievements</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="nav-icon">👤</span>
                        <span>Profile</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => { handleLogout() }}>
                        <span className="nav-icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Top Bar */}
                <header className="top-bar">
                    <div className="welcome-section">
                        <h2>{greeting}, {studentData.fullName.split(' ')[0]}! 👋</h2>
                        <p>Ready to continue your learning journey?</p>
                    </div>

                    <div className="top-bar-actions">
                        <div className="search-bar">
                            <input type="text" placeholder="Search courses, assignments..." />
                            <button>🔍</button>
                        </div>

                        <div className="notifications">
                            <button className="notification-btn" onClick={() => setShowNotification(!showNotification)}>
                                🔔
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
                                )}
                            </button>
                            {showNotification && (
                                <div className="notification-dropdown">
                                    <h4>Notifications</h4>
                                    {notifications.map(notif => (
                                        <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                            <p>{notif.message}</p>
                                            <small>{notif.time}</small>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="user-menu">
                            <h1>{studentData.fullName.split(" ").at(0)}</h1>
                        </div>
                    </div>
                </header>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="tab-content fade-in">
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📚</div>
                                <div className="stat-info">
                                    <h3>{studentData.enrolledCourses}</h3>
                                    <p>Enrolled Courses</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <div className="stat-info">
                                    <h3>{studentData.completedCourses}</h3>
                                    <p>Completed Courses</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏱️</div>
                                <div className="stat-info">
                                    <h3>{studentData.totalHours}</h3>
                                    <p>Learning Hours</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <h3>{studentData.attendance}%</h3>
                                    <p>Attendance</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Overview */}
                        <div className="progress-overview">
                            <div className="section-header">
                                <h3>Course Progress</h3>
                                <button className="view-all">View All →</button>
                            </div>
                            <div className="courses-progress">
                                {courses.map(course => (
                                    <div key={course.id} className="progress-item">
                                        <div className="progress-header">
                                            <span className="course-icon">{course.image}</span>
                                            <div className="course-info">
                                                <h4>{course.name}</h4>
                                                <p>{course.instructor}</p>
                                            </div>
                                            <span className="progress-percent">{course.progress}%</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div
                                                className={`progress-bar ${getProgressColor(course.progress)}`}
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Classes & Achievements */}
                        <div className="two-columns">
                            <div className="upcoming-classes">
                                <div className="section-header">
                                    <h3>📅 Upcoming Classes</h3>
                                    <button className="view-all">View Schedule →</button>
                                </div>
                                {upcomingClasses.map(classItem => (
                                    <div key={classItem.id} className="class-card">
                                        <div className="class-time">
                                            <span className="time-icon">⏰</span>
                                            <div>
                                                <p className="class-time-text">{classItem.time}</p>
                                                <small>{classItem.duration}</small>
                                            </div>
                                        </div>
                                        <div className="class-details">
                                            <h4>{classItem.course}</h4>
                                            <p>{classItem.topic}</p>
                                        </div>
                                        <button className="join-btn">Join Now →</button>
                                    </div>
                                ))}
                            </div>

                            <div className="recent-achievements">
                                <div className="section-header">
                                    <h3>🏆 Recent Achievements</h3>
                                    <button className="view-all">View All →</button>
                                </div>
                                {achievements.map(achievement => (
                                    <div key={achievement.id} className="achievement-card">
                                        <div className="achievement-icon">{achievement.icon}</div>
                                        <div className="achievement-info">
                                            <h4>{achievement.title}</h4>
                                            <p>{achievement.description}</p>
                                            <small>{achievement.date}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard Preview */}
                        <div className="leaderboard-preview">
                            <div className="section-header">
                                <h3>📊 Class Leaderboard</h3>
                                <button className="view-all">View Full Leaderboard →</button>
                            </div>
                            <div className="rank-info">
                                <div className="your-rank">
                                    <span className="rank-badge">#{studentData.rank}</span>
                                    <div>
                                        <p>Your Rank</p>
                                        <small>Out of {studentData.totalStudents} students</small>
                                    </div>
                                </div>
                                <div className="rank-progress">
                                    <div className="rank-bar" style={{ width: `${(studentData.rank / studentData.totalStudents) * 100}%` }}></div>
                                </div>
                                <div className="rank-message">
                                    {studentData.rank <= 10 ? "🎉 Excellent! You're in Top 10!" : studentData.rank <= 50 ? "👍 Great job! Keep improving!" : "💪 Keep working hard!"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <div className="tab-content fade-in">
                        <div className="courses-header">
                            <h2>My Courses</h2>
                            <div className="filter-buttons">
                                <button className="filter-btn active">All Courses</button>
                                <button className="filter-btn">In Progress</button>
                                <button className="filter-btn">Completed</button>
                            </div>
                        </div>

                        <div className="courses-grid">
                            {courses.map(course => (
                                <div key={course.id} className="course-card">
                                    <div className="course-card-header" style={{ background: course.color }}>
                                        <span className="course-card-icon">{course.image}</span>
                                        <span className="course-progress-badge">{course.progress}%</span>
                                    </div>
                                    <div className="course-card-body">
                                        <h3>{course.name}</h3>
                                        <p className="instructor">{course.instructor}</p>
                                        <div className="course-stats">
                                            <span>📝 {course.completed}/{course.assignments} Assignments</span>
                                            <span>⏱️ {course.duration}</span>
                                        </div>
                                        <div className="course-progress-bar">
                                            <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.color }}></div>
                                        </div>
                                        <button className="continue-btn">Continue Learning →</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                    <div className="tab-content fade-in">
                        <div className="schedule-header">
                            <h2>Weekly Schedule</h2>
                            <div className="week-navigation">
                                <button>← Previous</button>
                                <span>This Week</span>
                                <button>Next →</button>
                            </div>
                        </div>

                        <div className="schedule-grid">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                <div key={day} className="schedule-day">
                                    <h3>{day}</h3>
                                    {upcomingClasses.filter((_, index) => index === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)).map(classItem => (
                                        <div key={classItem.id} className="schedule-event">
                                            <div className="event-time">{classItem.time.split(',')[1]}</div>
                                            <div className="event-details">
                                                <strong>{classItem.course}</strong>
                                                <small>{classItem.topic}</small>
                                            </div>
                                        </div>
                                    ))}
                                    {!upcomingClasses.find((_, index) => index === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)) && (
                                        <div className="schedule-empty">No classes scheduled</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Assignments Tab */}
                {activeTab === 'assignments' && (
                    <div className="tab-content fade-in">
                        <div className="assignments-header">
                            <h2>Assignments</h2>
                            <div className="assignment-filters">
                                <select>
                                    <option>All Courses</option>
                                    {courses.map(course => <option key={course.id}>{course.name}</option>)}
                                </select>
                                <select>
                                    <option>All Status</option>
                                    <option>Pending</option>
                                    <option>Submitted</option>
                                    <option>Graded</option>
                                </select>
                            </div>
                        </div>

                        <div className="assignments-list">
                            {courses.flatMap(course =>
                                Array(course.assignments).fill(null).map((_, idx) => ({
                                    id: `${course.id}-${idx}`,
                                    title: `${course.name} Assignment ${idx + 1}`,
                                    course: course.name,
                                    dueDate: idx === 0 ? 'Tomorrow, 11:59 PM' : idx === 1 ? 'Dec 15, 2024' : 'Dec 20, 2024',
                                    status: idx === 0 ? 'pending' : idx === 1 ? 'submitted' : 'graded',
                                    grade: idx === 2 ? '85%' : null
                                }))
                            ).slice(0, 5).map(assignment => (
                                <div key={assignment.id} className="assignment-card">
                                    <div className="assignment-info">
                                        <h3>{assignment.title}</h3>
                                        <p>{assignment.course}</p>
                                        <small>Due: {assignment.dueDate}</small>
                                    </div>
                                    <div className="assignment-status">
                                        <span className={`status-badge ${assignment.status}`}>
                                            {assignment.status === 'pending' ? '⏳ Pending' : assignment.status === 'submitted' ? '✅ Submitted' : '🎯 Graded'}
                                        </span>
                                        {assignment.grade && <span className="assignment-grade">Grade: {assignment.grade}</span>}
                                        {assignment.status === 'pending' && (
                                            <button className="submit-btn">Submit Assignment →</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div className="tab-content fade-in">
                        <div className="achievements-header">
                            <h2>My Achievements</h2>
                            <p>Celebrating your learning milestones</p>
                        </div>

                        <div className="achievements-stats">
                            <div className="achievement-stat">
                                <span className="stat-number">12</span>
                                <span>Total Badges</span>
                            </div>
                            <div className="achievement-stat">
                                <span className="stat-number">5</span>
                                <span>Certificates</span>
                            </div>
                            <div className="achievement-stat">
                                <span className="stat-number">98%</span>
                                <span>Quiz Average</span>
                            </div>
                        </div>

                        <div className="badges-grid">
                            {achievements.map(achievement => (
                                <div key={achievement.id} className="badge-card">
                                    <div className="badge-icon">{achievement.icon}</div>
                                    <h4>{achievement.title}</h4>
                                    <p>{achievement.description}</p>
                                    <small>{achievement.date}</small>
                                </div>
                            ))}
                            <div className="badge-card locked">
                                <div className="badge-icon">🔒</div>
                                <h4>Coming Soon</h4>
                                <p>Complete 5 more assignments to unlock</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="tab-content fade-in">
                        <div className="profile-header">
                            <div className="profile-cover"></div>
                            <div className="profile-info">
                                <h1 >{studentData.fullName.split(" ").at(0)}</h1>
                                <h2>{studentData.fullName}</h2>
                                <p className="student-id">Student ID: {studentData._id}</p>
                                <div className="profile-stats">
                                    <span>📧 {studentData.email}</span>
                                    <span>📱 {studentData.mobile}</span>
                                    <span>📚 Grade: {studentData.classTh}</span>
                                    <span>📅 Joined: {studentData.joinDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-details">
                            <div className="detail-section">
                                <h3>Personal Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Full Name</label>
                                        <p>{studentData.fullName}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Email Address</label>
                                        <p>{studentData.email}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Phone Number</label>
                                        <p>{studentData.mobile}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Date of Birth</label>
                                        <p>15 March 2010</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Grade/Class</label>
                                        <p>{studentData.classTh}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Parent/Guardian</label>
                                        <p>Mr. Rajesh Sharma</p>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Academic Performance</h3>
                                <div className="performance-grid">
                                    <div className="performance-card">
                                        <h4>Overall Attendance</h4>
                                        <div className="performance-value">{studentData.attendance}%</div>
                                        <div className="performance-bar">
                                            <div className="performance-fill" style={{ width: `${studentData.attendance}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="performance-card">
                                        <h4>Average Score</h4>
                                        <div className="performance-value">85%</div>
                                        <div className="performance-bar">
                                            <div className="performance-fill" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <div className="performance-card">
                                        <h4>Assignments Completed</h4>
                                        <div className="performance-value">8/12</div>
                                        <div className="performance-bar">
                                            <div className="performance-fill" style={{ width: '67%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Edit Profile</h3>
                                <button className="edit-profile-btn">Edit Profile Information →</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
