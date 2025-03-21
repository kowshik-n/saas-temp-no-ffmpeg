import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { ProProvider } from "./context/ProContext";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import ProjectEditor from "./pages/ProjectEditor";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";

// Lazy load pages for better performance
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  // Handle Tempo routes for development environment
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <ProProvider>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          }
        >
          {tempoRoutes}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/project/:projectId" element={<ProjectEditor />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Allow Tempo routes to be captured before any catch-all */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster />
        </Suspense>
      </AuthProvider>
    </ProProvider>
  );
}

export default App;
