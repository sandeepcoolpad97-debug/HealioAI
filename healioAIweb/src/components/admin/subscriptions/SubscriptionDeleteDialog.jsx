import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function SubscriptionDeleteDialog({ open, subscriptionName, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete subscription</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {subscriptionName ? <strong>{subscriptionName}</strong> : 'this subscription'}? System plans cannot be deleted. This cannot be undone.
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
