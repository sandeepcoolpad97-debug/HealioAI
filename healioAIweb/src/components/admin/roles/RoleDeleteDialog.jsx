import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function RoleDeleteDialog({ open, roleName, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle         sx={{
          backgroundColor: 'error.main',
          color: 'white',
        }}>Delete role</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {roleName ? <strong>{roleName}</strong> : 'this role'}? System roles cannot be deleted. This cannot be undone.
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
