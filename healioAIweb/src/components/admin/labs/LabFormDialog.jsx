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
import { fetchLabById, createLab, updateLab, clearError } from '../../../store/slices/labsSlice';
import { api } from '../../../api/client';

const TEST_CATEGORIES = ['blood_tests', 'urine_tests', 'radiology', 'pathology', 'full_body_checkup'];
const REPORT_DELIVERY = ['pdf', 'in_app'];

export default function LabFormDialog({ open, onClose, onSuccess, mode, labId }) {
  const dispatch = useDispatch();
  const { selectedLab, loading, error } = useSelector((state) => state.labs);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    labName: '',
    registrationNumber: '',
    roleId: '',
    address: '',
    phone: { countryCode: '+91', number: '', verified: false },
    emailId: '',
    testCategories: [],
    homeSampleCollection: false,
    reportDeliveryType: [],
    isActive: true,
    consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
  });

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;
    dispatch(clearError());
    if (isEdit && labId) {
      dispatch(fetchLabById(labId));
    } else {
      setForm({
        labName: '',
        registrationNumber: '',
        roleId: '',
        address: '',
        phone: { countryCode: '+91', number: '', verified: false },
        emailId: '',
        testCategories: [],
        homeSampleCollection: false,
        reportDeliveryType: [],
        isActive: true,
        consents: { termsAndConditions: true, policyTerms: true, medicalDisclaimer: true },
      });
    }
  }, [open, isEdit, labId, dispatch]);

  useEffect(() => {
    if (isEdit && selectedLab) {
      setForm((prev) => ({
        ...prev,
        labName: selectedLab.labName ?? '',
        registrationNumber: selectedLab.registrationNumber ?? '',
        roleId: typeof selectedLab.roleId === 'object' ? selectedLab.roleId?._id : selectedLab.roleId ?? '',
        address: selectedLab.address ?? '',
        phone: {
          countryCode: selectedLab.phone?.countryCode ?? '+91',
          number: selectedLab.phone?.number ?? '',
          verified: selectedLab.phone?.verified ?? false,
        },
        emailId: selectedLab.emailId ?? '',
        testCategories: selectedLab.services?.testCategories ?? [],
        homeSampleCollection: selectedLab.services?.homeSampleCollection ?? false,
        reportDeliveryType: selectedLab.services?.reportDeliveryType ?? [],
        isActive: selectedLab.isActive !== false,
        consents: {
          termsAndConditions: selectedLab.consents?.termsAndConditions ?? true,
          policyTerms: selectedLab.consents?.policyTerms ?? true,
          medicalDisclaimer: selectedLab.consents?.medicalDisclaimer ?? true,
        },
      }));
    }
  }, [isEdit, selectedLab]);

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
  const handleMultiSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: typeof value === 'string' ? value.split(',') : value }));
  };

  const buildPayload = () => ({
    ...form,
    services: {
      testCategories: form.testCategories,
      homeSampleCollection: form.homeSampleCollection,
      reportDeliveryType: form.reportDeliveryType,
    },
    operatingHours: [],
  });

  const handleSubmit = () => {
    const payload = buildPayload();
    if (isEdit && labId) {
      dispatch(updateLab({ id: labId, payload }))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    } else {
      if (!payload.roleId || !payload.labName || !payload.registrationNumber || !payload.address || !payload.phone?.number) return;
      dispatch(createLab(payload))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    }
  };

  const valid = form.labName?.trim() && form.registrationNumber?.trim() && form.roleId && form.address?.trim() && form.phone?.number?.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        {isEdit ? 'Edit lab' : 'Create lab'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && <Box sx={{ color: 'error.main', fontSize: '0.875rem', mb: 2 }}>{error}</Box>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField label="Lab name" value={form.labName} onChange={(e) => handleChange('labName', e.target.value)} required fullWidth />
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
              <FormControl fullWidth>
                <InputLabel>Test categories</InputLabel>
                <Select multiple value={form.testCategories} label="Test categories" onChange={(e) => handleMultiSelect('testCategories', e.target.value)} renderValue={(v) => v.join(', ')}>
                  {TEST_CATEGORIES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Home sample collection</InputLabel>
                <Select
                  value={form.homeSampleCollection ? 'Yes' : 'No'}
                  label="Home sample collection"
                  onChange={(e) => handleChange('homeSampleCollection', e.target.value === 'Yes')}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Report delivery</InputLabel>
                <Select multiple value={form.reportDeliveryType} label="Report delivery" onChange={(e) => handleMultiSelect('reportDeliveryType', e.target.value)} renderValue={(v) => v.join(', ')}>
                  {REPORT_DELIVERY.map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Active status</InputLabel>
                <Select
                  value={form.isActive ? 'Active' : 'Inactive'}
                  label="Active status"
                  onChange={(e) => handleChange('isActive', e.target.value === 'Active')}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormGroup row>
                <FormControlLabel control={<Checkbox checked={!!form.consents?.termsAndConditions} onChange={(e) => handleConsentChange('termsAndConditions', e.target.checked)} />} label="Terms and conditions" />
                <FormControlLabel control={<Checkbox checked={!!form.consents?.policyTerms} onChange={(e) => handleConsentChange('policyTerms', e.target.checked)} />} label="Policy terms" />
                <FormControlLabel control={<Checkbox checked={!!form.consents?.medicalDisclaimer} onChange={(e) => handleConsentChange('medicalDisclaimer', e.target.checked)} />} label="Medical disclaimer" />
              </FormGroup>
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
