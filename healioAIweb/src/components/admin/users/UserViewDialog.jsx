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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const roleName = (user) => user?.roleId?.name ?? user?.roleId ?? '—';
const subName = (user) => user?.subscriptionId?.name ?? user?.subscriptionId ?? '—';

export default function UserViewDialog({ open, onClose }) {
  const { selectedUser, loading } = useSelector((state) => state.users);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        User details
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedUser ? (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              {/* Row 1: Name & Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Name"
                  value={selectedUser.name ?? '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email address"
                  value={selectedUser.email?.trim() ? selectedUser.email : '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>

              {/* Row 2: Age, Gender, Language */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Age"
                  value={selectedUser.age ?? '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Gender"
                  value={selectedUser.gender ?? '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Language"
                  value={selectedUser.language ?? '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>

              {/* Row 3: Role, Country code, Phone number */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Role"
                  value={roleName(selectedUser)}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  label="Country code"
                  value={selectedUser?.phone?.countryCode ?? '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone number"
                  value={selectedUser?.phone?.number ?? '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>

              {/* Row 4: Subscription, Subscription status, Active status */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Subscription"
                  value={subName(selectedUser)}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Subscription status"
                  value={selectedUser.subscriptionStatus ?? '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Active status"
                  value={selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>

              {/* Row 5: Medical Conditions */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Existing conditions"
                  value={Array.isArray(selectedUser.medical?.existingConditions) ? selectedUser.medical.existingConditions.join(', ') : (selectedUser.medical?.existingConditions ?? '—')}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Other conditions"
                  value={selectedUser.medical?.otherConditions ?? '—'}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                   
                />
              </Grid>

              {/* Row 6: Consents */}
              <Grid size={{ xs: 12 }}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selectedUser.consents?.termsAndConditions}
                        disabled
                      />
                    }
                    label="Terms and conditions"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selectedUser.consents?.policyTerms}
                        disabled
                      />
                    }
                    label="Policy terms"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selectedUser.consents?.medicalDisclaimer}
                        disabled
                      />
                    }
                    label="Medical disclaimer"
                  />
                </FormGroup>
              </Grid>

            </Grid>
          </Box>
        ) : (
          <Box sx={{ py: 2, color: 'text.secondary' }}>No user selected.</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
