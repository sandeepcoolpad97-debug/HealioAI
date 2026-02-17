import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Grid,
} from '@mui/material';
import { fetchTicketHistory } from '../../../store/slices/supportTicketHistorySlice';
import TicketHistoryTimeline from './TicketHistoryTimeline';

const statusChip = (status) => {
    const statusMap = {
        open: { label: 'Open', color: 'info' },
        in_progress: { label: 'In Progress', color: 'warning' },
        closed: { label: 'Closed', color: 'success' },
    };
    const config = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} variant="outlined" size="small" />;
};

const priorityChip = (priority) => {
    const priorityMap = {
        low: { label: 'Low', color: 'default' },
        medium: { label: 'Medium', color: 'info' },
        high: { label: 'High', color: 'warning' },
        urgent: { label: 'Urgent', color: 'error' },
    };
    const config = priorityMap[priority] || { label: priority, color: 'default' };
    return <Chip label={config.label} color={config.color} variant="filled" size="small" />;
};

export default function SupportTicketViewDialog({ open, onClose }) {
    const dispatch = useDispatch();
    const { selectedTicket, loading, error } = useSelector((state) => state.supportTickets);
    const { history, historyLoading } = useSelector((state) => state.supportTicketHistory);

    useEffect(() => {
        if (open && selectedTicket?._id) {
            dispatch(fetchTicketHistory(selectedTicket._id));
        }
    }, [open, selectedTicket, dispatch]);

    if (!selectedTicket) return null;

    const raisedBy =
        selectedTicket.raisedById && typeof selectedTicket.raisedById === 'object'
            ? selectedTicket.raisedById
            : null;

    const raisedByName =
        (raisedBy &&
            (raisedBy.name ||
                raisedBy.clinicName ||
                raisedBy.labName ||
                raisedBy.doctorName)) ||
        '—';

    const raisedByEmail =
        (raisedBy && (raisedBy.email || raisedBy.emailId)) ||
        null;

    const assignee =
        selectedTicket.assignedToId && typeof selectedTicket.assignedToId === 'object'
            ? selectedTicket.assignedToId
            : null;

    const assigneeName =
        (assignee &&
            (assignee.name ||
                assignee.clinicName ||
                assignee.labName ||
                assignee.doctorName)) ||
        null;

    const assigneeEmail =
        (assignee && (assignee.email || assignee.emailId)) ||
        null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{
                pb: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>Ticket Details</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            View complete ticket information and history
                        </Typography>
                    </Box>
                    <Chip
                        label={selectedTicket.ticketId}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 'bold',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            fontSize: '0.875rem'
                        }}
                    />
                </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0, height: '70vh', display: 'flex' }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Box sx={{ width: '100%', p: 3 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {!loading && selectedTicket && (
                    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                        {/* Left Panel - Ticket Details */}
                        <Box sx={{
                            flex: '0 0 60%',
                            p: 3,
                            overflowY: 'auto',
                            borderRight: 1,
                            borderColor: 'divider'
                        }}>
                            {/* Status and Priority Row */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Box sx={{ flex: 1, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                    <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
                                        Status
                                    </Typography>
                                    {statusChip(selectedTicket.status)}
                                </Box>
                                <Box sx={{ flex: 1, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                    <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
                                        Priority
                                    </Typography>
                                    {priorityChip(selectedTicket.priority)}
                                </Box>
                            </Box>

                            {/* Main Content */}
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Subject
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                                    {selectedTicket.subject}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Description
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {selectedTicket.description}
                                </Typography>
                            </Box>

                            {/* Details Grid */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Category
                                        </Typography>
                                        <Typography variant="body2">
                                            {selectedTicket.category || '—'}
                                            {selectedTicket.subCategory && ` / ${selectedTicket.subCategory}`}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Raised By
                                        </Typography>
                                        <Typography variant="body2">
                                            {raisedByName}
                                        </Typography>
                                        {raisedByEmail && (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                {raisedByEmail}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                {assigneeName && (
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Assigned To
                                            </Typography>
                                            <Typography variant="body2">
                                                {assigneeName}
                                            </Typography>
                                            {assigneeEmail && (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                    {assigneeEmail}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                )}

                                <Grid item xs={12} md={assigneeName ? 6 : 12}>
                                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Timeline
                                        </Typography>
                                        <Typography variant="body2" display="block" sx={{ fontSize: '0.75rem' }}>
                                            Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" display="block" sx={{ fontSize: '0.75rem' }}>
                                            Last Updated: {new Date(selectedTicket.lastUpdatedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Right Panel - History Timeline */}
                        <Box sx={{
                            flex: '0 0 40%',
                            bgcolor: 'background.default',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box component="span" sx={{ width: 3, height: 20, bgcolor: 'primary.main', borderRadius: 1 }} />
                                    Ticket History
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                                {historyLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <CircularProgress size={32} />
                                    </Box>
                                ) : (
                                    <TicketHistoryTimeline history={history} />
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
