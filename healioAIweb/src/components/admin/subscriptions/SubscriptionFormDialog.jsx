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
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
} from '@mui/material';
import { fetchSubscriptionById, createSubscription, updateSubscription, clearError } from '../../../store/slices/subscriptionsSlice';

const CURRENCIES = ['INR', 'USD', 'EUR'];

export default function SubscriptionFormDialog({ open, onClose, onSuccess, mode, subscriptionId }) {
  const dispatch = useDispatch();
  const { selectedSubscription, loading, error } = useSelector((state) => state.subscriptions);
  const [form, setForm] = useState({
    name: '',
    code: '',
    price: 0,
    currency: 'INR',
    durationInDays: null,
    features: [],
    isSystemPlan: false,
  });
  const [featuresInput, setFeaturesInput] = useState('');

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;
    dispatch(clearError());
    if (isEdit && subscriptionId) {
      dispatch(fetchSubscriptionById(subscriptionId));
    } else {
      setForm({ name: '', code: '', price: 0, currency: 'INR', durationInDays: null, features: [], isSystemPlan: false });
      setFeaturesInput('');
    }
  }, [open, isEdit, subscriptionId, dispatch]);

  useEffect(() => {
    if (isEdit && selectedSubscription) {
      setForm({
        name: selectedSubscription.name ?? '',
        code: selectedSubscription.code ?? '',
        price: selectedSubscription.price ?? 0,
        currency: selectedSubscription.currency ?? 'INR',
        durationInDays: selectedSubscription.durationInDays ?? null,
        features: selectedSubscription.features ?? [],
        isSystemPlan: selectedSubscription.isSystemPlan ?? false,
      });
      setFeaturesInput((selectedSubscription.features ?? []).join(', '));
    }
  }, [isEdit, selectedSubscription]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const features = featuresInput ? featuresInput.split(',').map((f) => f.trim()).filter(Boolean) : [];
    const payload = { ...form, features };
    if (form.durationInDays === '' || form.durationInDays == null) {
      payload.durationInDays = null;
    }
    if (isEdit && subscriptionId) {
      dispatch(updateSubscription({ id: subscriptionId, payload }))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    } else {
      const createPayload = { ...payload };
      if (createPayload.durationInDays === '' || createPayload.durationInDays == null) {
        createPayload.durationInDays = undefined;
      }
      dispatch(createSubscription(createPayload))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    }
  };

  const valid = form.name?.trim() && form.code?.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit subscription' : 'Create subscription'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && (
            <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>{error}</Box>
          )}
          <TextField label="Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required fullWidth />
          <TextField label="Code" value={form.code} onChange={(e) => handleChange('code', e.target.value)} required fullWidth placeholder="e.g. free, pro" />
          <TextField label="Price" type="number" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value) || 0)} inputProps={{ min: 0 }} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select value={form.currency} label="Currency" onChange={(e) => handleChange('currency', e.target.value)}>
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Duration (days)"
            type="number"
            value={form.durationInDays ?? ''}
            onChange={(e) => handleChange('durationInDays', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="Leave empty for lifetime"
            inputProps={{ min: 1 }}
            fullWidth
          />
          <TextField
            label="Features (comma-separated)"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="e.g. feature1, feature2"
            fullWidth
          />
          {!isEdit && (
            <FormControlLabel
              control={<Checkbox checked={form.isSystemPlan} onChange={(e) => handleChange('isSystemPlan', e.target.checked)} />}
              label="System plan"
            />
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
