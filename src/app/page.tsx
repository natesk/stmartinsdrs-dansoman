'use client';

import { AppProvider, useApp } from '@/context/AppProvider';
import Login from '@/components/auth/Login';
import Dashboard from '@/components/dashboard/Dashboard';
import Loading from './loading';

function App() {
  const { user, loading } = useApp();

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-background">
      {user ? <Dashboard /> : <Login />}
    </main>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
