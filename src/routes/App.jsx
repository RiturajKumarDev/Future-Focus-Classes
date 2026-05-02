import { Routes, Route } from 'react-router-dom'
import './App.css'
import StudentDashboard from '../fragments/student/StudentDashboard'
import TeacherDashboard from '../fragments/teacher/TeacherDashboard'
import CreateCourse from '../fragments/teacher/CreateCourse'
import Login from '../fragments/auth/Login'
import Register from '../fragments/auth/Register'
import HomePage from '../fragments/HomePage'
import CoursePage from '../fragments/CoursePage'
import UploadStudentResult from '../fragments/teacher/UploadStudentResult'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CoursePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/student-dashboard" element={<StudentDashboard />} />

      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/create-course" element={<CreateCourse />} />
      <Route path="/UploadStudentResult" element={<UploadStudentResult />} />
    </Routes>
  )
}

export default App;
