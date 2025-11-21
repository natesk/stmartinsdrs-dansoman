'use client';
import { useApp } from '@/context/AppProvider';
import Dashboard from '@/components/dashboard/Dashboard';
import Login from '@/components/auth/Login';
import Loading from './loading';

export default function Home() {
  const { user, loading: appLoading, doctors, roster } = useApp();

  const loading = appLoading || !doctors || !roster;

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
}
