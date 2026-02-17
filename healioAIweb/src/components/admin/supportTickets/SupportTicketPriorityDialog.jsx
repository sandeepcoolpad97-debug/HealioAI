import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    CircularProgress,
    Typography,
    Box,
} from '@mui/material';
import { updateTicketPriority } from '../../../store/slices/supportTicketsSlice';

export default function SupportTicketPriorityDialog({ open, ticketId, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const { selectedTicket, loading, error } = useSelector((state) => state.supportTickets);
    const [priority, setPriority] = useState(selectedTicket?.priority || 'medium');

    const handleSubmit = async () => {
        if (!ticketId) return;

        try {
            await dispatch(updateTicketPriority({
                id: ticketId,
                priority,
                performedByRole: 'Admin',
                performedById: localStorage.getItem('adminId') || '507f1f77bcf86cd799439099',
            })).unwrap();
            onSuccess();
            onClose();
        } catch (err) {
            // Error handled by Redux
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Update Ticket Priority</Typography>
                <Typography variant="caption" color="text.secondary">
                    Change the priority level of this ticket
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <FormControl component="fieldset">
                    <FormLabel component="legend">Select Priority</FormLabel>
                    <RadioGroup value={priority} onChange={(e) => setPriority(e.target.value)} sx={{ mt: 1 }}>
                        <FormControlLabel value="low" control={<Radio />} label="Low" />
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                        <FormControlLabel value="high" control={<Radio />} label="High" />
                        <FormControlLabel value="urgent" control={<Radio />} label="Urgent" />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={onClose} disabled={loading} color="inherit" sx={{ '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.38)' } }}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ '&.Mui-disabled': { background: 'rgba(0, 0, 0, 0.12)', color: 'rgba(0, 0, 0, 0.26)' } }}>
                    {loading ? <CircularProgress size={20} /> : 'Update Priority'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
