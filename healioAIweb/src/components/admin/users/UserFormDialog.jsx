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
import { fetchUserById, createUser, updateUser, clearError } from '../../../store/slices/usersSlice';
import { api } from '../../../api/client';

const GENDERS = ['male', 'female', 'other'];
const STATUSES = ['active', 'expired', 'cancelled', 'trial'];
const ACTIVE_STATUSES = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

export default function UserFormDialog({ open, onClose, onSuccess, mode, userId }) {
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector((state) => state.users);
  const [roles, setRoles] = useState([]);
  const [subs, setSubs] = useState([]);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'male',
    language: 'en',
    roleId: '',
    subscriptionId: '',
    email: '',
    phone: { countryCode: '+91', number: '' },
    subscriptionStatus: 'active',
    isActive: true,
    consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
    medical: { existingConditions: [], otherConditions: '' },
  });

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;
    dispatch(clearError());
    if (isEdit && userId) {
      dispatch(fetchUserById(userId));
    } else {
      setForm({
        name: '',
        age: '',
        gender: 'male',
        language: 'en',
        roleId: '',
        subscriptionId: '',
        email: '',
        phone: { countryCode: '+91', number: '' },
        subscriptionStatus: 'active',
        isActive: true,
        consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
        medical: { existingConditions: [], otherConditions: '' },
      });
    }
  }, [open, isEdit, userId, dispatch]);

  useEffect(() => {
    if (isEdit && selectedUser) {
      setForm({
        name: selectedUser.name ?? '',
        age: selectedUser.age ?? '',
        gender: selectedUser.gender ?? 'male',
        language: selectedUser.language ?? 'en',
        roleId: typeof selectedUser.roleId === 'object' ? selectedUser.roleId?._id : selectedUser.roleId ?? '',
        subscriptionId: typeof selectedUser.subscriptionId === 'object' ? selectedUser.subscriptionId?._id : selectedUser.subscriptionId ?? '',
        email: selectedUser.email ?? '',
        phone: {
          countryCode: selectedUser.phone?.countryCode ?? '+91',
          number: selectedUser.phone?.number ?? '',
        },
        subscriptionStatus: selectedUser.subscriptionStatus ?? 'active',
        isActive: selectedUser.isActive !== false,
        consents: {
          termsAndConditions: selectedUser.consents?.termsAndConditions ?? true,
          policyTerms: selectedUser.consents?.policyTerms ?? true,
          medicalDisclaimer: selectedUser.consents?.medicalDisclaimer ?? true,
        },
        medical: {
          existingConditions: Array.isArray(selectedUser.medical?.existingConditions) ? selectedUser.medical.existingConditions : [],
          otherConditions: selectedUser.medical?.otherConditions ?? '',
        },
      });
    }
  }, [isEdit, selectedUser]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [r, s] = await Promise.all([
          api.get('/roles?limit=100'),
          api.get('/subscriptions?limit=100'),
        ]);
        // API client returns response body directly: { success, data: array, meta }
        setRoles(Array.isArray(r?.data) ? r.data : []);
        setSubs(Array.isArray(s?.data) ? s.data : []);
      } catch (_) {}
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
  const handleMedicalChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      medical: { ...prev.medical, [field]: value },
    }));
  };

  const buildPayload = () => {
    const p = { ...form };
    if (p.age !== '') p.age = Number(p.age);
    return p;
  };

  const handleSubmit = () => {
    const payload = buildPayload();
    if (isEdit && userId) {
      dispatch(updateUser({ id: userId, payload }))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    } else {
      const createPayload = {
        ...payload,
        consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
      };
      if (!createPayload.roleId || !createPayload.subscriptionId || !createPayload.phone?.number || !createPayload.name) {
        return;
      }
      dispatch(createUser(createPayload))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    }
  };

  const valid = form.name?.trim() && form.phone?.number?.trim() && (isEdit || (form.roleId && form.subscriptionId));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle   sx={{
    backgroundColor: 'primary.main',
    color: 'white',
  }}>{isEdit ? 'Edit user' : 'Create user'}</DialogTitle>
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
                placeholder="Optional"
              />
            </Grid>
            {/* Row 3: Age, Gender, Language */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Age"
                type="number"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Language"
                value={form.language}
                onChange={(e) => handleChange('language', e.target.value)}
                fullWidth
              />
            </Grid>
            {/* Row 4: Role, Country code, Phone number */}
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
            {/* Row 5: Subscription, Subscription status, Active status */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth required={!isEdit}>
                <InputLabel>Subscription</InputLabel>
                <Select
                  value={form.subscriptionId}
                  label="Subscription"
                  onChange={(e) => handleChange('subscriptionId', e.target.value)}
                >
                  {subs.map((s) => (
                    <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Subscription status</InputLabel>
                <Select
                  value={form.subscriptionStatus}
                  label="Subscription status"
                  onChange={(e) => handleChange('subscriptionStatus', e.target.value)}
                  disabled={!isEdit}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            {/* Medical (existing conditions, other conditions) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Existing conditions (comma-separated)"
                value={Array.isArray(form.medical?.existingConditions) ? form.medical.existingConditions.join(', ') : (form.medical?.existingConditions ?? '')}
                onChange={(e) =>
                  handleMedicalChange(
                    'existingConditions',
                    e.target.value ? e.target.value.split(',').map((s) => s.trim()).filter(Boolean) : []
                  )
                }
                fullWidth
                placeholder="e.g. diabetes, hypertension"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Other conditions"
                value={form.medical?.otherConditions ?? ''}
                onChange={(e) => handleMedicalChange('otherConditions', e.target.value)}
                fullWidth
                placeholder="Optional notes"
              />
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!form.consents?.medicalDisclaimer}
                        onChange={(e) => handleConsentChange('medicalDisclaimer', e.target.checked)}
                      />
                    }
                    label="Medical disclaimer"
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
