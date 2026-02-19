import { useEffect, useState } from 'react';
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
    Box,
    CircularProgress,
    Grid,
    Rating,
} from '@mui/material';
import { fetchReviewById, createReview, updateReview, clearError } from '../../../store/slices/reviewsSlice';
import { api } from '../../../api/client';

const REVIEW_FOR_OPTIONS = [
    { value: 'Clinic', label: 'Clinic' },
    { value: 'Lab', label: 'Lab' },
];

const ACTIVE_STATUSES = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
];

export default function ReviewFormDialog({ open, onClose, onSuccess, mode, reviewId }) {
    const dispatch = useDispatch();
    const { selectedReview, loading, error } = useSelector((state) => state.reviews);
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [labs, setLabs] = useState([]);
    const [form, setForm] = useState({
        appointmentId: '',
        userId: '',
        reviewFor: 'Clinic',
        reviewForId: '',
        rating: 5,
        comment: '',
        isActive: true,
    });

    const isEdit = mode === 'edit';

    useEffect(() => {
        if (!open) return;
        dispatch(clearError());
        if (isEdit && reviewId) {
            dispatch(fetchReviewById(reviewId));
        } else {
            setForm({
                appointmentId: '',
                userId: '',
                reviewFor: 'Clinic',
                reviewForId: '',
                rating: 5,
                comment: '',
                isActive: true,
            });
        }
    }, [open, isEdit, reviewId, dispatch]);

    useEffect(() => {
        if (isEdit && selectedReview) {
            setForm({
                appointmentId: typeof selectedReview.appointmentId === 'object' ? selectedReview.appointmentId._id : selectedReview.appointmentId ?? '',
                userId: typeof selectedReview.userId === 'object' ? selectedReview.userId._id : selectedReview.userId ?? '',
                reviewFor: selectedReview.reviewFor ?? 'Clinic',
                reviewForId: typeof selectedReview.reviewForId === 'object' ? selectedReview.reviewForId._id : selectedReview.reviewForId ?? '',
                rating: selectedReview.rating ?? 5,
                comment: selectedReview.comment ?? '',
                isActive: selectedReview.isActive !== false,
            });
        }
    }, [isEdit, selectedReview]);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const [a, u, c, l] = await Promise.all([
                    api.get('/appointments?limit=100'),
                    api.get('/users?limit=100'),
                    api.get('/clinics?limit=100'),
                    api.get('/labs?limit=100'),
                ]);
                setAppointments(Array.isArray(a?.data) ? a.data : []);
                setUsers(Array.isArray(u?.data) ? u.data : []);
                setClinics(Array.isArray(c?.data) ? c.data : []);
                setLabs(Array.isArray(l?.data) ? l.data : []);
            } catch (_) { }
        })();
    }, [open]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // Ensure selected items are in the options list for display
    const finalAppointments = [...appointments];
    if (isEdit && selectedReview?.appointmentId && typeof selectedReview.appointmentId === 'object') {
        if (!finalAppointments.find(a => a._id === selectedReview.appointmentId._id)) {
            finalAppointments.push(selectedReview.appointmentId);
        }
    }

    const finalUsers = [...users];
    if (isEdit && selectedReview?.userId && typeof selectedReview.userId === 'object') {
        if (!finalUsers.find(u => u._id === selectedReview.userId._id)) {
            finalUsers.push(selectedReview.userId);
        }
    }

    const baseOptions = form.reviewFor === 'Clinic' ? clinics : labs;
    const finalReviewForOptions = [...baseOptions];
    if (isEdit && selectedReview?.reviewForId && typeof selectedReview.reviewForId === 'object') {
        if (!finalReviewForOptions.find(o => o._id === selectedReview.reviewForId._id)) {
            finalReviewForOptions.push(selectedReview.reviewForId);
        }
    }

    const buildPayload = () => {
        const p = {
            rating: form.rating,
            comment: form.comment,
        };
        if (!isEdit) {
            p.appointmentId = form.appointmentId;
            p.userId = form.userId;
            p.reviewFor = form.reviewFor;
            p.reviewForId = form.reviewForId;
        }
        if (isEdit) {
            p.isActive = form.isActive;
        }
        return p;
    };

    const handleSubmit = () => {
        const payload = buildPayload();
        if (isEdit && reviewId) {
            dispatch(updateReview({ id: reviewId, payload }))
                .unwrap()
                .then(() => onSuccess?.())
                .catch(() => { });
        } else {
            if (!form.appointmentId || !form.userId || !form.reviewForId) return;
            dispatch(createReview(payload))
                .unwrap()
                .then(() => onSuccess?.())
                .catch(() => { });
        }
    };

    const valid = isEdit || (form.appointmentId && form.userId && form.reviewForId && form.rating >= 1 && form.rating <= 5);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                {isEdit ? 'Edit review' : 'Create review'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    {error && (
                        <Box sx={{ color: 'error.main', fontSize: '0.875rem', mb: 2 }}>{error}</Box>
                    )}
                    <Grid container spacing={2}>
                        {/* Row 1: Appointment & User */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required disabled={isEdit}>
                                <InputLabel>Appointment</InputLabel>
                                <Select
                                    value={form.appointmentId}
                                    label="Appointment"
                                    onChange={(e) => handleChange('appointmentId', e.target.value)}
                                >
                                    {finalAppointments.map((a) => (
                                        <MenuItem key={a._id} value={a._id}>
                                            {a.appointmentId || (a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : a._id)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required disabled={isEdit}>
                                <InputLabel>User</InputLabel>
                                <Select
                                    value={form.userId}
                                    label="User"
                                    onChange={(e) => handleChange('userId', e.target.value)}
                                >
                                    {finalUsers.map((u) => (
                                        <MenuItem key={u._id} value={u._id}>{u.name || u.email || u._id}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Row 2: Review For Type & Review For ID */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required disabled={isEdit}>
                                <InputLabel>Review For</InputLabel>
                                <Select
                                    value={form.reviewFor}
                                    label="Review For"
                                    onChange={(e) => {
                                        handleChange('reviewFor', e.target.value);
                                        handleChange('reviewForId', '');
                                    }}
                                >
                                    {REVIEW_FOR_OPTIONS.map((o) => (
                                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required disabled={isEdit}>
                                <InputLabel>{form.reviewFor}</InputLabel>
                                <Select
                                    value={form.reviewForId}
                                    label={form.reviewFor}
                                    onChange={(e) => handleChange('reviewForId', e.target.value)}
                                >
                                    {finalReviewForOptions.map((o) => (
                                        <MenuItem key={o._id} value={o._id}>
                                            {o.doctorName || o.clinicName || o.name || o._id}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Row 3: Rating & Active Status */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box>
                                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>Rating *</Box>
                                <Rating
                                    value={form.rating}
                                    onChange={(_, v) => handleChange('rating', v || 1)}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Active status</InputLabel>
                                <Select
                                    value={form.isActive === true ? 'true' : 'false'}
                                    label="Active status"
                                    onChange={(e) => handleChange('isActive', e.target.value === 'true')}
                                    disabled={!isEdit}
                                >
                                    {ACTIVE_STATUSES.map((a) => (
                                        <MenuItem key={String(a.value)} value={String(a.value)}>{a.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Row 4: Comment */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Comment"
                                value={form.comment}
                                onChange={(e) => handleChange('comment', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Optional comment"
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading || !valid}>
                    {loading ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
