import { JitsuProvider } from "@jitsu/jitsu-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthContext";
import { FeatureFlagsProvider } from "@/providers/FeatureFlags";
import { AuthGuard } from "@/components/AuthGuard";
import { LoginPage } from "@/components/LoginPage";
import { WeatherApp } from "@/components/WeatherApp";
import { JITSU_HOST, JITSU_WRITE_KEY } from "./lib/analytics";

export default function App() {
  return (
    <AuthProvider>
      <FeatureFlagsProvider>
        <JitsuProvider
          options={{
            host: JITSU_HOST,
            writeKey: JITSU_WRITE_KEY,
          }}
        >
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <WeatherApp />
                  </AuthGuard>
                }
              />
            </Routes>
          </Router>
        </JitsuProvider>
      </FeatureFlagsProvider>
    </AuthProvider>
  );
}
