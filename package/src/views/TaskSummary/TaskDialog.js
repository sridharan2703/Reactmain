/**
 * @fileoverview Compact dialogbox component with API Integration
 * @module components/Tasksummarydialog
 * @author Elakiya
 * @date 12/08/2025
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, Box, Typography, Grid, Tabs, Tab, Button,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  Rating, Fade, Card, CardContent, IconButton, LinearProgress, Stack,
} from '@mui/material';
import {
  Close as CloseIcon, Person as PersonIcon, LocationOn as LocationIcon,
  ChatBubbleOutline as ChatIcon, Description as DocumentIcon, Download as DownloadIcon,
  CheckCircle as CheckIcon, Star as StarIcon, TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon, Verified as VerifiedIcon, Speed as SpeedIcon,
  Visibility as VisibilityIcon 
} from '@mui/icons-material';
import FancyCircularLoader from "src/components/ui/Loader";
import CommentsHistory from "src/components/Process/CommentsSection"; 

// --- New Imports from Utilities ---
// NOTE: Ensure these imports are correctly resolved to your project's files.
import { fetchPDFDocument, getSessionId } from './cryptoApi';
// ----------------------------------


// [Swal Mock/Helper - Remains local]
const Swal = { fire: ({ icon, title, text }) => { console.error(`${icon} - ${title}: ${text}`); alert(`${title}: ${text}`); } };


// =========================================================================
// UI HELPERS (FULL DEFINITION)
// =========================================================================

const GlassCard = ({ children, sx = {}, gradient = false }) => (
  <Card 
    elevation={0}
    sx={{
      background: gradient 
        ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)'
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: 3,
      border: '1px solid rgba(255,255,255,0.3)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      ...sx
    }}
  >
    {children}
  </Card>
);

const InfoItem = ({ label, value, icon: Icon, isRating = false }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      {Icon && <Icon sx={{ fontSize: 14, color: '#667eea', opacity: 0.7 }} />}
      <Typography
        variant="caption"
        sx={{ 
          fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem', 
          letterSpacing: '1px', color: '#64748b'
        }}
      >
        {label}
      </Typography>
    </Box>
    {isRating ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Rating value={value} readOnly size="small" precision={0.5} />
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{value}/5</Typography>
      </Box>
    ) : (
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 600, color: '#1e293b', fontSize: '0.8rem', px: 1.5, py: 1,
          backgroundColor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0',
          transition: 'all 0.2s', '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }
        }}
      >
        {value || 'N/A'}
      </Typography>
    )}
  </Box>
);

const statusConfig = {
  'Completed': { label: 'COMPLETED', color: '#059669', bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', icon: CheckIcon },
  'Pending': { label: 'PENDING', color: '#dc2626', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', icon: ScheduleIcon },
  'On Going': { label: 'IN PROGRESS', color: '#667eea', bg: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)', icon: TrendingIcon },
  'Saved as Draft': { label: 'DRAFT', color: '#64748b', bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', icon: ScheduleIcon },
};

const getStatusChip = (status) => {
  const config = statusConfig[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  const StatusIcon = config.icon;
  return (
    <Chip
      icon={StatusIcon ? <StatusIcon sx={{ fontSize: 14, color: config.color + ' !important' }} /> : undefined}
      label={config.label}
      sx={{ background: config.bg, color: config.color, fontSize: '0.6rem', fontWeight: 800, height: 28, borderRadius: 1.5, letterSpacing: '0.5px', border: 'none', px: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.06)', '& .MuiChip-icon': { marginLeft: '6px' } }}
    />
  );
};

const PDFPreviewDialog = ({ open, onClose, pdfUrl, pdfType, isLoading }) => {
    useEffect(() => {
        return () => { if (pdfUrl) { URL.revokeObjectURL(pdfUrl); } };
    }, [pdfUrl]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Fade} PaperProps={{ sx: { height: '75vh', width: '1200px', maxWidth: '90vw', borderRadius: 3 } }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
                <Typography variant="h6" fontWeight={700} color="#1e293b"> Preview: {pdfType || 'Document'} </Typography>
                <IconButton onClick={onClose}> <CloseIcon /> </IconButton>
            </Box>
            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {isLoading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}> <FancyCircularLoader size={80} strokeWidth={8} /> <Typography>Generating PDF...</Typography> </Box>
                ) : pdfUrl ? (
                    <iframe src={pdfUrl} style={{ flexGrow: 1, border: 'none', width: '100%', height: '100%' }} title="PDF Preview" />
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}> <Typography color="error">Failed to load PDF preview.</Typography> </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};
// =========================================================================


const TaskDialog = ({ open, onClose, task, isLoading, isError }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfType, setPdfType] = useState(null);
  const [generating, setGenerating] = useState(false);
  
  // =========================================================================
  // MOCK DATA (FULL DEFINITION)
  // =========================================================================
  const initialFeedbacks = [
    { id: 1, step: 'Initial Application', user: 'John Doe', rating: 5, comment: 'Excellent service! Everything was handled smoothly and professionally.', date: '2025-08-20' },
    { id: 2, step: 'Document Verification', user: 'Jane Smith', rating: 4, comment: 'Good overall, but the processing could have been a bit faster.', date: '2025-08-21' },
    { id: 3, step: 'Final Processing', user: 'Mike Johnson', rating: 4.5, comment: 'Great support from the team. Highly recommend!', date: '2025-08-22' },
  ];
  const progressData = [
    { activity: 'Initial Application', instructedBy: 'System', remarks: 'Application submitted successfully', date: '16-08-2025', status: 'Completed' },
    { activity: 'Document Verification', instructedBy: 'Senior Manager - Technical', remarks: 'All documents verified and approved', date: '18-08-2025', status: 'Completed' },
    { activity: 'Final Processing', instructedBy: 'HR Department', remarks: 'Processing in progress', date: '20-08-2025', status: 'On Going' },
  ];
  const documents = [
    { name: 'ltc-application-form.pdf', type: 'PDF Document', size: '2.4 MB', uploaded: '16-08-2025' },
    { name: 'supporting-documents.xlsx', type: 'Excel Sheet', size: '1.2 MB', uploaded: '16-08-2025' }
  ];
  const customRoleColors = { 
    'Initiator': { bg: "#DBEAFE", text: "#1E40AF" }, 'Approver': { bg: "#FEF3C7", text: "#92400E" }, 
    'Reviewer': { bg: "#E0E7FF", text: "#3730A3" }, 'System': { bg: "#F3F4F6", text: "#374151" }, 
    'APPROVED': { bg: "#D1FAE5", text: "#059669" }, 'REJECTED': { bg: "#FEE2E2", text: "#EF4444" }, 'Default': { bg: "#F3F4F6", text: "#374151" }, 
  };
  // =========================================================================


  const [feedbacks, setFeedbacks] = useState(initialFeedbacks); 
  const [stepRatings, setStepRatings] = useState(
      Object.fromEntries(progressData.map(d => [d.activity, 0]))
  ); 
  const [stepComments, setStepComments] = useState(
      Object.fromEntries(progressData.map(d => [d.activity, '']))
  ); 

  useEffect(() => { 
    if (open) { 
        setActiveTab('overview');
        setFeedbacks(initialFeedbacks);
        setStepRatings(Object.fromEntries(progressData.map(d => [d.activity, 0])));
        setStepComments(Object.fromEntries(progressData.map(d => [d.activity, ''])));
        setPdfUrl(null); setPdfType(null); setGenerating(false); setIsPdfDialogOpen(false);
    }
  }, [task?.task_id, open]); 

  if (isLoading || !task) { 
      return (
          <Dialog open={open} onClose={onClose} maxWidth="xs" TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: 3, p: 4, textAlign: 'center' } }}>
              <LinearProgress color="primary" sx={{ mb: 2 }} />
              <Typography variant="body1" fontWeight={600} color="primary">Loading Task Details...</Typography>
              {isError && ( <Typography variant="body2" color="error" sx={{ mt: 1 }}>Error: {isError}</Typography> )}
          </Dialog>
      );
  }

  const mockTask = {
    id: task.task_id || '', title: task.title || '', employeeId: task.employeeId || '', dateOfAppointment: task.dateOfAppointment || '', initiated: task.initiated || '', status: task.status || '', priority: task.priority || '', rating: task.rating || '', elapsed: task.elapsed || '',
    employee_name: task.employee_name || task.assignee?.name || '', designation: task.designation || task.assignee?.role || '', department: task.department || task.assignee?.department || '',
    claim_type: task.claim_type || '', country: task.country || '', city_town: task.city_town || '', visit_from: task.visit_from || '', visit_to: task.visit_to || '', duration: task.duration || '', nature_of_visit: task.nature_of_visit || '',
    order_no: task.order_no || 'No.F.Admn.I/PCR/2025/000029', order_date: task.order_date || '', cover_page_no: task.cover_page_no || '',
    process_id: task.process_id, task_id: task.task_id,
  };

  const averageRating = feedbacks.length > 0 ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1) : 0;
  const hasAnyFeedback = progressData.some(stepData => {
    const step = stepData.activity;
    return stepRatings[step] > 0 && stepComments[step].trim();
  });

  const handleSubmitAllFeedback = () => {
    const newFeedbacks = [];
    progressData.forEach(stepData => {
      const step = stepData.activity;
      if (stepRatings[step] > 0 && stepComments[step].trim()) {
        newFeedbacks.push({
          id: feedbacks.length + newFeedbacks.length + 1,
          step: step,
          user: 'Current User',
          rating: stepRatings[step],
          comment: stepComments[step],
          date: new Date().toISOString().split('T')[0]
        });
        setStepRatings(prev => ({ ...prev, [step]: 0 }));
        setStepComments(prev => ({ ...prev, [step]: '' }));
      }
    });
    if (newFeedbacks.length > 0) {
      setFeedbacks(prev => [...prev, ...newFeedbacks]);
    }
  };
  
  // ----------------------------------------------------
  // Function to handle PDF preview logic
  // ----------------------------------------------------
  const handleViewPDF = async (order_no, templatetype) => {
    setPdfUrl(null); setPdfType(null); setGenerating(true); setIsPdfDialogOpen(true);
    try {
      if (!order_no) throw new Error("Order number is missing.");
      const url = await fetchPDFDocument(order_no, templatetype);
      setPdfUrl(url);
      setPdfType(templatetype === "officecopy" ? "Official Copy" : "User Copy");
    } catch (err) {
      // This Swal call will now show the more informative error message from cryptoApi.js
      Swal.fire({ icon: "error", title: "PDF Error", text: err.userMessage || err.message || "Failed to load PDF. Check console for details." });
      setIsPdfDialogOpen(false); 
    } finally {
      setGenerating(false);
    }
  };
  // ----------------------------------------------------


  return (
    <Dialog
      open={open} onClose={onClose} maxWidth={false}
      PaperProps={{
        sx: { width: '1300px', height: '800px', maxWidth: '100vw', maxHeight: '90vh', borderRadius: 3, boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white', }
      }}
      TransitionComponent={Fade} TransitionProps={{ timeout: 400 }}
    >
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #9ECFD4 0%, #70B2B2 100%)', p: 3, position: 'relative', overflow: 'hidden', flexShrink: 0, }}>
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'black', fontWeight: 600, letterSpacing: '1px', fontSize: '0.65rem' }}> {mockTask.order_no ? 'Ref No:' : 'TASK #'}{mockTask.order_no || mockTask.id} </Typography>
              <Typography variant="h5" sx={{ color: 'black', fontWeight: 800, mt: 0.5, fontSize: '1.4rem' }}> {mockTask.title} </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getStatusChip(mockTask.status)}
              <IconButton onClick={onClose} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36, '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)', transform: 'rotate(90deg)', transition: 'all 0.3s' } }}><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ minHeight: 52, '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', background: 'linear-gradient(90deg, #9ECFD4 0%, #70B2B2 100%)', }, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280', minHeight: 52, px: 3, minWidth: 'auto', transition: 'all 0.2s', '&.Mui-selected': { color: '#016B61', fontWeight: 700, }, '&:hover': { color: '#016B61', backgroundColor: 'rgba(102, 126, 234, 0.04)', } } }}>
          <Tab label="Overview" value="overview" /> <Tab label="Documents" value="documents" /> 
          <Tab label="Activity" value="activity" /> <Tab label="Feedback" value="feedback" />
        </Tabs>
        <Stack direction="row" spacing={1}>
            {/* PREVIEW BUTTON */}
            {mockTask.order_no && mockTask.status === 'complete' && mockTask.process_id === 1 && (
                <Button variant="outlined" startIcon={generating ? null : <VisibilityIcon />} onClick={() => handleViewPDF(mockTask.order_no, "officecopy")} disabled={generating} 
                    sx={{ color: '#016B61', borderColor: '#016B61', '&:hover': { borderColor: '#016B61', backgroundColor: 'rgba(1, 107, 97, 0.05)', }, textTransform: 'none', fontWeight: 700, borderRadius: 5, fontSize: '0.7rem', px: 3, py: 1, transition: 'all 0.2s', }} >
                  {generating ? <FancyCircularLoader size={20} strokeWidth={3} /> : "View Office Order"}
                </Button>
            )}
        </Stack>
      </Box>

      {/* Content Area */}
      <DialogContent sx={{ p: 0, backgroundColor: '#f9fafb', flexGrow: 1, overflowY: 'auto', position: 'relative', height: 0, }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 150, background: 'linear-gradient(180deg, rgba(102,126,234,0.04) 0%, transparent 100%)', pointerEvents: 'none' }} />

        {activeTab === 'overview' && (
          <Box sx={{ p: 3, position: 'relative' }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <GlassCard gradient>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ width: 42, height: 42, borderRadius: 2, background: 'linear-gradient(135deg, #9ECFD4 0%, #70B2B2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PersonIcon sx={{ color: 'white', fontSize: 24 }} /></Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>Employee Information</Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Employee ID" value={mockTask.employeeId} icon={PersonIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Name" value={mockTask.employee_name} icon={PersonIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Department" value={mockTask.department} icon={LocationIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Designation" value={mockTask.designation} icon={VerifiedIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><InfoItem label="Date of Appointment" value={mockTask.dateOfAppointment} icon={ScheduleIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><InfoItem label="Initiated On" value={mockTask.initiated} icon={ScheduleIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><InfoItem label="Rating" value={mockTask.rating} isRating icon={StarIcon} /></Grid>
                    </Grid>
                  </CardContent>
                </GlassCard>
              </Grid>
              <Grid item xs={12}>
                <GlassCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ width: 42, height: 42, borderRadius: 2, background: 'linear-gradient(135deg, #9ECFD4 0%, #70B2B2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LocationIcon sx={{ color: 'white', fontSize: 24 }} /></Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>Travel/Visit Details</Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Claim Type" value={mockTask.claim_type} icon={DocumentIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Nature of Visit" value={mockTask.nature_of_visit} icon={DocumentIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Country" value={mockTask.country} icon={LocationIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="City/Town" value={mockTask.city_town} icon={LocationIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Visit From" value={mockTask.visit_from} icon={ScheduleIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Visit To" value={mockTask.visit_to} icon={ScheduleIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Duration (Days)" value={mockTask.duration} icon={SpeedIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Order No" value={mockTask.order_no} icon={VerifiedIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Order Date" value={mockTask.order_date} icon={ScheduleIcon} /></Grid>
                      <Grid item xs={12} sm={6} md={3}><InfoItem label="Cover Page No" value={mockTask.cover_page_no} icon={DocumentIcon} /></Grid>
                    </Grid>
                  </CardContent>
                </GlassCard>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 'documents' && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              {documents.map((doc, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <GlassCard sx={{ transition: 'all 0.3s', cursor: 'pointer', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><DocumentIcon sx={{ color: 'white', fontSize: 24 }} /></Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, fontSize: '0.9rem' }}>{doc.name}</Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.25, fontSize: '0.75rem' }}>{doc.type} • {doc.size}</Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>Uploaded {doc.uploaded}</Typography>
                        </Box>
                        <IconButton sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', width: 36, height: 36, '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', } }}>
                          <DownloadIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeTab === 'activity' && (
          <Box sx={{ p: 3 }}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: 2, background: 'linear-gradient(135deg, #9ECFD4 0%, #70B2B2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChatIcon sx={{ color: 'white', fontSize: 24 }} /></Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>Comments & Activity</Typography>
                </Box>
                <CommentsHistory
                    taskId={mockTask.task_id} processId={mockTask.process_id} sessionId={getSessionId()}
                    roleColors={customRoleColors} headerColor="#016B61" title="Task Approval History" onRefresh={() => {}}
                />
              </CardContent>
            </GlassCard>
          </Box>
        )}

        {activeTab === 'feedback' && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', mb: 3, fontSize: '1rem' }}>Add Your Feedback per Step</Typography>
                <Grid container spacing={2.5}>
                  {progressData.map((stepData, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <GlassCard sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '0.9rem' }}>{stepData.activity}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>{stepData.status}</Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>Your Rating</Typography>
                            <Rating
                              value={stepRatings[stepData.activity]}
                              onChange={(event, newValue) => setStepRatings(prev => ({ ...prev, [stepData.activity]: newValue }))}
                              size="large"
                              sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }}
                            />
                          </Box>
                          <TextField fullWidth multiline rows={3} placeholder={`Share your experience for ${stepData.activity}`}
                            value={stepComments[stepData.activity]}
                            onChange={(e) => setStepComments(prev => ({ ...prev, [stepData.activity]: e.target.value }))}
                            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc', '&:hover': { backgroundColor: '#f1f5f9' }, '&.Mui-focused': { backgroundColor: 'white' } } }}
                          />
                        </CardContent>
                      </GlassCard>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button onClick={handleSubmitAllFeedback} disabled={!hasAnyFeedback} 
                    sx={{ background: 'linear-gradient(135deg, #9ECFD4 0%, #70B2B2 100%)', '&:hover': { background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)', transform: 'translateY(-1px)', boxShadow: '0 6px 16px rgba(102,126,234,0.3)' }, '&:disabled': { background: '#e2e8f0', color: '#94a3b8' }, textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 4, py: 1.5, transition: 'all 0.2s' }} >
                    Submit Feedback
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <GlassCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ width: 42, height: 42, borderRadius: 2, background: 'linear-gradient(135deg, #9ECFD4 0%, #70B2B2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><StarIcon sx={{ color: 'white', fontSize: 24 }} /></Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>Feedback History</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>Average Rating: <Rating value={parseFloat(averageRating)} readOnly size="small" /> {averageRating}/5</Typography>
                      </Box>
                    </Box>
                     {/* Feedback Table */}
                      {feedbacks.length > 0 ? (
                      <TableContainer sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                              <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.7rem', letterSpacing: '0.5px', py: 2 }}>STEP</TableCell>
                              <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.7rem', letterSpacing: '0.5px', py: 2 }}>USER</TableCell>
                              <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.7rem', letterSpacing: '0.5px', py: 2 }}>RATING</TableCell>
                              <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.7rem', letterSpacing: '0.5px', py: 2 }}>COMMENT</TableCell>
                              <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.7rem', letterSpacing: '0.5px', py: 2 }}>DATE</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {feedbacks.map((fb, index) => (
                              <TableRow key={fb.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc', '&:hover': { backgroundColor: '#f1f5f9', transition: 'all 0.2s' } }}>
                                <TableCell sx={{ py: 2.5, fontWeight: 600, color: '#334155', fontSize: '0.8rem' }}>{fb.step}</TableCell>
                                <TableCell sx={{ py: 2.5, fontWeight: 600, color: '#334155', fontSize: '0.8rem' }}>{fb.user}</TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                  <Rating value={fb.rating} readOnly size="small" />
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', ml: 0.5, display: 'inline' }}>{fb.rating}/5</Typography>
                                </TableCell>
                                <TableCell sx={{ py: 2.5, color: '#64748b', fontSize: '0.8rem' }}>{fb.comment}</TableCell>
                                <TableCell sx={{ py: 2.5, fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>{fb.date}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', py: 4 }}>
                        No feedbacks yet. Be the first to share!
                      </Typography>
                    )}
                  </CardContent>
                </GlassCard>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <PDFPreviewDialog open={isPdfDialogOpen} onClose={() => setIsPdfDialogOpen(false)} pdfUrl={pdfUrl} pdfType={pdfType} isLoading={generating} />
    </Dialog>
  );
};

export default TaskDialog;