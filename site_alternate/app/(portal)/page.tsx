'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import SignInModal from '@/components/SignInModal';
import GetStartedModal from '@/components/GetStartedModal';

export default function HomePage() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already signed in
    const user = localStorage.getItem('bablephish_user');
    if (user) {
      router.push('/assistants');
    }
  }, [router]);

  const handleGetStarted = () => {
    setShowGetStartedModal(true);
  };

  const handleGetStartedSubmit = (formData: { name: string; email: string; company: string; message: string }) => {
    console.log('Form submitted:', formData);
    setShowGetStartedModal(false);
    alert('Thank you for your interest! We will contact you soon.');
  };

  const handleSignInClick = () => {
    setShowSignInModal(true);
  };

  const handleSignIn = (email: string, password: string) => {
    // Simple authentication (in production, this would call an API)
    if (email === 'freddie@3cpublish.com' && password === 'Appdev2025!') {
      localStorage.setItem('bablephish_user', JSON.stringify({ email }));
      router.push('/assistants');
    } else {
      // For now, accept any credentials
      localStorage.setItem('bablephish_user', JSON.stringify({ email }));
      router.push('/assistants');
    }
  };

  return (
    <>
      <LandingPage 
        onGetStarted={handleGetStarted} 
        onSignInClick={handleSignInClick}
      />
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleSignIn}
      />
      <GetStartedModal
        isOpen={showGetStartedModal}
        onClose={() => setShowGetStartedModal(false)}
        onSubmit={handleGetStartedSubmit}
      />
    </>
  );
}
