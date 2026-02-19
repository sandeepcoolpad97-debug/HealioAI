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
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
    CircularProgress,
    Grid,
} from '@mui/material';
import { fetchAdminById, createAdmin, updateAdmin, clearError } from '../../../store/slices/adminsSlice';
import { api } from '../../../api/client';

const GENDERS = ['male', 'female', 'other'];
const ACTIVE_STATUSES = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
];

export default function AdminFormDialog({ open, onClose, onSuccess, mode, adminId }) {
    const dispatch = useDispatch();
    const { selectedAdmin, loading, error } = useSelector((state) => state.admins);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({
        name: '',
        gender: 'male',
        language: 'en',
        roleId: '',
        email: '',
        phone: { countryCode: '+91', number: '' },
        address: '',
        isActive: true,
        consents: { termsAndConditions: true, policyTerms: true },
    });

    const isEdit = mode === 'edit';

    useEffect(() => {
        if (!open) return;
        dispatch(clearError());
        if (isEdit && adminId) {
            dispatch(fetchAdminById(adminId));
        } else {
            setForm({
                name: '',
                gender: 'male',
                language: 'en',
                roleId: '',
                email: '',
                phone: { countryCode: '+91', number: '' },
                address: '',
                isActive: true,
                consents: { termsAndConditions: true, policyTerms: true },
            });
        }
    }, [open, isEdit, adminId, dispatch]);

    useEffect(() => {
        if (isEdit && selectedAdmin) {
            setForm({
                name: selectedAdmin.name ?? '',
                gender: selectedAdmin.gender ?? 'male',
                language: selectedAdmin.language ?? 'en',
                roleId: typeof selectedAdmin.roleId === 'object' ? selectedAdmin.roleId?._id : selectedAdmin.roleId ?? '',
                email: selectedAdmin.email ?? '',
                phone: {
                    countryCode: selectedAdmin.phone?.countryCode ?? '+91',
                    number: selectedAdmin.phone?.number ?? '',
                },
                address: selectedAdmin.address ?? '',
                isActive: selectedAdmin.isActive !== false,
                consents: {
                    termsAndConditions: selectedAdmin.consents?.termsAndConditions ?? true,
                    policyTerms: selectedAdmin.consents?.policyTerms ?? true,
                },
            });
        }
    }, [isEdit, selectedAdmin]);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const r = await api.get('/roles?limit=100');
                setRoles(Array.isArray(r?.data) ? r.data : []);
            } catch (_) { }
        })();
    }, [open]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };
    const handlePhoneChange = (field, value) => {
        setForm((prev) => ({ ...prev, phone: { ...prev.phone, [field]: value } }));
    };
    const handleConsentChange = (field, value) => {
        setForm((prev) => ({ ...prev, consents: { ...prev.consents, [field]: value } }));
    };

    const buildPayload = () => {
        const p = { ...form };
        return p;
    };

    const handleSubmit = () => {
        const payload = buildPayload();
        if (isEdit && adminId) {
            dispatch(updateAdmin({ id: adminId, payload }))
                .unwrap()
                .then(() => onSuccess?.())
                .catch(() => { });
        } else {
            const createPayload = {
                ...payload,
                consents: { termsAndConditions: true, policyTerms: true },
            };
            if (!createPayload.roleId || !createPayload.phone?.number || !createPayload.name || !createPayload.email) {
                return;
            }
            dispatch(createAdmin(createPayload))
                .unwrap()
                .then(() => onSuccess?.())
                .catch(() => { });
        }
    };

    const valid = form.name?.trim() && form.email?.trim() && form.phone?.number?.trim() && (isEdit || form.roleId);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                backgroundColor: 'primary.main',
                color: 'white',
            }}>{isEdit ? 'Edit admin' : 'Create admin'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    {error && (
                        <Box sx={{ color: 'error.main', fontSize: '0.875rem', mb: 2 }}>{error}</Box>
                    )}
                    <Grid container spacing={2}>
                        {/* Row 1: Name & Email */}
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
                                label="Email address"
                                type="email"
                                value={form.email ?? ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        {/* Row 2: Gender, Language */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    value={form.gender}
                                    label="Gender"
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                >
                                    {GENDERS.map((g) => (
                                        <MenuItem key={g} value={g}>{g}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Language"
                                value={form.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        {/* Row 3: Role, Country code, Phone number */}
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth required={!isEdit}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={form.roleId}
                                    label="Role"
                                    onChange={(e) => handleChange('roleId', e.target.value)}
                                >
                                    {roles.map((r) => (
                                        <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                            <TextField
                                label="Country code"
                                value={form.phone?.countryCode ?? ''}
                                onChange={(e) => handlePhoneChange('countryCode', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Phone number"
                                value={form.phone?.number ?? ''}
                                onChange={(e) => handlePhoneChange('number', e.target.value)}
                                required
                                fullWidth
                            />
                        </Grid>
                        {/* Row 4: Address, Active status */}
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                label="Address"
                                value={form.address ?? ''}
                                onChange={(e) => handleChange('address', e.target.value)}
                                fullWidth
                                placeholder="Optional"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
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
                        {/* Consents (create only) */}
                        {!isEdit && (
                            <Grid size={{ xs: 12 }}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!form.consents?.termsAndConditions}
                                                onChange={(e) => handleConsentChange('termsAndConditions', e.target.checked)}
                                            />
                                        }
                                        label="Terms and conditions"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!form.consents?.policyTerms}
                                                onChange={(e) => handleConsentChange('policyTerms', e.target.checked)}
                                            />
                                        }
                                        label="Policy terms"
                                    />
                                </FormGroup>
                            </Grid>
                        )}
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
