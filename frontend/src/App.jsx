import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";

import ErrorBoundary from "./components/common/ErrorBoundary";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { AdminRoute, GuestOnlyRoute, ProtectedRoute } from "./components/common/ProtectedRoute";

// Lazy-load every route so the initial bundle stays small — especially
// important here since a few pages (Live Translation, Sign to Text) pull
// in the MediaPipe vision WASM runtime.
const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const LearnSignLanguage = lazy(() => import("./pages/LearnSignLanguage"));
const AlphabetLearning = lazy(() => import("./pages/AlphabetLearning"));
const NumbersLearning = lazy(() => import("./pages/NumbersLearning"));
const CommonWords = lazy(() => import("./pages/CommonWords"));
const DailyPractice = lazy(() => import("./pages/DailyPractice"));
const QuizSection = lazy(() => import("./pages/QuizSection"));
const LiveCameraTranslation = lazy(() => import("./pages/LiveCameraTranslation"));
const SignToText = lazy(() => import("./pages/SignToText"));
const TextToSpeech = lazy(() => import("./pages/TextToSpeech"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ProgressTracking = lazy(() => import("./pages/ProgressTracking"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ServerError = lazy(() => import("./pages/ServerError"));
const DevHandshapes = lazy(() => import("./pages/DevHandshapes"));
const ModelReport = lazy(() => import("./pages/ModelReport"));

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-aurora bg-fixed">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgb(19 27 46)",
            color: "rgb(234 240 251)",
            border: "1px solid rgba(234,240,251,0.08)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#2DD4BF", secondary: "#0A0F1E" } },
          error: { iconTheme: { primary: "#F87171", secondary: "#0A0F1E" } },
        }}
      />
      <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>}>
        <Routes>
          {/* Public marketing + informational pages */}
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />

          {/* Learning content — browsable without login, practice actions require auth */}
          <Route path="/learn" element={<Layout><LearnSignLanguage /></Layout>} />
          <Route path="/learn/alphabet" element={<Layout><AlphabetLearning /></Layout>} />
          <Route path="/learn/numbers" element={<Layout><NumbersLearning /></Layout>} />
          <Route path="/learn/common-words" element={<Layout><CommonWords /></Layout>} />
          <Route path="/daily-practice" element={<Layout><DailyPractice /></Layout>} />
          <Route path="/quiz" element={<Layout><QuizSection /></Layout>} />

          {/* AI translation tools */}
          <Route path="/live-translation" element={<Layout><LiveCameraTranslation /></Layout>} />
          <Route path="/sign-to-text" element={<Layout><SignToText /></Layout>} />
          <Route path="/text-to-speech" element={<Layout><TextToSpeech /></Layout>} />
          <Route path="/dev/handshapes" element={<Layout><DevHandshapes /></Layout>} />
          <Route path="/model-report" element={<Layout><ModelReport /></Layout>} />

          {/* Auth */}
          <Route path="/login" element={<Layout><GuestOnlyRoute><Login /></GuestOnlyRoute></Layout>} />
          <Route path="/register" element={<Layout><GuestOnlyRoute><Register /></GuestOnlyRoute></Layout>} />
          <Route path="/forgot-password" element={<Layout><GuestOnlyRoute><ForgotPassword /></GuestOnlyRoute></Layout>} />
          <Route path="/reset-password" element={<Layout><GuestOnlyRoute><ResetPassword /></GuestOnlyRoute></Layout>} />

          {/* Authenticated */}
          <Route path="/home" element={<Layout><ProtectedRoute><Home /></ProtectedRoute></Layout>} />
          <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
          <Route path="/profile" element={<Layout><ProtectedRoute><UserProfile /></ProtectedRoute></Layout>} />
          <Route path="/progress" element={<Layout><ProtectedRoute><ProgressTracking /></ProtectedRoute></Layout>} />

          {/* Admin */}
          <Route path="/admin" element={<Layout><AdminRoute><AdminDashboard /></AdminRoute></Layout>} />

          {/* Errors */}
          <Route path="/500" element={<Layout><ServerError /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
