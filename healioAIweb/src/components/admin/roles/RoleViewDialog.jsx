import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

export default function RoleViewDialog({ open, onClose }) {
  const { selectedRole, loading } = useSelector((state) => state.roles);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle   sx={{
    backgroundColor: 'primary.main',
    color: 'white',
  }}>Role details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedRole ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            <Typography variant="body2"><strong>Name:</strong> {selectedRole.name ?? '—'}</Typography>
            <Typography variant="body2"><strong>Description:</strong> {selectedRole.description ?? '—'}</Typography>
            <Typography variant="body2"><strong>System role:</strong> {selectedRole.isSystemRole ? 'Yes' : 'No'}</Typography>
            <Typography variant="body2"><strong>Permissions:</strong> {(selectedRole.permissions?.length && selectedRole.permissions.join(', ')) || '—'}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">No role selected.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
