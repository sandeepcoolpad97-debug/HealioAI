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
    Chip,
    IconButton,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { createSupportTicket, updateSupportTicket } from '../../../store/slices/supportTicketsSlice';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { fetchClinics } from '../../../store/slices/clinicsSlice';
import { fetchLabs } from '../../../store/slices/labsSlice';
import { uploadMedia, deleteMedia } from '../../../store/slices/mediaSlice';

export default function SupportTicketFormDialog({ open, onClose, onSuccess, mode, ticketId }) {
    const dispatch = useDispatch();
    const { selectedTicket, loading, error } = useSelector((state) => state.supportTickets);
    const { list: users } = useSelector((state) => state.users);
    const { list: clinics } = useSelector((state) => state.clinics);
    const { list: labs } = useSelector((state) => state.labs);
    const { loading: mediaLoading } = useSelector((state) => state.media);

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
    const [attachments, setAttachments] = useState([]);
    const [uploadedMediaIds, setUploadedMediaIds] = useState([]);

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

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);

        for (const file of files) {
            try {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);
                formDataUpload.append('folder', 'support-tickets');
                formDataUpload.append('ownerType', 'SupportTicket');

                const result = await dispatch(uploadMedia(formDataUpload)).unwrap();

                setUploadedMediaIds(prev => [...prev, result._id]);
                setAttachments(prev => [...prev, {
                    file,
                    mediaId: result._id,
                    url: result.secureUrl || result.url,
                    resourceType: result.resourceType,
                    originalFilename: result.originalFilename || file.name
                }]);
            } catch (error) {
                console.error('Failed to upload file:', error);
            }
        }

        // Reset file input
        event.target.value = '';
    };

    const handleRemoveAttachment = async (index) => {
        const attachment = attachments[index];
        try {
            await dispatch(deleteMedia(attachment.mediaId)).unwrap();
            setAttachments(prev => prev.filter((_, i) => i !== index));
            setUploadedMediaIds(prev => prev.filter(id => id !== attachment.mediaId));
        } catch (error) {
            console.error('Failed to delete attachment:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                attachments: uploadedMediaIds
            };

            if (mode === 'create') {
                await dispatch(createSupportTicket(payload)).unwrap();
            } else {
                await dispatch(updateSupportTicket({ id: ticketId, payload })).unwrap();
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
            setAttachments([]);
            setUploadedMediaIds([]);
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
                        <Grid size={3}>
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

                        <Grid size={4}>
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
                            <Grid size={4}>
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
                        <Grid size={4}>
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

                        <Grid size={4}>
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

                        <Grid size={4}>
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
                        <Grid size={12}>
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

                        <Grid size={12}>
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

                    {/* Attachments Section */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body1" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                            Attachments (Optional)
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<AttachFileIcon />}
                            disabled={mediaLoading}
                        >
                            {mediaLoading ? 'Uploading...' : 'Upload Files'}
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*,application/pdf,.doc,.docx"
                                onChange={handleFileChange}
                            />
                        </Button>

                        {attachments.length > 0 && (
                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {attachments.map((attachment, index) => {
                                    const isImage = attachment.resourceType === 'image' || attachment.file.type.startsWith('image/');
                                    const isPdf = attachment.file.type === 'application/pdf';

                                    return (
                                        <Chip
                                            key={index}
                                            icon={isImage ? <ImageIcon /> : isPdf ? <PictureAsPdfIcon /> : <AttachFileIcon />}
                                            label={attachment.originalFilename || attachment.file.name}
                                            onDelete={() => handleRemoveAttachment(index)}
                                            deleteIcon={<CloseIcon />}
                                            sx={{ maxWidth: 250 }}
                                        />
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
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
