import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectView from '../../components/project/ProjectView';
import { useAppSelector } from '../../store/hooks';

const ProjectRoute: React.FC = () => {
  const router = useRouter();
  const user = useAppSelector(s => s.app.user);
  const hydrated = useAppSelector(s => s.app.hydrated);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/auth');
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) return null;

  return <ProjectView />;
};

export default ProjectRoute;
