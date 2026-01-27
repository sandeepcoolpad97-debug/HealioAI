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

export default function UserViewDialog({ open, onClose }) {
  const { selectedUser, loading } = useSelector((state) => state.users);

  const phone = selectedUser?.phone
    ? `${selectedUser.phone.countryCode || ''} ${selectedUser.phone.number}`.trim()
    : '—';
  const roleName = selectedUser?.roleId?.name ?? selectedUser?.roleId ?? '—';
  const subName = selectedUser?.subscriptionId?.name ?? selectedUser?.subscriptionId ?? '—';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>User details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedUser ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            <Typography variant="body2"><strong>Name:</strong> {selectedUser.name ?? '—'}</Typography>
            <Typography variant="body2"><strong>Age:</strong> {selectedUser.age ?? '—'}</Typography>
            <Typography variant="body2"><strong>Gender:</strong> {selectedUser.gender ?? '—'}</Typography>
            <Typography variant="body2"><strong>Phone:</strong> {phone}</Typography>
            <Typography variant="body2"><strong>Role:</strong> {roleName}</Typography>
            <Typography variant="body2"><strong>Subscription:</strong> {subName}</Typography>
            <Typography variant="body2"><strong>Status:</strong> {selectedUser.subscriptionStatus ?? '—'}</Typography>
            <Typography variant="body2"><strong>Language:</strong> {selectedUser.language ?? '—'}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">No user selected.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
