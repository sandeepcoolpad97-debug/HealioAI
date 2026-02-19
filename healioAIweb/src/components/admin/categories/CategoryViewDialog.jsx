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

export default function CategoryViewDialog({ open, onClose, category }) {
  if (!category) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Category Details
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          label="Category Name"
          fullWidth
          value={category.name || ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          margin="dense"
          label="Category Code"
          fullWidth
          value={category.code || ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={category.description || ''}
          InputProps={{ readOnly: true }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={category.isActive ? 'Active' : 'Inactive'}
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
