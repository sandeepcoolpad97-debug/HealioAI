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

const roleName = (admin) => admin?.roleId?.name ?? admin?.roleId ?? '—';

export default function AdminViewDialog({ open, onClose }) {
    const { selectedAdmin, loading } = useSelector((state) => state.admins);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                }}
            >
                Admin details
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : selectedAdmin ? (
                    <Box sx={{ pt: 1 }}>
                        <Grid container spacing={2}>
                            {/* Row 1: Name & Email */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Name"
                                    value={selectedAdmin.name ?? '—'}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Email address"
                                    value={selectedAdmin.email?.trim() ? selectedAdmin.email : '—'}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            {/* Row 2: Gender, Language */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Gender"
                                    value={selectedAdmin.gender ?? '—'}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Language"
                                    value={selectedAdmin.language ?? '—'}
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
                                    value={roleName(selectedAdmin)}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 2 }}>
                                <TextField
                                    label="Country code"
                                    value={selectedAdmin?.phone?.countryCode ?? '—'}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Phone number"
                                    value={selectedAdmin?.phone?.number ?? '—'}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            {/* Row 4: Address, Active status */}
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    label="Address"
                                    value={selectedAdmin.address ?? '—'}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Active status"
                                    value={selectedAdmin.isActive !== false ? 'Active' : 'Inactive'}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            {/* Row 5: Consents */}
                            <Grid size={{ xs: 12 }}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!selectedAdmin.consents?.termsAndConditions}
                                                disabled
                                            />
                                        }
                                        label="Terms and conditions"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!selectedAdmin.consents?.policyTerms}
                                                disabled
                                            />
                                        }
                                        label="Policy terms"
                                    />
                                </FormGroup>
                            </Grid>

                        </Grid>
                    </Box>
                ) : (
                    <Box sx={{ py: 2, color: 'text.secondary' }}>No admin selected.</Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
