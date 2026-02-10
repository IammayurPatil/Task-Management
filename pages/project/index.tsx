import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../../components/dashboard/Dashboard';
import { useAppSelector } from '../../store/hooks';

const ProjectsPage: React.FC = () => {
  const router = useRouter();
  const user = useAppSelector(s => s.app.user);
  const hydrated = useAppSelector(s => s.app.hydrated);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/auth');
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) return null;

  return <Dashboard />;
};

export default ProjectsPage;
