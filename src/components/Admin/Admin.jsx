import React, { useState } from 'react';
import Topbar from '../Sidebar/Topbar';
import { adminService } from '../../services/adminService';
import { BarChart, Users, BookOpen, Folder, Video, ClipboardList, Trophy, UserCheck } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [regRole, setRegRole] = useState('student');

  const handleSubmit = async (e, action, message) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {};
    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }
    try {
      // In a real scenario we'd pass formData here
      await action(payload);
      alert(`Success: ${message}`);
    } catch (error) {
      alert(`Failed: ${error.message}`);
    }
  };

  return (
    <div>
      <Topbar title="Admin Panel" subtitle="Comprehensive management for students, resources, tests, and more." />
      <div className="page-container admin-container animate-fadeIn">

        {/* Admin Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><BarChart size={18} /> Dashboard</button>
          <button className={`admin-tab ${activeTab === 'registrations' ? 'active' : ''}`} onClick={() => setActiveTab('registrations')}><Users size={18} /> Registrations</button>
          <button className={`admin-tab ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}><BookOpen size={18} /> Courses</button>
          <button className={`admin-tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}><Folder size={18} /> Resources</button>
          <button className={`admin-tab ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}><Video size={18} /> Videos</button>
          <button className={`admin-tab ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}><ClipboardList size={18} /> Tests</button>
          <button className={`admin-tab ${activeTab === 'toppers' ? 'active' : ''}`} onClick={() => setActiveTab('toppers')}><Trophy size={18} /> Toppers</button>
        </div>

        {/* Tab Content */}
        <div className="admin-content card">

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div className="admin-section animate-fadeIn">
              <h2 className="admin-section-title">LMS Overview</h2>
              <div className="admin-stats-grid">
                <div className="admin-stat-card"><span className="admin-stat-icon"><Users size={28} /></span><div className="admin-stat-info"><h3>245</h3><p>Total Students</p></div></div>
                <div className="admin-stat-card"><span className="admin-stat-icon"><UserCheck size={28} /></span><div className="admin-stat-info"><h3>12</h3><p>Total Teachers</p></div></div>
                <div className="admin-stat-card"><span className="admin-stat-icon"><BookOpen size={28} /></span><div className="admin-stat-info"><h3>8</h3><p>Active Courses</p></div></div>
                <div className="admin-stat-card"><span className="admin-stat-icon"><Folder size={28} /></span><div className="admin-stat-info"><h3>87</h3><p>Resources Uploaded</p></div></div>
                <div className="admin-stat-card"><span className="admin-stat-icon"><Video size={28} /></span><div className="admin-stat-info"><h3>42</h3><p>Video Lectures</p></div></div>
                <div className="admin-stat-card"><span className="admin-stat-icon"><ClipboardList size={28} /></span><div className="admin-stat-info"><h3>15</h3><p>Active Tests</p></div></div>
              </div>
            </div>
          )}

          {/* ── REGISTRATIONS ── */}
          {activeTab === 'registrations' && (
            <div className="admin-section animate-fadeIn">
              <h2 className="admin-section-title">User Registration & Management</h2>
              <div className="admin-split-layout">
                {/* Form Side */}
                <div className="admin-side-form">
                  <h3>Register New User</h3>
                  <form className="admin-form" onSubmit={(e) => handleSubmit(e, adminService.registerUser, 'User Registered!')}>
                    <div className="admin-form-group">
                      <label>Role</label>
                      <select className="select" name='role' required value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Full Name</label>
                      <input type="text" className="input" name='fullName' placeholder="e.g., John Doe" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Email Address</label>
                      <input type="email" className="input" name='email' placeholder="john@example.com" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Phone Number</label>
                      <input type="tel" className="input" name='phone' placeholder="+91 98765 43210" required />
                    </div>

                    {regRole === 'student' && (
                      <div className="admin-form-group">
                        <label>Assign Course / Batch</label>
                        <select className="select" name='batch' required>
                          <option value="">Select Batch...</option>
                          <option value="class10">Class 10th (CBSE)</option>
                          <option value="class12">Class 12th (Science)</option>
                        </select>
                      </div>
                    )}

                    {regRole === 'teacher' && (
                      <>
                        <div className="admin-form-group">
                          <label>Subject(s) Taught</label>
                          <input type="text" className="input" name='subject' placeholder="e.g., Physics, Chemistry" required />
                        </div>
                        <div className="admin-form-group">
                          <label>Experience (Years)</label>
                          <input type="text" className="input" name='experience' placeholder="e.g., 10 Years Experience" required />
                        </div>
                        <div className="admin-form-group">
                          <label>Qualifications (Comma separated)</label>
                          <input type="text" className="input" name='quals' placeholder="e.g., B.Tech, M.Sc" required />
                        </div>
                        <div className="admin-form-group">
                          <label>Bio</label>
                          <textarea className="input" name='bio' placeholder="Teacher's bio..." rows="2" required></textarea>
                        </div>
                      </>
                    )}
                    <div className="admin-form-group">
                      <label>Join Date</label>
                      <input type="date" className="input" name='joinDate' required />
                    </div>
                    <div className="admin-form-group">
                      <label>Temporary Password</label>
                      <input type="password" className="input" name='password' required />
                    </div>
                    <button type="submit" className="btn btn-primary admin-submit-btn">Register User</button>
                  </form>
                </div>
                {/* Manage Side */}
                <div className="admin-side-list">
                  <h3>Manage Users</h3>
                  <div className="admin-search-bar" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input type="text" className="input" placeholder="Search users..." style={{ flex: 1 }} />
                    <button className="btn btn-secondary">🔍</button>
                  </div>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Name</th><th>Role</th><th>Batch/Class</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Rituraj Kumar</td><td>Admin</td><td>Class 10th (CBSE)</td><td><button className="btn btn-ghost btn-sm">Edit</button></td></tr>
                        <tr><td>Prof. Ravi Verma</td><td>Teacher</td><td>All</td><td><button className="btn btn-ghost btn-sm">Edit</button></td></tr>
                        <tr><td>Priya Sharma</td><td>Student</td><td>Class 12th (CBSE)</td><td><button className="btn btn-ghost btn-sm">Edit</button></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── COURSES ── */}
          {activeTab === 'courses' && (
            <div className="admin-section animate-fadeIn">
              <h2 className="admin-section-title">Course & Batch Management</h2>
              <div className="admin-split-layout">
                {/* Form */}
                <div className="admin-side-form">
                  <h3>Add New Course/Batch</h3>
                  <form className="admin-form" onSubmit={(e) => handleSubmit(e, adminService.addCourse, 'Course Added!')}>
                    <div className="admin-form-group">
                      <label>Course Name</label>
                      <input type="text" className="input" name="courseName" placeholder="e.g., Class 11th IIT-JEE Foundation" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Board / Standard</label>
                      <input type="text" className="input" name="board" placeholder="e.g., CBSE / ICSE" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Primary Subjects</label>
                      <input type="text" className="input" name="subjects" placeholder="e.g., Physics, Chem, Maths" required />
                    </div>
                    <button type="submit" className="btn btn-primary admin-submit-btn">Create Course</button>
                  </form>
                </div>
                {/* List */}
                <div className="admin-side-list">
                  <h3>Active Courses</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Course Name</th><th>Board</th><th>Students</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Class 10th</td><td>CBSE</td><td>45</td><td><button className="btn btn-ghost btn-sm">Edit</button></td></tr>
                        <tr><td>Class 12th (Sci)</td><td>UP Board</td><td>38</td><td><button className="btn btn-ghost btn-sm">Edit</button></td></tr>
                        <tr><td>NTSE Prep</td><td>All Boards</td><td>20</td><td><button className="btn btn-ghost btn-sm">Edit</button></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── RESOURCES ── */}
          {activeTab === 'resources' && (
            <div className="admin-section animate-fadeIn">
              <h2 className="admin-section-title">Study Materials & Notes</h2>
              <div className="admin-split-layout">
                <div className="admin-side-form">
                  <h3>Upload Resource</h3>
                  <form className="admin-form" onSubmit={(e) => handleSubmit(e, adminService.uploadResource, 'Resource Uploaded!')}>
                    <div className="admin-form-group">
                      <label>Resource Title</label>
                      <input type="text" className="input" name="title" placeholder="e.g., Chemistry Chapter 2 Notes" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Subject</label>
                      <select className="select" name="subject" required>
                        <option value="">Select Subject...</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Social Science">Social Science</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Resource Type</label>
                      <select className="select" name="type" required>
                        <option value="PDF">PDF Document</option>
                        <option value="DOCX">Word Document</option>
                        <option value="PPTX">PowerPoint</option>
                        <option value="ZIP">ZIP Archive</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Estimated Size (e.g., 2.5 MB)</label>
                      <input type="text" className="input" name="size" placeholder="Calculated automatically if left blank" />
                    </div>
                    <div className="admin-form-group">
                      <label>Upload Date</label>
                      <input type="date" className="input" name="date" required />
                    </div>
                    <div className="admin-form-group">
                      <label>File Upload</label>
                      <input type="file" className="input" name="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip" required />
                    </div>
                    <button type="submit" className="btn btn-primary admin-submit-btn">Upload File</button>
                  </form>
                </div>
                <div className="admin-side-list">
                  <h3>Manage Resources</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Title</th><th>Type</th><th>Subject</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Maths Chap 1 Formulas</td><td>PDF</td><td>Mathematics</td><td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-red)' }}>Delete</button></td></tr>
                        <tr><td>Science Exam Map</td><td>PDF</td><td>Science</td><td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-red)' }}>Delete</button></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── VIDEOS ── */}
          {activeTab === 'videos' && (
            <div className="admin-section animate-fadeIn">
              <h2 className="admin-section-title">Video Lectures</h2>
              <div className="admin-split-layout">
                <div className="admin-side-form">
                  <h3>Add Video Link</h3>
                  <form className="admin-form" onSubmit={(e) => handleSubmit(e, adminService.addVideo, 'Video Added!')}>
                    <div className="admin-form-group">
                      <label>Video Title</label>
                      <input type="text" className="input" name="title" placeholder="e.g., Intro to Algebra" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Subject</label>
                      <select className="select" name="subject" required>
                        <option value="">Select Subject...</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Social Science">Social Science</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Instructor Name</label>
                      <input type="text" className="input" name="instructor" placeholder="e.g., Prof. Ravi Verma" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Video Duration (e.g., 45:30)</label>
                      <input type="text" className="input" name="duration" placeholder="MM:SS" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Video Link (YouTube/Vimeo URL)</label>
                      <input type="url" className="input" name="url" placeholder="https://..." required />
                    </div>
                    <div className="admin-form-group">
                      <label>Upload Date</label>
                      <input type="date" className="input" name="date" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Thumbnail Image (Optional URL)</label>
                      <input type="url" className="input" name="thumbnail" placeholder="https://..." />
                    </div>
                    <button type="submit" className="btn btn-primary admin-submit-btn">Add Video</button>
                  </form>
                </div>
                <div className="admin-side-list">
                  <h3>Manage Videos</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Title</th><th>Subject</th><th>Instructor</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Euclid's Lemma</td><td>Mathematics</td><td>Prof. Ravi</td><td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-red)' }}>Delete</button></td></tr>
                        <tr><td>Carbon Compounds</td><td>Science</td><td>Prof. Pankaj</td><td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-red)' }}>Delete</button></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TESTS ── */}
          {activeTab === 'tests' && (
            <div className="admin-section animate-fadeIn">
              <h2 className="admin-section-title">Mock & Proctored Tests</h2>
              <div className="admin-split-layout">
                <div className="admin-side-form">
                  <h3>Create New Test</h3>
                  <form className="admin-form" onSubmit={(e) => handleSubmit(e, adminService.createTest, 'Test Created!')}>
                    <div className="admin-form-group">
                      <label>Test Title</label>
                      <input type="text" className="input" name="title" placeholder="e.g., Science Weekly Mock" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Subject</label>
                      <select className="select" name="subject" required>
                        <option value="">Select Subject...</option>
                        <option value="All Subjects">All Subjects</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Social Science">Social Science</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Test Type</label>
                      <select className="select" name="type" required>
                        <option value="Practice">Practice Test (Flexible)</option>
                        <option value="Proctored">Proctored Test (Scheduled)</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Total Questions</label>
                      <input type="number" className="input" name="totalQuestions" placeholder="e.g., 30" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Duration (Minutes)</label>
                      <input type="number" className="input" name="duration" placeholder="e.g., 45" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Due Date / Scheduled Date</label>
                      <input type="datetime-local" className="input" name="scheduledDate" required />
                    </div>
                    <button type="submit" className="btn btn-primary admin-submit-btn">Create Test</button>
                  </form>
                </div>
                <div className="admin-side-list">
                  <h3>Active Tests</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Title</th><th>Type</th><th>Qs</th><th>Time</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Algebra Mock 1</td><td>Practice</td><td>20</td><td>40m</td><td><button className="btn btn-ghost btn-sm">Edit</button></td></tr>
                        <tr><td>Mid-Term Aptitude</td><td>Proctored</td><td>60</td><td>90m</td><td><button className="btn btn-ghost btn-sm">Edit</button></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TOPPERS ── */}
          {activeTab === 'toppers' && (
            <div className="admin-section animate-fadeIn">
              <h2 className="admin-section-title">Hall of Fame (Toppers)</h2>
              <div className="admin-split-layout">
                <div className="admin-side-form">
                  <h3>Upload Topper Result</h3>
                  <form className="admin-form" onSubmit={(e) => handleSubmit(e, adminService.addTopper, 'Topper Published to Homepage!')}>
                    <div className="admin-form-group">
                      <label>Student Name</label>
                      <input type="text" className="input" name="studentName" placeholder="e.g., Priya Sharma" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Roll Number</label>
                      <input type="text" className="input" name="rollNumber" placeholder="e.g., FFC1009" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Batch / Class</label>
                      <input type="text" className="input" name="batch" placeholder="e.g., Class 10th (CBSE)" required />
                    </div>
                    <div className="admin-form-group">
                      <label>School Name</label>
                      <input type="text" className="input" name="schoolName" placeholder="e.g., ABES Public School" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Score / Percentage</label>
                      <input type="text" className="input" name="score" placeholder="e.g., 98.6% Marks" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Rank Icon (Emoji)</label>
                      <input type="text" className="input" name="icon" placeholder="e.g., 🥇" required />
                    </div>
                    <button type="submit" className="btn btn-primary admin-submit-btn">Publish Result</button>
                  </form>
                </div>
                <div className="admin-side-list">
                  <h3>Current Toppers</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Icon</th><th>Name</th><th>Roll Number</th><th>School</th><th>Score</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>🥇</td><td>Priya Sharma</td><td>FFC1001</td><td>ABES Public School</td><td>98.6%</td><td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-red)' }}>Remove</button></td></tr>
                        <tr><td>🥈</td><td>Arjun Mehta</td><td>FFC1002</td><td>DPS Ghaziabad</td><td>97.8%</td><td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-red)' }}>Remove</button></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;
