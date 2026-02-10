import React from 'react';
import { Box, Card, CardContent, Stack, Typography, Skeleton } from '@mui/material';
import { Clock, ClipboardList, FolderKanban, Users } from 'lucide-react';

type Stats = {
  finishedProjects: number;
  timeTrackedMinutesWeek: number;
  totalTasks: number;
  totalMembers: number;
};

type TaskStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
};

type Props = {
  stats: Stats;
  taskStats: TaskStats;
  loading?: boolean;
};

const PieChart = ({
  data,
  totalTasks,
  size = 140,
  thickness = 16
}: {
  data: { label: string; value: number; color: string }[];
  totalTasks: number;
  size?: number;
  thickness?: number;
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={thickness}
          />
          {total > 0 && data.map((item) => {
            const segment = (item.value / total) * circumference;
            const dashArray = `${segment} ${circumference}`;
            const dashOffset = -offset;
            offset += segment;
            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={thickness}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {totalTasks}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total Tasks
        </Typography>
      </Box>
    </Box>
  );
};

const StatsGrid: React.FC<Props> = ({ stats, taskStats, loading = false }) => {
  const statCardSx = {
    borderRadius: 2,
    minWidth: 260,
    height: '100%',
    border: '1px solid #E6EAF2',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
    background: '#FFFFFF'
  } as const;

  const pieData = [
    { label: 'Completed', value: taskStats.completedTasks, color: '#2563EB' },
    { label: 'Pending', value: taskStats.pendingTasks, color: '#06B6D4' }
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        {[...Array(5)].map((_, idx) => (
          <Card key={idx} sx={statCardSx}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton variant="rounded" width={50} height={50} />
              <Skeleton variant="text" width="60%" height={36} />
              <Skeleton variant="text" width="80%" height={24} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)'
        },
        gap: 3,
        mb: 4
      }}
    >
      <Card sx={statCardSx}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderKanban size={20} color="#2563EB" />
            </Box>
          </Stack>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1.5 }}>{stats.finishedProjects}</Typography>
            <Typography variant="body1" color="text.secondary">Project Finished</Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={statCardSx}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#0EA5E9" />
            </Box>
          </Stack>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              {Math.floor(stats.timeTrackedMinutesWeek / 60)}h {stats.timeTrackedMinutesWeek % 60}m
            </Typography>
            <Typography variant="body1" color="text.secondary">Time Tracked (week)</Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={statCardSx}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={20} color="#06B6D4" />
            </Box>
          </Stack>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1.5 }}>{stats.totalTasks}</Typography>
            <Typography variant="body1" color="text.secondary">Total Tasks</Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={statCardSx}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#4F46E5" />
            </Box>
          </Stack>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1.5 }}>{stats.totalMembers}</Typography>
            <Typography variant="body1" color="text.secondary">Total Members</Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={statCardSx}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <Stack direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#2563EB' }} />
                <Typography variant="body2">Completed</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, ml: 0.5 }}>{taskStats.completedTasks}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#06B6D4' }} />
                <Typography variant="body2">Pending</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, ml: 0.5 }}>{taskStats.pendingTasks}</Typography>
              </Box>
            </Stack>
            <PieChart data={pieData} totalTasks={taskStats.totalTasks} size={140} thickness={16} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatsGrid;
