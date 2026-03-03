import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Landing from "../features/Home/page/Landing";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/dashboard/page/Dashboard";
import ForgetPassword from "../features/auth/pages/ForgetPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import CoachPage from "../features/coach/pages/CoachPage";
import WorkspacePage from "../features/workspace/pages/workspace";

import JournalHomePage from "../features/journal/page/JournalHomePage";
import TemplateSelection from "../features/journal/page/TemplateSelection";
import EditorPage from "../features/journal/page/JournalEditorPage";
import JournalResolverPage from "../features/journal/page/JournalResolverPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 🔒 Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coach"
          element={
            <ProtectedRoute>
              <CoachPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />

        {/* 📚 Journals List */}
        <Route
          path="/journals"
          element={
            <ProtectedRoute>
              <JournalHomePage />
            </ProtectedRoute>
          }
        />

        {/* 🧠 Resolver (open journal) */}
        <Route
          path="/journals/:journalId/open"
          element={
            <ProtectedRoute>
              <JournalResolverPage />
            </ProtectedRoute>
          }
        />

        {/* 🧩 Template Selection */}
        <Route
          path="/templates/:journalId"
          element={
            <ProtectedRoute>
              <TemplateSelection />
            </ProtectedRoute>
          }
        />

        {/* ✏️ Editor by Date */}
        <Route
          path="/journals/:journalId/date/:date"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}