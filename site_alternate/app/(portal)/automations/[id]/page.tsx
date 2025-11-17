'use client';

import { useParams, useRouter } from 'next/navigation';
import MainContent from '@/components/MainContent';

export const dynamic = 'force-dynamic';

export default function AutomationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const handleClose = () => {
    router.push('/assistants');
  };

  return (
    <div className="flex-1 flex">
      <MainContent
        activeSection={id}
        onClose={handleClose}
      />
    </div>
  );
}
