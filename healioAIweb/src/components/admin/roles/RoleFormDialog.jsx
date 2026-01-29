import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
  Grid,
} from '@mui/material';
import { fetchRoleById, createRole, updateRole, clearError } from '../../../store/slices/rolesSlice';

export default function RoleFormDialog({ open, onClose, onSuccess, mode, roleId }) {
  const dispatch = useDispatch();
  const { selectedRole, loading, error } = useSelector((state) => state.roles);
  const [form, setForm] = useState({
    name: '',
    description: '',
    permissions: [],
    isSystemRole: false,
  });
  const [permissionsInput, setPermissionsInput] = useState('');

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;
    dispatch(clearError());
    if (isEdit && roleId) {
      dispatch(fetchRoleById(roleId));
    } else {
      setForm({ name: '', description: '', permissions: [], isSystemRole: false });
      setPermissionsInput('');
    }
  }, [open, isEdit, roleId, dispatch]);

  useEffect(() => {
    if (isEdit && selectedRole) {
      setForm({
        name: selectedRole.name ?? '',
        description: selectedRole.description ?? '',
        permissions: selectedRole.permissions ?? [],
        isSystemRole: selectedRole.isSystemRole ?? false,
      });
      setPermissionsInput((selectedRole.permissions ?? []).join(', '));
    }
  }, [isEdit, selectedRole]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const perms = permissionsInput ? permissionsInput.split(',').map((p) => p.trim()).filter(Boolean) : [];
    const payload = { ...form, permissions: perms };
    if (isEdit && roleId) {
      dispatch(updateRole({ id: roleId, payload }))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    } else {
      dispatch(createRole(payload))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    }
  };

  const valid = form.name?.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        {isEdit ? 'Edit role' : 'Create role'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Box sx={{ color: 'error.main', fontSize: '0.875rem', mb: 2 }}>{error}</Box>
          )}
          <Grid container spacing={2}>
            {/* Row 1: Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                fullWidth
              />
            </Grid>
            {/* Row 2: Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
            {/* Row 3: Permissions */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Permissions (comma-separated)"
                value={permissionsInput}
                onChange={(e) => setPermissionsInput(e.target.value)}
                placeholder="e.g. read:users, write:users"
                fullWidth
              />
            </Grid>
            {/* Row 4: System role (create and edit – API field) */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isSystemRole}
                    onChange={(e) => handleChange('isSystemRole', e.target.checked)}
                  />
                }
                label="System role"
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
