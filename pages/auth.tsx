import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthPage from '../components/AuthPage';
import { useAppSelector } from '../store/hooks';

const AuthRoute: React.FC = () => {
  const router = useRouter();
  const user = useAppSelector(s => s.app.user);
  const hydrated = useAppSelector(s => s.app.hydrated);

  useEffect(() => {
    if (hydrated && user) {
      router.replace('/');
    }
  }, [hydrated, user, router]);

  if (!hydrated || user) return null;

  return <AuthPage />;
};

export default AuthRoute;
