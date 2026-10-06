import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import HomePage from "../pages/public/HomePage";
import CourseCatalogPage from "../pages/public/CourseCatalogPage";
import CourseDetailPage from "../pages/public/CourseDetailPage";
import CategoriesPage from "../pages/public/CategoriesPage";
import PricingPage from "../pages/public/PricingPage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import CertificateVerifyPage from "../pages/public/CertificateVerifyPage";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import MyCoursesPage from "../pages/student/MyCoursesPage";
import StudentCertificatesPage from "../pages/student/StudentCertificatesPage";
import WishlistPage from "../pages/student/WishlistPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import LearningPlayerPage from "../pages/student/LearningPlayerPage";
import QuizPlayerPage from "../pages/student/QuizPlayerPage";

// Instructor Pages
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import CourseBuilderPage from "../pages/instructor/CourseBuilderPage";
import InstructorStudentsPage from "../pages/instructor/InstructorStudentsPage";
import InstructorSubmissionsPage from "../pages/instructor/InstructorSubmissionsPage";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminCoursesPage from "../pages/admin/AdminCoursesPage";
import AdminAuditLogsPage from "../pages/admin/AdminAuditLogsPage";

function App() {
  return (
    <Routes>
      {/* Public Pages with Standard Header & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseCatalogPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/verify/:certificateId" element={<CertificateVerifyPage />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Portal Protected Routes */}
      <Route element={<DashboardLayout roleRequired="student" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<MyCoursesPage />} />
        <Route path="/student/certificates" element={<StudentCertificatesPage />} />
        <Route path="/student/wishlist" element={<WishlistPage />} />
        <Route path="/student/notifications" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
      </Route>

      {/* Immersive Dedicated Learning Player & Quiz Engine */}
      <Route path="/student/learning/:courseId/:lessonId" element={<LearningPlayerPage />} />
      <Route path="/student/quiz/:quizId" element={<QuizPlayerPage />} />

      {/* Instructor Portal Protected Routes */}
      <Route element={<DashboardLayout roleRequired="instructor" />}>
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<InstructorDashboard />} />
        <Route path="/instructor/courses/create" element={<CourseBuilderPage />} />
        <Route path="/instructor/courses/:id/edit" element={<CourseBuilderPage />} />
        <Route path="/instructor/students" element={<InstructorStudentsPage />} />
        <Route path="/instructor/submissions" element={<InstructorSubmissionsPage />} />
      </Route>

      {/* Admin Portal Protected Routes */}
      <Route element={<DashboardLayout roleRequired="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/courses" element={<AdminCoursesPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/payments" element={<AdminDashboard />} />
        <Route path="/admin/coupons" element={<AdminDashboard />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
      </Route>

      {/* Catch-all redirect to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
