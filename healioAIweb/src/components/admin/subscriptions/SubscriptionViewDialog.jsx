import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Grid,
} from '@mui/material';

export default function SubscriptionViewDialog({ open, onClose }) {
  const { selectedSubscription, loading } = useSelector((state) => state.subscriptions);

  const priceDisplay = selectedSubscription
    ? `${selectedSubscription.currency ?? 'INR'} ${selectedSubscription.price ?? 0}`
    : '—';
  const durationDisplay = selectedSubscription?.durationInDays ?? '—';
  const featuresDisplay =
    selectedSubscription?.features?.length
      ? selectedSubscription.features.join(', ')
      : '—';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        Subscription details
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedSubscription ? (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              {/* Row 1: Name, Code */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Name"
                  value={selectedSubscription.name ?? '—'}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Code"
                  value={selectedSubscription.code ?? '—'}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>
              {/* Row 2: Price, Currency, Duration (days) */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Price"
                  value={priceDisplay}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Currency"
                  value={selectedSubscription.currency ?? '—'}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Duration (days)"
                  value={durationDisplay}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>
              {/* Row 3: System plan */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="System plan"
                  value={selectedSubscription.isSystemPlan ? 'Yes' : 'No'}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>
              {/* Row 4: Features */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Features"
                  value={featuresDisplay}
                  fullWidth
                  disabled
                  multiline
                  minRows={1}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ py: 2, color: 'text.secondary' }}>No subscription selected.</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
