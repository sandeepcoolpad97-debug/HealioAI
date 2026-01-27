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
} from '@mui/material';
import { fetchUserById, createUser, updateUser, clearError } from '../../../store/slices/usersSlice';
import { api } from '../../../api/client';

const GENDERS = ['male', 'female', 'other'];
const STATUSES = ['active', 'expired', 'cancelled', 'trial'];

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
    phone: { countryCode: '+91', number: '' },
    subscriptionStatus: 'active',
    consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
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
        phone: { countryCode: '+91', number: '' },
        subscriptionStatus: 'active',
        consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
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
        phone: {
          countryCode: selectedUser.phone?.countryCode ?? '+91',
          number: selectedUser.phone?.number ?? '',
        },
        subscriptionStatus: selectedUser.subscriptionStatus ?? 'active',
        consents: {
          termsAndConditions: selectedUser.consents?.termsAndConditions ?? true,
          policyTerms: selectedUser.consents?.policyTerms ?? true,
          medicalDisclaimer: selectedUser.consents?.medicalDisclaimer ?? true,
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
        setRoles(r.data || []);
        setSubs(s.data || []);
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle   sx={{
    backgroundColor: 'primary.main',
    color: 'white',
  }}>{isEdit ? 'Edit user' : 'Create user'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && (
            <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>{error}</Box>
          )}
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Age"
            type="number"
            value={form.age}
            onChange={(e) => handleChange('age', e.target.value)}
            fullWidth
          />
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
          <TextField
            label="Language"
            value={form.language}
            onChange={(e) => handleChange('language', e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone country code"
            value={form.phone?.countryCode ?? ''}
            onChange={(e) => handlePhoneChange('countryCode', e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone number"
            value={form.phone?.number ?? ''}
            onChange={(e) => handlePhoneChange('number', e.target.value)}
            required
            fullWidth
          />
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
          {isEdit && (
            <FormControl fullWidth>
              <InputLabel>Subscription status</InputLabel>
              <Select
                value={form.subscriptionStatus}
                label="Subscription status"
                onChange={(e) => handleChange('subscriptionStatus', e.target.value)}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {!isEdit && (
            <FormGroup>
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
          )}
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
