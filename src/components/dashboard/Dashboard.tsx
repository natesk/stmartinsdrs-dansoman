'use client';

import { useApp } from '@/context/AppProvider';
import Header from '@/components/layout/Header';
import RosterTable from '@/components/roster/RosterTable';
import AdminPanel from '@/components/admin/AdminPanel';

export default function Dashboard() {
  const { user } = useApp();

  const isCoordinator = user?.role === 'Clinical Coordinator';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <RosterTable />
        </main>
        {isCoordinator && (
          <aside className="w-full border-t lg:w-96 lg:border-l lg:border-t-0">
            <AdminPanel />
          </aside>
        )}
      </div>
    </div>
  );
}
