import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "./store";
import { z } from "zod";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PricingPage from "./pages/Pricing";
import CoursesPage from "./pages/Courses";
import PrivacyPage from "./pages/Privacy";
import MyCoursesPage from "./pages/MyCourses";
import AuthorSetupPage from "./pages/AuthorSetup";
import CourseDetailPage from "./pages/CourseDetail";
import CreateCoursePage from "./pages/CreateCourse";
import ChapterDetailPage from "./pages/ChapterDetail";
import AuthorPage from "./pages/AuthorPage";
import LessonDetailPage from "./pages/LessonDetail";
import CreateLessonPage from "./pages/CreateLesson";
import EditLessonPage from "./pages/EditLesson";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import EditCoursePage from "./pages/EditCourse";

const App = () => {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutorials" element={<CoursesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/chapters/:id" element={<ChapterDetailPage />} />
        {/* Lesson public route */}
        <Route path="/lessons/:id" element={<LessonDetailPage />} />
        <Route path="/lessons/:id/edit" element={<EditLessonPage />} />
        <Route path="/author/:id" element={<AuthorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/setup-author" element={<AuthorSetupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/my-courses/new" element={<CreateCoursePage />} />
          <Route path="/my-courses/:id/edit" element={<EditCoursePage />} />
          {/* Create lesson – only authenticated users (course authors) */}
          <Route
            path="/chapters/:id/lessons/new"
            element={<CreateLessonPage />}
          />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
