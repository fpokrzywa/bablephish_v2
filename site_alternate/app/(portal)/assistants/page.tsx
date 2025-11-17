'use client';

import { useRouter } from 'next/navigation';
import AssistantsPage from '@/components/AssistantsPage';

export default function AssistantsPageRoute() {
  const router = useRouter();

  const handleAssistantSelect = (assistant: { name: string; id: string }) => {
    // Store selected assistant and navigate to chat
    localStorage.setItem('selected_assistant', JSON.stringify(assistant));
    router.push('/chat');
  };

  return (
    <div className="flex-1 flex">
      <AssistantsPage onAssistantSelect={handleAssistantSelect} />
    </div>
  );
}
