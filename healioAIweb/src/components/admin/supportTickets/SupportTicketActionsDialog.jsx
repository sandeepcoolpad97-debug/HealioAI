import { useState, useEffect } from 'react';
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
    Tabs,
    Tab,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Chip,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FlagIcon from '@mui/icons-material/Flag';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
    assignTicket,
    updateTicketStatus,
    updateTicketPriority,
} from '../../../store/slices/supportTicketsSlice';

function TabPanel({ children, value, index }) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            sx={{ pt: 3 }}
        >
            {value === index && children}
        </Box>
    );
}

export default function SupportTicketActionsDialog({ open, ticketId, initialTab = 0, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const { selectedTicket, loading, error } = useSelector((state) => state.supportTickets);

    const [activeTab, setActiveTab] = useState(initialTab);

    // Assign tab state
    const [assignedToRole, setAssignedToRole] = useState('SupportAgent');
    const [assignedToId, setAssignedToId] = useState('');

    // Status tab state
    const [status, setStatus] = useState('open');

    // Priority tab state
    const [priority, setPriority] = useState('medium');

    // Update state when selectedTicket changes
    useEffect(() => {
        if (selectedTicket) {
            setStatus(selectedTicket.status || 'open');
            setPriority(selectedTicket.priority || 'medium');
        }
    }, [selectedTicket]);

    // Update active tab when initialTab changes
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleAssign = async () => {
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
            handleClose();
        } catch (err) {
            // Error handled by Redux
        }
    };

    const handleStatusUpdate = async () => {
        if (!ticketId) return;

        try {
            await dispatch(updateTicketStatus({
                id: ticketId,
                status,
                performedByRole: 'Admin',
                performedById: localStorage.getItem('adminId') || '507f1f77bcf86cd799439099',
            })).unwrap();
            onSuccess();
            handleClose();
        } catch (err) {
            // Error handled by Redux
        }
    };

    const handlePriorityUpdate = async () => {
        if (!ticketId) return;

        try {
            await dispatch(updateTicketPriority({
                id: ticketId,
                priority,
                performedByRole: 'Admin',
                performedById: localStorage.getItem('adminId') || '507f1f77bcf86cd799439099',
            })).unwrap();
            onSuccess();
            handleClose();
        } catch (err) {
            // Error handled by Redux
        }
    };

    const handleClose = () => {
        // Reset form states
        setAssignedToRole('SupportAgent');
        setAssignedToId('');
        setStatus('open');
        setPriority('medium');
        onClose();
    };

    const handleSubmit = () => {
        switch (activeTab) {
            case 0:
                handleAssign();
                break;
            case 1:
                handleStatusUpdate();
                break;
            case 2:
                handlePriorityUpdate();
                break;
            default:
                break;
        }
    };

    const isSubmitDisabled = () => {
        if (loading) return true;
        if (activeTab === 0 && !assignedToId) return true;
        return false;
    };

    const getSubmitButtonText = () => {
        if (loading) return <CircularProgress size={20} />;
        switch (activeTab) {
            case 0:
                return 'Assign Ticket';
            case 1:
                return 'Update Status';
            case 2:
                return 'Update Priority';
            default:
                return 'Submit';
        }
    };

    const getPriorityColor = (priorityValue) => {
        const colors = {
            low: '#4caf50',
            medium: '#2196f3',
            high: '#ff9800',
            urgent: '#f44336',
        };
        return colors[priorityValue] || '#2196f3';
    };

    const getStatusColor = (statusValue) => {
        const colors = {
            open: '#2196f3',
            in_progress: '#ff9800',
            closed: '#4caf50',
        };
        return colors[statusValue] || '#2196f3';
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                }
            }}
        >
            <DialogTitle
                sx={{
                    pb: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Ticket Actions
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Manage ticket assignment, status, and priority
                </Typography>
            </DialogTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            minHeight: 64,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                        },
                        '& .Mui-selected': {
                            color: '#667eea',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#667eea',
                            height: 3,
                        },
                    }}
                >
                    <Tab
                        icon={<AssignmentIndIcon />}
                        label="Assign"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<SwapHorizIcon />}
                        label="Status"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<FlagIcon />}
                        label="Priority"
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            <DialogContent sx={{ pt: 0, minHeight: 280 }}>
                {error && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Assign Tab */}
                <TabPanel value={activeTab} index={0}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AssignmentIndIcon fontSize="small" />
                                Assign this ticket to a team member
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Box>

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
                </TabPanel>

                {/* Status Tab */}
                <TabPanel value={activeTab} index={1}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SwapHorizIcon fontSize="small" />
                            Update the current status of this ticket
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
                                Select Status
                            </FormLabel>
                            <RadioGroup
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                sx={{ gap: 1 }}
                            >
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '2px solid',
                                        borderColor: status === 'open' ? getStatusColor('open') : 'divider',
                                        bgcolor: status === 'open' ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <FormControlLabel
                                        value="open"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography>Open</Typography>
                                                <Chip label="New" size="small" color="info" variant="outlined" />
                                            </Box>
                                        }
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '2px solid',
                                        borderColor: status === 'in_progress' ? getStatusColor('in_progress') : 'divider',
                                        bgcolor: status === 'in_progress' ? 'rgba(255, 152, 0, 0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <FormControlLabel
                                        value="in_progress"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography>In Progress</Typography>
                                                <Chip label="Active" size="small" color="warning" variant="outlined" />
                                            </Box>
                                        }
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '2px solid',
                                        borderColor: status === 'closed' ? getStatusColor('closed') : 'divider',
                                        bgcolor: status === 'closed' ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <FormControlLabel
                                        value="closed"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography>Closed</Typography>
                                                <Chip label="Resolved" size="small" color="success" variant="outlined" />
                                            </Box>
                                        }
                                    />
                                </Box>
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </TabPanel>

                {/* Priority Tab */}
                <TabPanel value={activeTab} index={2}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FlagIcon fontSize="small" />
                            Set the priority level for this ticket
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
                                Select Priority
                            </FormLabel>
                            <RadioGroup
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                sx={{ gap: 1 }}
                            >
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '2px solid',
                                        borderColor: priority === 'low' ? getPriorityColor('low') : 'divider',
                                        bgcolor: priority === 'low' ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <FormControlLabel
                                        value="low"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography>Low</Typography>
                                                <Chip label="Can wait" size="small" sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)' }} />
                                            </Box>
                                        }
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '2px solid',
                                        borderColor: priority === 'medium' ? getPriorityColor('medium') : 'divider',
                                        bgcolor: priority === 'medium' ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <FormControlLabel
                                        value="medium"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography>Medium</Typography>
                                                <Chip label="Normal" size="small" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)' }} />
                                            </Box>
                                        }
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '2px solid',
                                        borderColor: priority === 'high' ? getPriorityColor('high') : 'divider',
                                        bgcolor: priority === 'high' ? 'rgba(255, 152, 0, 0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <FormControlLabel
                                        value="high"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography>High</Typography>
                                                <Chip label="Important" size="small" sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)' }} />
                                            </Box>
                                        }
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '2px solid',
                                        borderColor: priority === 'urgent' ? getPriorityColor('urgent') : 'divider',
                                        bgcolor: priority === 'urgent' ? 'rgba(244, 67, 54, 0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <FormControlLabel
                                        value="urgent"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography>Urgent</Typography>
                                                <Chip label="Critical" size="small" color="error" />
                                            </Box>
                                        }
                                    />
                                </Box>
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </TabPanel>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', bgcolor: '#fafafa' }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    color="inherit"
                    sx={{
                        textTransform: 'none',
                        '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.38)' }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitDisabled()}
                    sx={{
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        minWidth: 140,
                        '&.Mui-disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)'
                        }
                    }}
                >
                    {getSubmitButtonText()}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
