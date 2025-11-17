'use client';

import { useRouter } from 'next/navigation';
import SettingsOverlay from '@/components/SettingsOverlay';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex">
      <SettingsOverlay isOpen={true} onClose={() => router.push("/assistants")} />
    </div>
  );
}
