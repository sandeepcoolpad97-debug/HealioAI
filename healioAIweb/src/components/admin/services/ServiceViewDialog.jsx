import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
} from '@mui/material';

const InfoItem = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">
      {value || '—'}
    </Typography>
  </Box>
);

export default function ServiceViewDialog({ open, onClose, service }) {
  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Service Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InfoItem label="Name" value={service.name} />
            <InfoItem label="Code" value={service.code} />
            <InfoItem label="Description" value={service.description} />
            <InfoItem 
              label="Status" 
              value={
                <Chip 
                  label={service.isActive !== false ? "Active" : "Inactive"} 
                  color={service.isActive !== false ? "success" : "default"} 
                  size="small" 
                />
              } 
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
