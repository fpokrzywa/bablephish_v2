'use client';

import { useRouter } from 'next/navigation';
import ProfileOverlay from '@/components/ProfileOverlay';

export default function ProfileRoute() {
  const router = useRouter();

  return (
    <div className="flex-1 flex">
      <ProfileOverlay isOpen={true} onClose={() => router.push("/assistants")} />
    </div>
  );
}
