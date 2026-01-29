import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function LabDeleteDialog({ open, labName, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: 'error.main',
          color: 'white',
        }}
      >
        Delete lab
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {labName ? <strong>{labName}</strong> : 'this lab'}? This cannot be undone.
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
