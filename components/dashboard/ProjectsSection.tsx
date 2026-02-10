import React from 'react';
import { Box, Card, CardActionArea, CardContent, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material';
import { Calendar, Edit2, Folder, Plus, Trash2 } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

type Project = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  endDate?: string;
  createdAt: string;
};

type Props = {
  projects: Project[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onRemove: (id: string) => void;
  onEdit: (project: Project) => void;
  onOpen: (id: string) => void;
};

const ProjectsSection: React.FC<Props> = ({
  projects,
  loading,
  search,
  onSearchChange,
  onCreate,
  onRemove,
  onEdit,
  onOpen
}) => {
  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <TextField
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 260 },
            '& .MuiInputBase-root': { bgcolor: '#F8FAFF', borderRadius: 1.5 }
          }}
        />
        <GradientButton startIcon={<Plus size={20} />} onClick={onCreate}>
          New Project
        </GradientButton>
      </Box>

      {loading && projects.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', py: 10 }}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#F8FAFF', borderRadius: 2, border: '2px dashed #E6EAF2' }}>
          <Folder size={48} className="mx-auto text-slate-300 mb-4" />
          <Typography variant="h6" color="text.secondary">No projects found</Typography>
          <Typography variant="body2" color="text.disabled">Try a different search or create a new project</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent={{ xs: 'center', lg: 'flex-start' }}>
          {filtered.map((project) => (
            <Grid xs={12} sm={6} md={4} lg={3} key={project.id} sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-start' } }}>
              <Card sx={{
                height: '100%',
                borderRadius: 4,
                minWidth: { xs: 300, sm: 300, md: 300, lg: 280 },
                maxWidth: { xs: 320, sm: 320, md: 320, lg: 300 },
                border: '1px solid #EEF2F7',
                boxShadow: '0 16px 28px rgba(15, 23, 42, 0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                bgcolor: '#FFFFFF',
                width: '100%',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 34px rgba(15, 23, 42, 0.10)' }
              }}>
                <CardActionArea onClick={() => onOpen(project.id)} sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3.5 }}>
                    {/* updated card header styling */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: '50%',
                          background: '#EAF2FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Folder size={20} color="#2563EB" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(project);
                          }}
                          sx={{ color: '#94A3B8' }}
                        >
                          <Edit2 size={20} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this project?')) onRemove(project.id);
                          }}
                          sx={{ color: '#94A3B8' }}
                        >
                          <Trash2 size={24} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }} className="line-clamp-1">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.2, minHeight: 40 }} className="line-clamp-2">
                      {project.description || 'No description provided.'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      {/* assumption: category used as status pill */}
                      <Box sx={{ px: 1.4, py: 0.5, borderRadius: 999, bgcolor: '#EEF2FF', color: '#2563EB', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                        {(project.category || 'In Progress').toUpperCase()}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#64748B' }}>
                      <Calendar size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Deadline: {project.endDate || '—'}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ProjectsSection;
