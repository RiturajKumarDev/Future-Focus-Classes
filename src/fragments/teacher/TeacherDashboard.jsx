import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './teacherDashboard.css';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Teacher data
    const [teacherData, setTeacherData] = useState({
        fullName: 'Prof. Sunil Kumar',
        _id: 'FFT2024001',
        email: 'sunil.kumar@futurefocus.com',
        mobile: '+91 98765 43210',
        joinDate: 'January 2020',
        department: 'Mathematics',
        specialization: 'Advanced Mathematics & Calculus',
        totalCourses: 4,
        totalStudents: 1250,
        totalEarnings: '₹2,45,000',
        averageRating: 4.8,
        experience: '15+ years',
        bio: 'Experienced mathematics educator passionate about making complex concepts simple. Have helped thousands of students excel in mathematics and crack competitive exams.'
    });

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            setTeacherData(user);
            if (user.userType != 'teacher')
                navigate("/login");
        } else
            navigate("/login");
    }, []);

    const handleLogout = () => {
        Cookies.remove("userData");
        navigate("/login");
    }

    // Courses taught by teacher
    const [courses, setCourses] = useState([
        {
            id: 1,
            name: 'Mathematics Advanced',
            students: 245,
            rating: 4.9,
            progress: 75,
            revenue: '₹1,25,000',
            status: 'active',
            schedule: 'Mon, Wed, Fri - 4:00 PM',
            duration: '1.5 hours',
            enrolledStudents: [
                { id: 1, name: 'Rahul Sharma', attendance: 85, grade: 'A', email: 'rahul@example.com', phone: '9876543210' },
                { id: 2, name: 'Priya Patel', attendance: 92, grade: 'A+', email: 'priya@example.com', phone: '9876543211' },
                { id: 3, name: 'Amit Kumar', attendance: 78, grade: 'B+', email: 'amit@example.com', phone: '9876543212' }
            ],
            assignments: [
                { id: 1, title: 'Quadratic Equations', dueDate: '2024-12-20', submissions: 42, total: 50 },
                { id: 2, title: 'Trigonometry Basics', dueDate: '2024-12-25', submissions: 38, total: 50 }
            ]
        },
        {
            id: 2,
            name: 'Algebra Fundamentals',
            students: 180,
            rating: 4.7,
            progress: 60,
            revenue: '₹85,000',
            status: 'active',
            schedule: 'Tue, Thu - 5:00 PM',
            duration: '1 hour',
            enrolledStudents: [
                { id: 4, name: 'Neha Gupta', attendance: 90, grade: 'A', email: 'neha@example.com', phone: '9876543213' },
                { id: 5, name: 'Rajesh Singh', attendance: 75, grade: 'B', email: 'rajesh@example.com', phone: '9876543214' }
            ],
            assignments: [
                { id: 3, title: 'Linear Equations', dueDate: '2024-12-22', submissions: 28, total: 35 }
            ]
        },
        {
            id: 3,
            name: 'Calculus Mastery',
            students: 95,
            rating: 4.9,
            progress: 40,
            revenue: '₹35,000',
            status: 'active',
            schedule: 'Sat, Sun - 10:00 AM',
            duration: '2 hours',
            enrolledStudents: [
                { id: 6, name: 'Anjali Verma', attendance: 88, grade: 'A-', email: 'anjali@example.com', phone: '9876543215' }
            ],
            assignments: [
                { id: 4, title: 'Limits & Derivatives', dueDate: '2024-12-28', submissions: 15, total: 20 }
            ]
        }
    ]);

    // Upcoming classes
    const [upcomingClasses] = useState([
        { id: 1, course: 'Mathematics Advanced', topic: 'Quadratic Equations', time: 'Today, 4:00 PM', students: 45, link: 'https://meet.google.com/abc' },
        { id: 2, course: 'Algebra Fundamentals', topic: 'Linear Equations', time: 'Tomorrow, 5:00 PM', students: 38, link: 'https://meet.google.com/def' },
        { id: 3, course: 'Calculus Mastery', topic: 'Limits', time: 'Sat, 10:00 AM', students: 25, link: 'https://meet.google.com/ghi' }
    ]);

    // Recent activities
    const [activities] = useState([
        { id: 1, type: 'assignment', message: 'New assignment submitted in Mathematics Advanced', time: '2 hours ago', student: 'Rahul Sharma' },
        { id: 2, type: 'question', message: 'Doubt asked in Algebra class', time: '5 hours ago', student: 'Priya Patel' },
        { id: 3, type: 'feedback', message: 'New course rating received', time: '1 day ago', rating: 5 },
        { id: 4, type: 'attendance', message: '85% attendance this week', time: '2 days ago' }
    ]);

    // Notifications
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Class starting in 30 minutes', time: 'Today, 3:30 PM', read: false },
        { id: 2, message: 'New student enrolled in Calculus', time: 'Yesterday', read: false },
        { id: 3, message: 'Assignment deadline tomorrow', time: '2 days ago', read: true }
    ]);

    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const handleStartClass = (classItem) => {
        window.open(classItem.link, '_blank');
    };

    const handleGradeAssignment = (courseId, assignmentId) => {
        alert(`Opening grading panel for assignment ${assignmentId}`);
    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
    };

    const handleAddCourse = () => {
        setShowAddCourseModal(true);
        navigate("/create-course");
    };

    const handleCreateAssignment = () => {
        setShowAssignmentModal(true);
    };

    const getProgressColor = (progress) => {
        if (progress >= 75) return 'progress-high';
        if (progress >= 50) return 'progress-medium';
        return 'progress-low';
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'assignment': return '📝';
            case 'question': return '❓';
            case 'feedback': return '⭐';
            case 'attendance': return '📊';
            default: return '📌';
        }
    };

    return (
        <div className="teacher-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">FF</span>
                        <span className="logo-text">FUTURE FOCUS</span>
                    </div>
                    <div className="teacher-badge">Teacher Portal</div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        <span className="nav-icon">📚</span>
                        <span>My Courses</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        <span className="nav-icon">👥</span>
                        <span>Students</span>
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
                        className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('earnings')}
                    >
                        <span className="nav-icon">💰</span>
                        <span>Earnings</span>
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
                        <h2>{greeting}, {teacherData.fullName.split(' ')[0]}! 👨‍🏫</h2>
                        <p>Welcome to your teaching dashboard</p>
                    </div>

                    <div className="top-bar-actions">
                        <div className="notifications">
                            <button className="notification-btn">
                                🔔
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
                                )}
                            </button>
                        </div>
                        <div className="user-menu">
                            <h1>{teacherData.fullName.split(' ')[0]}</h1>
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
                                    <h3>{teacherData.totalCourses}</h3>
                                    <p>Total Courses</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <h3>{teacherData.totalStudents}</h3>
                                    <p>Total Students</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-info">
                                    <h3>{teacherData.averageRating}</h3>
                                    <p>Average Rating</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-info">
                                    <h3>{teacherData.totalEarnings}</h3>
                                    <p>Total Earnings</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <button className="action-btn" onClick={handleAddCourse}>
                                <span>➕</span> Create New Course
                            </button>
                            <button className="action-btn" onClick={handleCreateAssignment}>
                                <span>📝</span> Create Assignment
                            </button>
                            <button className="action-btn">
                                <span>📊</span> Generate Report
                            </button>
                        </div>

                        {/* Upcoming Classes & Recent Activity */}
                        <div className="two-columns">
                            <div className="upcoming-classes">
                                <div className="section-header">
                                    <h3>📅 Upcoming Classes</h3>
                                    <button className="view-all">View Schedule →</button>
                                </div>
                                {upcomingClasses.map(classItem => (
                                    <div key={classItem.id} className="class-card">
                                        <div className="class-info">
                                            <h4>{classItem.course}</h4>
                                            <p>{classItem.topic}</p>
                                            <div className="class-meta">
                                                <span>⏰ {classItem.time}</span>
                                                <span>👥 {classItem.students} students</span>
                                            </div>
                                        </div>
                                        <button
                                            className="start-class-btn"
                                            onClick={() => handleStartClass(classItem)}
                                        >
                                            Start Class →
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="recent-activity">
                                <div className="section-header">
                                    <h3>📋 Recent Activity</h3>
                                    <button className="view-all">View All →</button>
                                </div>
                                {activities.map(activity => (
                                    <div key={activity.id} className="activity-item">
                                        <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                                        <div className="activity-info">
                                            <p>{activity.message}</p>
                                            <small>{activity.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Progress Overview */}
                        <div className="courses-overview">
                            <div className="section-header">
                                <h3>Course Performance</h3>
                                <button className="view-all" onClick={() => setActiveTab('courses')}>Manage Courses →</button>
                            </div>
                            <div className="courses-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Course Name</th>
                                            <th>Students</th>
                                            <th>Rating</th>
                                            <th>Progress</th>
                                            <th>Revenue</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course.id}>
                                                <td><strong>{course.name}</strong></td>
                                                <td>{course.students}</td>
                                                <td>⭐ {course.rating}</td>
                                                <td>
                                                    <div className="table-progress">
                                                        <div className={`progress-bar ${getProgressColor(course.progress)}`} style={{ width: `${course.progress}%` }}></div>
                                                        <span>{course.progress}%</span>
                                                    </div>
                                                </td>
                                                <td>{course.revenue}</td>
                                                <td>
                                                    <button className="table-action-btn">View Details</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <div className="tab-content fade-in">
                        <div className="courses-header">
                            <h2>My Courses</h2>
                            <button className="create-course-btn" onClick={handleAddCourse}>
                                + Create New Course
                            </button>
                        </div>

                        <div className="courses-grid">
                            {courses.map(course => (
                                <div key={course.id} className="course-card">
                                    <div className="course-card-header">
                                        <h3>{course.name}</h3>
                                        <span className={`course-status ${course.status}`}>{course.status}</span>
                                    </div>
                                    <div className="course-card-body">
                                        <div className="course-stats">
                                            <div>
                                                <span className="stat-label">Students</span>
                                                <span className="stat-value">{course.students}</span>
                                            </div>
                                            <div>
                                                <span className="stat-label">Rating</span>
                                                <span className="stat-value">⭐ {course.rating}</span>
                                            </div>
                                            <div>
                                                <span className="stat-label">Revenue</span>
                                                <span className="stat-value">{course.revenue}</span>
                                            </div>
                                        </div>
                                        <div className="course-schedule">
                                            <span>📅 {course.schedule}</span>
                                            <span>⏱️ {course.duration}</span>
                                        </div>
                                        <div className="course-progress">
                                            <div className="progress-label">Course Progress</div>
                                            <div className="progress-bar-container">
                                                <div className={`progress-bar ${getProgressColor(course.progress)}`} style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="course-actions">
                                            <button className="manage-btn">Manage Course</button>
                                            <button className="analytics-btn">View Analytics</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className="tab-content fade-in">
                        <div className="students-header">
                            <h2>My Students</h2>
                            <div className="search-filter">
                                <input type="text" placeholder="Search students..." />
                                <select>
                                    <option>All Courses</option>
                                    {courses.map(course => <option key={course.id}>{course.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="students-table-container">
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Course</th>
                                        <th>Attendance</th>
                                        <th>Grade</th>
                                        <th>Performance</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.flatMap(course =>
                                        course.enrolledStudents.map(student => ({
                                            ...student,
                                            courseName: course.name
                                        }))
                                    ).map(student => (
                                        <tr key={student.id}>
                                            <td>
                                                <div className="student-info">
                                                    <div className="student-avatar">{student.name.charAt(0)}</div>
                                                    <div>
                                                        <strong>{student.name}</strong>
                                                        <small>{student.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{student.courseName}</td>
                                            <td>
                                                <div className="attendance-bar">
                                                    <div className="attendance-fill" style={{ width: `${student.attendance}%` }}></div>
                                                    <span>{student.attendance}%</span>
                                                </div>
                                            </td>
                                            <td><span className="grade-badge">{student.grade}</span></td>
                                            <td>
                                                <div className="performance-stars">
                                                    {'⭐'.repeat(Math.floor(student.grade === 'A+' ? 5 : student.grade === 'A' ? 4.5 : student.grade === 'A-' ? 4 : student.grade === 'B+' ? 3.5 : 3))}
                                                </div>
                                            </td>
                                            <td>
                                                <button className="view-student-btn" onClick={() => handleViewStudent(student)}>View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

                        <div className="schedule-calendar">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                <div key={day} className="schedule-day">
                                    <h3>{day}</h3>
                                    {upcomingClasses.filter((_, index) => index === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)).map(classItem => (
                                        <div key={classItem.id} className="schedule-event">
                                            <div className="event-time">{classItem.time.split(',')[1]}</div>
                                            <div className="event-details">
                                                <strong>{classItem.course}</strong>
                                                <small>{classItem.topic}</small>
                                                <div className="event-students">👥 {classItem.students} students</div>
                                            </div>
                                            <button className="event-action-btn">Start Class</button>
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
                            <button className="create-assignment-btn" onClick={handleCreateAssignment}>
                                + Create Assignment
                            </button>
                        </div>

                        <div className="assignments-list">
                            {courses.flatMap(course =>
                                course.assignments.map(assignment => ({
                                    ...assignment,
                                    courseName: course.name,
                                    courseId: course.id
                                }))
                            ).map(assignment => (
                                <div key={assignment.id} className="assignment-card">
                                    <div className="assignment-info">
                                        <h3>{assignment.title}</h3>
                                        <p>{assignment.courseName}</p>
                                        <small>Due: {assignment.dueDate}</small>
                                    </div>
                                    <div className="assignment-stats">
                                        <div className="submission-stats">
                                            <span>📝 {assignment.submissions}/{assignment.total} Submissions</span>
                                            <div className="submission-bar">
                                                <div className="submission-fill" style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <button
                                            className="grade-btn"
                                            onClick={() => handleGradeAssignment(assignment.courseId, assignment.id)}
                                        >
                                            Grade Submissions
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Earnings Tab */}
                {activeTab === 'earnings' && (
                    <div className="tab-content fade-in">
                        <div className="earnings-header">
                            <h2>Earnings Overview</h2>
                            <div className="time-filter">
                                <button className="filter-active">This Month</button>
                                <button>This Year</button>
                                <button>All Time</button>
                            </div>
                        </div>

                        <div className="earnings-summary">
                            <div className="earning-card total">
                                <div className="earning-icon">💰</div>
                                <div className="earning-info">
                                    <label>Total Earnings</label>
                                    <h3>{teacherData.totalEarnings}</h3>
                                </div>
                            </div>
                            <div className="earning-card monthly">
                                <div className="earning-icon">📈</div>
                                <div className="earning-info">
                                    <label>This Month</label>
                                    <h3>₹45,000</h3>
                                </div>
                            </div>
                            <div className="earning-card pending">
                                <div className="earning-icon">⏳</div>
                                <div className="earning-info">
                                    <label>Pending Payout</label>
                                    <h3>₹15,000</h3>
                                </div>
                            </div>
                        </div>

                        <div className="earnings-table-container">
                            <h3>Transaction History</h3>
                            <table className="earnings-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Course</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Dec 15, 2024</td>
                                        <td>Mathematics Advanced</td>
                                        <td>₹25,000</td>
                                        <td><span className="status-paid">Paid</span></td>
                                    </tr>
                                    <tr>
                                        <td>Dec 10, 2024</td>
                                        <td>Algebra Fundamentals</td>
                                        <td>₹15,000</td>
                                        <td><span className="status-paid">Paid</span></td>
                                    </tr>
                                    <tr>
                                        <td>Dec 5, 2024</td>
                                        <td>Calculus Mastery</td>
                                        <td>₹5,000</td>
                                        <td><span className="status-pending">Pending</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="tab-content fade-in">
                        <div className="profile-header">
                            <div className="profile-cover"></div>
                            <div className="profile-info">
                                <h2>{teacherData.fullName.split(' ').at(0)}</h2>
                                <h2>{teacherData.fullName}</h2>
                                <p className="teacher-title">{teacherData.specialization}</p>
                                <div className="profile-stats">
                                    <span>📧 {teacherData.email}</span>
                                    <span>📱 {teacherData.mobile}</span>
                                    <span>📅 Joined: {teacherData.joinDate}</span>
                                    <span>⭐ Rating: {teacherData.averageRating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-details">
                            <div className="detail-section">
                                <h3>Professional Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Department</label>
                                        <p>{teacherData.department}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Specialization</label>
                                        <p>{teacherData.specialization}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Experience</label>
                                        <p>{teacherData.experience}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Teacher ID</label>
                                        <p>{teacherData._id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Bio</h3>
                                <p>{teacherData.bio}</p>
                            </div>

                            <div className="detail-section">
                                <h3>Qualifications & Achievements</h3>
                                <ul className="qualifications-list">
                                    <li>✓ M.Sc. Mathematics - Delhi University</li>
                                    <li>✓ B.Ed - NCERT</li>
                                    <li>✓ Ph.D. (Mathematics Education) - IIT Delhi</li>
                                    <li>✓ Best Teacher Award 2023</li>
                                    <li>✓ Published 15+ Research Papers</li>
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h3>Edit Profile</h3>
                                <button className="edit-profile-btn">Edit Profile Information →</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Student Details Modal */}
            {selectedStudent && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="student-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedStudent(null)}>×</button>
                        <h2>Student Details</h2>
                        <div className="student-modal-content">
                            <div className="student-modal-header">
                                <div className="student-modal-avatar">{selectedStudent.name.charAt(0)}</div>
                                <div>
                                    <h3>{selectedStudent.name}</h3>
                                    <p>{selectedStudent.email}</p>
                                    <p>{selectedStudent.phone}</p>
                                </div>
                            </div>
                            <div className="student-modal-stats">
                                <div className="stat">
                                    <label>Course</label>
                                    <p>{selectedStudent.courseName}</p>
                                </div>
                                <div className="stat">
                                    <label>Attendance</label>
                                    <p>{selectedStudent.attendance}%</p>
                                </div>
                                <div className="stat">
                                    <label>Grade</label>
                                    <p>{selectedStudent.grade}</p>
                                </div>
                            </div>
                            <div className="student-modal-actions">
                                <button className="message-btn">Send Message</button>
                                <button className="track-btn">Track Progress</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
