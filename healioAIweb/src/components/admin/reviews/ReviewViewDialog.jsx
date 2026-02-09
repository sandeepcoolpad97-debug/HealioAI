import { useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    CircularProgress,
    Grid,
    Rating,
} from '@mui/material';

const getUserName = (review) => review?.userId?.name ?? review?.userId ?? '—';
const getAppointmentInfo = (review) => {
    if (!review?.appointmentId) return '—';
    const apt = review.appointmentId;
    if (typeof apt === 'object' && apt.appointmentDate) {
        return `${new Date(apt.appointmentDate).toLocaleDateString()} (${apt.status || '—'})`;
    }
    return apt;
};

export default function ReviewViewDialog({ open, onClose }) {
    const { selectedReview, loading } = useSelector((state) => state.reviews);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                }}
            >
                Review details
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : selectedReview ? (
                    <Box sx={{ pt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="User"
                                    value={getUserName(selectedReview)}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Appointment"
                                    value={getAppointmentInfo(selectedReview)}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Review For"
                                    value={selectedReview.reviewFor ?? '—'}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box>
                                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>Rating</Box>
                                    <Rating value={selectedReview.rating ?? 0} readOnly />
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Comment"
                                    value={selectedReview.comment?.trim() || '—'}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Active Status"
                                    value={selectedReview.isActive !== false ? 'Active' : 'Inactive'}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Box sx={{ py: 2, color: 'text.secondary' }}>No review selected.</Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
