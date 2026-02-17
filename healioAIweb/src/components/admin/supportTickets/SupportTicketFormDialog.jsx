import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Box,
    Grid,
    Typography,
    Autocomplete,
} from '@mui/material';
import { createSupportTicket, updateSupportTicket } from '../../../store/slices/supportTicketsSlice';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchClinics } from '../../../store/slices/clinicsSlice';
import { fetchLabs } from '../../../store/slices/labsSlice';

export default function SupportTicketFormDialog({ open, onClose, onSuccess, mode, ticketId }) {
    const dispatch = useDispatch();
    const { selectedTicket, loading, error } = useSelector((state) => state.supportTickets);
    const { list: users } = useSelector((state) => state.users);
    const { list: clinics } = useSelector((state) => state.clinics);
    const { list: labs } = useSelector((state) => state.labs);

    const [formData, setFormData] = useState({
        raisedByRole: 'User',
        raisedById: '',
        subject: '',
        description: '',
        category: '',
        subCategory: '',
        priority: 'medium',
    });

    const [selectedEntity, setSelectedEntity] = useState(null);

    // Fetch data when dialog opens
    useEffect(() => {
        if (open) {
            dispatch(fetchUsers({ page: 1, limit: 100 }));
            dispatch(fetchClinics({ page: 1, limit: 100 }));
            dispatch(fetchLabs({ page: 1, limit: 100 }));
        }
    }, [open, dispatch]);

    useEffect(() => {
        if (mode === 'edit' && selectedTicket) {
            setFormData({
                raisedByRole: selectedTicket.raisedByRole || 'User',
                raisedById: selectedTicket.raisedById?._id || selectedTicket.raisedById || '',
                subject: selectedTicket.subject || '',
                description: selectedTicket.description || '',
                category: selectedTicket.category || '',
                subCategory: selectedTicket.subCategory || '',
                priority: selectedTicket.priority || 'medium',
            });

            // Set selected entity for edit mode
            if (selectedTicket.raisedById && typeof selectedTicket.raisedById === 'object') {
                setSelectedEntity(selectedTicket.raisedById);
            }
        }
    }, [mode, selectedTicket]);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData({ ...formData, [field]: value });

        // Reset selected entity when role changes
        if (field === 'raisedByRole') {
            setSelectedEntity(null);
            setFormData({ ...formData, [field]: value, raisedById: '' });
        }
    };

    const handleEntityChange = (event, newValue) => {
        setSelectedEntity(newValue);
        setFormData({ ...formData, raisedById: newValue?._id || '' });
    };

    const handleSubmit = async () => {
        try {
            if (mode === 'create') {
                await dispatch(createSupportTicket(formData)).unwrap();
            } else {
                await dispatch(updateSupportTicket({ id: ticketId, payload: formData })).unwrap();
            }
            onSuccess();
            setFormData({
                raisedByRole: 'User',
                raisedById: '',
                subject: '',
                description: '',
                category: '',
                subCategory: '',
                priority: 'medium',
            });
            setSelectedEntity(null);
        } catch (err) {
            // Error handled by Redux
        }
    };

    const isValid =
        formData.raisedById &&
        formData.subject &&
        formData.description &&
        formData.category &&
        formData.subCategory;

    // Get the appropriate list based on role
    const getEntityList = () => {
        switch (formData.raisedByRole) {
            case 'User':
                return users;
            case 'Clinic':
                return clinics;
            case 'Lab':
                return labs;
            case 'Admin':
                return []; // Admins don't need selection
            default:
                return [];
        }
    };

    const getEntityLabel = (entity) => {
        if (!entity) return '';
        const name = entity.name || entity.clinicName || entity.labName || '';
        const email = entity.email || entity.emailId || '';

        // Handle phone - it might be an object with {countryCode, number, verified}
        let phone = '';
        if (entity.phone) {
            if (typeof entity.phone === 'object' && entity.phone.number) {
                phone = entity.phone.countryCode
                    ? `${entity.phone.countryCode} ${entity.phone.number}`
                    : entity.phone.number;
            } else if (typeof entity.phone === 'string') {
                phone = entity.phone;
            }
        } else if (entity.phoneNumber) {
            if (typeof entity.phoneNumber === 'object' && entity.phoneNumber.number) {
                phone = entity.phoneNumber.countryCode
                    ? `${entity.phoneNumber.countryCode} ${entity.phoneNumber.number}`
                    : entity.phoneNumber.number;
            } else if (typeof entity.phoneNumber === 'string') {
                phone = entity.phoneNumber;
            }
        }

        // Build display string with available info
        let display = name;
        if (email) display += ` (${email})`;
        if (phone) display += ` - ${phone}`;

        return display || 'Unknown';
    };

    const renderEntityOption = (props, entity) => {
        const name = entity.name || entity.clinicName || entity.labName || 'Unknown';
        const email = entity.email || entity.emailId || '';

        // Handle phone - it might be an object with {countryCode, number, verified}
        let phone = '';
        if (entity.phone) {
            if (typeof entity.phone === 'object' && entity.phone.number) {
                phone = entity.phone.countryCode
                    ? `${entity.phone.countryCode} ${entity.phone.number}`
                    : entity.phone.number;
            } else if (typeof entity.phone === 'string') {
                phone = entity.phone;
            }
        } else if (entity.phoneNumber) {
            if (typeof entity.phoneNumber === 'object' && entity.phoneNumber.number) {
                phone = entity.phoneNumber.countryCode
                    ? `${entity.phoneNumber.countryCode} ${entity.phoneNumber.number}`
                    : entity.phoneNumber.number;
            } else if (typeof entity.phoneNumber === 'string') {
                phone = entity.phoneNumber;
            }
        }

        return (
            <Box component="li" {...props}>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {name}
                    </Typography>
                    {email && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            Email: {email}
                        </Typography>
                    )}
                    {phone && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            Phone: {phone}
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                pb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
            }}>
                <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 600 }}>
                    {mode === 'create' ? 'Create Support Ticket' : 'Edit Support Ticket'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 0.5 }}>
                    {mode === 'create' ? 'Fill in the details to create a new support ticket' : 'Update ticket information'}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box component="form" noValidate>
                    {/* Raised By Section */}
                    <Typography variant="body1" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                        Raised By Information
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Role *</InputLabel>
                                <Select
                                    value={formData.raisedByRole}
                                    label="Role *"
                                    onChange={handleChange('raisedByRole')}
                                >
                                    <MenuItem value="User">User</MenuItem>
                                    <MenuItem value="Clinic">Clinic</MenuItem>
                                    <MenuItem value="Lab">Lab</MenuItem>
                                    <MenuItem value="Admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            {formData.raisedByRole === 'Admin' ? (
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Admin ID *"
                                    value={formData.raisedById}
                                    onChange={handleChange('raisedById')}
                                    placeholder="Enter Admin ID"
                                    required
                                />
                            ) : (
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={getEntityList()}
                                    getOptionLabel={(entity) => entity.name || entity.clinicName || entity.labName || ''}
                                    value={selectedEntity}
                                    onChange={handleEntityChange}
                                    renderOption={renderEntityOption}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={`Select ${formData.raisedByRole} *`}
                                            placeholder={`Choose a ${formData.raisedByRole.toLowerCase()}`}
                                            required
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                />
                            )}
                        </Grid>

                        {/* Display selected entity details */}
                        {selectedEntity && formData.raisedByRole !== 'Admin' && (
                            <Grid item xs={12}>
                                <Box sx={{
                                    p: 2,
                                    bgcolor: 'background.default',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Selected {formData.raisedByRole} Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {(() => {
                                            const email = selectedEntity.email || selectedEntity.emailId || '';
                                            let phone = '';
                                            if (selectedEntity.phone) {
                                                if (typeof selectedEntity.phone === 'object' && selectedEntity.phone.number) {
                                                    phone = selectedEntity.phone.countryCode
                                                        ? `${selectedEntity.phone.countryCode} ${selectedEntity.phone.number}`
                                                        : selectedEntity.phone.number;
                                                } else if (typeof selectedEntity.phone === 'string') {
                                                    phone = selectedEntity.phone;
                                                }
                                            } else if (selectedEntity.phoneNumber) {
                                                if (typeof selectedEntity.phoneNumber === 'object' && selectedEntity.phoneNumber.number) {
                                                    phone = selectedEntity.phoneNumber.countryCode
                                                        ? `${selectedEntity.phoneNumber.countryCode} ${selectedEntity.phoneNumber.number}`
                                                        : selectedEntity.phoneNumber.number;
                                                } else if (typeof selectedEntity.phoneNumber === 'string') {
                                                    phone = selectedEntity.phoneNumber;
                                                }
                                            }

                                            return (
                                                <>
                                                    {email && (
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                Email
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {email}
                                                            </Typography>
                                                        </Grid>
                                                    )}
                                                    {phone && (
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                Phone
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {phone}
                                                            </Typography>
                                                        </Grid>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </Grid>
                                </Box>
                            </Grid>
                        )}
                    </Grid>

                    {/* Classification - First Row with 3 equal columns */}
                    <Typography variant="body1" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                        Classification
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Category *"
                                value={formData.category}
                                onChange={handleChange('category')}
                                placeholder="e.g., Technical, Payments"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Sub-Category *"
                                value={formData.subCategory}
                                onChange={handleChange('subCategory')}
                                placeholder="e.g., Booking Issues"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={formData.priority}
                                    label="Priority"
                                    onChange={handleChange('priority')}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                    <MenuItem value="urgent">Urgent</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Ticket Details - Subject and Description full width */}
                    <Typography variant="body1" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                        Ticket Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Subject *"
                                value={formData.subject}
                                onChange={handleChange('subject')}
                                placeholder="Brief description of the issue"
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description *"
                                value={formData.description}
                                onChange={handleChange('description')}
                                multiline
                                rows={4}
                                placeholder="Detailed explanation of the issue"
                                required
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', bgcolor: '#fafafa' }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    color="inherit"
                    sx={{
                        textTransform: 'none',
                        '&.Mui-disabled': {
                            color: 'rgba(0, 0, 0, 0.38)',
                            bgcolor: 'rgba(0, 0, 0, 0.12)',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !isValid}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                    sx={{
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        minWidth: 140,
                        '&.Mui-disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)',
                        }
                    }}
                >
                    {mode === 'create' ? 'Create Ticket' : 'Update Ticket'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
