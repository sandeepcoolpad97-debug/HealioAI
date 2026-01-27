import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

export default function SubscriptionViewDialog({ open, onClose }) {
  const { selectedSubscription, loading } = useSelector((state) => state.subscriptions);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle   sx={{
    backgroundColor: 'primary.main',
    color: 'white',
  }}>Subscription details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedSubscription ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            <Typography variant="body2"><strong>Name:</strong> {selectedSubscription.name ?? '—'}</Typography>
            <Typography variant="body2"><strong>Code:</strong> {selectedSubscription.code ?? '—'}</Typography>
            <Typography variant="body2"><strong>Price:</strong> {selectedSubscription.currency ?? 'INR'} {selectedSubscription.price ?? 0}</Typography>
            <Typography variant="body2"><strong>Duration (days):</strong> {selectedSubscription.durationInDays ?? '—'}</Typography>
            <Typography variant="body2"><strong>System plan:</strong> {selectedSubscription.isSystemPlan ? 'Yes' : 'No'}</Typography>
            <Typography variant="body2"><strong>Features:</strong> {(selectedSubscription.features?.length && selectedSubscription.features.join(', ')) || '—'}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">No subscription selected.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
