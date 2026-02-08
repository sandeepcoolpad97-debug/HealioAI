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
import { fetchClinicById, createClinic, updateClinic, clearError } from '../../../store/slices/clinicsSlice';
import { api } from '../../../api/client';

const CONSULTATION_TYPES = ['in_person', 'online', 'both'];

export default function ClinicFormDialog({ open, onClose, onSuccess, mode, clinicId }) {
  const dispatch = useDispatch();
  const { selectedClinic, loading, error } = useSelector((state) => state.clinics);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    clinicName: '',
    registrationNumber: '',
    roleId: '',
    address: '',
    establishmentDate: '',
    phone: { countryCode: '+91', number: '', verified: false },
    emailId: '',
    consultationType: 'in_person',
    specialisation: '',
    doctorName: '',
    isActive: true,
    consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
  });

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;
    dispatch(clearError());
    if (isEdit && clinicId) {
      dispatch(fetchClinicById(clinicId));
    } else {
      setForm({
        clinicName: '',
        registrationNumber: '',
        roleId: '',
        address: '',
        establishmentDate: '',
        phone: { countryCode: '+91', number: '', verified: false },
        emailId: '',
        consultationType: 'in_person',
        specialisation: '',
        doctorName: '',
        isActive: true,
        consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
      });
    }
  }, [open, isEdit, clinicId, dispatch]);

  useEffect(() => {
    if (isEdit && selectedClinic) {
      setForm((prev) => ({
        ...prev,
        clinicName: selectedClinic.clinicName ?? '',
        registrationNumber: selectedClinic.registrationNumber ?? '',
        roleId: typeof selectedClinic.roleId === 'object' ? selectedClinic.roleId?._id : selectedClinic.roleId ?? '',
        address: selectedClinic.address ?? '',
        establishmentDate: selectedClinic.establishmentDate ? new Date(selectedClinic.establishmentDate).toISOString().split('T')[0] : '',
        phone: {
          countryCode: selectedClinic.phone?.countryCode ?? '+91',
          number: selectedClinic.phone?.number ?? '',
          verified: selectedClinic.phone?.verified ?? false,
        },
        emailId: selectedClinic.emailId ?? '',
        consultationType: selectedClinic.consultationType ?? 'in_person',
        specialisation: (selectedClinic.specialisation ?? []).join(', '),
        doctorName: selectedClinic.doctorName ?? '',
        isActive: selectedClinic.isActive ?? true,
      }));
    }
  }, [isEdit, selectedClinic]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const r = await api.get('/roles?limit=100');
        setRoles(Array.isArray(r?.data) ? r.data : []);
      } catch (_) {}
    })();
  }, [open]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleConsentChange = (field, value) => {
    setForm((prev) => ({ ...prev, consents: { ...prev.consents, [field]: value } }));
  };

  const buildPayload = () => {
    const specialisation = form.specialisation ? form.specialisation.split(',').map((s) => s.trim()).filter(Boolean) : [];
    return {
      ...form,
      specialisation,
      establishmentDate: form.establishmentDate ? new Date(form.establishmentDate) : undefined,
      operatingHours: [],
    };
  };

  const handleSubmit = () => {
    const payload = buildPayload();
    const createPayload = {
      ...payload,
      consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
    };
    if (isEdit && clinicId) {
      dispatch(updateClinic({ id: clinicId, payload }))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    } else {
      if (!createPayload.roleId || !createPayload.clinicName || !createPayload.registrationNumber || !createPayload.phone?.number || !createPayload.doctorName) return;
      dispatch(createClinic(createPayload))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    }
  };

  const valid = form.clinicName?.trim() && form.registrationNumber?.trim() && form.roleId && form.phone?.number?.trim() && form.doctorName?.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        {isEdit ? 'Edit clinic' : 'Create clinic'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && <Box sx={{ color: 'error.main', fontSize: '0.875rem', mb: 2 }}>{error}</Box>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Clinic name" value={form.clinicName} onChange={(e) => handleChange('clinicName', e.target.value)} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Doctor Name" value={form.doctorName} onChange={(e) => handleChange('doctorName', e.target.value)} required fullWidth placeholder="Dr. John Smith" />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Registration number" value={form.registrationNumber} onChange={(e) => handleChange('registrationNumber', e.target.value)} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select value={form.roleId} label="Role" onChange={(e) => handleChange('roleId', e.target.value)}>
                  {roles.map((r) => (
                    <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Consultation type</InputLabel>
                <Select value={form.consultationType} label="Consultation type" onChange={(e) => handleChange('consultationType', e.target.value)}>
                  {CONSULTATION_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Active Status</InputLabel>
                <Select
                  value={form.isActive ? 'active' : 'inactive'}
                  label="Active Status"
                  onChange={(e) => handleChange('isActive', e.target.value === 'active')}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                label="Establishment Date" 
                type="date" 
                value={form.establishmentDate} 
                onChange={(e) => handleChange('establishmentDate', e.target.value)} 
                fullWidth 
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Code"
                  value={form.phone.countryCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: { ...prev.phone, countryCode: e.target.value } }))}
                  sx={{ width: 80 }}
                />
                <TextField
                  label="Phone Number"
                  value={form.phone.number}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: { ...prev.phone, number: e.target.value } }))}
                  required
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" type="email" value={form.emailId} onChange={(e) => handleChange('emailId', e.target.value)} fullWidth />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField label="Address (optional)" value={form.address} onChange={(e) => handleChange('address', e.target.value)} fullWidth />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Specialisation (comma-separated)" value={form.specialisation} onChange={(e) => handleChange('specialisation', e.target.value)} fullWidth placeholder="e.g. General, Cardiology" />
            </Grid>
            {!isEdit && (
              <Grid size={{ xs: 12 }}>
                <FormGroup row>
                  <FormControlLabel control={<Checkbox checked={!!form.consents?.termsAndConditions} onChange={(e) => handleConsentChange('termsAndConditions', e.target.checked)} />} label="Terms and conditions" />
                  <FormControlLabel control={<Checkbox checked={!!form.consents?.policyTerms} onChange={(e) => handleConsentChange('policyTerms', e.target.checked)} />} label="Policy terms" />
                  <FormControlLabel control={<Checkbox checked={!!form.consents?.medicalDisclaimer} onChange={(e) => handleConsentChange('medicalDisclaimer', e.target.checked)} />} label="Medical disclaimer" />
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
