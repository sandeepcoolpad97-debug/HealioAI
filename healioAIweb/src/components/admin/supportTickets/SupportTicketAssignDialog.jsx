import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Alert,
    CircularProgress,
    Box,
    Typography,
} from '@mui/material';
import { assignTicket } from '../../../store/slices/supportTicketsSlice';

export default function SupportTicketAssignDialog({ open, ticketId, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.supportTickets);
    const [assignedToRole, setAssignedToRole] = useState('SupportAgent');
    const [assignedToId, setAssignedToId] = useState('');

    const handleSubmit = async () => {
        if (!ticketId || !assignedToId) return;

        try {
            await dispatch(assignTicket({
                id: ticketId,
                assignedToRole,
                assignedToId,
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
                <Typography variant="h6">Assign Ticket</Typography>
                <Typography variant="caption" color="text.secondary">
                    Assign this ticket to an admin or support agent
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Assign To Role</InputLabel>
                        <Select
                            value={assignedToRole}
                            label="Assign To Role"
                            onChange={(e) => setAssignedToRole(e.target.value)}
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="SupportAgent">Support Agent</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        size="small"
                        label="Assignee ID *"
                        value={assignedToId}
                        onChange={(e) => setAssignedToId(e.target.value)}
                        placeholder="Enter MongoDB ObjectId"
                        helperText="Enter the MongoDB ID of the admin or support agent"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={onClose} disabled={loading} color="inherit" sx={{ '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.38)' } }}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading || !assignedToId} sx={{ '&.Mui-disabled': { background: 'rgba(0, 0, 0, 0.12)', color: 'rgba(0, 0, 0, 0.26)' } }}>
                    {loading ? <CircularProgress size={20} /> : 'Assign'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
