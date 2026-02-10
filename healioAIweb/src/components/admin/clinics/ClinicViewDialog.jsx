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
import OperatingHoursEditor from '../common/OperatingHoursEditor';

const roleName = (c) => c?.roleId?.name ?? c?.roleId ?? '—';

export default function ClinicViewDialog({ open, onClose }) {
  const { selectedClinic, loading } = useSelector((state) => state.clinics);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Clinic details
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedClinic ? (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              {/* Row 1: Clinic Name + Doctor Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  label="Clinic name" 
                  value={selectedClinic.clinicName ?? '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  label="Doctor Name" 
                  value={selectedClinic.doctorName ?? '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>

              {/* Row 2: Registration Number + Role */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  label="Registration number" 
                  value={selectedClinic.registrationNumber ?? '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  label="Role" 
                  value={roleName(selectedClinic)} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>

              {/* Row 3: Consultation Type + Active Status + Establishment Date */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField 
                  label="Consultation type" 
                  value={selectedClinic.consultationType ?? '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField 
                  label="Active status" 
                  value={selectedClinic.isActive !== false ? 'Active' : 'Inactive'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField 
                  label="Establishment Date" 
                  value={selectedClinic.establishmentDate ? new Date(selectedClinic.establishmentDate).toLocaleDateString() : '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>

              {/* Row 4: Phone + Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  label="Phone" 
                  value={selectedClinic.phone ? `${selectedClinic.phone.countryCode} ${selectedClinic.phone.number}` : '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  label="Email" 
                  value={selectedClinic.emailId?.trim() || '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>

              {/* Row 5: Address */}
              <Grid size={{ xs: 12 }}>
                <TextField 
                  label="Address" 
                  value={selectedClinic.address ?? '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>

              {/* Row 6: Specialisation */}
              <Grid size={{ xs: 12 }}>
                <TextField 
                  label="Specialisation" 
                  value={selectedClinic.specialisation?.length ? selectedClinic.specialisation.join(', ') : '—'} 
                  fullWidth 
                  InputProps={{ readOnly: true }} 
                                     />
              </Grid>

              {/* Row 7: Operating Hours */}
              <Grid size={{ xs: 12 }}>
                <OperatingHoursEditor
                  value={selectedClinic.operatingHours}
                  readOnly={true}
                />
              </Grid>

              {/* Row 8: Consents */}
              <Grid size={{ xs: 12 }}>
                <FormGroup row>
                  <FormControlLabel 
                    control={<Checkbox checked={!!selectedClinic.consents?.termsAndConditions} disabled />} 
                    label="Terms and conditions" 
                  />
                  <FormControlLabel 
                    control={<Checkbox checked={!!selectedClinic.consents?.policyTerms} disabled />} 
                    label="Policy terms" 
                  />
                  <FormControlLabel 
                    control={<Checkbox checked={!!selectedClinic.consents?.medicalDisclaimer} disabled />} 
                    label="Medical disclaimer" 
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ py: 2, color: 'text.secondary' }}>No clinic selected.</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
