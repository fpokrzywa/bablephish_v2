'use client';

import { useParams, useRouter } from 'next/navigation';
import MainContent from '@/components/MainContent';
import RightPanel from '@/components/RightPanel';

export const dynamic = 'force-dynamic';

export default function AnswerPage() {
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
      <RightPanel
        isExpanded={false}
        isFullScreen={false}
        onExpandAll={() => {}}
        user={null}
        activeSection={id}
      />
    </div>
  );
}
