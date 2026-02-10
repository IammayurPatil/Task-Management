import React from 'react';
import { Card, CardActionArea, CardContent, CircularProgress, IconButton, TextField, Typography, Skeleton } from '@mui/material';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="w-full sm:max-w-[320px]">
          <TextField
            placeholder="Search projects..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            fullWidth
            sx={{
              '& .MuiInputBase-root': { bgcolor: '#F8FAFF', borderRadius: 1.5 }
            }}
          />
        </div>
        <div className="flex justify-end sm:justify-start">
          <GradientButton startIcon={<Plus size={20} />} onClick={onCreate}>
            New Project
          </GradientButton>
        </div>
      </div>

      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-center py-4">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} sx={{
              height: '100%',
              borderRadius: 4,
              minWidth: { xs: 300, sm: 300, md: 320, lg: 320, xl: 320 },
              maxWidth: { xs: 320, sm: 320, md: 320, lg: 320, xl: 320 },
              border: '1px solid #EEF2F7',
              bgcolor: '#FFFFFF',
              width: '100%'
            }}>
              <CardContent sx={{ p: 3.5 }}>
                <Skeleton variant="circular" width={46} height={46} />
                <Skeleton variant="text" width="70%" height={32} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="90%" height={22} />
                <Skeleton variant="rounded" width="60%" height={24} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 rounded-lg border-2 border-dashed" style={{ backgroundColor: '#F8FAFF', borderColor: '#E6EAF2' }}>
          <Folder size={48} className="mx-auto text-slate-300 mb-4" />
          <Typography variant="h6" color="text.secondary">No projects found</Typography>
          <Typography variant="body2" color="text.disabled">Try a different search or create a new project</Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-center">
          {filtered.map((project) => (
            <div key={project.id} className="flex justify-center lg:justify-start w-full">
              <Card sx={{
                height: '100%',
                borderRadius: 2,
                minWidth: { xs: 300, sm: 300, md: 320, lg: 320, xl: 320 },
                maxWidth: { xs: 320, sm: 320, md: 320, lg: 320, xl: 320 },
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
                    <div className="flex items-start justify-between mb-2.5 gap-2">
                      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 46, height: 46, background: '#EAF2FF' }}>
                        <Folder size={20} color="#2563EB" />
                      </div>
                      <div className="flex items-center gap-1 ml-auto shrink-0">
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
                      </div>
                    </div>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }} className="line-clamp-1">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.2, minHeight: 40 }} className="line-clamp-2">
                      {project.description || 'No description provided.'}
                    </Typography>
                    <div className="flex items-center gap-2 mb-2">
                      {/* assumption: category used as status pill */}
                      <div style={{ padding: '0.3rem 0.50rem', borderRadius: 999, background: '#EEF2FF', color: '#2563EB', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                        {(project.category || 'In Progress').toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                      <Calendar size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Deadline: {project.endDate || '—'}
                      </Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectsSection;
