import React from 'react';
import { Box, Card, CardContent, CircularProgress, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

type ActivityRow = {
  id: string;
  name: string;
  taskName: string;
  projectName: string;
  deadline: string;
  status: string;
};

type Props = {
  rows: ActivityRow[];
  loading: boolean;
};

const ActivityTable: React.FC<Props> = ({ rows, loading }) => {
  return (
    <Card sx={{ borderRadius: 2, mb: 4, border: '1px solid #E6EAF2', boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)', background: '#FFFFFF' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Activity</Typography>
            <Typography variant="body2" color="text.secondary">Recent task activity across projects</Typography>
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, background: 'white', border: 'none' }}>
          <Table
            size="small"
            sx={{
              '& .MuiTableCell-root': { borderBottom: 'none', py: 1.5 },
              '& .MuiTableRow-root': { backgroundColor: 'transparent' }
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: 'transparent', display: { xs: 'none', sm: 'table-row' } }}>
                <TableCell sx={{ width: 32, color: 'text.disabled' }}>.</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Activity</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Deadline</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(4)].map((_, idx) => (
                  <TableRow key={`sk-${idx}`}>
                    <TableCell sx={{ width: 32, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Skeleton variant="rounded" width={34} height={34} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="40%" height={22} />
                      <Skeleton variant="text" width="70%" height={18} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Skeleton variant="text" width="80%" height={18} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Skeleton variant="text" width="60%" height={18} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Skeleton variant="text" width="60%" height={18} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Skeleton variant="rounded" width={64} height={22} />
                    </TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary">No activity yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      transition: 'background-color 0.2s ease',
                      '&:hover': { backgroundColor: '#F5F7FF' }
                    }}
                  >
                    <TableCell sx={{ width: 32, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '10px',
                          background: '#E0F2FE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0F172A',
                          fontWeight: 700,
                          fontSize: 12
                        }}
                      >
                        {row.name.charAt(0).toUpperCase()}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Box sx={{ display: { xs: 'flex', sm: 'block' }, alignItems: { xs: 'center', sm: 'initial' }, gap: 1 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '10px',
                            background: '#E0F2FE',
                            display: { xs: 'flex', sm: 'none' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0F172A',
                            fontWeight: 700,
                            fontSize: 12
                          }}
                        >
                          {row.name.charAt(0).toUpperCase()}
                        </Box>
                        <Box>{row.name}</Box>
                      </Box>
                      <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 0.75 }}>
                        <Typography variant="body2" color="text.secondary">
                          Working On{' '}
                          <Box component="span" sx={{ color: '#2563EB', fontWeight: 600 }}>
                            {row.taskName}
                          </Box>
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {row.projectName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.deadline}
                          </Typography>
                          <Box
                            component="span"
                            sx={{
                              px: 1.1,
                              py: 0.35,
                              borderRadius: 2,
                              fontSize: 11,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              alignItems: 'center',
                              color: ['DONE', 'COMPLETED'].includes(String(row.status).toUpperCase())
                                ? '#16A34A'
                                : ['IN_PROGRESS', 'PENDING'].includes(String(row.status).toUpperCase())
                                ? '#2563EB'
                                : ['REVIEW', 'TODO'].includes(String(row.status).toUpperCase())
                                ? '#F59E0B'
                                : '#64748B',
                              backgroundColor: ['DONE', 'COMPLETED'].includes(String(row.status).toUpperCase())
                                ? '#DCFCE7'
                                : ['IN_PROGRESS', 'PENDING'].includes(String(row.status).toUpperCase())
                                ? '#DBEAFE'
                                : ['REVIEW', 'TODO'].includes(String(row.status).toUpperCase())
                                ? '#FEF3C7'
                                : '#E2E8F0'
                            }}
                          >
                            {String(row.status || 'todo').toLowerCase().replace(/_/g, ' ') === 'review'
                              ? 'In Review'
                              : String(row.status || 'todo').toLowerCase().replace(/_/g, ' ')}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography variant="body2" color="text.secondary">
                        Working On{' '}
                        <Box component="span" sx={{ color: '#2563EB', fontWeight: 600 }}>
                          {row.taskName}
                        </Box>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}>{row.projectName}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}>{row.deadline}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Box
                        component="span"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: ['DONE', 'COMPLETED'].includes(String(row.status).toUpperCase())
                            ? '#16A34A'
                            : ['IN_PROGRESS', 'PENDING'].includes(String(row.status).toUpperCase())
                            ? '#2563EB'
                            : ['REVIEW', 'TODO'].includes(String(row.status).toUpperCase())
                            ? '#F59E0B'
                            : '#64748B',
                          backgroundColor: ['DONE', 'COMPLETED'].includes(String(row.status).toUpperCase())
                            ? '#DCFCE7'
                            : ['IN_PROGRESS', 'PENDING'].includes(String(row.status).toUpperCase())
                            ? '#DBEAFE'
                            : ['REVIEW', 'TODO'].includes(String(row.status).toUpperCase())
                            ? '#FEF3C7'
                            : '#E2E8F0'
                        }}
                      >
                        {String(row.status || 'todo').toLowerCase().replace(/_/g, ' ') === 'review'
                          ? 'In Review'
                          : String(row.status || 'todo').toLowerCase().replace(/_/g, ' ')}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} />
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ActivityTable;
