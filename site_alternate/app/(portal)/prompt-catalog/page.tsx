'use client';

import { useRouter } from 'next/navigation';
import PromptCatalogPage from '@/components/PromptCatalogPage';

export default function PromptCatalogRoute() {
  const router = useRouter();

  const handlePromptSelect = (promptText: string, assistantName: string) => {
    const assistantId = assistantName.toLowerCase().replace(/\s+/g, '_');
    localStorage.setItem('selected_assistant', JSON.stringify({ name: assistantName, id: assistantId }));
    localStorage.setItem('selected_prompt', promptText);
    router.push('/chat');
  };

  return (
    <div className="flex-1 flex">
      <PromptCatalogPage onPromptSelect={handlePromptSelect} />
    </div>
  );
}
