import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export default function AppointmentDeleteDialog({ open, onClose, onConfirm, appointmentId }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Appointment?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this appointment? This action cannot be undone.
        </DialogContentText>
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
