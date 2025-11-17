'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatPage from '@/components/ChatPage';

export const dynamic = 'force-dynamic';

export default function ChatPageRoute() {
  const [selectedAssistant, setSelectedAssistant] = useState<{ name: string; id: string } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check authentication
    const userStr = localStorage.getItem('bablephish_user');
    if (!userStr) {
      router.push('/');
      return;
    }

    // Get selected assistant
    const assistantStr = localStorage.getItem('selected_assistant');
    if (assistantStr) {
      setSelectedAssistant(JSON.parse(assistantStr));
    }
  }, [router, isClient]);

  const handleOpenPromptCatalog = () => {
    router.push('/prompt-catalog');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex">
        <ChatPage 
          selectedAssistant={selectedAssistant}
          selectedPrompt=""
          onPromptUsed={() => {}}
          onOpenPromptCatalog={handleOpenPromptCatalog}
        />
      </div>
    </div>
  );
}
