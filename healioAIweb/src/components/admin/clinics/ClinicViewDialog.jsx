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

const roleName = (c) => c?.roleId?.name ?? c?.roleId ?? '—';

export default function ClinicViewDialog({ open, onClose }) {
  const { selectedClinic, loading } = useSelector((state) => state.clinics);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Clinic details
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedClinic ? (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField label="Clinic name" value={selectedClinic.clinicName ?? '—'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Registration number" value={selectedClinic.registrationNumber ?? '—'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Role" value={roleName(selectedClinic)} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Address" value={selectedClinic.address ?? '—'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Establishment Date" value={selectedClinic.establishmentDate ? new Date(selectedClinic.establishmentDate).toLocaleDateString() : '—'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Contact number" value={selectedClinic.contactNumber ?? '—'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Email" value={selectedClinic.emailId?.trim() || '—'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Consultation type" value={selectedClinic.consultationType ?? '—'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Active status" value={selectedClinic.isActive !== false ? 'Active' : 'Inactive'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Specialisation" value={selectedClinic.specialisation?.length ? selectedClinic.specialisation.join(', ') : '—'} fullWidth disabled size="small" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Doctor Name" value={selectedClinic.doctorName ?? '—'} fullWidth disabled size="small" />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ py: 2, color: 'text.secondary' }}>No clinic selected.</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
