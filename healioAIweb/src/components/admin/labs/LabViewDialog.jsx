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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const TEST_CATEGORIES = ['blood_tests', 'urine_tests', 'radiology', 'pathology', 'full_body_checkup'];
const REPORT_DELIVERY = ['pdf', 'in_app'];

const roleName = (l) => l?.roleId?.name ?? l?.roleId ?? '—';

export default function LabViewDialog({ open, onClose }) {
  const { selectedLab, loading } = useSelector((state) => state.labs);

  const testCategories = selectedLab?.services?.testCategories ?? [];
  const homeSampleCollection = selectedLab?.services?.homeSampleCollection ? 'Yes' : 'No';
  const reportDelivery = selectedLab?.services?.reportDeliveryType ?? [];
  const isActive = selectedLab?.isActive !== false ? 'Active' : 'Inactive';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        Lab details
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : selectedLab ? (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Lab name"
                  value={selectedLab.labName ?? '—'}
                  fullWidth
                  InputProps={{ readOnly: true }}
                      
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Registration number"
                  value={selectedLab.registrationNumber ?? '—'}
                  fullWidth
                  InputProps={{ readOnly: true }}
                      
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Role"
                  value={roleName(selectedLab)}
                  fullWidth
                  InputProps={{ readOnly: true }}
                      
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Address"
                  value={selectedLab.address ?? '—'}
                  fullWidth
                  InputProps={{ readOnly: true }}
                      
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Code"
                    value={selectedLab.phone?.countryCode ?? '+91'}
                    sx={{ width: 80 }}
                    InputProps={{ readOnly: true }}
                        
                  />
                  <TextField
                    label="Phone Number"
                    value={selectedLab.phone?.number ?? '—'}
                    fullWidth
                    InputProps={{ readOnly: true }}
                        
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  value={selectedLab.emailId?.trim() || '—'}
                  fullWidth
                  InputProps={{ readOnly: true }}
                      
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth     >
                  <InputLabel>Test categories</InputLabel>
                  <Select
                    multiple
                    value={testCategories}
                    label="Test categories"
                    readOnly
                    renderValue={(selected) => selected.length ? selected.join(', ') : '—'}
                  >
                    {TEST_CATEGORIES.map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth     >
                  <InputLabel>Home sample collection</InputLabel>
                  <Select
                    value={homeSampleCollection}
                    label="Home sample collection"
                    readOnly
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth     >
                  <InputLabel>Report delivery</InputLabel>
                  <Select
                    multiple
                    value={reportDelivery}
                    label="Report delivery"
                    readOnly
                    renderValue={(selected) => selected.length ? selected.join(', ') : '—'}
                  >
                    {REPORT_DELIVERY.map((r) => (
                      <MenuItem key={r} value={r}>{r}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth     >
                  <InputLabel>Active status</InputLabel>
                  <Select
                    value={isActive}
                    label="Active status"
                    readOnly
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox checked={!!selectedLab.consents?.termsAndConditions} readOnly />}
                    label="Terms and conditions"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={!!selectedLab.consents?.policyTerms} readOnly />}
                    label="Policy terms"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={!!selectedLab.consents?.medicalDisclaimer} readOnly />}
                    label="Medical disclaimer"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ py: 2, color: 'text.secondary' }}>No lab selected.</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
