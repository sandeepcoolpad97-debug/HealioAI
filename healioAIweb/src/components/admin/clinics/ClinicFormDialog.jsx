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
    contactNumber: '',
    emailId: '',
    consultationType: 'in_person',
    specialisation: '',
    doctorsListInput: '',
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
        contactNumber: '',
        emailId: '',
        consultationType: 'in_person',
        specialisation: '',
        doctorsListInput: '',
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
        contactNumber: selectedClinic.contactNumber ?? '',
        emailId: selectedClinic.emailId ?? '',
        consultationType: selectedClinic.consultationType ?? 'in_person',
        specialisation: (selectedClinic.specialisation ?? []).join(', '),
        doctorsListInput: (selectedClinic.doctorsList ?? []).map((d) => `${d.name}, ${d.specialisation}`).join('\n'),
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
    const doctorsList = form.doctorsListInput
      ? form.doctorsListInput
          .split('\n')
          .map((line) => {
            const [name, specialisation] = line.split(',').map((s) => s.trim());
            return name ? { name: name || '', specialisation: specialisation || '' } : null;
          })
          .filter(Boolean)
      : [];
    return {
      ...form,
      specialisation,
      doctorsList,
      operatingHours: [],
    };
  };

  const handleSubmit = () => {
    const payload = buildPayload();
    if (payload.doctorsListInput !== undefined) delete payload.doctorsListInput;
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
      if (!createPayload.roleId || !createPayload.clinicName || !createPayload.registrationNumber || !createPayload.address || !createPayload.contactNumber) return;
      dispatch(createClinic(createPayload))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    }
  };

  const valid = form.clinicName?.trim() && form.registrationNumber?.trim() && form.roleId && form.address?.trim() && form.contactNumber?.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        {isEdit ? 'Edit clinic' : 'Create clinic'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && <Box sx={{ color: 'error.main', fontSize: '0.875rem', mb: 2 }}>{error}</Box>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField label="Clinic name" value={form.clinicName} onChange={(e) => handleChange('clinicName', e.target.value)} required fullWidth />
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
            <Grid size={{ xs: 12 }}>
              <TextField label="Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Contact number" value={form.contactNumber} onChange={(e) => handleChange('contactNumber', e.target.value)} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" type="email" value={form.emailId} onChange={(e) => handleChange('emailId', e.target.value)} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Consultation type</InputLabel>
                <Select value={form.consultationType} label="Consultation type" onChange={(e) => handleChange('consultationType', e.target.value)}>
                  {CONSULTATION_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Specialisation (comma-separated)" value={form.specialisation} onChange={(e) => handleChange('specialisation', e.target.value)} fullWidth placeholder="e.g. General, Cardiology" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Doctors (one per line: Name, Specialisation)" value={form.doctorsListInput} onChange={(e) => handleChange('doctorsListInput', e.target.value)} fullWidth multiline rows={3} placeholder="Dr. John, Cardiology" />
            </Grid>
            {!isEdit && (
              <Grid size={{ xs: 12 }}>
                <FormGroup>
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
