import React, { useEffect } from 'react';
import { useAuth } from './services/auth';
import AuthContainer from './components/auth/AuthContainer';
import PredictionLayout from './components/PredictionLayout';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const { initialize, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black">
      {!isAuthenticated ? <AuthContainer /> : <PredictionLayout />}
    </div>
  );
}