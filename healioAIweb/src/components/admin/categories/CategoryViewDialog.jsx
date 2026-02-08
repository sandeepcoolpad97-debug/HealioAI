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

export default function CategoryViewDialog({ open, onClose, category }) {
  if (!category) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Category Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InfoItem label="Name" value={category.name} />
            <InfoItem label="Code" value={category.code} />
            <InfoItem label="Description" value={category.description} />
            <InfoItem 
              label="Status" 
              value={
                <Chip 
                  label={category.isActive ? "Active" : "Inactive"} 
                  color={category.isActive ? "success" : "default"} 
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
