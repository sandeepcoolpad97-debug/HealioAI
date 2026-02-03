import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function UserDeleteDialog({ open, userName, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: 'error.main',
          color: 'white',
        }}
      >
        Delete user
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {userName ? <strong>{userName}</strong> : 'this user'}? This cannot be undone.
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
