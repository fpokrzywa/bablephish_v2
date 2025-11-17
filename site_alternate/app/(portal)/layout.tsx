'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('bablephish_user') : null;
    if (!userStr) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [router]);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bablephish_user');
    }
    router.push('/');
  };

  const handleSectionChange = (section: string) => {
    router.push(`/${section}`);
  };

  const handleCollapseAll = () => setIsSidebarCollapsed(true);
  const handleToggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  // Extract active section from pathname
  const getActiveSection = () => {
    // Remove leading slash
    const path = pathname.slice(1);
    return path || 'assistants';
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={getActiveSection()}
        onSectionChange={handleSectionChange}
        onCollapseAll={handleCollapseAll}
        user={user}
        onSignOut={handleSignOut}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      {children}
    </div>
  );
}
