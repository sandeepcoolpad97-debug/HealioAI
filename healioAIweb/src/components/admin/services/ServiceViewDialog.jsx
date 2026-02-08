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
} from '@mui/material';

export default function ServiceViewDialog({ open, onClose, service }) {
  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Service Details
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          label="Service Name"
          fullWidth
          value={service.name || ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          margin="dense"
          label="Service Code"
          fullWidth
          value={service.code || ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={service.description || ''}
          InputProps={{ readOnly: true }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={service.isActive !== false ? 'Active' : 'Inactive'}
            label="Status"
            readOnly
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
