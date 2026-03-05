import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useTheme } from './hooks/useTheme';

// Code-Splitting: Load larger phase files dynamically instead of initial bundling
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard').then(module => ({ default: module.PatientDashboard })));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard').then(module => ({ default: module.DoctorDashboard })));

// A simple loading fallback for chunk loading
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-med animate-spin"></div>
  </div>
);


function App() {
  // Initialize and persist theme globally across the app
  useTheme();

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
