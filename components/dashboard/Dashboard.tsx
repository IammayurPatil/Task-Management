import React, { useState, useEffect, useMemo } from 'react';
import { fetchProjects, createProject, removeProject, updateProject } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { apiFetch } from '../../lib/api';
import StatsGrid from './StatsGrid';
import ActivityTable from './ActivityTable';
import ProjectsSection from './ProjectsSection';
import ProjectDialog from './ProjectDialog';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(s => s.app.projects);
  const loading = useAppSelector(s => s.app.loading);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [submittingProject, setSubmittingProject] = useState(false);
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'board'>('overview');
  const [stats, setStats] = useState({
    finishedProjects: 0,
    timeTrackedMinutesWeek: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalMembers: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [activityRows, setActivityRows] = useState<Array<{
    id: string;
    name: string;
    taskName: string;
    projectName: string;
    deadline: string;
    status: string;
  }>>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.pathname.startsWith('/project')) {
      setActiveSection('board');
      return;
    }
    setActiveSection('overview');
  }, [router.isReady, router.pathname]);

  useEffect(() => {
    let mounted = true;
    setStatsLoading(true);
    apiFetch('/api/stats')
      .then((data) => {
        if (mounted) setStats(data);
      })
      .catch(() => {
        // Ignore stats errors; auth dialog will handle 401
      })
      .finally(() => {
        if (mounted) setStatsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setActivityLoading(true);
    apiFetch('/api/activity-table')
      .then((data) => {
        if (mounted) setActivityRows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // Ignore activity errors; auth dialog will handle 401
      })
      .finally(() => {
        if (mounted) setActivityLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreate = async () => {
    if (name.trim()) {
      setSubmittingProject(true);
      if (editingProjectId) {
        await dispatch(updateProject({ id: editingProjectId, updates: { name, description: desc, category, endDate } }));
      } else {
        await dispatch(createProject({ name, description: desc, category, endDate }));
      }
      setName('');
      setDesc('');
      setCategory('');
      setEndDate('');
      setEditingProjectId(null);
      setOpen(false);
      setSubmittingProject(false);
    }
  };

  const handleEditOpen = (project: { id: string; name: string; description?: string; category?: string; endDate?: string }) => {
    setEditingProjectId(project.id);
    setName(project.name || '');
    setDesc(project.description || '');
    setCategory(project.category || '');
    setEndDate(project.endDate || '');
    setOpen(true);
  };

  const taskStats = useMemo(() => {
    const totalTasks = stats.totalTasks || 0;
    const completedTasks = stats.completedTasks || 0;
    const pendingTasks = stats.pendingTasks || Math.max(totalTasks - completedTasks, 0);
    return {
      totalTasks,
      completedTasks,
      pendingTasks
    };
  }, [stats]);

  return (
    <>
      {/* tabs visually joined with header: reduced top spacing + shared background */}
      <Box
        sx={{
          mt: 0, /* touch header */
          mb: 2,
          width: '100%',
          px: { xs: 2, md: 3 }, /* full-row background */
          py: 0.75,
          bgcolor: '#EEF2FF',
          borderRadius: 2
        }}
      >
        <Tabs
          value={activeSection}
          onChange={(_, value) => {
            setActiveSection(value);
            if (value === 'board') {
              router.push('/project');
            } else {
              router.push('/');
            }
          }}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            bgcolor: 'transparent',
            '& .MuiTabs-indicator': { height: 3, borderRadius: 3, bgcolor: '#2563EB' },
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: '#64748B' },
            '& .Mui-selected': { color: '#0F172A' }
          }}
        >
          <Tab value="overview" label="Overview" />
          <Tab value="board" label="Projects" />
        </Tabs>
      </Box>

      <Box sx={{ maxWidth: 1400, justifyContent: 'center', mx: 'auto', px: { xs: 2, md: 0 }, textAlign: 'left' }}>
        {activeSection === 'overview' && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Highlights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Key stats and progress at a glance
              </Typography>
            </Box>

            <StatsGrid stats={stats} taskStats={taskStats} loading={statsLoading} />
            <ActivityTable rows={activityRows} loading={activityLoading} />
          </>
        )}

        {activeSection === 'board' && (
          <ProjectsSection
            projects={projects}
            loading={loading}
            search={search}
            onSearchChange={setSearch}
            onCreate={() => setOpen(true)}
            onRemove={(id) => dispatch(removeProject(id))}
            onEdit={handleEditOpen}
            onOpen={(id) => router.push(`/project/${id}`)}
          />
        )}

        <ProjectDialog
          open={open}
          name={name}
          desc={desc}
          category={category}
          endDate={endDate}
          mode={editingProjectId ? 'edit' : 'create'}
          canCreate={!!name.trim() && !!desc.trim() && !!category.trim() && !!endDate}
          submitting={submittingProject}
          onClose={() => {
            setOpen(false);
            setEditingProjectId(null);
          }}
          onCreate={handleCreate}
          onNameChange={setName}
          onDescChange={setDesc}
          onCategoryChange={setCategory}
          onEndDateChange={setEndDate}
        />
      </Box>
    </>
  );
};

export default Dashboard;
