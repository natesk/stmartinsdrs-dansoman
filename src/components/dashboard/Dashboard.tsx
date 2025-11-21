'use client';

import { useApp } from '@/context/AppProvider';
import Login from '@/components/auth/Login';
import RosterTable from '@/components/roster/RosterTable';
import AdminPanel from '@/components/admin/AdminPanel';
import Header from '@/components/layout/Header';
import Loading from '@/app/loading';

export default function Dashboard() {
  const { user, loading, doctors, roster } = useApp();

  if (loading || !doctors || !roster) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <RosterTable />
          {user.role === 'Clinical Coordinator' && <AdminPanel />}
        </div>
      </main>
    </div>
  );
}
