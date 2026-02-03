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

const roleName = (l) => l?.roleId?.name ?? l?.roleId ?? '—';

export default function LabViewDialog({ open, onClose }) {
  const { selectedLab, loading } = useSelector((state) => state.labs);

  const testCategories = selectedLab?.services?.testCategories?.length ? selectedLab.services.testCategories.join(', ') : '—';
  const reportDelivery = selectedLab?.services?.reportDeliveryType?.length ? selectedLab.services.reportDeliveryType.join(', ') : '—';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Lab details
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedLab ? (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField label="Lab name" value={selectedLab.labName ?? '—'} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Registration number" value={selectedLab.registrationNumber ?? '—'} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Role" value={roleName(selectedLab)} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Address" value={selectedLab.address ?? '—'} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Contact number" value={selectedLab.contactNumber ?? '—'} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Email" value={selectedLab.emailId?.trim() || '—'} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Test categories" value={testCategories} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Home sample collection" value={selectedLab.services?.homeSampleCollection ? 'Yes' : 'No'} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Report delivery" value={reportDelivery} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Active status" value={selectedLab.isActive !== false ? 'Active' : 'Inactive'} fullWidth   InputProps={{
    readOnly: true
  }} size="small" />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ py: 2, color: 'text.secondary' }}>No lab selected.</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
