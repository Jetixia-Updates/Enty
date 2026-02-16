import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Expenses from "@/pages/Expenses";
import Shopping from "@/pages/Shopping";
import Marketplace from "@/pages/Marketplace";
import ProviderDetail from "@/pages/ProviderDetail";
import Kids from "@/pages/Kids";
import Community from "@/pages/Community";
import NotFound from "@/pages/NotFound";

import Layout from "@/components/Layout";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  if (isAuth) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout><Tasks /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Layout><Expenses /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shopping"
        element={
          <ProtectedRoute>
            <Layout><Shopping /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <Layout><Marketplace /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace/provider/:id"
        element={
          <ProtectedRoute>
            <Layout><ProviderDetail /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kids"
        element={
          <ProtectedRoute>
            <Layout><Kids /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <Layout><Community /></Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
