import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Grid,
} from '@mui/material';

export default function RoleViewDialog({ open, onClose }) {
  const { selectedRole, loading } = useSelector((state) => state.roles);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        Role details
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedRole ? (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              {/* Row 1: Name */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Name"
                  value={selectedRole.name ?? '—'}
                  fullWidth
                    InputProps={{
    readOnly: true
  }}
                  size="small"
                />
              </Grid>
              {/* Row 2: Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description"
                  value={selectedRole.description ?? '—'}
                  fullWidth
                    InputProps={{
    readOnly: true
  }}
                  multiline
                  rows={2}
                  size="small"
                />
              </Grid>
              {/* Row 3: System role */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="System role"
                  value={selectedRole.isSystemRole ? 'Yes' : 'No'}
                  fullWidth
                    InputProps={{
    readOnly: true
  }}
                  size="small"
                />
              </Grid>
              {/* Row 4: Permissions */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Permissions"
                  value={
                    selectedRole.permissions?.length
                      ? selectedRole.permissions.join(', ')
                      : '—'
                  }
                  fullWidth
                    InputProps={{
    readOnly: true
  }}
                  multiline
                  minRows={1}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ py: 2, color: 'text.secondary' }}>No role selected.</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
