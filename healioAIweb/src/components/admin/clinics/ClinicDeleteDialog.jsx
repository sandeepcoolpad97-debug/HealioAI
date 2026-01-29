import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function ClinicDeleteDialog({ open, clinicName, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: 'error.main',
          color: 'white',
        }}
      >
        Delete clinic
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {clinicName ? <strong>{clinicName}</strong> : 'this clinic'}? This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
