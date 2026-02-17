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
} from '@mui/material';
import { updateTicketStatus } from '../../../store/slices/supportTicketsSlice';

export default function SupportTicketStatusDialog({ open, ticketId, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const { selectedTicket, loading, error } = useSelector((state) => state.supportTickets);
    const [status, setStatus] = useState(selectedTicket?.status || 'open');

    const handleSubmit = async () => {
        if (!ticketId) return;

        try {
            await dispatch(updateTicketStatus({
                id: ticketId,
                status,
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
            <DialogTitle>Update Ticket Status</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Select Status</FormLabel>
                    <RadioGroup value={status} onChange={(e) => setStatus(e.target.value)}>
                        <FormControlLabel value="open" control={<Radio />} label="Open" />
                        <FormControlLabel value="in_progress" control={<Radio />} label="In Progress" />
                        <FormControlLabel value="closed" control={<Radio />} label="Closed" />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} sx={{ '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.38)' } }}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ '&.Mui-disabled': { background: 'rgba(0, 0, 0, 0.12)', color: 'rgba(0, 0, 0, 0.26)' } }}>
                    {loading ? <CircularProgress size={24} /> : 'Update Status'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
