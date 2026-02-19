import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createService, updateService } from '../../../store/slices/servicesSlice';

export default function ServiceFormDialog({ open, onClose, service }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        code: service.code || '',
        description: service.description || '',
        isActive: service.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        isActive: true,
      });
    }
    setError(null);
  }, [service, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code) {
      setError('Name and Code are required');
      return;
    }

    try {
      if (service) {
        await dispatch(updateService({ id: service._id, payload: formData })).unwrap();
      } else {
        await dispatch(createService(formData)).unwrap();
      }
      onClose(true); // true = success
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        {service ? 'Edit Service' : 'New Service'}
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Service Name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="code"
          label="Service Code"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          helperText="Unique identifier (e.g., 'telemedicine')"
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Active status</InputLabel>
          <Select
            name="isActive"
            value={formData.isActive}
            label="Active status"
            onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value }))}
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {service ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
