import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";

export default function App() {
  const [onboarding, setOnboarding] = useState<any>(null);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage onFinish={setOnboarding} />} />
      <Route path="/dashboard" element={<DashboardPage onboarding={onboarding} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
