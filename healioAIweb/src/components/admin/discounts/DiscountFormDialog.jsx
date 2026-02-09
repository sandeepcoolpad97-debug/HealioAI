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
} from '@mui/material';
import { fetchDiscountById, createDiscount, updateDiscount, clearError } from '../../../store/slices/discountsSlice';
import { api } from '../../../api/client';

const ACTIVE_STATUSES = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
];

export default function DiscountFormDialog({ open, onClose, onSuccess, mode, discountId }) {
    const dispatch = useDispatch();
    const { selectedDiscount, loading, error } = useSelector((state) => state.discounts);
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        serviceId: '',
        rule: '{}',
        isActive: true,
    });

    const isEdit = mode === 'edit';

    useEffect(() => {
        if (!open) return;
        dispatch(clearError());
        if (isEdit && discountId) {
            dispatch(fetchDiscountById(discountId));
        } else {
            setForm({
                name: '',
                description: '',
                price: '',
                serviceId: '',
                rule: '{}',
                isActive: true,
            });
        }
    }, [open, isEdit, discountId, dispatch]);

    useEffect(() => {
        if (isEdit && selectedDiscount) {
            setForm({
                name: selectedDiscount.name ?? '',
                description: selectedDiscount.description ?? '',
                price: selectedDiscount.price ?? '',
                serviceId: typeof selectedDiscount.serviceId === 'object' ? selectedDiscount.serviceId?._id : selectedDiscount.serviceId ?? '',
                rule: selectedDiscount.rule ? JSON.stringify(selectedDiscount.rule, null, 2) : '{}',
                isActive: selectedDiscount.isActive !== false,
            });
        }
    }, [isEdit, selectedDiscount]);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const s = await api.get('/services?limit=100');
                setServices(Array.isArray(s?.data) ? s.data : []);
            } catch (_) { }
        })();
    }, [open]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const parseRule = () => {
        try {
            return JSON.parse(form.rule);
        } catch {
            return {};
        }
    };

    const buildPayload = () => {
        const p = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            serviceId: form.serviceId,
            rule: parseRule(),
        };
        if (isEdit) {
            p.isActive = form.isActive;
        }
        return p;
    };

    const handleSubmit = () => {
        const payload = buildPayload();
        if (isEdit && discountId) {
            dispatch(updateDiscount({ id: discountId, payload }))
                .unwrap()
                .then(() => onSuccess?.())
                .catch(() => { });
        } else {
            if (!payload.name || !payload.serviceId || payload.price === '' || isNaN(payload.price)) {
                return;
            }
            dispatch(createDiscount(payload))
                .unwrap()
                .then(() => onSuccess?.())
                .catch(() => { });
        }
    };

    const valid = form.name?.trim() && form.serviceId && form.price !== '' && !isNaN(Number(form.price));

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                backgroundColor: 'primary.main',
                color: 'white',
            }}>{isEdit ? 'Edit discount' : 'Create discount'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    {error && (
                        <Box sx={{ color: 'error.main', fontSize: '0.875rem', mb: 2 }}>{error}</Box>
                    )}
                    <Grid container spacing={2}>
                        {/* Row 1: Name & Price */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Name"
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Price (Discount Amount)"
                                type="number"
                                value={form.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                required
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        {/* Row 2: Description */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Description"
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Optional description"
                            />
                        </Grid>

                        {/* Row 3: Service & Active Status */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required>
                                <InputLabel>Service</InputLabel>
                                <Select
                                    value={form.serviceId}
                                    label="Service"
                                    onChange={(e) => handleChange('serviceId', e.target.value)}
                                >
                                    {services.map((s) => (
                                        <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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

                        {/* Row 4: Rule JSON */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Rule (JSON)"
                                value={form.rule}
                                onChange={(e) => handleChange('rule', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder='{"minAmount": 1000, "firstTimeUser": true}'
                                helperText="Enter valid JSON for discount rules"
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
